import random
import time
import random
import json
import grpc
import pytest
import asyncio

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType, OrderSide
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.message import order
from dydx_v4_client.node.market import Market, since_now
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.market import Market, since_now
from dydx_v4_client.node.message import subaccount, send_token
from tests.conftest import get_wallet, assert_successful_broadcast
from v4_proto.dydxprotocol.clob.order_pb2 import BuilderCodeParameters
from dydx_v4_client.indexer.rest.constants import OrderStatus

from dydx_v4_client.node.market import Market
from dydx_v4_client.node.message import subaccount, send_token
from tests.conftest import get_wallet, assert_successful_broadcast
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from v4_proto.dydxprotocol.clob.order_pb2 import Order

REQUEST_PROCESSING_TIME = 5


@pytest.fixture(autouse=True)
def sleep_after_test(request):
    """
    Applies 5 seconds sleep to all tests in this file.
    It gives the testnet the time to process the request.
    Otherwise tests would throw incorrect sequence errors.
    """
    yield
    time.sleep(REQUEST_PROCESSING_TIME)


@pytest.mark.asyncio
async def test_deposit(node_client, test_address, wallet):
    response = await node_client.deposit(
        wallet,
        test_address,
        subaccount(test_address, 0),
        asset_id=0,
        quantums=10000000,
    )
    assert_successful_broadcast(response)


@pytest.mark.asyncio
async def test_withdraw(node_client, wallet, test_address):
    try:
        response = await node_client.withdraw(
            wallet,
            subaccount(test_address, 0),
            test_address,
            asset_id=0,
            quantums=10000000,
        )
        assert_successful_broadcast(response)
    except grpc.RpcError as e:
        if "StillUndercollateralized" in str(e.details()):
            pytest.xfail("Subaccount is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_send_token(node_client, wallet, test_address, recipient):
    response = await node_client.send_token(
        wallet,
        test_address,
        recipient,
        10000000,
        "adv4tnt",
    )
    assert_successful_broadcast(response)


@pytest.mark.asyncio
async def test_order(
    node_client,
    test_order,
    test_order_id,
    test_address,
    key_pair,
    wallet,
    indexer_rest_client,
):
    try:
        placed = await node_client.place_order(
            wallet,
            test_order,
        )
        assert_successful_broadcast(placed)

        # If the time is too short the result of cancel order is sequence error:
        # codespace: "sdk"\n  code: 32\n  raw_log: "account sequence mismatch, expected 1460, got 1459: incorrect account sequence"
        # If the time is too long the result is:
        # codespace: "clob"\n  code:...hj67cghhf9jypslcf9sh2n5k6art Number:0} ClientId:13850897 OrderFlags:64 ClobPairId:0}: Stateful order does not exist"
        time.sleep(2)

        orders = await indexer_rest_client.account.get_subaccount_orders(
            test_address, 0, status=OrderStatus.OPEN
        )
        number_of_orders = len(orders)
        assert number_of_orders != 0

        wallet = await get_wallet(node_client, key_pair, test_address)

        canceled = await node_client.cancel_order(
            wallet,
            test_order_id,
            good_til_block_time=test_order.good_til_block_time,
        )
        assert_successful_broadcast(canceled)
    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_order_cancel(
    node_client,
    test_order2,
    test_order_id,
    test_address,
    key_pair,
    wallet,
    indexer_rest_client,
):
    try:
        placed = await node_client.place_order(
            wallet,
            test_order2,
        )
        assert_successful_broadcast(placed)

        # If the time is too short the result of cancel order is sequence error:
        # codespace: "sdk"\n  code: 32\n  raw_log: "account sequence mismatch, expected 1460, got 1459: incorrect account sequence"
        # If the time is too long the result is:
        # codespace: "clob"\n  code:...hj67cghhf9jypslcf9sh2n5k6art Number:0} ClientId:13850897 OrderFlags:64 ClobPairId:0}: Stateful order does not exist"
        time.sleep(2)

        orders = await indexer_rest_client.account.get_subaccount_orders(
            test_address, 0, status=OrderStatus.OPEN
        )
        number_of_orders = len(orders)
        assert number_of_orders != 0

        wallet = await get_wallet(node_client, key_pair, test_address)

        canceled = await node_client.cancel_order(
            wallet,
            test_order_id,
            good_til_block_time=test_order2.good_til_block_time,
        )
        assert_successful_broadcast(canceled)
        # assert canceled.__repr__() == ""
    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_transfer(node_client, wallet, test_address, recipient):
    try:
        response = await node_client.transfer(
            wallet,
            subaccount(test_address, 0),
            subaccount(recipient, 1),
            asset_id=0,
            amount=1,
        )
        assert_successful_broadcast(response)
    except grpc.RpcError as e:
        if "StillUndercollateralized" in str(e):
            pytest.skip("Subaccount is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_create_transaction_and_query_transaction(
    node_client, test_address, wallet, recipient
):
    send_token_msg = send_token(test_address, recipient, 10000000, "adv4tnt")
    tx = await node_client.create_transaction(wallet, send_token_msg)
    assert tx is not None
    assert tx.body is not None
    assert tx.auth_info is not None
    assert tx.signatures is not None
    broadcast_response = await node_client.broadcast(tx)
    assert broadcast_response is not None
    assert broadcast_response.tx_response is not None
    await asyncio.sleep(5)
    tx_send_message = await node_client.query_transaction(
        broadcast_response.tx_response.txhash
    )
    assert tx_send_message == tx


@pytest.mark.asyncio
async def test_query_address(node_client, test_address):
    response = await node_client.query_address(test_address)
    assert response is not None
    assert isinstance(response, tuple)


@pytest.mark.asyncio
async def test_create_market_permissionless(node_client, wallet, test_address):
    ticker = "ETH-USD"
    try:
        response = await node_client.create_market_permissionless(
            wallet, ticker, test_address, 0
        )
        assert response is not None
        assert response.tx_response is not None
        assert response.tx_response.txhash is not None
    except Exception as e:
        assert f"{ticker}: Market params pair already exists" in str(e)


@pytest.mark.asyncio
async def test_delegate_undelegate(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    undelgations = await node_client.get_delegator_unbonding_delegations(test_address)
    assert undelgations is not None
    validator_to_num_of_undelegations = {
        v.operator_address: 0 for v in validator.validators
    }
    for u in undelgations.unbonding_responses:
        validator_to_num_of_undelegations[u.validator_address] += 1
    validator_address_with_least_undelegations = min(
        validator_to_num_of_undelegations.items(), key=lambda item: item[1]
    )[0]
    delegate_response = await node_client.delegate(
        wallet,
        test_address,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    await asyncio.sleep(5)
    await node_client.query_transaction(delegate_response.tx_response.txhash)

    undelegate_response = await node_client.undelegate(
        wallet,
        test_address,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    assert undelegate_response is not None
    assert undelegate_response.tx_response is not None
    await asyncio.sleep(5)
    await node_client.query_transaction(undelegate_response.tx_response.txhash)


@pytest.mark.asyncio
async def test_withdraw_delegate_reward(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    response = await node_client.withdraw_delegate_reward(
        wallet, test_address, validator.validators[0].operator_address
    )
    assert response is not None
    assert response.tx_response is not None
    assert response.tx_response.txhash is not None
    await asyncio.sleep(5)
    await node_client.query_transaction(response.tx_response.txhash)


@pytest.mark.asyncio
async def test_register_affiliate(node_client, wallet, test_address, recipient):
    try:
        response = await node_client.register_affiliate(wallet, test_address, recipient)
        assert response is not None
        assert response.tx_response is not None
        assert response.tx_response.txhash is not None
        await asyncio.sleep(5)
        await node_client.query_transaction(response.tx_response.txhash)
    except Exception as e:
        assert "Affiliate already exists for referee" in str(e)

@pytest.mark.asyncio
async def test_place_order_with_builder_code(
    node_client, indexer_rest_client, test_order_id, test_address, wallet
):
    builder_code_param = BuilderCodeParameters(
        builder_address=test_address, fee_ppm=500
    )
    test_order = order(
        test_order_id,
        time_in_force=0,
        reduce_only=False,
        side=1,
        quantums=10000000,
        subticks=40000000000,
        good_til_block_time=int(time.time() + 60),
        builder_code_parameters=builder_code_param,
        twap_parameters=None,
        order_router_address=None,
    )

    placed = await node_client.place_order(
        wallet,
        test_order,
    )

    await asyncio.sleep(5)

    fills = await indexer_rest_client.account.get_subaccount_fills(
        address=test_address, subaccount_number=0, limit=1
    )

    assert fills["fills"][0]["builderAddress"] == test_address

@pytest.mark.asyncio
async def test_close_position_sell_no_reduce_by(
    node_client, wallet, test_address, indexer_rest_client
):
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    _ = await close_open_positions(node_client, wallet, test_address, market)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=OrderSide.SELL,
        size=0.002,
        price=0,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=None,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    _ = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )

    wallet.sequence += 1

    await asyncio.sleep(5)

    size_after_placing_order = await get_current_order_size(
        indexer_rest_client, test_address
    )
    assert size_after_placing_order == -0.002

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=0,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address) is None


@pytest.mark.asyncio
async def test_close_position_sell_having_reduce_by(
    node_client, wallet, test_address, indexer_rest_client
):
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    _ = await close_open_positions(node_client, wallet, test_address, market)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=OrderSide.SELL,
        size=0.002,
        price=0,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=None,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    _ = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )

    wallet.sequence += 1

    await asyncio.sleep(5)

    size_after_placing_order = await get_current_order_size(
        indexer_rest_client, test_address
    )
    assert size_after_placing_order == -0.002

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=0,
        market=market,
        reduce_by=0.001,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address) == -0.001


@pytest.mark.asyncio
async def test_close_position_buy_no_reduce_by(
    node_client, wallet, test_address, indexer_rest_client
):
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    _ = await close_open_positions(node_client, wallet, test_address, market)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_BUY,
        size=0.002,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        price=float(market.market["oraclePrice"]) * 1.2,
        time_in_force=None,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    _ = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )

    wallet.sequence += 1

    await asyncio.sleep(5)

    size_after_placing_order = await get_current_order_size(
        indexer_rest_client, test_address
    )
    assert size_after_placing_order == 0.002

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=0,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address) is None


@pytest.mark.asyncio
async def test_close_position_buy_having_reduce_by(
    node_client, wallet, test_address, indexer_rest_client
):
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    _ = await close_open_positions(node_client, wallet, test_address, market)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=OrderSide.BUY,
        size=0.002,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        price=float(market.market["oraclePrice"]) * 1.2,
        time_in_force=None,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    _ = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )

    wallet.sequence += 1

    await asyncio.sleep(5)

    size_after_placing_order = await get_current_order_size(
        indexer_rest_client, test_address
    )
    assert size_after_placing_order == 0.002

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=0,
        market=market,
        reduce_by=0.001,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)

    assert await get_current_order_size(indexer_rest_client, test_address) == 0.001


async def get_current_order_size(indexer_rest_client, test_address):
    subaccount = await indexer_rest_client.account.get_subaccount(test_address, 0)
    if "subaccount" not in subaccount:
        return None
    if "openPerpetualPositions" not in subaccount["subaccount"]:
        return None
    if "ETH-USD" not in subaccount["subaccount"]["openPerpetualPositions"]:
        return None
    return float(subaccount["subaccount"]["openPerpetualPositions"]["ETH-USD"]["size"])


async def close_open_positions(node_client, wallet, test_address, market):
    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=0,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
        slippage_pct=5,
    )