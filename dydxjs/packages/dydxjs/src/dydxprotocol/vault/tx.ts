//@ts-nocheck
import { SubaccountId, SubaccountIdAmino, SubaccountIdSDKType } from "../subaccounts/subaccount";
import { QuotingParams, QuotingParamsAmino, QuotingParamsSDKType, VaultParams, VaultParamsAmino, VaultParamsSDKType } from "./params";
import { VaultId, VaultIdAmino, VaultIdSDKType } from "./vault";
import { NumShares, NumSharesAmino, NumSharesSDKType } from "./share";
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/**
 * MsgDepositToMegavault deposits the specified asset from the subaccount to
 * megavault.
 */
export interface MsgDepositToMegavault {
  /** The subaccount to deposit from. */
  subaccountId?: SubaccountId;
  /** Number of quote quantums to deposit. */
  quoteQuantums: Uint8Array;
}
export interface MsgDepositToMegavaultProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault";
  value: Uint8Array;
}
/**
 * MsgDepositToMegavault deposits the specified asset from the subaccount to
 * megavault.
 */
export interface MsgDepositToMegavaultAmino {
  /** The subaccount to deposit from. */
  subaccount_id?: SubaccountIdAmino;
  /** Number of quote quantums to deposit. */
  quote_quantums?: string;
}
export interface MsgDepositToMegavaultAminoMsg {
  type: "/dydxprotocol.vault.MsgDepositToMegavault";
  value: MsgDepositToMegavaultAmino;
}
/**
 * MsgDepositToMegavault deposits the specified asset from the subaccount to
 * megavault.
 */
export interface MsgDepositToMegavaultSDKType {
  subaccount_id?: SubaccountIdSDKType;
  quote_quantums: Uint8Array;
}
/** MsgDepositToMegavaultResponse is the Msg/DepositToMegavault response type. */
export interface MsgDepositToMegavaultResponse {
  /** The number of shares minted from the deposit. */
  mintedShares: NumShares;
}
export interface MsgDepositToMegavaultResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgDepositToMegavaultResponse";
  value: Uint8Array;
}
/** MsgDepositToMegavaultResponse is the Msg/DepositToMegavault response type. */
export interface MsgDepositToMegavaultResponseAmino {
  /** The number of shares minted from the deposit. */
  minted_shares?: NumSharesAmino;
}
export interface MsgDepositToMegavaultResponseAminoMsg {
  type: "/dydxprotocol.vault.MsgDepositToMegavaultResponse";
  value: MsgDepositToMegavaultResponseAmino;
}
/** MsgDepositToMegavaultResponse is the Msg/DepositToMegavault response type. */
export interface MsgDepositToMegavaultResponseSDKType {
  minted_shares: NumSharesSDKType;
}
/**
 * MsgUpdateDefaultQuotingParams is the Msg/UpdateDefaultQuotingParams request
 * type.
 */
export interface MsgUpdateDefaultQuotingParams {
  authority: string;
  /** The quoting parameters to update to. Every field must be set. */
  defaultQuotingParams: QuotingParams;
}
export interface MsgUpdateDefaultQuotingParamsProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams";
  value: Uint8Array;
}
/**
 * MsgUpdateDefaultQuotingParams is the Msg/UpdateDefaultQuotingParams request
 * type.
 */
export interface MsgUpdateDefaultQuotingParamsAmino {
  authority?: string;
  /** The quoting parameters to update to. Every field must be set. */
  default_quoting_params?: QuotingParamsAmino;
}
export interface MsgUpdateDefaultQuotingParamsAminoMsg {
  type: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams";
  value: MsgUpdateDefaultQuotingParamsAmino;
}
/**
 * MsgUpdateDefaultQuotingParams is the Msg/UpdateDefaultQuotingParams request
 * type.
 */
export interface MsgUpdateDefaultQuotingParamsSDKType {
  authority: string;
  default_quoting_params: QuotingParamsSDKType;
}
/**
 * MsgUpdateDefaultQuotingParamsResponse is the Msg/UpdateDefaultQuotingParams
 * response type.
 */
export interface MsgUpdateDefaultQuotingParamsResponse {}
export interface MsgUpdateDefaultQuotingParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParamsResponse";
  value: Uint8Array;
}
/**
 * MsgUpdateDefaultQuotingParamsResponse is the Msg/UpdateDefaultQuotingParams
 * response type.
 */
export interface MsgUpdateDefaultQuotingParamsResponseAmino {}
export interface MsgUpdateDefaultQuotingParamsResponseAminoMsg {
  type: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParamsResponse";
  value: MsgUpdateDefaultQuotingParamsResponseAmino;
}
/**
 * MsgUpdateDefaultQuotingParamsResponse is the Msg/UpdateDefaultQuotingParams
 * response type.
 */
export interface MsgUpdateDefaultQuotingParamsResponseSDKType {}
/** MsgSetVaultParams is the Msg/SetVaultParams request type. */
export interface MsgSetVaultParams {
  authority: string;
  /** The vault to set params of. */
  vaultId: VaultId;
  /** The parameters to set. */
  vaultParams: VaultParams;
}
export interface MsgSetVaultParamsProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgSetVaultParams";
  value: Uint8Array;
}
/** MsgSetVaultParams is the Msg/SetVaultParams request type. */
export interface MsgSetVaultParamsAmino {
  authority?: string;
  /** The vault to set params of. */
  vault_id?: VaultIdAmino;
  /** The parameters to set. */
  vault_params?: VaultParamsAmino;
}
export interface MsgSetVaultParamsAminoMsg {
  type: "/dydxprotocol.vault.MsgSetVaultParams";
  value: MsgSetVaultParamsAmino;
}
/** MsgSetVaultParams is the Msg/SetVaultParams request type. */
export interface MsgSetVaultParamsSDKType {
  authority: string;
  vault_id: VaultIdSDKType;
  vault_params: VaultParamsSDKType;
}
/** MsgSetVaultParamsResponse is the Msg/SetVaultParams response type. */
export interface MsgSetVaultParamsResponse {}
export interface MsgSetVaultParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.MsgSetVaultParamsResponse";
  value: Uint8Array;
}
/** MsgSetVaultParamsResponse is the Msg/SetVaultParams response type. */
export interface MsgSetVaultParamsResponseAmino {}
export interface MsgSetVaultParamsResponseAminoMsg {
  type: "/dydxprotocol.vault.MsgSetVaultParamsResponse";
  value: MsgSetVaultParamsResponseAmino;
}
/** MsgSetVaultParamsResponse is the Msg/SetVaultParams response type. */
export interface MsgSetVaultParamsResponseSDKType {}
function createBaseMsgDepositToMegavault(): MsgDepositToMegavault {
  return {
    subaccountId: undefined,
    quoteQuantums: new Uint8Array()
  };
}
export const MsgDepositToMegavault = {
  typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault",
  encode(message: MsgDepositToMegavault, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.subaccountId !== undefined) {
      SubaccountId.encode(message.subaccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.quoteQuantums.length !== 0) {
      writer.uint32(18).bytes(message.quoteQuantums);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositToMegavault {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositToMegavault();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subaccountId = SubaccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.quoteQuantums = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgDepositToMegavault>): MsgDepositToMegavault {
    const message = createBaseMsgDepositToMegavault();
    message.subaccountId = object.subaccountId !== undefined && object.subaccountId !== null ? SubaccountId.fromPartial(object.subaccountId) : undefined;
    message.quoteQuantums = object.quoteQuantums ?? new Uint8Array();
    return message;
  },
  fromAmino(object: MsgDepositToMegavaultAmino): MsgDepositToMegavault {
    const message = createBaseMsgDepositToMegavault();
    if (object.subaccount_id !== undefined && object.subaccount_id !== null) {
      message.subaccountId = SubaccountId.fromAmino(object.subaccount_id);
    }
    if (object.quote_quantums !== undefined && object.quote_quantums !== null) {
      message.quoteQuantums = bytesFromBase64(object.quote_quantums);
    }
    return message;
  },
  toAmino(message: MsgDepositToMegavault): MsgDepositToMegavaultAmino {
    const obj: any = {};
    obj.subaccount_id = message.subaccountId ? SubaccountId.toAmino(message.subaccountId) : undefined;
    obj.quote_quantums = message.quoteQuantums ? base64FromBytes(message.quoteQuantums) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgDepositToMegavaultAminoMsg): MsgDepositToMegavault {
    return MsgDepositToMegavault.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositToMegavaultProtoMsg): MsgDepositToMegavault {
    return MsgDepositToMegavault.decode(message.value);
  },
  toProto(message: MsgDepositToMegavault): Uint8Array {
    return MsgDepositToMegavault.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositToMegavault): MsgDepositToMegavaultProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault",
      value: MsgDepositToMegavault.encode(message).finish()
    };
  }
};
function createBaseMsgDepositToMegavaultResponse(): MsgDepositToMegavaultResponse {
  return {
    mintedShares: NumShares.fromPartial({})
  };
}
export const MsgDepositToMegavaultResponse = {
  typeUrl: "/dydxprotocol.vault.MsgDepositToMegavaultResponse",
  encode(message: MsgDepositToMegavaultResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.mintedShares !== undefined) {
      NumShares.encode(message.mintedShares, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositToMegavaultResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositToMegavaultResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mintedShares = NumShares.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgDepositToMegavaultResponse>): MsgDepositToMegavaultResponse {
    const message = createBaseMsgDepositToMegavaultResponse();
    message.mintedShares = object.mintedShares !== undefined && object.mintedShares !== null ? NumShares.fromPartial(object.mintedShares) : undefined;
    return message;
  },
  fromAmino(object: MsgDepositToMegavaultResponseAmino): MsgDepositToMegavaultResponse {
    const message = createBaseMsgDepositToMegavaultResponse();
    if (object.minted_shares !== undefined && object.minted_shares !== null) {
      message.mintedShares = NumShares.fromAmino(object.minted_shares);
    }
    return message;
  },
  toAmino(message: MsgDepositToMegavaultResponse): MsgDepositToMegavaultResponseAmino {
    const obj: any = {};
    obj.minted_shares = message.mintedShares ? NumShares.toAmino(message.mintedShares) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgDepositToMegavaultResponseAminoMsg): MsgDepositToMegavaultResponse {
    return MsgDepositToMegavaultResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositToMegavaultResponseProtoMsg): MsgDepositToMegavaultResponse {
    return MsgDepositToMegavaultResponse.decode(message.value);
  },
  toProto(message: MsgDepositToMegavaultResponse): Uint8Array {
    return MsgDepositToMegavaultResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositToMegavaultResponse): MsgDepositToMegavaultResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgDepositToMegavaultResponse",
      value: MsgDepositToMegavaultResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateDefaultQuotingParams(): MsgUpdateDefaultQuotingParams {
  return {
    authority: "",
    defaultQuotingParams: QuotingParams.fromPartial({})
  };
}
export const MsgUpdateDefaultQuotingParams = {
  typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
  encode(message: MsgUpdateDefaultQuotingParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.defaultQuotingParams !== undefined) {
      QuotingParams.encode(message.defaultQuotingParams, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateDefaultQuotingParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateDefaultQuotingParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.defaultQuotingParams = QuotingParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateDefaultQuotingParams>): MsgUpdateDefaultQuotingParams {
    const message = createBaseMsgUpdateDefaultQuotingParams();
    message.authority = object.authority ?? "";
    message.defaultQuotingParams = object.defaultQuotingParams !== undefined && object.defaultQuotingParams !== null ? QuotingParams.fromPartial(object.defaultQuotingParams) : undefined;
    return message;
  },
  fromAmino(object: MsgUpdateDefaultQuotingParamsAmino): MsgUpdateDefaultQuotingParams {
    const message = createBaseMsgUpdateDefaultQuotingParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.default_quoting_params !== undefined && object.default_quoting_params !== null) {
      message.defaultQuotingParams = QuotingParams.fromAmino(object.default_quoting_params);
    }
    return message;
  },
  toAmino(message: MsgUpdateDefaultQuotingParams): MsgUpdateDefaultQuotingParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.default_quoting_params = message.defaultQuotingParams ? QuotingParams.toAmino(message.defaultQuotingParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateDefaultQuotingParamsAminoMsg): MsgUpdateDefaultQuotingParams {
    return MsgUpdateDefaultQuotingParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateDefaultQuotingParamsProtoMsg): MsgUpdateDefaultQuotingParams {
    return MsgUpdateDefaultQuotingParams.decode(message.value);
  },
  toProto(message: MsgUpdateDefaultQuotingParams): Uint8Array {
    return MsgUpdateDefaultQuotingParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateDefaultQuotingParams): MsgUpdateDefaultQuotingParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
      value: MsgUpdateDefaultQuotingParams.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateDefaultQuotingParamsResponse(): MsgUpdateDefaultQuotingParamsResponse {
  return {};
}
export const MsgUpdateDefaultQuotingParamsResponse = {
  typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParamsResponse",
  encode(_: MsgUpdateDefaultQuotingParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateDefaultQuotingParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateDefaultQuotingParamsResponse();
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
  fromPartial(_: Partial<MsgUpdateDefaultQuotingParamsResponse>): MsgUpdateDefaultQuotingParamsResponse {
    const message = createBaseMsgUpdateDefaultQuotingParamsResponse();
    return message;
  },
  fromAmino(_: MsgUpdateDefaultQuotingParamsResponseAmino): MsgUpdateDefaultQuotingParamsResponse {
    const message = createBaseMsgUpdateDefaultQuotingParamsResponse();
    return message;
  },
  toAmino(_: MsgUpdateDefaultQuotingParamsResponse): MsgUpdateDefaultQuotingParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateDefaultQuotingParamsResponseAminoMsg): MsgUpdateDefaultQuotingParamsResponse {
    return MsgUpdateDefaultQuotingParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateDefaultQuotingParamsResponseProtoMsg): MsgUpdateDefaultQuotingParamsResponse {
    return MsgUpdateDefaultQuotingParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateDefaultQuotingParamsResponse): Uint8Array {
    return MsgUpdateDefaultQuotingParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateDefaultQuotingParamsResponse): MsgUpdateDefaultQuotingParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParamsResponse",
      value: MsgUpdateDefaultQuotingParamsResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSetVaultParams(): MsgSetVaultParams {
  return {
    authority: "",
    vaultId: VaultId.fromPartial({}),
    vaultParams: VaultParams.fromPartial({})
  };
}
export const MsgSetVaultParams = {
  typeUrl: "/dydxprotocol.vault.MsgSetVaultParams",
  encode(message: MsgSetVaultParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.vaultId !== undefined) {
      VaultId.encode(message.vaultId, writer.uint32(18).fork()).ldelim();
    }
    if (message.vaultParams !== undefined) {
      VaultParams.encode(message.vaultParams, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetVaultParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetVaultParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.vaultId = VaultId.decode(reader, reader.uint32());
          break;
        case 3:
          message.vaultParams = VaultParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSetVaultParams>): MsgSetVaultParams {
    const message = createBaseMsgSetVaultParams();
    message.authority = object.authority ?? "";
    message.vaultId = object.vaultId !== undefined && object.vaultId !== null ? VaultId.fromPartial(object.vaultId) : undefined;
    message.vaultParams = object.vaultParams !== undefined && object.vaultParams !== null ? VaultParams.fromPartial(object.vaultParams) : undefined;
    return message;
  },
  fromAmino(object: MsgSetVaultParamsAmino): MsgSetVaultParams {
    const message = createBaseMsgSetVaultParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.vault_id !== undefined && object.vault_id !== null) {
      message.vaultId = VaultId.fromAmino(object.vault_id);
    }
    if (object.vault_params !== undefined && object.vault_params !== null) {
      message.vaultParams = VaultParams.fromAmino(object.vault_params);
    }
    return message;
  },
  toAmino(message: MsgSetVaultParams): MsgSetVaultParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.vault_id = message.vaultId ? VaultId.toAmino(message.vaultId) : undefined;
    obj.vault_params = message.vaultParams ? VaultParams.toAmino(message.vaultParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgSetVaultParamsAminoMsg): MsgSetVaultParams {
    return MsgSetVaultParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetVaultParamsProtoMsg): MsgSetVaultParams {
    return MsgSetVaultParams.decode(message.value);
  },
  toProto(message: MsgSetVaultParams): Uint8Array {
    return MsgSetVaultParams.encode(message).finish();
  },
  toProtoMsg(message: MsgSetVaultParams): MsgSetVaultParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgSetVaultParams",
      value: MsgSetVaultParams.encode(message).finish()
    };
  }
};
function createBaseMsgSetVaultParamsResponse(): MsgSetVaultParamsResponse {
  return {};
}
export const MsgSetVaultParamsResponse = {
  typeUrl: "/dydxprotocol.vault.MsgSetVaultParamsResponse",
  encode(_: MsgSetVaultParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSetVaultParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetVaultParamsResponse();
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
  fromPartial(_: Partial<MsgSetVaultParamsResponse>): MsgSetVaultParamsResponse {
    const message = createBaseMsgSetVaultParamsResponse();
    return message;
  },
  fromAmino(_: MsgSetVaultParamsResponseAmino): MsgSetVaultParamsResponse {
    const message = createBaseMsgSetVaultParamsResponse();
    return message;
  },
  toAmino(_: MsgSetVaultParamsResponse): MsgSetVaultParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSetVaultParamsResponseAminoMsg): MsgSetVaultParamsResponse {
    return MsgSetVaultParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSetVaultParamsResponseProtoMsg): MsgSetVaultParamsResponse {
    return MsgSetVaultParamsResponse.decode(message.value);
  },
  toProto(message: MsgSetVaultParamsResponse): Uint8Array {
    return MsgSetVaultParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSetVaultParamsResponse): MsgSetVaultParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.MsgSetVaultParamsResponse",
      value: MsgSetVaultParamsResponse.encode(message).finish()
    };
  }
};