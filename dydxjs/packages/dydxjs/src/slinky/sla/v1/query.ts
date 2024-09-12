//@ts-nocheck
import { PriceFeedSLA, PriceFeedSLAAmino, PriceFeedSLASDKType, PriceFeed, PriceFeedAmino, PriceFeedSDKType, Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
/** QueryAllSLAsRequest is the request type for the Query/GetAllSLAs RPC method. */
export interface GetAllSLAsRequest {}
export interface GetAllSLAsRequestProtoMsg {
  typeUrl: "/slinky.sla.v1.GetAllSLAsRequest";
  value: Uint8Array;
}
/** QueryAllSLAsRequest is the request type for the Query/GetAllSLAs RPC method. */
export interface GetAllSLAsRequestAmino {}
export interface GetAllSLAsRequestAminoMsg {
  type: "/slinky.sla.v1.GetAllSLAsRequest";
  value: GetAllSLAsRequestAmino;
}
/** QueryAllSLAsRequest is the request type for the Query/GetAllSLAs RPC method. */
export interface GetAllSLAsRequestSDKType {}
/**
 * QueryAllSLAsResponse is the response type for the Query/GetAllSLAs RPC
 * method.
 */
export interface GetAllSLAsResponse {
  slas: PriceFeedSLA[];
}
export interface GetAllSLAsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.GetAllSLAsResponse";
  value: Uint8Array;
}
/**
 * QueryAllSLAsResponse is the response type for the Query/GetAllSLAs RPC
 * method.
 */
export interface GetAllSLAsResponseAmino {
  slas?: PriceFeedSLAAmino[];
}
export interface GetAllSLAsResponseAminoMsg {
  type: "/slinky.sla.v1.GetAllSLAsResponse";
  value: GetAllSLAsResponseAmino;
}
/**
 * QueryAllSLAsResponse is the response type for the Query/GetAllSLAs RPC
 * method.
 */
export interface GetAllSLAsResponseSDKType {
  slas: PriceFeedSLASDKType[];
}
/**
 * QueryGetPriceFeedsRequest is the request type for the Query/GetPriceFeeds RPC
 * method.
 */
export interface GetPriceFeedsRequest {
  /** ID defines the SLA to query price feeds for. */
  id: string;
}
export interface GetPriceFeedsRequestProtoMsg {
  typeUrl: "/slinky.sla.v1.GetPriceFeedsRequest";
  value: Uint8Array;
}
/**
 * QueryGetPriceFeedsRequest is the request type for the Query/GetPriceFeeds RPC
 * method.
 */
export interface GetPriceFeedsRequestAmino {
  /** ID defines the SLA to query price feeds for. */
  id?: string;
}
export interface GetPriceFeedsRequestAminoMsg {
  type: "/slinky.sla.v1.GetPriceFeedsRequest";
  value: GetPriceFeedsRequestAmino;
}
/**
 * QueryGetPriceFeedsRequest is the request type for the Query/GetPriceFeeds RPC
 * method.
 */
export interface GetPriceFeedsRequestSDKType {
  id: string;
}
/**
 * QueryGetPriceFeedsResponse is the response type for the Query/GetPriceFeeds
 * RPC method.
 */
export interface GetPriceFeedsResponse {
  /** PriceFeeds defines the price feeds for the given SLA. */
  priceFeeds: PriceFeed[];
}
export interface GetPriceFeedsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.GetPriceFeedsResponse";
  value: Uint8Array;
}
/**
 * QueryGetPriceFeedsResponse is the response type for the Query/GetPriceFeeds
 * RPC method.
 */
export interface GetPriceFeedsResponseAmino {
  /** PriceFeeds defines the price feeds for the given SLA. */
  price_feeds?: PriceFeedAmino[];
}
export interface GetPriceFeedsResponseAminoMsg {
  type: "/slinky.sla.v1.GetPriceFeedsResponse";
  value: GetPriceFeedsResponseAmino;
}
/**
 * QueryGetPriceFeedsResponse is the response type for the Query/GetPriceFeeds
 * RPC method.
 */
export interface GetPriceFeedsResponseSDKType {
  price_feeds: PriceFeedSDKType[];
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface ParamsRequest {}
export interface ParamsRequestProtoMsg {
  typeUrl: "/slinky.sla.v1.ParamsRequest";
  value: Uint8Array;
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface ParamsRequestAmino {}
export interface ParamsRequestAminoMsg {
  type: "/slinky.sla.v1.ParamsRequest";
  value: ParamsRequestAmino;
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface ParamsRequestSDKType {}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface ParamsResponse {
  params: Params;
}
export interface ParamsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.ParamsResponse";
  value: Uint8Array;
}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface ParamsResponseAmino {
  params?: ParamsAmino;
}
export interface ParamsResponseAminoMsg {
  type: "/slinky.sla.v1.ParamsResponse";
  value: ParamsResponseAmino;
}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface ParamsResponseSDKType {
  params: ParamsSDKType;
}
function createBaseGetAllSLAsRequest(): GetAllSLAsRequest {
  return {};
}
export const GetAllSLAsRequest = {
  typeUrl: "/slinky.sla.v1.GetAllSLAsRequest",
  encode(_: GetAllSLAsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetAllSLAsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllSLAsRequest();
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
  fromPartial(_: Partial<GetAllSLAsRequest>): GetAllSLAsRequest {
    const message = createBaseGetAllSLAsRequest();
    return message;
  },
  fromAmino(_: GetAllSLAsRequestAmino): GetAllSLAsRequest {
    const message = createBaseGetAllSLAsRequest();
    return message;
  },
  toAmino(_: GetAllSLAsRequest): GetAllSLAsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: GetAllSLAsRequestAminoMsg): GetAllSLAsRequest {
    return GetAllSLAsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: GetAllSLAsRequestProtoMsg): GetAllSLAsRequest {
    return GetAllSLAsRequest.decode(message.value);
  },
  toProto(message: GetAllSLAsRequest): Uint8Array {
    return GetAllSLAsRequest.encode(message).finish();
  },
  toProtoMsg(message: GetAllSLAsRequest): GetAllSLAsRequestProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.GetAllSLAsRequest",
      value: GetAllSLAsRequest.encode(message).finish()
    };
  }
};
function createBaseGetAllSLAsResponse(): GetAllSLAsResponse {
  return {
    slas: []
  };
}
export const GetAllSLAsResponse = {
  typeUrl: "/slinky.sla.v1.GetAllSLAsResponse",
  encode(message: GetAllSLAsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.slas) {
      PriceFeedSLA.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetAllSLAsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllSLAsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slas.push(PriceFeedSLA.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetAllSLAsResponse>): GetAllSLAsResponse {
    const message = createBaseGetAllSLAsResponse();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GetAllSLAsResponseAmino): GetAllSLAsResponse {
    const message = createBaseGetAllSLAsResponse();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GetAllSLAsResponse): GetAllSLAsResponseAmino {
    const obj: any = {};
    if (message.slas) {
      obj.slas = message.slas.map(e => e ? PriceFeedSLA.toAmino(e) : undefined);
    } else {
      obj.slas = message.slas;
    }
    return obj;
  },
  fromAminoMsg(object: GetAllSLAsResponseAminoMsg): GetAllSLAsResponse {
    return GetAllSLAsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: GetAllSLAsResponseProtoMsg): GetAllSLAsResponse {
    return GetAllSLAsResponse.decode(message.value);
  },
  toProto(message: GetAllSLAsResponse): Uint8Array {
    return GetAllSLAsResponse.encode(message).finish();
  },
  toProtoMsg(message: GetAllSLAsResponse): GetAllSLAsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.GetAllSLAsResponse",
      value: GetAllSLAsResponse.encode(message).finish()
    };
  }
};
function createBaseGetPriceFeedsRequest(): GetPriceFeedsRequest {
  return {
    id: ""
  };
}
export const GetPriceFeedsRequest = {
  typeUrl: "/slinky.sla.v1.GetPriceFeedsRequest",
  encode(message: GetPriceFeedsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetPriceFeedsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPriceFeedsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetPriceFeedsRequest>): GetPriceFeedsRequest {
    const message = createBaseGetPriceFeedsRequest();
    message.id = object.id ?? "";
    return message;
  },
  fromAmino(object: GetPriceFeedsRequestAmino): GetPriceFeedsRequest {
    const message = createBaseGetPriceFeedsRequest();
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
  toAmino(message: GetPriceFeedsRequest): GetPriceFeedsRequestAmino {
    const obj: any = {};
    obj.id = message.id === "" ? undefined : message.id;
    return obj;
  },
  fromAminoMsg(object: GetPriceFeedsRequestAminoMsg): GetPriceFeedsRequest {
    return GetPriceFeedsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: GetPriceFeedsRequestProtoMsg): GetPriceFeedsRequest {
    return GetPriceFeedsRequest.decode(message.value);
  },
  toProto(message: GetPriceFeedsRequest): Uint8Array {
    return GetPriceFeedsRequest.encode(message).finish();
  },
  toProtoMsg(message: GetPriceFeedsRequest): GetPriceFeedsRequestProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.GetPriceFeedsRequest",
      value: GetPriceFeedsRequest.encode(message).finish()
    };
  }
};
function createBaseGetPriceFeedsResponse(): GetPriceFeedsResponse {
  return {
    priceFeeds: []
  };
}
export const GetPriceFeedsResponse = {
  typeUrl: "/slinky.sla.v1.GetPriceFeedsResponse",
  encode(message: GetPriceFeedsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.priceFeeds) {
      PriceFeed.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetPriceFeedsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPriceFeedsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.priceFeeds.push(PriceFeed.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetPriceFeedsResponse>): GetPriceFeedsResponse {
    const message = createBaseGetPriceFeedsResponse();
    message.priceFeeds = object.priceFeeds?.map(e => PriceFeed.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GetPriceFeedsResponseAmino): GetPriceFeedsResponse {
    const message = createBaseGetPriceFeedsResponse();
    message.priceFeeds = object.price_feeds?.map(e => PriceFeed.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GetPriceFeedsResponse): GetPriceFeedsResponseAmino {
    const obj: any = {};
    if (message.priceFeeds) {
      obj.price_feeds = message.priceFeeds.map(e => e ? PriceFeed.toAmino(e) : undefined);
    } else {
      obj.price_feeds = message.priceFeeds;
    }
    return obj;
  },
  fromAminoMsg(object: GetPriceFeedsResponseAminoMsg): GetPriceFeedsResponse {
    return GetPriceFeedsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: GetPriceFeedsResponseProtoMsg): GetPriceFeedsResponse {
    return GetPriceFeedsResponse.decode(message.value);
  },
  toProto(message: GetPriceFeedsResponse): Uint8Array {
    return GetPriceFeedsResponse.encode(message).finish();
  },
  toProtoMsg(message: GetPriceFeedsResponse): GetPriceFeedsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.GetPriceFeedsResponse",
      value: GetPriceFeedsResponse.encode(message).finish()
    };
  }
};
function createBaseParamsRequest(): ParamsRequest {
  return {};
}
export const ParamsRequest = {
  typeUrl: "/slinky.sla.v1.ParamsRequest",
  encode(_: ParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsRequest();
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
  fromPartial(_: Partial<ParamsRequest>): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
  fromAmino(_: ParamsRequestAmino): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
  toAmino(_: ParamsRequest): ParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: ParamsRequestAminoMsg): ParamsRequest {
    return ParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsRequestProtoMsg): ParamsRequest {
    return ParamsRequest.decode(message.value);
  },
  toProto(message: ParamsRequest): Uint8Array {
    return ParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: ParamsRequest): ParamsRequestProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.ParamsRequest",
      value: ParamsRequest.encode(message).finish()
    };
  }
};
function createBaseParamsResponse(): ParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const ParamsResponse = {
  typeUrl: "/slinky.sla.v1.ParamsResponse",
  encode(message: ParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ParamsResponse>): ParamsResponse {
    const message = createBaseParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: ParamsResponseAmino): ParamsResponse {
    const message = createBaseParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: ParamsResponse): ParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: ParamsResponseAminoMsg): ParamsResponse {
    return ParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsResponseProtoMsg): ParamsResponse {
    return ParamsResponse.decode(message.value);
  },
  toProto(message: ParamsResponse): Uint8Array {
    return ParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: ParamsResponse): ParamsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.ParamsResponse",
      value: ParamsResponse.encode(message).finish()
    };
  }
};