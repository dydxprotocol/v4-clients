import asyncio

from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET

ETH_USD = "ETH-USD"

# Orderbook state. Levels are stored as [price, size, offset].
orderbook = {"bids": {}, "asks": {}}


def handler(ws: IndexerSocket, message: dict):
    if message["type"] == "connected":
        ws.order_book.subscribe(ETH_USD, False)
    elif message["channel"] == "v4_orderbook" and "contents" in message:
        # For full snapshot (initial subscribed message), reset the orderbook
        if message["type"] == "subscribed":
            orderbook["bids"] = {}
            orderbook["asks"] = {}

        # Process the orderbook data
        orderbook_update(message["contents"])

        # Print the orderbook (only 5 levels)
        print_orderbook(5)


def orderbook_update(contents):
    """Process orderbook data for both full snapshots and incremental updates"""
    # Process bids
    if "bids" in contents:
        for bid in contents["bids"]:
            process_price_level(bid, "bids")

    # Process asks
    if "asks" in contents:
        for ask in contents["asks"]:
            process_price_level(ask, "asks")

    # Uncross the orderbook after processing
    uncross_orderbook()


def process_price_level(level, side):
    """Process a single price level (bid or ask)"""
    if isinstance(level, dict):
        # Full snapshot format
        price = level["price"]
        size = level["size"]
        offset = level.get("offset", "0")
    else:
        # Incremental update format
        price = level[0]
        size = level[1]
        offset = level[2] if len(level) > 2 else "0"

    # Update or remove the price level
    if float(size) > 0:
        orderbook[side][price] = [price, size, offset]
    elif price in orderbook[side]:
        # Size of 0 means remove the price level
        del orderbook[side][price]


def get_sorted_book():
    """Get sorted lists of bids and asks"""
    # Convert dictionaries to lists
    bids_list = list(orderbook["bids"].values())
    asks_list = list(orderbook["asks"].values())

    bids_list.sort(key=lambda x: float(x[0]), reverse=True)
    asks_list.sort(key=lambda x: float(x[0]))

    return bids_list, asks_list


def uncross_orderbook():
    """Remove crossed orders from the orderbook"""
    bids_list, asks_list = get_sorted_book()

    # Check if orderbook is crossed
    if not bids_list or not asks_list:
        return

    top_bid = float(bids_list[0][0])
    top_ask = float(asks_list[0][0])

    while bids_list and asks_list and top_bid >= top_ask:
        bid = bids_list[0]
        ask = asks_list[0]

        bid_price = float(bid[0])
        ask_price = float(ask[0])
        bid_size = float(bid[1])
        ask_size = float(ask[1])
        bid_offset = int(bid[2]) if len(bid) > 2 else 0
        ask_offset = int(ask[2]) if len(ask) > 2 else 0

        if bid_price >= ask_price:
            if bid_offset < ask_offset:
                bids_list.pop(0)
            elif bid_offset > ask_offset:
                asks_list.pop(0)
            else:
                # Same offset, handle based on size
                if bid_size > ask_size:
                    # Ask is filled, reduce bid size
                    asks_list.pop(0)
                    bid[1] = str(bid_size - ask_size)
                elif bid_size < ask_size:
                    # Bid is filled, reduce ask size
                    ask[1] = str(ask_size - bid_size)
                    bids_list.pop(0)
                else:
                    # Both filled exactly
                    asks_list.pop(0)
                    bids_list.pop(0)
        else:
            # No crossing
            break

        # Update top prices if lists aren't empty
        if bids_list and asks_list:
            top_bid = float(bids_list[0][0])
            top_ask = float(asks_list[0][0])

    # Update the orderbook with uncrossed data
    orderbook["bids"] = {bid[0]: bid for bid in bids_list}
    orderbook["asks"] = {ask[0]: ask for ask in asks_list}


def print_orderbook(n: int):
    """Print n levels"""
    bids_list, asks_list = get_sorted_book()

    print(f"\n--- Orderbook for {ETH_USD} ---")

    # Get top n bids and asks
    top_bids = bids_list[:n] if bids_list else []
    top_asks = asks_list[:n] if asks_list else []

    width = 16

    # Header
    print(f"{'ASKS':=^{width*2}}")
    print(f"{'PRICE':<{width}} | {'SIZE':<{width}}")
    print("-" * (width * 2))

    # Asks
    for ask in reversed(top_asks):
        price = ask[0]
        size = ask[1]
        print(f"{price:<{width}} | {size:<{width}}")

    # Separator
    print(f"{'':-^{width*2}}")

    # Bids
    for bid in top_bids:
        price = bid[0]
        size = bid[1]
        print(f"{price:<{width}} | {size:<{width}}")

    print(f"{'BIDS':=^{width*2}}")
    print("")


async def test():
    await IndexerSocket(TESTNET.websocket_indexer, on_message=handler).connect()


if __name__ == "__main__":
    asyncio.run(test())
