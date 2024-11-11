"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.Network = exports.ValidatorConfig = exports.IndexerConfig = exports.PAGE_REQUEST = exports.SHORT_BLOCK_FORWARD = exports.SHORT_BLOCK_WINDOW = exports.MAX_MEMO_CHARACTERS = exports.DEFAULT_API_TIMEOUT = exports.TimePeriod = exports.PositionStatus = exports.TickerType = exports.OrderStatus = exports.OrderExecution = exports.OrderTimeInForce = exports.OrderSide = exports.OrderType = exports.MarketStatisticDay = exports.NETWORK_ID_TESTNET = exports.NETWORK_ID_MAINNET = exports.NetworkId = exports.ValidatorApiHost = exports.FaucetApiHost = exports.IndexerWSHost = exports.IndexerApiHost = exports.TESTNET_CHAIN_ID = exports.STAGING_CHAIN_ID = exports.DEV_CHAIN_ID = void 0;
var long_1 = require("long");
__exportStar(require("../lib/constants"), exports);
// Chain ID
exports.DEV_CHAIN_ID = 'dydxprotocol-testnet';
exports.STAGING_CHAIN_ID = 'dydxprotocol-testnet';
exports.TESTNET_CHAIN_ID = 'dydx-testnet-4';
// ------------ API URLs ------------
var IndexerApiHost;
(function (IndexerApiHost) {
    IndexerApiHost["TESTNET"] = "https://indexer.v4testnet.dydx.exchange";
    // TODO: Add MAINNET
})(IndexerApiHost = exports.IndexerApiHost || (exports.IndexerApiHost = {}));
var IndexerWSHost;
(function (IndexerWSHost) {
    IndexerWSHost["TESTNET"] = "wss://indexer.v4testnet.dydx.exchange/v4/ws";
    // TODO: Add MAINNET
})(IndexerWSHost = exports.IndexerWSHost || (exports.IndexerWSHost = {}));
var FaucetApiHost;
(function (FaucetApiHost) {
    FaucetApiHost["TESTNET"] = "https://faucet.v4testnet.dydx.exchange";
})(FaucetApiHost = exports.FaucetApiHost || (exports.FaucetApiHost = {}));
var ValidatorApiHost;
(function (ValidatorApiHost) {
    ValidatorApiHost["TESTNET"] = "https://dydx-testnet-archive.allthatnode.com";
    // TODO: Add MAINNET
})(ValidatorApiHost = exports.ValidatorApiHost || (exports.ValidatorApiHost = {}));
// ------------ Network IDs ------------
var NetworkId;
(function (NetworkId) {
    NetworkId["TESTNET"] = "dydx-testnet-4";
    // TODO: Add MAINNET
})(NetworkId = exports.NetworkId || (exports.NetworkId = {}));
exports.NETWORK_ID_MAINNET = null;
exports.NETWORK_ID_TESTNET = 'dydxprotocol-testnet';
// ------------ Market Statistic Day Types ------------
var MarketStatisticDay;
(function (MarketStatisticDay) {
    MarketStatisticDay["ONE"] = "1";
    MarketStatisticDay["SEVEN"] = "7";
    MarketStatisticDay["THIRTY"] = "30";
})(MarketStatisticDay = exports.MarketStatisticDay || (exports.MarketStatisticDay = {}));
// ------------ Order Types ------------
// This should match OrderType in Abacus
var OrderType;
(function (OrderType) {
    OrderType["LIMIT"] = "LIMIT";
    OrderType["MARKET"] = "MARKET";
    OrderType["STOP_LIMIT"] = "STOP_LIMIT";
    OrderType["TAKE_PROFIT_LIMIT"] = "TAKE_PROFIT";
    OrderType["STOP_MARKET"] = "STOP_MARKET";
    OrderType["TAKE_PROFIT_MARKET"] = "TAKE_PROFIT_MARKET";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
// ------------ Order Side ------------
// This should match OrderSide in Abacus
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
// ------------ Order TimeInForce ------------
// This should match OrderTimeInForce in Abacus
var OrderTimeInForce;
(function (OrderTimeInForce) {
    OrderTimeInForce["GTT"] = "GTT";
    OrderTimeInForce["IOC"] = "IOC";
    OrderTimeInForce["FOK"] = "FOK";
})(OrderTimeInForce = exports.OrderTimeInForce || (exports.OrderTimeInForce = {}));
// ------------ Order Execution ------------
// This should match OrderExecution in Abacus
var OrderExecution;
(function (OrderExecution) {
    OrderExecution["DEFAULT"] = "DEFAULT";
    OrderExecution["IOC"] = "IOC";
    OrderExecution["FOK"] = "FOK";
    OrderExecution["POST_ONLY"] = "POST_ONLY";
})(OrderExecution = exports.OrderExecution || (exports.OrderExecution = {}));
// ------------ Order Status ------------
// This should match OrderStatus in Abacus
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["BEST_EFFORT_OPENED"] = "BEST_EFFORT_OPENED";
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["BEST_EFFORT_CANCELED"] = "BEST_EFFORT_CANCELED";
    OrderStatus["CANCELED"] = "CANCELED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var TickerType;
(function (TickerType) {
    TickerType["PERPETUAL"] = "PERPETUAL";
})(TickerType = exports.TickerType || (exports.TickerType = {}));
var PositionStatus;
(function (PositionStatus) {
    PositionStatus["OPEN"] = "OPEN";
    PositionStatus["CLOSED"] = "CLOSED";
    PositionStatus["LIQUIDATED"] = "LIQUIDATED";
})(PositionStatus = exports.PositionStatus || (exports.PositionStatus = {}));
// ----------- Time Period for Sparklines -------------
var TimePeriod;
(function (TimePeriod) {
    TimePeriod["ONE_DAY"] = "ONE_DAY";
    TimePeriod["SEVEN_DAYS"] = "SEVEN_DAYS";
})(TimePeriod = exports.TimePeriod || (exports.TimePeriod = {}));
// ------------ API Defaults ------------
exports.DEFAULT_API_TIMEOUT = 3000;
exports.MAX_MEMO_CHARACTERS = 256;
exports.SHORT_BLOCK_WINDOW = 20;
exports.SHORT_BLOCK_FORWARD = 3;
// Querying
exports.PAGE_REQUEST = {
    key: new Uint8Array(),
    offset: long_1["default"].UZERO,
    limit: long_1["default"].MAX_UNSIGNED_VALUE,
    countTotal: true,
    reverse: false
};
var IndexerConfig = /** @class */ (function () {
    function IndexerConfig(restEndpoint, websocketEndpoint) {
        this.restEndpoint = restEndpoint;
        this.websocketEndpoint = websocketEndpoint;
    }
    return IndexerConfig;
}());
exports.IndexerConfig = IndexerConfig;
var ValidatorConfig = /** @class */ (function () {
    function ValidatorConfig(restEndpoint, chainId, denoms, broadcastOptions) {
        this.restEndpoint = (restEndpoint === null || restEndpoint === void 0 ? void 0 : restEndpoint.endsWith('/')) ? restEndpoint.slice(0, -1) : restEndpoint;
        this.chainId = chainId;
        this.denoms = denoms;
        this.broadcastOptions = broadcastOptions;
    }
    return ValidatorConfig;
}());
exports.ValidatorConfig = ValidatorConfig;
var Network = /** @class */ (function () {
    function Network(env, indexerConfig, validatorConfig) {
        this.env = env;
        this.indexerConfig = indexerConfig;
        this.validatorConfig = validatorConfig;
    }
    Network.testnet = function () {
        var indexerConfig = new IndexerConfig(IndexerApiHost.TESTNET, IndexerWSHost.TESTNET);
        var validatorConfig = new ValidatorConfig(ValidatorApiHost.TESTNET, exports.TESTNET_CHAIN_ID, {
            CHAINTOKEN_DENOM: 'adv4tnt',
            USDC_DENOM: 'ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5',
            USDC_GAS_DENOM: 'uusdc',
            USDC_DECIMALS: 6,
            CHAINTOKEN_DECIMALS: 18
        });
        return new Network('testnet', indexerConfig, validatorConfig);
    };
    // TODO: Add mainnet(): Network
    Network.prototype.getString = function () {
        return this.env;
    };
    return Network;
}());
exports.Network = Network;
