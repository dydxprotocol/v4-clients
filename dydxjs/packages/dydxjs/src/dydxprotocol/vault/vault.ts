//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
/** VaultType represents different types of vaults. */
export enum VaultType {
  /** VAULT_TYPE_UNSPECIFIED - Default value, invalid and unused. */
  VAULT_TYPE_UNSPECIFIED = 0,
  /** VAULT_TYPE_CLOB - Vault is associated with a CLOB pair. */
  VAULT_TYPE_CLOB = 1,
  UNRECOGNIZED = -1,
}
export const VaultTypeSDKType = VaultType;
export const VaultTypeAmino = VaultType;
export function vaultTypeFromJSON(object: any): VaultType {
  switch (object) {
    case 0:
    case "VAULT_TYPE_UNSPECIFIED":
      return VaultType.VAULT_TYPE_UNSPECIFIED;
    case 1:
    case "VAULT_TYPE_CLOB":
      return VaultType.VAULT_TYPE_CLOB;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VaultType.UNRECOGNIZED;
  }
}
export function vaultTypeToJSON(object: VaultType): string {
  switch (object) {
    case VaultType.VAULT_TYPE_UNSPECIFIED:
      return "VAULT_TYPE_UNSPECIFIED";
    case VaultType.VAULT_TYPE_CLOB:
      return "VAULT_TYPE_CLOB";
    case VaultType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** VaultStatus represents the status of a vault. */
export enum VaultStatus {
  /** VAULT_STATUS_UNSPECIFIED - Default value, invalid and unused. */
  VAULT_STATUS_UNSPECIFIED = 0,
  /** VAULT_STATUS_DEACTIVATED - Don’t place orders. Does not count toward global vault balances. */
  VAULT_STATUS_DEACTIVATED = 1,
  /** VAULT_STATUS_STAND_BY - Don’t place orders. Does count towards global vault balances. */
  VAULT_STATUS_STAND_BY = 2,
  /** VAULT_STATUS_QUOTING - Places orders on both sides of the book. */
  VAULT_STATUS_QUOTING = 3,
  /** VAULT_STATUS_CLOSE_ONLY - Only place orders that close the position. */
  VAULT_STATUS_CLOSE_ONLY = 4,
  UNRECOGNIZED = -1,
}
export const VaultStatusSDKType = VaultStatus;
export const VaultStatusAmino = VaultStatus;
export function vaultStatusFromJSON(object: any): VaultStatus {
  switch (object) {
    case 0:
    case "VAULT_STATUS_UNSPECIFIED":
      return VaultStatus.VAULT_STATUS_UNSPECIFIED;
    case 1:
    case "VAULT_STATUS_DEACTIVATED":
      return VaultStatus.VAULT_STATUS_DEACTIVATED;
    case 2:
    case "VAULT_STATUS_STAND_BY":
      return VaultStatus.VAULT_STATUS_STAND_BY;
    case 3:
    case "VAULT_STATUS_QUOTING":
      return VaultStatus.VAULT_STATUS_QUOTING;
    case 4:
    case "VAULT_STATUS_CLOSE_ONLY":
      return VaultStatus.VAULT_STATUS_CLOSE_ONLY;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VaultStatus.UNRECOGNIZED;
  }
}
export function vaultStatusToJSON(object: VaultStatus): string {
  switch (object) {
    case VaultStatus.VAULT_STATUS_UNSPECIFIED:
      return "VAULT_STATUS_UNSPECIFIED";
    case VaultStatus.VAULT_STATUS_DEACTIVATED:
      return "VAULT_STATUS_DEACTIVATED";
    case VaultStatus.VAULT_STATUS_STAND_BY:
      return "VAULT_STATUS_STAND_BY";
    case VaultStatus.VAULT_STATUS_QUOTING:
      return "VAULT_STATUS_QUOTING";
    case VaultStatus.VAULT_STATUS_CLOSE_ONLY:
      return "VAULT_STATUS_CLOSE_ONLY";
    case VaultStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** VaultId uniquely identifies a vault by its type and number. */
export interface VaultId {
  /** Type of the vault. */
  type: VaultType;
  /** Unique ID of the vault within above type. */
  number: number;
}
export interface VaultIdProtoMsg {
  typeUrl: "/dydxprotocol.vault.VaultId";
  value: Uint8Array;
}
/** VaultId uniquely identifies a vault by its type and number. */
export interface VaultIdAmino {
  /** Type of the vault. */
  type?: VaultType;
  /** Unique ID of the vault within above type. */
  number?: number;
}
export interface VaultIdAminoMsg {
  type: "/dydxprotocol.vault.VaultId";
  value: VaultIdAmino;
}
/** VaultId uniquely identifies a vault by its type and number. */
export interface VaultIdSDKType {
  type: VaultType;
  number: number;
}
function createBaseVaultId(): VaultId {
  return {
    type: 0,
    number: 0
  };
}
export const VaultId = {
  typeUrl: "/dydxprotocol.vault.VaultId",
  encode(message: VaultId, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.number !== 0) {
      writer.uint32(16).uint32(message.number);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): VaultId {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVaultId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.number = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<VaultId>): VaultId {
    const message = createBaseVaultId();
    message.type = object.type ?? 0;
    message.number = object.number ?? 0;
    return message;
  },
  fromAmino(object: VaultIdAmino): VaultId {
    const message = createBaseVaultId();
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    }
    return message;
  },
  toAmino(message: VaultId): VaultIdAmino {
    const obj: any = {};
    obj.type = message.type === 0 ? undefined : message.type;
    obj.number = message.number === 0 ? undefined : message.number;
    return obj;
  },
  fromAminoMsg(object: VaultIdAminoMsg): VaultId {
    return VaultId.fromAmino(object.value);
  },
  fromProtoMsg(message: VaultIdProtoMsg): VaultId {
    return VaultId.decode(message.value);
  },
  toProto(message: VaultId): Uint8Array {
    return VaultId.encode(message).finish();
  },
  toProtoMsg(message: VaultId): VaultIdProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.VaultId",
      value: VaultId.encode(message).finish()
    };
  }
};