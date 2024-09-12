//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/**
 * PendingSendPacket contains the channel_id and sequence pair to identify a
 * pending packet
 */
export interface PendingSendPacket {
  channelId: string;
  sequence: bigint;
}
export interface PendingSendPacketProtoMsg {
  typeUrl: "/dydxprotocol.ratelimit.PendingSendPacket";
  value: Uint8Array;
}
/**
 * PendingSendPacket contains the channel_id and sequence pair to identify a
 * pending packet
 */
export interface PendingSendPacketAmino {
  channel_id?: string;
  sequence?: string;
}
export interface PendingSendPacketAminoMsg {
  type: "/dydxprotocol.ratelimit.PendingSendPacket";
  value: PendingSendPacketAmino;
}
/**
 * PendingSendPacket contains the channel_id and sequence pair to identify a
 * pending packet
 */
export interface PendingSendPacketSDKType {
  channel_id: string;
  sequence: bigint;
}
function createBasePendingSendPacket(): PendingSendPacket {
  return {
    channelId: "",
    sequence: BigInt(0)
  };
}
export const PendingSendPacket = {
  typeUrl: "/dydxprotocol.ratelimit.PendingSendPacket",
  encode(message: PendingSendPacket, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.channelId !== "") {
      writer.uint32(10).string(message.channelId);
    }
    if (message.sequence !== BigInt(0)) {
      writer.uint32(16).uint64(message.sequence);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PendingSendPacket {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePendingSendPacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.string();
          break;
        case 2:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PendingSendPacket>): PendingSendPacket {
    const message = createBasePendingSendPacket();
    message.channelId = object.channelId ?? "";
    message.sequence = object.sequence !== undefined && object.sequence !== null ? BigInt(object.sequence.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: PendingSendPacketAmino): PendingSendPacket {
    const message = createBasePendingSendPacket();
    if (object.channel_id !== undefined && object.channel_id !== null) {
      message.channelId = object.channel_id;
    }
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = BigInt(object.sequence);
    }
    return message;
  },
  toAmino(message: PendingSendPacket): PendingSendPacketAmino {
    const obj: any = {};
    obj.channel_id = message.channelId === "" ? undefined : message.channelId;
    obj.sequence = message.sequence !== BigInt(0) ? message.sequence.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: PendingSendPacketAminoMsg): PendingSendPacket {
    return PendingSendPacket.fromAmino(object.value);
  },
  fromProtoMsg(message: PendingSendPacketProtoMsg): PendingSendPacket {
    return PendingSendPacket.decode(message.value);
  },
  toProto(message: PendingSendPacket): Uint8Array {
    return PendingSendPacket.encode(message).finish();
  },
  toProtoMsg(message: PendingSendPacket): PendingSendPacketProtoMsg {
    return {
      typeUrl: "/dydxprotocol.ratelimit.PendingSendPacket",
      value: PendingSendPacket.encode(message).finish()
    };
  }
};