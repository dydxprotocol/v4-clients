
"""Utils."""

import json
from typing import Any


class JSONEncoder(json.JSONEncoder):
    """JSONEncoder subclass that encode basic python objects."""  # noqa: D401

    def default(self, o: Any) -> Any:
        """Default json encode."""  # noqa: D401
        if not hasattr(o, "__json__"):
            return super().default(o)
        if callable(o.__json__):
            return o.__json__()
        return o.__json__


def json_encode(data, **kwargs):
    """Json encode."""
    return JSONEncoder(**kwargs).encode(data)
