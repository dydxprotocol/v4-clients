//! # dYdX Order Router Revenue Share Example
//!
//! This example demonstrates Order Router Revenue Share functionality on dYdX v4.
//!
//! ## What is Order Router Revenue Share?
//!
//! Order Router Rev Share enables third-party order routers to direct orders to dYdX
//! and earn a portion of the trading fees (maker and taker). The revenue share,
//! specified in parts per million (ppm), must be voted in via Governance.
//!
//! ## Features Demonstrated
//!
//! 1. **Place orders with `order_router_address`**
//!    - Set the order router address on orders
//!    - Revenue is distributed based on filled orders
//!
//! 2. **Query Revenue Share Configuration**
//!    - Query order router revenue share by address
//!    - Query market mapper revenue share parameters
//!    - Query unconditional revenue share config
//!
//! 3. **Verify Revenue Share in Fills**
//!    - Check fills for `order_router_address`
//!    - Verify `order_router_fee` amounts
//!
//! ## Usage
//!
//! ```bash
//! cargo run --example revenue_share_example
//! ```
//!
//! ## Important Notes
//!
//! - Order router addresses must be voted in via governance before they can receive revenue share
//! - Affiliate revenue takes priority in the distribution hierarchy
//! - If there is an active affiliate split that hasn't reached its maximum within a 30-day
//!   rolling window, no revenue will be shared with the order router
//!
//! ## References
//!
//! - [Order Router Revenue Share Documentation](https://docs.dydx.xyz/interaction/integration/integration-revshare)

mod support;

use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx::config::ClientConfig;
use dydx::indexer::{ClientId, GetFillsOpts, IndexerClient, MarketType, Ticker};
use dydx::node::{Address, NodeClient, OrderBuilder, OrderSide, Wallet};
use dydx_proto::dydxprotocol::clob::order::TimeInForce;
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;

const TICKER: &str = "TRX-USD";

/// Order Router Revenue Share example
pub struct RevenueShareExample {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl RevenueShareExample {
    pub async fn connect() -> Result<Self> {
        support::crypto::init_crypto_provider();

        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self {
            client,
            indexer,
            wallet,
        })
    }

    /// Place an order with order router revenue share
    async fn place_order_with_revenue_share(
        &mut self,
        order_router_address: &Address,
    ) -> Result<(String, String)> {
        let mut account = self.wallet.account(0, &mut self.client).await?;
        let subaccount = account.subaccount(0)?;

        let market = self
            .indexer
            .markets()
            .get_perpetual_market(&Ticker::from(TICKER))
            .await?;

        let current_block_height = self.client.latest_block_height().await?;

        let size = BigDecimal::from_str("0.01")?;
        let client_id: ClientId = rand::random::<u32>().into();
        let (order_id, order) = OrderBuilder::new(market, subaccount)
            .market(OrderSide::Buy, size)
            .reduce_only(false)
            .price(100) // market-order slippage protection price
            .time_in_force(TimeInForce::Unspecified)
            .until(current_block_height.ahead(20))
            .order_router_address(order_router_address.clone())
            .build(client_id)?;

        tracing::info!(
            "Placing order with order_router_address: {}",
            order_router_address
        );
        tracing::info!("Order ID: {:?}", order_id);

        let tx_hash = self.client.place_order(&mut account, order).await?;
        tracing::info!("Order placed! Transaction hash: {:?}", tx_hash);

        Ok((tx_hash.to_string(), format!("{:?}", order_id)))
    }

    /// Query and display order fills to verify revenue share data
    async fn query_fills(&self) -> Result<()> {
        let account = self.wallet.account_offline(0)?;
        let subaccount = account.subaccount(0)?;

        tracing::info!("Querying recent fills for {TICKER}...");

        let fills = self
            .indexer
            .accounts()
            .get_subaccount_fills(
                &subaccount,
                Some(GetFillsOpts {
                    limit: Some(15),
                    created_before_or_at: Some(chrono::Utc::now()),
                    market: Some(Ticker::from(TICKER)),
                    market_type: Some(MarketType::Perpetual),
                    ..Default::default()
                }),
            )
            .await?;

        if fills.is_empty() {
            tracing::warn!("No fills found for {TICKER}.");
            return Ok(());
        }

        let mut found_revenue_share = false;
        for (i, fill) in fills.iter().enumerate() {
            tracing::info!("\nFill #{}: {:?}", i + 1, fill.id);
            tracing::info!("  Market: {}", fill.market);
            tracing::info!("  Side: {:?}", fill.side);
            tracing::info!("  Size: {}", fill.size);
            tracing::info!("  Price: {}", fill.price);
            tracing::info!("  Fee: {}", fill.fee);
            tracing::info!("  Affiliate Rev Share: {}", fill.affiliate_rev_share);

            if let Some(ref order_router_addr) = fill.order_router_address {
                tracing::info!("  ✓ Order Router Address: {}", order_router_addr);
                if let Some(ref order_router_fee) = fill.order_router_fee {
                    tracing::info!("  ✓ Order Router Fee: {}", order_router_fee);
                }
                found_revenue_share = true;
            } else {
                tracing::info!("  Order Router Address: None");
            }
        }

        if !found_revenue_share {
            tracing::warn!(
                "\nNo fills found with order_router_address. Orders may not have filled yet."
            );
        }

        Ok(())
    }

    /// Query revenue share configuration from the node
    async fn query_revenue_share_config(&mut self, test_address: &Address) -> Result<()> {
        tracing::info!("\n=== Querying Revenue Share Configuration ===\n");

        // Query order router rev share for a specific address
        match self
            .client
            .get_order_router_rev_share(test_address.clone())
            .await
        {
            Ok(rev_share) => {
                tracing::info!("Order Router Rev Share for address {}:", test_address);
                tracing::info!("  Address: {}", rev_share.address);
                tracing::info!("  Share (ppm): {}", rev_share.share_ppm);
                tracing::info!(
                    "  This means the order router receives {}% of trading fees",
                    rev_share.share_ppm as f64 / 10000.0
                );
            }
            Err(e) => {
                tracing::warn!(
                    "Order router rev share not configured for address {}: {}",
                    test_address,
                    e
                );
                tracing::info!(
                    "Note: This is expected if the address hasn't been voted in via governance"
                );
            }
        }

        // Query market mapper revenue share params
        match self.client.get_market_mapper_revenue_share_params().await {
            Ok(params) => {
                tracing::info!("\nMarket Mapper Revenue Share Params:");
                tracing::info!("  Address: {}", params.address);
                tracing::info!("  Revenue Share (ppm): {}", params.revenue_share_ppm);
                tracing::info!("  Valid Days: {}", params.valid_days);
            }
            Err(e) => {
                tracing::warn!("Failed to get market mapper revenue share params: {}", e);
            }
        }

        // Query unconditional rev share config
        match self.client.get_unconditional_rev_share_config().await {
            Ok(config) => {
                tracing::info!("\nUnconditional Rev Share Config:");
                for (i, recipient) in config.configs.iter().enumerate() {
                    tracing::info!("  Recipient #{}", i + 1);
                    tracing::info!("    Address: {}", recipient.address);
                    tracing::info!("    Share (ppm): {}", recipient.share_ppm);
                }
            }
            Err(e) => {
                tracing::warn!("Failed to get unconditional rev share config: {}", e);
            }
        }

        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;

    tracing::info!("=== dYdX Order Router Revenue Share Example ===\n");
    tracing::info!("This example demonstrates:");
    tracing::info!("1. Placing orders with order_router_address (revenue share)");
    tracing::info!("2. Querying revenue share configuration");
    tracing::info!("3. Verifying revenue share in fills\n");

    let mut example = RevenueShareExample::connect().await?;
    let account = example.wallet.account_offline(0)?;
    let account_address = account.address().clone();

    // This address should be voted in via governance to receive revenue share
    // For demonstration, we're using a testnet address that has been configured
    let order_router_address: Address = "dydx18sukah44zfkjndlhcdmhkjnarl2sevhwf894vh"
        .parse()
        .expect("Valid address");

    tracing::info!("Using account address: {} (subaccount 0)", account_address);
    tracing::info!("Using order router address: {}\n", order_router_address);

    // Query current revenue share configuration
    example
        .query_revenue_share_config(&order_router_address)
        .await?;

    // Place order with revenue share
    tracing::info!("\n=== Placing Order with Revenue Share ===\n");
    let _revshare_order = match example
        .place_order_with_revenue_share(&order_router_address)
        .await
    {
        Ok((tx_hash, order_id)) => {
            tracing::info!("✓ Successfully placed order with revenue share");
            tracing::info!("Transaction: {}", tx_hash);
            tracing::info!("Order ID: {}", order_id);
            Some((tx_hash, order_id))
        }
        Err(e) => {
            tracing::error!("Failed to place order with revenue share: {}", e);
            None
        }
    };

    // Wait for the order to fill
    tracing::info!("\nWaiting 10 seconds for order to fill...");
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

    // Query fills to verify revenue share data
    tracing::info!("\n=== Querying Fills to Verify Revenue Share ===\n");
    tracing::info!(
        "Looking for fills with order_router_address: {}\n",
        order_router_address
    );

    example.query_fills().await?;

    Ok(())
}
