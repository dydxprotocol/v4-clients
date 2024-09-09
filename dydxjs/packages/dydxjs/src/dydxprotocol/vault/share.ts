//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/** NumShares represents the number of shares. */
export interface NumShares {
  /** Number of shares. */
  numShares: Uint8Array;
}
export interface NumSharesProtoMsg {
  typeUrl: "/dydxprotocol.vault.NumShares";
  value: Uint8Array;
}
/** NumShares represents the number of shares. */
export interface NumSharesAmino {
  /** Number of shares. */
  num_shares?: string;
}
export interface NumSharesAminoMsg {
  type: "/dydxprotocol.vault.NumShares";
  value: NumSharesAmino;
}
/** NumShares represents the number of shares. */
export interface NumSharesSDKType {
  num_shares: Uint8Array;
}
/** OwnerShare is a type for owner shares. */
export interface OwnerShare {
  owner: string;
  shares: NumShares;
}
export interface OwnerShareProtoMsg {
  typeUrl: "/dydxprotocol.vault.OwnerShare";
  value: Uint8Array;
}
/** OwnerShare is a type for owner shares. */
export interface OwnerShareAmino {
  owner?: string;
  shares?: NumSharesAmino;
}
export interface OwnerShareAminoMsg {
  type: "/dydxprotocol.vault.OwnerShare";
  value: OwnerShareAmino;
}
/** OwnerShare is a type for owner shares. */
export interface OwnerShareSDKType {
  owner: string;
  shares: NumSharesSDKType;
}
function createBaseNumShares(): NumShares {
  return {
    numShares: new Uint8Array()
  };
}
export const NumShares = {
  typeUrl: "/dydxprotocol.vault.NumShares",
  encode(message: NumShares, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.numShares.length !== 0) {
      writer.uint32(18).bytes(message.numShares);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): NumShares {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNumShares();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.numShares = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<NumShares>): NumShares {
    const message = createBaseNumShares();
    message.numShares = object.numShares ?? new Uint8Array();
    return message;
  },
  fromAmino(object: NumSharesAmino): NumShares {
    const message = createBaseNumShares();
    if (object.num_shares !== undefined && object.num_shares !== null) {
      message.numShares = bytesFromBase64(object.num_shares);
    }
    return message;
  },
  toAmino(message: NumShares): NumSharesAmino {
    const obj: any = {};
    obj.num_shares = message.numShares ? base64FromBytes(message.numShares) : undefined;
    return obj;
  },
  fromAminoMsg(object: NumSharesAminoMsg): NumShares {
    return NumShares.fromAmino(object.value);
  },
  fromProtoMsg(message: NumSharesProtoMsg): NumShares {
    return NumShares.decode(message.value);
  },
  toProto(message: NumShares): Uint8Array {
    return NumShares.encode(message).finish();
  },
  toProtoMsg(message: NumShares): NumSharesProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.NumShares",
      value: NumShares.encode(message).finish()
    };
  }
};
function createBaseOwnerShare(): OwnerShare {
  return {
    owner: "",
    shares: NumShares.fromPartial({})
  };
}
export const OwnerShare = {
  typeUrl: "/dydxprotocol.vault.OwnerShare",
  encode(message: OwnerShare, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.owner !== "") {
      writer.uint32(10).string(message.owner);
    }
    if (message.shares !== undefined) {
      NumShares.encode(message.shares, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): OwnerShare {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOwnerShare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = reader.string();
          break;
        case 2:
          message.shares = NumShares.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<OwnerShare>): OwnerShare {
    const message = createBaseOwnerShare();
    message.owner = object.owner ?? "";
    message.shares = object.shares !== undefined && object.shares !== null ? NumShares.fromPartial(object.shares) : undefined;
    return message;
  },
  fromAmino(object: OwnerShareAmino): OwnerShare {
    const message = createBaseOwnerShare();
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    }
    if (object.shares !== undefined && object.shares !== null) {
      message.shares = NumShares.fromAmino(object.shares);
    }
    return message;
  },
  toAmino(message: OwnerShare): OwnerShareAmino {
    const obj: any = {};
    obj.owner = message.owner === "" ? undefined : message.owner;
    obj.shares = message.shares ? NumShares.toAmino(message.shares) : undefined;
    return obj;
  },
  fromAminoMsg(object: OwnerShareAminoMsg): OwnerShare {
    return OwnerShare.fromAmino(object.value);
  },
  fromProtoMsg(message: OwnerShareProtoMsg): OwnerShare {
    return OwnerShare.decode(message.value);
  },
  toProto(message: OwnerShare): Uint8Array {
    return OwnerShare.encode(message).finish();
  },
  toProtoMsg(message: OwnerShare): OwnerShareProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.OwnerShare",
      value: OwnerShare.encode(message).finish()
    };
  }
};