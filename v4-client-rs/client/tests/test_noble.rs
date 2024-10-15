mod env;

#[cfg(feature = "noble")]
mod noble_tests {
    use super::env;
    use env::TestEnv;

    use anyhow::Error;
    use dydx_v4_rust::indexer::Denom;
    use dydx_v4_rust::noble::NobleUsdc;
    use serial_test::serial;

    #[tokio::test]
    #[serial]
    async fn test_noble_get_balance() -> Result<(), Error> {
        let env = TestEnv::testnet().await?;
        let mut noble = env.noble;

        let account = env.wallet.noble().account_offline(0)?;
        let denom = Denom::NobleUsdc;

        let balance = noble
            .get_account_balance(account.address().clone(), &denom)
            .await?;

        assert_eq!(balance.denom, Denom::NobleUsdc.as_ref());

        Ok(())
    }

    #[tokio::test]
    #[serial]
    async fn test_noble_get_balances() -> Result<(), Error> {
        let env = TestEnv::testnet().await?;
        let mut noble = env.noble;

        let account = env.wallet.noble().account_offline(0)?;

        noble
            .get_account_balances(account.address().clone())
            .await?;

        Ok(())
    }

    #[tokio::test]
    #[serial]
    #[ignore]
    async fn test_noble_send_token() -> Result<(), Error> {
        let env = TestEnv::testnet().await?;
        let mut noble = env.noble;

        let mut noble_account = env.wallet.noble().account(0, &mut noble).await?;
        let dydx_account = env.wallet.account_offline(0)?;

        let sender = noble_account.address().clone();
        let recipient = dydx_account.address().clone();
        let source_channel = "channel-33".to_string();

        noble
            .send_token_ibc(
                &mut noble_account,
                sender,
                recipient,
                NobleUsdc::from(1000),
                source_channel,
            )
            .await?;

        Ok(())
    }
}
