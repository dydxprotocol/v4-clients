//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** GenesisState defines `x/listing`'s genesis state. */
export interface GenesisState {
  /**
   * hard_cap_for_markets is the hard cap for the number of markets that can be
   * listed
   */
  hardCapForMarkets: number;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/dydxprotocol.listing.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines `x/listing`'s genesis state. */
export interface GenesisStateAmino {
  /**
   * hard_cap_for_markets is the hard cap for the number of markets that can be
   * listed
   */
  hard_cap_for_markets?: number;
}
export interface GenesisStateAminoMsg {
  type: "/dydxprotocol.listing.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines `x/listing`'s genesis state. */
export interface GenesisStateSDKType {
  hard_cap_for_markets: number;
}
function createBaseGenesisState(): GenesisState {
  return {
    hardCapForMarkets: 0
  };
}
export const GenesisState = {
  typeUrl: "/dydxprotocol.listing.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.hardCapForMarkets !== 0) {
      writer.uint32(8).uint32(message.hardCapForMarkets);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hardCapForMarkets = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.hardCapForMarkets = object.hardCapForMarkets ?? 0;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.hard_cap_for_markets !== undefined && object.hard_cap_for_markets !== null) {
      message.hardCapForMarkets = object.hard_cap_for_markets;
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.hard_cap_for_markets = message.hardCapForMarkets === 0 ? undefined : message.hardCapForMarkets;
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};