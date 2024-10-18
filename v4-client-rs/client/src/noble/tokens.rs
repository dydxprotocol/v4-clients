use crate::indexer::{Denom, Tokenized};
use anyhow::{anyhow as err, Error};
use bigdecimal::{num_traits::ToPrimitive, BigDecimal};
use v4_proto_rs::cosmos_sdk_proto::cosmos::base::v1beta1::Coin as ProtoCoin;

/// USDC Noble token.
pub struct NobleUsdc(pub BigDecimal);

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
                .0
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
