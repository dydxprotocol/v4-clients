mod env;

#[cfg(feature = "faucet")]
mod faucet_tests {
    use super::env;
    use env::TestEnv;

    use anyhow::Error;
    use dydx_v4_rust::indexer::Usdc;

    const FILL_AMOUNT: u64 = 1_000_000;

    #[tokio::test]
    #[ignore]
    async fn test_faucet_fill() -> Result<(), Error> {
        let env = TestEnv::testnet().await?;
        let faucet = env.faucet;
        let subaccount = env.account.subaccount(0)?;

        println!(
            "before equity: {:?}",
            env.indexer
                .accounts()
                .get_subaccount(&subaccount)
                .await?
                .equity
        );
        faucet.fill(&subaccount, &Usdc(FILL_AMOUNT.into())).await?;
        println!(
            "after equity: {:?}",
            env.indexer
                .accounts()
                .get_subaccount(&subaccount)
                .await?
                .equity
        );

        Ok(())
    }
}
