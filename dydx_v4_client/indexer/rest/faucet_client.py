from typing import Dict, Optional

import httpx

from dydx_v4_client.indexer.rest.constants import DEFAULT_API_TIMEOUT
from dydx_v4_client.indexer.rest.shared.rest import RestClient


class FaucetClient(RestClient):
    def __init__(self, faucet_url: str, api_timeout: Optional[float] = None):
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT
        super().__init__(faucet_url, self.api_timeout)

    async def fill(
        self,
        address: str,
        subaccount_number: int,
        amount: float,
        headers: Optional[Dict] = None,
    ) -> httpx.Response:
        """
        If testnet, add USDC to a subaccount.
        """
        uri = "/faucet/tokens"
        body = {
            "address": address,
            "subaccountNumber": subaccount_number,
            "amount": amount,
        }
        return await self.post(uri, body=body, headers=headers or {})

    async def fill_native(
        self,
        address: str,
        headers: Optional[Dict] = None,
    ) -> httpx.Response:
        """
        If testnet, add USDC to address.
        """

        uri = "/faucet/native-token"
        body = {
            "address": address,
        }
        return await self.post(uri, body=body, headers=headers or {})
