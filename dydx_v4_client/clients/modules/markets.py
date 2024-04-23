from typing import Optional

from dydx_v4_client.clients.constants import TimePeriod
from dydx_v4_client.clients.shared.rest import RestClient


class MarketsClient(RestClient):
    async def get_perpetual_markets(self, market: Optional[str] = None) -> dict:
        uri = "/v4/perpetualMarkets"
        return await self.get(uri, params={"ticker": market})

    async def get_perpetual_market_orderbook(self, market: str) -> dict:
        uri = f"/v4/orderbooks/perpetualMarket/{market}"
        return await self.get(uri)

    async def get_perpetual_market_trades(
        self,
        market: str,
        starting_before_or_at_height: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> dict:
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
        uri = "/v4/sparklines"
        return await self.get(uri, params={"timePeriod": period})
