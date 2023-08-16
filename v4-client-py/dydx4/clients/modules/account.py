
from ..helpers.request_helpers import generate_query_path
from ..helpers.requests import request, Response
from ..constants import DEFAULT_API_TIMEOUT

class Account(object):
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
            api_timeout = self.api_timeout,
        )

    # ============ Requests ============

    def get_subaccounts(
        self,
        address: str,
        limit: int = None,
    ) -> Response:
        '''
        Get subaccounts

        :param limit: optional
        :type limit: number

        :returns: Array of subaccounts for a dYdX address

        :raises: DydxAPIError
        '''
        path = '/'.join(['/v4/addresses', address])
        return self._get(
            path,
            {
                'limit': limit,
            },
        )

    def get_subaccount(
        self,
        address: str,
        subaccount_number: int,
    ) -> Response:
        '''
        Get subaccount given a subaccountNumber

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :returns: subaccount of a dYdX address

        :raises: DydxAPIError
        '''
        path = '/'.join(['/v4/addresses', address, 'subaccountNumber', str(subaccount_number)])
        return self._get(
            path,
            {
            },
        )

    def get_subaccount_perpetual_positions(
        self,
        address: str,
        subaccount_number: int,
        status: str = None,
        limit: int = None,
        created_before_or_at_height: int = None,
        created_before_or_at_time: str = None,
    ) -> Response:
        '''
        Get perpetual positions

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param status: optional
        :type status: str in list [
            "OPEN",
            "CLOSED",
            "LIQUIDATED",
            ...
        ]

        :param limit: optional
        :type limit: number

        :param created_before_or_at_height: optional
        :type created_before_or_at_height: number

        :param created_before_or_at_time: optional
        :type created_before_or_at_time: ISO str

        :returns: Array of perpetual positions

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/perpetualPositions',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'status': status,
                'limit': limit,
                'createdBeforeOrAtHeight': created_before_or_at_height,
                'createdBeforeOrAt': created_before_or_at_time,
            },
        )

    def get_subaccount_asset_positions(
        self,
        address: str,
        subaccount_number: int,
        status: str = None,
        limit: int = None,
        created_before_or_at_height: int = None,
        created_before_or_at_time: str = None,
    ) -> Response:
        '''
        Get asset positions

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param status: optional
        :type status: str in list [
            "OPEN",
            "CLOSED",
            "LIQUIDATED",
            ...
        ]

        :param limit: optional
        :type limit: number

        :param created_before_or_at_height: optional
        :type created_before_or_at_height: number

        :param created_before_or_at_time: optional
        :type created_before_or_at_time: ISO str

        :returns: Array of asset positions

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/assetPositions',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'status': status,
                'limit': limit,
                'createdBeforeOrAtHeight': created_before_or_at_height,
                'createdBeforeOrAt': created_before_or_at_time,
            },
        )
    
    def get_subaccount_transfers(
        self,
        address: str,
        subaccount_number: int,
        limit: int = None,
        created_before_or_at_height: int = None,
        created_before_or_at_time: str = None,
    ) -> Response:
        '''
        Get asset transfers record

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param limit: optional
        :type limit: number

        :param created_before_or_at_height: optional
        :type created_before_or_at_height: number

        :param created_before_or_at_time: optional
        :type created_before_or_at_time: ISO str

        :returns: Array of transfers

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/transfers',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'limit': limit,
                'createdBeforeOrAtHeight': created_before_or_at_height,
                'createdBeforeOrAt': created_before_or_at_time,
            },
        )
    
    def get_subaccount_orders(
        self,
        address: str,
        subaccount_number: int,
        ticker: str = None,
        ticker_type: str = 'PERPETUAL',
        side: str = None,
        status: str = None,
        type: str = None,
        limit: int = None,
        good_til_block_before_or_at: int = None,
        good_til_block_time_before_or_at: str = None,
        return_latest_orders: bool = None
    ) -> Response:
        '''
        Get asset transfers record

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param ticker: optional
        :type ticker: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :param ticker_type: optional
        :type ticker_type: str in list [
            "PERPETUAL",
            "ASSET",
        ]

        :param side: optional
        :type side: str in list [
            "BUY",
            "SELL",
        ]

        :param status: optional
        :type status: str in list [
            ...
        ]

        :param type: optional
        :type type: str in list [
            "MARKET",
            "LIMIT",
            ...
        ]

        :param limit: optional
        :type limit: number

        :param good_til_block_before_or_at: optional
        :type good_til_block_before_or_at: number

        :param good_til_block_time_before_or_at: optional
        :type good_til_block_time_before_or_at: ISO str

        :param return_latest_orders: optional
        :type return_latest_orders: boolean

        :returns: Array of orders

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/orders',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'ticker': ticker,
                'tickerType': ticker_type,
                'side': side,
                'status': status,
                'type': type,
                'limit': limit,
                'goodTilBlockBeforeOrAt': good_til_block_before_or_at,
                'goodTilBlockTimeBeforeOrAt': good_til_block_time_before_or_at,
                'returnLatestOrders': return_latest_orders,
            },
        )
    
    def get_order(
        self,
        order_id: str
    ) -> Response:
        '''
        Get asset transfers record

        :param order_id: required
        :type order_id: str

        :returns: Order

        :raises: DydxAPIError
        '''

        path = '/'.join(['/v4/orders', order_id])
        return self._get(
            path,
            {
            },
        )
    

    def get_subaccount_fills(
        self,
        address: str,
        subaccount_number: int,
        ticker: str = None,
        ticker_type: str = None,
        limit: int = None,
        created_before_or_at_height: int = None,
        created_before_or_at_time: str = None,
    ) -> Response:
        '''
        Get asset transfers record

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param ticker: optional
        :type ticker: str in list [
            "BTC-USD",
            "ETH-USD",
            "LINK-USD",
            ...
        ]

        :param ticker_type: optional
        :type ticker_type: str in list [
            "PERPETUAL",
            "ASSET",
        ]

        :param limit: optional
        :type limit: number

        :param created_before_or_at_height: optional
        :type created_before_or_at_height: number

        :param created_before_or_at_time: optional
        :type created_before_or_at_time: ISO str

        :returns: Array of fills

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/fills',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'market': ticker,
                'marketType': ticker_type,
                'limit': limit,
                'createdBeforeOrAtHeight': created_before_or_at_height,
                'createdBeforeOrAt': created_before_or_at_time,
            },
        )
    
    def get_subaccount_funding(
        self,
        address: str,
        subaccount_number: int,
        limit: int = None,
        created_before_or_at_height: int = None,
        created_before_or_at_time: str = None,
    ) -> Response:
        '''
        Get asset transfers record

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param limit: optional
        :type limit: number

        :param created_before_or_at_height: optional
        :type created_before_or_at_height: number

        :param created_before_or_at_time: optional
        :type created_before_or_at_time: ISO str

        :returns: Array of funding payments

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/funding',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'limit': limit,
                'createdBeforeOrAtHeight': created_before_or_at_height,
                'createdBeforeOrAt': created_before_or_at_time,
            },
        )
    

    def get_subaccount_historical_pnls(
        self,
        address: str,
        subaccount_number: int,
        effective_before_or_at: str = None,
        effective_at_or_after: str = None,
    ) -> Response:
        '''
        Get asset transfers record

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param effective_before_or_at: optional
        :type effective_before_or_at: ISO str

        :param effective_at_or_after: optional
        :type effective_at_or_after: ISO str

        :returns: Array of historical PNL

        :raises: DydxAPIError
        '''
        return self._get(
            '/v4/historical-pnl',
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'effectiveBeforeOrAt': effective_before_or_at,
                'effectiveAtOrAfter': effective_at_or_after,
            },
        )