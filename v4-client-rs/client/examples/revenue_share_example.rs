//! # dYdX Revenue Share Example

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

const ETH_USD_TICKER: &str = "ETH-USD";
const ETH_USD_PAIR_ID: u32 = 1;

/// Revenue share example demonstrator struct
pub struct RevenueShareExample {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl RevenueShareExample {
    pub async fn connect() -> Result<Self> {
        // Initialize rustls crypto provider
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
            .get_perpetual_market(&ETH_USD_TICKER.into())
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
            .get_perpetual_market(&ETH_USD_TICKER.into())
            .await?;

        let current_block_height = self.client.latest_block_height().await?;

        let size = BigDecimal::from_str("0.01")?;

        // Create builder code parameters
        // builder_address: The address to which the builder fee will be paid
        // fee_ppm: The fee in parts per million (e.g., 10000 = 1%)
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
        tracing::info!("Order ID: {:?}", order_id);

        let tx_hash = self.client.place_order(&mut account, order).await?;
        tracing::info!("Order placed! Transaction hash: {:?}", tx_hash);

        Ok((tx_hash.to_string(), format!("{:?}", order_id)))
    }

    /// Query and display order fills to verify revenue share data
    async fn query_fills(&self) -> Result<()> {
        let account = self.wallet.account_offline(0)?;
        let subaccount = account.subaccount(0)?;

        tracing::info!("Querying recent fills...");

        let fills = self
            .indexer
            .accounts()
            .get_subaccount_fills(
                &subaccount,
                Some(GetFillsOpts {
                    limit: Some(15),
                    created_before_or_at: Some(chrono::Utc::now() - chrono::Duration::days(1)),
                    market: Some(Ticker::from("ETH-USD")),
                    market_type: Some(MarketType::Perpetual),
                    ..Default::default()
                }),
            )
            .await?;

        if fills.is_empty() {
            tracing::warn!("No fills found. Orders may not have been filled yet.");
            return Ok(());
        }

        for (i, fill) in fills.iter().enumerate() {
            tracing::info!("Fill #{}: {:?}", i + 1, fill.id);
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
            } else {
                tracing::info!("  Order Router Address: None");
            }

            if let Some(ref builder_addr) = fill.builder_address {
                tracing::info!("  ✓ Builder Address: {}", builder_addr);
                if let Some(ref builder_fee) = fill.builder_fee {
                    tracing::info!("  ✓ Builder Fee: {}", builder_fee);
                }
            }
        }

        Ok(())
    }

    /// Query revenue share configuration from the node
    async fn query_revenue_share_config(&mut self, test_address: &Address) -> Result<()> {
        tracing::info!("\n=== Querying Revenue Share Configuration ===\n");

        // Query market mapper revenue share params
        match self.client.get_market_mapper_revenue_share_params().await {
            Ok(params) => {
                tracing::info!("Market Mapper Revenue Share Params:");
                tracing::info!("  Address: {}", params.address);
                tracing::info!("  Revenue Share (ppm): {}", params.revenue_share_ppm);
                tracing::info!("  Valid Days: {}", params.valid_days);
            }
            Err(e) => {
                tracing::warn!("Failed to get market mapper revenue share params: {}", e);
            }
        }

        // Query market mapper rev share details for ETH-USD market
        match self
            .client
            .get_market_mapper_rev_share_details(ETH_USD_PAIR_ID)
            .await
        {
            Ok(details) => {
                tracing::info!(
                    "\nMarket Mapper Rev Share Details (Market ID {}):",
                    ETH_USD_PAIR_ID
                );
                tracing::info!("  Expiration timestamp: {}", details.expiration_ts);
            }
            Err(e) => {
                tracing::warn!(
                    "Failed to get market mapper rev share details for market {}: {}",
                    ETH_USD_PAIR_ID,
                    e
                );
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

        // Query order router rev share for a specific address
        match self
            .client
            .get_order_router_rev_share(test_address.clone())
            .await
        {
            Ok(rev_share) => {
                tracing::info!("\nOrder Router Rev Share for address {}:", test_address);
                tracing::info!("  Address: {}", rev_share.address);
                tracing::info!("  Share (ppm): {}", rev_share.share_ppm);
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

        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;

    tracing::info!("=== dYdX Revenue Share Example ===\n");
    tracing::info!("This example demonstrates:");
    tracing::info!("1. Placing orders with order_router_address (revenue share)");
    tracing::info!("2. Placing orders with builder_code_parameters");
    tracing::info!("3. Querying fills to verify revenue share data");
    tracing::info!("4. Querying revenue share configuration from the node\n");

    let mut example = RevenueShareExample::connect().await?;
    let account = example.wallet.account_offline(0)?;
    let account_address = account.address().clone();

    // For demonstration, we'll use a test address as the order router
    // In production, this should be an address that has been voted in via governance
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
    let revshare_order_id = match example
        .place_order_with_revenue_share(&order_router_address)
        .await
    {
        Ok((tx_hash, order_id)) => {
            tracing::info!("✓ Successfully placed order with revenue share");
            tracing::info!("Transaction: {}", tx_hash);
            tracing::info!("Order ID: {}", order_id);
            Some(order_id)
        }
        Err(e) => {
            tracing::error!("Failed to place order with revenue share: {}", e);
            None
        }
    };

    // Wait longer for the order to fill
    tracing::info!("\nWaiting 10 seconds for order to fill...");
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

    // Place order with builder code parameters
    tracing::info!("\n=== Placing Order with Builder Code Parameters ===\n");
    // For demonstration, we'll use a test address as the builder
    // In production, this should be a valid address that will receive builder fees
    let builder_address: Address = "dydx18sukah44zfkjndlhcdmhkjnarl2sevhwf894vh"
        .parse()
        .expect("Valid address");
    let fee_ppm = 5000; // 0.5% fee (5000 parts per million)

    tracing::info!("Builder address: {}", builder_address);
    tracing::info!("Fee (ppm): {}", fee_ppm);

    let builder_order_id = match example
        .place_order_with_builder_code(&builder_address, fee_ppm)
        .await
    {
        Ok((tx_hash, order_id)) => {
            tracing::info!("✓ Successfully placed order with builder code parameters");
            tracing::info!("Transaction: {}", tx_hash);
            tracing::info!("Order ID: {}", order_id);
            Some(order_id)
        }
        Err(e) => {
            tracing::error!("Failed to place order with builder code parameters: {}", e);
            None
        }
    };

    // Wait longer for the order to fill
    tracing::info!("\nWaiting 10 seconds for order to fill...");
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

    // Query fills to verify revenue share data
    tracing::info!("\n=== Querying Fills to Verify Revenue Share ===\n");

    if revshare_order_id.is_some() || builder_order_id.is_some() {
        tracing::info!(
            "Note: Look for fills with order_router_address or builder_address matching our test address"
        );
        tracing::info!("Test address: {}", order_router_address);
    }

    example.query_fills().await?;

    tracing::info!("\n⚠️  Important Notes:");
    tracing::info!("• The fills shown above may be from PREVIOUS orders, not the ones just placed");
    tracing::info!("• Market orders on testnet may take time to fill, or may not fill at all");
    tracing::info!("• To verify YOUR orders filled with revenue share:");
    tracing::info!("  1. Check the indexer UI for your account's recent orders");
    tracing::info!("  2. Look for fills that show order_router_address or builder_address");
    tracing::info!("  3. Match the transaction hashes printed above");

    tracing::info!("\nSee: https://docs.dydx.xyz/interaction/integration/integration-revshare");

    Ok(())
}
