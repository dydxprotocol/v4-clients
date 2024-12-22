//@ts-nocheck
import { MarketMapperRevenueShareParams, MarketMapperRevenueShareParamsAmino, MarketMapperRevenueShareParamsSDKType } from "./params";
import { MarketMapperRevShareDetails, MarketMapperRevShareDetailsAmino, MarketMapperRevShareDetailsSDKType } from "./revshare";
import { BinaryReader, BinaryWriter } from "../../binary";
/** Message to set the market mapper revenue share */
export interface MsgSetMarketMapperRevenueShare {
  authority: string;
  /** Parameters for the revenue share */
  params: MarketMapperRevenueShareParams;
}
export interface MsgSetMarketMapperRevenueShareProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare";
  value: Uint8Array;
}
/** Message to set the market mapper revenue share */
export interface MsgSetMarketMapperRevenueShareAmino {
  authority?: string;
  /** Parameters for the revenue share */
  params?: MarketMapperRevenueShareParamsAmino;
}
export interface MsgSetMarketMapperRevenueShareAminoMsg {
  type: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare";
  value: MsgSetMarketMapperRevenueShareAmino;
}
/** Message to set the market mapper revenue share */
export interface MsgSetMarketMapperRevenueShareSDKType {
  authority: string;
  params: MarketMapperRevenueShareParamsSDKType;
}
/** Response to a MsgSetMarketMapperRevenueShare */
export interface MsgSetMarketMapperRevenueShareResponse {}
export interface MsgSetMarketMapperRevenueShareResponseProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShareResponse";
  value: Uint8Array;
}
/** Response to a MsgSetMarketMapperRevenueShare */
export interface MsgSetMarketMapperRevenueShareResponseAmino {}
export interface MsgSetMarketMapperRevenueShareResponseAminoMsg {
  type: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShareResponse";
  value: MsgSetMarketMapperRevenueShareResponseAmino;
}
/** Response to a MsgSetMarketMapperRevenueShare */
export interface MsgSetMarketMapperRevenueShareResponseSDKType {}
/**
 * Msg to set market mapper revenue share details (e.g. expiration timestamp)
 * for a specific market. To be used as an override for existing revenue share
 * settings set by the MsgSetMarketMapperRevenueShare msg
 */
export interface MsgSetMarketMapperRevShareDetailsForMarket {
  authority: string;
  /** The market ID for which to set the revenue share details */
  marketId: number;
  /** Parameters for the revenue share details */
  params: MarketMapperRevShareDetails;
}
export interface MsgSetMarketMapperRevShareDetailsForMarketProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket";
  value: Uint8Array;
}
/**
 * Msg to set market mapper revenue share details (e.g. expiration timestamp)
 * for a specific market. To be used as an override for existing revenue share
 * settings set by the MsgSetMarketMapperRevenueShare msg
 */
export interface MsgSetMarketMapperRevShareDetailsForMarketAmino {
  authority?: string;
  /** The market ID for which to set the revenue share details */
  market_id?: number;
  /** Parameters for the revenue share details */
  params?: MarketMapperRevShareDetailsAmino;
}
export interface MsgSetMarketMapperRevShareDetailsForMarketAminoMsg {
  type: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket";
  value: MsgSetMarketMapperRevShareDetailsForMarketAmino;
}
/**
 * Msg to set market mapper revenue share details (e.g. expiration timestamp)
 * for a specific market. To be used as an override for existing revenue share
 * settings set by the MsgSetMarketMapperRevenueShare msg
 */
export interface MsgSetMarketMapperRevShareDetailsForMarketSDKType {
  authority: string;
  market_id: number;
  params: MarketMapperRevShareDetailsSDKType;
}
/** Response to a MsgSetMarketMapperRevShareDetailsForMarket */
export interface MsgSetMarketMapperRevShareDetailsForMarketResponse {}
export interface MsgSetMarketMapperRevShareDetailsForMarketResponseProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarketResponse";
  value: Uint8Array;
}
/** Response to a MsgSetMarketMapperRevShareDetailsForMarket */
export interface MsgSetMarketMapperRevShareDetailsForMarketResponseAmino {}
export interface MsgSetMarketMapperRevShareDetailsForMarketResponseAminoMsg {
  type: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarketResponse";
  value: MsgSetMarketMapperRevShareDetailsForMarketResponseAmino;
}
/** Response to a MsgSetMarketMapperRevShareDetailsForMarket */
export interface MsgSetMarketMapperRevShareDetailsForMarketResponseSDKType {}
function createBaseMsgSetMarketMapperRevenueShare(): MsgSetMarketMapperRevenueShare {
  return {
    authority: "",
    params: MarketMapperRevenueShareParams.fromPartial({})
  };
}
export const MsgSetMarketMapperRevenueShare = {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare",
  encode(message: MsgSetMarketMapperRevenueShare, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      MarketMapperRevenueShareParams.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetMarketMapperRevenueShare {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetMarketMapperRevenueShare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = MarketMapperRevenueShareParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetMarketMapperRevenueShare>): MsgSetMarketMapperRevenueShare {
    const message = createBaseMsgSetMarketMapperRevenueShare();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? MarketMapperRevenueShareParams.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: MsgSetMarketMapperRevenueShareAmino): MsgSetMarketMapperRevenueShare {
    const message = createBaseMsgSetMarketMapperRevenueShare();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = MarketMapperRevenueShareParams.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: MsgSetMarketMapperRevenueShare): MsgSetMarketMapperRevenueShareAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.params = message.params ? MarketMapperRevenueShareParams.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSetMarketMapperRevenueShareAminoMsg): MsgSetMarketMapperRevenueShare {
    return MsgSetMarketMapperRevenueShare.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetMarketMapperRevenueShareProtoMsg): MsgSetMarketMapperRevenueShare {
    return MsgSetMarketMapperRevenueShare.decode(message.value);
  },
  toProto(message: MsgSetMarketMapperRevenueShare): Uint8Array {
    return MsgSetMarketMapperRevenueShare.encode(message).finish();
  },
  toProtoMsg(message: MsgSetMarketMapperRevenueShare): MsgSetMarketMapperRevenueShareProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare",
      value: MsgSetMarketMapperRevenueShare.encode(message).finish()
    };
  }
};
function createBaseMsgSetMarketMapperRevenueShareResponse(): MsgSetMarketMapperRevenueShareResponse {
  return {};
}
export const MsgSetMarketMapperRevenueShareResponse = {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShareResponse",
  encode(_: MsgSetMarketMapperRevenueShareResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetMarketMapperRevenueShareResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetMarketMapperRevenueShareResponse();
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
  fromPartial(_: Partial<MsgSetMarketMapperRevenueShareResponse>): MsgSetMarketMapperRevenueShareResponse {
    const message = createBaseMsgSetMarketMapperRevenueShareResponse();
    return message;
  },
  fromAmino(_: MsgSetMarketMapperRevenueShareResponseAmino): MsgSetMarketMapperRevenueShareResponse {
    const message = createBaseMsgSetMarketMapperRevenueShareResponse();
    return message;
  },
  toAmino(_: MsgSetMarketMapperRevenueShareResponse): MsgSetMarketMapperRevenueShareResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSetMarketMapperRevenueShareResponseAminoMsg): MsgSetMarketMapperRevenueShareResponse {
    return MsgSetMarketMapperRevenueShareResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetMarketMapperRevenueShareResponseProtoMsg): MsgSetMarketMapperRevenueShareResponse {
    return MsgSetMarketMapperRevenueShareResponse.decode(message.value);
  },
  toProto(message: MsgSetMarketMapperRevenueShareResponse): Uint8Array {
    return MsgSetMarketMapperRevenueShareResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSetMarketMapperRevenueShareResponse): MsgSetMarketMapperRevenueShareResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShareResponse",
      value: MsgSetMarketMapperRevenueShareResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSetMarketMapperRevShareDetailsForMarket(): MsgSetMarketMapperRevShareDetailsForMarket {
  return {
    authority: "",
    marketId: 0,
    params: MarketMapperRevShareDetails.fromPartial({})
  };
}
export const MsgSetMarketMapperRevShareDetailsForMarket = {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket",
  encode(message: MsgSetMarketMapperRevShareDetailsForMarket, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.marketId !== 0) {
      writer.uint32(16).uint32(message.marketId);
    }
    if (message.params !== undefined) {
      MarketMapperRevShareDetails.encode(message.params, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetMarketMapperRevShareDetailsForMarket {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.marketId = reader.uint32();
          break;
        case 3:
          message.params = MarketMapperRevShareDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetMarketMapperRevShareDetailsForMarket>): MsgSetMarketMapperRevShareDetailsForMarket {
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarket();
    message.authority = object.authority ?? "";
    message.marketId = object.marketId ?? 0;
    message.params = object.params !== undefined && object.params !== null ? MarketMapperRevShareDetails.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: MsgSetMarketMapperRevShareDetailsForMarketAmino): MsgSetMarketMapperRevShareDetailsForMarket {
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarket();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.market_id !== undefined && object.market_id !== null) {
      message.marketId = object.market_id;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = MarketMapperRevShareDetails.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: MsgSetMarketMapperRevShareDetailsForMarket): MsgSetMarketMapperRevShareDetailsForMarketAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.market_id = message.marketId === 0 ? undefined : message.marketId;
    obj.params = message.params ? MarketMapperRevShareDetails.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSetMarketMapperRevShareDetailsForMarketAminoMsg): MsgSetMarketMapperRevShareDetailsForMarket {
    return MsgSetMarketMapperRevShareDetailsForMarket.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetMarketMapperRevShareDetailsForMarketProtoMsg): MsgSetMarketMapperRevShareDetailsForMarket {
    return MsgSetMarketMapperRevShareDetailsForMarket.decode(message.value);
  },
  toProto(message: MsgSetMarketMapperRevShareDetailsForMarket): Uint8Array {
    return MsgSetMarketMapperRevShareDetailsForMarket.encode(message).finish();
  },
  toProtoMsg(message: MsgSetMarketMapperRevShareDetailsForMarket): MsgSetMarketMapperRevShareDetailsForMarketProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket",
      value: MsgSetMarketMapperRevShareDetailsForMarket.encode(message).finish()
    };
  }
};
function createBaseMsgSetMarketMapperRevShareDetailsForMarketResponse(): MsgSetMarketMapperRevShareDetailsForMarketResponse {
  return {};
}
export const MsgSetMarketMapperRevShareDetailsForMarketResponse = {
  typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarketResponse",
  encode(_: MsgSetMarketMapperRevShareDetailsForMarketResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetMarketMapperRevShareDetailsForMarketResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarketResponse();
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
  fromPartial(_: Partial<MsgSetMarketMapperRevShareDetailsForMarketResponse>): MsgSetMarketMapperRevShareDetailsForMarketResponse {
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarketResponse();
    return message;
  },
  fromAmino(_: MsgSetMarketMapperRevShareDetailsForMarketResponseAmino): MsgSetMarketMapperRevShareDetailsForMarketResponse {
    const message = createBaseMsgSetMarketMapperRevShareDetailsForMarketResponse();
    return message;
  },
  toAmino(_: MsgSetMarketMapperRevShareDetailsForMarketResponse): MsgSetMarketMapperRevShareDetailsForMarketResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSetMarketMapperRevShareDetailsForMarketResponseAminoMsg): MsgSetMarketMapperRevShareDetailsForMarketResponse {
    return MsgSetMarketMapperRevShareDetailsForMarketResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetMarketMapperRevShareDetailsForMarketResponseProtoMsg): MsgSetMarketMapperRevShareDetailsForMarketResponse {
    return MsgSetMarketMapperRevShareDetailsForMarketResponse.decode(message.value);
  },
  toProto(message: MsgSetMarketMapperRevShareDetailsForMarketResponse): Uint8Array {
    return MsgSetMarketMapperRevShareDetailsForMarketResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSetMarketMapperRevShareDetailsForMarketResponse): MsgSetMarketMapperRevShareDetailsForMarketResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarketResponse",
      value: MsgSetMarketMapperRevShareDetailsForMarketResponse.encode(message).finish()
    };
  }
};