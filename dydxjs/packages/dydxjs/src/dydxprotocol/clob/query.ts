//@ts-nocheck
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../cosmos/base/query/v1beta1/pagination";
import { ValidatorMevMatches, ValidatorMevMatchesAmino, ValidatorMevMatchesSDKType, MevNodeToNodeMetrics, MevNodeToNodeMetricsAmino, MevNodeToNodeMetricsSDKType } from "./mev";
import { OrderId, OrderIdAmino, OrderIdSDKType, LongTermOrderPlacement, LongTermOrderPlacementAmino, LongTermOrderPlacementSDKType, Order, OrderAmino, OrderSDKType, StreamLiquidationOrder, StreamLiquidationOrderAmino, StreamLiquidationOrderSDKType } from "./order";
import { SubaccountId, SubaccountIdAmino, SubaccountIdSDKType } from "../subaccounts/subaccount";
import { ClobPair, ClobPairAmino, ClobPairSDKType } from "./clob_pair";
import { EquityTierLimitConfiguration, EquityTierLimitConfigurationAmino, EquityTierLimitConfigurationSDKType } from "./equity_tier_limit_config";
import { BlockRateLimitConfiguration, BlockRateLimitConfigurationAmino, BlockRateLimitConfigurationSDKType } from "./block_rate_limit_config";
import { LiquidationsConfig, LiquidationsConfigAmino, LiquidationsConfigSDKType } from "./liquidations_config";
import { StreamSubaccountUpdate, StreamSubaccountUpdateAmino, StreamSubaccountUpdateSDKType } from "../subaccounts/streaming";
import { OffChainUpdateV1, OffChainUpdateV1Amino, OffChainUpdateV1SDKType } from "../indexer/off_chain_updates/off_chain_updates";
import { ClobMatch, ClobMatchAmino, ClobMatchSDKType } from "./matches";
import { BinaryReader, BinaryWriter } from "../../binary";
/** QueryGetClobPairRequest is request type for the ClobPair method. */
export interface QueryGetClobPairRequest {
  id: number;
}
export interface QueryGetClobPairRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryGetClobPairRequest";
  value: Uint8Array;
}
/** QueryGetClobPairRequest is request type for the ClobPair method. */
export interface QueryGetClobPairRequestAmino {
  id?: number;
}
export interface QueryGetClobPairRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryGetClobPairRequest";
  value: QueryGetClobPairRequestAmino;
}
/** QueryGetClobPairRequest is request type for the ClobPair method. */
export interface QueryGetClobPairRequestSDKType {
  id: number;
}
/** QueryClobPairResponse is response type for the ClobPair method. */
export interface QueryClobPairResponse {
  clobPair: ClobPair;
}
export interface QueryClobPairResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryClobPairResponse";
  value: Uint8Array;
}
/** QueryClobPairResponse is response type for the ClobPair method. */
export interface QueryClobPairResponseAmino {
  clob_pair?: ClobPairAmino;
}
export interface QueryClobPairResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryClobPairResponse";
  value: QueryClobPairResponseAmino;
}
/** QueryClobPairResponse is response type for the ClobPair method. */
export interface QueryClobPairResponseSDKType {
  clob_pair: ClobPairSDKType;
}
/** QueryAllClobPairRequest is request type for the ClobPairAll method. */
export interface QueryAllClobPairRequest {
  pagination?: PageRequest;
}
export interface QueryAllClobPairRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryAllClobPairRequest";
  value: Uint8Array;
}
/** QueryAllClobPairRequest is request type for the ClobPairAll method. */
export interface QueryAllClobPairRequestAmino {
  pagination?: PageRequestAmino;
}
export interface QueryAllClobPairRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryAllClobPairRequest";
  value: QueryAllClobPairRequestAmino;
}
/** QueryAllClobPairRequest is request type for the ClobPairAll method. */
export interface QueryAllClobPairRequestSDKType {
  pagination?: PageRequestSDKType;
}
/** QueryClobPairAllResponse is response type for the ClobPairAll method. */
export interface QueryClobPairAllResponse {
  clobPair: ClobPair[];
  pagination?: PageResponse;
}
export interface QueryClobPairAllResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryClobPairAllResponse";
  value: Uint8Array;
}
/** QueryClobPairAllResponse is response type for the ClobPairAll method. */
export interface QueryClobPairAllResponseAmino {
  clob_pair?: ClobPairAmino[];
  pagination?: PageResponseAmino;
}
export interface QueryClobPairAllResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryClobPairAllResponse";
  value: QueryClobPairAllResponseAmino;
}
/** QueryClobPairAllResponse is response type for the ClobPairAll method. */
export interface QueryClobPairAllResponseSDKType {
  clob_pair: ClobPairSDKType[];
  pagination?: PageResponseSDKType;
}
/**
 * MevNodeToNodeCalculationRequest is a request message used to run the
 * MEV node <> node calculation.
 */
export interface MevNodeToNodeCalculationRequest {
  /**
   * Represents the matches on the "block proposer". Note that this field
   * does not need to be the actual block proposer's matches for a block, since
   * the MEV calculation logic is run with this nodes matches as the "block
   * proposer" matches.
   */
  blockProposerMatches?: ValidatorMevMatches;
  /** Represents the matches and mid-prices on the validator. */
  validatorMevMetrics?: MevNodeToNodeMetrics;
}
export interface MevNodeToNodeCalculationRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationRequest";
  value: Uint8Array;
}
/**
 * MevNodeToNodeCalculationRequest is a request message used to run the
 * MEV node <> node calculation.
 */
export interface MevNodeToNodeCalculationRequestAmino {
  /**
   * Represents the matches on the "block proposer". Note that this field
   * does not need to be the actual block proposer's matches for a block, since
   * the MEV calculation logic is run with this nodes matches as the "block
   * proposer" matches.
   */
  block_proposer_matches?: ValidatorMevMatchesAmino;
  /** Represents the matches and mid-prices on the validator. */
  validator_mev_metrics?: MevNodeToNodeMetricsAmino;
}
export interface MevNodeToNodeCalculationRequestAminoMsg {
  type: "/dydxprotocol.clob.MevNodeToNodeCalculationRequest";
  value: MevNodeToNodeCalculationRequestAmino;
}
/**
 * MevNodeToNodeCalculationRequest is a request message used to run the
 * MEV node <> node calculation.
 */
export interface MevNodeToNodeCalculationRequestSDKType {
  block_proposer_matches?: ValidatorMevMatchesSDKType;
  validator_mev_metrics?: MevNodeToNodeMetricsSDKType;
}
/**
 * MevNodeToNodeCalculationResponse is a response message that contains the
 * MEV node <> node calculation result.
 */
export interface MevNodeToNodeCalculationResponse {
  results: MevNodeToNodeCalculationResponse_MevAndVolumePerClob[];
}
export interface MevNodeToNodeCalculationResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationResponse";
  value: Uint8Array;
}
/**
 * MevNodeToNodeCalculationResponse is a response message that contains the
 * MEV node <> node calculation result.
 */
export interface MevNodeToNodeCalculationResponseAmino {
  results?: MevNodeToNodeCalculationResponse_MevAndVolumePerClobAmino[];
}
export interface MevNodeToNodeCalculationResponseAminoMsg {
  type: "/dydxprotocol.clob.MevNodeToNodeCalculationResponse";
  value: MevNodeToNodeCalculationResponseAmino;
}
/**
 * MevNodeToNodeCalculationResponse is a response message that contains the
 * MEV node <> node calculation result.
 */
export interface MevNodeToNodeCalculationResponseSDKType {
  results: MevNodeToNodeCalculationResponse_MevAndVolumePerClobSDKType[];
}
/** MevAndVolumePerClob contains information about the MEV and volume per CLOB. */
export interface MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
  clobPairId: number;
  mev: number;
  volume: bigint;
}
export interface MevNodeToNodeCalculationResponse_MevAndVolumePerClobProtoMsg {
  typeUrl: "/dydxprotocol.clob.MevAndVolumePerClob";
  value: Uint8Array;
}
/** MevAndVolumePerClob contains information about the MEV and volume per CLOB. */
export interface MevNodeToNodeCalculationResponse_MevAndVolumePerClobAmino {
  clob_pair_id?: number;
  mev?: number;
  volume?: string;
}
export interface MevNodeToNodeCalculationResponse_MevAndVolumePerClobAminoMsg {
  type: "/dydxprotocol.clob.MevAndVolumePerClob";
  value: MevNodeToNodeCalculationResponse_MevAndVolumePerClobAmino;
}
/** MevAndVolumePerClob contains information about the MEV and volume per CLOB. */
export interface MevNodeToNodeCalculationResponse_MevAndVolumePerClobSDKType {
  clob_pair_id: number;
  mev: number;
  volume: bigint;
}
/**
 * QueryEquityTierLimitConfigurationRequest is a request message for
 * EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationRequest {}
export interface QueryEquityTierLimitConfigurationRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationRequest";
  value: Uint8Array;
}
/**
 * QueryEquityTierLimitConfigurationRequest is a request message for
 * EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationRequestAmino {}
export interface QueryEquityTierLimitConfigurationRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationRequest";
  value: QueryEquityTierLimitConfigurationRequestAmino;
}
/**
 * QueryEquityTierLimitConfigurationRequest is a request message for
 * EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationRequestSDKType {}
/**
 * QueryEquityTierLimitConfigurationResponse is a response message that contains
 * the EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationResponse {
  equityTierLimitConfig: EquityTierLimitConfiguration;
}
export interface QueryEquityTierLimitConfigurationResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationResponse";
  value: Uint8Array;
}
/**
 * QueryEquityTierLimitConfigurationResponse is a response message that contains
 * the EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationResponseAmino {
  equity_tier_limit_config?: EquityTierLimitConfigurationAmino;
}
export interface QueryEquityTierLimitConfigurationResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationResponse";
  value: QueryEquityTierLimitConfigurationResponseAmino;
}
/**
 * QueryEquityTierLimitConfigurationResponse is a response message that contains
 * the EquityTierLimitConfiguration.
 */
export interface QueryEquityTierLimitConfigurationResponseSDKType {
  equity_tier_limit_config: EquityTierLimitConfigurationSDKType;
}
/**
 * QueryBlockRateLimitConfigurationRequest is a request message for
 * BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationRequest {}
export interface QueryBlockRateLimitConfigurationRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationRequest";
  value: Uint8Array;
}
/**
 * QueryBlockRateLimitConfigurationRequest is a request message for
 * BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationRequestAmino {}
export interface QueryBlockRateLimitConfigurationRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationRequest";
  value: QueryBlockRateLimitConfigurationRequestAmino;
}
/**
 * QueryBlockRateLimitConfigurationRequest is a request message for
 * BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationRequestSDKType {}
/**
 * QueryBlockRateLimitConfigurationResponse is a response message that contains
 * the BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationResponse {
  blockRateLimitConfig: BlockRateLimitConfiguration;
}
export interface QueryBlockRateLimitConfigurationResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationResponse";
  value: Uint8Array;
}
/**
 * QueryBlockRateLimitConfigurationResponse is a response message that contains
 * the BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationResponseAmino {
  block_rate_limit_config?: BlockRateLimitConfigurationAmino;
}
export interface QueryBlockRateLimitConfigurationResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationResponse";
  value: QueryBlockRateLimitConfigurationResponseAmino;
}
/**
 * QueryBlockRateLimitConfigurationResponse is a response message that contains
 * the BlockRateLimitConfiguration.
 */
export interface QueryBlockRateLimitConfigurationResponseSDKType {
  block_rate_limit_config: BlockRateLimitConfigurationSDKType;
}
/** QueryStatefulOrderRequest is a request message for StatefulOrder. */
export interface QueryStatefulOrderRequest {
  /** Order id to query. */
  orderId: OrderId;
}
export interface QueryStatefulOrderRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryStatefulOrderRequest";
  value: Uint8Array;
}
/** QueryStatefulOrderRequest is a request message for StatefulOrder. */
export interface QueryStatefulOrderRequestAmino {
  /** Order id to query. */
  order_id?: OrderIdAmino;
}
export interface QueryStatefulOrderRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryStatefulOrderRequest";
  value: QueryStatefulOrderRequestAmino;
}
/** QueryStatefulOrderRequest is a request message for StatefulOrder. */
export interface QueryStatefulOrderRequestSDKType {
  order_id: OrderIdSDKType;
}
/**
 * QueryStatefulOrderResponse is a response message that contains the stateful
 * order.
 */
export interface QueryStatefulOrderResponse {
  /** Stateful order placement. */
  orderPlacement: LongTermOrderPlacement;
  /** Fill amounts. */
  fillAmount: bigint;
  /** Triggered status. */
  triggered: boolean;
}
export interface QueryStatefulOrderResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryStatefulOrderResponse";
  value: Uint8Array;
}
/**
 * QueryStatefulOrderResponse is a response message that contains the stateful
 * order.
 */
export interface QueryStatefulOrderResponseAmino {
  /** Stateful order placement. */
  order_placement?: LongTermOrderPlacementAmino;
  /** Fill amounts. */
  fill_amount?: string;
  /** Triggered status. */
  triggered?: boolean;
}
export interface QueryStatefulOrderResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryStatefulOrderResponse";
  value: QueryStatefulOrderResponseAmino;
}
/**
 * QueryStatefulOrderResponse is a response message that contains the stateful
 * order.
 */
export interface QueryStatefulOrderResponseSDKType {
  order_placement: LongTermOrderPlacementSDKType;
  fill_amount: bigint;
  triggered: boolean;
}
/**
 * QueryLiquidationsConfigurationRequest is a request message for
 * LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationRequest {}
export interface QueryLiquidationsConfigurationRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationRequest";
  value: Uint8Array;
}
/**
 * QueryLiquidationsConfigurationRequest is a request message for
 * LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationRequestAmino {}
export interface QueryLiquidationsConfigurationRequestAminoMsg {
  type: "/dydxprotocol.clob.QueryLiquidationsConfigurationRequest";
  value: QueryLiquidationsConfigurationRequestAmino;
}
/**
 * QueryLiquidationsConfigurationRequest is a request message for
 * LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationRequestSDKType {}
/**
 * QueryLiquidationsConfigurationResponse is a response message that contains
 * the LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationResponse {
  liquidationsConfig: LiquidationsConfig;
}
export interface QueryLiquidationsConfigurationResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationResponse";
  value: Uint8Array;
}
/**
 * QueryLiquidationsConfigurationResponse is a response message that contains
 * the LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationResponseAmino {
  liquidations_config?: LiquidationsConfigAmino;
}
export interface QueryLiquidationsConfigurationResponseAminoMsg {
  type: "/dydxprotocol.clob.QueryLiquidationsConfigurationResponse";
  value: QueryLiquidationsConfigurationResponseAmino;
}
/**
 * QueryLiquidationsConfigurationResponse is a response message that contains
 * the LiquidationsConfiguration.
 */
export interface QueryLiquidationsConfigurationResponseSDKType {
  liquidations_config: LiquidationsConfigSDKType;
}
/**
 * StreamOrderbookUpdatesRequest is a request message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesRequest {
  /** Clob pair ids to stream orderbook updates for. */
  clobPairId: number[];
  /** Subaccount ids to stream subaccount updates for. */
  subaccountIds: SubaccountId[];
}
export interface StreamOrderbookUpdatesRequestProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesRequest";
  value: Uint8Array;
}
/**
 * StreamOrderbookUpdatesRequest is a request message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesRequestAmino {
  /** Clob pair ids to stream orderbook updates for. */
  clob_pair_id?: number[];
  /** Subaccount ids to stream subaccount updates for. */
  subaccount_ids?: SubaccountIdAmino[];
}
export interface StreamOrderbookUpdatesRequestAminoMsg {
  type: "/dydxprotocol.clob.StreamOrderbookUpdatesRequest";
  value: StreamOrderbookUpdatesRequestAmino;
}
/**
 * StreamOrderbookUpdatesRequest is a request message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesRequestSDKType {
  clob_pair_id: number[];
  subaccount_ids: SubaccountIdSDKType[];
}
/**
 * StreamOrderbookUpdatesResponse is a response message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesResponse {
  /** Batch of updates for the clob pair. */
  updates: StreamUpdate[];
}
export interface StreamOrderbookUpdatesResponseProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesResponse";
  value: Uint8Array;
}
/**
 * StreamOrderbookUpdatesResponse is a response message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesResponseAmino {
  /** Batch of updates for the clob pair. */
  updates?: StreamUpdateAmino[];
}
export interface StreamOrderbookUpdatesResponseAminoMsg {
  type: "/dydxprotocol.clob.StreamOrderbookUpdatesResponse";
  value: StreamOrderbookUpdatesResponseAmino;
}
/**
 * StreamOrderbookUpdatesResponse is a response message for the
 * StreamOrderbookUpdates method.
 */
export interface StreamOrderbookUpdatesResponseSDKType {
  updates: StreamUpdateSDKType[];
}
/**
 * StreamUpdate is an update that will be pushed through the
 * GRPC stream.
 */
export interface StreamUpdate {
  orderbookUpdate?: StreamOrderbookUpdate;
  orderFill?: StreamOrderbookFill;
  takerOrder?: StreamTakerOrder;
  subaccountUpdate?: StreamSubaccountUpdate;
  /** Block height of the update. */
  blockHeight: number;
  /** Exec mode of the update. */
  execMode: number;
}
export interface StreamUpdateProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamUpdate";
  value: Uint8Array;
}
/**
 * StreamUpdate is an update that will be pushed through the
 * GRPC stream.
 */
export interface StreamUpdateAmino {
  orderbook_update?: StreamOrderbookUpdateAmino;
  order_fill?: StreamOrderbookFillAmino;
  taker_order?: StreamTakerOrderAmino;
  subaccount_update?: StreamSubaccountUpdateAmino;
  /** Block height of the update. */
  block_height?: number;
  /** Exec mode of the update. */
  exec_mode?: number;
}
export interface StreamUpdateAminoMsg {
  type: "/dydxprotocol.clob.StreamUpdate";
  value: StreamUpdateAmino;
}
/**
 * StreamUpdate is an update that will be pushed through the
 * GRPC stream.
 */
export interface StreamUpdateSDKType {
  orderbook_update?: StreamOrderbookUpdateSDKType;
  order_fill?: StreamOrderbookFillSDKType;
  taker_order?: StreamTakerOrderSDKType;
  subaccount_update?: StreamSubaccountUpdateSDKType;
  block_height: number;
  exec_mode: number;
}
/**
 * StreamOrderbookUpdate provides information on an orderbook update. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookUpdate {
  /**
   * Orderbook updates for the clob pair. Can contain order place, removals,
   * or updates.
   */
  updates: OffChainUpdateV1[];
  /**
   * Snapshot indicates if the response is from a snapshot of the orderbook.
   * All updates should be ignored until snapshot is recieved.
   * If the snapshot is true, then all previous entries should be
   * discarded and the orderbook should be resynced.
   */
  snapshot: boolean;
}
export interface StreamOrderbookUpdateProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdate";
  value: Uint8Array;
}
/**
 * StreamOrderbookUpdate provides information on an orderbook update. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookUpdateAmino {
  /**
   * Orderbook updates for the clob pair. Can contain order place, removals,
   * or updates.
   */
  updates?: OffChainUpdateV1Amino[];
  /**
   * Snapshot indicates if the response is from a snapshot of the orderbook.
   * All updates should be ignored until snapshot is recieved.
   * If the snapshot is true, then all previous entries should be
   * discarded and the orderbook should be resynced.
   */
  snapshot?: boolean;
}
export interface StreamOrderbookUpdateAminoMsg {
  type: "/dydxprotocol.clob.StreamOrderbookUpdate";
  value: StreamOrderbookUpdateAmino;
}
/**
 * StreamOrderbookUpdate provides information on an orderbook update. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookUpdateSDKType {
  updates: OffChainUpdateV1SDKType[];
  snapshot: boolean;
}
/**
 * StreamOrderbookFill provides information on an orderbook fill. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookFill {
  /**
   * Clob match. Provides information on which orders were matched
   * and the type of order.
   */
  clobMatch?: ClobMatch;
  /**
   * All orders involved in the specified clob match. Used to look up
   * price of a match through a given maker order id.
   */
  orders: Order[];
  /** Resulting fill amounts for each order in the orders array. */
  fillAmounts: bigint[];
}
export interface StreamOrderbookFillProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookFill";
  value: Uint8Array;
}
/**
 * StreamOrderbookFill provides information on an orderbook fill. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookFillAmino {
  /**
   * Clob match. Provides information on which orders were matched
   * and the type of order.
   */
  clob_match?: ClobMatchAmino;
  /**
   * All orders involved in the specified clob match. Used to look up
   * price of a match through a given maker order id.
   */
  orders?: OrderAmino[];
  /** Resulting fill amounts for each order in the orders array. */
  fill_amounts?: string[];
}
export interface StreamOrderbookFillAminoMsg {
  type: "/dydxprotocol.clob.StreamOrderbookFill";
  value: StreamOrderbookFillAmino;
}
/**
 * StreamOrderbookFill provides information on an orderbook fill. Used in
 * the full node GRPC stream.
 */
export interface StreamOrderbookFillSDKType {
  clob_match?: ClobMatchSDKType;
  orders: OrderSDKType[];
  fill_amounts: bigint[];
}
/**
 * StreamTakerOrder provides information on a taker order that was attempted
 * to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrder {
  order?: Order;
  liquidationOrder?: StreamLiquidationOrder;
  /**
   * Information on the taker order after it is matched on the book,
   * either successfully or unsuccessfully.
   */
  takerOrderStatus?: StreamTakerOrderStatus;
}
export interface StreamTakerOrderProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamTakerOrder";
  value: Uint8Array;
}
/**
 * StreamTakerOrder provides information on a taker order that was attempted
 * to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrderAmino {
  order?: OrderAmino;
  liquidation_order?: StreamLiquidationOrderAmino;
  /**
   * Information on the taker order after it is matched on the book,
   * either successfully or unsuccessfully.
   */
  taker_order_status?: StreamTakerOrderStatusAmino;
}
export interface StreamTakerOrderAminoMsg {
  type: "/dydxprotocol.clob.StreamTakerOrder";
  value: StreamTakerOrderAmino;
}
/**
 * StreamTakerOrder provides information on a taker order that was attempted
 * to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrderSDKType {
  order?: OrderSDKType;
  liquidation_order?: StreamLiquidationOrderSDKType;
  taker_order_status?: StreamTakerOrderStatusSDKType;
}
/**
 * StreamTakerOrderStatus is a representation of a taker order
 * after it is attempted to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrderStatus {
  /**
   * The state of the taker order after attempting to match it against the
   * orderbook. Possible enum values can be found here:
   * https://github.com/dydxprotocol/v4-chain/blob/main/protocol/x/clob/types/orderbook.go#L105
   */
  orderStatus: number;
  /** The amount of remaining (non-matched) base quantums of this taker order. */
  remainingQuantums: bigint;
  /**
   * The amount of base quantums that were *optimistically* filled for this
   * taker order when the order is matched against the orderbook. Note that if
   * any quantums of this order were optimistically filled or filled in state
   * before this invocation of the matching loop, this value will not include
   * them.
   */
  optimisticallyFilledQuantums: bigint;
}
export interface StreamTakerOrderStatusProtoMsg {
  typeUrl: "/dydxprotocol.clob.StreamTakerOrderStatus";
  value: Uint8Array;
}
/**
 * StreamTakerOrderStatus is a representation of a taker order
 * after it is attempted to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrderStatusAmino {
  /**
   * The state of the taker order after attempting to match it against the
   * orderbook. Possible enum values can be found here:
   * https://github.com/dydxprotocol/v4-chain/blob/main/protocol/x/clob/types/orderbook.go#L105
   */
  order_status?: number;
  /** The amount of remaining (non-matched) base quantums of this taker order. */
  remaining_quantums?: string;
  /**
   * The amount of base quantums that were *optimistically* filled for this
   * taker order when the order is matched against the orderbook. Note that if
   * any quantums of this order were optimistically filled or filled in state
   * before this invocation of the matching loop, this value will not include
   * them.
   */
  optimistically_filled_quantums?: string;
}
export interface StreamTakerOrderStatusAminoMsg {
  type: "/dydxprotocol.clob.StreamTakerOrderStatus";
  value: StreamTakerOrderStatusAmino;
}
/**
 * StreamTakerOrderStatus is a representation of a taker order
 * after it is attempted to be matched on the orderbook.
 * It is intended to be used only in full node streaming.
 */
export interface StreamTakerOrderStatusSDKType {
  order_status: number;
  remaining_quantums: bigint;
  optimistically_filled_quantums: bigint;
}
function createBaseQueryGetClobPairRequest(): QueryGetClobPairRequest {
  return {
    id: 0
  };
}
export const QueryGetClobPairRequest = {
  typeUrl: "/dydxprotocol.clob.QueryGetClobPairRequest",
  encode(message: QueryGetClobPairRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetClobPairRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetClobPairRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryGetClobPairRequest>): QueryGetClobPairRequest {
    const message = createBaseQueryGetClobPairRequest();
    message.id = object.id ?? 0;
    return message;
  },
  fromAmino(object: QueryGetClobPairRequestAmino): QueryGetClobPairRequest {
    const message = createBaseQueryGetClobPairRequest();
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
  toAmino(message: QueryGetClobPairRequest): QueryGetClobPairRequestAmino {
    const obj: any = {};
    obj.id = message.id === 0 ? undefined : message.id;
    return obj;
  },
  fromAminoMsg(object: QueryGetClobPairRequestAminoMsg): QueryGetClobPairRequest {
    return QueryGetClobPairRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryGetClobPairRequestProtoMsg): QueryGetClobPairRequest {
    return QueryGetClobPairRequest.decode(message.value);
  },
  toProto(message: QueryGetClobPairRequest): Uint8Array {
    return QueryGetClobPairRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryGetClobPairRequest): QueryGetClobPairRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryGetClobPairRequest",
      value: QueryGetClobPairRequest.encode(message).finish()
    };
  }
};
function createBaseQueryClobPairResponse(): QueryClobPairResponse {
  return {
    clobPair: ClobPair.fromPartial({})
  };
}
export const QueryClobPairResponse = {
  typeUrl: "/dydxprotocol.clob.QueryClobPairResponse",
  encode(message: QueryClobPairResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clobPair !== undefined) {
      ClobPair.encode(message.clobPair, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClobPairResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClobPairResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clobPair = ClobPair.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryClobPairResponse>): QueryClobPairResponse {
    const message = createBaseQueryClobPairResponse();
    message.clobPair = object.clobPair !== undefined && object.clobPair !== null ? ClobPair.fromPartial(object.clobPair) : undefined;
    return message;
  },
  fromAmino(object: QueryClobPairResponseAmino): QueryClobPairResponse {
    const message = createBaseQueryClobPairResponse();
    if (object.clob_pair !== undefined && object.clob_pair !== null) {
      message.clobPair = ClobPair.fromAmino(object.clob_pair);
    }
    return message;
  },
  toAmino(message: QueryClobPairResponse): QueryClobPairResponseAmino {
    const obj: any = {};
    obj.clob_pair = message.clobPair ? ClobPair.toAmino(message.clobPair) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryClobPairResponseAminoMsg): QueryClobPairResponse {
    return QueryClobPairResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClobPairResponseProtoMsg): QueryClobPairResponse {
    return QueryClobPairResponse.decode(message.value);
  },
  toProto(message: QueryClobPairResponse): Uint8Array {
    return QueryClobPairResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryClobPairResponse): QueryClobPairResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryClobPairResponse",
      value: QueryClobPairResponse.encode(message).finish()
    };
  }
};
function createBaseQueryAllClobPairRequest(): QueryAllClobPairRequest {
  return {
    pagination: undefined
  };
}
export const QueryAllClobPairRequest = {
  typeUrl: "/dydxprotocol.clob.QueryAllClobPairRequest",
  encode(message: QueryAllClobPairRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllClobPairRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllClobPairRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryAllClobPairRequest>): QueryAllClobPairRequest {
    const message = createBaseQueryAllClobPairRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryAllClobPairRequestAmino): QueryAllClobPairRequest {
    const message = createBaseQueryAllClobPairRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryAllClobPairRequest): QueryAllClobPairRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryAllClobPairRequestAminoMsg): QueryAllClobPairRequest {
    return QueryAllClobPairRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryAllClobPairRequestProtoMsg): QueryAllClobPairRequest {
    return QueryAllClobPairRequest.decode(message.value);
  },
  toProto(message: QueryAllClobPairRequest): Uint8Array {
    return QueryAllClobPairRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryAllClobPairRequest): QueryAllClobPairRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryAllClobPairRequest",
      value: QueryAllClobPairRequest.encode(message).finish()
    };
  }
};
function createBaseQueryClobPairAllResponse(): QueryClobPairAllResponse {
  return {
    clobPair: [],
    pagination: undefined
  };
}
export const QueryClobPairAllResponse = {
  typeUrl: "/dydxprotocol.clob.QueryClobPairAllResponse",
  encode(message: QueryClobPairAllResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.clobPair) {
      ClobPair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClobPairAllResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClobPairAllResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clobPair.push(ClobPair.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryClobPairAllResponse>): QueryClobPairAllResponse {
    const message = createBaseQueryClobPairAllResponse();
    message.clobPair = object.clobPair?.map(e => ClobPair.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryClobPairAllResponseAmino): QueryClobPairAllResponse {
    const message = createBaseQueryClobPairAllResponse();
    message.clobPair = object.clob_pair?.map(e => ClobPair.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryClobPairAllResponse): QueryClobPairAllResponseAmino {
    const obj: any = {};
    if (message.clobPair) {
      obj.clob_pair = message.clobPair.map(e => e ? ClobPair.toAmino(e) : undefined);
    } else {
      obj.clob_pair = message.clobPair;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryClobPairAllResponseAminoMsg): QueryClobPairAllResponse {
    return QueryClobPairAllResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClobPairAllResponseProtoMsg): QueryClobPairAllResponse {
    return QueryClobPairAllResponse.decode(message.value);
  },
  toProto(message: QueryClobPairAllResponse): Uint8Array {
    return QueryClobPairAllResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryClobPairAllResponse): QueryClobPairAllResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryClobPairAllResponse",
      value: QueryClobPairAllResponse.encode(message).finish()
    };
  }
};
function createBaseMevNodeToNodeCalculationRequest(): MevNodeToNodeCalculationRequest {
  return {
    blockProposerMatches: undefined,
    validatorMevMetrics: undefined
  };
}
export const MevNodeToNodeCalculationRequest = {
  typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationRequest",
  encode(message: MevNodeToNodeCalculationRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.blockProposerMatches !== undefined) {
      ValidatorMevMatches.encode(message.blockProposerMatches, writer.uint32(10).fork()).ldelim();
    }
    if (message.validatorMevMetrics !== undefined) {
      MevNodeToNodeMetrics.encode(message.validatorMevMetrics, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MevNodeToNodeCalculationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMevNodeToNodeCalculationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockProposerMatches = ValidatorMevMatches.decode(reader, reader.uint32());
          break;
        case 2:
          message.validatorMevMetrics = MevNodeToNodeMetrics.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MevNodeToNodeCalculationRequest>): MevNodeToNodeCalculationRequest {
    const message = createBaseMevNodeToNodeCalculationRequest();
    message.blockProposerMatches = object.blockProposerMatches !== undefined && object.blockProposerMatches !== null ? ValidatorMevMatches.fromPartial(object.blockProposerMatches) : undefined;
    message.validatorMevMetrics = object.validatorMevMetrics !== undefined && object.validatorMevMetrics !== null ? MevNodeToNodeMetrics.fromPartial(object.validatorMevMetrics) : undefined;
    return message;
  },
  fromAmino(object: MevNodeToNodeCalculationRequestAmino): MevNodeToNodeCalculationRequest {
    const message = createBaseMevNodeToNodeCalculationRequest();
    if (object.block_proposer_matches !== undefined && object.block_proposer_matches !== null) {
      message.blockProposerMatches = ValidatorMevMatches.fromAmino(object.block_proposer_matches);
    }
    if (object.validator_mev_metrics !== undefined && object.validator_mev_metrics !== null) {
      message.validatorMevMetrics = MevNodeToNodeMetrics.fromAmino(object.validator_mev_metrics);
    }
    return message;
  },
  toAmino(message: MevNodeToNodeCalculationRequest): MevNodeToNodeCalculationRequestAmino {
    const obj: any = {};
    obj.block_proposer_matches = message.blockProposerMatches ? ValidatorMevMatches.toAmino(message.blockProposerMatches) : undefined;
    obj.validator_mev_metrics = message.validatorMevMetrics ? MevNodeToNodeMetrics.toAmino(message.validatorMevMetrics) : undefined;
    return obj;
  },
  fromAminoMsg(object: MevNodeToNodeCalculationRequestAminoMsg): MevNodeToNodeCalculationRequest {
    return MevNodeToNodeCalculationRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: MevNodeToNodeCalculationRequestProtoMsg): MevNodeToNodeCalculationRequest {
    return MevNodeToNodeCalculationRequest.decode(message.value);
  },
  toProto(message: MevNodeToNodeCalculationRequest): Uint8Array {
    return MevNodeToNodeCalculationRequest.encode(message).finish();
  },
  toProtoMsg(message: MevNodeToNodeCalculationRequest): MevNodeToNodeCalculationRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationRequest",
      value: MevNodeToNodeCalculationRequest.encode(message).finish()
    };
  }
};
function createBaseMevNodeToNodeCalculationResponse(): MevNodeToNodeCalculationResponse {
  return {
    results: []
  };
}
export const MevNodeToNodeCalculationResponse = {
  typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationResponse",
  encode(message: MevNodeToNodeCalculationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.results) {
      MevNodeToNodeCalculationResponse_MevAndVolumePerClob.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MevNodeToNodeCalculationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMevNodeToNodeCalculationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.results.push(MevNodeToNodeCalculationResponse_MevAndVolumePerClob.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MevNodeToNodeCalculationResponse>): MevNodeToNodeCalculationResponse {
    const message = createBaseMevNodeToNodeCalculationResponse();
    message.results = object.results?.map(e => MevNodeToNodeCalculationResponse_MevAndVolumePerClob.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MevNodeToNodeCalculationResponseAmino): MevNodeToNodeCalculationResponse {
    const message = createBaseMevNodeToNodeCalculationResponse();
    message.results = object.results?.map(e => MevNodeToNodeCalculationResponse_MevAndVolumePerClob.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MevNodeToNodeCalculationResponse): MevNodeToNodeCalculationResponseAmino {
    const obj: any = {};
    if (message.results) {
      obj.results = message.results.map(e => e ? MevNodeToNodeCalculationResponse_MevAndVolumePerClob.toAmino(e) : undefined);
    } else {
      obj.results = message.results;
    }
    return obj;
  },
  fromAminoMsg(object: MevNodeToNodeCalculationResponseAminoMsg): MevNodeToNodeCalculationResponse {
    return MevNodeToNodeCalculationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MevNodeToNodeCalculationResponseProtoMsg): MevNodeToNodeCalculationResponse {
    return MevNodeToNodeCalculationResponse.decode(message.value);
  },
  toProto(message: MevNodeToNodeCalculationResponse): Uint8Array {
    return MevNodeToNodeCalculationResponse.encode(message).finish();
  },
  toProtoMsg(message: MevNodeToNodeCalculationResponse): MevNodeToNodeCalculationResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.MevNodeToNodeCalculationResponse",
      value: MevNodeToNodeCalculationResponse.encode(message).finish()
    };
  }
};
function createBaseMevNodeToNodeCalculationResponse_MevAndVolumePerClob(): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
  return {
    clobPairId: 0,
    mev: 0,
    volume: BigInt(0)
  };
}
export const MevNodeToNodeCalculationResponse_MevAndVolumePerClob = {
  typeUrl: "/dydxprotocol.clob.MevAndVolumePerClob",
  encode(message: MevNodeToNodeCalculationResponse_MevAndVolumePerClob, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clobPairId !== 0) {
      writer.uint32(8).uint32(message.clobPairId);
    }
    if (message.mev !== 0) {
      writer.uint32(21).float(message.mev);
    }
    if (message.volume !== BigInt(0)) {
      writer.uint32(24).uint64(message.volume);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMevNodeToNodeCalculationResponse_MevAndVolumePerClob();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clobPairId = reader.uint32();
          break;
        case 2:
          message.mev = reader.float();
          break;
        case 3:
          message.volume = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MevNodeToNodeCalculationResponse_MevAndVolumePerClob>): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
    const message = createBaseMevNodeToNodeCalculationResponse_MevAndVolumePerClob();
    message.clobPairId = object.clobPairId ?? 0;
    message.mev = object.mev ?? 0;
    message.volume = object.volume !== undefined && object.volume !== null ? BigInt(object.volume.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MevNodeToNodeCalculationResponse_MevAndVolumePerClobAmino): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
    const message = createBaseMevNodeToNodeCalculationResponse_MevAndVolumePerClob();
    if (object.clob_pair_id !== undefined && object.clob_pair_id !== null) {
      message.clobPairId = object.clob_pair_id;
    }
    if (object.mev !== undefined && object.mev !== null) {
      message.mev = object.mev;
    }
    if (object.volume !== undefined && object.volume !== null) {
      message.volume = BigInt(object.volume);
    }
    return message;
  },
  toAmino(message: MevNodeToNodeCalculationResponse_MevAndVolumePerClob): MevNodeToNodeCalculationResponse_MevAndVolumePerClobAmino {
    const obj: any = {};
    obj.clob_pair_id = message.clobPairId === 0 ? undefined : message.clobPairId;
    obj.mev = message.mev === 0 ? undefined : message.mev;
    obj.volume = message.volume !== BigInt(0) ? message.volume.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MevNodeToNodeCalculationResponse_MevAndVolumePerClobAminoMsg): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
    return MevNodeToNodeCalculationResponse_MevAndVolumePerClob.fromAmino(object.value);
  },
  fromProtoMsg(message: MevNodeToNodeCalculationResponse_MevAndVolumePerClobProtoMsg): MevNodeToNodeCalculationResponse_MevAndVolumePerClob {
    return MevNodeToNodeCalculationResponse_MevAndVolumePerClob.decode(message.value);
  },
  toProto(message: MevNodeToNodeCalculationResponse_MevAndVolumePerClob): Uint8Array {
    return MevNodeToNodeCalculationResponse_MevAndVolumePerClob.encode(message).finish();
  },
  toProtoMsg(message: MevNodeToNodeCalculationResponse_MevAndVolumePerClob): MevNodeToNodeCalculationResponse_MevAndVolumePerClobProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.MevAndVolumePerClob",
      value: MevNodeToNodeCalculationResponse_MevAndVolumePerClob.encode(message).finish()
    };
  }
};
function createBaseQueryEquityTierLimitConfigurationRequest(): QueryEquityTierLimitConfigurationRequest {
  return {};
}
export const QueryEquityTierLimitConfigurationRequest = {
  typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationRequest",
  encode(_: QueryEquityTierLimitConfigurationRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryEquityTierLimitConfigurationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEquityTierLimitConfigurationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<QueryEquityTierLimitConfigurationRequest>): QueryEquityTierLimitConfigurationRequest {
    const message = createBaseQueryEquityTierLimitConfigurationRequest();
    return message;
  },
  fromAmino(_: QueryEquityTierLimitConfigurationRequestAmino): QueryEquityTierLimitConfigurationRequest {
    const message = createBaseQueryEquityTierLimitConfigurationRequest();
    return message;
  },
  toAmino(_: QueryEquityTierLimitConfigurationRequest): QueryEquityTierLimitConfigurationRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryEquityTierLimitConfigurationRequestAminoMsg): QueryEquityTierLimitConfigurationRequest {
    return QueryEquityTierLimitConfigurationRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryEquityTierLimitConfigurationRequestProtoMsg): QueryEquityTierLimitConfigurationRequest {
    return QueryEquityTierLimitConfigurationRequest.decode(message.value);
  },
  toProto(message: QueryEquityTierLimitConfigurationRequest): Uint8Array {
    return QueryEquityTierLimitConfigurationRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryEquityTierLimitConfigurationRequest): QueryEquityTierLimitConfigurationRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationRequest",
      value: QueryEquityTierLimitConfigurationRequest.encode(message).finish()
    };
  }
};
function createBaseQueryEquityTierLimitConfigurationResponse(): QueryEquityTierLimitConfigurationResponse {
  return {
    equityTierLimitConfig: EquityTierLimitConfiguration.fromPartial({})
  };
}
export const QueryEquityTierLimitConfigurationResponse = {
  typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationResponse",
  encode(message: QueryEquityTierLimitConfigurationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.equityTierLimitConfig !== undefined) {
      EquityTierLimitConfiguration.encode(message.equityTierLimitConfig, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryEquityTierLimitConfigurationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEquityTierLimitConfigurationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.equityTierLimitConfig = EquityTierLimitConfiguration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryEquityTierLimitConfigurationResponse>): QueryEquityTierLimitConfigurationResponse {
    const message = createBaseQueryEquityTierLimitConfigurationResponse();
    message.equityTierLimitConfig = object.equityTierLimitConfig !== undefined && object.equityTierLimitConfig !== null ? EquityTierLimitConfiguration.fromPartial(object.equityTierLimitConfig) : undefined;
    return message;
  },
  fromAmino(object: QueryEquityTierLimitConfigurationResponseAmino): QueryEquityTierLimitConfigurationResponse {
    const message = createBaseQueryEquityTierLimitConfigurationResponse();
    if (object.equity_tier_limit_config !== undefined && object.equity_tier_limit_config !== null) {
      message.equityTierLimitConfig = EquityTierLimitConfiguration.fromAmino(object.equity_tier_limit_config);
    }
    return message;
  },
  toAmino(message: QueryEquityTierLimitConfigurationResponse): QueryEquityTierLimitConfigurationResponseAmino {
    const obj: any = {};
    obj.equity_tier_limit_config = message.equityTierLimitConfig ? EquityTierLimitConfiguration.toAmino(message.equityTierLimitConfig) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryEquityTierLimitConfigurationResponseAminoMsg): QueryEquityTierLimitConfigurationResponse {
    return QueryEquityTierLimitConfigurationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryEquityTierLimitConfigurationResponseProtoMsg): QueryEquityTierLimitConfigurationResponse {
    return QueryEquityTierLimitConfigurationResponse.decode(message.value);
  },
  toProto(message: QueryEquityTierLimitConfigurationResponse): Uint8Array {
    return QueryEquityTierLimitConfigurationResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryEquityTierLimitConfigurationResponse): QueryEquityTierLimitConfigurationResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryEquityTierLimitConfigurationResponse",
      value: QueryEquityTierLimitConfigurationResponse.encode(message).finish()
    };
  }
};
function createBaseQueryBlockRateLimitConfigurationRequest(): QueryBlockRateLimitConfigurationRequest {
  return {};
}
export const QueryBlockRateLimitConfigurationRequest = {
  typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationRequest",
  encode(_: QueryBlockRateLimitConfigurationRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryBlockRateLimitConfigurationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBlockRateLimitConfigurationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<QueryBlockRateLimitConfigurationRequest>): QueryBlockRateLimitConfigurationRequest {
    const message = createBaseQueryBlockRateLimitConfigurationRequest();
    return message;
  },
  fromAmino(_: QueryBlockRateLimitConfigurationRequestAmino): QueryBlockRateLimitConfigurationRequest {
    const message = createBaseQueryBlockRateLimitConfigurationRequest();
    return message;
  },
  toAmino(_: QueryBlockRateLimitConfigurationRequest): QueryBlockRateLimitConfigurationRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryBlockRateLimitConfigurationRequestAminoMsg): QueryBlockRateLimitConfigurationRequest {
    return QueryBlockRateLimitConfigurationRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryBlockRateLimitConfigurationRequestProtoMsg): QueryBlockRateLimitConfigurationRequest {
    return QueryBlockRateLimitConfigurationRequest.decode(message.value);
  },
  toProto(message: QueryBlockRateLimitConfigurationRequest): Uint8Array {
    return QueryBlockRateLimitConfigurationRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryBlockRateLimitConfigurationRequest): QueryBlockRateLimitConfigurationRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationRequest",
      value: QueryBlockRateLimitConfigurationRequest.encode(message).finish()
    };
  }
};
function createBaseQueryBlockRateLimitConfigurationResponse(): QueryBlockRateLimitConfigurationResponse {
  return {
    blockRateLimitConfig: BlockRateLimitConfiguration.fromPartial({})
  };
}
export const QueryBlockRateLimitConfigurationResponse = {
  typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationResponse",
  encode(message: QueryBlockRateLimitConfigurationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.blockRateLimitConfig !== undefined) {
      BlockRateLimitConfiguration.encode(message.blockRateLimitConfig, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryBlockRateLimitConfigurationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBlockRateLimitConfigurationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockRateLimitConfig = BlockRateLimitConfiguration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryBlockRateLimitConfigurationResponse>): QueryBlockRateLimitConfigurationResponse {
    const message = createBaseQueryBlockRateLimitConfigurationResponse();
    message.blockRateLimitConfig = object.blockRateLimitConfig !== undefined && object.blockRateLimitConfig !== null ? BlockRateLimitConfiguration.fromPartial(object.blockRateLimitConfig) : undefined;
    return message;
  },
  fromAmino(object: QueryBlockRateLimitConfigurationResponseAmino): QueryBlockRateLimitConfigurationResponse {
    const message = createBaseQueryBlockRateLimitConfigurationResponse();
    if (object.block_rate_limit_config !== undefined && object.block_rate_limit_config !== null) {
      message.blockRateLimitConfig = BlockRateLimitConfiguration.fromAmino(object.block_rate_limit_config);
    }
    return message;
  },
  toAmino(message: QueryBlockRateLimitConfigurationResponse): QueryBlockRateLimitConfigurationResponseAmino {
    const obj: any = {};
    obj.block_rate_limit_config = message.blockRateLimitConfig ? BlockRateLimitConfiguration.toAmino(message.blockRateLimitConfig) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryBlockRateLimitConfigurationResponseAminoMsg): QueryBlockRateLimitConfigurationResponse {
    return QueryBlockRateLimitConfigurationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryBlockRateLimitConfigurationResponseProtoMsg): QueryBlockRateLimitConfigurationResponse {
    return QueryBlockRateLimitConfigurationResponse.decode(message.value);
  },
  toProto(message: QueryBlockRateLimitConfigurationResponse): Uint8Array {
    return QueryBlockRateLimitConfigurationResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryBlockRateLimitConfigurationResponse): QueryBlockRateLimitConfigurationResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryBlockRateLimitConfigurationResponse",
      value: QueryBlockRateLimitConfigurationResponse.encode(message).finish()
    };
  }
};
function createBaseQueryStatefulOrderRequest(): QueryStatefulOrderRequest {
  return {
    orderId: OrderId.fromPartial({})
  };
}
export const QueryStatefulOrderRequest = {
  typeUrl: "/dydxprotocol.clob.QueryStatefulOrderRequest",
  encode(message: QueryStatefulOrderRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.orderId !== undefined) {
      OrderId.encode(message.orderId, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryStatefulOrderRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryStatefulOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = OrderId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryStatefulOrderRequest>): QueryStatefulOrderRequest {
    const message = createBaseQueryStatefulOrderRequest();
    message.orderId = object.orderId !== undefined && object.orderId !== null ? OrderId.fromPartial(object.orderId) : undefined;
    return message;
  },
  fromAmino(object: QueryStatefulOrderRequestAmino): QueryStatefulOrderRequest {
    const message = createBaseQueryStatefulOrderRequest();
    if (object.order_id !== undefined && object.order_id !== null) {
      message.orderId = OrderId.fromAmino(object.order_id);
    }
    return message;
  },
  toAmino(message: QueryStatefulOrderRequest): QueryStatefulOrderRequestAmino {
    const obj: any = {};
    obj.order_id = message.orderId ? OrderId.toAmino(message.orderId) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryStatefulOrderRequestAminoMsg): QueryStatefulOrderRequest {
    return QueryStatefulOrderRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryStatefulOrderRequestProtoMsg): QueryStatefulOrderRequest {
    return QueryStatefulOrderRequest.decode(message.value);
  },
  toProto(message: QueryStatefulOrderRequest): Uint8Array {
    return QueryStatefulOrderRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryStatefulOrderRequest): QueryStatefulOrderRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryStatefulOrderRequest",
      value: QueryStatefulOrderRequest.encode(message).finish()
    };
  }
};
function createBaseQueryStatefulOrderResponse(): QueryStatefulOrderResponse {
  return {
    orderPlacement: LongTermOrderPlacement.fromPartial({}),
    fillAmount: BigInt(0),
    triggered: false
  };
}
export const QueryStatefulOrderResponse = {
  typeUrl: "/dydxprotocol.clob.QueryStatefulOrderResponse",
  encode(message: QueryStatefulOrderResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.orderPlacement !== undefined) {
      LongTermOrderPlacement.encode(message.orderPlacement, writer.uint32(10).fork()).ldelim();
    }
    if (message.fillAmount !== BigInt(0)) {
      writer.uint32(16).uint64(message.fillAmount);
    }
    if (message.triggered === true) {
      writer.uint32(24).bool(message.triggered);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryStatefulOrderResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryStatefulOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderPlacement = LongTermOrderPlacement.decode(reader, reader.uint32());
          break;
        case 2:
          message.fillAmount = reader.uint64();
          break;
        case 3:
          message.triggered = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryStatefulOrderResponse>): QueryStatefulOrderResponse {
    const message = createBaseQueryStatefulOrderResponse();
    message.orderPlacement = object.orderPlacement !== undefined && object.orderPlacement !== null ? LongTermOrderPlacement.fromPartial(object.orderPlacement) : undefined;
    message.fillAmount = object.fillAmount !== undefined && object.fillAmount !== null ? BigInt(object.fillAmount.toString()) : BigInt(0);
    message.triggered = object.triggered ?? false;
    return message;
  },
  fromAmino(object: QueryStatefulOrderResponseAmino): QueryStatefulOrderResponse {
    const message = createBaseQueryStatefulOrderResponse();
    if (object.order_placement !== undefined && object.order_placement !== null) {
      message.orderPlacement = LongTermOrderPlacement.fromAmino(object.order_placement);
    }
    if (object.fill_amount !== undefined && object.fill_amount !== null) {
      message.fillAmount = BigInt(object.fill_amount);
    }
    if (object.triggered !== undefined && object.triggered !== null) {
      message.triggered = object.triggered;
    }
    return message;
  },
  toAmino(message: QueryStatefulOrderResponse): QueryStatefulOrderResponseAmino {
    const obj: any = {};
    obj.order_placement = message.orderPlacement ? LongTermOrderPlacement.toAmino(message.orderPlacement) : undefined;
    obj.fill_amount = message.fillAmount !== BigInt(0) ? message.fillAmount.toString() : undefined;
    obj.triggered = message.triggered === false ? undefined : message.triggered;
    return obj;
  },
  fromAminoMsg(object: QueryStatefulOrderResponseAminoMsg): QueryStatefulOrderResponse {
    return QueryStatefulOrderResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryStatefulOrderResponseProtoMsg): QueryStatefulOrderResponse {
    return QueryStatefulOrderResponse.decode(message.value);
  },
  toProto(message: QueryStatefulOrderResponse): Uint8Array {
    return QueryStatefulOrderResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryStatefulOrderResponse): QueryStatefulOrderResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryStatefulOrderResponse",
      value: QueryStatefulOrderResponse.encode(message).finish()
    };
  }
};
function createBaseQueryLiquidationsConfigurationRequest(): QueryLiquidationsConfigurationRequest {
  return {};
}
export const QueryLiquidationsConfigurationRequest = {
  typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationRequest",
  encode(_: QueryLiquidationsConfigurationRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidationsConfigurationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidationsConfigurationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<QueryLiquidationsConfigurationRequest>): QueryLiquidationsConfigurationRequest {
    const message = createBaseQueryLiquidationsConfigurationRequest();
    return message;
  },
  fromAmino(_: QueryLiquidationsConfigurationRequestAmino): QueryLiquidationsConfigurationRequest {
    const message = createBaseQueryLiquidationsConfigurationRequest();
    return message;
  },
  toAmino(_: QueryLiquidationsConfigurationRequest): QueryLiquidationsConfigurationRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryLiquidationsConfigurationRequestAminoMsg): QueryLiquidationsConfigurationRequest {
    return QueryLiquidationsConfigurationRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidationsConfigurationRequestProtoMsg): QueryLiquidationsConfigurationRequest {
    return QueryLiquidationsConfigurationRequest.decode(message.value);
  },
  toProto(message: QueryLiquidationsConfigurationRequest): Uint8Array {
    return QueryLiquidationsConfigurationRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidationsConfigurationRequest): QueryLiquidationsConfigurationRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationRequest",
      value: QueryLiquidationsConfigurationRequest.encode(message).finish()
    };
  }
};
function createBaseQueryLiquidationsConfigurationResponse(): QueryLiquidationsConfigurationResponse {
  return {
    liquidationsConfig: LiquidationsConfig.fromPartial({})
  };
}
export const QueryLiquidationsConfigurationResponse = {
  typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationResponse",
  encode(message: QueryLiquidationsConfigurationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.liquidationsConfig !== undefined) {
      LiquidationsConfig.encode(message.liquidationsConfig, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidationsConfigurationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidationsConfigurationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidationsConfig = LiquidationsConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryLiquidationsConfigurationResponse>): QueryLiquidationsConfigurationResponse {
    const message = createBaseQueryLiquidationsConfigurationResponse();
    message.liquidationsConfig = object.liquidationsConfig !== undefined && object.liquidationsConfig !== null ? LiquidationsConfig.fromPartial(object.liquidationsConfig) : undefined;
    return message;
  },
  fromAmino(object: QueryLiquidationsConfigurationResponseAmino): QueryLiquidationsConfigurationResponse {
    const message = createBaseQueryLiquidationsConfigurationResponse();
    if (object.liquidations_config !== undefined && object.liquidations_config !== null) {
      message.liquidationsConfig = LiquidationsConfig.fromAmino(object.liquidations_config);
    }
    return message;
  },
  toAmino(message: QueryLiquidationsConfigurationResponse): QueryLiquidationsConfigurationResponseAmino {
    const obj: any = {};
    obj.liquidations_config = message.liquidationsConfig ? LiquidationsConfig.toAmino(message.liquidationsConfig) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidationsConfigurationResponseAminoMsg): QueryLiquidationsConfigurationResponse {
    return QueryLiquidationsConfigurationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidationsConfigurationResponseProtoMsg): QueryLiquidationsConfigurationResponse {
    return QueryLiquidationsConfigurationResponse.decode(message.value);
  },
  toProto(message: QueryLiquidationsConfigurationResponse): Uint8Array {
    return QueryLiquidationsConfigurationResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidationsConfigurationResponse): QueryLiquidationsConfigurationResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.QueryLiquidationsConfigurationResponse",
      value: QueryLiquidationsConfigurationResponse.encode(message).finish()
    };
  }
};
function createBaseStreamOrderbookUpdatesRequest(): StreamOrderbookUpdatesRequest {
  return {
    clobPairId: [],
    subaccountIds: []
  };
}
export const StreamOrderbookUpdatesRequest = {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesRequest",
  encode(message: StreamOrderbookUpdatesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.clobPairId) {
      writer.uint32(v);
    }
    writer.ldelim();
    for (const v of message.subaccountIds) {
      SubaccountId.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamOrderbookUpdatesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOrderbookUpdatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.clobPairId.push(reader.uint32());
            }
          } else {
            message.clobPairId.push(reader.uint32());
          }
          break;
        case 2:
          message.subaccountIds.push(SubaccountId.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamOrderbookUpdatesRequest>): StreamOrderbookUpdatesRequest {
    const message = createBaseStreamOrderbookUpdatesRequest();
    message.clobPairId = object.clobPairId?.map(e => e) || [];
    message.subaccountIds = object.subaccountIds?.map(e => SubaccountId.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: StreamOrderbookUpdatesRequestAmino): StreamOrderbookUpdatesRequest {
    const message = createBaseStreamOrderbookUpdatesRequest();
    message.clobPairId = object.clob_pair_id?.map(e => e) || [];
    message.subaccountIds = object.subaccount_ids?.map(e => SubaccountId.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: StreamOrderbookUpdatesRequest): StreamOrderbookUpdatesRequestAmino {
    const obj: any = {};
    if (message.clobPairId) {
      obj.clob_pair_id = message.clobPairId.map(e => e);
    } else {
      obj.clob_pair_id = message.clobPairId;
    }
    if (message.subaccountIds) {
      obj.subaccount_ids = message.subaccountIds.map(e => e ? SubaccountId.toAmino(e) : undefined);
    } else {
      obj.subaccount_ids = message.subaccountIds;
    }
    return obj;
  },
  fromAminoMsg(object: StreamOrderbookUpdatesRequestAminoMsg): StreamOrderbookUpdatesRequest {
    return StreamOrderbookUpdatesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamOrderbookUpdatesRequestProtoMsg): StreamOrderbookUpdatesRequest {
    return StreamOrderbookUpdatesRequest.decode(message.value);
  },
  toProto(message: StreamOrderbookUpdatesRequest): Uint8Array {
    return StreamOrderbookUpdatesRequest.encode(message).finish();
  },
  toProtoMsg(message: StreamOrderbookUpdatesRequest): StreamOrderbookUpdatesRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesRequest",
      value: StreamOrderbookUpdatesRequest.encode(message).finish()
    };
  }
};
function createBaseStreamOrderbookUpdatesResponse(): StreamOrderbookUpdatesResponse {
  return {
    updates: []
  };
}
export const StreamOrderbookUpdatesResponse = {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesResponse",
  encode(message: StreamOrderbookUpdatesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.updates) {
      StreamUpdate.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamOrderbookUpdatesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOrderbookUpdatesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updates.push(StreamUpdate.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamOrderbookUpdatesResponse>): StreamOrderbookUpdatesResponse {
    const message = createBaseStreamOrderbookUpdatesResponse();
    message.updates = object.updates?.map(e => StreamUpdate.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: StreamOrderbookUpdatesResponseAmino): StreamOrderbookUpdatesResponse {
    const message = createBaseStreamOrderbookUpdatesResponse();
    message.updates = object.updates?.map(e => StreamUpdate.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: StreamOrderbookUpdatesResponse): StreamOrderbookUpdatesResponseAmino {
    const obj: any = {};
    if (message.updates) {
      obj.updates = message.updates.map(e => e ? StreamUpdate.toAmino(e) : undefined);
    } else {
      obj.updates = message.updates;
    }
    return obj;
  },
  fromAminoMsg(object: StreamOrderbookUpdatesResponseAminoMsg): StreamOrderbookUpdatesResponse {
    return StreamOrderbookUpdatesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamOrderbookUpdatesResponseProtoMsg): StreamOrderbookUpdatesResponse {
    return StreamOrderbookUpdatesResponse.decode(message.value);
  },
  toProto(message: StreamOrderbookUpdatesResponse): Uint8Array {
    return StreamOrderbookUpdatesResponse.encode(message).finish();
  },
  toProtoMsg(message: StreamOrderbookUpdatesResponse): StreamOrderbookUpdatesResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdatesResponse",
      value: StreamOrderbookUpdatesResponse.encode(message).finish()
    };
  }
};
function createBaseStreamUpdate(): StreamUpdate {
  return {
    orderbookUpdate: undefined,
    orderFill: undefined,
    takerOrder: undefined,
    subaccountUpdate: undefined,
    blockHeight: 0,
    execMode: 0
  };
}
export const StreamUpdate = {
  typeUrl: "/dydxprotocol.clob.StreamUpdate",
  encode(message: StreamUpdate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.orderbookUpdate !== undefined) {
      StreamOrderbookUpdate.encode(message.orderbookUpdate, writer.uint32(10).fork()).ldelim();
    }
    if (message.orderFill !== undefined) {
      StreamOrderbookFill.encode(message.orderFill, writer.uint32(18).fork()).ldelim();
    }
    if (message.takerOrder !== undefined) {
      StreamTakerOrder.encode(message.takerOrder, writer.uint32(26).fork()).ldelim();
    }
    if (message.subaccountUpdate !== undefined) {
      StreamSubaccountUpdate.encode(message.subaccountUpdate, writer.uint32(34).fork()).ldelim();
    }
    if (message.blockHeight !== 0) {
      writer.uint32(40).uint32(message.blockHeight);
    }
    if (message.execMode !== 0) {
      writer.uint32(48).uint32(message.execMode);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderbookUpdate = StreamOrderbookUpdate.decode(reader, reader.uint32());
          break;
        case 2:
          message.orderFill = StreamOrderbookFill.decode(reader, reader.uint32());
          break;
        case 3:
          message.takerOrder = StreamTakerOrder.decode(reader, reader.uint32());
          break;
        case 4:
          message.subaccountUpdate = StreamSubaccountUpdate.decode(reader, reader.uint32());
          break;
        case 5:
          message.blockHeight = reader.uint32();
          break;
        case 6:
          message.execMode = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamUpdate>): StreamUpdate {
    const message = createBaseStreamUpdate();
    message.orderbookUpdate = object.orderbookUpdate !== undefined && object.orderbookUpdate !== null ? StreamOrderbookUpdate.fromPartial(object.orderbookUpdate) : undefined;
    message.orderFill = object.orderFill !== undefined && object.orderFill !== null ? StreamOrderbookFill.fromPartial(object.orderFill) : undefined;
    message.takerOrder = object.takerOrder !== undefined && object.takerOrder !== null ? StreamTakerOrder.fromPartial(object.takerOrder) : undefined;
    message.subaccountUpdate = object.subaccountUpdate !== undefined && object.subaccountUpdate !== null ? StreamSubaccountUpdate.fromPartial(object.subaccountUpdate) : undefined;
    message.blockHeight = object.blockHeight ?? 0;
    message.execMode = object.execMode ?? 0;
    return message;
  },
  fromAmino(object: StreamUpdateAmino): StreamUpdate {
    const message = createBaseStreamUpdate();
    if (object.orderbook_update !== undefined && object.orderbook_update !== null) {
      message.orderbookUpdate = StreamOrderbookUpdate.fromAmino(object.orderbook_update);
    }
    if (object.order_fill !== undefined && object.order_fill !== null) {
      message.orderFill = StreamOrderbookFill.fromAmino(object.order_fill);
    }
    if (object.taker_order !== undefined && object.taker_order !== null) {
      message.takerOrder = StreamTakerOrder.fromAmino(object.taker_order);
    }
    if (object.subaccount_update !== undefined && object.subaccount_update !== null) {
      message.subaccountUpdate = StreamSubaccountUpdate.fromAmino(object.subaccount_update);
    }
    if (object.block_height !== undefined && object.block_height !== null) {
      message.blockHeight = object.block_height;
    }
    if (object.exec_mode !== undefined && object.exec_mode !== null) {
      message.execMode = object.exec_mode;
    }
    return message;
  },
  toAmino(message: StreamUpdate): StreamUpdateAmino {
    const obj: any = {};
    obj.orderbook_update = message.orderbookUpdate ? StreamOrderbookUpdate.toAmino(message.orderbookUpdate) : undefined;
    obj.order_fill = message.orderFill ? StreamOrderbookFill.toAmino(message.orderFill) : undefined;
    obj.taker_order = message.takerOrder ? StreamTakerOrder.toAmino(message.takerOrder) : undefined;
    obj.subaccount_update = message.subaccountUpdate ? StreamSubaccountUpdate.toAmino(message.subaccountUpdate) : undefined;
    obj.block_height = message.blockHeight === 0 ? undefined : message.blockHeight;
    obj.exec_mode = message.execMode === 0 ? undefined : message.execMode;
    return obj;
  },
  fromAminoMsg(object: StreamUpdateAminoMsg): StreamUpdate {
    return StreamUpdate.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamUpdateProtoMsg): StreamUpdate {
    return StreamUpdate.decode(message.value);
  },
  toProto(message: StreamUpdate): Uint8Array {
    return StreamUpdate.encode(message).finish();
  },
  toProtoMsg(message: StreamUpdate): StreamUpdateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamUpdate",
      value: StreamUpdate.encode(message).finish()
    };
  }
};
function createBaseStreamOrderbookUpdate(): StreamOrderbookUpdate {
  return {
    updates: [],
    snapshot: false
  };
}
export const StreamOrderbookUpdate = {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdate",
  encode(message: StreamOrderbookUpdate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.updates) {
      OffChainUpdateV1.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.snapshot === true) {
      writer.uint32(16).bool(message.snapshot);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamOrderbookUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOrderbookUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updates.push(OffChainUpdateV1.decode(reader, reader.uint32()));
          break;
        case 2:
          message.snapshot = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamOrderbookUpdate>): StreamOrderbookUpdate {
    const message = createBaseStreamOrderbookUpdate();
    message.updates = object.updates?.map(e => OffChainUpdateV1.fromPartial(e)) || [];
    message.snapshot = object.snapshot ?? false;
    return message;
  },
  fromAmino(object: StreamOrderbookUpdateAmino): StreamOrderbookUpdate {
    const message = createBaseStreamOrderbookUpdate();
    message.updates = object.updates?.map(e => OffChainUpdateV1.fromAmino(e)) || [];
    if (object.snapshot !== undefined && object.snapshot !== null) {
      message.snapshot = object.snapshot;
    }
    return message;
  },
  toAmino(message: StreamOrderbookUpdate): StreamOrderbookUpdateAmino {
    const obj: any = {};
    if (message.updates) {
      obj.updates = message.updates.map(e => e ? OffChainUpdateV1.toAmino(e) : undefined);
    } else {
      obj.updates = message.updates;
    }
    obj.snapshot = message.snapshot === false ? undefined : message.snapshot;
    return obj;
  },
  fromAminoMsg(object: StreamOrderbookUpdateAminoMsg): StreamOrderbookUpdate {
    return StreamOrderbookUpdate.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamOrderbookUpdateProtoMsg): StreamOrderbookUpdate {
    return StreamOrderbookUpdate.decode(message.value);
  },
  toProto(message: StreamOrderbookUpdate): Uint8Array {
    return StreamOrderbookUpdate.encode(message).finish();
  },
  toProtoMsg(message: StreamOrderbookUpdate): StreamOrderbookUpdateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamOrderbookUpdate",
      value: StreamOrderbookUpdate.encode(message).finish()
    };
  }
};
function createBaseStreamOrderbookFill(): StreamOrderbookFill {
  return {
    clobMatch: undefined,
    orders: [],
    fillAmounts: []
  };
}
export const StreamOrderbookFill = {
  typeUrl: "/dydxprotocol.clob.StreamOrderbookFill",
  encode(message: StreamOrderbookFill, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clobMatch !== undefined) {
      ClobMatch.encode(message.clobMatch, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.orders) {
      Order.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    writer.uint32(26).fork();
    for (const v of message.fillAmounts) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamOrderbookFill {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamOrderbookFill();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clobMatch = ClobMatch.decode(reader, reader.uint32());
          break;
        case 2:
          message.orders.push(Order.decode(reader, reader.uint32()));
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.fillAmounts.push(reader.uint64());
            }
          } else {
            message.fillAmounts.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamOrderbookFill>): StreamOrderbookFill {
    const message = createBaseStreamOrderbookFill();
    message.clobMatch = object.clobMatch !== undefined && object.clobMatch !== null ? ClobMatch.fromPartial(object.clobMatch) : undefined;
    message.orders = object.orders?.map(e => Order.fromPartial(e)) || [];
    message.fillAmounts = object.fillAmounts?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: StreamOrderbookFillAmino): StreamOrderbookFill {
    const message = createBaseStreamOrderbookFill();
    if (object.clob_match !== undefined && object.clob_match !== null) {
      message.clobMatch = ClobMatch.fromAmino(object.clob_match);
    }
    message.orders = object.orders?.map(e => Order.fromAmino(e)) || [];
    message.fillAmounts = object.fill_amounts?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: StreamOrderbookFill): StreamOrderbookFillAmino {
    const obj: any = {};
    obj.clob_match = message.clobMatch ? ClobMatch.toAmino(message.clobMatch) : undefined;
    if (message.orders) {
      obj.orders = message.orders.map(e => e ? Order.toAmino(e) : undefined);
    } else {
      obj.orders = message.orders;
    }
    if (message.fillAmounts) {
      obj.fill_amounts = message.fillAmounts.map(e => e.toString());
    } else {
      obj.fill_amounts = message.fillAmounts;
    }
    return obj;
  },
  fromAminoMsg(object: StreamOrderbookFillAminoMsg): StreamOrderbookFill {
    return StreamOrderbookFill.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamOrderbookFillProtoMsg): StreamOrderbookFill {
    return StreamOrderbookFill.decode(message.value);
  },
  toProto(message: StreamOrderbookFill): Uint8Array {
    return StreamOrderbookFill.encode(message).finish();
  },
  toProtoMsg(message: StreamOrderbookFill): StreamOrderbookFillProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamOrderbookFill",
      value: StreamOrderbookFill.encode(message).finish()
    };
  }
};
function createBaseStreamTakerOrder(): StreamTakerOrder {
  return {
    order: undefined,
    liquidationOrder: undefined,
    takerOrderStatus: undefined
  };
}
export const StreamTakerOrder = {
  typeUrl: "/dydxprotocol.clob.StreamTakerOrder",
  encode(message: StreamTakerOrder, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.order !== undefined) {
      Order.encode(message.order, writer.uint32(10).fork()).ldelim();
    }
    if (message.liquidationOrder !== undefined) {
      StreamLiquidationOrder.encode(message.liquidationOrder, writer.uint32(18).fork()).ldelim();
    }
    if (message.takerOrderStatus !== undefined) {
      StreamTakerOrderStatus.encode(message.takerOrderStatus, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamTakerOrder {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamTakerOrder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.order = Order.decode(reader, reader.uint32());
          break;
        case 2:
          message.liquidationOrder = StreamLiquidationOrder.decode(reader, reader.uint32());
          break;
        case 3:
          message.takerOrderStatus = StreamTakerOrderStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamTakerOrder>): StreamTakerOrder {
    const message = createBaseStreamTakerOrder();
    message.order = object.order !== undefined && object.order !== null ? Order.fromPartial(object.order) : undefined;
    message.liquidationOrder = object.liquidationOrder !== undefined && object.liquidationOrder !== null ? StreamLiquidationOrder.fromPartial(object.liquidationOrder) : undefined;
    message.takerOrderStatus = object.takerOrderStatus !== undefined && object.takerOrderStatus !== null ? StreamTakerOrderStatus.fromPartial(object.takerOrderStatus) : undefined;
    return message;
  },
  fromAmino(object: StreamTakerOrderAmino): StreamTakerOrder {
    const message = createBaseStreamTakerOrder();
    if (object.order !== undefined && object.order !== null) {
      message.order = Order.fromAmino(object.order);
    }
    if (object.liquidation_order !== undefined && object.liquidation_order !== null) {
      message.liquidationOrder = StreamLiquidationOrder.fromAmino(object.liquidation_order);
    }
    if (object.taker_order_status !== undefined && object.taker_order_status !== null) {
      message.takerOrderStatus = StreamTakerOrderStatus.fromAmino(object.taker_order_status);
    }
    return message;
  },
  toAmino(message: StreamTakerOrder): StreamTakerOrderAmino {
    const obj: any = {};
    obj.order = message.order ? Order.toAmino(message.order) : undefined;
    obj.liquidation_order = message.liquidationOrder ? StreamLiquidationOrder.toAmino(message.liquidationOrder) : undefined;
    obj.taker_order_status = message.takerOrderStatus ? StreamTakerOrderStatus.toAmino(message.takerOrderStatus) : undefined;
    return obj;
  },
  fromAminoMsg(object: StreamTakerOrderAminoMsg): StreamTakerOrder {
    return StreamTakerOrder.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamTakerOrderProtoMsg): StreamTakerOrder {
    return StreamTakerOrder.decode(message.value);
  },
  toProto(message: StreamTakerOrder): Uint8Array {
    return StreamTakerOrder.encode(message).finish();
  },
  toProtoMsg(message: StreamTakerOrder): StreamTakerOrderProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamTakerOrder",
      value: StreamTakerOrder.encode(message).finish()
    };
  }
};
function createBaseStreamTakerOrderStatus(): StreamTakerOrderStatus {
  return {
    orderStatus: 0,
    remainingQuantums: BigInt(0),
    optimisticallyFilledQuantums: BigInt(0)
  };
}
export const StreamTakerOrderStatus = {
  typeUrl: "/dydxprotocol.clob.StreamTakerOrderStatus",
  encode(message: StreamTakerOrderStatus, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.orderStatus !== 0) {
      writer.uint32(8).uint32(message.orderStatus);
    }
    if (message.remainingQuantums !== BigInt(0)) {
      writer.uint32(16).uint64(message.remainingQuantums);
    }
    if (message.optimisticallyFilledQuantums !== BigInt(0)) {
      writer.uint32(24).uint64(message.optimisticallyFilledQuantums);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamTakerOrderStatus {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamTakerOrderStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderStatus = reader.uint32();
          break;
        case 2:
          message.remainingQuantums = reader.uint64();
          break;
        case 3:
          message.optimisticallyFilledQuantums = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamTakerOrderStatus>): StreamTakerOrderStatus {
    const message = createBaseStreamTakerOrderStatus();
    message.orderStatus = object.orderStatus ?? 0;
    message.remainingQuantums = object.remainingQuantums !== undefined && object.remainingQuantums !== null ? BigInt(object.remainingQuantums.toString()) : BigInt(0);
    message.optimisticallyFilledQuantums = object.optimisticallyFilledQuantums !== undefined && object.optimisticallyFilledQuantums !== null ? BigInt(object.optimisticallyFilledQuantums.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: StreamTakerOrderStatusAmino): StreamTakerOrderStatus {
    const message = createBaseStreamTakerOrderStatus();
    if (object.order_status !== undefined && object.order_status !== null) {
      message.orderStatus = object.order_status;
    }
    if (object.remaining_quantums !== undefined && object.remaining_quantums !== null) {
      message.remainingQuantums = BigInt(object.remaining_quantums);
    }
    if (object.optimistically_filled_quantums !== undefined && object.optimistically_filled_quantums !== null) {
      message.optimisticallyFilledQuantums = BigInt(object.optimistically_filled_quantums);
    }
    return message;
  },
  toAmino(message: StreamTakerOrderStatus): StreamTakerOrderStatusAmino {
    const obj: any = {};
    obj.order_status = message.orderStatus === 0 ? undefined : message.orderStatus;
    obj.remaining_quantums = message.remainingQuantums !== BigInt(0) ? message.remainingQuantums.toString() : undefined;
    obj.optimistically_filled_quantums = message.optimisticallyFilledQuantums !== BigInt(0) ? message.optimisticallyFilledQuantums.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: StreamTakerOrderStatusAminoMsg): StreamTakerOrderStatus {
    return StreamTakerOrderStatus.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamTakerOrderStatusProtoMsg): StreamTakerOrderStatus {
    return StreamTakerOrderStatus.decode(message.value);
  },
  toProto(message: StreamTakerOrderStatus): Uint8Array {
    return StreamTakerOrderStatus.encode(message).finish();
  },
  toProtoMsg(message: StreamTakerOrderStatus): StreamTakerOrderStatusProtoMsg {
    return {
      typeUrl: "/dydxprotocol.clob.StreamTakerOrderStatus",
      value: StreamTakerOrderStatus.encode(message).finish()
    };
  }
};