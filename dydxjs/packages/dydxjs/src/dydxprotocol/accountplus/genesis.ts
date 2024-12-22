//@ts-nocheck
import { AccountState, AccountStateAmino, AccountStateSDKType } from "./accountplus";
import { BinaryReader, BinaryWriter } from "../../binary";
/** Module genesis state */
export interface GenesisState {
  accounts: AccountState[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/dydxprotocol.accountplus.GenesisState";
  value: Uint8Array;
}
/** Module genesis state */
export interface GenesisStateAmino {
  accounts?: AccountStateAmino[];
}
export interface GenesisStateAminoMsg {
  type: "/dydxprotocol.accountplus.GenesisState";
  value: GenesisStateAmino;
}
/** Module genesis state */
export interface GenesisStateSDKType {
  accounts: AccountStateSDKType[];
}
function createBaseGenesisState(): GenesisState {
  return {
    accounts: []
  };
}
export const GenesisState = {
  typeUrl: "/dydxprotocol.accountplus.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.accounts) {
      AccountState.encode(v!, writer.uint32(10).fork()).ldelim();
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
          message.accounts.push(AccountState.decode(reader, reader.uint32()));
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
    message.accounts = object.accounts?.map(e => AccountState.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    message.accounts = object.accounts?.map(e => AccountState.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map(e => e ? AccountState.toAmino(e) : undefined);
    } else {
      obj.accounts = message.accounts;
    }
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
      typeUrl: "/dydxprotocol.accountplus.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};