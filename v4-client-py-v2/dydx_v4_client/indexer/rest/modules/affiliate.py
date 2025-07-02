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

        return await self.get(uri, params={"address": address})

    async def get_address(self, referral_code: str) -> Any:
        """
        Get affiliate address

        Args:
            referral_code (str): Referral code

        Returns:
            Any: Affiliate address of the referral code
        """
        uri = "/v4/affiliates/address"

        return await self.get(uri, params={"referralCode": referral_code})

    async def get_snapshot(
        self,
        address_filter: Optional[str] = None,
        sort_by_affiliate_earnings: Optional[bool] = False,
        limit: Optional[int] = 10,
        offset: Optional[int] = 0,
    ) -> Any:
        """
        Get affiliate snapshot

        Args:
            address_filter (Optional[str]): Address to filter the snapshot
            sort_by_affiliate_earnings (Optional[bool]): Sorting criteria based on affiliate earning
            limit (Optional[int]): Number of maximum result
            offset (Optional[int]): Offset filter

        Returns:
            Any: Snapshot based on the filters
        """
        uri = "/v4/affiliates/snapshot"

        return await self.get(
            uri,
            params={
                "addressFilter": address_filter,
                "sortByAffiliateEarnings": sort_by_affiliate_earnings,
                "limit": limit,
                "offset": offset,
            },
        )

    async def get_total_volume(self, address: str) -> Any:
        """
        Get affiliate total volume.

        Args:
            address (str): The address

        Returns:
            Any: Total affiliate volume of the address associated account
        """
        uri = "/v4/affiliates/total_volume"
        return await self.get(uri, params={"address": address})
