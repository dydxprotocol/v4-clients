mod env;
use env::TestEnv;

use anyhow::{anyhow as err, Error};
use dydx_v4_rust::indexer::*;
use tokio::time::{sleep, Duration, Instant};

#[tokio::test]
async fn test_indexer_sock_trades() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().trades(&env.ticker, false).await?;

    match feed.recv().await {
        Some(TradesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Trades event is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_trades_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().trades(&env.ticker, false).await?;

    match feed.recv().await {
        Some(TradesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Trades event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(TradesMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Trades update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_trades_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().trades(&env.ticker, true).await?;

    match feed.recv().await {
        Some(TradesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Trades event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(TradesMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Trades update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_orders() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().orders(&env.ticker, false).await?;

    match feed.recv().await {
        Some(OrdersMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Orders event is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_orders_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().orders(&env.ticker, false).await?;

    match feed.recv().await {
        Some(OrdersMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Orders event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(OrdersMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Orders update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_orders_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().orders(&env.ticker, true).await?;

    match feed.recv().await {
        Some(OrdersMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Orders event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(OrdersMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Orders update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_markets() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().markets(false).await?;

    match feed.recv().await {
        Some(MarketsMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Markets event is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_markets_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().markets(false).await?;

    match feed.recv().await {
        Some(MarketsMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Markets event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(MarketsMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Markets update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_markets_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().markets(true).await?;

    match feed.recv().await {
        Some(MarketsMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Markets event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(MarketsMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Markets update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_blockheight() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().block_height(false).await?;

    match feed.recv().await {
        Some(BlockHeightMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the BlockHeight initial event is received: {other:?}"
            ));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_blockheight_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().block_height(false).await?;

    match feed.recv().await {
        Some(BlockHeightMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the BlockHeight initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(BlockHeightMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the BlockHeight update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_blockheight_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env.indexer.feed().block_height(true).await?;

    match feed.recv().await {
        Some(BlockHeightMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the BlockHeight initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(BlockHeightMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the BlockHeight update is received: {other:?}"));
        }
    }

    Ok(())
}

// Candles
#[tokio::test]
async fn test_indexer_sock_candles() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .candles(&env.ticker, CandleResolution::M1, false)
        .await?;

    match feed.recv().await {
        Some(CandlesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Candles event is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_candles_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .candles(&env.ticker, CandleResolution::M1, false)
        .await?;

    match feed.recv().await {
        Some(CandlesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Candles event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(CandlesMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Candles update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_candles_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .candles(&env.ticker, CandleResolution::M1, true)
        .await?;

    match feed.recv().await {
        Some(CandlesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Candles event is received: {other:?}"));
        }
    }

    match feed.recv().await {
        Some(CandlesMessage::Update(m)) => {
            println!("{:?}", m);
        }
        other => {
            return Err(err!("Not the Candles update is received: {other:?}"));
        }
    }

    Ok(())
}

// Subaccounts
#[tokio::test]
async fn test_indexer_sock_subaccounts() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .subaccounts(env.subaccount, false)
        .await?;

    match feed.recv().await {
        Some(SubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the Subaccounts initial event is received: {other:?}"
            ));
        }
    }

    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_indexer_sock_subaccounts_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .subaccounts(env.subaccount, false)
        .await?;

    match feed.recv().await {
        Some(SubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the Subaccounts initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(SubaccountsMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Subaccounts update is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_indexer_sock_subaccounts_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env.indexer.feed().subaccounts(env.subaccount, true).await?;

    match feed.recv().await {
        Some(SubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the Subaccounts initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(SubaccountsMessage::Update(_)) => {}
        other => {
            return Err(err!("Not the Subaccounts update is received: {other:?}"));
        }
    }

    Ok(())
}

// Parent subaccounts
#[tokio::test]
async fn test_indexer_sock_parentsubaccounts() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .parent_subaccounts(env.subaccount.parent(), false)
        .await?;

    match feed.recv().await {
        Some(ParentSubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the ParentSubaccounts initial event is received: {other:?}"
            ));
        }
    }

    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_indexer_sock_parentsubaccounts_with_updates() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .parent_subaccounts(env.subaccount.parent(), false)
        .await?;

    match feed.recv().await {
        Some(ParentSubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the ParentSubaccounts initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(ParentSubaccountsMessage::Update(_)) => {}
        other => {
            return Err(err!(
                "Not the ParentSubaccounts update is received: {other:?}"
            ));
        }
    }

    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_indexer_sock_parentsubaccounts_with_batched_updates() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let mut feed = env
        .indexer
        .feed()
        .parent_subaccounts(env.subaccount.parent(), true)
        .await?;

    match feed.recv().await {
        Some(ParentSubaccountsMessage::Initial(_)) => {}
        other => {
            return Err(err!(
                "Not the ParentSubaccounts initial event is received: {other:?}"
            ));
        }
    }

    match feed.recv().await {
        Some(ParentSubaccountsMessage::Update(_)) => {}
        other => {
            return Err(err!(
                "Not the ParentSubaccounts update is received: {other:?}"
            ));
        }
    }

    Ok(())
}

// Misc
struct Feeder<T: TryFrom<FeedMessage>> {
    feed: Feed<T>,
    n_init: usize,
    n_upd: usize,
}

impl<T: TryFrom<FeedMessage>> Feeder<T> {
    fn new(feed: Feed<T>) -> Self {
        Self {
            feed,
            n_init: 0,
            n_upd: 0,
        }
    }
}

#[tokio::test]
async fn test_indexer_sock_handle_several_feeds() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;

    let mut trades = Feeder::new(env.indexer.feed().trades(&env.ticker, false).await?);
    let mut orders = Feeder::new(env.indexer.feed().orders(&env.ticker, false).await?);
    let mut markets = Feeder::new(env.indexer.feed().markets(false).await?);
    let mut candles = Feeder::new(
        env.indexer
            .feed()
            .candles(&env.ticker, CandleResolution::M1, false)
            .await?,
    );

    let start = Instant::now();
    let duration = Duration::from_secs(20);
    while start.elapsed() < duration {
        tokio::select! {
            Some(msg) = trades.feed.recv() => {
                match msg {
                    TradesMessage::Initial(_) => { trades.n_init += 1; },
                    TradesMessage::Update(_) => { trades.n_upd += 1; },
                }
            }
            Some(msg) = orders.feed.recv() => {
                match msg {
                    OrdersMessage::Initial(_) => { orders.n_init += 1; },
                    OrdersMessage::Update(_) => { orders.n_upd += 1; },
                }
            }
            Some(msg) = markets.feed.recv() => {
                match msg {
                    MarketsMessage::Initial(_) => { markets.n_init += 1; },
                    MarketsMessage::Update(_) => { markets.n_upd += 1; },
                }
            }
            Some(msg) = candles.feed.recv() => {
                match msg {
                    CandlesMessage::Initial(_) => { candles.n_init += 1; },
                    CandlesMessage::Update(_) => { candles.n_upd += 1; },
                }
            }
            _ = sleep(Duration::from_millis(200)) => {
                continue;
            }
        }
    }

    assert!(trades.n_init == 1);
    assert!(orders.n_init == 1);
    assert!(markets.n_init == 1);
    assert!(candles.n_init == 1);
    assert!(trades.n_upd + orders.n_upd + markets.n_upd + candles.n_upd > 0);

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_resub_protection() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;
    let mut feed0 = env
        .indexer
        .feed()
        .candles(&env.ticker, CandleResolution::M1, false)
        .await?;

    let feed1 = env
        .indexer
        .feed()
        .candles(&env.ticker, CandleResolution::M1, false)
        .await;
    match feed1 {
        Err(FeedError::Resubscription) => {}
        _ => return Err(err!("Expected Resubscription error")),
    }

    match feed0.recv().await {
        Some(CandlesMessage::Initial(_)) => {}
        other => {
            return Err(err!("Not the Candles event is received: {other:?}"));
        }
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_sock_rapid_requests() -> Result<(), Error> {
    let mut env = TestEnv::mainnet().await?;

    for _ in 0..5 {
        env.indexer.feed().trades(&env.ticker, false).await?;
        env.indexer.feed().orders(&env.ticker, false).await?;
        env.indexer.feed().markets(false).await?;
        env.indexer
            .feed()
            .candles(&env.ticker, CandleResolution::M1, false)
            .await?;
    }
    let mut trades = Feeder::new(env.indexer.feed().trades(&env.ticker, false).await?);
    let mut orders = Feeder::new(env.indexer.feed().orders(&env.ticker, false).await?);
    let mut markets = Feeder::new(env.indexer.feed().markets(false).await?);
    let mut candles = Feeder::new(
        env.indexer
            .feed()
            .candles(&env.ticker, CandleResolution::M1, false)
            .await?,
    );

    let start = Instant::now();
    let duration = Duration::from_secs(10);
    while start.elapsed() < duration {
        tokio::select! {
            Some(TradesMessage::Update(_)) = trades.feed.recv() => {
                trades.n_upd += 1;
            }
            Some(OrdersMessage::Update(_)) = orders.feed.recv() => {
                orders.n_upd += 1;
            }
            Some(MarketsMessage::Update(_)) = markets.feed.recv() => {
                markets.n_upd += 1;
            }
            Some(CandlesMessage::Update(_)) = candles.feed.recv() => {
                candles.n_upd += 1;
            }
            _ = sleep(Duration::from_millis(200)) => {
                continue;
            }
        }
    }

    assert!(trades.n_upd + orders.n_upd + markets.n_upd + candles.n_upd > 0);

    Ok(())
}
