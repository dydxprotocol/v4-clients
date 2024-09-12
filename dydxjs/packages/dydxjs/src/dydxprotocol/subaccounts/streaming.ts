//@ts-nocheck
import { SubaccountId, SubaccountIdAmino, SubaccountIdSDKType } from "./subaccount";
import { BinaryReader, BinaryWriter } from "../../binary";
/**
 * StreamSubaccountUpdate provides information on a subaccount update. Used in
 * the full node GRPC stream.
 */
export interface StreamSubaccountUpdate {
  subaccountId?: SubaccountId;
  /** updated_perpetual_positions will each be for unique perpetuals. */
  updatedPerpetualPositions: SubaccountPerpetualPosition[];
  /** updated_asset_positions will each be for unique assets. */
  updatedAssetPositions: SubaccountAssetPosition[];
  /**
   * Snapshot indicates if the response is from a snapshot of the subaccount.
   * All updates should be ignored until snapshot is received.
   * If the snapshot is true, then all previous entries should be
   * discarded and the subaccount should be resynced.
   * For a snapshot subaccount update, the `updated_perpetual_positions` and
   * `updated_asset_positions` fields will contain the full state of the
   * subaccount.
   */
  snapshot: boolean;
}
export interface StreamSubaccountUpdateProtoMsg {
  typeUrl: "/dydxprotocol.subaccounts.StreamSubaccountUpdate";
  value: Uint8Array;
}
/**
 * StreamSubaccountUpdate provides information on a subaccount update. Used in
 * the full node GRPC stream.
 */
export interface StreamSubaccountUpdateAmino {
  subaccount_id?: SubaccountIdAmino;
  /** updated_perpetual_positions will each be for unique perpetuals. */
  updated_perpetual_positions?: SubaccountPerpetualPositionAmino[];
  /** updated_asset_positions will each be for unique assets. */
  updated_asset_positions?: SubaccountAssetPositionAmino[];
  /**
   * Snapshot indicates if the response is from a snapshot of the subaccount.
   * All updates should be ignored until snapshot is received.
   * If the snapshot is true, then all previous entries should be
   * discarded and the subaccount should be resynced.
   * For a snapshot subaccount update, the `updated_perpetual_positions` and
   * `updated_asset_positions` fields will contain the full state of the
   * subaccount.
   */
  snapshot?: boolean;
}
export interface StreamSubaccountUpdateAminoMsg {
  type: "/dydxprotocol.subaccounts.StreamSubaccountUpdate";
  value: StreamSubaccountUpdateAmino;
}
/**
 * StreamSubaccountUpdate provides information on a subaccount update. Used in
 * the full node GRPC stream.
 */
export interface StreamSubaccountUpdateSDKType {
  subaccount_id?: SubaccountIdSDKType;
  updated_perpetual_positions: SubaccountPerpetualPositionSDKType[];
  updated_asset_positions: SubaccountAssetPositionSDKType[];
  snapshot: boolean;
}
/**
 * SubaccountPerpetualPosition provides information on a subaccount's updated
 * perpetual positions.
 */
export interface SubaccountPerpetualPosition {
  /** The `Id` of the `Perpetual`. */
  perpetualId: number;
  /** The size of the position in base quantums. */
  quantums: bigint;
}
export interface SubaccountPerpetualPositionProtoMsg {
  typeUrl: "/dydxprotocol.subaccounts.SubaccountPerpetualPosition";
  value: Uint8Array;
}
/**
 * SubaccountPerpetualPosition provides information on a subaccount's updated
 * perpetual positions.
 */
export interface SubaccountPerpetualPositionAmino {
  /** The `Id` of the `Perpetual`. */
  perpetual_id?: number;
  /** The size of the position in base quantums. */
  quantums?: string;
}
export interface SubaccountPerpetualPositionAminoMsg {
  type: "/dydxprotocol.subaccounts.SubaccountPerpetualPosition";
  value: SubaccountPerpetualPositionAmino;
}
/**
 * SubaccountPerpetualPosition provides information on a subaccount's updated
 * perpetual positions.
 */
export interface SubaccountPerpetualPositionSDKType {
  perpetual_id: number;
  quantums: bigint;
}
/**
 * SubaccountAssetPosition provides information on a subaccount's updated asset
 * positions.
 */
export interface SubaccountAssetPosition {
  /** The `Id` of the `Asset`. */
  assetId: number;
  /** The absolute size of the position in base quantums. */
  quantums: bigint;
}
export interface SubaccountAssetPositionProtoMsg {
  typeUrl: "/dydxprotocol.subaccounts.SubaccountAssetPosition";
  value: Uint8Array;
}
/**
 * SubaccountAssetPosition provides information on a subaccount's updated asset
 * positions.
 */
export interface SubaccountAssetPositionAmino {
  /** The `Id` of the `Asset`. */
  asset_id?: number;
  /** The absolute size of the position in base quantums. */
  quantums?: string;
}
export interface SubaccountAssetPositionAminoMsg {
  type: "/dydxprotocol.subaccounts.SubaccountAssetPosition";
  value: SubaccountAssetPositionAmino;
}
/**
 * SubaccountAssetPosition provides information on a subaccount's updated asset
 * positions.
 */
export interface SubaccountAssetPositionSDKType {
  asset_id: number;
  quantums: bigint;
}
function createBaseStreamSubaccountUpdate(): StreamSubaccountUpdate {
  return {
    subaccountId: undefined,
    updatedPerpetualPositions: [],
    updatedAssetPositions: [],
    snapshot: false
  };
}
export const StreamSubaccountUpdate = {
  typeUrl: "/dydxprotocol.subaccounts.StreamSubaccountUpdate",
  encode(message: StreamSubaccountUpdate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.subaccountId !== undefined) {
      SubaccountId.encode(message.subaccountId, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.updatedPerpetualPositions) {
      SubaccountPerpetualPosition.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.updatedAssetPositions) {
      SubaccountAssetPosition.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.snapshot === true) {
      writer.uint32(32).bool(message.snapshot);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StreamSubaccountUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamSubaccountUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subaccountId = SubaccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.updatedPerpetualPositions.push(SubaccountPerpetualPosition.decode(reader, reader.uint32()));
          break;
        case 3:
          message.updatedAssetPositions.push(SubaccountAssetPosition.decode(reader, reader.uint32()));
          break;
        case 4:
          message.snapshot = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StreamSubaccountUpdate>): StreamSubaccountUpdate {
    const message = createBaseStreamSubaccountUpdate();
    message.subaccountId = object.subaccountId !== undefined && object.subaccountId !== null ? SubaccountId.fromPartial(object.subaccountId) : undefined;
    message.updatedPerpetualPositions = object.updatedPerpetualPositions?.map(e => SubaccountPerpetualPosition.fromPartial(e)) || [];
    message.updatedAssetPositions = object.updatedAssetPositions?.map(e => SubaccountAssetPosition.fromPartial(e)) || [];
    message.snapshot = object.snapshot ?? false;
    return message;
  },
  fromAmino(object: StreamSubaccountUpdateAmino): StreamSubaccountUpdate {
    const message = createBaseStreamSubaccountUpdate();
    if (object.subaccount_id !== undefined && object.subaccount_id !== null) {
      message.subaccountId = SubaccountId.fromAmino(object.subaccount_id);
    }
    message.updatedPerpetualPositions = object.updated_perpetual_positions?.map(e => SubaccountPerpetualPosition.fromAmino(e)) || [];
    message.updatedAssetPositions = object.updated_asset_positions?.map(e => SubaccountAssetPosition.fromAmino(e)) || [];
    if (object.snapshot !== undefined && object.snapshot !== null) {
      message.snapshot = object.snapshot;
    }
    return message;
  },
  toAmino(message: StreamSubaccountUpdate): StreamSubaccountUpdateAmino {
    const obj: any = {};
    obj.subaccount_id = message.subaccountId ? SubaccountId.toAmino(message.subaccountId) : undefined;
    if (message.updatedPerpetualPositions) {
      obj.updated_perpetual_positions = message.updatedPerpetualPositions.map(e => e ? SubaccountPerpetualPosition.toAmino(e) : undefined);
    } else {
      obj.updated_perpetual_positions = message.updatedPerpetualPositions;
    }
    if (message.updatedAssetPositions) {
      obj.updated_asset_positions = message.updatedAssetPositions.map(e => e ? SubaccountAssetPosition.toAmino(e) : undefined);
    } else {
      obj.updated_asset_positions = message.updatedAssetPositions;
    }
    obj.snapshot = message.snapshot === false ? undefined : message.snapshot;
    return obj;
  },
  fromAminoMsg(object: StreamSubaccountUpdateAminoMsg): StreamSubaccountUpdate {
    return StreamSubaccountUpdate.fromAmino(object.value);
  },
  fromProtoMsg(message: StreamSubaccountUpdateProtoMsg): StreamSubaccountUpdate {
    return StreamSubaccountUpdate.decode(message.value);
  },
  toProto(message: StreamSubaccountUpdate): Uint8Array {
    return StreamSubaccountUpdate.encode(message).finish();
  },
  toProtoMsg(message: StreamSubaccountUpdate): StreamSubaccountUpdateProtoMsg {
    return {
      typeUrl: "/dydxprotocol.subaccounts.StreamSubaccountUpdate",
      value: StreamSubaccountUpdate.encode(message).finish()
    };
  }
};
function createBaseSubaccountPerpetualPosition(): SubaccountPerpetualPosition {
  return {
    perpetualId: 0,
    quantums: BigInt(0)
  };
}
export const SubaccountPerpetualPosition = {
  typeUrl: "/dydxprotocol.subaccounts.SubaccountPerpetualPosition",
  encode(message: SubaccountPerpetualPosition, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.perpetualId !== 0) {
      writer.uint32(8).uint32(message.perpetualId);
    }
    if (message.quantums !== BigInt(0)) {
      writer.uint32(16).uint64(message.quantums);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): SubaccountPerpetualPosition {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubaccountPerpetualPosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.perpetualId = reader.uint32();
          break;
        case 2:
          message.quantums = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SubaccountPerpetualPosition>): SubaccountPerpetualPosition {
    const message = createBaseSubaccountPerpetualPosition();
    message.perpetualId = object.perpetualId ?? 0;
    message.quantums = object.quantums !== undefined && object.quantums !== null ? BigInt(object.quantums.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: SubaccountPerpetualPositionAmino): SubaccountPerpetualPosition {
    const message = createBaseSubaccountPerpetualPosition();
    if (object.perpetual_id !== undefined && object.perpetual_id !== null) {
      message.perpetualId = object.perpetual_id;
    }
    if (object.quantums !== undefined && object.quantums !== null) {
      message.quantums = BigInt(object.quantums);
    }
    return message;
  },
  toAmino(message: SubaccountPerpetualPosition): SubaccountPerpetualPositionAmino {
    const obj: any = {};
    obj.perpetual_id = message.perpetualId === 0 ? undefined : message.perpetualId;
    obj.quantums = message.quantums !== BigInt(0) ? message.quantums.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: SubaccountPerpetualPositionAminoMsg): SubaccountPerpetualPosition {
    return SubaccountPerpetualPosition.fromAmino(object.value);
  },
  fromProtoMsg(message: SubaccountPerpetualPositionProtoMsg): SubaccountPerpetualPosition {
    return SubaccountPerpetualPosition.decode(message.value);
  },
  toProto(message: SubaccountPerpetualPosition): Uint8Array {
    return SubaccountPerpetualPosition.encode(message).finish();
  },
  toProtoMsg(message: SubaccountPerpetualPosition): SubaccountPerpetualPositionProtoMsg {
    return {
      typeUrl: "/dydxprotocol.subaccounts.SubaccountPerpetualPosition",
      value: SubaccountPerpetualPosition.encode(message).finish()
    };
  }
};
function createBaseSubaccountAssetPosition(): SubaccountAssetPosition {
  return {
    assetId: 0,
    quantums: BigInt(0)
  };
}
export const SubaccountAssetPosition = {
  typeUrl: "/dydxprotocol.subaccounts.SubaccountAssetPosition",
  encode(message: SubaccountAssetPosition, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.assetId !== 0) {
      writer.uint32(8).uint32(message.assetId);
    }
    if (message.quantums !== BigInt(0)) {
      writer.uint32(16).uint64(message.quantums);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): SubaccountAssetPosition {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubaccountAssetPosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.assetId = reader.uint32();
          break;
        case 2:
          message.quantums = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SubaccountAssetPosition>): SubaccountAssetPosition {
    const message = createBaseSubaccountAssetPosition();
    message.assetId = object.assetId ?? 0;
    message.quantums = object.quantums !== undefined && object.quantums !== null ? BigInt(object.quantums.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: SubaccountAssetPositionAmino): SubaccountAssetPosition {
    const message = createBaseSubaccountAssetPosition();
    if (object.asset_id !== undefined && object.asset_id !== null) {
      message.assetId = object.asset_id;
    }
    if (object.quantums !== undefined && object.quantums !== null) {
      message.quantums = BigInt(object.quantums);
    }
    return message;
  },
  toAmino(message: SubaccountAssetPosition): SubaccountAssetPositionAmino {
    const obj: any = {};
    obj.asset_id = message.assetId === 0 ? undefined : message.assetId;
    obj.quantums = message.quantums !== BigInt(0) ? message.quantums.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: SubaccountAssetPositionAminoMsg): SubaccountAssetPosition {
    return SubaccountAssetPosition.fromAmino(object.value);
  },
  fromProtoMsg(message: SubaccountAssetPositionProtoMsg): SubaccountAssetPosition {
    return SubaccountAssetPosition.decode(message.value);
  },
  toProto(message: SubaccountAssetPosition): Uint8Array {
    return SubaccountAssetPosition.encode(message).finish();
  },
  toProtoMsg(message: SubaccountAssetPosition): SubaccountAssetPositionProtoMsg {
    return {
      typeUrl: "/dydxprotocol.subaccounts.SubaccountAssetPosition",
      value: SubaccountAssetPosition.encode(message).finish()
    };
  }
};