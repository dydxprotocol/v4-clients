//@ts-nocheck
import { AffiliateTiers, AffiliateTiersAmino, AffiliateTiersSDKType } from "./affiliates";
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/**
 * AffiliateInfoRequest is the request type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoRequest {
  address: string;
}
export interface AffiliateInfoRequestProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.AffiliateInfoRequest";
  value: Uint8Array;
}
/**
 * AffiliateInfoRequest is the request type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoRequestAmino {
  address?: string;
}
export interface AffiliateInfoRequestAminoMsg {
  type: "/dydxprotocol.affiliates.AffiliateInfoRequest";
  value: AffiliateInfoRequestAmino;
}
/**
 * AffiliateInfoRequest is the request type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoRequestSDKType {
  address: string;
}
/**
 * AffiliateInfoResponse is the response type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoResponse {
  /** The affiliate's tier. */
  tier: number;
  /** The affiliate's taker fee share in parts-per-million. */
  feeSharePpm: number;
  /** The affiliate's all-time referred volume in quote quantums. */
  referredVolume: Uint8Array;
  /** The affiliate's currently staked native tokens (in whole coins). */
  stakedAmount: Uint8Array;
}
export interface AffiliateInfoResponseProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.AffiliateInfoResponse";
  value: Uint8Array;
}
/**
 * AffiliateInfoResponse is the response type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoResponseAmino {
  /** The affiliate's tier. */
  tier?: number;
  /** The affiliate's taker fee share in parts-per-million. */
  fee_share_ppm?: number;
  /** The affiliate's all-time referred volume in quote quantums. */
  referred_volume?: string;
  /** The affiliate's currently staked native tokens (in whole coins). */
  staked_amount?: string;
}
export interface AffiliateInfoResponseAminoMsg {
  type: "/dydxprotocol.affiliates.AffiliateInfoResponse";
  value: AffiliateInfoResponseAmino;
}
/**
 * AffiliateInfoResponse is the response type for the Query/AffiliateInfo RPC
 * method.
 */
export interface AffiliateInfoResponseSDKType {
  tier: number;
  fee_share_ppm: number;
  referred_volume: Uint8Array;
  staked_amount: Uint8Array;
}
/** ReferredByRequest is the request type for the Query/ReferredBy RPC method. */
export interface ReferredByRequest {
  /** The address to query. */
  address: string;
}
export interface ReferredByRequestProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.ReferredByRequest";
  value: Uint8Array;
}
/** ReferredByRequest is the request type for the Query/ReferredBy RPC method. */
export interface ReferredByRequestAmino {
  /** The address to query. */
  address?: string;
}
export interface ReferredByRequestAminoMsg {
  type: "/dydxprotocol.affiliates.ReferredByRequest";
  value: ReferredByRequestAmino;
}
/** ReferredByRequest is the request type for the Query/ReferredBy RPC method. */
export interface ReferredByRequestSDKType {
  address: string;
}
/** ReferredByResponse is the response type for the Query/ReferredBy RPC method. */
export interface ReferredByResponse {
  /** The affiliate's address that referred the queried address. */
  affiliateAddress: string;
}
export interface ReferredByResponseProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.ReferredByResponse";
  value: Uint8Array;
}
/** ReferredByResponse is the response type for the Query/ReferredBy RPC method. */
export interface ReferredByResponseAmino {
  /** The affiliate's address that referred the queried address. */
  affiliate_address?: string;
}
export interface ReferredByResponseAminoMsg {
  type: "/dydxprotocol.affiliates.ReferredByResponse";
  value: ReferredByResponseAmino;
}
/** ReferredByResponse is the response type for the Query/ReferredBy RPC method. */
export interface ReferredByResponseSDKType {
  affiliate_address: string;
}
/**
 * AllAffiliateTiersRequest is the request type for the Query/AllAffiliateTiers
 * RPC method.
 */
export interface AllAffiliateTiersRequest {}
export interface AllAffiliateTiersRequestProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersRequest";
  value: Uint8Array;
}
/**
 * AllAffiliateTiersRequest is the request type for the Query/AllAffiliateTiers
 * RPC method.
 */
export interface AllAffiliateTiersRequestAmino {}
export interface AllAffiliateTiersRequestAminoMsg {
  type: "/dydxprotocol.affiliates.AllAffiliateTiersRequest";
  value: AllAffiliateTiersRequestAmino;
}
/**
 * AllAffiliateTiersRequest is the request type for the Query/AllAffiliateTiers
 * RPC method.
 */
export interface AllAffiliateTiersRequestSDKType {}
/**
 * AllAffiliateTiersResponse is the response type for the
 * Query/AllAffiliateTiers RPC method.
 */
export interface AllAffiliateTiersResponse {
  /** All affiliate tiers information. */
  tiers: AffiliateTiers;
}
export interface AllAffiliateTiersResponseProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersResponse";
  value: Uint8Array;
}
/**
 * AllAffiliateTiersResponse is the response type for the
 * Query/AllAffiliateTiers RPC method.
 */
export interface AllAffiliateTiersResponseAmino {
  /** All affiliate tiers information. */
  tiers?: AffiliateTiersAmino;
}
export interface AllAffiliateTiersResponseAminoMsg {
  type: "/dydxprotocol.affiliates.AllAffiliateTiersResponse";
  value: AllAffiliateTiersResponseAmino;
}
/**
 * AllAffiliateTiersResponse is the response type for the
 * Query/AllAffiliateTiers RPC method.
 */
export interface AllAffiliateTiersResponseSDKType {
  tiers: AffiliateTiersSDKType;
}
function createBaseAffiliateInfoRequest(): AffiliateInfoRequest {
  return {
    address: ""
  };
}
export const AffiliateInfoRequest = {
  typeUrl: "/dydxprotocol.affiliates.AffiliateInfoRequest",
  encode(message: AffiliateInfoRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AffiliateInfoRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAffiliateInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AffiliateInfoRequest>): AffiliateInfoRequest {
    const message = createBaseAffiliateInfoRequest();
    message.address = object.address ?? "";
    return message;
  },
  fromAmino(object: AffiliateInfoRequestAmino): AffiliateInfoRequest {
    const message = createBaseAffiliateInfoRequest();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    return message;
  },
  toAmino(message: AffiliateInfoRequest): AffiliateInfoRequestAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    return obj;
  },
  fromAminoMsg(object: AffiliateInfoRequestAminoMsg): AffiliateInfoRequest {
    return AffiliateInfoRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: AffiliateInfoRequestProtoMsg): AffiliateInfoRequest {
    return AffiliateInfoRequest.decode(message.value);
  },
  toProto(message: AffiliateInfoRequest): Uint8Array {
    return AffiliateInfoRequest.encode(message).finish();
  },
  toProtoMsg(message: AffiliateInfoRequest): AffiliateInfoRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.AffiliateInfoRequest",
      value: AffiliateInfoRequest.encode(message).finish()
    };
  }
};
function createBaseAffiliateInfoResponse(): AffiliateInfoResponse {
  return {
    tier: 0,
    feeSharePpm: 0,
    referredVolume: new Uint8Array(),
    stakedAmount: new Uint8Array()
  };
}
export const AffiliateInfoResponse = {
  typeUrl: "/dydxprotocol.affiliates.AffiliateInfoResponse",
  encode(message: AffiliateInfoResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tier !== 0) {
      writer.uint32(8).uint32(message.tier);
    }
    if (message.feeSharePpm !== 0) {
      writer.uint32(16).uint32(message.feeSharePpm);
    }
    if (message.referredVolume.length !== 0) {
      writer.uint32(26).bytes(message.referredVolume);
    }
    if (message.stakedAmount.length !== 0) {
      writer.uint32(34).bytes(message.stakedAmount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AffiliateInfoResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAffiliateInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tier = reader.uint32();
          break;
        case 2:
          message.feeSharePpm = reader.uint32();
          break;
        case 3:
          message.referredVolume = reader.bytes();
          break;
        case 4:
          message.stakedAmount = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AffiliateInfoResponse>): AffiliateInfoResponse {
    const message = createBaseAffiliateInfoResponse();
    message.tier = object.tier ?? 0;
    message.feeSharePpm = object.feeSharePpm ?? 0;
    message.referredVolume = object.referredVolume ?? new Uint8Array();
    message.stakedAmount = object.stakedAmount ?? new Uint8Array();
    return message;
  },
  fromAmino(object: AffiliateInfoResponseAmino): AffiliateInfoResponse {
    const message = createBaseAffiliateInfoResponse();
    if (object.tier !== undefined && object.tier !== null) {
      message.tier = object.tier;
    }
    if (object.fee_share_ppm !== undefined && object.fee_share_ppm !== null) {
      message.feeSharePpm = object.fee_share_ppm;
    }
    if (object.referred_volume !== undefined && object.referred_volume !== null) {
      message.referredVolume = bytesFromBase64(object.referred_volume);
    }
    if (object.staked_amount !== undefined && object.staked_amount !== null) {
      message.stakedAmount = bytesFromBase64(object.staked_amount);
    }
    return message;
  },
  toAmino(message: AffiliateInfoResponse): AffiliateInfoResponseAmino {
    const obj: any = {};
    obj.tier = message.tier === 0 ? undefined : message.tier;
    obj.fee_share_ppm = message.feeSharePpm === 0 ? undefined : message.feeSharePpm;
    obj.referred_volume = message.referredVolume ? base64FromBytes(message.referredVolume) : undefined;
    obj.staked_amount = message.stakedAmount ? base64FromBytes(message.stakedAmount) : undefined;
    return obj;
  },
  fromAminoMsg(object: AffiliateInfoResponseAminoMsg): AffiliateInfoResponse {
    return AffiliateInfoResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: AffiliateInfoResponseProtoMsg): AffiliateInfoResponse {
    return AffiliateInfoResponse.decode(message.value);
  },
  toProto(message: AffiliateInfoResponse): Uint8Array {
    return AffiliateInfoResponse.encode(message).finish();
  },
  toProtoMsg(message: AffiliateInfoResponse): AffiliateInfoResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.AffiliateInfoResponse",
      value: AffiliateInfoResponse.encode(message).finish()
    };
  }
};
function createBaseReferredByRequest(): ReferredByRequest {
  return {
    address: ""
  };
}
export const ReferredByRequest = {
  typeUrl: "/dydxprotocol.affiliates.ReferredByRequest",
  encode(message: ReferredByRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ReferredByRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReferredByRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ReferredByRequest>): ReferredByRequest {
    const message = createBaseReferredByRequest();
    message.address = object.address ?? "";
    return message;
  },
  fromAmino(object: ReferredByRequestAmino): ReferredByRequest {
    const message = createBaseReferredByRequest();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    return message;
  },
  toAmino(message: ReferredByRequest): ReferredByRequestAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    return obj;
  },
  fromAminoMsg(object: ReferredByRequestAminoMsg): ReferredByRequest {
    return ReferredByRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: ReferredByRequestProtoMsg): ReferredByRequest {
    return ReferredByRequest.decode(message.value);
  },
  toProto(message: ReferredByRequest): Uint8Array {
    return ReferredByRequest.encode(message).finish();
  },
  toProtoMsg(message: ReferredByRequest): ReferredByRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.ReferredByRequest",
      value: ReferredByRequest.encode(message).finish()
    };
  }
};
function createBaseReferredByResponse(): ReferredByResponse {
  return {
    affiliateAddress: ""
  };
}
export const ReferredByResponse = {
  typeUrl: "/dydxprotocol.affiliates.ReferredByResponse",
  encode(message: ReferredByResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.affiliateAddress !== "") {
      writer.uint32(10).string(message.affiliateAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ReferredByResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReferredByResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.affiliateAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ReferredByResponse>): ReferredByResponse {
    const message = createBaseReferredByResponse();
    message.affiliateAddress = object.affiliateAddress ?? "";
    return message;
  },
  fromAmino(object: ReferredByResponseAmino): ReferredByResponse {
    const message = createBaseReferredByResponse();
    if (object.affiliate_address !== undefined && object.affiliate_address !== null) {
      message.affiliateAddress = object.affiliate_address;
    }
    return message;
  },
  toAmino(message: ReferredByResponse): ReferredByResponseAmino {
    const obj: any = {};
    obj.affiliate_address = message.affiliateAddress === "" ? undefined : message.affiliateAddress;
    return obj;
  },
  fromAminoMsg(object: ReferredByResponseAminoMsg): ReferredByResponse {
    return ReferredByResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: ReferredByResponseProtoMsg): ReferredByResponse {
    return ReferredByResponse.decode(message.value);
  },
  toProto(message: ReferredByResponse): Uint8Array {
    return ReferredByResponse.encode(message).finish();
  },
  toProtoMsg(message: ReferredByResponse): ReferredByResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.ReferredByResponse",
      value: ReferredByResponse.encode(message).finish()
    };
  }
};
function createBaseAllAffiliateTiersRequest(): AllAffiliateTiersRequest {
  return {};
}
export const AllAffiliateTiersRequest = {
  typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersRequest",
  encode(_: AllAffiliateTiersRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AllAffiliateTiersRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllAffiliateTiersRequest();
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
  fromPartial(_: Partial<AllAffiliateTiersRequest>): AllAffiliateTiersRequest {
    const message = createBaseAllAffiliateTiersRequest();
    return message;
  },
  fromAmino(_: AllAffiliateTiersRequestAmino): AllAffiliateTiersRequest {
    const message = createBaseAllAffiliateTiersRequest();
    return message;
  },
  toAmino(_: AllAffiliateTiersRequest): AllAffiliateTiersRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: AllAffiliateTiersRequestAminoMsg): AllAffiliateTiersRequest {
    return AllAffiliateTiersRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: AllAffiliateTiersRequestProtoMsg): AllAffiliateTiersRequest {
    return AllAffiliateTiersRequest.decode(message.value);
  },
  toProto(message: AllAffiliateTiersRequest): Uint8Array {
    return AllAffiliateTiersRequest.encode(message).finish();
  },
  toProtoMsg(message: AllAffiliateTiersRequest): AllAffiliateTiersRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersRequest",
      value: AllAffiliateTiersRequest.encode(message).finish()
    };
  }
};
function createBaseAllAffiliateTiersResponse(): AllAffiliateTiersResponse {
  return {
    tiers: AffiliateTiers.fromPartial({})
  };
}
export const AllAffiliateTiersResponse = {
  typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersResponse",
  encode(message: AllAffiliateTiersResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.tiers !== undefined) {
      AffiliateTiers.encode(message.tiers, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AllAffiliateTiersResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllAffiliateTiersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tiers = AffiliateTiers.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AllAffiliateTiersResponse>): AllAffiliateTiersResponse {
    const message = createBaseAllAffiliateTiersResponse();
    message.tiers = object.tiers !== undefined && object.tiers !== null ? AffiliateTiers.fromPartial(object.tiers) : undefined;
    return message;
  },
  fromAmino(object: AllAffiliateTiersResponseAmino): AllAffiliateTiersResponse {
    const message = createBaseAllAffiliateTiersResponse();
    if (object.tiers !== undefined && object.tiers !== null) {
      message.tiers = AffiliateTiers.fromAmino(object.tiers);
    }
    return message;
  },
  toAmino(message: AllAffiliateTiersResponse): AllAffiliateTiersResponseAmino {
    const obj: any = {};
    obj.tiers = message.tiers ? AffiliateTiers.toAmino(message.tiers) : undefined;
    return obj;
  },
  fromAminoMsg(object: AllAffiliateTiersResponseAminoMsg): AllAffiliateTiersResponse {
    return AllAffiliateTiersResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: AllAffiliateTiersResponseProtoMsg): AllAffiliateTiersResponse {
    return AllAffiliateTiersResponse.decode(message.value);
  },
  toProto(message: AllAffiliateTiersResponse): Uint8Array {
    return AllAffiliateTiersResponse.encode(message).finish();
  },
  toProtoMsg(message: AllAffiliateTiersResponse): AllAffiliateTiersResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.AllAffiliateTiersResponse",
      value: AllAffiliateTiersResponse.encode(message).finish()
    };
  }
};