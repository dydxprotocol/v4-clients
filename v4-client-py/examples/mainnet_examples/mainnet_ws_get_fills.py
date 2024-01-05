import asyncio
import json

from v4_client_py.clients.dydx_socket_client import SocketClient
from v4_client_py.clients.constants import Network

ADDRESS = "<place your ADDRESS here>"

def for_fills(fills_data):
    try:
        for fill in fills_data:
            print("Received fill:", fill)
    except Exception as e:
        print(e)


def check_fills(message_data):
    try:
        if "contents" in message_data and "fills" in message_data["contents"]:
            if fills_data := message_data["contents"]["fills"]:
                for_fills(fills_data)
            else:
                print("No fills information in the message.")
        else:
            print("No 'contents' or 'fills' key in the message.")
    except Exception as e:
        print(e)


def on_open(ws):
    print("WebSocket connection opened")
    ws.send_ping_if_inactive_for(30)


def on_message(ws, message):
    print(message)
    payload = json.loads(message)
    if payload["type"] == "connected":
        my_ws.subscribe_to_subaccount(ADDRESS, 0)
    else:
        check_fills(payload)
    ws.send_ping_if_inactive_for(30)
    ws.subscribe_to_markets()


def on_close(ws):
    print("WebSocket connection closed")


async def main():
    try:
        my_ws.connect()
    except Exception as e:
        print(f"An error occurred: {e}")


# Run the event loop forever
if __name__ == "__main__":
    my_ws = SocketClient(
        config=Network.mainnet().indexer_config, on_message=on_message, on_open=on_open, on_close=on_close
    )
    print(my_ws)

    asyncio.get_event_loop().run_until_complete(main())
