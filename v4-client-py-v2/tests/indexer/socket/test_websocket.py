import json
import os

import pytest
from dotenv import load_dotenv

from dydx_v4_client.indexer.candles_resolution import CandlesResolution

load_dotenv()


@pytest.mark.asyncio
async def test_order_book(indexer_socket_client):

    order_book_channel_name = indexer_socket_client.order_book.channel

    def on_message(ws, message):
        message_dict = json.loads(message)
        if message_dict["type"] == "connected":
            ws.order_book.subscribe(id="BTC-USD")
        elif message_dict["type"] == "subscribed":
            assert message_dict["channel"] == order_book_channel_name
            if os.getenv("CI") == "true":
                ws.order_book.unsubscribe(id="BTC-USD")
                ws.close()
        elif message_dict["type"] in ["channel_data", "channel_batch_data"]:
            assert message_dict["channel"] == order_book_channel_name
            assert "bids" or "asks" in message_dict["contents"][0]
            ws.order_book.unsubscribe(id="BTC-USD")
            ws.close()
        else:
            ws.close()
            assert False, f"Unexpected message: {message_dict}"

    indexer_socket_client.on_message = on_message
    await indexer_socket_client.connect()


@pytest.mark.asyncio
async def test_trades(indexer_socket_client):
    trades_channel_name = indexer_socket_client.trades.channel

    def on_message(ws, message):
        message_dict = json.loads(message)
        if message_dict["type"] == "connected":
            ws.trades.subscribe(id="BTC-USD")
        elif message_dict["type"] == "subscribed":
            assert message_dict["channel"] == trades_channel_name
            if os.getenv("CI") == "true":
                ws.trades.unsubscribe(id="BTC-USD")
                ws.close()
        elif message_dict["type"] in ["channel_data", "channel_batch_data"]:
            assert message_dict["channel"] == trades_channel_name
            assert "trades" in message_dict["contents"][0]
            ws.trades.unsubscribe(id="BTC-USD")
            ws.close()
        else:
            ws.close()
            assert False, f"Unexpected message: {message_dict}"

    indexer_socket_client.on_message = on_message
    await indexer_socket_client.connect()


@pytest.mark.asyncio
async def test_markets(indexer_socket_client):
    markets_channel_name = indexer_socket_client.markets.channel

    def on_message(ws, message):
        message_dict = json.loads(message)
        if message_dict["type"] == "connected":
            ws.markets.subscribe()
        elif message_dict["type"] == "subscribed":
            assert message_dict["channel"] == markets_channel_name
            if os.getenv("CI") == "true":
                ws.markets.unsubscribe()
                ws.close()
        elif message_dict["type"] in ["channel_data", "channel_batch_data"]:
            assert message_dict["channel"] == markets_channel_name
            assert "trading" in message_dict["contents"][0]
            ws.markets.unsubscribe()
            ws.close()
        else:
            ws.close()
            assert False, f"Unexpected message: {message_dict}"

    indexer_socket_client.on_message = on_message
    await indexer_socket_client.connect()


@pytest.mark.asyncio
async def test_candles(indexer_socket_client):
    candles_channel_name = indexer_socket_client.candles.channel

    def on_message(ws, message):
        message_dict = json.loads(message)
        if message_dict["type"] == "connected":
            ws.candles.subscribe(id="BTC-USD", resolution=CandlesResolution.ONE_MINUTE)
        elif message_dict["type"] == "subscribed":
            assert message_dict["channel"] == candles_channel_name
            if os.getenv("CI") == "true":
                ws.candles.unsubscribe(
                    id="BTC-USD", resolution=CandlesResolution.ONE_MINUTE
                )
                ws.close()
        elif message_dict["type"] in ["channel_data", "channel_batch_data"]:
            assert message_dict["channel"] == candles_channel_name
            assert "startedAt" in message_dict["contents"][0]
            assert "ticker" in message_dict["contents"][0]
            assert "resolution" in message_dict["contents"][0]
            ws.candles.unsubscribe(
                id="BTC-USD", resolution=CandlesResolution.ONE_MINUTE
            )
            ws.close()
        else:
            ws.close()
            assert False, f"Unexpected message: {message_dict}"

    indexer_socket_client.on_message = on_message
    await indexer_socket_client.connect()


@pytest.mark.asyncio
async def test_subaccounts(indexer_socket_client, test_address):
    subaccounts_channel_name = indexer_socket_client.subaccounts.channel

    def on_message(ws, message):
        message_dict = json.loads(message)
        if message_dict["type"] == "connected":
            ws.subaccounts.subscribe(address=test_address, subaccount_number=0)
        elif message_dict["type"] == "subscribed":
            assert message_dict["channel"] == subaccounts_channel_name
            assert "subaccount" in message_dict["contents"]
            ws.subaccounts.unsubscribe(address=test_address, subaccount_number=0)
            ws.close()
        else:
            ws.close()
            assert False, f"Unexpected message: {message_dict}"

    indexer_socket_client.on_message = on_message
    await indexer_socket_client.connect()
