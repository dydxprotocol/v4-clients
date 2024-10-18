use anyhow::{anyhow as err, Error, Result};
use chrono::{TimeDelta, Utc};
#[cfg(feature = "faucet")]
use dydx_v4_rust::faucet::FaucetClient;
#[cfg(feature = "noble")]
use dydx_v4_rust::noble::NobleClient;
use dydx_v4_rust::{
    config::ClientConfig,
    indexer::{ClientId, Height, IndexerClient, PerpetualMarket, Ticker},
    node::{Account, Address, NodeClient, OrderBuilder, OrderId, OrderSide, Subaccount, Wallet},
};

const TEST_MNEMONIC: &str = "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake miracle matter bus reopen team ladder lazy list timber render wait";

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
        let path = "tests/mainnet.toml";
        let config = ClientConfig::from_file(path).await?;
        let indexer = IndexerClient::new(config.indexer);
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
}

#[allow(dead_code)]
impl TestnetEnv {
    async fn bootstrap() -> Result<Self> {
        let path = "tests/testnet.toml";
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
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let account = wallet.account(0, &mut node).await?;
        let ticker = Ticker::from("ETH-USD");
        let address = account.address().clone();
        let subaccount = account.subaccount(0)?;
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
}
