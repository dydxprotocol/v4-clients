use crate::indexer::{Denom, Tokenized};
use anyhow::{anyhow as err, Error};
use bigdecimal::{num_traits::ToPrimitive, BigDecimal, One};
use dydx_proto::cosmos_sdk_proto::cosmos::base::v1beta1::Coin as ProtoCoin;

/// USDC Noble token.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NobleUsdc(pub BigDecimal);

impl NobleUsdc {
    const QUANTUMS_ATOMIC_RESOLUTION: i64 = -6;

    /// Create a micro USDC (1e-6) token from an integer.
    pub fn from_quantums(quantums: impl Into<BigDecimal>) -> Self {
        Self(quantums.into() / BigDecimal::new(One::one(), Self::QUANTUMS_ATOMIC_RESOLUTION))
    }

    /// Express a USDC token as an integer.
    pub fn quantize(self) -> BigDecimal {
        self.0 * BigDecimal::new(One::one(), Self::QUANTUMS_ATOMIC_RESOLUTION)
    }

    /// Express a USDC token as a u64.
    pub fn quantize_as_u64(self) -> Result<u64, Error> {
        self.quantize()
            .to_u64()
            .ok_or_else(|| err!("Failed converting USDC value to u64"))
    }
}

impl<T> From<T> for NobleUsdc
where
    T: Into<BigDecimal>,
{
    fn from(value: T) -> Self {
        NobleUsdc(value.into())
    }
}

impl Tokenized for NobleUsdc {
    fn denom(&self) -> Denom {
        Denom::NobleUsdc
    }

    fn coin(&self) -> Result<ProtoCoin, Error> {
        Ok(ProtoCoin {
            amount: self
                .clone()
                .quantize()
                .to_u128()
                .ok_or_else(|| err!("Failed converting Noble USDC value into amount"))?
                .to_string(),
            denom: self.denom().to_string(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn noble_token_parse() {
        let _usdc = NobleUsdc(0.into()).denom();
    }
}
