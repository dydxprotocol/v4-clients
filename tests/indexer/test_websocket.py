# import time

import rel

def on_message(ws, message):
    if message["type"] == "connected":
        ws.order_book.subscribe("BTC-USD")
    if message["type"] == "channel_data":
        ws.order_book.unsubscribe("BTC-USD")
        ws.close()


async def test_order_book(websocket_indexer):
    await websocket_indexer(on_message=on_message)

    # with websocket_indexer as indexer:
    #     with indexer.order_book.subscribe("BTC-USD") as order_book:
    #         indexer.recv()
    #         current_orders = indexer.recv()
    #         print(current_orders)
    #         new_order = indexer.recv()
    #         print(new_order)
    #         time.sleep(5)
    #         print("IN")
    #     print("OUT")
    #     foo = indexer.recv()
    #     print(foo)
