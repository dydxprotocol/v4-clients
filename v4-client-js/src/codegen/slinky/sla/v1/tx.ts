import { PriceFeedSLA, PriceFeedSLAAmino, PriceFeedSLASDKType, Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * MsgAddSLAs defines the Msg/AddSLAs request type. It contains the
 * SLAs to be added to the store.
 */
export interface MsgAddSLAs {
  /** SLAs defines the SLAs to be added to the store. */
  slas: PriceFeedSLA[];
  /** Authority defines the authority that is adding the SLAs. */
  authority: string;
}
export interface MsgAddSLAsProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgAddSLAs";
  value: Uint8Array;
}
/**
 * MsgAddSLAs defines the Msg/AddSLAs request type. It contains the
 * SLAs to be added to the store.
 */
export interface MsgAddSLAsAmino {
  /** SLAs defines the SLAs to be added to the store. */
  slas?: PriceFeedSLAAmino[];
  /** Authority defines the authority that is adding the SLAs. */
  authority?: string;
}
export interface MsgAddSLAsAminoMsg {
  type: "/slinky.sla.v1.MsgAddSLAs";
  value: MsgAddSLAsAmino;
}
/**
 * MsgAddSLAs defines the Msg/AddSLAs request type. It contains the
 * SLAs to be added to the store.
 */
export interface MsgAddSLAsSDKType {
  slas: PriceFeedSLASDKType[];
  authority: string;
}
/** MsgAddSLAsResponse defines the Msg/AddSLAs response type. */
export interface MsgAddSLAsResponse {}
export interface MsgAddSLAsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgAddSLAsResponse";
  value: Uint8Array;
}
/** MsgAddSLAsResponse defines the Msg/AddSLAs response type. */
export interface MsgAddSLAsResponseAmino {}
export interface MsgAddSLAsResponseAminoMsg {
  type: "/slinky.sla.v1.MsgAddSLAsResponse";
  value: MsgAddSLAsResponseAmino;
}
/** MsgAddSLAsResponse defines the Msg/AddSLAs response type. */
export interface MsgAddSLAsResponseSDKType {}
/**
 * MsgRemoveSLAs defines the Msg/RemoveSLAs request type. It contains the
 * IDs of the SLAs to be removed from the store.
 */
export interface MsgRemoveSLAs {
  /** IDs defines the IDs of the SLAs to be removed from the store. */
  ids: string[];
  /** Authority defines the authority that is removing the SLAs. */
  authority: string;
}
export interface MsgRemoveSLAsProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgRemoveSLAs";
  value: Uint8Array;
}
/**
 * MsgRemoveSLAs defines the Msg/RemoveSLAs request type. It contains the
 * IDs of the SLAs to be removed from the store.
 */
export interface MsgRemoveSLAsAmino {
  /** IDs defines the IDs of the SLAs to be removed from the store. */
  ids?: string[];
  /** Authority defines the authority that is removing the SLAs. */
  authority?: string;
}
export interface MsgRemoveSLAsAminoMsg {
  type: "/slinky.sla.v1.MsgRemoveSLAs";
  value: MsgRemoveSLAsAmino;
}
/**
 * MsgRemoveSLAs defines the Msg/RemoveSLAs request type. It contains the
 * IDs of the SLAs to be removed from the store.
 */
export interface MsgRemoveSLAsSDKType {
  ids: string[];
  authority: string;
}
/** MsgRemoveSLAsResponse defines the Msg/RemoveSLAs response type. */
export interface MsgRemoveSLAsResponse {}
export interface MsgRemoveSLAsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgRemoveSLAsResponse";
  value: Uint8Array;
}
/** MsgRemoveSLAsResponse defines the Msg/RemoveSLAs response type. */
export interface MsgRemoveSLAsResponseAmino {}
export interface MsgRemoveSLAsResponseAminoMsg {
  type: "/slinky.sla.v1.MsgRemoveSLAsResponse";
  value: MsgRemoveSLAsResponseAmino;
}
/** MsgRemoveSLAsResponse defines the Msg/RemoveSLAs response type. */
export interface MsgRemoveSLAsResponseSDKType {}
/**
 * MsgParams defines the Msg/Params request type. It contains the
 * new parameters for the SLA module.
 */
export interface MsgParams {
  /** Params defines the new parameters for the SLA module. */
  params: Params;
  /** Authority defines the authority that is updating the SLA module parameters. */
  authority: string;
}
export interface MsgParamsProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgParams";
  value: Uint8Array;
}
/**
 * MsgParams defines the Msg/Params request type. It contains the
 * new parameters for the SLA module.
 */
export interface MsgParamsAmino {
  /** Params defines the new parameters for the SLA module. */
  params?: ParamsAmino;
  /** Authority defines the authority that is updating the SLA module parameters. */
  authority?: string;
}
export interface MsgParamsAminoMsg {
  type: "/slinky.sla.v1.MsgParams";
  value: MsgParamsAmino;
}
/**
 * MsgParams defines the Msg/Params request type. It contains the
 * new parameters for the SLA module.
 */
export interface MsgParamsSDKType {
  params: ParamsSDKType;
  authority: string;
}
/** MsgParamsResponse defines the Msg/Params response type. */
export interface MsgParamsResponse {}
export interface MsgParamsResponseProtoMsg {
  typeUrl: "/slinky.sla.v1.MsgParamsResponse";
  value: Uint8Array;
}
/** MsgParamsResponse defines the Msg/Params response type. */
export interface MsgParamsResponseAmino {}
export interface MsgParamsResponseAminoMsg {
  type: "/slinky.sla.v1.MsgParamsResponse";
  value: MsgParamsResponseAmino;
}
/** MsgParamsResponse defines the Msg/Params response type. */
export interface MsgParamsResponseSDKType {}
function createBaseMsgAddSLAs(): MsgAddSLAs {
  return {
    slas: [],
    authority: ""
  };
}
export const MsgAddSLAs = {
  typeUrl: "/slinky.sla.v1.MsgAddSLAs",
  encode(message: MsgAddSLAs, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.slas) {
      PriceFeedSLA.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.authority !== "") {
      writer.uint32(18).string(message.authority);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgAddSLAs {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddSLAs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.slas.push(PriceFeedSLA.decode(reader, reader.uint32()));
          break;
        case 2:
          message.authority = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgAddSLAs>): MsgAddSLAs {
    const message = createBaseMsgAddSLAs();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromPartial(e)) || [];
    message.authority = object.authority ?? "";
    return message;
  },
  fromAmino(object: MsgAddSLAsAmino): MsgAddSLAs {
    const message = createBaseMsgAddSLAs();
    message.slas = object.slas?.map(e => PriceFeedSLA.fromAmino(e)) || [];
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    return message;
  },
  toAmino(message: MsgAddSLAs): MsgAddSLAsAmino {
    const obj: any = {};
    if (message.slas) {
      obj.slas = message.slas.map(e => e ? PriceFeedSLA.toAmino(e) : undefined);
    } else {
      obj.slas = message.slas;
    }
    obj.authority = message.authority === "" ? undefined : message.authority;
    return obj;
  },
  fromAminoMsg(object: MsgAddSLAsAminoMsg): MsgAddSLAs {
    return MsgAddSLAs.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgAddSLAsProtoMsg): MsgAddSLAs {
    return MsgAddSLAs.decode(message.value);
  },
  toProto(message: MsgAddSLAs): Uint8Array {
    return MsgAddSLAs.encode(message).finish();
  },
  toProtoMsg(message: MsgAddSLAs): MsgAddSLAsProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgAddSLAs",
      value: MsgAddSLAs.encode(message).finish()
    };
  }
};
function createBaseMsgAddSLAsResponse(): MsgAddSLAsResponse {
  return {};
}
export const MsgAddSLAsResponse = {
  typeUrl: "/slinky.sla.v1.MsgAddSLAsResponse",
  encode(_: MsgAddSLAsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgAddSLAsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddSLAsResponse();
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
  fromPartial(_: Partial<MsgAddSLAsResponse>): MsgAddSLAsResponse {
    const message = createBaseMsgAddSLAsResponse();
    return message;
  },
  fromAmino(_: MsgAddSLAsResponseAmino): MsgAddSLAsResponse {
    const message = createBaseMsgAddSLAsResponse();
    return message;
  },
  toAmino(_: MsgAddSLAsResponse): MsgAddSLAsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgAddSLAsResponseAminoMsg): MsgAddSLAsResponse {
    return MsgAddSLAsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgAddSLAsResponseProtoMsg): MsgAddSLAsResponse {
    return MsgAddSLAsResponse.decode(message.value);
  },
  toProto(message: MsgAddSLAsResponse): Uint8Array {
    return MsgAddSLAsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgAddSLAsResponse): MsgAddSLAsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgAddSLAsResponse",
      value: MsgAddSLAsResponse.encode(message).finish()
    };
  }
};
function createBaseMsgRemoveSLAs(): MsgRemoveSLAs {
  return {
    ids: [],
    authority: ""
  };
}
export const MsgRemoveSLAs = {
  typeUrl: "/slinky.sla.v1.MsgRemoveSLAs",
  encode(message: MsgRemoveSLAs, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    if (message.authority !== "") {
      writer.uint32(18).string(message.authority);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRemoveSLAs {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveSLAs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ids.push(reader.string());
          break;
        case 2:
          message.authority = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRemoveSLAs>): MsgRemoveSLAs {
    const message = createBaseMsgRemoveSLAs();
    message.ids = object.ids?.map(e => e) || [];
    message.authority = object.authority ?? "";
    return message;
  },
  fromAmino(object: MsgRemoveSLAsAmino): MsgRemoveSLAs {
    const message = createBaseMsgRemoveSLAs();
    message.ids = object.ids?.map(e => e) || [];
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    return message;
  },
  toAmino(message: MsgRemoveSLAs): MsgRemoveSLAsAmino {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map(e => e);
    } else {
      obj.ids = message.ids;
    }
    obj.authority = message.authority === "" ? undefined : message.authority;
    return obj;
  },
  fromAminoMsg(object: MsgRemoveSLAsAminoMsg): MsgRemoveSLAs {
    return MsgRemoveSLAs.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRemoveSLAsProtoMsg): MsgRemoveSLAs {
    return MsgRemoveSLAs.decode(message.value);
  },
  toProto(message: MsgRemoveSLAs): Uint8Array {
    return MsgRemoveSLAs.encode(message).finish();
  },
  toProtoMsg(message: MsgRemoveSLAs): MsgRemoveSLAsProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgRemoveSLAs",
      value: MsgRemoveSLAs.encode(message).finish()
    };
  }
};
function createBaseMsgRemoveSLAsResponse(): MsgRemoveSLAsResponse {
  return {};
}
export const MsgRemoveSLAsResponse = {
  typeUrl: "/slinky.sla.v1.MsgRemoveSLAsResponse",
  encode(_: MsgRemoveSLAsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRemoveSLAsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveSLAsResponse();
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
  fromPartial(_: Partial<MsgRemoveSLAsResponse>): MsgRemoveSLAsResponse {
    const message = createBaseMsgRemoveSLAsResponse();
    return message;
  },
  fromAmino(_: MsgRemoveSLAsResponseAmino): MsgRemoveSLAsResponse {
    const message = createBaseMsgRemoveSLAsResponse();
    return message;
  },
  toAmino(_: MsgRemoveSLAsResponse): MsgRemoveSLAsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgRemoveSLAsResponseAminoMsg): MsgRemoveSLAsResponse {
    return MsgRemoveSLAsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRemoveSLAsResponseProtoMsg): MsgRemoveSLAsResponse {
    return MsgRemoveSLAsResponse.decode(message.value);
  },
  toProto(message: MsgRemoveSLAsResponse): Uint8Array {
    return MsgRemoveSLAsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgRemoveSLAsResponse): MsgRemoveSLAsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgRemoveSLAsResponse",
      value: MsgRemoveSLAsResponse.encode(message).finish()
    };
  }
};
function createBaseMsgParams(): MsgParams {
  return {
    params: Params.fromPartial({}),
    authority: ""
  };
}
export const MsgParams = {
  typeUrl: "/slinky.sla.v1.MsgParams",
  encode(message: MsgParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.authority !== "") {
      writer.uint32(18).string(message.authority);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.authority = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgParams>): MsgParams {
    const message = createBaseMsgParams();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.authority = object.authority ?? "";
    return message;
  },
  fromAmino(object: MsgParamsAmino): MsgParams {
    const message = createBaseMsgParams();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    return message;
  },
  toAmino(message: MsgParams): MsgParamsAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    obj.authority = message.authority === "" ? undefined : message.authority;
    return obj;
  },
  fromAminoMsg(object: MsgParamsAminoMsg): MsgParams {
    return MsgParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgParamsProtoMsg): MsgParams {
    return MsgParams.decode(message.value);
  },
  toProto(message: MsgParams): Uint8Array {
    return MsgParams.encode(message).finish();
  },
  toProtoMsg(message: MsgParams): MsgParamsProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgParams",
      value: MsgParams.encode(message).finish()
    };
  }
};
function createBaseMsgParamsResponse(): MsgParamsResponse {
  return {};
}
export const MsgParamsResponse = {
  typeUrl: "/slinky.sla.v1.MsgParamsResponse",
  encode(_: MsgParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgParamsResponse();
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
  fromPartial(_: Partial<MsgParamsResponse>): MsgParamsResponse {
    const message = createBaseMsgParamsResponse();
    return message;
  },
  fromAmino(_: MsgParamsResponseAmino): MsgParamsResponse {
    const message = createBaseMsgParamsResponse();
    return message;
  },
  toAmino(_: MsgParamsResponse): MsgParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgParamsResponseAminoMsg): MsgParamsResponse {
    return MsgParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgParamsResponseProtoMsg): MsgParamsResponse {
    return MsgParamsResponse.decode(message.value);
  },
  toProto(message: MsgParamsResponse): Uint8Array {
    return MsgParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgParamsResponse): MsgParamsResponseProtoMsg {
    return {
      typeUrl: "/slinky.sla.v1.MsgParamsResponse",
      value: MsgParamsResponse.encode(message).finish()
    };
  }
};