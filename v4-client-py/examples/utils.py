from enum import Enum
import json
import os
from typing import Tuple

from v4_client_py.clients.helpers.chain_helpers import Order_TimeInForce, is_order_flag_stateful_order


def loadJson(filename):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_directory, filename)

    with open(json_file_path, "r") as file:
        return json.load(file)


class HumanReadableOrderTimeInForce(Enum):
    DEFAULT = "DEFAULT"
    FOK = "FOK"
    IOC = "IOC"
    POST_ONLY = "POST_ONLY"


def orderExecutionToTimeInForce(orderExecution: HumanReadableOrderTimeInForce) -> Order_TimeInForce:
    if orderExecution == HumanReadableOrderTimeInForce.DEFAULT.value:
        return Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED
    elif orderExecution == HumanReadableOrderTimeInForce.FOK.value:
        return Order_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
    elif orderExecution == HumanReadableOrderTimeInForce.IOC.value:
        return Order_TimeInForce.TIME_IN_FORCE_IOC
    elif orderExecution == HumanReadableOrderTimeInForce.POST_ONLY.value:
        return Order_TimeInForce.TIME_IN_FORCE_POST_ONLY
    else:
        raise ValueError("Unrecognized order execution")
