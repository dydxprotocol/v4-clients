from enum import Enum


class CandlesResolution(Enum):
    ONE_MINUTE = "1MIN"
    FIVE_MINUTES = "5MINS"
    FIFTEEN_MINUTES = "15MINS"
    THIRTY_MINUTES = "30MINS"
    ONE_HOUR = "1HOUR"
    FOUR_HOURS = "4HOURS"
    ONE_DAY = "1DAY"
