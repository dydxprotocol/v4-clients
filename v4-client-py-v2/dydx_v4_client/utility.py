from decimal import Decimal, getcontext, ROUND_DOWN

# Set precision high enough for financial calculations
from dydx_v4_client.indexer.rest.constants import OrderSide
from v4_proto.dydxprotocol.clob.order_pb2 import Order

getcontext().prec = 28


class Usdc:
    QUANTUMS_ATOMIC_RESOLUTION = -6

    def __init__(self, value: Decimal):
        self.value = value

    @classmethod
    def from_quantums(cls, quantums):
        """
        Create a micro USDC (1e-6) token from an integer or decimal.
        Equivalent to dividing the input by 10^6.
        """
        quantums_decimal = Decimal(quantums)
        resolution = Decimal(10) ** abs(cls.QUANTUMS_ATOMIC_RESOLUTION)
        return cls(quantums_decimal / resolution)

    def quantize(self) -> Decimal:
        """
        Express a USDC token as an integer (in quantums).
        Equivalent to multiplying by 10^6.
        """
        resolution = Decimal(10) ** abs(self.QUANTUMS_ATOMIC_RESOLUTION)
        return Decimal(self.value) * Decimal(resolution)

    def quantize_as_u64(self) -> int:
        """
        Express a USDC token as an unsigned 64-bit integer.
        """
        quantized = self.quantize().to_integral_value(rounding=ROUND_DOWN)
        if quantized < 0 or quantized > 2**64 - 1:
            raise ValueError("Failed converting USDC value to u64")
        return int(quantized)

    def __repr__(self):
        return f"Usdc({self.value})"


def to_serializable_vec(bigint: int) -> bytes:
    """
    Serialize a bigint to bytes (big-endian, minimal size).
    Equivalent to a Rust-style serialization of BigInt.
    """
    if bigint == 0:
        return bytes([0x02])

    sign_byte = 0x02 if bigint >= 0 else 0x03
    unsigned_bigint = abs(bigint)
    abs_bytes = unsigned_bigint.to_bytes(
        (unsigned_bigint.bit_length() + 7) // 8, "big", signed=False
    )
    return bytes([sign_byte]) + abs_bytes


def convert_amount_to_quantums_vec(amount):
    try:
        usdc = Usdc(amount)
        quantized = usdc.quantize()
        bigint = int(quantized)
        # Simulate `.ok_or_else(...)?` by checking if conversion failed
        if bigint is None:
            raise ValueError("Failed converting USDC quantums to BigInt")

        # Equivalent to `.to_serializable_vec()?`
        return to_serializable_vec(bigint)

    except Exception as e:
        raise ValueError(
            f"Failed converting amount to serializable quantums vector: {e}"
        )


def convert_quantum_bytes_to_value(quantums: bytes):
    # quantums = q.encode()
    side = Order.Side.SIDE_BUY
    quantum_value = int.from_bytes(quantums, byteorder="big", signed=False)

    return quantum_value


def convert_quantum_bytes_to_value_with_order_side(quantums: bytes):
    side = OrderSide.BUY
    quantum_value = int.from_bytes(quantums[1:], byteorder="big", signed=False)
    if int(quantums[0]) == 3:
        side = OrderSide.SELL

    return (quantum_value, side)
