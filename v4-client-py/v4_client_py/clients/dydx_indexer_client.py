from .constants import DEFAULT_API_TIMEOUT, IndexerConfig
from .modules.account import Account
from .modules.markets import Markets

class IndexerClient(object):
    def __init__(
        self,
        config: IndexerConfig,
        api_timeout = None,
        send_options = None,
    ):
        self.config = config
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT
        self.send_options = send_options or {}

        # Initialize the markets and account module.
        self._markets = Markets(config.rest_endpoint)
        self._account = Account(config.rest_endpoint)


    @property
    def markets(self) -> Markets:
        '''
        Get the public module, used for interacting with public endpoints.
        '''
        return self._markets

    @property
    def account(self) -> Account:
        '''
        Get the private module, used for interacting with endpoints that
        require dYdX address.
        '''
        return self._account
