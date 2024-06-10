from typing import Optional

from dydx_v4_client.indexer.rest.constants import TimePeriod
from dydx_v4_client.indexer.rest.shared.rest import RestClient


class MarketsClient(RestClient):

    async def get_perpetual_markets(self, market: Optional[str] = None) -> dict:
        """
        Retrieves perpetual markets.

        Args:
            market (Optional[str]): The specific market ticker to retrieve. If not provided, all markets are returned.

        Returns:
            dict: The perpetual markets data.
        """
        uri = "/v4/perpetualMarkets"
        return await self.get(uri, params={"ticker": market})

    async def get_perpetual_market_orderbook(self, market: str) -> dict:
        """
        Retrieves the orderbook for a specific perpetual market.

        Args:
            market (str): The market ticker.

        Returns:
            dict: The orderbook data.
        """
        uri = f"/v4/orderbooks/perpetualMarket/{market}"
        return await self.get(uri)

    async def get_perpetual_market_trades(
        self,
        market: str,
        starting_before_or_at_height: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> dict:
        """
        Retrieves trades for a specific perpetual market.

        Args:
            market (str): The market ticker.
            starting_before_or_at_height (Optional[int]): The block height to start retrieving trades from.
            limit (Optional[int]): The maximum number of trades to retrieve.

        Returns:
            dict: The trades data.
        """
        uri = f"/v4/trades/perpetualMarket/{market}"
        return await self.get(
            uri,
            params={
                "createdBeforeOrAtHeight": starting_before_or_at_height,
                "limit": limit,
            },
        )

    async def get_perpetual_market_candles(
        self,
        market: str,
        resolution: str,
        from_iso: Optional[str] = None,
        to_iso: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> dict:
        """
        Retrieves candle data for a specific perpetual market.

        Args:
            market (str): The market ticker.
            resolution (str): The candle resolution (e.g., "1DAY", "1HOUR", "1MIN").
            from_iso (Optional[str]): The start timestamp in ISO format.
            to_iso (Optional[str]): The end timestamp in ISO format.
            limit (Optional[int]): The maximum number of candles to retrieve.

        Returns:
            dict: The candle data.
        """
        uri = f"/v4/candles/perpetualMarkets/{market}"
        return await self.get(
            uri,
            params={
                "resolution": resolution,
                "fromISO": from_iso,
                "toISO": to_iso,
                "limit": limit,
            },
        )

    async def get_perpetual_market_historical_funding(
        self,
        market: str,
        effective_before_or_at: Optional[str] = None,
        effective_before_or_at_height: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> dict:
        """
        Retrieves historical funding rates for a specific perpetual market.

        Args:
            market (str): The market ticker.
            effective_before_or_at (Optional[str]): The timestamp to retrieve funding rates effective before or at.
            effective_before_or_at_height (Optional[int]): The block height to retrieve funding rates effective before or at.
            limit (Optional[int]): The maximum number of funding rates to retrieve.

        Returns:
            dict: The historical funding rates data.
        """
        uri = f"/v4/historicalFunding/{market}"
        return await self.get(
            uri,
            params={
                "effectiveBeforeOrAt": effective_before_or_at,
                "effectiveBeforeOrAtHeight": effective_before_or_at_height,
                "limit": limit,
            },
        )

    async def get_perpetual_market_sparklines(
        self, period: str = TimePeriod.ONE_DAY
    ) -> dict:
        """
        Retrieves sparkline data for perpetual markets.

        Args:
            period (str): The time period for the sparkline data (e.g., "ONE_DAY", "SEVEN_DAYS").

        Returns:
            dict: The sparkline data.
        """
        uri = "/v4/sparklines"
        return await self.get(uri, params={"timePeriod": period})
