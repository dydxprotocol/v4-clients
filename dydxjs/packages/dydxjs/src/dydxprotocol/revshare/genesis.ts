//@ts-nocheck
import { MarketMapperRevenueShareParams, MarketMapperRevenueShareParamsAmino, MarketMapperRevenueShareParamsSDKType } from "./params";
import { BinaryReader, BinaryWriter } from "../../binary";
/** GenesisState defines `x/revshare`'s genesis state. */
export interface GenesisState {
  params: MarketMapperRevenueShareParams;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/dydxprotocol.revshare.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines `x/revshare`'s genesis state. */
export interface GenesisStateAmino {
  params?: MarketMapperRevenueShareParamsAmino;
}
export interface GenesisStateAminoMsg {
  type: "/dydxprotocol.revshare.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines `x/revshare`'s genesis state. */
export interface GenesisStateSDKType {
  params: MarketMapperRevenueShareParamsSDKType;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: MarketMapperRevenueShareParams.fromPartial({})
  };
}
export const GenesisState = {
  typeUrl: "/dydxprotocol.revshare.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      MarketMapperRevenueShareParams.encode(message.params, writer.uint32(10).fork()).ldelim();
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
          message.params = MarketMapperRevenueShareParams.decode(reader, reader.uint32());
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
    message.params = object.params !== undefined && object.params !== null ? MarketMapperRevenueShareParams.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = MarketMapperRevenueShareParams.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? MarketMapperRevenueShareParams.toAmino(message.params) : undefined;
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
      typeUrl: "/dydxprotocol.revshare.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};