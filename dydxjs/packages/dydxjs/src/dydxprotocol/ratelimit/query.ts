//@ts-nocheck
import { LimitParams, LimitParamsAmino, LimitParamsSDKType } from "./limit_params";
import { LimiterCapacity, LimiterCapacityAmino, LimiterCapacitySDKType } from "./capacity";
import { PendingSendPacket, PendingSendPacketAmino, PendingSendPacketSDKType } from "./pending_send_packet";
import { BinaryReader, BinaryWriter } from "../../binary";
/** ListLimitParamsRequest is a request type of the ListLimitParams RPC method. */
export interface ListLimitParamsRequest {}
export interface ListLimitParamsRequestProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsRequest";
  value: Uint8Array;
}
/** ListLimitParamsRequest is a request type of the ListLimitParams RPC method. */
export interface ListLimitParamsRequestAmino {}
export interface ListLimitParamsRequestAminoMsg {
  type: "/dydxprotocol.ratelimit.ListLimitParamsRequest";
  value: ListLimitParamsRequestAmino;
}
/** ListLimitParamsRequest is a request type of the ListLimitParams RPC method. */
export interface ListLimitParamsRequestSDKType {}
/** ListLimitParamsResponse is a response type of the ListLimitParams RPC method. */
export interface ListLimitParamsResponse {
  limitParamsList: LimitParams[];
}
export interface ListLimitParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsResponse";
  value: Uint8Array;
}
/** ListLimitParamsResponse is a response type of the ListLimitParams RPC method. */
export interface ListLimitParamsResponseAmino {
  limit_params_list?: LimitParamsAmino[];
}
export interface ListLimitParamsResponseAminoMsg {
  type: "/dydxprotocol.ratelimit.ListLimitParamsResponse";
  value: ListLimitParamsResponseAmino;
}
/** ListLimitParamsResponse is a response type of the ListLimitParams RPC method. */
export interface ListLimitParamsResponseSDKType {
  limit_params_list: LimitParamsSDKType[];
}
/**
 * QueryCapacityByDenomRequest is a request type for the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomRequest {
  denom: string;
}
export interface QueryCapacityByDenomRequestProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomRequest";
  value: Uint8Array;
}
/**
 * QueryCapacityByDenomRequest is a request type for the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomRequestAmino {
  denom?: string;
}
export interface QueryCapacityByDenomRequestAminoMsg {
  type: "/dydxprotocol.ratelimit.QueryCapacityByDenomRequest";
  value: QueryCapacityByDenomRequestAmino;
}
/**
 * QueryCapacityByDenomRequest is a request type for the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomRequestSDKType {
  denom: string;
}
/**
 * QueryCapacityByDenomResponse is a response type of the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomResponse {
  limiterCapacityList: LimiterCapacity[];
}
export interface QueryCapacityByDenomResponseProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomResponse";
  value: Uint8Array;
}
/**
 * QueryCapacityByDenomResponse is a response type of the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomResponseAmino {
  limiter_capacity_list?: LimiterCapacityAmino[];
}
export interface QueryCapacityByDenomResponseAminoMsg {
  type: "/dydxprotocol.ratelimit.QueryCapacityByDenomResponse";
  value: QueryCapacityByDenomResponseAmino;
}
/**
 * QueryCapacityByDenomResponse is a response type of the CapacityByDenom RPC
 * method.
 */
export interface QueryCapacityByDenomResponseSDKType {
  limiter_capacity_list: LimiterCapacitySDKType[];
}
/**
 * QueryAllPendingSendPacketsRequest is a request type for the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsRequest {}
export interface QueryAllPendingSendPacketsRequestProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsRequest";
  value: Uint8Array;
}
/**
 * QueryAllPendingSendPacketsRequest is a request type for the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsRequestAmino {}
export interface QueryAllPendingSendPacketsRequestAminoMsg {
  type: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsRequest";
  value: QueryAllPendingSendPacketsRequestAmino;
}
/**
 * QueryAllPendingSendPacketsRequest is a request type for the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsRequestSDKType {}
/**
 * QueryAllPendingSendPacketsResponse is a response type of the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsResponse {
  pendingSendPackets: PendingSendPacket[];
}
export interface QueryAllPendingSendPacketsResponseProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsResponse";
  value: Uint8Array;
}
/**
 * QueryAllPendingSendPacketsResponse is a response type of the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsResponseAmino {
  pending_send_packets?: PendingSendPacketAmino[];
}
export interface QueryAllPendingSendPacketsResponseAminoMsg {
  type: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsResponse";
  value: QueryAllPendingSendPacketsResponseAmino;
}
/**
 * QueryAllPendingSendPacketsResponse is a response type of the
 * AllPendingSendPackets RPC
 */
export interface QueryAllPendingSendPacketsResponseSDKType {
  pending_send_packets: PendingSendPacketSDKType[];
}
function createBaseListLimitParamsRequest(): ListLimitParamsRequest {
  return {};
}
export const ListLimitParamsRequest = {
  typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsRequest",
  encode(_: ListLimitParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListLimitParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListLimitParamsRequest();
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
  fromPartial(_: Partial<ListLimitParamsRequest>): ListLimitParamsRequest {
    const message = createBaseListLimitParamsRequest();
    return message;
  },
  fromAmino(_: ListLimitParamsRequestAmino): ListLimitParamsRequest {
    const message = createBaseListLimitParamsRequest();
    return message;
  },
  toAmino(_: ListLimitParamsRequest): ListLimitParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: ListLimitParamsRequestAminoMsg): ListLimitParamsRequest {
    return ListLimitParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: ListLimitParamsRequestProtoMsg): ListLimitParamsRequest {
    return ListLimitParamsRequest.decode(message.value);
  },
  toProto(message: ListLimitParamsRequest): Uint8Array {
    return ListLimitParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: ListLimitParamsRequest): ListLimitParamsRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsRequest",
      value: ListLimitParamsRequest.encode(message).finish()
    };
  }
};
function createBaseListLimitParamsResponse(): ListLimitParamsResponse {
  return {
    limitParamsList: []
  };
}
export const ListLimitParamsResponse = {
  typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsResponse",
  encode(message: ListLimitParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.limitParamsList) {
      LimitParams.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListLimitParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListLimitParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limitParamsList.push(LimitParams.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ListLimitParamsResponse>): ListLimitParamsResponse {
    const message = createBaseListLimitParamsResponse();
    message.limitParamsList = object.limitParamsList?.map(e => LimitParams.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ListLimitParamsResponseAmino): ListLimitParamsResponse {
    const message = createBaseListLimitParamsResponse();
    message.limitParamsList = object.limit_params_list?.map(e => LimitParams.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: ListLimitParamsResponse): ListLimitParamsResponseAmino {
    const obj: any = {};
    if (message.limitParamsList) {
      obj.limit_params_list = message.limitParamsList.map(e => e ? LimitParams.toAmino(e) : undefined);
    } else {
      obj.limit_params_list = message.limitParamsList;
    }
    return obj;
  },
  fromAminoMsg(object: ListLimitParamsResponseAminoMsg): ListLimitParamsResponse {
    return ListLimitParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: ListLimitParamsResponseProtoMsg): ListLimitParamsResponse {
    return ListLimitParamsResponse.decode(message.value);
  },
  toProto(message: ListLimitParamsResponse): Uint8Array {
    return ListLimitParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: ListLimitParamsResponse): ListLimitParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.ListLimitParamsResponse",
      value: ListLimitParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryCapacityByDenomRequest(): QueryCapacityByDenomRequest {
  return {
    denom: ""
  };
}
export const QueryCapacityByDenomRequest = {
  typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomRequest",
  encode(message: QueryCapacityByDenomRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryCapacityByDenomRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCapacityByDenomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryCapacityByDenomRequest>): QueryCapacityByDenomRequest {
    const message = createBaseQueryCapacityByDenomRequest();
    message.denom = object.denom ?? "";
    return message;
  },
  fromAmino(object: QueryCapacityByDenomRequestAmino): QueryCapacityByDenomRequest {
    const message = createBaseQueryCapacityByDenomRequest();
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    return message;
  },
  toAmino(message: QueryCapacityByDenomRequest): QueryCapacityByDenomRequestAmino {
    const obj: any = {};
    obj.denom = message.denom === "" ? undefined : message.denom;
    return obj;
  },
  fromAminoMsg(object: QueryCapacityByDenomRequestAminoMsg): QueryCapacityByDenomRequest {
    return QueryCapacityByDenomRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryCapacityByDenomRequestProtoMsg): QueryCapacityByDenomRequest {
    return QueryCapacityByDenomRequest.decode(message.value);
  },
  toProto(message: QueryCapacityByDenomRequest): Uint8Array {
    return QueryCapacityByDenomRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryCapacityByDenomRequest): QueryCapacityByDenomRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomRequest",
      value: QueryCapacityByDenomRequest.encode(message).finish()
    };
  }
};
function createBaseQueryCapacityByDenomResponse(): QueryCapacityByDenomResponse {
  return {
    limiterCapacityList: []
  };
}
export const QueryCapacityByDenomResponse = {
  typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomResponse",
  encode(message: QueryCapacityByDenomResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.limiterCapacityList) {
      LimiterCapacity.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryCapacityByDenomResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCapacityByDenomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limiterCapacityList.push(LimiterCapacity.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryCapacityByDenomResponse>): QueryCapacityByDenomResponse {
    const message = createBaseQueryCapacityByDenomResponse();
    message.limiterCapacityList = object.limiterCapacityList?.map(e => LimiterCapacity.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryCapacityByDenomResponseAmino): QueryCapacityByDenomResponse {
    const message = createBaseQueryCapacityByDenomResponse();
    message.limiterCapacityList = object.limiter_capacity_list?.map(e => LimiterCapacity.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryCapacityByDenomResponse): QueryCapacityByDenomResponseAmino {
    const obj: any = {};
    if (message.limiterCapacityList) {
      obj.limiter_capacity_list = message.limiterCapacityList.map(e => e ? LimiterCapacity.toAmino(e) : undefined);
    } else {
      obj.limiter_capacity_list = message.limiterCapacityList;
    }
    return obj;
  },
  fromAminoMsg(object: QueryCapacityByDenomResponseAminoMsg): QueryCapacityByDenomResponse {
    return QueryCapacityByDenomResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryCapacityByDenomResponseProtoMsg): QueryCapacityByDenomResponse {
    return QueryCapacityByDenomResponse.decode(message.value);
  },
  toProto(message: QueryCapacityByDenomResponse): Uint8Array {
    return QueryCapacityByDenomResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryCapacityByDenomResponse): QueryCapacityByDenomResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.QueryCapacityByDenomResponse",
      value: QueryCapacityByDenomResponse.encode(message).finish()
    };
  }
};
function createBaseQueryAllPendingSendPacketsRequest(): QueryAllPendingSendPacketsRequest {
  return {};
}
export const QueryAllPendingSendPacketsRequest = {
  typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsRequest",
  encode(_: QueryAllPendingSendPacketsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllPendingSendPacketsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPendingSendPacketsRequest();
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
  fromPartial(_: Partial<QueryAllPendingSendPacketsRequest>): QueryAllPendingSendPacketsRequest {
    const message = createBaseQueryAllPendingSendPacketsRequest();
    return message;
  },
  fromAmino(_: QueryAllPendingSendPacketsRequestAmino): QueryAllPendingSendPacketsRequest {
    const message = createBaseQueryAllPendingSendPacketsRequest();
    return message;
  },
  toAmino(_: QueryAllPendingSendPacketsRequest): QueryAllPendingSendPacketsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryAllPendingSendPacketsRequestAminoMsg): QueryAllPendingSendPacketsRequest {
    return QueryAllPendingSendPacketsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryAllPendingSendPacketsRequestProtoMsg): QueryAllPendingSendPacketsRequest {
    return QueryAllPendingSendPacketsRequest.decode(message.value);
  },
  toProto(message: QueryAllPendingSendPacketsRequest): Uint8Array {
    return QueryAllPendingSendPacketsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryAllPendingSendPacketsRequest): QueryAllPendingSendPacketsRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsRequest",
      value: QueryAllPendingSendPacketsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryAllPendingSendPacketsResponse(): QueryAllPendingSendPacketsResponse {
  return {
    pendingSendPackets: []
  };
}
export const QueryAllPendingSendPacketsResponse = {
  typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsResponse",
  encode(message: QueryAllPendingSendPacketsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.pendingSendPackets) {
      PendingSendPacket.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllPendingSendPacketsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPendingSendPacketsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pendingSendPackets.push(PendingSendPacket.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryAllPendingSendPacketsResponse>): QueryAllPendingSendPacketsResponse {
    const message = createBaseQueryAllPendingSendPacketsResponse();
    message.pendingSendPackets = object.pendingSendPackets?.map(e => PendingSendPacket.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryAllPendingSendPacketsResponseAmino): QueryAllPendingSendPacketsResponse {
    const message = createBaseQueryAllPendingSendPacketsResponse();
    message.pendingSendPackets = object.pending_send_packets?.map(e => PendingSendPacket.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryAllPendingSendPacketsResponse): QueryAllPendingSendPacketsResponseAmino {
    const obj: any = {};
    if (message.pendingSendPackets) {
      obj.pending_send_packets = message.pendingSendPackets.map(e => e ? PendingSendPacket.toAmino(e) : undefined);
    } else {
      obj.pending_send_packets = message.pendingSendPackets;
    }
    return obj;
  },
  fromAminoMsg(object: QueryAllPendingSendPacketsResponseAminoMsg): QueryAllPendingSendPacketsResponse {
    return QueryAllPendingSendPacketsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryAllPendingSendPacketsResponseProtoMsg): QueryAllPendingSendPacketsResponse {
    return QueryAllPendingSendPacketsResponse.decode(message.value);
  },
  toProto(message: QueryAllPendingSendPacketsResponse): Uint8Array {
    return QueryAllPendingSendPacketsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryAllPendingSendPacketsResponse): QueryAllPendingSendPacketsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.QueryAllPendingSendPacketsResponse",
      value: QueryAllPendingSendPacketsResponse.encode(message).finish()
    };
  }
};