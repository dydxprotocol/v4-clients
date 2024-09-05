import { CurrencyPair, CurrencyPairAmino, CurrencyPairSDKType } from "../../types/v1/currency_pair";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { Decimal } from "@cosmjs/math";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/** GenesisState defines the sla module's genesis state. */
export interface GenesisState {
  /** SLAs are the SLAs that are currently active. */
  slas: PriceFeedSLA[];
  /** PrceFeeds are the price feeds that are currently active. */
  priceFeeds: PriceFeed[];
  /** Params are the parameters for the sla module. */
  params: Params;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/slinky.sla.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the sla module's genesis state. */
export interface GenesisStateAmino {
  /** SLAs are the SLAs that are currently active. */
  slas?: PriceFeedSLAAmino[];
  /** PrceFeeds are the price feeds that are currently active. */
  price_feeds?: PriceFeedAmino[];
  /** Params are the parameters for the sla module. */
  params?: ParamsAmino;
}
export interface GenesisStateAminoMsg {
  type: "/slinky.sla.v1.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the sla module's genesis state. */
export interface GenesisStateSDKType {
  slas: PriceFeedSLASDKType[];
  price_feeds: PriceFeedSDKType[];
  params: ParamsSDKType;
}
/** Params defines the parameters for the sla module. */
export interface Params {
  /** Enabled is a flag to enable or disable the sla module. */
  enabled: boolean;
}
export interface ParamsProtoMsg {
  typeUrl: "/slinky.sla.v1.Params";
  value: Uint8Array;
}
/** Params defines the parameters for the sla module. */
export interface ParamsAmino {
  /** Enabled is a flag to enable or disable the sla module. */
  enabled?: boolean;
}
export interface ParamsAminoMsg {
  type: "/slinky.sla.v1.Params";
  value: ParamsAmino;
}
/** Params defines the parameters for the sla module. */
export interface ParamsSDKType {
  enabled: boolean;
}
/**
 * PriceFeedSLA defines the the desired SLA for a given set of price feeds. A
 * price feed is defined to be a set of price prices for the same (currency
 * pair, validator).
 */
export interface PriceFeedSLA {
  /**
   * MaximumViableWindow is the maximum time window that we are interested
   * for the SLA. This is used to determine the moving window of blocks that
   * we are interested in.
   */
  maximumViableWindow: bigint;
  /**
   * ExpectedUptime is the expected uptime for the given validator and price
   * feed.
   */
  expectedUptime: string;
  /**
   * SlashConstant is the constant by which we will multiply the deviation from
   * the expected uptime.
   */
  slashConstant: string;
  /**
   * MinimumBlockUpdates is the minimum number of blocks that the
   * validator had to have voted on in the maximum viable window
   * in order to be considered for the SLA.
   */
  minimumBlockUpdates: bigint;
  /** Frequency is the frequency at which we will check the SLA. */
  frequency: bigint;
  /** ID is the unique identifier for the SLA. */
  id: string;
}
export interface PriceFeedSLAProtoMsg {
  typeUrl: "/slinky.sla.v1.PriceFeedSLA";
  value: Uint8Array;
}
/**
 * PriceFeedSLA defines the the desired SLA for a given set of price feeds. A
 * price feed is defined to be a set of price prices for the same (currency
 * pair, validator).
 */
export interface PriceFeedSLAAmino {
  /**
   * MaximumViableWindow is the maximum time window that we are interested
   * for the SLA. This is used to determine the moving window of blocks that
   * we are interested in.
   */
  maximum_viable_window?: string;
  /**
   * ExpectedUptime is the expected uptime for the given validator and price
   * feed.
   */
  expected_uptime?: string;
  /**
   * SlashConstant is the constant by which we will multiply the deviation from
   * the expected uptime.
   */
  slash_constant?: string;
  /**
   * MinimumBlockUpdates is the minimum number of blocks that the
   * validator had to have voted on in the maximum viable window
   * in order to be considered for the SLA.
   */
  minimum_block_updates?: string;
  /** Frequency is the frequency at which we will check the SLA. */
  frequency?: string;
  /** ID is the unique identifier for the SLA. */
  id?: string;
}
export interface PriceFeedSLAAminoMsg {
  type: "/slinky.sla.v1.PriceFeedSLA";
  value: PriceFeedSLAAmino;
}
/**
 * PriceFeedSLA defines the the desired SLA for a given set of price feeds. A
 * price feed is defined to be a set of price prices for the same (currency
 * pair, validator).
 */
export interface PriceFeedSLASDKType {
  maximum_viable_window: bigint;
  expected_uptime: string;
  slash_constant: string;
  minimum_block_updates: bigint;
  frequency: bigint;
  id: string;
}
/**
 * PriceFeed defines the object type that will be utilized to monitor how
 * frequently validators are voting with price updates across the network.
 */
export interface PriceFeed {
  /** UpdateMap represents the relevant moving window of price feed updates. */
  updateMap: Uint8Array;
  /**
   * InclusionMap represents the relevant moving window of blocks that the
   * validator has voted on.
   */
  inclusionMap: Uint8Array;
  /** Index corresponds to the current index into the bitmap. */
  index: bigint;
  /** Validator represents the validator that this SLA corresponds to. */
  validator: Uint8Array;
  /** CurrencyPair represents the currency pair that this SLA corresponds to. */
  currencyPair: CurrencyPair;
  /**
   * MaximumViableWindow represents the maximum number of blocks that can be
   * represented by the bit map.
   */
  maximumViableWindow: bigint;
  /** ID corresponds to the SLA ID that this price feed corresponds to. */
  id: string;
}
export interface PriceFeedProtoMsg {
  typeUrl: "/slinky.sla.v1.PriceFeed";
  value: Uint8Array;
}
/**
 * PriceFeed defines the object type that will be utilized to monitor how
 * frequently validators are voting with price updates across the network.
 */
export interface PriceFeedAmino {
  /** UpdateMap represents the relevant moving window of price feed updates. */
  update_map?: string;
  /**
   * InclusionMap represents the relevant moving window of blocks that the
   * validator has voted on.
   */
  inclusion_map?: string;
  /** Index corresponds to the current index into the bitmap. */
  index?: string;
  /** Validator represents the validator that this SLA corresponds to. */
  validator?: string;
  /** CurrencyPair represents the currency pair that this SLA corresponds to. */
  currency_pair?: CurrencyPairAmino;
  /**
   * MaximumViableWindow represents the maximum number of blocks that can be
   * represented by the bit map.
   */
  maximum_viable_window?: string;
  /** ID corresponds to the SLA ID that this price feed corresponds to. */
  id?: string;
}
export interface PriceFeedAminoMsg {
  type: "/slinky.sla.v1.PriceFeed";
  value: PriceFeedAmino;
}
/**
 * PriceFeed defines the object type that will be utilized to monitor how
 * frequently validators are voting with price updates across the network.
 */
export interface PriceFeedSDKType {
  update_map: Uint8Array;
  inclusion_map: Uint8Array;
  index: bigint;
  validator: Uint8Array;
  currency_pair: CurrencyPairSDKType;
  maximum_viable_window: bigint;
  id: string;
}
function createBaseGenesisState(): GenesisState {
  return {
    slas: [],
    priceFeeds: [],
    params: Params.fromPartial({})
  };
}
export const GenesisState = {
  typeUrl: "/slinky.sla.v1.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.slas) {
      PriceFeedSLA.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.priceFeeds) {
      PriceFeed.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slas.push(PriceFeedSLA.decode(reader, reader.uint32()));
          break;
        case 2:
          message.priceFeeds.push(PriceFeed.decode(reader, reader.uint32()));
          break;
        case 3:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromPartial(e)) || [];
    message.priceFeeds = object.priceFeeds?.map(e => PriceFeed.fromPartial(e)) || [];
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromAmino(e)) || [];
    message.priceFeeds = object.price_feeds?.map(e => PriceFeed.fromAmino(e)) || [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    if (message.slas) {
      obj.slas = message.slas.map(e => e ? PriceFeedSLA.toAmino(e) : undefined);
    } else {
      obj.slas = message.slas;
    }
    if (message.priceFeeds) {
      obj.price_feeds = message.priceFeeds.map(e => e ? PriceFeed.toAmino(e) : undefined);
    } else {
      obj.price_feeds = message.priceFeeds;
    }
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    enabled: false
  };
}
export const Params = {
  typeUrl: "/slinky.sla.v1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.enabled === true) {
      writer.uint32(8).bool(message.enabled);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.enabled = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.enabled = object.enabled ?? false;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.enabled !== undefined && object.enabled !== null) {
      message.enabled = object.enabled;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.enabled = message.enabled === false ? undefined : message.enabled;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBasePriceFeedSLA(): PriceFeedSLA {
  return {
    maximumViableWindow: BigInt(0),
    expectedUptime: "",
    slashConstant: "",
    minimumBlockUpdates: BigInt(0),
    frequency: BigInt(0),
    id: ""
  };
}
export const PriceFeedSLA = {
  typeUrl: "/slinky.sla.v1.PriceFeedSLA",
  encode(message: PriceFeedSLA, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maximumViableWindow !== BigInt(0)) {
      writer.uint32(8).uint64(message.maximumViableWindow);
    }
    if (message.expectedUptime !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.expectedUptime, 18).atomics);
    }
    if (message.slashConstant !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.slashConstant, 18).atomics);
    }
    if (message.minimumBlockUpdates !== BigInt(0)) {
      writer.uint32(32).uint64(message.minimumBlockUpdates);
    }
    if (message.frequency !== BigInt(0)) {
      writer.uint32(40).uint64(message.frequency);
    }
    if (message.id !== "") {
      writer.uint32(50).string(message.id);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PriceFeedSLA {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceFeedSLA();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maximumViableWindow = reader.uint64();
          break;
        case 2:
          message.expectedUptime = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.slashConstant = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 4:
          message.minimumBlockUpdates = reader.uint64();
          break;
        case 5:
          message.frequency = reader.uint64();
          break;
        case 6:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PriceFeedSLA>): PriceFeedSLA {
    const message = createBasePriceFeedSLA();
    message.maximumViableWindow = object.maximumViableWindow !== undefined && object.maximumViableWindow !== null ? BigInt(object.maximumViableWindow.toString()) : BigInt(0);
    message.expectedUptime = object.expectedUptime ?? "";
    message.slashConstant = object.slashConstant ?? "";
    message.minimumBlockUpdates = object.minimumBlockUpdates !== undefined && object.minimumBlockUpdates !== null ? BigInt(object.minimumBlockUpdates.toString()) : BigInt(0);
    message.frequency = object.frequency !== undefined && object.frequency !== null ? BigInt(object.frequency.toString()) : BigInt(0);
    message.id = object.id ?? "";
    return message;
  },
  fromAmino(object: PriceFeedSLAAmino): PriceFeedSLA {
    const message = createBasePriceFeedSLA();
    if (object.maximum_viable_window !== undefined && object.maximum_viable_window !== null) {
      message.maximumViableWindow = BigInt(object.maximum_viable_window);
    }
    if (object.expected_uptime !== undefined && object.expected_uptime !== null) {
      message.expectedUptime = object.expected_uptime;
    }
    if (object.slash_constant !== undefined && object.slash_constant !== null) {
      message.slashConstant = object.slash_constant;
    }
    if (object.minimum_block_updates !== undefined && object.minimum_block_updates !== null) {
      message.minimumBlockUpdates = BigInt(object.minimum_block_updates);
    }
    if (object.frequency !== undefined && object.frequency !== null) {
      message.frequency = BigInt(object.frequency);
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
  toAmino(message: PriceFeedSLA): PriceFeedSLAAmino {
    const obj: any = {};
    obj.maximum_viable_window = message.maximumViableWindow !== BigInt(0) ? message.maximumViableWindow.toString() : undefined;
    obj.expected_uptime = message.expectedUptime === "" ? undefined : message.expectedUptime;
    obj.slash_constant = message.slashConstant === "" ? undefined : message.slashConstant;
    obj.minimum_block_updates = message.minimumBlockUpdates !== BigInt(0) ? message.minimumBlockUpdates.toString() : undefined;
    obj.frequency = message.frequency !== BigInt(0) ? message.frequency.toString() : undefined;
    obj.id = message.id === "" ? undefined : message.id;
    return obj;
  },
  fromAminoMsg(object: PriceFeedSLAAminoMsg): PriceFeedSLA {
    return PriceFeedSLA.fromAmino(object.value);
  },
  fromProtoMsg(message: PriceFeedSLAProtoMsg): PriceFeedSLA {
    return PriceFeedSLA.decode(message.value);
  },
  toProto(message: PriceFeedSLA): Uint8Array {
    return PriceFeedSLA.encode(message).finish();
  },
  toProtoMsg(message: PriceFeedSLA): PriceFeedSLAProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.PriceFeedSLA",
      value: PriceFeedSLA.encode(message).finish()
    };
  }
};
function createBasePriceFeed(): PriceFeed {
  return {
    updateMap: new Uint8Array(),
    inclusionMap: new Uint8Array(),
    index: BigInt(0),
    validator: new Uint8Array(),
    currencyPair: CurrencyPair.fromPartial({}),
    maximumViableWindow: BigInt(0),
    id: ""
  };
}
export const PriceFeed = {
  typeUrl: "/slinky.sla.v1.PriceFeed",
  encode(message: PriceFeed, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.updateMap.length !== 0) {
      writer.uint32(10).bytes(message.updateMap);
    }
    if (message.inclusionMap.length !== 0) {
      writer.uint32(18).bytes(message.inclusionMap);
    }
    if (message.index !== BigInt(0)) {
      writer.uint32(24).uint64(message.index);
    }
    if (message.validator.length !== 0) {
      writer.uint32(34).bytes(message.validator);
    }
    if (message.currencyPair !== undefined) {
      CurrencyPair.encode(message.currencyPair, writer.uint32(42).fork()).ldelim();
    }
    if (message.maximumViableWindow !== BigInt(0)) {
      writer.uint32(48).uint64(message.maximumViableWindow);
    }
    if (message.id !== "") {
      writer.uint32(58).string(message.id);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PriceFeed {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceFeed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updateMap = reader.bytes();
          break;
        case 2:
          message.inclusionMap = reader.bytes();
          break;
        case 3:
          message.index = reader.uint64();
          break;
        case 4:
          message.validator = reader.bytes();
          break;
        case 5:
          message.currencyPair = CurrencyPair.decode(reader, reader.uint32());
          break;
        case 6:
          message.maximumViableWindow = reader.uint64();
          break;
        case 7:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PriceFeed>): PriceFeed {
    const message = createBasePriceFeed();
    message.updateMap = object.updateMap ?? new Uint8Array();
    message.inclusionMap = object.inclusionMap ?? new Uint8Array();
    message.index = object.index !== undefined && object.index !== null ? BigInt(object.index.toString()) : BigInt(0);
    message.validator = object.validator ?? new Uint8Array();
    message.currencyPair = object.currencyPair !== undefined && object.currencyPair !== null ? CurrencyPair.fromPartial(object.currencyPair) : undefined;
    message.maximumViableWindow = object.maximumViableWindow !== undefined && object.maximumViableWindow !== null ? BigInt(object.maximumViableWindow.toString()) : BigInt(0);
    message.id = object.id ?? "";
    return message;
  },
  fromAmino(object: PriceFeedAmino): PriceFeed {
    const message = createBasePriceFeed();
    if (object.update_map !== undefined && object.update_map !== null) {
      message.updateMap = bytesFromBase64(object.update_map);
    }
    if (object.inclusion_map !== undefined && object.inclusion_map !== null) {
      message.inclusionMap = bytesFromBase64(object.inclusion_map);
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = BigInt(object.index);
    }
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = bytesFromBase64(object.validator);
    }
    if (object.currency_pair !== undefined && object.currency_pair !== null) {
      message.currencyPair = CurrencyPair.fromAmino(object.currency_pair);
    }
    if (object.maximum_viable_window !== undefined && object.maximum_viable_window !== null) {
      message.maximumViableWindow = BigInt(object.maximum_viable_window);
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
  toAmino(message: PriceFeed): PriceFeedAmino {
    const obj: any = {};
    obj.update_map = message.updateMap ? base64FromBytes(message.updateMap) : undefined;
    obj.inclusion_map = message.inclusionMap ? base64FromBytes(message.inclusionMap) : undefined;
    obj.index = message.index !== BigInt(0) ? message.index.toString() : undefined;
    obj.validator = message.validator ? base64FromBytes(message.validator) : undefined;
    obj.currency_pair = message.currencyPair ? CurrencyPair.toAmino(message.currencyPair) : undefined;
    obj.maximum_viable_window = message.maximumViableWindow !== BigInt(0) ? message.maximumViableWindow.toString() : undefined;
    obj.id = message.id === "" ? undefined : message.id;
    return obj;
  },
  fromAminoMsg(object: PriceFeedAminoMsg): PriceFeed {
    return PriceFeed.fromAmino(object.value);
  },
  fromProtoMsg(message: PriceFeedProtoMsg): PriceFeed {
    return PriceFeed.decode(message.value);
  },
  toProto(message: PriceFeed): Uint8Array {
    return PriceFeed.encode(message).finish();
  },
  toProtoMsg(message: PriceFeed): PriceFeedProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.PriceFeed",
      value: PriceFeed.encode(message).finish()
    };
  }
};