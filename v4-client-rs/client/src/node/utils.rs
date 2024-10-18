use anyhow::{anyhow as err, Error};
use bigdecimal::num_bigint::{BigInt, Sign};

/// An extension trait for [`BigInt`].
pub trait BigIntExt {
    /// Initialize a heap-allocated big integer from a bytes slice.
    fn from_serializable_int(bytes: &[u8]) -> Result<BigInt, Error>;
}

impl BigIntExt for BigInt {
    fn from_serializable_int(bytes: &[u8]) -> Result<BigInt, Error> {
        if bytes.is_empty() {
            return Ok(BigInt::from(0));
        }

        let sign = match bytes[0] {
            2 => Sign::Plus,
            3 => Sign::Minus,
            _ => return Err(err!("Invalid sign byte, must be 2 or 3.")),
        };

        Ok(BigInt::from_bytes_be(sign, &bytes[1..]))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn node_utils_to_bigint() -> Result<(), Error> {
        assert_eq!(
            BigInt::from_str("0")?,
            BigInt::from_serializable_int(&[0x02])?
        );
        assert_eq!(
            BigInt::from_str("-0")?,
            BigInt::from_serializable_int(&[0x02])?
        );
        assert_eq!(
            BigInt::from_str("1")?,
            BigInt::from_serializable_int(&[0x02, 0x01])?
        );
        assert_eq!(
            BigInt::from_str("-1")?,
            BigInt::from_serializable_int(&[0x03, 0x01])?
        );
        assert_eq!(
            BigInt::from_str("255")?,
            BigInt::from_serializable_int(&[0x02, 0xFF])?
        );
        assert_eq!(
            BigInt::from_str("-255")?,
            BigInt::from_serializable_int(&[0x03, 0xFF])?
        );
        assert_eq!(
            BigInt::from_str("256")?,
            BigInt::from_serializable_int(&[0x02, 0x01, 0x00])?
        );
        assert_eq!(
            BigInt::from_str("-256")?,
            BigInt::from_serializable_int(&[0x03, 0x01, 0x00])?
        );
        assert_eq!(
            BigInt::from_str("123456789")?,
            BigInt::from_serializable_int(&[0x02, 0x07, 0x5b, 0xcd, 0x15])?
        );
        assert_eq!(
            BigInt::from_str("-123456789")?,
            BigInt::from_serializable_int(&[0x03, 0x07, 0x5b, 0xcd, 0x15])?
        );
        assert_eq!(
            BigInt::from_str("123456789123456789")?,
            BigInt::from_serializable_int(&[0x02, 0x01, 0xb6, 0x9b, 0x4b, 0xac, 0xd0, 0x5f, 0x15])?
        );
        assert_eq!(
            BigInt::from_str("-123456789123456789")?,
            BigInt::from_serializable_int(&[0x03, 0x01, 0xb6, 0x9b, 0x4b, 0xac, 0xd0, 0x5f, 0x15])?
        );
        assert_eq!(
            BigInt::from_str("123456789123456789123456789")?,
            BigInt::from_serializable_int(&[
                0x02, 0x66, 0x1e, 0xfd, 0xf2, 0xe3, 0xb1, 0x9f, 0x7c, 0x04, 0x5f, 0x15
            ])?
        );
        assert_eq!(
            BigInt::from_str("-123456789123456789123456789")?,
            BigInt::from_serializable_int(&[
                0x03, 0x66, 0x1e, 0xfd, 0xf2, 0xe3, 0xb1, 0x9f, 0x7c, 0x04, 0x5f, 0x15
            ])?
        );

        Ok(())
    }
}
