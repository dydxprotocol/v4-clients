//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** Account State */
export interface AccountState {
  address: string;
  timestampNonceDetails: TimestampNonceDetails;
}
export interface AccountStateProtoMsg {
  typeUrl: "/dydxprotocol.accountplus.AccountState";
  value: Uint8Array;
}
/** Account State */
export interface AccountStateAmino {
  address?: string;
  timestamp_nonce_details?: TimestampNonceDetailsAmino;
}
export interface AccountStateAminoMsg {
  type: "/dydxprotocol.accountplus.AccountState";
  value: AccountStateAmino;
}
/** Account State */
export interface AccountStateSDKType {
  address: string;
  timestamp_nonce_details: TimestampNonceDetailsSDKType;
}
/** Timestamp nonce details */
export interface TimestampNonceDetails {
  /** unsorted list of n most recent timestamp nonces */
  timestampNonces: bigint[];
  /** max timestamp nonce that was ejected from list above */
  maxEjectedNonce: bigint;
}
export interface TimestampNonceDetailsProtoMsg {
  typeUrl: "/dydxprotocol.accountplus.TimestampNonceDetails";
  value: Uint8Array;
}
/** Timestamp nonce details */
export interface TimestampNonceDetailsAmino {
  /** unsorted list of n most recent timestamp nonces */
  timestamp_nonces?: string[];
  /** max timestamp nonce that was ejected from list above */
  max_ejected_nonce?: string;
}
export interface TimestampNonceDetailsAminoMsg {
  type: "/dydxprotocol.accountplus.TimestampNonceDetails";
  value: TimestampNonceDetailsAmino;
}
/** Timestamp nonce details */
export interface TimestampNonceDetailsSDKType {
  timestamp_nonces: bigint[];
  max_ejected_nonce: bigint;
}
function createBaseAccountState(): AccountState {
  return {
    address: "",
    timestampNonceDetails: TimestampNonceDetails.fromPartial({})
  };
}
export const AccountState = {
  typeUrl: "/dydxprotocol.accountplus.AccountState",
  encode(message: AccountState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.timestampNonceDetails !== undefined) {
      TimestampNonceDetails.encode(message.timestampNonceDetails, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AccountState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.timestampNonceDetails = TimestampNonceDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AccountState>): AccountState {
    const message = createBaseAccountState();
    message.address = object.address ?? "";
    message.timestampNonceDetails = object.timestampNonceDetails !== undefined && object.timestampNonceDetails !== null ? TimestampNonceDetails.fromPartial(object.timestampNonceDetails) : undefined;
    return message;
  },
  fromAmino(object: AccountStateAmino): AccountState {
    const message = createBaseAccountState();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.timestamp_nonce_details !== undefined && object.timestamp_nonce_details !== null) {
      message.timestampNonceDetails = TimestampNonceDetails.fromAmino(object.timestamp_nonce_details);
    }
    return message;
  },
  toAmino(message: AccountState): AccountStateAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    obj.timestamp_nonce_details = message.timestampNonceDetails ? TimestampNonceDetails.toAmino(message.timestampNonceDetails) : undefined;
    return obj;
  },
  fromAminoMsg(object: AccountStateAminoMsg): AccountState {
    return AccountState.fromAmino(object.value);
  },
  fromProtoMsg(message: AccountStateProtoMsg): AccountState {
    return AccountState.decode(message.value);
  },
  toProto(message: AccountState): Uint8Array {
    return AccountState.encode(message).finish();
  },
  toProtoMsg(message: AccountState): AccountStateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.accountplus.AccountState",
      value: AccountState.encode(message).finish()
    };
  }
};
function createBaseTimestampNonceDetails(): TimestampNonceDetails {
  return {
    timestampNonces: [],
    maxEjectedNonce: BigInt(0)
  };
}
export const TimestampNonceDetails = {
  typeUrl: "/dydxprotocol.accountplus.TimestampNonceDetails",
  encode(message: TimestampNonceDetails, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.timestampNonces) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.maxEjectedNonce !== BigInt(0)) {
      writer.uint32(16).uint64(message.maxEjectedNonce);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): TimestampNonceDetails {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampNonceDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.timestampNonces.push(reader.uint64());
            }
          } else {
            message.timestampNonces.push(reader.uint64());
          }
          break;
        case 2:
          message.maxEjectedNonce = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<TimestampNonceDetails>): TimestampNonceDetails {
    const message = createBaseTimestampNonceDetails();
    message.timestampNonces = object.timestampNonces?.map(e => BigInt(e.toString())) || [];
    message.maxEjectedNonce = object.maxEjectedNonce !== undefined && object.maxEjectedNonce !== null ? BigInt(object.maxEjectedNonce.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: TimestampNonceDetailsAmino): TimestampNonceDetails {
    const message = createBaseTimestampNonceDetails();
    message.timestampNonces = object.timestamp_nonces?.map(e => BigInt(e)) || [];
    if (object.max_ejected_nonce !== undefined && object.max_ejected_nonce !== null) {
      message.maxEjectedNonce = BigInt(object.max_ejected_nonce);
    }
    return message;
  },
  toAmino(message: TimestampNonceDetails): TimestampNonceDetailsAmino {
    const obj: any = {};
    if (message.timestampNonces) {
      obj.timestamp_nonces = message.timestampNonces.map(e => e.toString());
    } else {
      obj.timestamp_nonces = message.timestampNonces;
    }
    obj.max_ejected_nonce = message.maxEjectedNonce !== BigInt(0) ? message.maxEjectedNonce.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: TimestampNonceDetailsAminoMsg): TimestampNonceDetails {
    return TimestampNonceDetails.fromAmino(object.value);
  },
  fromProtoMsg(message: TimestampNonceDetailsProtoMsg): TimestampNonceDetails {
    return TimestampNonceDetails.decode(message.value);
  },
  toProto(message: TimestampNonceDetails): Uint8Array {
    return TimestampNonceDetails.encode(message).finish();
  },
  toProtoMsg(message: TimestampNonceDetails): TimestampNonceDetailsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.accountplus.TimestampNonceDetails",
      value: TimestampNonceDetails.encode(message).finish()
    };
  }
};