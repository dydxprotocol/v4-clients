from typing import Any, Optional

from dydx_v4_client.clients.shared.rest import RestClient

from ..constants import OrderSide, OrderStatus, OrderType, PositionStatus, TickerType


class AccountClient(RestClient):
    async def get_subaccounts(
        self,
        address: str,
        limit: Optional[int] = None,
    ) -> Any:
        uri = f"/v4/addresses/{address}"
        return await self.get(uri, params={"limit": limit})

    async def get_subaccount(
        self,
        address: str,
        subaccount_number: int,
    ) -> Any:
        uri = f"/v4/addresses/{address}/subaccountNumber/{subaccount_number}"
        return await self.get(uri)

    async def get_subaccount_perpetual_positions(
        self,
        address: str,
        subaccount_number: int,
        status: Optional[PositionStatus] = None,
        limit: Optional[int] = None,
        created_before_or_at_height: Optional[int] = None,
        created_before_or_at: Optional[str] = None,
    ) -> Any:
        uri = "/v4/perpetualPositions"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "status": status,
                "limit": limit,
                "createdBeforeOrAtHeight": created_before_or_at_height,
                "createdBeforeOrAt": created_before_or_at,
            },
        )

    async def get_subaccount_asset_positions(
        self,
        address: str,
        subaccount_number: int,
        status: Optional[PositionStatus] = None,
        limit: Optional[int] = None,
        created_before_or_at_height: Optional[int] = None,
        created_before_or_at: Optional[str] = None,
    ) -> Any:
        uri = "/v4/assetPositions"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "status": status,
                "limit": limit,
                "createdBeforeOrAtHeight": created_before_or_at_height,
                "createdBeforeOrAt": created_before_or_at,
            },
        )

    async def get_subaccount_transfers(
        self,
        address: str,
        subaccount_number: int,
        limit: Optional[int] = None,
        created_before_or_at_height: Optional[int] = None,
        created_before_or_at: Optional[str] = None,
    ) -> Any:
        uri = "/v4/transfers"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "limit": limit,
                "createdBeforeOrAtHeight": created_before_or_at_height,
                "createdBeforeOrAt": created_before_or_at,
            },
        )

    async def get_subaccount_orders(
        self,
        address: str,
        subaccount_number: int,
        ticker: Optional[str] = None,
        ticker_type: TickerType = TickerType.PERPETUAL,
        side: Optional[OrderSide] = None,
        status: Optional[OrderStatus] = None,
        type: Optional[OrderType] = None,
        limit: Optional[int] = None,
        good_til_block_before_or_at: Optional[int] = None,
        good_til_block_time_before_or_at: Optional[str] = None,
        return_latest_orders: Optional[bool] = None,
    ) -> Any:
        uri = "/v4/orders"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "ticker": ticker,
                "tickerType": ticker_type,
                "side": side,
                "status": status,
                "type": type,
                "limit": limit,
                "goodTilBlockBeforeOrAt": good_til_block_before_or_at,
                "goodTilBlockTimeBeforeOrAt": good_til_block_time_before_or_at,
                "returnLatestOrders": return_latest_orders,
            },
        )

    async def get_order(self, order_id: str) -> Any:
        uri = f"/v4/orders/{order_id}"
        return await self.get(uri)

    async def get_subaccount_fills(
        self,
        address: str,
        subaccount_number: int,
        ticker: Optional[str] = None,
        ticker_type: TickerType = TickerType.PERPETUAL,
        limit: Optional[int] = None,
        created_before_or_at_height: Optional[int] = None,
        created_before_or_at: Optional[str] = None,
    ) -> Any:
        uri = "/v4/fills"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "ticker": ticker,
                "tickerType": ticker_type,
                "limit": limit,
                "createdBeforeOrAtHeight": created_before_or_at_height,
                "createdBeforeOrAt": created_before_or_at,
            },
        )

    async def get_subaccount_historical_pnls(
        self,
        address: str,
        subaccount_number: int,
        effective_before_or_at: Optional[str] = None,
        effective_at_or_after: Optional[str] = None,
    ) -> Any:
        uri = "/v4/historical-pnl"
        return await self.get(
            uri,
            params={
                "address": address,
                "subaccountNumber": subaccount_number,
                "effectiveBeforeOrAt": effective_before_or_at,
                "effectiveAtOrAfter": effective_at_or_after,
            },
        )
