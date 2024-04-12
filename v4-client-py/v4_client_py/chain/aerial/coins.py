
"""Parse the coins."""

import re
from typing import List

from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin

def parse_coins(value: str) -> List[Coin]:
    """Parse the coins.

    :param value: coins
    :raises RuntimeError: If unable to parse the value
    :return: coins
    """
    coins = []

    parts = re.split(r",\s*", value)
    for part in parts:
        part = part.strip()
        if part == "":
            continue

        match = re.match(r"(\d+)(\w+)", part)
        if match is None:
            raise RuntimeError(f"Unable to parse value {part}")

        # extract out the groups
        amount, denom = match.groups()
        coins.append(Coin(amount=amount, denom=denom))

    return coins
