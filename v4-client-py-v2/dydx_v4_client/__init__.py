from enum import IntEnum


class OrderFlags(IntEnum):
    SHORT_TERM = 0
    LONG_TERM = 64
    CONDITIONAL = 32


MAX_CLIENT_ID = 2**32 - 1
