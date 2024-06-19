## Comparison of Differences

### `Indexer` Coverage Analysis

This table compares the method names in the Python client with those found in the API documentation.

Symbols:
`=` - The method names are the same in both the client and API
`-` - The method is missing from the client library

| Method Name (sync client)          | API Method (docs)    | Method | Path                                 |
| ---------------------------------- | -------------------- | ------ | ------------------------------------ |
| get_subaccounts                    | GetAddress           | GET    | /addresses                           |
| get_subaccount                   = | GetSubaccount        | GET    | /addresses/{}/subaccountNumber/{}    |
| get_subaccount_asset_positions     | GetAssetPositions    | GET    | /assetPositions                      |
| get_perpetual_market_candles       | GetCandles           | GET    | /candles/perpetualMarkets            |
| get_screen                         | Screen               | GET    | /screen                              |
| get_subaccount_fills               | GetFills             | GET    | /fills                               |
| get_height                       = | GetHeight            | GET    | /height                              |
| get_perpetual_market_funding       | GetHistoricalFunding | GET    | /historicalFunding                   |
| get_subaccount_historical_pnls     | GetHistoricalPnl     | GET    | /historical-pnl                      |
| get_perpetual_market_orderbook     | GetPerpetualMarket   | GET    | /orderbooks/perpetualMarket          |
| get_subaccount_orders              | ListOrders           | GET    | /orders                              |
| get_order                        = | GetOrder             | GET    | /orders/{}                           |
| get_perpetual_markets              | ListPerpetualMarkets | GET    | /perpetualMarkets                    |
| get_subaccount_perpetual_positions | ListPositions        | GET    | /perpetualPositions                  |
| get_perpetual_markets_sparklines   | Get                  | GET    | /sparklines                          |
| get_time                         = | GetTime              | GET    | /time                                |
| get_perpetual_market_trades        | GetTrades            | GET    | /trades/perpetualMarket              |
| get_subaccount_transfers           | GetTransfers         | GET    | /transfers                           |
| - (no Py, no TS)                   | GetTradingRewards    | GET    | /historicalBlockTradingRewards       |
| - (no Py, no TS)                   | GetAggregations      | GET    | /historicalTradingRewardAggregations |

#### Categorization:

Should the methods be grouped into `Account`, `Market`, and `Utility` sections?

### Data Types Analysis

#### `MarketType`

- The `CROSS` enumeration option is not documented.

#### `PerpetualMarketResponse`

- The `openInterestLowerCap` and `openInterestUpperCap` fields are always empty and not documented. Are they new, optional, or obsolete?

#### `PerpetualPositionResponseObject`

- `subaccount_number` is present but undocumented.

#### `FillResponseObject`

- Contains `subaccountNumber`, but it is not documented.

### Method-Specific Observations

#### `ListPerpetualMarkets`

- The `limit` parameter is optional.

#### `GetTrades`

- The `limit` parameter is optional.

#### `GetCandles`

- The `limit` parameter is optional.

#### `GetAddress`

- Although the implementation includes a `limit` parameter, it is undocumented.

#### `GetSubaccount`

- Returns `SubaccountResponse`, not `SubaccountResponseObject`. The former is a map with a single `subaccount` field.
- The `limit` and `status` parameters are optional.

#### `GetAssetPositions`

- Additional parameters similar to `ListPositions` exist but are undocumented.

#### `ListOrders`

- The `OrderResponseObject` includes an optional `goodTilBlock` field that is not present in responses.
