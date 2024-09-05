import { BinaryReader, BinaryWriter } from "../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/** GenesisState is the genesis-state for the x/incentives module. */
export interface GenesisState {
  /**
   * Registry is a list of incentives by type. The registry defined here
   * should be a subset of the incentive types defined in the incentive
   * module (keeper).
   */
  registry: IncentivesByType[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/slinky.incentives.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState is the genesis-state for the x/incentives module. */
export interface GenesisStateAmino {
  /**
   * Registry is a list of incentives by type. The registry defined here
   * should be a subset of the incentive types defined in the incentive
   * module (keeper).
   */
  registry?: IncentivesByTypeAmino[];
}
export interface GenesisStateAminoMsg {
  type: "/slinky.incentives.v1.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState is the genesis-state for the x/incentives module. */
export interface GenesisStateSDKType {
  registry: IncentivesByTypeSDKType[];
}
/**
 * IncentivesByType encapsulates a list of incentives by type. Each of the
 * entries here must correspond to the same incentive type defined here.
 */
export interface IncentivesByType {
  /**
   * IncentiveType is the incentive type i.e. (BadPriceIncentiveType,
   * GoodPriceIncentiveType).
   */
  incentiveType: string;
  /** Entries is a list of incentive bytes. */
  entries: Uint8Array[];
}
export interface IncentivesByTypeProtoMsg {
  typeUrl: "/slinky.incentives.v1.IncentivesByType";
  value: Uint8Array;
}
/**
 * IncentivesByType encapsulates a list of incentives by type. Each of the
 * entries here must correspond to the same incentive type defined here.
 */
export interface IncentivesByTypeAmino {
  /**
   * IncentiveType is the incentive type i.e. (BadPriceIncentiveType,
   * GoodPriceIncentiveType).
   */
  incentive_type?: string;
  /** Entries is a list of incentive bytes. */
  entries?: string[];
}
export interface IncentivesByTypeAminoMsg {
  type: "/slinky.incentives.v1.IncentivesByType";
  value: IncentivesByTypeAmino;
}
/**
 * IncentivesByType encapsulates a list of incentives by type. Each of the
 * entries here must correspond to the same incentive type defined here.
 */
export interface IncentivesByTypeSDKType {
  incentive_type: string;
  entries: Uint8Array[];
}
function createBaseGenesisState(): GenesisState {
  return {
    registry: []
  };
}
export const GenesisState = {
  typeUrl: "/slinky.incentives.v1.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.registry) {
      IncentivesByType.encode(v!, writer.uint32(10).fork()).ldelim();
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
          message.registry.push(IncentivesByType.decode(reader, reader.uint32()));
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
    message.registry = object.registry?.map(e => IncentivesByType.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    message.registry = object.registry?.map(e => IncentivesByType.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    if (message.registry) {
      obj.registry = message.registry.map(e => e ? IncentivesByType.toAmino(e) : undefined);
    } else {
      obj.registry = message.registry;
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
      typeUrl: "/slinky.incentives.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseIncentivesByType(): IncentivesByType {
  return {
    incentiveType: "",
    entries: []
  };
}
export const IncentivesByType = {
  typeUrl: "/slinky.incentives.v1.IncentivesByType",
  encode(message: IncentivesByType, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.incentiveType !== "") {
      writer.uint32(10).string(message.incentiveType);
    }
    for (const v of message.entries) {
      writer.uint32(18).bytes(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): IncentivesByType {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncentivesByType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.incentiveType = reader.string();
          break;
        case 2:
          message.entries.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<IncentivesByType>): IncentivesByType {
    const message = createBaseIncentivesByType();
    message.incentiveType = object.incentiveType ?? "";
    message.entries = object.entries?.map(e => e) || [];
    return message;
  },
  fromAmino(object: IncentivesByTypeAmino): IncentivesByType {
    const message = createBaseIncentivesByType();
    if (object.incentive_type !== undefined && object.incentive_type !== null) {
      message.incentiveType = object.incentive_type;
    }
    message.entries = object.entries?.map(e => bytesFromBase64(e)) || [];
    return message;
  },
  toAmino(message: IncentivesByType): IncentivesByTypeAmino {
    const obj: any = {};
    obj.incentive_type = message.incentiveType === "" ? undefined : message.incentiveType;
    if (message.entries) {
      obj.entries = message.entries.map(e => base64FromBytes(e));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: IncentivesByTypeAminoMsg): IncentivesByType {
    return IncentivesByType.fromAmino(object.value);
  },
  fromProtoMsg(message: IncentivesByTypeProtoMsg): IncentivesByType {
    return IncentivesByType.decode(message.value);
  },
  toProto(message: IncentivesByType): Uint8Array {
    return IncentivesByType.encode(message).finish();
  },
  toProtoMsg(message: IncentivesByType): IncentivesByTypeProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.IncentivesByType",
      value: IncentivesByType.encode(message).finish()
    };
  }
};