//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/**
 * MarketMapperRevShareDetails specifies any details associated with the market
 * mapper revenue share
 */
export interface MarketMapperRevShareDetails {
  /** Unix timestamp recorded when the market revenue share expires */
  expirationTs: bigint;
}
export interface MarketMapperRevShareDetailsProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MarketMapperRevShareDetails";
  value: Uint8Array;
}
/**
 * MarketMapperRevShareDetails specifies any details associated with the market
 * mapper revenue share
 */
export interface MarketMapperRevShareDetailsAmino {
  /** Unix timestamp recorded when the market revenue share expires */
  expiration_ts?: string;
}
export interface MarketMapperRevShareDetailsAminoMsg {
  type: "/dydxprotocol.revshare.MarketMapperRevShareDetails";
  value: MarketMapperRevShareDetailsAmino;
}
/**
 * MarketMapperRevShareDetails specifies any details associated with the market
 * mapper revenue share
 */
export interface MarketMapperRevShareDetailsSDKType {
  expiration_ts: bigint;
}
function createBaseMarketMapperRevShareDetails(): MarketMapperRevShareDetails {
  return {
    expirationTs: BigInt(0)
  };
}
export const MarketMapperRevShareDetails = {
  typeUrl: "/dydxprotocol.revshare.MarketMapperRevShareDetails",
  encode(message: MarketMapperRevShareDetails, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.expirationTs !== BigInt(0)) {
      writer.uint32(8).uint64(message.expirationTs);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MarketMapperRevShareDetails {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarketMapperRevShareDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.expirationTs = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MarketMapperRevShareDetails>): MarketMapperRevShareDetails {
    const message = createBaseMarketMapperRevShareDetails();
    message.expirationTs = object.expirationTs !== undefined && object.expirationTs !== null ? BigInt(object.expirationTs.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MarketMapperRevShareDetailsAmino): MarketMapperRevShareDetails {
    const message = createBaseMarketMapperRevShareDetails();
    if (object.expiration_ts !== undefined && object.expiration_ts !== null) {
      message.expirationTs = BigInt(object.expiration_ts);
    }
    return message;
  },
  toAmino(message: MarketMapperRevShareDetails): MarketMapperRevShareDetailsAmino {
    const obj: any = {};
    obj.expiration_ts = message.expirationTs !== BigInt(0) ? message.expirationTs.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MarketMapperRevShareDetailsAminoMsg): MarketMapperRevShareDetails {
    return MarketMapperRevShareDetails.fromAmino(object.value);
  },
  fromProtoMsg(message: MarketMapperRevShareDetailsProtoMsg): MarketMapperRevShareDetails {
    return MarketMapperRevShareDetails.decode(message.value);
  },
  toProto(message: MarketMapperRevShareDetails): Uint8Array {
    return MarketMapperRevShareDetails.encode(message).finish();
  },
  toProtoMsg(message: MarketMapperRevShareDetails): MarketMapperRevShareDetailsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MarketMapperRevShareDetails",
      value: MarketMapperRevShareDetails.encode(message).finish()
    };
  }
};