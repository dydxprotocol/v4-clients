use crate::indexer::Denom;
use anyhow::{anyhow as err, Result};
use bigdecimal::{
    num_traits::{FromPrimitive, ToPrimitive},
    rounding::RoundingMode,
    BigDecimal,
};
use cosmrs::{tx::Fee, Coin};

/// Gas ajdustement value to avoid rejected transactions caused by gas understimation.
const GAS_MULTIPLIER: f64 = 1.4;

pub(crate) fn default() -> Fee {
    Fee {
        amount: vec![],
        gas_limit: 0,
        payer: None,
        granter: None,
    }
}

pub(crate) fn calculate(gas_used: u64, denom: &Denom) -> Result<Fee> {
    if let Some(gas_price) = denom.gas_price() {
        let gas_multiplier = BigDecimal::from_f64(GAS_MULTIPLIER)
            .ok_or_else(|| err!("Failed converting gas multiplier to BigDecimal"))?;
        let gas_limit = gas_used * gas_multiplier;
        // Ceil to avoid underestimation
        let amount = (gas_price * &gas_limit).with_scale_round(0, RoundingMode::Up);
        Ok(Fee::from_amount_and_gas(
            Coin {
                amount: amount
                    .to_u128()
                    .ok_or_else(|| err!("Failed converting gas cost to u128"))?,
                denom: denom.clone().try_into()?,
            },
            gas_limit
                .to_u64()
                .ok_or_else(|| err!("Failed converting gas limit to u64"))?,
        ))
    } else {
        Err(err!("{denom:?} cannot be used to cover gas fees"))
    }
}
