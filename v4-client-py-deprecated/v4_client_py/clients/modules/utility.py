from ..constants import DEFAULT_API_TIMEOUT
from ..helpers.request_helpers import generate_query_path
from ..helpers.requests import request, Response

class Utility(object):
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

    def get_time(self) -> Response:
        '''
        Get api server time as iso and as epoch in seconds with MS

        :returns: ISO string and Epoch number in seconds with MS of server time

        :raises: DydxAPIError
        '''
        uri = '/v4/time'
        return self._get(uri)


    def get_height(self) -> Response:
        '''
        Get indexer last block height

        :returns: last block height and block timestamp

        :raises: DydxAPIError
        '''
        uri = '/v4/height'
        return self._get(uri)
    
    def screen(self, address) -> Response:
        '''
        Screen an address to see if it is restricted

        :param address: required

        :returns: whether the specified address is restricted
        
        :raises: DydxAPIError
        '''
        uri = '/v4/screen'
        return self._get(uri, {
            'address': address,
        })
