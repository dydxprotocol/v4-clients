//! # dYdX Builder Code Parameters Example
//!
//! This example demonstrates Builder Code Parameters functionality on dYdX v4.
//!
//! ## What are Builder Code Parameters?
//!
//! Builder Code Parameters allow builders/partners to specify an additional fee
//! for providing their service. This fee is enforced on the order and paid out
//! in the event of an order fill, ON TOP of the regular trading fees.
//!
//! ## Features Demonstrated
//!
//! 1. **Place orders with `builder_code_parameters`**
//!    - Set builder_address (who receives the fee)
//!    - Set fee_ppm (fee in parts per million)
//!
//! 2. **Verify Builder Fees in Fills**
//!    - Check fills for `builder_address`
//!    - Verify `builder_fee` amounts
//!
//! ## Usage
//!
//! ```bash
//! cargo run --example builder_code_example
//! ```
//!
//! ## Important Notes
//!
//! - Builder fees are ADDITIONAL fees on top of regular trading fees
//! - fee_ppm is specified in parts per million (10000 = 1%)
//! - The fee is paid to builder_address when the order fills
//!
//! ## References
//!
//! - [Order Types Documentation](https://docs.dydx.xyz/concepts/trading/orders)

mod support;

use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx::config::ClientConfig;
use dydx::indexer::{ClientId, GetFillsOpts, IndexerClient, MarketType, Ticker};
use dydx::node::{Address, NodeClient, OrderBuilder, OrderSide, Wallet};
use dydx_proto::dydxprotocol::clob::order::TimeInForce;
use dydx_proto::dydxprotocol::clob::BuilderCodeParameters;
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;

const TICKER: &str = "BTC-USD";

/// Builder Code Parameters example
pub struct BuilderCodeExample {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl BuilderCodeExample {
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

    /// Place an order with builder code parameters
    async fn place_order_with_builder_code(
        &mut self,
        builder_address: &Address,
        fee_ppm: u32,
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

        // Create builder code parameters
        // builder_address: The address to which the builder fee will be paid
        // fee_ppm: The additional fee in parts per million (e.g., 10000 = 1%)
        let builder_params = BuilderCodeParameters {
            builder_address: builder_address.to_string(),
            fee_ppm,
        };

        let client_id: ClientId = rand::random::<u32>().into();
        let (order_id, order) = OrderBuilder::new(market, subaccount)
            .market(OrderSide::Sell, size)
            .reduce_only(false)
            .price(10000) // market-order slippage protection price
            .time_in_force(TimeInForce::Unspecified)
            .until(current_block_height.ahead(20))
            .builder_code_parameters(builder_params)
            .build(client_id)?;

        tracing::info!(
            "Placing order with builder_address: {} (fee_ppm: {})",
            builder_address,
            fee_ppm
        );
        tracing::info!(
            "This adds a {}% fee on top of regular trading fees",
            fee_ppm as f64 / 10000.0
        );
        tracing::info!("Order ID: {:?}", order_id);

        let tx_hash = self.client.place_order(&mut account, order).await?;
        tracing::info!("Order placed! Transaction hash: {:?}", tx_hash);

        Ok((tx_hash.to_string(), format!("{:?}", order_id)))
    }

    /// Query and display order fills to verify builder code data
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

        let mut found_builder_code = false;
        for (i, fill) in fills.iter().enumerate() {
            tracing::info!("\nFill #{}: {:?}", i + 1, fill.id);
            tracing::info!("  Market: {}", fill.market);
            tracing::info!("  Side: {:?}", fill.side);
            tracing::info!("  Size: {}", fill.size);
            tracing::info!("  Price: {}", fill.price);
            tracing::info!("  Regular Fee: {}", fill.fee);

            if let Some(ref builder_addr) = fill.builder_address {
                tracing::info!("  ✓ Builder Address: {}", builder_addr);
                if let Some(ref builder_fee) = fill.builder_fee {
                    tracing::info!("  ✓ Builder Fee (additional): {}", builder_fee);
                }
                found_builder_code = true;
            } else {
                tracing::info!("  Builder Address: None");
            }
        }

        if !found_builder_code {
            tracing::warn!("\nNo fills found with builder_address. Order may not have filled yet.");
        }

        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;

    tracing::info!("=== dYdX Builder Code Parameters Example ===\n");
    tracing::info!("This example demonstrates:");
    tracing::info!("1. Placing orders with builder_code_parameters");
    tracing::info!("2. Setting builder fees as additional charges");
    tracing::info!("3. Verifying builder fees in fills\n");

    let mut example = BuilderCodeExample::connect().await?;
    let account = example.wallet.account_offline(0)?;
    let account_address = account.address().clone();

    // This address will receive the builder fees
    let builder_address: Address = "dydx18sukah44zfkjndlhcdmhkjnarl2sevhwf894vh"
        .parse()
        .expect("Valid address");
    let fee_ppm = 5000; // 0.5% fee (5000 parts per million)

    tracing::info!("Using account address: {} (subaccount 0)", account_address);
    tracing::info!("Using builder address: {}", builder_address);
    tracing::info!(
        "Builder fee: {} ppm ({}%)\n",
        fee_ppm,
        fee_ppm as f64 / 10000.0
    );

    // Place order with builder code parameters
    tracing::info!("=== Placing Order with Builder Code Parameters ===\n");
    let _builder_order = match example
        .place_order_with_builder_code(&builder_address, fee_ppm)
        .await
    {
        Ok((tx_hash, order_id)) => {
            tracing::info!("✓ Successfully placed order with builder code parameters");
            tracing::info!("Transaction: {}", tx_hash);
            tracing::info!("Order ID: {}", order_id);
            Some((tx_hash, order_id))
        }
        Err(e) => {
            tracing::error!("Failed to place order with builder code parameters: {}", e);
            None
        }
    };

    // Wait for the order to fill
    tracing::info!("\nWaiting 10 seconds for order to fill...");
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

    // Query fills to verify builder code data
    tracing::info!("\n=== Querying Fills to Verify Builder Code ===\n");
    tracing::info!(
        "Looking for fills with builder_address: {}\n",
        builder_address
    );

    example.query_fills().await?;

    Ok(())
}
