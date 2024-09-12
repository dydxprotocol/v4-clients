//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** AffiliateTiers defines the affiliate tiers. */
export interface AffiliateTiers {
  /** All affiliate tiers */
  tiers: AffiliateTiers_Tier[];
}
export interface AffiliateTiersProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.AffiliateTiers";
  value: Uint8Array;
}
/** AffiliateTiers defines the affiliate tiers. */
export interface AffiliateTiersAmino {
  /** All affiliate tiers */
  tiers?: AffiliateTiers_TierAmino[];
}
export interface AffiliateTiersAminoMsg {
  type: "/dydxprotocol.affiliates.AffiliateTiers";
  value: AffiliateTiersAmino;
}
/** AffiliateTiers defines the affiliate tiers. */
export interface AffiliateTiersSDKType {
  tiers: AffiliateTiers_TierSDKType[];
}
/** Tier defines an affiliate tier. */
export interface AffiliateTiers_Tier {
  /** Level of the tier */
  level: number;
  /** Required all-time referred volume in quote quantums. */
  reqReferredVolume: bigint;
  /** Required currently staked native tokens (in whole coins). */
  reqStakedWholeCoins: number;
  /** Taker fee share in parts-per-million. */
  takerFeeSharePpm: number;
}
export interface AffiliateTiers_TierProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.Tier";
  value: Uint8Array;
}
/** Tier defines an affiliate tier. */
export interface AffiliateTiers_TierAmino {
  /** Level of the tier */
  level?: number;
  /** Required all-time referred volume in quote quantums. */
  req_referred_volume?: string;
  /** Required currently staked native tokens (in whole coins). */
  req_staked_whole_coins?: number;
  /** Taker fee share in parts-per-million. */
  taker_fee_share_ppm?: number;
}
export interface AffiliateTiers_TierAminoMsg {
  type: "/dydxprotocol.affiliates.Tier";
  value: AffiliateTiers_TierAmino;
}
/** Tier defines an affiliate tier. */
export interface AffiliateTiers_TierSDKType {
  level: number;
  req_referred_volume: bigint;
  req_staked_whole_coins: number;
  taker_fee_share_ppm: number;
}
function createBaseAffiliateTiers(): AffiliateTiers {
  return {
    tiers: []
  };
}
export const AffiliateTiers = {
  typeUrl: "/dydxprotocol.affiliates.AffiliateTiers",
  encode(message: AffiliateTiers, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.tiers) {
      AffiliateTiers_Tier.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AffiliateTiers {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAffiliateTiers();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tiers.push(AffiliateTiers_Tier.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AffiliateTiers>): AffiliateTiers {
    const message = createBaseAffiliateTiers();
    message.tiers = object.tiers?.map(e => AffiliateTiers_Tier.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: AffiliateTiersAmino): AffiliateTiers {
    const message = createBaseAffiliateTiers();
    message.tiers = object.tiers?.map(e => AffiliateTiers_Tier.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: AffiliateTiers): AffiliateTiersAmino {
    const obj: any = {};
    if (message.tiers) {
      obj.tiers = message.tiers.map(e => e ? AffiliateTiers_Tier.toAmino(e) : undefined);
    } else {
      obj.tiers = message.tiers;
    }
    return obj;
  },
  fromAminoMsg(object: AffiliateTiersAminoMsg): AffiliateTiers {
    return AffiliateTiers.fromAmino(object.value);
  },
  fromProtoMsg(message: AffiliateTiersProtoMsg): AffiliateTiers {
    return AffiliateTiers.decode(message.value);
  },
  toProto(message: AffiliateTiers): Uint8Array {
    return AffiliateTiers.encode(message).finish();
  },
  toProtoMsg(message: AffiliateTiers): AffiliateTiersProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.AffiliateTiers",
      value: AffiliateTiers.encode(message).finish()
    };
  }
};
function createBaseAffiliateTiers_Tier(): AffiliateTiers_Tier {
  return {
    level: 0,
    reqReferredVolume: BigInt(0),
    reqStakedWholeCoins: 0,
    takerFeeSharePpm: 0
  };
}
export const AffiliateTiers_Tier = {
  typeUrl: "/dydxprotocol.affiliates.Tier",
  encode(message: AffiliateTiers_Tier, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.level !== 0) {
      writer.uint32(8).uint32(message.level);
    }
    if (message.reqReferredVolume !== BigInt(0)) {
      writer.uint32(16).uint64(message.reqReferredVolume);
    }
    if (message.reqStakedWholeCoins !== 0) {
      writer.uint32(24).uint32(message.reqStakedWholeCoins);
    }
    if (message.takerFeeSharePpm !== 0) {
      writer.uint32(32).uint32(message.takerFeeSharePpm);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AffiliateTiers_Tier {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAffiliateTiers_Tier();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.level = reader.uint32();
          break;
        case 2:
          message.reqReferredVolume = reader.uint64();
          break;
        case 3:
          message.reqStakedWholeCoins = reader.uint32();
          break;
        case 4:
          message.takerFeeSharePpm = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AffiliateTiers_Tier>): AffiliateTiers_Tier {
    const message = createBaseAffiliateTiers_Tier();
    message.level = object.level ?? 0;
    message.reqReferredVolume = object.reqReferredVolume !== undefined && object.reqReferredVolume !== null ? BigInt(object.reqReferredVolume.toString()) : BigInt(0);
    message.reqStakedWholeCoins = object.reqStakedWholeCoins ?? 0;
    message.takerFeeSharePpm = object.takerFeeSharePpm ?? 0;
    return message;
  },
  fromAmino(object: AffiliateTiers_TierAmino): AffiliateTiers_Tier {
    const message = createBaseAffiliateTiers_Tier();
    if (object.level !== undefined && object.level !== null) {
      message.level = object.level;
    }
    if (object.req_referred_volume !== undefined && object.req_referred_volume !== null) {
      message.reqReferredVolume = BigInt(object.req_referred_volume);
    }
    if (object.req_staked_whole_coins !== undefined && object.req_staked_whole_coins !== null) {
      message.reqStakedWholeCoins = object.req_staked_whole_coins;
    }
    if (object.taker_fee_share_ppm !== undefined && object.taker_fee_share_ppm !== null) {
      message.takerFeeSharePpm = object.taker_fee_share_ppm;
    }
    return message;
  },
  toAmino(message: AffiliateTiers_Tier): AffiliateTiers_TierAmino {
    const obj: any = {};
    obj.level = message.level === 0 ? undefined : message.level;
    obj.req_referred_volume = message.reqReferredVolume !== BigInt(0) ? message.reqReferredVolume.toString() : undefined;
    obj.req_staked_whole_coins = message.reqStakedWholeCoins === 0 ? undefined : message.reqStakedWholeCoins;
    obj.taker_fee_share_ppm = message.takerFeeSharePpm === 0 ? undefined : message.takerFeeSharePpm;
    return obj;
  },
  fromAminoMsg(object: AffiliateTiers_TierAminoMsg): AffiliateTiers_Tier {
    return AffiliateTiers_Tier.fromAmino(object.value);
  },
  fromProtoMsg(message: AffiliateTiers_TierProtoMsg): AffiliateTiers_Tier {
    return AffiliateTiers_Tier.decode(message.value);
  },
  toProto(message: AffiliateTiers_Tier): Uint8Array {
    return AffiliateTiers_Tier.encode(message).finish();
  },
  toProtoMsg(message: AffiliateTiers_Tier): AffiliateTiers_TierProtoMsg {
    return {
      typeUrl: "/dydxprotocol.affiliates.Tier",
      value: AffiliateTiers_Tier.encode(message).finish()
    };
  }
};