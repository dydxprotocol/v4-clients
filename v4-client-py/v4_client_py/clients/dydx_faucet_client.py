from .helpers.request_helpers import generate_query_path
from .helpers.requests import request, Response
from .constants import DEFAULT_API_TIMEOUT

class FaucetClient(object):
    def __init__(
        self,
        host,
        api_timeout = None,
    ):
        self.host = host
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT

    # ============ Request Helpers ============

    def _post(self, request_path, params = {}, body = {}) -> Response:
        return request(
            generate_query_path(self.host + request_path, params),
            'post',
            data_values = body,
            api_timeout = self.api_timeout,
        )

    # ============ Requests ============

    def fill(
        self,
        address: str,
        subaccount_number: int,
        amount: int,
    ) -> Response:
        '''
        fill account

        :param address: required
        :type address: str

        :param amount: required
        :type amount: int

        :returns: 

        :raises: DydxAPIError
        '''
        path = '/faucet/tokens'
        return self._post(
            path,
            {},
            {
                'address': address,
                'subaccountNumber': subaccount_number,
                'amount': amount,
            }
        )
    
    def fill_native(
            self,
            address: str,
    ) -> Response:
        '''
        fill account with native token

        :param address: required
        :type address: str

        :returns:

        :raises: DydxAPIError
        '''
        path = '/faucet/native-token'
        return self._post(
            path,
            {},
            {
                'address': address,
            }
        )
