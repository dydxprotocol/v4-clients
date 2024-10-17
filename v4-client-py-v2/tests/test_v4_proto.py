from google.protobuf.message import Message

from dydx_v4_client.node.message import (
    cancel_order,
    deposit,
    order,
    order_id,
    place_order,
    send_token,
    subaccount,
    transfer,
    withdraw,
)
from tests.conftest import TEST_ADDRESS

SERIALIZED_PLACE_ORDER = b"\nH\n1\n-\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x18@\x10\x01\x18\x80\xad\xe2\x04 \x80\xa0\xbe\x81\x95\x015\t\x9cYfH\x02"
SERIALIZED_CANCEL_ORDER = (
    b"\n1\n-\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x18@\x1d\t\x9cYf"
)
SERIALIZED_DEPOSIT = b"\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x12-\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art \x80\xad\xe2\x04"
SERIALIZED_WITHDRAW = b"\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x12-\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art \x80\xad\xe2\x04"
SERIALIZED_SEND_TOKEN = b"\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x12+dydx1slanxj8x9ntk9knwa6cvfv2tzlsq5gk3dshml0\x1a\x13\n\x07adv4tnt\x12\x0810000000"
SERIALIZED_TRANSFER = (
    b"\nb\n-\n+dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art\x12/\n+dydx1slanxj8x9n"
    b"tk9knwa6cvfv2tzlsq5gk3dshml0\x10\x01 \x01"
)


def assert_serializes_properly(message: Message, expected: str):
    assert message.SerializeToString() == expected


ORDER_ID = order_id(
    TEST_ADDRESS,
    subaccount_number=0,
    client_id=0,
    clob_pair_id=0,
    order_flags=64,
)
GOOD_TIL_BLOCK_TIME = 1717148681


def test_place_order_serialization(test_address):
    test_order = order(
        ORDER_ID,
        time_in_force=0,
        reduce_only=False,
        side=1,
        quantums=10000000,
        subticks=40000000000,
        good_til_block_time=GOOD_TIL_BLOCK_TIME,
    )
    assert_serializes_properly(place_order(test_order), SERIALIZED_PLACE_ORDER)


def test_cancel_order_serialization():
    assert_serializes_properly(
        cancel_order(ORDER_ID, good_til_block_time=GOOD_TIL_BLOCK_TIME),
        SERIALIZED_CANCEL_ORDER,
    )


def test_deposit_serialization(test_address):
    assert_serializes_properly(
        deposit(test_address, subaccount(test_address, 0), 0, 10_000_000),
        SERIALIZED_DEPOSIT,
    )


def test_withdraw_serialization(test_address):
    assert_serializes_properly(
        withdraw(
            subaccount(test_address, 0), test_address, asset_id=0, quantums=10000000
        ),
        SERIALIZED_WITHDRAW,
    )


def test_send_token_serialization(test_address, recipient):
    assert_serializes_properly(
        send_token(test_address, recipient, 10000000, "adv4tnt"), SERIALIZED_SEND_TOKEN
    )


def test_transfer_serialization(test_address, recipient):
    assert_serializes_properly(
        transfer(
            subaccount(test_address, 0), subaccount(recipient, 1), asset_id=0, amount=1
        ),
        SERIALIZED_TRANSFER,
    )
