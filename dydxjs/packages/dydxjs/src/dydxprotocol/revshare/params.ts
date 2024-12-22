//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** MarketMappeRevenueShareParams represents params for the above message */
export interface MarketMapperRevenueShareParams {
  /** The address which will receive the revenue share payouts */
  address: string;
  /**
   * The fraction of the fees which will go to the above mentioned address.
   * In parts-per-million
   */
  revenueSharePpm: number;
  /**
   * This parameter defines how many days post market initiation will the
   * revenue share be applied for. After valid_days from market initiation
   * the revenue share goes down to 0
   */
  validDays: number;
}
export interface MarketMapperRevenueShareParamsProtoMsg {
  typeUrl: "/dydxprotocol.revshare.MarketMapperRevenueShareParams";
  value: Uint8Array;
}
/** MarketMappeRevenueShareParams represents params for the above message */
export interface MarketMapperRevenueShareParamsAmino {
  /** The address which will receive the revenue share payouts */
  address?: string;
  /**
   * The fraction of the fees which will go to the above mentioned address.
   * In parts-per-million
   */
  revenue_share_ppm?: number;
  /**
   * This parameter defines how many days post market initiation will the
   * revenue share be applied for. After valid_days from market initiation
   * the revenue share goes down to 0
   */
  valid_days?: number;
}
export interface MarketMapperRevenueShareParamsAminoMsg {
  type: "/dydxprotocol.revshare.MarketMapperRevenueShareParams";
  value: MarketMapperRevenueShareParamsAmino;
}
/** MarketMappeRevenueShareParams represents params for the above message */
export interface MarketMapperRevenueShareParamsSDKType {
  address: string;
  revenue_share_ppm: number;
  valid_days: number;
}
function createBaseMarketMapperRevenueShareParams(): MarketMapperRevenueShareParams {
  return {
    address: "",
    revenueSharePpm: 0,
    validDays: 0
  };
}
export const MarketMapperRevenueShareParams = {
  typeUrl: "/dydxprotocol.revshare.MarketMapperRevenueShareParams",
  encode(message: MarketMapperRevenueShareParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.revenueSharePpm !== 0) {
      writer.uint32(16).uint32(message.revenueSharePpm);
    }
    if (message.validDays !== 0) {
      writer.uint32(24).uint32(message.validDays);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MarketMapperRevenueShareParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarketMapperRevenueShareParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.revenueSharePpm = reader.uint32();
          break;
        case 3:
          message.validDays = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MarketMapperRevenueShareParams>): MarketMapperRevenueShareParams {
    const message = createBaseMarketMapperRevenueShareParams();
    message.address = object.address ?? "";
    message.revenueSharePpm = object.revenueSharePpm ?? 0;
    message.validDays = object.validDays ?? 0;
    return message;
  },
  fromAmino(object: MarketMapperRevenueShareParamsAmino): MarketMapperRevenueShareParams {
    const message = createBaseMarketMapperRevenueShareParams();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.revenue_share_ppm !== undefined && object.revenue_share_ppm !== null) {
      message.revenueSharePpm = object.revenue_share_ppm;
    }
    if (object.valid_days !== undefined && object.valid_days !== null) {
      message.validDays = object.valid_days;
    }
    return message;
  },
  toAmino(message: MarketMapperRevenueShareParams): MarketMapperRevenueShareParamsAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    obj.revenue_share_ppm = message.revenueSharePpm === 0 ? undefined : message.revenueSharePpm;
    obj.valid_days = message.validDays === 0 ? undefined : message.validDays;
    return obj;
  },
  fromAminoMsg(object: MarketMapperRevenueShareParamsAminoMsg): MarketMapperRevenueShareParams {
    return MarketMapperRevenueShareParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MarketMapperRevenueShareParamsProtoMsg): MarketMapperRevenueShareParams {
    return MarketMapperRevenueShareParams.decode(message.value);
  },
  toProto(message: MarketMapperRevenueShareParams): Uint8Array {
    return MarketMapperRevenueShareParams.encode(message).finish();
  },
  toProtoMsg(message: MarketMapperRevenueShareParams): MarketMapperRevenueShareParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.MarketMapperRevenueShareParams",
      value: MarketMapperRevenueShareParams.encode(message).finish()
    };
  }
};