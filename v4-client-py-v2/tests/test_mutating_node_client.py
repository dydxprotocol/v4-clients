import time
import random

import grpc
import httpx
import pytest
import asyncio

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.message import subaccount, send_token, order
from v4_proto.dydxprotocol.clob.order_pb2 import Order
from dydx_v4_client.indexer.rest.constants import OrderType
from tests.conftest import get_wallet, assert_successful_broadcast, TEST_ADDRESS_2
from v4_proto.dydxprotocol.clob.order_pb2 import BuilderCodeParameters
from dydx_v4_client.indexer.rest.constants import OrderStatus
from dydx_v4_client.key_pair import KeyPair


REQUEST_PROCESSING_TIME = 5
MARKET_ID = "ENA-USD"
SUBACCOUNT = 0

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
        quantums=1000000,
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
            quantums=100000,
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
        1000000,
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
    ticker = "ENA-USD"
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
async def test_place_order_with_twap_parameters(
    node_client, indexer_rest_client, test_address, wallet, liquidity_setup, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )
    wallet = await get_wallet(node_client, key_pair, test_address)

    # Create order_id for the correct market and subaccount
    order_id = market.order_id(
        test_address, SUBACCOUNT, random.randint(0, MAX_CLIENT_ID), OrderFlags.LONG_TERM
    )

    test_order = market.order(
        order_id=order_id,
        time_in_force=0,
        reduce_only=False,
        order_type=OrderType.MARKET,
        side=1,
        size=100,
        price=0,
        good_til_block_time=int(time.time() + 60),
        twap_duration=7,
        twap_interval=1,
        twap_price_tolerance=10,
    )

    _ = await node_client.place_order(
        wallet,
        test_order,
    )

    await asyncio.sleep(5)

    fills = await indexer_rest_client.account.get_subaccount_fills(
        address=test_address, subaccount_number=SUBACCOUNT, limit=1
    )

    assert fills is not None


@pytest.mark.asyncio
async def test_close_position_sell_no_reduce_by(
    node_client, wallet, test_address, indexer_rest_client, liquidity_setup, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    wallet = await get_wallet(node_client, key_pair, test_address)

    _ = await close_open_positions(node_client, wallet, test_address, market, SUBACCOUNT)

    # Refresh wallet after close_open_positions
    wallet = await get_wallet(node_client, key_pair, test_address)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, SUBACCOUNT, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=100,
        price=0,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
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
        indexer_rest_client, test_address, SUBACCOUNT
    )
    assert size_after_placing_order == -100

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=SUBACCOUNT,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address, SUBACCOUNT) is None


async def setup_liquidity_orders(
    node_client, indexer_rest_client, wallet_2, market
):
    """
    Places buy and sell orders at safe prices to provide liquidity without immediate execution.
    Fetches orderbook to calculate prices 0.5% away from bid/ask, using oracle as fallback.
    Returns tuple of (buy_order_id, sell_order_id, wallet_2, good_til_block) for cleanup.
    """
    oracle_price = float(market.market["oraclePrice"])
    
    # Fetch orderbook to get current bid/ask
    try:
        orderbook = await indexer_rest_client.markets.get_perpetual_market_orderbook(MARKET_ID)
        best_bid = float(orderbook["bids"][0]["price"]) if orderbook.get("bids") and len(orderbook["bids"]) > 0 else None
        best_ask = float(orderbook["asks"][0]["price"]) if orderbook.get("asks") and len(orderbook["asks"]) > 0 else None
    except Exception:
        best_bid = None
        best_ask = None

    # For both buy and sell, start at oracle +- 0.5%
    buy_price = oracle_price * 0.995  # 0.5% below oracle
    sell_price = oracle_price * 1.005  # 0.5% above oracle

    # If there is an ask, check if buy_price would immediately execute
    if best_ask is not None:
        # BUY price executes if price >= ask
        if buy_price >= best_ask:
            # Shift further down by 0.5% from ask
            buy_price = best_ask * 0.995  # 0.5% below ask

    # If there is a bid, check if sell_price would immediately execute
    if best_bid is not None:
        # SELL price executes if price <= bid
        if sell_price <= best_bid:
            # Shift further up by 0.5% from bid
            sell_price = best_bid * 1.005  # 0.5% above bid
    
    current_block = await node_client.latest_block_height()
    good_til_block = current_block + 15
    
    # Place BUY order at calculated safe price (below ask to avoid immediate execution)
    buy_order_id = market.order_id(
        TEST_ADDRESS_2, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    buy_order = market.order(
        order_id=buy_order_id,
        order_type=OrderType.LIMIT,
        side=Order.Side.SIDE_BUY,
        size=1000,  # Large size to provide liquidity
        price=buy_price,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=good_til_block,
    )
    
    buy_response = await node_client.place_order(
        wallet=wallet_2,
        order=buy_order,
    )
    assert_successful_broadcast(buy_response)
    wallet_2.sequence += 1
    
    # Place SELL order at calculated safe price (above bid to avoid immediate execution)
    sell_order_id = market.order_id(
        TEST_ADDRESS_2, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    sell_order = market.order(
        order_id=sell_order_id,
        order_type=OrderType.LIMIT,
        side=Order.Side.SIDE_SELL,
        size=1000,  # Large size to provide liquidity
        price=sell_price,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=good_til_block,
    )
    
    sell_response = await node_client.place_order(
        wallet=wallet_2,
        order=sell_order,
    )
    assert_successful_broadcast(sell_response)
    wallet_2.sequence += 1
    
    # Wait for orders to be placed
    await asyncio.sleep(5)
    
    return (buy_order_id, sell_order_id, wallet_2, good_til_block)


async def cleanup_liquidity_orders(
    node_client, key_pair_2, buy_order_id, sell_order_id, good_til_block
):
    """
    Cancels the buy and sell liquidity orders.
    """
    # Refresh wallet to get current sequence
    wallet_2 = await get_wallet(node_client, key_pair_2, TEST_ADDRESS_2)
    
    # Cancel buy order
    try:
        cancel_buy_response = await node_client.cancel_order(
            wallet=wallet_2,
            order_id=buy_order_id,
            good_til_block=good_til_block + 10,
        )
        assert_successful_broadcast(cancel_buy_response)
        wallet_2.sequence += 1
    except Exception as e:
        # Order may have already been filled or cancelled, continue
        pass
    
    # Refresh wallet again before canceling sell order
    wallet_2 = await get_wallet(node_client, key_pair_2, TEST_ADDRESS_2)
    
    # Cancel sell order
    try:
        cancel_sell_response = await node_client.cancel_order(
            wallet=wallet_2,
            order_id=sell_order_id,
            good_til_block=good_til_block + 10,
        )
        assert_successful_broadcast(cancel_sell_response)
        wallet_2.sequence += 1
    except Exception as e:
        # Order may have already been filled or cancelled, continue
        pass
    
    await asyncio.sleep(5)


@pytest.fixture
async def liquidity_setup(node_client, indexer_rest_client, wallet_2, key_pair_2):
    """
    Fixture that sets up liquidity orders before the test and cleans them up after.
    Places buy and sell orders at ±0.1% from oracle price using TEST_ADDRESS_2.
    """
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )
    
    # Setup: place liquidity orders
    buy_order_id, sell_order_id, wallet_ref, good_til_block = await setup_liquidity_orders(
        node_client, indexer_rest_client, wallet_2, market
    )
    
    yield  # Test runs here
    
    # Cleanup: cancel liquidity orders
    await cleanup_liquidity_orders(
        node_client, key_pair_2, buy_order_id, sell_order_id, good_til_block
    )

@pytest.mark.asyncio
async def test__liquidity_setup(
    node_client, wallet, test_address, indexer_rest_client, liquidity_setup
):
    # just sleep for 5 seconds
    await asyncio.sleep(5)


@pytest.mark.asyncio
async def test_close_position_sell_having_reduce_by(
    node_client, wallet, test_address, indexer_rest_client, liquidity_setup, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    wallet = await get_wallet(node_client, key_pair, test_address)

    _ = await close_open_positions(node_client, wallet, test_address, market, SUBACCOUNT)

    # Refresh wallet after close_open_positions
    wallet = await get_wallet(node_client, key_pair, test_address)

    # Open a position for sell order
    order_id = market.order_id(
        test_address, SUBACCOUNT, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=200,
        price=0,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    place_order_response = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )
    assert_successful_broadcast(place_order_response)

    wallet.sequence += 1

    await asyncio.sleep(5)

    size_after_placing_order = await get_current_order_size(
        indexer_rest_client, test_address, SUBACCOUNT
    )
    assert size_after_placing_order == -200

    close_position_response = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=SUBACCOUNT,
        market=market,
        reduce_by=100,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    assert_successful_broadcast(close_position_response)
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address, SUBACCOUNT) == -100
    _ = await close_open_positions(node_client, wallet, test_address, market, SUBACCOUNT)


@pytest.mark.asyncio
async def test_close_position_buy_no_reduce_by(
    node_client, wallet, test_address, indexer_rest_client, liquidity_setup, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    wallet = await get_wallet(node_client, key_pair, test_address)

    _ = await close_open_positions(node_client, wallet, test_address, market, SUBACCOUNT)

    # Refresh wallet after close_open_positions
    wallet = await get_wallet(node_client, key_pair, test_address)

    # Open a position for buy order
    order_id = market.order_id(
        test_address, SUBACCOUNT, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_BUY,
        size=100,
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
        indexer_rest_client, test_address, SUBACCOUNT
    )
    assert size_after_placing_order == 100

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=SUBACCOUNT,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)
    assert await get_current_order_size(indexer_rest_client, test_address, SUBACCOUNT) is None


@pytest.mark.asyncio
async def test_close_position_buy_having_reduce_by(
    node_client, wallet, test_address, indexer_rest_client, liquidity_setup, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    wallet = await get_wallet(node_client, key_pair, test_address)

    _ = await close_open_positions(node_client, wallet, test_address, market, SUBACCOUNT)

    # Refresh wallet after close_open_positions
    wallet = await get_wallet(node_client, key_pair, test_address)

    # Open a position for buy order
    order_id = market.order_id(
        test_address, SUBACCOUNT, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    current_block = await node_client.latest_block_height()
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_BUY,
        size=200,
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
        indexer_rest_client, test_address, SUBACCOUNT
    )
    assert size_after_placing_order == 200

    _ = await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=SUBACCOUNT,
        market=market,
        reduce_by=100,
        client_id=random.randint(0, MAX_CLIENT_ID),
    )
    await asyncio.sleep(5)

    assert await get_current_order_size(indexer_rest_client, test_address, SUBACCOUNT) == 100


@pytest.mark.asyncio
async def test_close_position_slippage_pct_raise_exception(
    node_client, wallet, test_address, indexer_rest_client
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )
    with pytest.raises(ValueError):
        _ = await node_client.close_position(
            wallet=wallet,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            market=market,
            reduce_by=100,
            client_id=random.randint(0, MAX_CLIENT_ID),
            slippage_pct=101,
        )

    with pytest.raises(ValueError):
        _ = await node_client.close_position(
            wallet=wallet,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            market=market,
            reduce_by=100,
            client_id=random.randint(0, MAX_CLIENT_ID),
            slippage_pct=-1,
        )


async def get_current_order_size(indexer_rest_client, test_address, subaccount_number=0):
    try:
        subaccount = await indexer_rest_client.account.get_subaccount(test_address, subaccount_number)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            # Subaccount doesn't exist yet (no activity), so no position
            print(f"Subaccount {subaccount_number} not found (404)")
            return None
        raise
    if "subaccount" not in subaccount:
        return None
    if "openPerpetualPositions" not in subaccount["subaccount"]:
        return None
    if "ENA-USD" not in subaccount["subaccount"]["openPerpetualPositions"]:
        return None
    return float(subaccount["subaccount"]["openPerpetualPositions"]["ENA-USD"]["size"])


async def close_open_positions(node_client, wallet, test_address, market, subaccount_number=0):
    return await node_client.close_position(
        wallet=wallet,
        address=test_address,
        subaccount_number=subaccount_number,
        market=market,
        reduce_by=None,
        client_id=random.randint(0, MAX_CLIENT_ID),
        slippage_pct=5,
    )
