from typing import Dict

from dydx_v4_client.indexer.rest.shared.rest import RestClient


class StatusClient(RestClient):
    async def get_time(self) -> Dict[str, str]:
        """
        Get the current time of the Indexer.

        Returns:
            Dict[str, str]: A dictionary containing the isoString and epoch time.
        """
        uri = "/v4/time"
        return await self.get(uri)

    async def get_height(self) -> Dict[str, str]:
        """
        Get the block height of the most recent block processed by the Indexer.

        Returns:
            Dict[str, str]: A dictionary containing the block height and time.
        """
        uri = "/v4/height"
        return await self.get(uri)

    async def screen(self, address: str) -> Dict[str, bool]:
        """
        Screen an address to see if it is restricted.

        Args:
            address (str): The EVM or dYdX address to screen.

        Returns:
            Dict[str, bool]: A dictionary indicating whether the specified address is restricted.
        """
        uri = "/v4/screen"
        return await self.get(uri, params={"address": address})
