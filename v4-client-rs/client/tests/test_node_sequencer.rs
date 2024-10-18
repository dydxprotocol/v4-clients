mod env;
use env::TestEnv;

use anyhow::Error;
use dydx_v4_rust::node::sequencer::*;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn test_node_sequencer_query() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;

    let seqnum_before = env.account.sequence_number();

    // account.sequence_number() holds the correct and next sequence number to be used.
    // We spawn two orders because wallet.account() produces an account with an already
    // correct and updated sequence number.
    // In the first order this value should not change, changing only then in the second order.
    env.spawn_order().await?;
    env.spawn_order().await?;

    let seqnum_after = env.account.sequence_number();

    assert_eq!(seqnum_after, seqnum_before + 1);

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_sequencer_incremental() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    let address = env.account.address().clone();
    let sequencer = IncrementalSequencer::new(&[(address, env.account.sequence_number())]);
    env.node.with_sequencer(sequencer);

    let seqnum_before = env.account.sequence_number();

    env.spawn_order().await?;
    env.spawn_order().await?;

    let seqnum_after = env.account.sequence_number();

    assert_eq!(seqnum_after, seqnum_before + 1);

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_sequencer_timestamp() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;
    env.node.with_sequencer(TimestamperSequencer);

    let seqnum_before = env.account.sequence_number();

    env.spawn_order().await?;
    env.spawn_order().await?;
    env.spawn_order().await?;

    let seqnum_after = env.account.sequence_number();

    assert!(seqnum_after == seqnum_before);

    Ok(())
}
