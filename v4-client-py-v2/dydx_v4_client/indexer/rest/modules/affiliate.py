from typing import Any, Optional

from dydx_v4_client.indexer.rest.shared.rest import RestClient

class AffiliateClient(RestClient):

    async def get_metadata(self, address: str) -> Any:
        """
        Get affiliate metadata.

        Args:
            address (str): Account address

        Returns:
            Any: Affiliate metadata of the address
        """
        uri = "/v4/affiliates/metadata"

        return await self.get(
            uri,
            params={
                "address": address
            }
        )