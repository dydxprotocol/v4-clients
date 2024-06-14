from typing import Any, Optional

from dydx_v4_client.indexer.rest.shared.rest import RestClient

from ..constants import (
    OrderSide,
    OrderStatus,
    OrderType,
    PositionStatus,
    TickerType,
    TradingRewardAggregationPeriod,
)


class AccountClient(RestClient):

    async def get_subaccounts(
        self,
        address: str,
        limit: Optional[int] = None,
    ) -> Any:
        """
        Retrieves subaccounts for the specified address.

        Args:
            address (str): The address.
            limit (Optional[int]): The maximum number of subaccounts to retrieve.

        Returns:
            Any: The subaccounts data.
        """
        uri = f"/v4/addresses/{address}"
        return await self.get(uri, params={"limit": limit})

    async def get_subaccount(
        self,
        address: str,
        subaccount_number: int,
    ) -> Any:
        """
        Retrieves a specific subaccount for the specified address and subaccount number.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.

        Returns:
            Any: The subaccount data.
        """
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
        """
        Retrieves perpetual positions for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            status (Optional[PositionStatus]): The position status filter.
            limit (Optional[int]): The maximum number of positions to retrieve.
            created_before_or_at_height (Optional[int]): The block height filter for positions created before or at.
            created_before_or_at (Optional[str]): The timestamp filter for positions created before or at.

        Returns:
            Any: The perpetual positions data.
        """
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
        """
        Retrieves asset positions for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            status (Optional[PositionStatus]): The position status filter.
            limit (Optional[int]): The maximum number of positions to retrieve.
            created_before_or_at_height (Optional[int]): The block height filter for positions created before or at.
            created_before_or_at (Optional[str]): The timestamp filter for positions created before or at.

        Returns:
            Any: The asset positions data.
        """
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
        """
        Retrieves transfers for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            limit (Optional[int]): The maximum number of transfers to retrieve.
            created_before_or_at_height (Optional[int]): The block height filter for transfers created before or at.
            created_before_or_at (Optional[str]): The timestamp filter for transfers created before or at.

        Returns:
            Any: The transfers data.
        """
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
        """
        Retrieves orders for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            ticker (Optional[str]): The ticker filter.
            ticker_type (TickerType): The ticker type filter.
            side (Optional[OrderSide]): The order side filter.
            status (Optional[OrderStatus]): The order status filter.
            type (Optional[OrderType]): The order type filter.
            limit (Optional[int]): The maximum number of orders to retrieve.
            good_til_block_before_or_at (Optional[int]): The block number filter for orders good until before or at.
            good_til_block_time_before_or_at (Optional[str]): The timestamp filter for orders good until before or at.
            return_latest_orders (Optional[bool]): Whether to return only the latest orders.

        Returns:
            Any: The orders data.
        """
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
        """
        Retrieves a specific order by its ID.

        Args:
            order_id (str): The order ID.

        Returns:
            Any: The order data.
        """
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
        """
        Retrieves fills for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            ticker (Optional[str]): The ticker filter.
            ticker_type (TickerType): The ticker type filter.
            limit (Optional[int]): The maximum number of fills to retrieve.
            created_before_or_at_height (Optional[int]): The block height filter for fills created before or at.
            created_before_or_at (Optional[str]): The timestamp filter for fills created before or at.

        Returns:
            Any: The fills data.
        """
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
        """
        Retrieves historical PnLs for a specific subaccount.

        Args:
            address (str): The address.
            subaccount_number (int): The subaccount number.
            effective_before_or_at (Optional[str]): The timestamp filter for PnLs effective before or at.
            effective_at_or_after (Optional[str]): The timestamp filter for PnLs effective at or after.

        Returns:
            Any: The historical PnLs data.
        """
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

    async def get_historical_block_trading_rewards(
        self,
        address: str,
        limit: Optional[int] = None,
    ) -> Any:
        """
        Retrieves historical block trading rewards for the specified address.

        Args:
            address (str): The address.
            limit (Optional[int]): The maximum number of rewards to retrieve.

        Returns:
            Any: The historical block trading rewards data.
        """
        uri = f"/v4/historicalBlockTradingRewards/{address}"
        return await self.get(uri, params={"limit": limit})

    async def get_historical_trading_rewards_aggregated(
        self,
        address: str,
        period: TradingRewardAggregationPeriod = TradingRewardAggregationPeriod.DAILY,
        limit: Optional[int] = None,
        starting_before_or_at: Optional[str] = None,
        starting_before_or_at_height: Optional[int] = None,
    ) -> Any:
        """
        Retrieves aggregated historical trading rewards for the specified address.

        Args:
            address (str): The address.
            period (TradingRewardAggregationPeriod): The aggregation period.
            limit (Optional[int]): The maximum number of aggregated rewards to retrieve.
            starting_before_or_at (Optional[str]): The timestamp filter for rewards starting before or at.
            starting_before_or_at_height (Optional[int]): The block height filter for rewards starting before or at.

        Returns:
            Any: The aggregated historical trading rewards data.
        """
        uri = f"/v4/historicalTradingRewardAggregations/{address}"
        params = {
            "period": period,
            "limit": limit,
            "startingBeforeOrAt": starting_before_or_at,
            "startingBeforeOrAtHeight": starting_before_or_at_height,
        }
        return await self.get(uri, params=params)
