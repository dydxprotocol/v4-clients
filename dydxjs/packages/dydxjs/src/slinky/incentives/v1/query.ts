//@ts-nocheck
import { IncentivesByType, IncentivesByTypeAmino, IncentivesByTypeSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/**
 * GetIncentivesByTypeRequest is the request type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeRequest {
  /**
   * IncentiveType is the incentive type i.e. (BadPriceIncentiveType,
   * GoodPriceIncentiveType).
   */
  incentiveType: string;
}
export interface GetIncentivesByTypeRequestProtoMsg {
  typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeRequest";
  value: Uint8Array;
}
/**
 * GetIncentivesByTypeRequest is the request type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeRequestAmino {
  /**
   * IncentiveType is the incentive type i.e. (BadPriceIncentiveType,
   * GoodPriceIncentiveType).
   */
  incentive_type?: string;
}
export interface GetIncentivesByTypeRequestAminoMsg {
  type: "/slinky.incentives.v1.GetIncentivesByTypeRequest";
  value: GetIncentivesByTypeRequestAmino;
}
/**
 * GetIncentivesByTypeRequest is the request type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeRequestSDKType {
  incentive_type: string;
}
/**
 * GetIncentivesByTypeResponse is the response type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeResponse {
  /** Entries is the list of incentives of the given type. */
  entries: Uint8Array[];
}
export interface GetIncentivesByTypeResponseProtoMsg {
  typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeResponse";
  value: Uint8Array;
}
/**
 * GetIncentivesByTypeResponse is the response type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeResponseAmino {
  /** Entries is the list of incentives of the given type. */
  entries?: string[];
}
export interface GetIncentivesByTypeResponseAminoMsg {
  type: "/slinky.incentives.v1.GetIncentivesByTypeResponse";
  value: GetIncentivesByTypeResponseAmino;
}
/**
 * GetIncentivesByTypeResponse is the response type for the
 * Query/GetIncentivesByType RPC method.
 */
export interface GetIncentivesByTypeResponseSDKType {
  entries: Uint8Array[];
}
/**
 * GetAllIncentivesRequest is the request type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesRequest {}
export interface GetAllIncentivesRequestProtoMsg {
  typeUrl: "/slinky.incentives.v1.GetAllIncentivesRequest";
  value: Uint8Array;
}
/**
 * GetAllIncentivesRequest is the request type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesRequestAmino {}
export interface GetAllIncentivesRequestAminoMsg {
  type: "/slinky.incentives.v1.GetAllIncentivesRequest";
  value: GetAllIncentivesRequestAmino;
}
/**
 * GetAllIncentivesRequest is the request type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesRequestSDKType {}
/**
 * GetAllIncentivesResponse is the response type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesResponse {
  /** Registry is the list of all incentives, grouped by type. */
  registry: IncentivesByType[];
}
export interface GetAllIncentivesResponseProtoMsg {
  typeUrl: "/slinky.incentives.v1.GetAllIncentivesResponse";
  value: Uint8Array;
}
/**
 * GetAllIncentivesResponse is the response type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesResponseAmino {
  /** Registry is the list of all incentives, grouped by type. */
  registry?: IncentivesByTypeAmino[];
}
export interface GetAllIncentivesResponseAminoMsg {
  type: "/slinky.incentives.v1.GetAllIncentivesResponse";
  value: GetAllIncentivesResponseAmino;
}
/**
 * GetAllIncentivesResponse is the response type for the Query/GetAllIncentives
 * RPC method.
 */
export interface GetAllIncentivesResponseSDKType {
  registry: IncentivesByTypeSDKType[];
}
function createBaseGetIncentivesByTypeRequest(): GetIncentivesByTypeRequest {
  return {
    incentiveType: ""
  };
}
export const GetIncentivesByTypeRequest = {
  typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeRequest",
  encode(message: GetIncentivesByTypeRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.incentiveType !== "") {
      writer.uint32(10).string(message.incentiveType);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetIncentivesByTypeRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetIncentivesByTypeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.incentiveType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetIncentivesByTypeRequest>): GetIncentivesByTypeRequest {
    const message = createBaseGetIncentivesByTypeRequest();
    message.incentiveType = object.incentiveType ?? "";
    return message;
  },
  fromAmino(object: GetIncentivesByTypeRequestAmino): GetIncentivesByTypeRequest {
    const message = createBaseGetIncentivesByTypeRequest();
    if (object.incentive_type !== undefined && object.incentive_type !== null) {
      message.incentiveType = object.incentive_type;
    }
    return message;
  },
  toAmino(message: GetIncentivesByTypeRequest): GetIncentivesByTypeRequestAmino {
    const obj: any = {};
    obj.incentive_type = message.incentiveType === "" ? undefined : message.incentiveType;
    return obj;
  },
  fromAminoMsg(object: GetIncentivesByTypeRequestAminoMsg): GetIncentivesByTypeRequest {
    return GetIncentivesByTypeRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: GetIncentivesByTypeRequestProtoMsg): GetIncentivesByTypeRequest {
    return GetIncentivesByTypeRequest.decode(message.value);
  },
  toProto(message: GetIncentivesByTypeRequest): Uint8Array {
    return GetIncentivesByTypeRequest.encode(message).finish();
  },
  toProtoMsg(message: GetIncentivesByTypeRequest): GetIncentivesByTypeRequestProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeRequest",
      value: GetIncentivesByTypeRequest.encode(message).finish()
    };
  }
};
function createBaseGetIncentivesByTypeResponse(): GetIncentivesByTypeResponse {
  return {
    entries: []
  };
}
export const GetIncentivesByTypeResponse = {
  typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeResponse",
  encode(message: GetIncentivesByTypeResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.entries) {
      writer.uint32(10).bytes(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetIncentivesByTypeResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetIncentivesByTypeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entries.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetIncentivesByTypeResponse>): GetIncentivesByTypeResponse {
    const message = createBaseGetIncentivesByTypeResponse();
    message.entries = object.entries?.map(e => e) || [];
    return message;
  },
  fromAmino(object: GetIncentivesByTypeResponseAmino): GetIncentivesByTypeResponse {
    const message = createBaseGetIncentivesByTypeResponse();
    message.entries = object.entries?.map(e => bytesFromBase64(e)) || [];
    return message;
  },
  toAmino(message: GetIncentivesByTypeResponse): GetIncentivesByTypeResponseAmino {
    const obj: any = {};
    if (message.entries) {
      obj.entries = message.entries.map(e => base64FromBytes(e));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: GetIncentivesByTypeResponseAminoMsg): GetIncentivesByTypeResponse {
    return GetIncentivesByTypeResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: GetIncentivesByTypeResponseProtoMsg): GetIncentivesByTypeResponse {
    return GetIncentivesByTypeResponse.decode(message.value);
  },
  toProto(message: GetIncentivesByTypeResponse): Uint8Array {
    return GetIncentivesByTypeResponse.encode(message).finish();
  },
  toProtoMsg(message: GetIncentivesByTypeResponse): GetIncentivesByTypeResponseProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.GetIncentivesByTypeResponse",
      value: GetIncentivesByTypeResponse.encode(message).finish()
    };
  }
};
function createBaseGetAllIncentivesRequest(): GetAllIncentivesRequest {
  return {};
}
export const GetAllIncentivesRequest = {
  typeUrl: "/slinky.incentives.v1.GetAllIncentivesRequest",
  encode(_: GetAllIncentivesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetAllIncentivesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllIncentivesRequest();
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
  fromPartial(_: Partial<GetAllIncentivesRequest>): GetAllIncentivesRequest {
    const message = createBaseGetAllIncentivesRequest();
    return message;
  },
  fromAmino(_: GetAllIncentivesRequestAmino): GetAllIncentivesRequest {
    const message = createBaseGetAllIncentivesRequest();
    return message;
  },
  toAmino(_: GetAllIncentivesRequest): GetAllIncentivesRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: GetAllIncentivesRequestAminoMsg): GetAllIncentivesRequest {
    return GetAllIncentivesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: GetAllIncentivesRequestProtoMsg): GetAllIncentivesRequest {
    return GetAllIncentivesRequest.decode(message.value);
  },
  toProto(message: GetAllIncentivesRequest): Uint8Array {
    return GetAllIncentivesRequest.encode(message).finish();
  },
  toProtoMsg(message: GetAllIncentivesRequest): GetAllIncentivesRequestProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.GetAllIncentivesRequest",
      value: GetAllIncentivesRequest.encode(message).finish()
    };
  }
};
function createBaseGetAllIncentivesResponse(): GetAllIncentivesResponse {
  return {
    registry: []
  };
}
export const GetAllIncentivesResponse = {
  typeUrl: "/slinky.incentives.v1.GetAllIncentivesResponse",
  encode(message: GetAllIncentivesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.registry) {
      IncentivesByType.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GetAllIncentivesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllIncentivesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.registry.push(IncentivesByType.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GetAllIncentivesResponse>): GetAllIncentivesResponse {
    const message = createBaseGetAllIncentivesResponse();
    message.registry = object.registry?.map(e => IncentivesByType.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GetAllIncentivesResponseAmino): GetAllIncentivesResponse {
    const message = createBaseGetAllIncentivesResponse();
    message.registry = object.registry?.map(e => IncentivesByType.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GetAllIncentivesResponse): GetAllIncentivesResponseAmino {
    const obj: any = {};
    if (message.registry) {
      obj.registry = message.registry.map(e => e ? IncentivesByType.toAmino(e) : undefined);
    } else {
      obj.registry = message.registry;
    }
    return obj;
  },
  fromAminoMsg(object: GetAllIncentivesResponseAminoMsg): GetAllIncentivesResponse {
    return GetAllIncentivesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: GetAllIncentivesResponseProtoMsg): GetAllIncentivesResponse {
    return GetAllIncentivesResponse.decode(message.value);
  },
  toProto(message: GetAllIncentivesResponse): Uint8Array {
    return GetAllIncentivesResponse.encode(message).finish();
  },
  toProtoMsg(message: GetAllIncentivesResponse): GetAllIncentivesResponseProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.GetAllIncentivesResponse",
      value: GetAllIncentivesResponse.encode(message).finish()
    };
  }
};