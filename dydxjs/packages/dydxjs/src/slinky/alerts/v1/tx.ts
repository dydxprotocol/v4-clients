//@ts-nocheck
import { Alert, AlertAmino, AlertSDKType, MultiSigConclusion, MultiSigConclusionProtoMsg, MultiSigConclusionSDKType } from "./alerts";
import { Any, AnyProtoMsg, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
/** MsgAlert defines a message to create an alert. */
export interface MsgAlert {
  /** alert is the alert to be filed */
  alert: Alert;
}
export interface MsgAlertProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgAlert";
  value: Uint8Array;
}
/** MsgAlert defines a message to create an alert. */
export interface MsgAlertAmino {
  /** alert is the alert to be filed */
  alert?: AlertAmino;
}
export interface MsgAlertAminoMsg {
  type: "slinky/x/alerts/MsgAlert";
  value: MsgAlertAmino;
}
/** MsgAlert defines a message to create an alert. */
export interface MsgAlertSDKType {
  alert: AlertSDKType;
}
export interface MsgAlertResponse {}
export interface MsgAlertResponseProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgAlertResponse";
  value: Uint8Array;
}
export interface MsgAlertResponseAmino {}
export interface MsgAlertResponseAminoMsg {
  type: "/slinky.alerts.v1.MsgAlertResponse";
  value: MsgAlertResponseAmino;
}
export interface MsgAlertResponseSDKType {}
/**
 * MsgConclusion defines a message carrying a Conclusion made by the SecondTier,
 * which will be used to close an alert. And trigger any ramifications of the
 * conclusion.
 */
export interface MsgConclusion {
  /**
   * signer is the signer of this transaction (notice, this may not always be a
   * node from the SecondTier)
   */
  signer: string;
  /** conclusion is the conclusion to be filed */
  conclusion?: MultiSigConclusion | Any | undefined;
}
export interface MsgConclusionProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgConclusion";
  value: Uint8Array;
}
export type MsgConclusionEncoded = Omit<MsgConclusion, "conclusion"> & {
  /** conclusion is the conclusion to be filed */conclusion?: MultiSigConclusionProtoMsg | AnyProtoMsg | undefined;
};
/**
 * MsgConclusion defines a message carrying a Conclusion made by the SecondTier,
 * which will be used to close an alert. And trigger any ramifications of the
 * conclusion.
 */
export interface MsgConclusionAmino {
  /**
   * signer is the signer of this transaction (notice, this may not always be a
   * node from the SecondTier)
   */
  signer?: string;
  /** conclusion is the conclusion to be filed */
  conclusion?: AnyAmino;
}
export interface MsgConclusionAminoMsg {
  type: "slinky/x/alerts/MsgConclusion";
  value: MsgConclusionAmino;
}
/**
 * MsgConclusion defines a message carrying a Conclusion made by the SecondTier,
 * which will be used to close an alert. And trigger any ramifications of the
 * conclusion.
 */
export interface MsgConclusionSDKType {
  signer: string;
  conclusion?: MultiSigConclusionSDKType | AnySDKType | undefined;
}
export interface MsgConclusionResponse {}
export interface MsgConclusionResponseProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgConclusionResponse";
  value: Uint8Array;
}
export interface MsgConclusionResponseAmino {}
export interface MsgConclusionResponseAminoMsg {
  type: "/slinky.alerts.v1.MsgConclusionResponse";
  value: MsgConclusionResponseAmino;
}
export interface MsgConclusionResponseSDKType {}
/**
 * MsgUpdateParams defines the message type expected by the UpdateParams rpc. It
 * contains an authority address, and the new Params for the x/alerts module.
 */
export interface MsgUpdateParams {
  /** authority is the address of the authority that is submitting the update */
  authority: string;
  /** params is the new set of parameters for the x/alerts module */
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgUpdateParams";
  value: Uint8Array;
}
/**
 * MsgUpdateParams defines the message type expected by the UpdateParams rpc. It
 * contains an authority address, and the new Params for the x/alerts module.
 */
export interface MsgUpdateParamsAmino {
  /** authority is the address of the authority that is submitting the update */
  authority?: string;
  /** params is the new set of parameters for the x/alerts module */
  params?: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
  type: "slinky/x/alerts/MsgUpdateParams";
  value: MsgUpdateParamsAmino;
}
/**
 * MsgUpdateParams defines the message type expected by the UpdateParams rpc. It
 * contains an authority address, and the new Params for the x/alerts module.
 */
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/slinky.alerts.v1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
  type: "/slinky.alerts.v1.MsgUpdateParamsResponse";
  value: MsgUpdateParamsResponseAmino;
}
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgAlert(): MsgAlert {
  return {
    alert: Alert.fromPartial({})
  };
}
export const MsgAlert = {
  typeUrl: "/slinky.alerts.v1.MsgAlert",
  encode(message: MsgAlert, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.alert !== undefined) {
      Alert.encode(message.alert, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgAlert {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAlert();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alert = Alert.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgAlert>): MsgAlert {
    const message = createBaseMsgAlert();
    message.alert = object.alert !== undefined && object.alert !== null ? Alert.fromPartial(object.alert) : undefined;
    return message;
  },
  fromAmino(object: MsgAlertAmino): MsgAlert {
    const message = createBaseMsgAlert();
    if (object.alert !== undefined && object.alert !== null) {
      message.alert = Alert.fromAmino(object.alert);
    }
    return message;
  },
  toAmino(message: MsgAlert): MsgAlertAmino {
    const obj: any = {};
    obj.alert = message.alert ? Alert.toAmino(message.alert) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgAlertAminoMsg): MsgAlert {
    return MsgAlert.fromAmino(object.value);
  },
  toAminoMsg(message: MsgAlert): MsgAlertAminoMsg {
    return {
      type: "slinky/x/alerts/MsgAlert",
      value: MsgAlert.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgAlertProtoMsg): MsgAlert {
    return MsgAlert.decode(message.value);
  },
  toProto(message: MsgAlert): Uint8Array {
    return MsgAlert.encode(message).finish();
  },
  toProtoMsg(message: MsgAlert): MsgAlertProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgAlert",
      value: MsgAlert.encode(message).finish()
    };
  }
};
function createBaseMsgAlertResponse(): MsgAlertResponse {
  return {};
}
export const MsgAlertResponse = {
  typeUrl: "/slinky.alerts.v1.MsgAlertResponse",
  encode(_: MsgAlertResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgAlertResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAlertResponse();
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
  fromPartial(_: Partial<MsgAlertResponse>): MsgAlertResponse {
    const message = createBaseMsgAlertResponse();
    return message;
  },
  fromAmino(_: MsgAlertResponseAmino): MsgAlertResponse {
    const message = createBaseMsgAlertResponse();
    return message;
  },
  toAmino(_: MsgAlertResponse): MsgAlertResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgAlertResponseAminoMsg): MsgAlertResponse {
    return MsgAlertResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgAlertResponseProtoMsg): MsgAlertResponse {
    return MsgAlertResponse.decode(message.value);
  },
  toProto(message: MsgAlertResponse): Uint8Array {
    return MsgAlertResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgAlertResponse): MsgAlertResponseProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgAlertResponse",
      value: MsgAlertResponse.encode(message).finish()
    };
  }
};
function createBaseMsgConclusion(): MsgConclusion {
  return {
    signer: "",
    conclusion: undefined
  };
}
export const MsgConclusion = {
  typeUrl: "/slinky.alerts.v1.MsgConclusion",
  encode(message: MsgConclusion, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.conclusion !== undefined) {
      Any.encode(message.conclusion as Any, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgConclusion {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConclusion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.conclusion = Slinky_alertsv1Conclusion_InterfaceDecoder(reader) as Any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgConclusion>): MsgConclusion {
    const message = createBaseMsgConclusion();
    message.signer = object.signer ?? "";
    message.conclusion = object.conclusion !== undefined && object.conclusion !== null ? Any.fromPartial(object.conclusion) : undefined;
    return message;
  },
  fromAmino(object: MsgConclusionAmino): MsgConclusion {
    const message = createBaseMsgConclusion();
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    if (object.conclusion !== undefined && object.conclusion !== null) {
      message.conclusion = Slinky_alertsv1Conclusion_FromAmino(object.conclusion);
    }
    return message;
  },
  toAmino(message: MsgConclusion): MsgConclusionAmino {
    const obj: any = {};
    obj.signer = message.signer === "" ? undefined : message.signer;
    obj.conclusion = message.conclusion ? Slinky_alertsv1Conclusion_ToAmino(message.conclusion as Any) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgConclusionAminoMsg): MsgConclusion {
    return MsgConclusion.fromAmino(object.value);
  },
  toAminoMsg(message: MsgConclusion): MsgConclusionAminoMsg {
    return {
      type: "slinky/x/alerts/MsgConclusion",
      value: MsgConclusion.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgConclusionProtoMsg): MsgConclusion {
    return MsgConclusion.decode(message.value);
  },
  toProto(message: MsgConclusion): Uint8Array {
    return MsgConclusion.encode(message).finish();
  },
  toProtoMsg(message: MsgConclusion): MsgConclusionProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgConclusion",
      value: MsgConclusion.encode(message).finish()
    };
  }
};
function createBaseMsgConclusionResponse(): MsgConclusionResponse {
  return {};
}
export const MsgConclusionResponse = {
  typeUrl: "/slinky.alerts.v1.MsgConclusionResponse",
  encode(_: MsgConclusionResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgConclusionResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConclusionResponse();
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
  fromPartial(_: Partial<MsgConclusionResponse>): MsgConclusionResponse {
    const message = createBaseMsgConclusionResponse();
    return message;
  },
  fromAmino(_: MsgConclusionResponseAmino): MsgConclusionResponse {
    const message = createBaseMsgConclusionResponse();
    return message;
  },
  toAmino(_: MsgConclusionResponse): MsgConclusionResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgConclusionResponseAminoMsg): MsgConclusionResponse {
    return MsgConclusionResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgConclusionResponseProtoMsg): MsgConclusionResponse {
    return MsgConclusionResponse.decode(message.value);
  },
  toProto(message: MsgConclusionResponse): Uint8Array {
    return MsgConclusionResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgConclusionResponse): MsgConclusionResponseProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgConclusionResponse",
      value: MsgConclusionResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/slinky.alerts.v1.MsgUpdateParams",
  encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: MsgUpdateParamsAmino): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: MsgUpdateParams): MsgUpdateParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsAminoMsg): MsgUpdateParams {
    return MsgUpdateParams.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpdateParams): MsgUpdateParamsAminoMsg {
    return {
      type: "slinky/x/alerts/MsgUpdateParams",
      value: MsgUpdateParams.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
    return MsgUpdateParams.decode(message.value);
  },
  toProto(message: MsgUpdateParams): Uint8Array {
    return MsgUpdateParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/slinky.alerts.v1.MsgUpdateParamsResponse",
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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
  fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  fromAmino(_: MsgUpdateParamsResponseAmino): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  toAmino(_: MsgUpdateParamsResponse): MsgUpdateParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsResponseAminoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateParamsResponse): Uint8Array {
    return MsgUpdateParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};
export const Slinky_alertsv1Conclusion_InterfaceDecoder = (input: BinaryReader | Uint8Array): MultiSigConclusion | Any => {
  const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
  const data = Any.decode(reader, reader.uint32());
  switch (data.typeUrl) {
    case "/slinky.alerts.v1.MultiSigConclusion":
      return MultiSigConclusion.decode(data.value);
    default:
      return data;
  }
};
export const Slinky_alertsv1Conclusion_FromAmino = (content: AnyAmino): Any => {
  switch (content.type) {
    case "slinky/x/alerts/Conclusion":
      return Any.fromPartial({
        typeUrl: "/slinky.alerts.v1.MultiSigConclusion",
        value: MultiSigConclusion.encode(MultiSigConclusion.fromPartial(MultiSigConclusion.fromAmino(content.value))).finish()
      });
    default:
      return Any.fromAmino(content);
  }
};
export const Slinky_alertsv1Conclusion_ToAmino = (content: Any) => {
  switch (content.typeUrl) {
    case "/slinky.alerts.v1.MultiSigConclusion":
      return {
        type: "slinky/x/alerts/Conclusion",
        value: MultiSigConclusion.toAmino(MultiSigConclusion.decode(content.value, undefined))
      };
    default:
      return Any.toAmino(content);
  }
};