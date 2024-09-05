import { BinaryReader, BinaryWriter } from "../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
export interface OracleVoteExtension_PricesEntry {
  key: bigint;
  value: Uint8Array;
}
export interface OracleVoteExtension_PricesEntryProtoMsg {
  typeUrl: string;
  value: Uint8Array;
}
export interface OracleVoteExtension_PricesEntryAmino {
  key?: string;
  value?: string;
}
export interface OracleVoteExtension_PricesEntryAminoMsg {
  type: string;
  value: OracleVoteExtension_PricesEntryAmino;
}
export interface OracleVoteExtension_PricesEntrySDKType {
  key: bigint;
  value: Uint8Array;
}
/** OracleVoteExtension defines the vote extension structure for oracle prices. */
export interface OracleVoteExtension {
  /**
   * Prices defines a map of id(CurrencyPair) -> price.Bytes() . i.e. 1 ->
   * 0x123.. (bytes). Notice the `id` function is determined by the
   * `CurrencyPairIDStrategy` used in the VoteExtensionHandler.
   */
  prices: {
    [key: bigint]: Uint8Array;
  };
}
export interface OracleVoteExtensionProtoMsg {
  typeUrl: "/slinky.abci.v1.OracleVoteExtension";
  value: Uint8Array;
}
/** OracleVoteExtension defines the vote extension structure for oracle prices. */
export interface OracleVoteExtensionAmino {
  /**
   * Prices defines a map of id(CurrencyPair) -> price.Bytes() . i.e. 1 ->
   * 0x123.. (bytes). Notice the `id` function is determined by the
   * `CurrencyPairIDStrategy` used in the VoteExtensionHandler.
   */
  prices?: {
    [key: string]: string;
  };
}
export interface OracleVoteExtensionAminoMsg {
  type: "/slinky.abci.v1.OracleVoteExtension";
  value: OracleVoteExtensionAmino;
}
/** OracleVoteExtension defines the vote extension structure for oracle prices. */
export interface OracleVoteExtensionSDKType {
  prices: {
    [key: bigint]: Uint8Array;
  };
}
function createBaseOracleVoteExtension_PricesEntry(): OracleVoteExtension_PricesEntry {
  return {
    key: BigInt(0),
    value: new Uint8Array()
  };
}
export const OracleVoteExtension_PricesEntry = {
  encode(message: OracleVoteExtension_PricesEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.key !== BigInt(0)) {
      writer.uint32(8).uint64(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): OracleVoteExtension_PricesEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOracleVoteExtension_PricesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.uint64();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<OracleVoteExtension_PricesEntry>): OracleVoteExtension_PricesEntry {
    const message = createBaseOracleVoteExtension_PricesEntry();
    message.key = object.key !== undefined && object.key !== null ? BigInt(object.key.toString()) : BigInt(0);
    message.value = object.value ?? new Uint8Array();
    return message;
  },
  fromAmino(object: OracleVoteExtension_PricesEntryAmino): OracleVoteExtension_PricesEntry {
    const message = createBaseOracleVoteExtension_PricesEntry();
    if (object.key !== undefined && object.key !== null) {
      message.key = BigInt(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = bytesFromBase64(object.value);
    }
    return message;
  },
  toAmino(message: OracleVoteExtension_PricesEntry): OracleVoteExtension_PricesEntryAmino {
    const obj: any = {};
    obj.key = message.key !== BigInt(0) ? message.key.toString() : undefined;
    obj.value = message.value ? base64FromBytes(message.value) : undefined;
    return obj;
  },
  fromAminoMsg(object: OracleVoteExtension_PricesEntryAminoMsg): OracleVoteExtension_PricesEntry {
    return OracleVoteExtension_PricesEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: OracleVoteExtension_PricesEntryProtoMsg): OracleVoteExtension_PricesEntry {
    return OracleVoteExtension_PricesEntry.decode(message.value);
  },
  toProto(message: OracleVoteExtension_PricesEntry): Uint8Array {
    return OracleVoteExtension_PricesEntry.encode(message).finish();
  }
};
function createBaseOracleVoteExtension(): OracleVoteExtension {
  return {
    prices: {}
  };
}
export const OracleVoteExtension = {
  typeUrl: "/slinky.abci.v1.OracleVoteExtension",
  encode(message: OracleVoteExtension, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    Object.entries(message.prices).forEach(([key, value]) => {
      OracleVoteExtension_PricesEntry.encode({
        key: key as any,
        value
      }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): OracleVoteExtension {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOracleVoteExtension();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = OracleVoteExtension_PricesEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.prices[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<OracleVoteExtension>): OracleVoteExtension {
    const message = createBaseOracleVoteExtension();
    message.prices = Object.entries(object.prices ?? {}).reduce<{
      [key: bigint]: bytes;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[Number(key)] = bytes.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
  fromAmino(object: OracleVoteExtensionAmino): OracleVoteExtension {
    const message = createBaseOracleVoteExtension();
    message.prices = Object.entries(object.prices ?? {}).reduce<{
      [key: bigint]: bytes;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[Number(key)] = bytes.fromAmino(value);
      }
      return acc;
    }, {});
    return message;
  },
  toAmino(message: OracleVoteExtension): OracleVoteExtensionAmino {
    const obj: any = {};
    obj.prices = {};
    if (message.prices) {
      Object.entries(message.prices).forEach(([k, v]) => {
        obj.prices[k] = bytes.toAmino(v);
      });
    }
    return obj;
  },
  fromAminoMsg(object: OracleVoteExtensionAminoMsg): OracleVoteExtension {
    return OracleVoteExtension.fromAmino(object.value);
  },
  fromProtoMsg(message: OracleVoteExtensionProtoMsg): OracleVoteExtension {
    return OracleVoteExtension.decode(message.value);
  },
  toProto(message: OracleVoteExtension): Uint8Array {
    return OracleVoteExtension.encode(message).finish();
  },
  toProtoMsg(message: OracleVoteExtension): OracleVoteExtensionProtoMsg {
    return {
      typeUrl: "/slinky.abci.v1.OracleVoteExtension",
      value: OracleVoteExtension.encode(message).finish()
    };
  }
};