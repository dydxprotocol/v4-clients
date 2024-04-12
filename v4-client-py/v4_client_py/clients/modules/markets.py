from ..constants import DEFAULT_API_TIMEOUT
from ..helpers.request_helpers import generate_query_path
from ..helpers.requests import request, Response

class Markets(object):
    def __init__(
        self,
        indexerHost,
        api_timeout = None,
    ):
        self.host = indexerHost
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT

    # ============ Request Helpers ============

    def _get(self, request_path, params = {}) -> Response:
        return request(
            generate_query_path(self.host + request_path, params),
            'get',
            api_timeout=self.api_timeout,
        )

    # ============ Requests ============

    def get_perpetual_markets(self, market: str = None) -> Response:
        '''
        Get one or perpetual markets

        :param market: optional
        :type market: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :returns: Market array

        :raises: DydxAPIError
        '''
        uri = '/v4/perpetualMarkets'
        return self._get(uri, {
            'ticker': market,
        })

    def get_perpetual_market_orderbook(self, market: str) -> Response:
        '''
        Get orderbook for a perpetual market

        :param market: required
        :type market: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :returns: Object containing bid array and ask array of open orders
        for a market

        :raises: DydxAPIError
        '''
        uri = '/'.join(['/v4/orderbooks/perpetualMarket', market])
        return self._get(uri)

    def get_perpetual_market_trades(
        self, 
        market: str, 
        starting_before_or_at_height: int = None, 
        limit: int = None
    ) -> Response:
        '''
        Get trades for a perpetual market

        :param market: required
        :type market: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :param starting_before_or_at_height: optional
        :type starting_before_or_at_height: number

        :returns: Trade array

        :raises: DydxAPIError
        '''
        uri = '/'.join(['/v4/trades/perpetualMarket', market])
        return self._get(
            uri,
            {'createdBeforeOrAtHeight': starting_before_or_at_height, 'limit': limit},
        )

    def get_perpetual_market_candles(
        self,
        market: str,
        resolution: str,
        from_iso: str = None,
        to_iso: str = None,
        limit: int = None,
    ) -> Response:
        '''
        Get Candles

        :param market: required
        :type market: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :param resolution: required
        :type resolution: str in list [
            "ONE_MINUTE",
            "FIVE_MINUTES",
            "FIFTEEN_MINUTES",
            "THIRTY_MINUTES",
            "ONE_HOUR",
            "FOUR_HOURS",
            "ONE_DAY",
        ]

        :param from_iso: optional
        :type from_iso: ISO str

        :param to_iso: optional
        :type to_iso: ISO str

        :param limit: optional
        :type limit: number

        :returns: Array of candles

        :raises: DydxAPIError
        '''
        uri = '/'.join(['/v4/candles/perpetualMarkets', market])
        return self._get(
            uri,
            {
                'resolution': resolution,
                'fromISO': from_iso,
                'toISO': to_iso,
                'limit': limit,
            },
        )

    def get_perpetual_market_funding(
        self,
        market: str,
        effective_before_or_at: str = None,
        effective_before_or_at_height: int = None,
        limit: int = None,
    ) -> Response:
        '''
        Get Candles

        :param market: required
        :type market: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :param effective_before_or_at: optional
        :type effective_before_or_at: ISO str

        :param effective_before_or_at_height: optional
        :type effective_before_or_at_height: number

        :param limit: optional
        :type limit: number

        :returns: Array of candles

        :raises: DydxAPIError
        '''
        uri = '/'.join(['/v4/historicalFunding', market])
        return self._get(
            uri,
            {
                'effectiveBeforeOrAt': effective_before_or_at,
                'effectiveBeforeOrAtHeight': effective_before_or_at_height,
                'limit': limit,
            },
        )
    
    def get_perpetual_markets_sparklines(
        self,
        period: str = 'ONE_DAY'
    ) -> Response:
        '''
        Get Sparklines

        :param period: required
        :type period: str in list [
            "ONE_DAY",
            "SEVEN_DAYS"
        ]

        :returns: Array of sparklines

        :raises: DydxAPIError
        '''
        uri = '/v4/sparklines'
        return self._get(
            uri,
            {
                'timePeriod': period,
            },
        )
