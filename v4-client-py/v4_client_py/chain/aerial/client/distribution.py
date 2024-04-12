
"""Distribution."""

from v4_proto.cosmos.distribution.v1beta1.tx_pb2 import MsgWithdrawDelegatorReward

from ...crypto.address import Address

def create_withdraw_delegator_reward(delegator: Address, validator: Address):
    """Create withdraw delegator reward.

    :param delegator: delegator address
    :param validator: validator address
    :return: withdraw delegator reward message
    """
    return MsgWithdrawDelegatorReward(
        delegator_address=str(delegator),
        validator_address=str(validator),
    )
