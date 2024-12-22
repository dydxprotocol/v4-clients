use anyhow::{anyhow as err, Error};
use bigdecimal::num_bigint::{BigInt, Sign};

/// An extension trait for [`BigInt`].
pub trait BigIntExt {
    /// Initialize a [`BigInt`] from a bytes slice.
    fn from_serializable_int(bytes: &[u8]) -> Result<BigInt, Error>;
    /// Creates a bytes vector from a [`BigInt`].
    fn to_serializable_vec(&self) -> Result<Vec<u8>, Error>;
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

    fn to_serializable_vec(&self) -> Result<Vec<u8>, Error> {
        if self.sign() == Sign::NoSign {
            return Ok(vec![0x02]);
        }

        let (sign, bytes) = self.to_bytes_be();
        let mut vec = vec![0; 1 + bytes.len()];

        vec[0] = match sign {
            Sign::Plus | Sign::NoSign => 2,
            Sign::Minus => 3,
        };
        vec[1..].copy_from_slice(&bytes);

        Ok(vec)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn node_utils_serializable_to_bigint() -> Result<(), Error> {
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

    #[test]
    fn node_utils_serializable_from_bigint() -> Result<(), Error> {
        assert_eq!(
            [0x02].to_vec(),
            BigInt::from_str("0")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02].to_vec(),
            BigInt::from_str("-0")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0x01].to_vec(),
            BigInt::from_str("1")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0x01].to_vec(),
            BigInt::from_str("-1")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0xFF].to_vec(),
            BigInt::from_str("255")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0xFF].to_vec(),
            BigInt::from_str("-255")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0x01, 0x00].to_vec(),
            BigInt::from_str("256")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0x01, 0x00].to_vec(),
            BigInt::from_str("-256")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0x07, 0x5b, 0xcd, 0x15].to_vec(),
            BigInt::from_str("123456789")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0x07, 0x5b, 0xcd, 0x15].to_vec(),
            BigInt::from_str("-123456789")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0x01, 0xb6, 0x9b, 0x4b, 0xac, 0xd0, 0x5f, 0x15].to_vec(),
            BigInt::from_str("123456789123456789")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0x01, 0xb6, 0x9b, 0x4b, 0xac, 0xd0, 0x5f, 0x15].to_vec(),
            BigInt::from_str("-123456789123456789")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x02, 0x66, 0x1e, 0xfd, 0xf2, 0xe3, 0xb1, 0x9f, 0x7c, 0x04, 0x5f, 0x15].to_vec(),
            BigInt::from_str("123456789123456789123456789")?.to_serializable_vec()?,
        );
        assert_eq!(
            [0x03, 0x66, 0x1e, 0xfd, 0xf2, 0xe3, 0xb1, 0x9f, 0x7c, 0x04, 0x5f, 0x15].to_vec(),
            BigInt::from_str("-123456789123456789123456789")?.to_serializable_vec()?,
        );

        Ok(())
    }
}
