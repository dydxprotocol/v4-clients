//@ts-nocheck
import { LimitParams, LimitParamsAmino, LimitParamsSDKType } from "./limit_params";
import { BinaryReader, BinaryWriter } from "../../binary";
/** MsgSetLimitParams is the Msg/SetLimitParams request type. */
export interface MsgSetLimitParams {
  authority: string;
  /** Defines the parameters to set. All parameters must be supplied. */
  limitParams: LimitParams;
}
export interface MsgSetLimitParamsProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams";
  value: Uint8Array;
}
/** MsgSetLimitParams is the Msg/SetLimitParams request type. */
export interface MsgSetLimitParamsAmino {
  authority?: string;
  /** Defines the parameters to set. All parameters must be supplied. */
  limit_params?: LimitParamsAmino;
}
export interface MsgSetLimitParamsAminoMsg {
  type: "/dydxprotocol.ratelimit.MsgSetLimitParams";
  value: MsgSetLimitParamsAmino;
}
/** MsgSetLimitParams is the Msg/SetLimitParams request type. */
export interface MsgSetLimitParamsSDKType {
  authority: string;
  limit_params: LimitParamsSDKType;
}
/** MsgSetLimitParamsResponse is the Msg/SetLimitParams response type. */
export interface MsgSetLimitParamsResponse {}
export interface MsgSetLimitParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParamsResponse";
  value: Uint8Array;
}
/** MsgSetLimitParamsResponse is the Msg/SetLimitParams response type. */
export interface MsgSetLimitParamsResponseAmino {}
export interface MsgSetLimitParamsResponseAminoMsg {
  type: "/dydxprotocol.ratelimit.MsgSetLimitParamsResponse";
  value: MsgSetLimitParamsResponseAmino;
}
/** MsgSetLimitParamsResponse is the Msg/SetLimitParams response type. */
export interface MsgSetLimitParamsResponseSDKType {}
function createBaseMsgSetLimitParams(): MsgSetLimitParams {
  return {
    authority: "",
    limitParams: LimitParams.fromPartial({})
  };
}
export const MsgSetLimitParams = {
  typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams",
  encode(message: MsgSetLimitParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.limitParams !== undefined) {
      LimitParams.encode(message.limitParams, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetLimitParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetLimitParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.limitParams = LimitParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetLimitParams>): MsgSetLimitParams {
    const message = createBaseMsgSetLimitParams();
    message.authority = object.authority ?? "";
    message.limitParams = object.limitParams !== undefined && object.limitParams !== null ? LimitParams.fromPartial(object.limitParams) : undefined;
    return message;
  },
  fromAmino(object: MsgSetLimitParamsAmino): MsgSetLimitParams {
    const message = createBaseMsgSetLimitParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.limit_params !== undefined && object.limit_params !== null) {
      message.limitParams = LimitParams.fromAmino(object.limit_params);
    }
    return message;
  },
  toAmino(message: MsgSetLimitParams): MsgSetLimitParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.limit_params = message.limitParams ? LimitParams.toAmino(message.limitParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSetLimitParamsAminoMsg): MsgSetLimitParams {
    return MsgSetLimitParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetLimitParamsProtoMsg): MsgSetLimitParams {
    return MsgSetLimitParams.decode(message.value);
  },
  toProto(message: MsgSetLimitParams): Uint8Array {
    return MsgSetLimitParams.encode(message).finish();
  },
  toProtoMsg(message: MsgSetLimitParams): MsgSetLimitParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams",
      value: MsgSetLimitParams.encode(message).finish()
    };
  }
};
function createBaseMsgSetLimitParamsResponse(): MsgSetLimitParamsResponse {
  return {};
}
export const MsgSetLimitParamsResponse = {
  typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParamsResponse",
  encode(_: MsgSetLimitParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetLimitParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetLimitParamsResponse();
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
  fromPartial(_: Partial<MsgSetLimitParamsResponse>): MsgSetLimitParamsResponse {
    const message = createBaseMsgSetLimitParamsResponse();
    return message;
  },
  fromAmino(_: MsgSetLimitParamsResponseAmino): MsgSetLimitParamsResponse {
    const message = createBaseMsgSetLimitParamsResponse();
    return message;
  },
  toAmino(_: MsgSetLimitParamsResponse): MsgSetLimitParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSetLimitParamsResponseAminoMsg): MsgSetLimitParamsResponse {
    return MsgSetLimitParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetLimitParamsResponseProtoMsg): MsgSetLimitParamsResponse {
    return MsgSetLimitParamsResponse.decode(message.value);
  },
  toProto(message: MsgSetLimitParamsResponse): Uint8Array {
    return MsgSetLimitParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSetLimitParamsResponse): MsgSetLimitParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParamsResponse",
      value: MsgSetLimitParamsResponse.encode(message).finish()
    };
  }
};