import time
import random

import pytest
import asyncio

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.node.market import Market
from v4_proto.dydxprotocol.clob.order_pb2 import Order
from dydx_v4_client.indexer.rest.constants import OrderType, OrderStatus
from tests.conftest import (
    get_wallet,
    assert_successful_broadcast,
    TEST_ADDRESS_2,
    TEST_ADDRESS_3,
    TEST_MARKET_ID,
)


REQUEST_PROCESSING_TIME = 5
SUBACCOUNT = 0


@pytest.fixture(autouse=True)
def sleep_after_test(request):
    """
    Applies 5 seconds sleep to all tests in this file.
    It gives the testnet the time to process the request.
    """
    yield
    time.sleep(REQUEST_PROCESSING_TIME)


async def setup_liquidity_orders(node_client, indexer_rest_client, wallet_2, market):
    """
    Places buy and sell orders at safe prices to provide liquidity for scale order tests.
    Returns tuple of (buy_order_id, sell_order_id, wallet_2, good_til_block) for cleanup.
    """
    oracle_price = float(market.market["oraclePrice"])

    try:
        orderbook = await indexer_rest_client.markets.get_perpetual_market_orderbook(
            TEST_MARKET_ID
        )
        best_bid = (
            float(orderbook["bids"][0]["price"])
            if orderbook.get("bids") and len(orderbook["bids"]) > 0
            else None
        )
        best_ask = (
            float(orderbook["asks"][0]["price"])
            if orderbook.get("asks") and len(orderbook["asks"]) > 0
            else None
        )
    except Exception:
        best_bid = None
        best_ask = None

    buy_price = oracle_price * 0.995
    sell_price = oracle_price * 1.005

    if best_ask is not None and buy_price >= best_ask:
        buy_price = best_ask * 0.995

    if best_bid is not None and sell_price <= best_bid:
        sell_price = best_bid * 1.005

    current_block = await node_client.latest_block_height()
    good_til_block = current_block + 15

    buy_order_id = market.order_id(
        TEST_ADDRESS_2, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    buy_order = market.order(
        order_id=buy_order_id,
        order_type=OrderType.LIMIT,
        side=Order.Side.SIDE_BUY,
        size=1000,
        price=buy_price,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=good_til_block,
    )

    buy_response = await node_client.place_order(wallet=wallet_2, order=buy_order)
    assert_successful_broadcast(buy_response)
    wallet_2.sequence += 1

    sell_order_id = market.order_id(
        TEST_ADDRESS_2, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )
    sell_order = market.order(
        order_id=sell_order_id,
        order_type=OrderType.LIMIT,
        side=Order.Side.SIDE_SELL,
        size=1000,
        price=sell_price,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=good_til_block,
    )

    sell_response = await node_client.place_order(wallet=wallet_2, order=sell_order)
    assert_successful_broadcast(sell_response)
    wallet_2.sequence += 1

    await asyncio.sleep(5)

    return (buy_order_id, sell_order_id, wallet_2, good_til_block)


async def cleanup_liquidity_orders(
    node_client, key_pair_2, buy_order_id, sell_order_id, good_til_block
):
    wallet_2 = await get_wallet(node_client, key_pair_2, TEST_ADDRESS_2)

    try:
        cancel_buy_response = await node_client.cancel_order(
            wallet=wallet_2, order_id=buy_order_id, good_til_block=good_til_block + 10
        )
        assert_successful_broadcast(cancel_buy_response)
        wallet_2.sequence += 1
    except Exception:
        pass

    wallet_2 = await get_wallet(node_client, key_pair_2, TEST_ADDRESS_2)

    try:
        cancel_sell_response = await node_client.cancel_order(
            wallet=wallet_2, order_id=sell_order_id, good_til_block=good_til_block + 10
        )
        assert_successful_broadcast(cancel_sell_response)
        wallet_2.sequence += 1
    except Exception:
        pass

    await asyncio.sleep(5)


@pytest.fixture
async def liquidity_setup(node_client, indexer_rest_client, wallet_2, key_pair_2):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )

    buy_order_id, sell_order_id, wallet_ref, good_til_block = (
        await setup_liquidity_orders(node_client, indexer_rest_client, wallet_2, market)
    )

    yield

    await cleanup_liquidity_orders(
        node_client, key_pair_2, buy_order_id, sell_order_id, good_til_block
    )


@pytest.mark.asyncio
async def test_scale_order_validates_num_orders(
    node_client, indexer_rest_client, wallet, test_address, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )
    wallet = await get_wallet(node_client, key_pair, test_address)

    with pytest.raises(ValueError, match="num_orders must be at least 2"):
        await node_client.place_scale_order(
            wallet=wallet,
            market=market,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            side=Order.Side.SIDE_BUY,
            total_size=100,
            price_low=1.0,
            price_high=2.0,
            num_orders=1,
            good_til_block_time=int(time.time() + 120),
        )


@pytest.mark.asyncio
async def test_scale_order_validates_price_range(
    node_client, indexer_rest_client, wallet, test_address, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )
    wallet = await get_wallet(node_client, key_pair, test_address)

    with pytest.raises(ValueError, match="price_low must be less than price_high"):
        await node_client.place_scale_order(
            wallet=wallet,
            market=market,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            side=Order.Side.SIDE_BUY,
            total_size=100,
            price_low=2.0,
            price_high=1.0,
            num_orders=3,
            good_til_block_time=int(time.time() + 120),
        )


@pytest.mark.asyncio
async def test_scale_order_validates_total_size(
    node_client, indexer_rest_client, wallet, test_address, key_pair
):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )
    wallet = await get_wallet(node_client, key_pair, test_address)

    with pytest.raises(ValueError, match="total_size must be positive"):
        await node_client.place_scale_order(
            wallet=wallet,
            market=market,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            side=Order.Side.SIDE_BUY,
            total_size=0,
            price_low=1.0,
            price_high=2.0,
            num_orders=3,
            good_til_block_time=int(time.time() + 120),
        )


@pytest.mark.asyncio
async def test_scale_order_place_and_verify(
    node_client,
    indexer_rest_client,
    wallet,
    test_address,
    key_pair,
    liquidity_setup,
):
    """
    Places a scale order with 3 limit orders across a price range below oracle,
    then verifies that orders appear on the book via the indexer.
    """
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )

    # Wait for testnet to settle after liquidity setup, then refresh wallet
    await asyncio.sleep(REQUEST_PROCESSING_TIME)
    wallet = await get_wallet(node_client, key_pair, test_address)

    oracle_price = float(market.market["oraclePrice"])

    # Place BUY scale orders well below oracle to avoid immediate execution
    price_low = oracle_price * 0.90
    price_high = oracle_price * 0.95
    num_orders = 3
    total_size = 30

    try:
        results = await node_client.place_scale_order(
            wallet=wallet,
            market=market,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            side=Order.Side.SIDE_BUY,
            total_size=total_size,
            price_low=price_low,
            price_high=price_high,
            num_orders=num_orders,
            good_til_block_time=int(time.time() + 120),
        )

        assert len(results) == num_orders

        for order_id, response in results:
            assert_successful_broadcast(response)

        await asyncio.sleep(REQUEST_PROCESSING_TIME)

        # Verify orders appear in the indexer
        orders = await indexer_rest_client.account.get_subaccount_orders(
            test_address, SUBACCOUNT, status=OrderStatus.OPEN
        )

        # There should be at least num_orders open orders
        assert len(orders) >= num_orders

        # Cleanup: cancel the placed orders
        wallet = await get_wallet(node_client, key_pair, test_address)
        for order_id, _ in results:
            try:
                await node_client.cancel_order(
                    wallet=wallet,
                    order_id=order_id,
                    good_til_block_time=int(time.time() + 120),
                )
                wallet.sequence += 1
                await asyncio.sleep(1)
            except Exception:
                pass

    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_scale_order_sell_place_and_verify(
    node_client,
    indexer_rest_client,
    wallet,
    test_address,
    key_pair,
    liquidity_setup,
):
    """
    Places a SELL scale order with 3 limit orders above oracle price,
    then verifies that orders appear on the book.
    """
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID))[
            "markets"
        ][TEST_MARKET_ID]
    )

    # Wait for testnet to settle after liquidity setup, then refresh wallet
    await asyncio.sleep(REQUEST_PROCESSING_TIME)
    wallet = await get_wallet(node_client, key_pair, test_address)

    oracle_price = float(market.market["oraclePrice"])

    # Place SELL scale orders well above oracle to avoid immediate execution
    price_low = oracle_price * 1.05
    price_high = oracle_price * 1.10
    num_orders = 3
    total_size = 30

    try:
        results = await node_client.place_scale_order(
            wallet=wallet,
            market=market,
            address=test_address,
            subaccount_number=SUBACCOUNT,
            side=Order.Side.SIDE_SELL,
            total_size=total_size,
            price_low=price_low,
            price_high=price_high,
            num_orders=num_orders,
            good_til_block_time=int(time.time() + 120),
        )

        assert len(results) == num_orders

        for order_id, response in results:
            assert_successful_broadcast(response)

        await asyncio.sleep(REQUEST_PROCESSING_TIME)

        orders = await indexer_rest_client.account.get_subaccount_orders(
            test_address, SUBACCOUNT, status=OrderStatus.OPEN
        )

        assert len(orders) >= num_orders

        # Cleanup
        wallet = await get_wallet(node_client, key_pair, test_address)
        for order_id, _ in results:
            try:
                await node_client.cancel_order(
                    wallet=wallet,
                    order_id=order_id,
                    good_til_block_time=int(time.time() + 120),
                )
                wallet.sequence += 1
                await asyncio.sleep(1)
            except Exception:
                pass

    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e
