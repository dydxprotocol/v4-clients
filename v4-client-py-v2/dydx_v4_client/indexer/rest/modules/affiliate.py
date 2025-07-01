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

    async def get_address(self, referral_code: str) -> Any:
        """
        Get affiliate address

        Args:
            referral_code (str): Referral code

        Returns:
            Any: Affiliate address of the referral code
        """
        uri = "/v4/affiliates/address"

        return await self.get(
            uri,
            params={
                "referralCode": referral_code
            }
        )