#[cfg(any(feature = "faucet", feature = "noble"))]
use anyhow::anyhow as err;
use anyhow::{Error, Result};
use chrono::{TimeDelta, Utc};
#[cfg(feature = "faucet")]
use dydx::faucet::FaucetClient;
#[cfg(feature = "noble")]
use dydx::noble::NobleClient;
use bigdecimal::BigDecimal;
use dydx::{
    config::ClientConfig,
    indexer::{ClientId, Height, IndexerClient, PerpetualMarket, Ticker},
    node::{Account, Address, NodeClient, OrderBuilder, OrderId, OrderSide, Subaccount, Wallet},
};
use serde::Deserialize;
use tokio::fs;
use tokio::time::{sleep, Duration};
use std::sync::Once;
use std::str::FromStr;

static INIT_CRYPTO: Once = Once::new();

fn init_crypto_provider() {
    INIT_CRYPTO.call_once(|| {
        rustls::crypto::ring::default_provider()
            .install_default()
            .expect("Failed to install default rustls crypto provider");
    });
}

pub enum TestEnv {}

#[allow(dead_code)]
impl TestEnv {
    pub async fn testnet() -> Result<TestnetEnv> {
        TestnetEnv::bootstrap().await
    }

    pub async fn mainnet() -> Result<MainnetEnv> {
        MainnetEnv::bootstrap().await
    }
}

#[allow(dead_code)]
pub struct MainnetEnv {
    pub indexer: IndexerClient,
    pub ticker: Ticker,
}

impl MainnetEnv {
    async fn bootstrap() -> Result<Self> {
        // Initialize rustls crypto provider
        init_crypto_provider();

        let path = "tests/mainnet.toml";
        let config = ClientConfig::from_file(path).await?;
        let indexer = IndexerClient::new(config.indexer);
        // Mainnet tests remain on ETH-USD for now; only testnet is migrated via [test] config.
        let ticker = Ticker::from("ETH-USD");
        Ok(Self { indexer, ticker })
    }
}

#[allow(dead_code)]
pub struct TestnetEnv {
    pub node: NodeClient,
    pub indexer: IndexerClient,
    #[cfg(feature = "faucet")]
    pub faucet: FaucetClient,
    #[cfg(feature = "noble")]
    pub noble: NobleClient,
    pub wallet: Wallet,
    pub account: Account,
    pub address: Address,
    pub subaccount: Subaccount,
    pub ticker: Ticker,
    pub clob_pair_id: u32,
    pub default_subticks: u64,

    pub wallet_2: Wallet,
    pub account_2: Account,
    pub address_2: Address,
    pub subaccount_2: Subaccount,

    // Python test account 1 (used for delegation-related governance checks)
    pub wallet_1: Wallet,
    pub account_1: Account,
    pub address_1: Address,
}

#[derive(Debug, Clone)]
pub struct LiquidityOrders {
    pub buy_order_id: OrderId,
    pub sell_order_id: OrderId,
    pub good_til_block: Height,
}

#[derive(Debug, Deserialize)]
struct TestFileConfig {
    test: TestConfig,
}

#[derive(Debug, Deserialize)]
struct TestConfig {
    market_id: String,
    clob_pair_id: u32,
    default_subticks: u64,
    accounts: TestAccountsConfig,
}

#[derive(Debug, Deserialize)]
struct TestAccountsConfig {
    primary: TestAccountConfig,
    liquidity: TestAccountConfig,
    account_1: TestAccountConfig,
}

#[derive(Debug, Deserialize)]
struct TestAccountConfig {
    mnemonic: String,
}

#[allow(dead_code)]
impl TestnetEnv {
    async fn bootstrap() -> Result<Self> {
        // Initialize rustls crypto provider
        init_crypto_provider();

        let path = "tests/testnet.toml";
        let test_cfg = load_test_config(path).await?;
        let config = ClientConfig::from_file(path).await?;
        let mut node = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        #[cfg(feature = "faucet")]
        let faucet = FaucetClient::new(config.faucet.ok_or_else(|| {
            err!("Configuration file must contain a [faucet] configuration for testing")
        })?);
        #[cfg(feature = "noble")]
        let noble = NobleClient::connect(config.noble.ok_or_else(|| {
            err!("Configuration file must contain a [noble] configuration for testing")
        })?)
        .await?;
        // Primary actor account (mirrors Python test account 3)
        let wallet = Wallet::from_mnemonic(&test_cfg.accounts.primary.mnemonic)?;
        let account = wallet.account(0, &mut node).await?;
        let ticker = Ticker::from(test_cfg.market_id.as_str());
        let address = account.address().clone();
        let subaccount = account.subaccount(0)?;

        // Liquidity actor account (mirrors Python test account 2)
        let wallet_2 = Wallet::from_mnemonic(&test_cfg.accounts.liquidity.mnemonic)?;
        let account_2 = wallet_2.account(0, &mut node).await?;
        let address_2 = account_2.address().clone();
        let subaccount_2 = account_2.subaccount(0)?;

        // Account 1 (mirrors Python DYDX_TEST_MNEMONIC / TEST_ADDRESS)
        let wallet_1 = Wallet::from_mnemonic(&test_cfg.accounts.account_1.mnemonic)?;
        let account_1 = wallet_1.account(0, &mut node).await?;
        let address_1 = account_1.address().clone();

        Ok(Self {
            node,
            indexer,
            #[cfg(feature = "faucet")]
            faucet,
            #[cfg(feature = "noble")]
            noble,
            wallet,
            account,
            address,
            subaccount,
            ticker,
            clob_pair_id: test_cfg.clob_pair_id,
            default_subticks: test_cfg.default_subticks,
            wallet_2,
            account_2,
            address_2,
            subaccount_2,
            wallet_1,
            account_1,
            address_1,
        })
    }

    pub async fn get_market(&self) -> Result<PerpetualMarket> {
        self.indexer
            .markets()
            .get_perpetual_market(&self.ticker)
            .await
    }

    pub async fn get_height(&self) -> Result<Height> {
        Ok(self.indexer.utility().get_height().await?.height)
    }

    pub async fn spawn_order(&mut self) -> Result<OrderId, Error> {
        let market = self.get_market().await?;
        let subaccount = self.account.subaccount(0)?;
        let (id, order) = OrderBuilder::new(market, subaccount)
            .limit(OrderSide::Buy, 1, 1)
            .until(Utc::now() + TimeDelta::seconds(60))
            .long_term()
            .build(ClientId::random())?;
        let tx_res = self.node.place_order(&mut self.account, order).await;
        self.node.query_transaction_result(tx_res).await?;
        Ok(id)
    }

    /// Place bid/ask liquidity orders from account 2, similar to Python `liquidity_setup`.
    ///
    /// The orders are priced "safely" away from best bid/ask (or oracle fallback) to avoid immediate
    /// execution, and can be cleaned up via `cleanup_liquidity_orders`.
    pub async fn setup_liquidity_orders(&mut self) -> Result<LiquidityOrders> {
        let market = self.get_market().await?;
        let oracle_price = market
            .oracle_price
            .clone()
            .ok_or_else(|| err!("Market oracle price required for liquidity setup"))?
            .0;

        // Fetch orderbook to get current bid/ask (best-effort; fallback to oracle-only pricing).
        let (best_bid, best_ask): (Option<BigDecimal>, Option<BigDecimal>) = match self
            .indexer
            .markets()
            .get_perpetual_market_orderbook(&self.ticker)
            .await
        {
            Ok(ob) => (
                ob.bids.first().map(|x| x.price.0.clone()),
                ob.asks.first().map(|x| x.price.0.clone()),
            ),
            Err(_) => (None, None),
        };

        // Start at oracle ±0.5%
        let buy_mult_num = BigDecimal::from(995u32);
        let sell_mult_num = BigDecimal::from(1005u32);
        let denom = BigDecimal::from(1000u32);
        let mut buy_price = oracle_price.clone() * buy_mult_num.clone() / denom.clone();
        let mut sell_price = oracle_price.clone() * sell_mult_num.clone() / denom.clone();

        // If BUY would cross the best ask, shift down from ask
        if let Some(ask) = best_ask {
            if buy_price >= ask {
                buy_price = ask * buy_mult_num.clone() / denom.clone();
            }
        }
        // If SELL would cross the best bid, shift up from bid
        if let Some(bid) = best_bid {
            if sell_price <= bid {
                sell_price = bid * sell_mult_num.clone() / denom.clone();
            }
        }

        // Use node's latest_block_height instead of indexer's get_height to avoid sync issues
        // Use a conservative offset (10 blocks) to account for block production delays
        let height = self.node.latest_block_height().await?;
        let good_til_block = height.ahead(10);

        // Place SELL + BUY limit orders on liquidity account (account 2)
        let liquidity_subaccount = self.account_2.subaccount(0)?;
        let liquidity_size = BigDecimal::from_str("1000")?;

        // Place SELL order first
        let (sell_order_id, sell_order) = OrderBuilder::new(market.clone(), liquidity_subaccount)
            .limit(OrderSide::Sell, sell_price, liquidity_size.clone())
            .until(good_til_block.clone())
            .build(ClientId::random())?;
        let sell_tx_result = self.node.place_order(&mut self.account_2, sell_order).await;
        // Check if order was placed successfully, then query (best-effort)
        if let Ok(tx_hash) = sell_tx_result {
            let _ = self.node.query_transaction_result(Ok(tx_hash)).await;
        }
        // Wait a bit for the order to be processed (mirrors Python's asyncio.sleep(5))
        sleep(Duration::from_secs(5)).await;

        // Refresh account sequence after placing sell order to ensure buy order uses correct sequence
        self.account_2 = self.wallet_2.account(0, &mut self.node).await?;
        let liquidity_subaccount = self.account_2.subaccount(0)?;

        // Fetch fresh height for BUY order since several blocks may have passed during the sleep
        let height = self.node.latest_block_height().await?;
        let good_til_block = height.ahead(10);

        // Place BUY order
        let (buy_order_id, buy_order) = OrderBuilder::new(market, liquidity_subaccount)
            .limit(OrderSide::Buy, buy_price, liquidity_size)
            .until(good_til_block.clone())
            .build(ClientId::random())?;
        let buy_tx_result = self.node.place_order(&mut self.account_2, buy_order).await;
        // Check if order was placed successfully, then query (best-effort)
        if let Ok(tx_hash) = buy_tx_result {
            let _ = self.node.query_transaction_result(Ok(tx_hash)).await;
        }
        // Wait a bit for the order to be processed
        sleep(Duration::from_secs(5)).await;

        Ok(LiquidityOrders {
            buy_order_id,
            sell_order_id,
            good_til_block,
        })
    }

    /// Cancel previously created liquidity orders (best-effort, like Python cleanup).
    pub async fn cleanup_liquidity_orders(&mut self, orders: LiquidityOrders) -> Result<()> {
        // Refresh account sequence before each cancel (mirrors Python `get_wallet` refresh).
        self.account_2 = self.wallet_2.account(0, &mut self.node).await?;
        let until_block = orders.good_til_block.ahead(10);
        let cancel_buy = self
            .node
            .cancel_order(&mut self.account_2, orders.buy_order_id, until_block)
            .await;
        // Best-effort cleanup: ignore failures (order may be filled/cancelled already).
        let _ = self.node.query_transaction_result(cancel_buy).await;

        self.account_2 = self.wallet_2.account(0, &mut self.node).await?;
        let until_block = orders.good_til_block.ahead(10);
        let cancel_sell = self
            .node
            .cancel_order(&mut self.account_2, orders.sell_order_id, until_block)
            .await;
        let _ = self.node.query_transaction_result(cancel_sell).await;

        Ok(())
    }
}

async fn load_test_config(path: &str) -> Result<TestConfig> {
    let toml_str = fs::read_to_string(path).await?;
    let cfg: TestFileConfig = toml::from_str(&toml_str)?;
    Ok(cfg.test)
}
