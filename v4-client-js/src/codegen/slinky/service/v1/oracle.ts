import { Timestamp } from "../../../google/protobuf/timestamp";
import { MarketMap, MarketMapAmino, MarketMapSDKType } from "../../marketmap/v1/market";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { toTimestamp, fromTimestamp } from "../../../helpers";
/** QueryPricesRequest defines the request type for the the Prices method. */
export interface QueryPricesRequest {}
export interface QueryPricesRequestProtoMsg {
  typeUrl: "/slinky.service.v1.QueryPricesRequest";
  value: Uint8Array;
}
/** QueryPricesRequest defines the request type for the the Prices method. */
export interface QueryPricesRequestAmino {}
export interface QueryPricesRequestAminoMsg {
  type: "/slinky.service.v1.QueryPricesRequest";
  value: QueryPricesRequestAmino;
}
/** QueryPricesRequest defines the request type for the the Prices method. */
export interface QueryPricesRequestSDKType {}
export interface QueryPricesResponse_PricesEntry {
  key: string;
  value: string;
}
export interface QueryPricesResponse_PricesEntryProtoMsg {
  typeUrl: string;
  value: Uint8Array;
}
export interface QueryPricesResponse_PricesEntryAmino {
  key?: string;
  value?: string;
}
export interface QueryPricesResponse_PricesEntryAminoMsg {
  type: string;
  value: QueryPricesResponse_PricesEntryAmino;
}
export interface QueryPricesResponse_PricesEntrySDKType {
  key: string;
  value: string;
}
/** QueryPricesResponse defines the response type for the Prices method. */
export interface QueryPricesResponse {
  /** Prices defines the list of prices. */
  prices: {
    [key: string]: string;
  };
  /** Timestamp defines the timestamp of the prices. */
  timestamp: Date;
  /** Version defines the version of the oracle service that provided the prices. */
  version: string;
}
export interface QueryPricesResponseProtoMsg {
  typeUrl: "/slinky.service.v1.QueryPricesResponse";
  value: Uint8Array;
}
/** QueryPricesResponse defines the response type for the Prices method. */
export interface QueryPricesResponseAmino {
  /** Prices defines the list of prices. */
  prices?: {
    [key: string]: string;
  };
  /** Timestamp defines the timestamp of the prices. */
  timestamp?: string;
  /** Version defines the version of the oracle service that provided the prices. */
  version?: string;
}
export interface QueryPricesResponseAminoMsg {
  type: "/slinky.service.v1.QueryPricesResponse";
  value: QueryPricesResponseAmino;
}
/** QueryPricesResponse defines the response type for the Prices method. */
export interface QueryPricesResponseSDKType {
  prices: {
    [key: string]: string;
  };
  timestamp: Date;
  version: string;
}
/** QueryMarketMapRequest defines the request type for the MarketMap method. */
export interface QueryMarketMapRequest {}
export interface QueryMarketMapRequestProtoMsg {
  typeUrl: "/slinky.service.v1.QueryMarketMapRequest";
  value: Uint8Array;
}
/** QueryMarketMapRequest defines the request type for the MarketMap method. */
export interface QueryMarketMapRequestAmino {}
export interface QueryMarketMapRequestAminoMsg {
  type: "/slinky.service.v1.QueryMarketMapRequest";
  value: QueryMarketMapRequestAmino;
}
/** QueryMarketMapRequest defines the request type for the MarketMap method. */
export interface QueryMarketMapRequestSDKType {}
/** QueryMarketMapResponse defines the response type for the MarketMap method. */
export interface QueryMarketMapResponse {
  /** MarketMap defines the current market map configuration. */
  marketMap?: MarketMap;
}
export interface QueryMarketMapResponseProtoMsg {
  typeUrl: "/slinky.service.v1.QueryMarketMapResponse";
  value: Uint8Array;
}
/** QueryMarketMapResponse defines the response type for the MarketMap method. */
export interface QueryMarketMapResponseAmino {
  /** MarketMap defines the current market map configuration. */
  market_map?: MarketMapAmino;
}
export interface QueryMarketMapResponseAminoMsg {
  type: "/slinky.service.v1.QueryMarketMapResponse";
  value: QueryMarketMapResponseAmino;
}
/** QueryMarketMapResponse defines the response type for the MarketMap method. */
export interface QueryMarketMapResponseSDKType {
  market_map?: MarketMapSDKType;
}
/** QueryVersionRequest defines the request type for the Version method. */
export interface QueryVersionRequest {}
export interface QueryVersionRequestProtoMsg {
  typeUrl: "/slinky.service.v1.QueryVersionRequest";
  value: Uint8Array;
}
/** QueryVersionRequest defines the request type for the Version method. */
export interface QueryVersionRequestAmino {}
export interface QueryVersionRequestAminoMsg {
  type: "/slinky.service.v1.QueryVersionRequest";
  value: QueryVersionRequestAmino;
}
/** QueryVersionRequest defines the request type for the Version method. */
export interface QueryVersionRequestSDKType {}
/** QueryVersionResponse defines the response type for the Version method. */
export interface QueryVersionResponse {
  /** Version defines the current version of the oracle service. */
  version: string;
}
export interface QueryVersionResponseProtoMsg {
  typeUrl: "/slinky.service.v1.QueryVersionResponse";
  value: Uint8Array;
}
/** QueryVersionResponse defines the response type for the Version method. */
export interface QueryVersionResponseAmino {
  /** Version defines the current version of the oracle service. */
  version?: string;
}
export interface QueryVersionResponseAminoMsg {
  type: "/slinky.service.v1.QueryVersionResponse";
  value: QueryVersionResponseAmino;
}
/** QueryVersionResponse defines the response type for the Version method. */
export interface QueryVersionResponseSDKType {
  version: string;
}
function createBaseQueryPricesRequest(): QueryPricesRequest {
  return {};
}
export const QueryPricesRequest = {
  typeUrl: "/slinky.service.v1.QueryPricesRequest",
  encode(_: QueryPricesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPricesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPricesRequest();
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
  fromPartial(_: Partial<QueryPricesRequest>): QueryPricesRequest {
    const message = createBaseQueryPricesRequest();
    return message;
  },
  fromAmino(_: QueryPricesRequestAmino): QueryPricesRequest {
    const message = createBaseQueryPricesRequest();
    return message;
  },
  toAmino(_: QueryPricesRequest): QueryPricesRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryPricesRequestAminoMsg): QueryPricesRequest {
    return QueryPricesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPricesRequestProtoMsg): QueryPricesRequest {
    return QueryPricesRequest.decode(message.value);
  },
  toProto(message: QueryPricesRequest): Uint8Array {
    return QueryPricesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPricesRequest): QueryPricesRequestProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryPricesRequest",
      value: QueryPricesRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPricesResponse_PricesEntry(): QueryPricesResponse_PricesEntry {
  return {
    key: "",
    value: ""
  };
}
export const QueryPricesResponse_PricesEntry = {
  encode(message: QueryPricesResponse_PricesEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPricesResponse_PricesEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPricesResponse_PricesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPricesResponse_PricesEntry>): QueryPricesResponse_PricesEntry {
    const message = createBaseQueryPricesResponse_PricesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
  fromAmino(object: QueryPricesResponse_PricesEntryAmino): QueryPricesResponse_PricesEntry {
    const message = createBaseQueryPricesResponse_PricesEntry();
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
  toAmino(message: QueryPricesResponse_PricesEntry): QueryPricesResponse_PricesEntryAmino {
    const obj: any = {};
    obj.key = message.key === "" ? undefined : message.key;
    obj.value = message.value === "" ? undefined : message.value;
    return obj;
  },
  fromAminoMsg(object: QueryPricesResponse_PricesEntryAminoMsg): QueryPricesResponse_PricesEntry {
    return QueryPricesResponse_PricesEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPricesResponse_PricesEntryProtoMsg): QueryPricesResponse_PricesEntry {
    return QueryPricesResponse_PricesEntry.decode(message.value);
  },
  toProto(message: QueryPricesResponse_PricesEntry): Uint8Array {
    return QueryPricesResponse_PricesEntry.encode(message).finish();
  }
};
function createBaseQueryPricesResponse(): QueryPricesResponse {
  return {
    prices: {},
    timestamp: new Date(),
    version: ""
  };
}
export const QueryPricesResponse = {
  typeUrl: "/slinky.service.v1.QueryPricesResponse",
  encode(message: QueryPricesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    Object.entries(message.prices).forEach(([key, value]) => {
      QueryPricesResponse_PricesEntry.encode({
        key: key as any,
        value
      }, writer.uint32(10).fork()).ldelim();
    });
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(18).fork()).ldelim();
    }
    if (message.version !== "") {
      writer.uint32(26).string(message.version);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPricesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPricesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = QueryPricesResponse_PricesEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.prices[entry1.key] = entry1.value;
          }
          break;
        case 2:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryPricesResponse>): QueryPricesResponse {
    const message = createBaseQueryPricesResponse();
    message.prices = Object.entries(object.prices ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.timestamp = object.timestamp ?? undefined;
    message.version = object.version ?? "";
    return message;
  },
  fromAmino(object: QueryPricesResponseAmino): QueryPricesResponse {
    const message = createBaseQueryPricesResponse();
    message.prices = Object.entries(object.prices ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = fromTimestamp(Timestamp.fromAmino(object.timestamp));
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    return message;
  },
  toAmino(message: QueryPricesResponse): QueryPricesResponseAmino {
    const obj: any = {};
    obj.prices = {};
    if (message.prices) {
      Object.entries(message.prices).forEach(([k, v]) => {
        obj.prices[k] = v;
      });
    }
    obj.timestamp = message.timestamp ? Timestamp.toAmino(toTimestamp(message.timestamp)) : undefined;
    obj.version = message.version === "" ? undefined : message.version;
    return obj;
  },
  fromAminoMsg(object: QueryPricesResponseAminoMsg): QueryPricesResponse {
    return QueryPricesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPricesResponseProtoMsg): QueryPricesResponse {
    return QueryPricesResponse.decode(message.value);
  },
  toProto(message: QueryPricesResponse): Uint8Array {
    return QueryPricesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPricesResponse): QueryPricesResponseProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryPricesResponse",
      value: QueryPricesResponse.encode(message).finish()
    };
  }
};
function createBaseQueryMarketMapRequest(): QueryMarketMapRequest {
  return {};
}
export const QueryMarketMapRequest = {
  typeUrl: "/slinky.service.v1.QueryMarketMapRequest",
  encode(_: QueryMarketMapRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapRequest();
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
  fromPartial(_: Partial<QueryMarketMapRequest>): QueryMarketMapRequest {
    const message = createBaseQueryMarketMapRequest();
    return message;
  },
  fromAmino(_: QueryMarketMapRequestAmino): QueryMarketMapRequest {
    const message = createBaseQueryMarketMapRequest();
    return message;
  },
  toAmino(_: QueryMarketMapRequest): QueryMarketMapRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapRequestAminoMsg): QueryMarketMapRequest {
    return QueryMarketMapRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapRequestProtoMsg): QueryMarketMapRequest {
    return QueryMarketMapRequest.decode(message.value);
  },
  toProto(message: QueryMarketMapRequest): Uint8Array {
    return QueryMarketMapRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapRequest): QueryMarketMapRequestProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryMarketMapRequest",
      value: QueryMarketMapRequest.encode(message).finish()
    };
  }
};
function createBaseQueryMarketMapResponse(): QueryMarketMapResponse {
  return {
    marketMap: undefined
  };
}
export const QueryMarketMapResponse = {
  typeUrl: "/slinky.service.v1.QueryMarketMapResponse",
  encode(message: QueryMarketMapResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.marketMap !== undefined) {
      MarketMap.encode(message.marketMap, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketMap = MarketMap.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMarketMapResponse>): QueryMarketMapResponse {
    const message = createBaseQueryMarketMapResponse();
    message.marketMap = object.marketMap !== undefined && object.marketMap !== null ? MarketMap.fromPartial(object.marketMap) : undefined;
    return message;
  },
  fromAmino(object: QueryMarketMapResponseAmino): QueryMarketMapResponse {
    const message = createBaseQueryMarketMapResponse();
    if (object.market_map !== undefined && object.market_map !== null) {
      message.marketMap = MarketMap.fromAmino(object.market_map);
    }
    return message;
  },
  toAmino(message: QueryMarketMapResponse): QueryMarketMapResponseAmino {
    const obj: any = {};
    obj.market_map = message.marketMap ? MarketMap.toAmino(message.marketMap) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapResponseAminoMsg): QueryMarketMapResponse {
    return QueryMarketMapResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapResponseProtoMsg): QueryMarketMapResponse {
    return QueryMarketMapResponse.decode(message.value);
  },
  toProto(message: QueryMarketMapResponse): Uint8Array {
    return QueryMarketMapResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapResponse): QueryMarketMapResponseProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryMarketMapResponse",
      value: QueryMarketMapResponse.encode(message).finish()
    };
  }
};
function createBaseQueryVersionRequest(): QueryVersionRequest {
  return {};
}
export const QueryVersionRequest = {
  typeUrl: "/slinky.service.v1.QueryVersionRequest",
  encode(_: QueryVersionRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryVersionRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryVersionRequest();
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
  fromPartial(_: Partial<QueryVersionRequest>): QueryVersionRequest {
    const message = createBaseQueryVersionRequest();
    return message;
  },
  fromAmino(_: QueryVersionRequestAmino): QueryVersionRequest {
    const message = createBaseQueryVersionRequest();
    return message;
  },
  toAmino(_: QueryVersionRequest): QueryVersionRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryVersionRequestAminoMsg): QueryVersionRequest {
    return QueryVersionRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryVersionRequestProtoMsg): QueryVersionRequest {
    return QueryVersionRequest.decode(message.value);
  },
  toProto(message: QueryVersionRequest): Uint8Array {
    return QueryVersionRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryVersionRequest): QueryVersionRequestProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryVersionRequest",
      value: QueryVersionRequest.encode(message).finish()
    };
  }
};
function createBaseQueryVersionResponse(): QueryVersionResponse {
  return {
    version: ""
  };
}
export const QueryVersionResponse = {
  typeUrl: "/slinky.service.v1.QueryVersionResponse",
  encode(message: QueryVersionResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryVersionResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryVersionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryVersionResponse>): QueryVersionResponse {
    const message = createBaseQueryVersionResponse();
    message.version = object.version ?? "";
    return message;
  },
  fromAmino(object: QueryVersionResponseAmino): QueryVersionResponse {
    const message = createBaseQueryVersionResponse();
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    return message;
  },
  toAmino(message: QueryVersionResponse): QueryVersionResponseAmino {
    const obj: any = {};
    obj.version = message.version === "" ? undefined : message.version;
    return obj;
  },
  fromAminoMsg(object: QueryVersionResponseAminoMsg): QueryVersionResponse {
    return QueryVersionResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryVersionResponseProtoMsg): QueryVersionResponse {
    return QueryVersionResponse.decode(message.value);
  },
  toProto(message: QueryVersionResponse): Uint8Array {
    return QueryVersionResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryVersionResponse): QueryVersionResponseProtoMsg {
    return {
      typeUrl: "/slinky.service.v1.QueryVersionResponse",
      value: QueryVersionResponse.encode(message).finish()
    };
  }
};