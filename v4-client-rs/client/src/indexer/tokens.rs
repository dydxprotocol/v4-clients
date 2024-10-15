use crate::indexer::Denom;
use anyhow::{anyhow as err, Error};
use bigdecimal::{num_traits::ToPrimitive, BigDecimal, One};
use derive_more::{Deref, DerefMut, From};
use v4_proto_rs::cosmos_sdk_proto::cosmos::base::v1beta1::Coin as ProtoCoin;

/// USDC token.
#[derive(Debug, Deref, DerefMut, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Usdc(pub BigDecimal);

impl Usdc {
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

impl<T> From<T> for Usdc
where
    T: Into<BigDecimal>,
{
    fn from(value: T) -> Self {
        Usdc(value.into())
    }
}

/// Token.
pub enum Token {
    /// USDC.
    Usdc(Usdc),
    /// dYdX native token.
    Dydx(BigDecimal),
    /// dYdX testnet native token.
    DydxTnt(BigDecimal),
}

/// An entity which can be operated as a token.
pub trait Tokenized {
    /// Gets Token [`Denom`].
    fn denom(&self) -> Denom;

    /// Convert to Cosmos [`Coin`](ProtoCoin).
    fn coin(&self) -> Result<ProtoCoin, Error>;
}

impl Tokenized for Token {
    fn denom(&self) -> Denom {
        match self {
            Self::Usdc(_) => Denom::Usdc,
            Self::Dydx(_) => Denom::Dydx,
            Self::DydxTnt(_) => Denom::DydxTnt,
        }
    }

    fn coin(&self) -> Result<ProtoCoin, Error> {
        let amount_res = match self {
            Self::Usdc(usdc) => usdc.clone().quantize().to_u128(),
            Self::Dydx(d) => d.to_u128(),
            Self::DydxTnt(d) => d.to_u128(),
        };
        Ok(ProtoCoin {
            amount: amount_res
                .ok_or_else(|| err!("Failed converting dYdX testnet token value into amount"))?
                .to_string(),
            denom: self.denom().to_string(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    fn bigdecimal(val: &str) -> BigDecimal {
        BigDecimal::from_str(val).expect("Failed converting str into BigDecimal")
    }

    #[test]
    fn token_quantums_to_usdc() {
        let quantums = bigdecimal("20_000_000");
        let usdc = Usdc::from_quantums(quantums);
        let expected = bigdecimal("20");
        assert_eq!(usdc.0, expected);
    }

    #[test]
    fn token_usdc_to_quantums() {
        let usdc = bigdecimal("20");
        let quantums = Usdc::from(usdc).quantize();
        let expected = bigdecimal("20_000_000");
        assert_eq!(quantums, expected);
    }

    #[test]
    fn token_denom_parse() {
        // Test if hardcoded denomination is parsed correctly
        let _usdc = Token::Usdc(0.into()).denom();
        let _dydx = Token::Dydx(0.into()).denom();
        let _dydx_tnt = Token::DydxTnt(0.into()).denom();
    }
}
