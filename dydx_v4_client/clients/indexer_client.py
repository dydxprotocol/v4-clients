from typing import Optional

from .constants import DEFAULT_API_TIMEOUT, IndexerConfig
from .modules.account import AccountClient
from .modules.markets import MarketsClient
from .modules.utility import UtilityClient


class IndexerClient:
    """
    Client for Indexer
    """

    def __init__(self, config: IndexerConfig, api_timeout: Optional[float] = None):
        self.config = config
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT
        self._markets = MarketsClient(config.rest_endpoint, self.api_timeout)
        self._account = AccountClient(config.rest_endpoint, self.api_timeout)
        self._utility = UtilityClient(config.rest_endpoint, self.api_timeout)

    @property
    def markets(self) -> MarketsClient:
        """
        Get the public module, used for interacting with public endpoints.

        Returns:
            The public module
        """
        return self._markets

    @property
    def account(self) -> AccountClient:
        """
        Get the private module, used for interacting with private endpoints.

        Returns:
            The private module
        """
        return self._account

    @property
    def utility(self) -> UtilityClient:
        """
        Get the utility module, used for interacting with non-market public endpoints.
        """
        return self._utility
