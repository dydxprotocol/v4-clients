//@ts-nocheck
import { Limiter, LimiterAmino, LimiterSDKType } from "./limit_params";
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/** DenomCapacity stores a list of rate limit capacity for a denom. */
export interface DenomCapacity {
  /**
   * denom is the denomination of the token being rate limited.
   * e.g. ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5
   */
  denom: string;
  /**
   * capacity_list is a list of capacity amount tracked for each `Limiter`
   * on the denom. This list has a 1:1 mapping to `limiter` list under
   * `LimitParams`.
   */
  capacityList: Uint8Array[];
}
export interface DenomCapacityProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.DenomCapacity";
  value: Uint8Array;
}
/** DenomCapacity stores a list of rate limit capacity for a denom. */
export interface DenomCapacityAmino {
  /**
   * denom is the denomination of the token being rate limited.
   * e.g. ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5
   */
  denom?: string;
  /**
   * capacity_list is a list of capacity amount tracked for each `Limiter`
   * on the denom. This list has a 1:1 mapping to `limiter` list under
   * `LimitParams`.
   */
  capacity_list?: string[];
}
export interface DenomCapacityAminoMsg {
  type: "/dydxprotocol.ratelimit.DenomCapacity";
  value: DenomCapacityAmino;
}
/** DenomCapacity stores a list of rate limit capacity for a denom. */
export interface DenomCapacitySDKType {
  denom: string;
  capacity_list: Uint8Array[];
}
/** LimiterCapacity contains a pair of limiter and its corresponding capacity. */
export interface LimiterCapacity {
  limiter: Limiter;
  capacity: Uint8Array;
}
export interface LimiterCapacityProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.LimiterCapacity";
  value: Uint8Array;
}
/** LimiterCapacity contains a pair of limiter and its corresponding capacity. */
export interface LimiterCapacityAmino {
  limiter?: LimiterAmino;
  capacity?: string;
}
export interface LimiterCapacityAminoMsg {
  type: "/dydxprotocol.ratelimit.LimiterCapacity";
  value: LimiterCapacityAmino;
}
/** LimiterCapacity contains a pair of limiter and its corresponding capacity. */
export interface LimiterCapacitySDKType {
  limiter: LimiterSDKType;
  capacity: Uint8Array;
}
function createBaseDenomCapacity(): DenomCapacity {
  return {
    denom: "",
    capacityList: []
  };
}
export const DenomCapacity = {
  typeUrl: "/dydxprotocol.ratelimit.DenomCapacity",
  encode(message: DenomCapacity, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    for (const v of message.capacityList) {
      writer.uint32(18).bytes(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DenomCapacity {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomCapacity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.capacityList.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DenomCapacity>): DenomCapacity {
    const message = createBaseDenomCapacity();
    message.denom = object.denom ?? "";
    message.capacityList = object.capacityList?.map(e => e) || [];
    return message;
  },
  fromAmino(object: DenomCapacityAmino): DenomCapacity {
    const message = createBaseDenomCapacity();
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    message.capacityList = object.capacity_list?.map(e => bytesFromBase64(e)) || [];
    return message;
  },
  toAmino(message: DenomCapacity): DenomCapacityAmino {
    const obj: any = {};
    obj.denom = message.denom === "" ? undefined : message.denom;
    if (message.capacityList) {
      obj.capacity_list = message.capacityList.map(e => base64FromBytes(e));
    } else {
      obj.capacity_list = message.capacityList;
    }
    return obj;
  },
  fromAminoMsg(object: DenomCapacityAminoMsg): DenomCapacity {
    return DenomCapacity.fromAmino(object.value);
  },
  fromProtoMsg(message: DenomCapacityProtoMsg): DenomCapacity {
    return DenomCapacity.decode(message.value);
  },
  toProto(message: DenomCapacity): Uint8Array {
    return DenomCapacity.encode(message).finish();
  },
  toProtoMsg(message: DenomCapacity): DenomCapacityProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.DenomCapacity",
      value: DenomCapacity.encode(message).finish()
    };
  }
};
function createBaseLimiterCapacity(): LimiterCapacity {
  return {
    limiter: Limiter.fromPartial({}),
    capacity: new Uint8Array()
  };
}
export const LimiterCapacity = {
  typeUrl: "/dydxprotocol.ratelimit.LimiterCapacity",
  encode(message: LimiterCapacity, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.limiter !== undefined) {
      Limiter.encode(message.limiter, writer.uint32(10).fork()).ldelim();
    }
    if (message.capacity.length !== 0) {
      writer.uint32(18).bytes(message.capacity);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): LimiterCapacity {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLimiterCapacity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limiter = Limiter.decode(reader, reader.uint32());
          break;
        case 2:
          message.capacity = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<LimiterCapacity>): LimiterCapacity {
    const message = createBaseLimiterCapacity();
    message.limiter = object.limiter !== undefined && object.limiter !== null ? Limiter.fromPartial(object.limiter) : undefined;
    message.capacity = object.capacity ?? new Uint8Array();
    return message;
  },
  fromAmino(object: LimiterCapacityAmino): LimiterCapacity {
    const message = createBaseLimiterCapacity();
    if (object.limiter !== undefined && object.limiter !== null) {
      message.limiter = Limiter.fromAmino(object.limiter);
    }
    if (object.capacity !== undefined && object.capacity !== null) {
      message.capacity = bytesFromBase64(object.capacity);
    }
    return message;
  },
  toAmino(message: LimiterCapacity): LimiterCapacityAmino {
    const obj: any = {};
    obj.limiter = message.limiter ? Limiter.toAmino(message.limiter) : undefined;
    obj.capacity = message.capacity ? base64FromBytes(message.capacity) : undefined;
    return obj;
  },
  fromAminoMsg(object: LimiterCapacityAminoMsg): LimiterCapacity {
    return LimiterCapacity.fromAmino(object.value);
  },
  fromProtoMsg(message: LimiterCapacityProtoMsg): LimiterCapacity {
    return LimiterCapacity.decode(message.value);
  },
  toProto(message: LimiterCapacity): Uint8Array {
    return LimiterCapacity.encode(message).finish();
  },
  toProtoMsg(message: LimiterCapacity): LimiterCapacityProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.LimiterCapacity",
      value: LimiterCapacity.encode(message).finish()
    };
  }
};