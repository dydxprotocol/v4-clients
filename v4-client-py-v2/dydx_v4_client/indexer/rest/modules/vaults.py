from dydx_v4_client.indexer.rest.shared.rest import RestClient


class MegaVaultClient(RestClient):
    async def get_megavault_historical_pnl(self, resolution):
        """
        Retrieve megaVault historical PnL.

        Args:
            resolution (str): The time interval (hour/day)

        Returns:
            Any: List of megavault historical pnl
        """
        uri = f"/v4/vault/v1/megavault/historicalPnl"
        return await self.get(uri, params={"resolution": resolution})

    async def get_vaults_historical_pnl(self, resolution):
        """
        Retrieve vaults historical PnL.

        Args:
            resolution (str): The time interval (hour/day)

        Returns:
            Any: List of vault historical pnl
        """
        uri = f"/v4/vault/v1/vaults/historicalPnl"
        return await self.get(uri, params={"resolution": resolution})

    async def get_megavault_positions(self):
        """
        Retrieves megavault's current position

        Args:

        Returns:
            Any: Megavault position
        """
        uri = f"/v4/vault/v1/megavault/positions"
        return await self.get(uri)
