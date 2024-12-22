//@ts-nocheck
import { NumShares, NumSharesAmino, NumSharesSDKType, OwnerShare, OwnerShareAmino, OwnerShareSDKType } from "./share";
import { QuotingParams, QuotingParamsAmino, QuotingParamsSDKType, VaultParams, VaultParamsAmino, VaultParamsSDKType } from "./params";
import { VaultId, VaultIdAmino, VaultIdSDKType } from "./vault";
import { BinaryReader, BinaryWriter } from "../../binary";
/** GenesisState defines `x/vault`'s genesis state. */
export interface GenesisState {
  /** The total number of shares. */
  totalShares: NumShares;
  /** The shares of each owner. */
  ownerShares: OwnerShare[];
  /** The vaults. */
  vaults: Vault[];
  /** The default quoting parameters for all vaults. */
  defaultQuotingParams: QuotingParams;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/dydxprotocol.vault.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines `x/vault`'s genesis state. */
export interface GenesisStateAmino {
  /** The total number of shares. */
  total_shares?: NumSharesAmino;
  /** The shares of each owner. */
  owner_shares?: OwnerShareAmino[];
  /** The vaults. */
  vaults?: VaultAmino[];
  /** The default quoting parameters for all vaults. */
  default_quoting_params?: QuotingParamsAmino;
}
export interface GenesisStateAminoMsg {
  type: "/dydxprotocol.vault.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines `x/vault`'s genesis state. */
export interface GenesisStateSDKType {
  total_shares: NumSharesSDKType;
  owner_shares: OwnerShareSDKType[];
  vaults: VaultSDKType[];
  default_quoting_params: QuotingParamsSDKType;
}
/** Vault defines the state of a vault. */
export interface Vault {
  /** The ID of the vault. */
  vaultId: VaultId;
  /** The parameters of the vault. */
  vaultParams: VaultParams;
  /** The client IDs of the most recently placed orders of the vault. */
  mostRecentClientIds: number[];
}
export interface VaultProtoMsg {
  typeUrl: "/dydxprotocol.vault.Vault";
  value: Uint8Array;
}
/** Vault defines the state of a vault. */
export interface VaultAmino {
  /** The ID of the vault. */
  vault_id?: VaultIdAmino;
  /** The parameters of the vault. */
  vault_params?: VaultParamsAmino;
  /** The client IDs of the most recently placed orders of the vault. */
  most_recent_client_ids?: number[];
}
export interface VaultAminoMsg {
  type: "/dydxprotocol.vault.Vault";
  value: VaultAmino;
}
/** Vault defines the state of a vault. */
export interface VaultSDKType {
  vault_id: VaultIdSDKType;
  vault_params: VaultParamsSDKType;
  most_recent_client_ids: number[];
}
/**
 * GenesisStateV6 defines `x/vault`'s genesis state in v6.x.
 * Deprecated since v7.x in favor of GenesisState.
 */
export interface GenesisStateV6 {
  /** The vaults. */
  vaults: Vault[];
  /** The default quoting parameters for all vaults. */
  defaultQuotingParams: QuotingParams;
}
export interface GenesisStateV6ProtoMsg {
  typeUrl: "/dydxprotocol.vault.GenesisStateV6";
  value: Uint8Array;
}
/**
 * GenesisStateV6 defines `x/vault`'s genesis state in v6.x.
 * Deprecated since v7.x in favor of GenesisState.
 */
export interface GenesisStateV6Amino {
  /** The vaults. */
  vaults?: VaultAmino[];
  /** The default quoting parameters for all vaults. */
  default_quoting_params?: QuotingParamsAmino;
}
export interface GenesisStateV6AminoMsg {
  type: "/dydxprotocol.vault.GenesisStateV6";
  value: GenesisStateV6Amino;
}
/**
 * GenesisStateV6 defines `x/vault`'s genesis state in v6.x.
 * Deprecated since v7.x in favor of GenesisState.
 */
export interface GenesisStateV6SDKType {
  vaults: VaultSDKType[];
  default_quoting_params: QuotingParamsSDKType;
}
/**
 * VaultV6 defines the state of a vault.
 * Deprecated since v7.x in favor of Vault.
 */
export interface VaultV6 {
  /** The ID of the vault. */
  vaultId?: VaultId;
  /** The total number of shares in the vault. */
  totalShares?: NumShares;
  /** The shares of each owner in the vault. */
  ownerShares: OwnerShare[];
  /** The parameters of the vault. */
  vaultParams: VaultParams;
  /** The client IDs of the most recently placed orders of the vault. */
  mostRecentClientIds: number[];
}
export interface VaultV6ProtoMsg {
  typeUrl: "/dydxprotocol.vault.VaultV6";
  value: Uint8Array;
}
/**
 * VaultV6 defines the state of a vault.
 * Deprecated since v7.x in favor of Vault.
 */
export interface VaultV6Amino {
  /** The ID of the vault. */
  vault_id?: VaultIdAmino;
  /** The total number of shares in the vault. */
  total_shares?: NumSharesAmino;
  /** The shares of each owner in the vault. */
  owner_shares?: OwnerShareAmino[];
  /** The parameters of the vault. */
  vault_params?: VaultParamsAmino;
  /** The client IDs of the most recently placed orders of the vault. */
  most_recent_client_ids?: number[];
}
export interface VaultV6AminoMsg {
  type: "/dydxprotocol.vault.VaultV6";
  value: VaultV6Amino;
}
/**
 * VaultV6 defines the state of a vault.
 * Deprecated since v7.x in favor of Vault.
 */
export interface VaultV6SDKType {
  vault_id?: VaultIdSDKType;
  total_shares?: NumSharesSDKType;
  owner_shares: OwnerShareSDKType[];
  vault_params: VaultParamsSDKType;
  most_recent_client_ids: number[];
}
function createBaseGenesisState(): GenesisState {
  return {
    totalShares: NumShares.fromPartial({}),
    ownerShares: [],
    vaults: [],
    defaultQuotingParams: QuotingParams.fromPartial({})
  };
}
export const GenesisState = {
  typeUrl: "/dydxprotocol.vault.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.totalShares !== undefined) {
      NumShares.encode(message.totalShares, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.ownerShares) {
      OwnerShare.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.vaults) {
      Vault.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.defaultQuotingParams !== undefined) {
      QuotingParams.encode(message.defaultQuotingParams, writer.uint32(34).fork()).ldelim();
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
          message.totalShares = NumShares.decode(reader, reader.uint32());
          break;
        case 2:
          message.ownerShares.push(OwnerShare.decode(reader, reader.uint32()));
          break;
        case 3:
          message.vaults.push(Vault.decode(reader, reader.uint32()));
          break;
        case 4:
          message.defaultQuotingParams = QuotingParams.decode(reader, reader.uint32());
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
    message.totalShares = object.totalShares !== undefined && object.totalShares !== null ? NumShares.fromPartial(object.totalShares) : undefined;
    message.ownerShares = object.ownerShares?.map(e => OwnerShare.fromPartial(e)) || [];
    message.vaults = object.vaults?.map(e => Vault.fromPartial(e)) || [];
    message.defaultQuotingParams = object.defaultQuotingParams !== undefined && object.defaultQuotingParams !== null ? QuotingParams.fromPartial(object.defaultQuotingParams) : undefined;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.total_shares !== undefined && object.total_shares !== null) {
      message.totalShares = NumShares.fromAmino(object.total_shares);
    }
    message.ownerShares = object.owner_shares?.map(e => OwnerShare.fromAmino(e)) || [];
    message.vaults = object.vaults?.map(e => Vault.fromAmino(e)) || [];
    if (object.default_quoting_params !== undefined && object.default_quoting_params !== null) {
      message.defaultQuotingParams = QuotingParams.fromAmino(object.default_quoting_params);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.total_shares = message.totalShares ? NumShares.toAmino(message.totalShares) : undefined;
    if (message.ownerShares) {
      obj.owner_shares = message.ownerShares.map(e => e ? OwnerShare.toAmino(e) : undefined);
    } else {
      obj.owner_shares = message.ownerShares;
    }
    if (message.vaults) {
      obj.vaults = message.vaults.map(e => e ? Vault.toAmino(e) : undefined);
    } else {
      obj.vaults = message.vaults;
    }
    obj.default_quoting_params = message.defaultQuotingParams ? QuotingParams.toAmino(message.defaultQuotingParams) : undefined;
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
      typeUrl: "/dydxprotocol.vault.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseVault(): Vault {
  return {
    vaultId: VaultId.fromPartial({}),
    vaultParams: VaultParams.fromPartial({}),
    mostRecentClientIds: []
  };
}
export const Vault = {
  typeUrl: "/dydxprotocol.vault.Vault",
  encode(message: Vault, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.vaultId !== undefined) {
      VaultId.encode(message.vaultId, writer.uint32(10).fork()).ldelim();
    }
    if (message.vaultParams !== undefined) {
      VaultParams.encode(message.vaultParams, writer.uint32(18).fork()).ldelim();
    }
    writer.uint32(26).fork();
    for (const v of message.mostRecentClientIds) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Vault {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVault();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vaultId = VaultId.decode(reader, reader.uint32());
          break;
        case 2:
          message.vaultParams = VaultParams.decode(reader, reader.uint32());
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.mostRecentClientIds.push(reader.uint32());
            }
          } else {
            message.mostRecentClientIds.push(reader.uint32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Vault>): Vault {
    const message = createBaseVault();
    message.vaultId = object.vaultId !== undefined && object.vaultId !== null ? VaultId.fromPartial(object.vaultId) : undefined;
    message.vaultParams = object.vaultParams !== undefined && object.vaultParams !== null ? VaultParams.fromPartial(object.vaultParams) : undefined;
    message.mostRecentClientIds = object.mostRecentClientIds?.map(e => e) || [];
    return message;
  },
  fromAmino(object: VaultAmino): Vault {
    const message = createBaseVault();
    if (object.vault_id !== undefined && object.vault_id !== null) {
      message.vaultId = VaultId.fromAmino(object.vault_id);
    }
    if (object.vault_params !== undefined && object.vault_params !== null) {
      message.vaultParams = VaultParams.fromAmino(object.vault_params);
    }
    message.mostRecentClientIds = object.most_recent_client_ids?.map(e => e) || [];
    return message;
  },
  toAmino(message: Vault): VaultAmino {
    const obj: any = {};
    obj.vault_id = message.vaultId ? VaultId.toAmino(message.vaultId) : undefined;
    obj.vault_params = message.vaultParams ? VaultParams.toAmino(message.vaultParams) : undefined;
    if (message.mostRecentClientIds) {
      obj.most_recent_client_ids = message.mostRecentClientIds.map(e => e);
    } else {
      obj.most_recent_client_ids = message.mostRecentClientIds;
    }
    return obj;
  },
  fromAminoMsg(object: VaultAminoMsg): Vault {
    return Vault.fromAmino(object.value);
  },
  fromProtoMsg(message: VaultProtoMsg): Vault {
    return Vault.decode(message.value);
  },
  toProto(message: Vault): Uint8Array {
    return Vault.encode(message).finish();
  },
  toProtoMsg(message: Vault): VaultProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.Vault",
      value: Vault.encode(message).finish()
    };
  }
};
function createBaseGenesisStateV6(): GenesisStateV6 {
  return {
    vaults: [],
    defaultQuotingParams: QuotingParams.fromPartial({})
  };
}
export const GenesisStateV6 = {
  typeUrl: "/dydxprotocol.vault.GenesisStateV6",
  encode(message: GenesisStateV6, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.vaults) {
      Vault.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.defaultQuotingParams !== undefined) {
      QuotingParams.encode(message.defaultQuotingParams, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisStateV6 {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisStateV6();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.vaults.push(Vault.decode(reader, reader.uint32()));
          break;
        case 3:
          message.defaultQuotingParams = QuotingParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GenesisStateV6>): GenesisStateV6 {
    const message = createBaseGenesisStateV6();
    message.vaults = object.vaults?.map(e => Vault.fromPartial(e)) || [];
    message.defaultQuotingParams = object.defaultQuotingParams !== undefined && object.defaultQuotingParams !== null ? QuotingParams.fromPartial(object.defaultQuotingParams) : undefined;
    return message;
  },
  fromAmino(object: GenesisStateV6Amino): GenesisStateV6 {
    const message = createBaseGenesisStateV6();
    message.vaults = object.vaults?.map(e => Vault.fromAmino(e)) || [];
    if (object.default_quoting_params !== undefined && object.default_quoting_params !== null) {
      message.defaultQuotingParams = QuotingParams.fromAmino(object.default_quoting_params);
    }
    return message;
  },
  toAmino(message: GenesisStateV6): GenesisStateV6Amino {
    const obj: any = {};
    if (message.vaults) {
      obj.vaults = message.vaults.map(e => e ? Vault.toAmino(e) : undefined);
    } else {
      obj.vaults = message.vaults;
    }
    obj.default_quoting_params = message.defaultQuotingParams ? QuotingParams.toAmino(message.defaultQuotingParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: GenesisStateV6AminoMsg): GenesisStateV6 {
    return GenesisStateV6.fromAmino(object.value);
  },
  fromProtoMsg(message: GenesisStateV6ProtoMsg): GenesisStateV6 {
    return GenesisStateV6.decode(message.value);
  },
  toProto(message: GenesisStateV6): Uint8Array {
    return GenesisStateV6.encode(message).finish();
  },
  toProtoMsg(message: GenesisStateV6): GenesisStateV6ProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.GenesisStateV6",
      value: GenesisStateV6.encode(message).finish()
    };
  }
};
function createBaseVaultV6(): VaultV6 {
  return {
    vaultId: undefined,
    totalShares: undefined,
    ownerShares: [],
    vaultParams: VaultParams.fromPartial({}),
    mostRecentClientIds: []
  };
}
export const VaultV6 = {
  typeUrl: "/dydxprotocol.vault.VaultV6",
  encode(message: VaultV6, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.vaultId !== undefined) {
      VaultId.encode(message.vaultId, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalShares !== undefined) {
      NumShares.encode(message.totalShares, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.ownerShares) {
      OwnerShare.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.vaultParams !== undefined) {
      VaultParams.encode(message.vaultParams, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(42).fork();
    for (const v of message.mostRecentClientIds) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): VaultV6 {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVaultV6();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vaultId = VaultId.decode(reader, reader.uint32());
          break;
        case 2:
          message.totalShares = NumShares.decode(reader, reader.uint32());
          break;
        case 3:
          message.ownerShares.push(OwnerShare.decode(reader, reader.uint32()));
          break;
        case 4:
          message.vaultParams = VaultParams.decode(reader, reader.uint32());
          break;
        case 5:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.mostRecentClientIds.push(reader.uint32());
            }
          } else {
            message.mostRecentClientIds.push(reader.uint32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<VaultV6>): VaultV6 {
    const message = createBaseVaultV6();
    message.vaultId = object.vaultId !== undefined && object.vaultId !== null ? VaultId.fromPartial(object.vaultId) : undefined;
    message.totalShares = object.totalShares !== undefined && object.totalShares !== null ? NumShares.fromPartial(object.totalShares) : undefined;
    message.ownerShares = object.ownerShares?.map(e => OwnerShare.fromPartial(e)) || [];
    message.vaultParams = object.vaultParams !== undefined && object.vaultParams !== null ? VaultParams.fromPartial(object.vaultParams) : undefined;
    message.mostRecentClientIds = object.mostRecentClientIds?.map(e => e) || [];
    return message;
  },
  fromAmino(object: VaultV6Amino): VaultV6 {
    const message = createBaseVaultV6();
    if (object.vault_id !== undefined && object.vault_id !== null) {
      message.vaultId = VaultId.fromAmino(object.vault_id);
    }
    if (object.total_shares !== undefined && object.total_shares !== null) {
      message.totalShares = NumShares.fromAmino(object.total_shares);
    }
    message.ownerShares = object.owner_shares?.map(e => OwnerShare.fromAmino(e)) || [];
    if (object.vault_params !== undefined && object.vault_params !== null) {
      message.vaultParams = VaultParams.fromAmino(object.vault_params);
    }
    message.mostRecentClientIds = object.most_recent_client_ids?.map(e => e) || [];
    return message;
  },
  toAmino(message: VaultV6): VaultV6Amino {
    const obj: any = {};
    obj.vault_id = message.vaultId ? VaultId.toAmino(message.vaultId) : undefined;
    obj.total_shares = message.totalShares ? NumShares.toAmino(message.totalShares) : undefined;
    if (message.ownerShares) {
      obj.owner_shares = message.ownerShares.map(e => e ? OwnerShare.toAmino(e) : undefined);
    } else {
      obj.owner_shares = message.ownerShares;
    }
    obj.vault_params = message.vaultParams ? VaultParams.toAmino(message.vaultParams) : undefined;
    if (message.mostRecentClientIds) {
      obj.most_recent_client_ids = message.mostRecentClientIds.map(e => e);
    } else {
      obj.most_recent_client_ids = message.mostRecentClientIds;
    }
    return obj;
  },
  fromAminoMsg(object: VaultV6AminoMsg): VaultV6 {
    return VaultV6.fromAmino(object.value);
  },
  fromProtoMsg(message: VaultV6ProtoMsg): VaultV6 {
    return VaultV6.decode(message.value);
  },
  toProto(message: VaultV6): Uint8Array {
    return VaultV6.encode(message).finish();
  },
  toProtoMsg(message: VaultV6): VaultV6ProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.VaultV6",
      value: VaultV6.encode(message).finish()
    };
  }
};