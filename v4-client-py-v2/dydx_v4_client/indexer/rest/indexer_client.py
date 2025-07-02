from typing import Optional

from .constants import DEFAULT_API_TIMEOUT
from .modules.account import AccountClient
from .modules.markets import MarketsClient
from .modules.status import StatusClient
from .modules.vaults import MegaVaultClient
from .modules.affiliate import AffiliateClient


class IndexerClient:
    """
    Client for Indexer
    """

    def __init__(self, host: str, api_timeout: Optional[float] = None):
        api_timeout = api_timeout or DEFAULT_API_TIMEOUT
        self._markets = MarketsClient(host, api_timeout)
        self._account = AccountClient(host, api_timeout)
        self._status = StatusClient(host, api_timeout)
        self._megavault = MegaVaultClient(host, api_timeout)
        self._affiliates = AffiliateClient(host, api_timeout)

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
    def utility(self) -> StatusClient:
        """
        Get the status module, used for interacting with non-market public endpoints.
        """
        return self._status

    @property
    def megavault(self) -> MegaVaultClient:
        """
        Get the megavault module
        """
        return self._megavault

    @property
    def affiliate(self) -> AffiliateClient:
        """
        Get the affiliate module
        """
        return self._affiliates
