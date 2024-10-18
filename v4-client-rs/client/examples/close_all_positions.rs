mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    ClientId, IndexerClient, ListPositionsOpts,
    PerpetualPositionResponseObject as PerpetualPosition, PerpetualPositionStatus, Subaccount,
};
use dydx_v4_rust::node::{NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

pub struct OrderPlacer {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl OrderPlacer {
    pub async fn connect() -> Result<Self> {
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
}

async fn get_open_positions(
    indexer: &IndexerClient,
    subaccount: &Subaccount,
) -> Result<Vec<PerpetualPosition>> {
    indexer
        .accounts()
        .list_positions(
            subaccount,
            Some(ListPositionsOpts {
                status: Some(PerpetualPositionStatus::Open),
                ..Default::default()
            }),
        )
        .await
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let mut placer = OrderPlacer::connect().await?;
    let mut account = placer.wallet.account(0, &mut placer.client).await?;

    let subaccount = account.subaccount(0)?;

    let open_positions = get_open_positions(&placer.indexer, &subaccount).await?;
    tracing::info!("Number of open positions: {}", open_positions.len());

    for position in open_positions {
        let market = placer
            .indexer
            .markets()
            .get_perpetual_market(&position.market)
            .await?;
        let ticker = market.ticker.clone();

        // Fully close the position, if open, matching best current market prices
        let tx_hash = placer
            .client
            .close_position(
                &mut account,
                subaccount.clone(),
                market,
                None,
                ClientId::random(),
            )
            .await?;
        tracing::info!("{ticker} position close transaction hash: {:?}", tx_hash);
    }

    tracing::info!(
        "Number of open positions: {}",
        get_open_positions(&placer.indexer, &subaccount)
            .await?
            .len()
    );

    Ok(())
}
