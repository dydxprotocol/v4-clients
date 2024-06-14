
"""Bank send message."""

from v4_proto.cosmos.bank.v1beta1.tx_pb2 import MsgSend
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin

from ...crypto.address import Address

def create_bank_send_msg(
    from_address: Address, to_address: Address, amount: int, denom: str
) -> MsgSend:
    """Create bank send message.

    :param from_address: from address
    :param to_address: to address
    :param amount: amount
    :param denom: denom
    :return: bank send message
    """
    msg = MsgSend(
        from_address=str(from_address),
        to_address=str(to_address),
        amount=[Coin(amount=str(amount), denom=denom)],
    )

    return msg
