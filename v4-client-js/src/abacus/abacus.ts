import Abacus, { kollections } from '@dydxprotocol/v4-abacus';

export type Nullable<T> = T | null | undefined;

// ------ V4 Protocols ------ //
export const AbacusAppConfig = Abacus.exchange.dydx.abacus.state.manager.AppConfigs;
export const IOImplementations = Abacus.exchange.dydx.abacus.utils.IOImplementations;
export const UIImplementations = Abacus.exchange.dydx.abacus.utils.UIImplementations;
export type AbacusDYDXChainTransactionsProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.DYDXChainTransactionsProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusRestProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.RestProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusWebsocketProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.WebSocketProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusStateNotificationProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.StateNotificationProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusLocalizerProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.LocalizerProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusFormatterProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.FormatterProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusThreadingProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.ThreadingProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusFileSystemProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.FileSystemProtocol,
  '__doNotUseOrImplementIt'
>;
export type AbacusTrackingProtocol = Omit<
  Abacus.exchange.dydx.abacus.protocols.TrackingProtocol,
  '__doNotUseOrImplementIt'
>;

export type FileLocation = Abacus.exchange.dydx.abacus.protocols.FileLocation;
export type ThreadingType = Abacus.exchange.dydx.abacus.protocols.ThreadingType;
export const CoroutineTimer = Abacus.exchange.dydx.abacus.utils.CoroutineTimer;

// ------ Networking ------ //
export const QueryType = Abacus.exchange.dydx.abacus.protocols.QueryType;
const queryTypes = [...QueryType.values()] as const;
export type QueryTypes = (typeof queryTypes)[number];

export const TransactionType = Abacus.exchange.dydx.abacus.protocols.TransactionType;
const transactionTypes = [...TransactionType.values()] as const;
export type TransactionTypes = (typeof transactionTypes)[number];

// ------ State ------
export type AbacusApiState = Abacus.exchange.dydx.abacus.state.manager.ApiState;
export const AbacusApiStatus = Abacus.exchange.dydx.abacus.state.manager.ApiStatus;
const abacusApiStatuses = [...AbacusApiStatus.values()];
export type AbacusApiStatuses = (typeof abacusApiStatuses)[number];
export const Changes = Abacus.exchange.dydx.abacus.state.changes.Changes;
export type PerpetualStateChanges = Abacus.exchange.dydx.abacus.state.changes.StateChanges;
// eslint-disable-next-line max-len
export const AsyncAbacusStateManager = Abacus.exchange.dydx.abacus.state.manager.AsyncAbacusStateManager;

// ------ Parsing Errors ------ //
export type ParsingError = Abacus.exchange.dydx.abacus.responses.ParsingError;
export type ParsingErrors = kollections.List<ParsingError>;
export const ParsingErrorType = Abacus.exchange.dydx.abacus.responses.ParsingErrorType;
const parsingErrorTypes = [...ParsingErrorType.values()] as const;
export type ParsingErrorTypes = (typeof parsingErrorTypes)[number];

// ------ Perpetuals/Markets ------ //
export type PerpetualState = Abacus.exchange.dydx.abacus.output.PerpetualState;
export type MarketCandles = Abacus.exchange.dydx.abacus.output.MarketCandles;
export type MarketOrderbook = Abacus.exchange.dydx.abacus.output.MarketOrderbook;
export type MarketPerpetual = Abacus.exchange.dydx.abacus.output.MarketPerpetual;
export type MarketStatus = Abacus.exchange.dydx.abacus.output.MarketStatus;
export type MarketTrade = Abacus.exchange.dydx.abacus.output.MarketTrade;
export type MarketTrades = kollections.List<Abacus.exchange.dydx.abacus.output.MarketTrade>;
export type MarketsSummary = Partial<Abacus.exchange.dydx.abacus.output.PerpetualMarketSummary>;
export type OrderbookLine = Abacus.exchange.dydx.abacus.output.OrderbookLine;
export type PerpetualMarket = Abacus.exchange.dydx.abacus.output.PerpetualMarket;
export type MarketHistoricalFunding = Abacus.exchange.dydx.abacus.output.MarketHistoricalFunding;

// ------ Configs ------ //
export type Configs = Abacus.exchange.dydx.abacus.output.Configs;
export type FeeDiscount = Abacus.exchange.dydx.abacus.output.FeeDiscount;
export type FeeDiscountResources = Abacus.exchange.dydx.abacus.output.FeeDiscountResources;
export type FeeTier = Abacus.exchange.dydx.abacus.output.FeeTier;
export type FeeTierResources = Abacus.exchange.dydx.abacus.output.FeeTierResources;
export type NetworkConfigs = Abacus.exchange.dydx.abacus.output.NetworkConfigs;

// ------ Assets ------ //
export type Asset = Abacus.exchange.dydx.abacus.output.Asset;
export type AssetResources = Abacus.exchange.dydx.abacus.output.AssetResources;

// ------ Inputs ------ //
export type Inputs = Abacus.exchange.dydx.abacus.output.input.Input;
export type TradeInputs = Abacus.exchange.dydx.abacus.output.input.TradeInput;
export type ClosePositionInputs = Abacus.exchange.dydx.abacus.output.input.ClosePositionInput;
export type TradeInputSummary = Abacus.exchange.dydx.abacus.output.input.TradeInputSummary;
export type TransferInputs = Abacus.exchange.dydx.abacus.output.input.TransferInput;
export type InputError = Abacus.exchange.dydx.abacus.output.input.ValidationError;
export type TransferInputTokenResource =
  Abacus.exchange.dydx.abacus.output.input.TransferInputTokenResource;
export type TransferInputChainResource =
  Abacus.exchange.dydx.abacus.output.input.TransferInputChainResource;
export type SelectionOption = Abacus.exchange.dydx.abacus.output.input.SelectionOption;
export const ErrorType = Abacus.exchange.dydx.abacus.output.input.ErrorType;
export const InputSelectionOption = Abacus.exchange.dydx.abacus.output.input.SelectionOption;

// ------ Wallet ------ //
export type Wallet = Abacus.exchange.dydx.abacus.output.Wallet;
export type AccountBalance = Abacus.exchange.dydx.abacus.output.AccountBalance;
export type Subaccount = Abacus.exchange.dydx.abacus.output.Subaccount;
export type SubaccountPosition = Abacus.exchange.dydx.abacus.output.SubaccountPosition;
export type SubaccountOrder = Abacus.exchange.dydx.abacus.output.SubaccountOrder;
export type OrderStatus = Abacus.exchange.dydx.abacus.output.input.OrderStatus;
export const AbacusOrderStatus = Abacus.exchange.dydx.abacus.output.input.OrderStatus;
const abacusOrderStatuses = [...AbacusOrderStatus.values()] as const;
export type AbacusOrderStatuses = (typeof abacusOrderStatuses)[number];
export type SubaccountFills = Abacus.exchange.dydx.abacus.output.SubaccountFill[];
export type SubaccountFill = Abacus.exchange.dydx.abacus.output.SubaccountFill;
export type SubaccountFundingPayment = Abacus.exchange.dydx.abacus.output.SubaccountFundingPayment;
export type SubaccountFundingPayments =
  Abacus.exchange.dydx.abacus.output.SubaccountFundingPayment[];
export type SubaccountTransfer = Abacus.exchange.dydx.abacus.output.SubaccountTransfer;
export type SubaccountTransfers = Abacus.exchange.dydx.abacus.output.SubaccountTransfer[];

// ------ Historical PnL ------ //
export type SubAccountHistoricalPNL = Abacus.exchange.dydx.abacus.output.SubaccountHistoricalPNL;
export type SubAccountHistoricalPNLs = Abacus.exchange.dydx.abacus.output.SubaccountHistoricalPNL[];
export const HistoricalPnlPeriod = Abacus.exchange.dydx.abacus.protocols.HistoricalPnlPeriod;
const historicalPnlPeriod = [...HistoricalPnlPeriod.values()] as const;
export type HistoricalPnlPeriods = (typeof historicalPnlPeriod)[number];

// ------ Transfer Items ------ //
export const TransferInputField = Abacus.exchange.dydx.abacus.state.model.TransferInputField;
const transferInputFields = [...TransferInputField.values()] as const;
export type TransferInputFields = (typeof transferInputFields)[number];

export const TransferType = Abacus.exchange.dydx.abacus.output.input.TransferType;
const transferTypes = [...TransferType.values()] as const;
export type TransferTypes = (typeof transferTypes)[number];

// ------ Trade Items ------ //
export const TradeInputField = Abacus.exchange.dydx.abacus.state.model.TradeInputField;
const tradeInputFields = [...TradeInputField.values()] as const;
export type TradeInputFields = (typeof tradeInputFields)[number];

export type TradeState<T> = {
  current?: Nullable<T>;
  postAllOrders?: Nullable<T>;
  postOrder?: Nullable<T>;
};

// eslint-disable-next-line max-len
export const ClosePositionInputField = Abacus.exchange.dydx.abacus.state.model.ClosePositionInputField;

const closePositionInputFields = [...ClosePositionInputField.values()] as const;
export type ClosePositionInputFields = (typeof closePositionInputFields)[number];

export type ValidationError = Abacus.exchange.dydx.abacus.output.input.ValidationError;
export const TradeInputErrorAction = Abacus.exchange.dydx.abacus.output.input.ErrorAction;
export type AbacusOrderTypes = Abacus.exchange.dydx.abacus.output.input.OrderType;
export type AbacusOrderSides = Abacus.exchange.dydx.abacus.output.input.OrderSide;
export const AbacusOrderType = Abacus.exchange.dydx.abacus.output.input.OrderType;
export const AbacusOrderSide = Abacus.exchange.dydx.abacus.output.input.OrderSide;

export const AbacusPositionSide = Abacus.exchange.dydx.abacus.output.PositionSide;
export type AbacusPositionSides = Abacus.exchange.dydx.abacus.output.PositionSide;

export type HumanReadablePlaceOrderPayload =
  Abacus.exchange.dydx.abacus.state.manager.HumanReadablePlaceOrderPayload;
export type HumanReadableCancelOrderPayload =
  Abacus.exchange.dydx.abacus.state.manager.HumanReadableCancelOrderPayload;
export type HumanReadableWithdrawPayload =
  Abacus.exchange.dydx.abacus.state.manager.HumanReadableWithdrawPayload;
export type HumanReadableTransferPayload =
  Abacus.exchange.dydx.abacus.state.manager.HumanReadableTransferPayload;

// ------ Helpers ------ //
export const AbacusHelper = Abacus.exchange.dydx.abacus.utils.AbacusHelper;

export const RiskLevel = Abacus.exchange.dydx.abacus.utils.RiskLevel;
const riskLevels = [...RiskLevel.values()] as const;
export type RiskLevels = (typeof riskLevels)[number];

// ------ Notifications ------ //
export type AbacusNotification = Abacus.exchange.dydx.abacus.output.Notification;

// ------ Restrictions ------ //
export type UsageRestriction = Abacus.exchange.dydx.abacus.output.UsageRestriction;
export const RestrictionType = Abacus.exchange.dydx.abacus.output.Restriction;
const restrictionTypes = [...RestrictionType.values()] as const;
export type RestrictionTypes = (typeof restrictionTypes)[number];

// ------ Enum Conversions ------ //
type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

type ReadonlyKeysOf<T> = {
  [K in keyof T]: IfEquals<{ [_ in K]: T[K] }, { readonly [_ in K]: T[K] }, K, never>;
}[keyof T];

export type KotlinIrEnumValues<T> = Exclude<ReadonlyKeysOf<T>, 'Companion' | '$serializer'>;

export const HISTORICAL_PNL_PERIODS: Record<
  KotlinIrEnumValues<typeof HistoricalPnlPeriod>,
  HistoricalPnlPeriods
> = {
  [HistoricalPnlPeriod.Period1d.name]: HistoricalPnlPeriod.Period1d,
  [HistoricalPnlPeriod.Period7d.name]: HistoricalPnlPeriod.Period7d,
  [HistoricalPnlPeriod.Period30d.name]: HistoricalPnlPeriod.Period30d,
  [HistoricalPnlPeriod.Period90d.name]: HistoricalPnlPeriod.Period90d,
};

// Custom types involving Abacus

export type NetworkConfig = Partial<{
  indexerUrl: Nullable<string>;
  websocketUrl: Nullable<string>;
  validatorUrl: Nullable<string>;
  chainId: Nullable<string>;
  faucetUrl: Nullable<string>;
  USDC_DENOM: Nullable<string>;
  USDC_DECIMALS: Nullable<number>;
  USDC_GAS_DENOM: Nullable<string>;
  CHAINTOKEN_DENOM: Nullable<string>;
  CHAINTOKEN_DECIMALS: Nullable<number>;
}>;
