//@ts-nocheck
import { AffiliateTiers, AffiliateTiersAmino, AffiliateTiersSDKType } from "./affiliates";
import { BinaryReader, BinaryWriter } from "../../binary";
/** Message to register a referee-affiliate relationship */
export interface MsgRegisterAffiliate {
  /** Address of the referee */
  referee: string;
  /** Address of the affiliate */
  affiliate: string;
}
export interface MsgRegisterAffiliateProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate";
  value: Uint8Array;
}
/** Message to register a referee-affiliate relationship */
export interface MsgRegisterAffiliateAmino {
  /** Address of the referee */
  referee?: string;
  /** Address of the affiliate */
  affiliate?: string;
}
export interface MsgRegisterAffiliateAminoMsg {
  type: "/dydxprotocol.affiliates.MsgRegisterAffiliate";
  value: MsgRegisterAffiliateAmino;
}
/** Message to register a referee-affiliate relationship */
export interface MsgRegisterAffiliateSDKType {
  referee: string;
  affiliate: string;
}
/** Response to MsgRegisterAffiliate */
export interface MsgRegisterAffiliateResponse {}
export interface MsgRegisterAffiliateResponseProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliateResponse";
  value: Uint8Array;
}
/** Response to MsgRegisterAffiliate */
export interface MsgRegisterAffiliateResponseAmino {}
export interface MsgRegisterAffiliateResponseAminoMsg {
  type: "/dydxprotocol.affiliates.MsgRegisterAffiliateResponse";
  value: MsgRegisterAffiliateResponseAmino;
}
/** Response to MsgRegisterAffiliate */
export interface MsgRegisterAffiliateResponseSDKType {}
/** Message to update affiliate tiers */
export interface MsgUpdateAffiliateTiers {
  /** Authority sending this message. Will be sent by gov */
  authority: string;
  /** Updated affiliate tiers information */
  tiers?: AffiliateTiers;
}
export interface MsgUpdateAffiliateTiersProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers";
  value: Uint8Array;
}
/** Message to update affiliate tiers */
export interface MsgUpdateAffiliateTiersAmino {
  /** Authority sending this message. Will be sent by gov */
  authority?: string;
  /** Updated affiliate tiers information */
  tiers?: AffiliateTiersAmino;
}
export interface MsgUpdateAffiliateTiersAminoMsg {
  type: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers";
  value: MsgUpdateAffiliateTiersAmino;
}
/** Message to update affiliate tiers */
export interface MsgUpdateAffiliateTiersSDKType {
  authority: string;
  tiers?: AffiliateTiersSDKType;
}
/** Response to MsgUpdateAffiliateTiers */
export interface MsgUpdateAffiliateTiersResponse {}
export interface MsgUpdateAffiliateTiersResponseProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiersResponse";
  value: Uint8Array;
}
/** Response to MsgUpdateAffiliateTiers */
export interface MsgUpdateAffiliateTiersResponseAmino {}
export interface MsgUpdateAffiliateTiersResponseAminoMsg {
  type: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiersResponse";
  value: MsgUpdateAffiliateTiersResponseAmino;
}
/** Response to MsgUpdateAffiliateTiers */
export interface MsgUpdateAffiliateTiersResponseSDKType {}
function createBaseMsgRegisterAffiliate(): MsgRegisterAffiliate {
  return {
    referee: "",
    affiliate: ""
  };
}
export const MsgRegisterAffiliate = {
  typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
  encode(message: MsgRegisterAffiliate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.referee !== "") {
      writer.uint32(10).string(message.referee);
    }
    if (message.affiliate !== "") {
      writer.uint32(18).string(message.affiliate);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterAffiliate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterAffiliate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.referee = reader.string();
          break;
        case 2:
          message.affiliate = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRegisterAffiliate>): MsgRegisterAffiliate {
    const message = createBaseMsgRegisterAffiliate();
    message.referee = object.referee ?? "";
    message.affiliate = object.affiliate ?? "";
    return message;
  },
  fromAmino(object: MsgRegisterAffiliateAmino): MsgRegisterAffiliate {
    const message = createBaseMsgRegisterAffiliate();
    if (object.referee !== undefined && object.referee !== null) {
      message.referee = object.referee;
    }
    if (object.affiliate !== undefined && object.affiliate !== null) {
      message.affiliate = object.affiliate;
    }
    return message;
  },
  toAmino(message: MsgRegisterAffiliate): MsgRegisterAffiliateAmino {
    const obj: any = {};
    obj.referee = message.referee === "" ? undefined : message.referee;
    obj.affiliate = message.affiliate === "" ? undefined : message.affiliate;
    return obj;
  },
  fromAminoMsg(object: MsgRegisterAffiliateAminoMsg): MsgRegisterAffiliate {
    return MsgRegisterAffiliate.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRegisterAffiliateProtoMsg): MsgRegisterAffiliate {
    return MsgRegisterAffiliate.decode(message.value);
  },
  toProto(message: MsgRegisterAffiliate): Uint8Array {
    return MsgRegisterAffiliate.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterAffiliate): MsgRegisterAffiliateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
      value: MsgRegisterAffiliate.encode(message).finish()
    };
  }
};
function createBaseMsgRegisterAffiliateResponse(): MsgRegisterAffiliateResponse {
  return {};
}
export const MsgRegisterAffiliateResponse = {
  typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliateResponse",
  encode(_: MsgRegisterAffiliateResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterAffiliateResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterAffiliateResponse();
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
  fromPartial(_: Partial<MsgRegisterAffiliateResponse>): MsgRegisterAffiliateResponse {
    const message = createBaseMsgRegisterAffiliateResponse();
    return message;
  },
  fromAmino(_: MsgRegisterAffiliateResponseAmino): MsgRegisterAffiliateResponse {
    const message = createBaseMsgRegisterAffiliateResponse();
    return message;
  },
  toAmino(_: MsgRegisterAffiliateResponse): MsgRegisterAffiliateResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgRegisterAffiliateResponseAminoMsg): MsgRegisterAffiliateResponse {
    return MsgRegisterAffiliateResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRegisterAffiliateResponseProtoMsg): MsgRegisterAffiliateResponse {
    return MsgRegisterAffiliateResponse.decode(message.value);
  },
  toProto(message: MsgRegisterAffiliateResponse): Uint8Array {
    return MsgRegisterAffiliateResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterAffiliateResponse): MsgRegisterAffiliateResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliateResponse",
      value: MsgRegisterAffiliateResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateAffiliateTiers(): MsgUpdateAffiliateTiers {
  return {
    authority: "",
    tiers: undefined
  };
}
export const MsgUpdateAffiliateTiers = {
  typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
  encode(message: MsgUpdateAffiliateTiers, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.tiers !== undefined) {
      AffiliateTiers.encode(message.tiers, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateAffiliateTiers {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateAffiliateTiers();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.tiers = AffiliateTiers.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateAffiliateTiers>): MsgUpdateAffiliateTiers {
    const message = createBaseMsgUpdateAffiliateTiers();
    message.authority = object.authority ?? "";
    message.tiers = object.tiers !== undefined && object.tiers !== null ? AffiliateTiers.fromPartial(object.tiers) : undefined;
    return message;
  },
  fromAmino(object: MsgUpdateAffiliateTiersAmino): MsgUpdateAffiliateTiers {
    const message = createBaseMsgUpdateAffiliateTiers();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.tiers !== undefined && object.tiers !== null) {
      message.tiers = AffiliateTiers.fromAmino(object.tiers);
    }
    return message;
  },
  toAmino(message: MsgUpdateAffiliateTiers): MsgUpdateAffiliateTiersAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.tiers = message.tiers ? AffiliateTiers.toAmino(message.tiers) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateAffiliateTiersAminoMsg): MsgUpdateAffiliateTiers {
    return MsgUpdateAffiliateTiers.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateAffiliateTiersProtoMsg): MsgUpdateAffiliateTiers {
    return MsgUpdateAffiliateTiers.decode(message.value);
  },
  toProto(message: MsgUpdateAffiliateTiers): Uint8Array {
    return MsgUpdateAffiliateTiers.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateAffiliateTiers): MsgUpdateAffiliateTiersProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
      value: MsgUpdateAffiliateTiers.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateAffiliateTiersResponse(): MsgUpdateAffiliateTiersResponse {
  return {};
}
export const MsgUpdateAffiliateTiersResponse = {
  typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiersResponse",
  encode(_: MsgUpdateAffiliateTiersResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateAffiliateTiersResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateAffiliateTiersResponse();
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
  fromPartial(_: Partial<MsgUpdateAffiliateTiersResponse>): MsgUpdateAffiliateTiersResponse {
    const message = createBaseMsgUpdateAffiliateTiersResponse();
    return message;
  },
  fromAmino(_: MsgUpdateAffiliateTiersResponseAmino): MsgUpdateAffiliateTiersResponse {
    const message = createBaseMsgUpdateAffiliateTiersResponse();
    return message;
  },
  toAmino(_: MsgUpdateAffiliateTiersResponse): MsgUpdateAffiliateTiersResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateAffiliateTiersResponseAminoMsg): MsgUpdateAffiliateTiersResponse {
    return MsgUpdateAffiliateTiersResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateAffiliateTiersResponseProtoMsg): MsgUpdateAffiliateTiersResponse {
    return MsgUpdateAffiliateTiersResponse.decode(message.value);
  },
  toProto(message: MsgUpdateAffiliateTiersResponse): Uint8Array {
    return MsgUpdateAffiliateTiersResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateAffiliateTiersResponse): MsgUpdateAffiliateTiersResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiersResponse",
      value: MsgUpdateAffiliateTiersResponse.encode(message).finish()
    };
  }
};