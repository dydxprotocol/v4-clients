
import json
import os

from v4_client_py.clients.helpers.chain_helpers import Order_TimeInForce

def loadJson(filename):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_directory, filename)

    with open(json_file_path, "r") as file:
        return json.load(file)

def orderExecutionToTimeInForce(orderExecution: str) -> Order_TimeInForce:
    if orderExecution == "DEFAULT":
        return Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED
    elif orderExecution == "FOK":
        return Order_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
    elif orderExecution == "IOC":
        return Order_TimeInForce.TIME_IN_FORCE_IOC
    elif orderExecution == "POST_ONLY":
        return Order_TimeInForce.TIME_IN_FORCE_POST_ONLY
    else:
        raise ValueError('Unrecognized order execution')
