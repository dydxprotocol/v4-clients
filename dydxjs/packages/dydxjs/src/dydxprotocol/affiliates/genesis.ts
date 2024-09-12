//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** GenesisState defines generis state of `x/affiliates` */
export interface GenesisState {}
export interface GenesisStateProtoMsg {
  typeUrl: "/dydxprotocol.affiliates.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines generis state of `x/affiliates` */
export interface GenesisStateAmino {}
export interface GenesisStateAminoMsg {
  type: "/dydxprotocol.affiliates.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines generis state of `x/affiliates` */
export interface GenesisStateSDKType {}
function createBaseGenesisState(): GenesisState {
  return {};
}
export const GenesisState = {
  typeUrl: "/dydxprotocol.affiliates.GenesisState",
  encode(_: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
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
  fromPartial(_: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    return message;
  },
  fromAmino(_: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    return message;
  },
  toAmino(_: GenesisState): GenesisStateAmino {
    const obj: any = {};
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
      typeUrl: "/dydxprotocol.affiliates.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};