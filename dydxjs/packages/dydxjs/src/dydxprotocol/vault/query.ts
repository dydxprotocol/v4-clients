//@ts-nocheck
import { VaultType, VaultId, VaultIdAmino, VaultIdSDKType } from "./vault";
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../cosmos/base/query/v1beta1/pagination";
import { Params, ParamsAmino, ParamsSDKType, QuotingParams, QuotingParamsAmino, QuotingParamsSDKType, VaultParams, VaultParamsAmino, VaultParamsSDKType } from "./params";
import { SubaccountId, SubaccountIdAmino, SubaccountIdSDKType } from "../subaccounts/subaccount";
import { NumShares, NumSharesAmino, NumSharesSDKType, OwnerShare, OwnerShareAmino, OwnerShareSDKType } from "./share";
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/** QueryParamsRequest is a request type for the Params RPC method. */
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryParamsRequest";
  value: Uint8Array;
}
/** QueryParamsRequest is a request type for the Params RPC method. */
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/dydxprotocol.vault.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
/** QueryParamsRequest is a request type for the Params RPC method. */
export interface QueryParamsRequestSDKType {}
/** QueryParamsResponse is a response type for the Params RPC method. */
export interface QueryParamsResponse {
  /** Deprecated since v6.x in favor of default_quoting_params. */
  /** @deprecated */
  params: Params;
  defaultQuotingParams: QuotingParams;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryParamsResponse";
  value: Uint8Array;
}
/** QueryParamsResponse is a response type for the Params RPC method. */
export interface QueryParamsResponseAmino {
  /** Deprecated since v6.x in favor of default_quoting_params. */
  /** @deprecated */
  params?: ParamsAmino;
  default_quoting_params?: QuotingParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/dydxprotocol.vault.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
/** QueryParamsResponse is a response type for the Params RPC method. */
export interface QueryParamsResponseSDKType {
  /** @deprecated */
  params: ParamsSDKType;
  default_quoting_params: QuotingParamsSDKType;
}
/** QueryVaultRequest is a request type for the Vault RPC method. */
export interface QueryVaultRequest {
  type: VaultType;
  number: number;
}
export interface QueryVaultRequestProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryVaultRequest";
  value: Uint8Array;
}
/** QueryVaultRequest is a request type for the Vault RPC method. */
export interface QueryVaultRequestAmino {
  type?: VaultType;
  number?: number;
}
export interface QueryVaultRequestAminoMsg {
  type: "/dydxprotocol.vault.QueryVaultRequest";
  value: QueryVaultRequestAmino;
}
/** QueryVaultRequest is a request type for the Vault RPC method. */
export interface QueryVaultRequestSDKType {
  type: VaultType;
  number: number;
}
/** QueryVaultResponse is a response type for the Vault RPC method. */
export interface QueryVaultResponse {
  vaultId: VaultId;
  subaccountId: SubaccountId;
  equity: Uint8Array;
  inventory: Uint8Array;
  vaultParams: VaultParams;
}
export interface QueryVaultResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryVaultResponse";
  value: Uint8Array;
}
/** QueryVaultResponse is a response type for the Vault RPC method. */
export interface QueryVaultResponseAmino {
  vault_id?: VaultIdAmino;
  subaccount_id?: SubaccountIdAmino;
  equity?: string;
  inventory?: string;
  vault_params?: VaultParamsAmino;
}
export interface QueryVaultResponseAminoMsg {
  type: "/dydxprotocol.vault.QueryVaultResponse";
  value: QueryVaultResponseAmino;
}
/** QueryVaultResponse is a response type for the Vault RPC method. */
export interface QueryVaultResponseSDKType {
  vault_id: VaultIdSDKType;
  subaccount_id: SubaccountIdSDKType;
  equity: Uint8Array;
  inventory: Uint8Array;
  vault_params: VaultParamsSDKType;
}
/** QueryAllVaultsRequest is a request type for the AllVaults RPC method. */
export interface QueryAllVaultsRequest {
  pagination?: PageRequest;
}
export interface QueryAllVaultsRequestProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryAllVaultsRequest";
  value: Uint8Array;
}
/** QueryAllVaultsRequest is a request type for the AllVaults RPC method. */
export interface QueryAllVaultsRequestAmino {
  pagination?: PageRequestAmino;
}
export interface QueryAllVaultsRequestAminoMsg {
  type: "/dydxprotocol.vault.QueryAllVaultsRequest";
  value: QueryAllVaultsRequestAmino;
}
/** QueryAllVaultsRequest is a request type for the AllVaults RPC method. */
export interface QueryAllVaultsRequestSDKType {
  pagination?: PageRequestSDKType;
}
/** QueryAllVaultsResponse is a response type for the AllVaults RPC method. */
export interface QueryAllVaultsResponse {
  vaults: QueryVaultResponse[];
  pagination?: PageResponse;
}
export interface QueryAllVaultsResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryAllVaultsResponse";
  value: Uint8Array;
}
/** QueryAllVaultsResponse is a response type for the AllVaults RPC method. */
export interface QueryAllVaultsResponseAmino {
  vaults?: QueryVaultResponseAmino[];
  pagination?: PageResponseAmino;
}
export interface QueryAllVaultsResponseAminoMsg {
  type: "/dydxprotocol.vault.QueryAllVaultsResponse";
  value: QueryAllVaultsResponseAmino;
}
/** QueryAllVaultsResponse is a response type for the AllVaults RPC method. */
export interface QueryAllVaultsResponseSDKType {
  vaults: QueryVaultResponseSDKType[];
  pagination?: PageResponseSDKType;
}
/**
 * QueryMegavaultTotalSharesRequest is a request type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesRequest {}
export interface QueryMegavaultTotalSharesRequestProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesRequest";
  value: Uint8Array;
}
/**
 * QueryMegavaultTotalSharesRequest is a request type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesRequestAmino {}
export interface QueryMegavaultTotalSharesRequestAminoMsg {
  type: "/dydxprotocol.vault.QueryMegavaultTotalSharesRequest";
  value: QueryMegavaultTotalSharesRequestAmino;
}
/**
 * QueryMegavaultTotalSharesRequest is a request type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesRequestSDKType {}
/**
 * QueryMegavaultTotalSharesResponse is a response type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesResponse {
  totalShares?: NumShares;
}
export interface QueryMegavaultTotalSharesResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesResponse";
  value: Uint8Array;
}
/**
 * QueryMegavaultTotalSharesResponse is a response type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesResponseAmino {
  total_shares?: NumSharesAmino;
}
export interface QueryMegavaultTotalSharesResponseAminoMsg {
  type: "/dydxprotocol.vault.QueryMegavaultTotalSharesResponse";
  value: QueryMegavaultTotalSharesResponseAmino;
}
/**
 * QueryMegavaultTotalSharesResponse is a response type for the
 * MegavaultTotalShares RPC method.
 */
export interface QueryMegavaultTotalSharesResponseSDKType {
  total_shares?: NumSharesSDKType;
}
/**
 * QueryMegavaultOwnerSharesRequest is a request type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesRequest {
  pagination?: PageRequest;
}
export interface QueryMegavaultOwnerSharesRequestProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesRequest";
  value: Uint8Array;
}
/**
 * QueryMegavaultOwnerSharesRequest is a request type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesRequestAmino {
  pagination?: PageRequestAmino;
}
export interface QueryMegavaultOwnerSharesRequestAminoMsg {
  type: "/dydxprotocol.vault.QueryMegavaultOwnerSharesRequest";
  value: QueryMegavaultOwnerSharesRequestAmino;
}
/**
 * QueryMegavaultOwnerSharesRequest is a request type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesRequestSDKType {
  pagination?: PageRequestSDKType;
}
/**
 * QueryMegavaultOwnerSharesResponse is a response type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesResponse {
  ownerShares: OwnerShare[];
  pagination?: PageResponse;
}
export interface QueryMegavaultOwnerSharesResponseProtoMsg {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesResponse";
  value: Uint8Array;
}
/**
 * QueryMegavaultOwnerSharesResponse is a response type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesResponseAmino {
  owner_shares?: OwnerShareAmino[];
  pagination?: PageResponseAmino;
}
export interface QueryMegavaultOwnerSharesResponseAminoMsg {
  type: "/dydxprotocol.vault.QueryMegavaultOwnerSharesResponse";
  value: QueryMegavaultOwnerSharesResponseAmino;
}
/**
 * QueryMegavaultOwnerSharesResponse is a response type for the
 * MegavaultOwnerShares RPC method.
 */
export interface QueryMegavaultOwnerSharesResponseSDKType {
  owner_shares: OwnerShareSDKType[];
  pagination?: PageResponseSDKType;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/dydxprotocol.vault.QueryParamsRequest",
  encode(_: QueryParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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
  fromPartial(_: Partial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  fromAmino(_: QueryParamsRequestAmino): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  toAmino(_: QueryParamsRequest): QueryParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryParamsRequestAminoMsg): QueryParamsRequest {
    return QueryParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsRequestProtoMsg): QueryParamsRequest {
    return QueryParamsRequest.decode(message.value);
  },
  toProto(message: QueryParamsRequest): Uint8Array {
    return QueryParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsRequest): QueryParamsRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: Params.fromPartial({}),
    defaultQuotingParams: QuotingParams.fromPartial({})
  };
}
export const QueryParamsResponse = {
  typeUrl: "/dydxprotocol.vault.QueryParamsResponse",
  encode(message: QueryParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.defaultQuotingParams !== undefined) {
      QuotingParams.encode(message.defaultQuotingParams, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
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
  fromPartial(object: Partial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.defaultQuotingParams = object.defaultQuotingParams !== undefined && object.defaultQuotingParams !== null ? QuotingParams.fromPartial(object.defaultQuotingParams) : undefined;
    return message;
  },
  fromAmino(object: QueryParamsResponseAmino): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    if (object.default_quoting_params !== undefined && object.default_quoting_params !== null) {
      message.defaultQuotingParams = QuotingParams.fromAmino(object.default_quoting_params);
    }
    return message;
  },
  toAmino(message: QueryParamsResponse): QueryParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    obj.default_quoting_params = message.defaultQuotingParams ? QuotingParams.toAmino(message.defaultQuotingParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryParamsResponseAminoMsg): QueryParamsResponse {
    return QueryParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsResponseProtoMsg): QueryParamsResponse {
    return QueryParamsResponse.decode(message.value);
  },
  toProto(message: QueryParamsResponse): Uint8Array {
    return QueryParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsResponse): QueryParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryVaultRequest(): QueryVaultRequest {
  return {
    type: 0,
    number: 0
  };
}
export const QueryVaultRequest = {
  typeUrl: "/dydxprotocol.vault.QueryVaultRequest",
  encode(message: QueryVaultRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.number !== 0) {
      writer.uint32(16).uint32(message.number);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryVaultRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryVaultRequest();
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
  fromPartial(object: Partial<QueryVaultRequest>): QueryVaultRequest {
    const message = createBaseQueryVaultRequest();
    message.type = object.type ?? 0;
    message.number = object.number ?? 0;
    return message;
  },
  fromAmino(object: QueryVaultRequestAmino): QueryVaultRequest {
    const message = createBaseQueryVaultRequest();
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    }
    if (object.number !== undefined && object.number !== null) {
      message.number = object.number;
    }
    return message;
  },
  toAmino(message: QueryVaultRequest): QueryVaultRequestAmino {
    const obj: any = {};
    obj.type = message.type === 0 ? undefined : message.type;
    obj.number = message.number === 0 ? undefined : message.number;
    return obj;
  },
  fromAminoMsg(object: QueryVaultRequestAminoMsg): QueryVaultRequest {
    return QueryVaultRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryVaultRequestProtoMsg): QueryVaultRequest {
    return QueryVaultRequest.decode(message.value);
  },
  toProto(message: QueryVaultRequest): Uint8Array {
    return QueryVaultRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryVaultRequest): QueryVaultRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryVaultRequest",
      value: QueryVaultRequest.encode(message).finish()
    };
  }
};
function createBaseQueryVaultResponse(): QueryVaultResponse {
  return {
    vaultId: VaultId.fromPartial({}),
    subaccountId: SubaccountId.fromPartial({}),
    equity: new Uint8Array(),
    inventory: new Uint8Array(),
    vaultParams: VaultParams.fromPartial({})
  };
}
export const QueryVaultResponse = {
  typeUrl: "/dydxprotocol.vault.QueryVaultResponse",
  encode(message: QueryVaultResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.vaultId !== undefined) {
      VaultId.encode(message.vaultId, writer.uint32(10).fork()).ldelim();
    }
    if (message.subaccountId !== undefined) {
      SubaccountId.encode(message.subaccountId, writer.uint32(18).fork()).ldelim();
    }
    if (message.equity.length !== 0) {
      writer.uint32(26).bytes(message.equity);
    }
    if (message.inventory.length !== 0) {
      writer.uint32(34).bytes(message.inventory);
    }
    if (message.vaultParams !== undefined) {
      VaultParams.encode(message.vaultParams, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryVaultResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryVaultResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vaultId = VaultId.decode(reader, reader.uint32());
          break;
        case 2:
          message.subaccountId = SubaccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.equity = reader.bytes();
          break;
        case 4:
          message.inventory = reader.bytes();
          break;
        case 5:
          message.vaultParams = VaultParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryVaultResponse>): QueryVaultResponse {
    const message = createBaseQueryVaultResponse();
    message.vaultId = object.vaultId !== undefined && object.vaultId !== null ? VaultId.fromPartial(object.vaultId) : undefined;
    message.subaccountId = object.subaccountId !== undefined && object.subaccountId !== null ? SubaccountId.fromPartial(object.subaccountId) : undefined;
    message.equity = object.equity ?? new Uint8Array();
    message.inventory = object.inventory ?? new Uint8Array();
    message.vaultParams = object.vaultParams !== undefined && object.vaultParams !== null ? VaultParams.fromPartial(object.vaultParams) : undefined;
    return message;
  },
  fromAmino(object: QueryVaultResponseAmino): QueryVaultResponse {
    const message = createBaseQueryVaultResponse();
    if (object.vault_id !== undefined && object.vault_id !== null) {
      message.vaultId = VaultId.fromAmino(object.vault_id);
    }
    if (object.subaccount_id !== undefined && object.subaccount_id !== null) {
      message.subaccountId = SubaccountId.fromAmino(object.subaccount_id);
    }
    if (object.equity !== undefined && object.equity !== null) {
      message.equity = bytesFromBase64(object.equity);
    }
    if (object.inventory !== undefined && object.inventory !== null) {
      message.inventory = bytesFromBase64(object.inventory);
    }
    if (object.vault_params !== undefined && object.vault_params !== null) {
      message.vaultParams = VaultParams.fromAmino(object.vault_params);
    }
    return message;
  },
  toAmino(message: QueryVaultResponse): QueryVaultResponseAmino {
    const obj: any = {};
    obj.vault_id = message.vaultId ? VaultId.toAmino(message.vaultId) : undefined;
    obj.subaccount_id = message.subaccountId ? SubaccountId.toAmino(message.subaccountId) : undefined;
    obj.equity = message.equity ? base64FromBytes(message.equity) : undefined;
    obj.inventory = message.inventory ? base64FromBytes(message.inventory) : undefined;
    obj.vault_params = message.vaultParams ? VaultParams.toAmino(message.vaultParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryVaultResponseAminoMsg): QueryVaultResponse {
    return QueryVaultResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryVaultResponseProtoMsg): QueryVaultResponse {
    return QueryVaultResponse.decode(message.value);
  },
  toProto(message: QueryVaultResponse): Uint8Array {
    return QueryVaultResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryVaultResponse): QueryVaultResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryVaultResponse",
      value: QueryVaultResponse.encode(message).finish()
    };
  }
};
function createBaseQueryAllVaultsRequest(): QueryAllVaultsRequest {
  return {
    pagination: undefined
  };
}
export const QueryAllVaultsRequest = {
  typeUrl: "/dydxprotocol.vault.QueryAllVaultsRequest",
  encode(message: QueryAllVaultsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllVaultsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllVaultsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryAllVaultsRequest>): QueryAllVaultsRequest {
    const message = createBaseQueryAllVaultsRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryAllVaultsRequestAmino): QueryAllVaultsRequest {
    const message = createBaseQueryAllVaultsRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryAllVaultsRequest): QueryAllVaultsRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryAllVaultsRequestAminoMsg): QueryAllVaultsRequest {
    return QueryAllVaultsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryAllVaultsRequestProtoMsg): QueryAllVaultsRequest {
    return QueryAllVaultsRequest.decode(message.value);
  },
  toProto(message: QueryAllVaultsRequest): Uint8Array {
    return QueryAllVaultsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryAllVaultsRequest): QueryAllVaultsRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryAllVaultsRequest",
      value: QueryAllVaultsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryAllVaultsResponse(): QueryAllVaultsResponse {
  return {
    vaults: [],
    pagination: undefined
  };
}
export const QueryAllVaultsResponse = {
  typeUrl: "/dydxprotocol.vault.QueryAllVaultsResponse",
  encode(message: QueryAllVaultsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.vaults) {
      QueryVaultResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllVaultsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllVaultsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vaults.push(QueryVaultResponse.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryAllVaultsResponse>): QueryAllVaultsResponse {
    const message = createBaseQueryAllVaultsResponse();
    message.vaults = object.vaults?.map(e => QueryVaultResponse.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryAllVaultsResponseAmino): QueryAllVaultsResponse {
    const message = createBaseQueryAllVaultsResponse();
    message.vaults = object.vaults?.map(e => QueryVaultResponse.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryAllVaultsResponse): QueryAllVaultsResponseAmino {
    const obj: any = {};
    if (message.vaults) {
      obj.vaults = message.vaults.map(e => e ? QueryVaultResponse.toAmino(e) : undefined);
    } else {
      obj.vaults = message.vaults;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryAllVaultsResponseAminoMsg): QueryAllVaultsResponse {
    return QueryAllVaultsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryAllVaultsResponseProtoMsg): QueryAllVaultsResponse {
    return QueryAllVaultsResponse.decode(message.value);
  },
  toProto(message: QueryAllVaultsResponse): Uint8Array {
    return QueryAllVaultsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryAllVaultsResponse): QueryAllVaultsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryAllVaultsResponse",
      value: QueryAllVaultsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryMegavaultTotalSharesRequest(): QueryMegavaultTotalSharesRequest {
  return {};
}
export const QueryMegavaultTotalSharesRequest = {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesRequest",
  encode(_: QueryMegavaultTotalSharesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMegavaultTotalSharesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMegavaultTotalSharesRequest();
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
  fromPartial(_: Partial<QueryMegavaultTotalSharesRequest>): QueryMegavaultTotalSharesRequest {
    const message = createBaseQueryMegavaultTotalSharesRequest();
    return message;
  },
  fromAmino(_: QueryMegavaultTotalSharesRequestAmino): QueryMegavaultTotalSharesRequest {
    const message = createBaseQueryMegavaultTotalSharesRequest();
    return message;
  },
  toAmino(_: QueryMegavaultTotalSharesRequest): QueryMegavaultTotalSharesRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryMegavaultTotalSharesRequestAminoMsg): QueryMegavaultTotalSharesRequest {
    return QueryMegavaultTotalSharesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMegavaultTotalSharesRequestProtoMsg): QueryMegavaultTotalSharesRequest {
    return QueryMegavaultTotalSharesRequest.decode(message.value);
  },
  toProto(message: QueryMegavaultTotalSharesRequest): Uint8Array {
    return QueryMegavaultTotalSharesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryMegavaultTotalSharesRequest): QueryMegavaultTotalSharesRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesRequest",
      value: QueryMegavaultTotalSharesRequest.encode(message).finish()
    };
  }
};
function createBaseQueryMegavaultTotalSharesResponse(): QueryMegavaultTotalSharesResponse {
  return {
    totalShares: undefined
  };
}
export const QueryMegavaultTotalSharesResponse = {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesResponse",
  encode(message: QueryMegavaultTotalSharesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.totalShares !== undefined) {
      NumShares.encode(message.totalShares, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMegavaultTotalSharesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMegavaultTotalSharesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.totalShares = NumShares.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMegavaultTotalSharesResponse>): QueryMegavaultTotalSharesResponse {
    const message = createBaseQueryMegavaultTotalSharesResponse();
    message.totalShares = object.totalShares !== undefined && object.totalShares !== null ? NumShares.fromPartial(object.totalShares) : undefined;
    return message;
  },
  fromAmino(object: QueryMegavaultTotalSharesResponseAmino): QueryMegavaultTotalSharesResponse {
    const message = createBaseQueryMegavaultTotalSharesResponse();
    if (object.total_shares !== undefined && object.total_shares !== null) {
      message.totalShares = NumShares.fromAmino(object.total_shares);
    }
    return message;
  },
  toAmino(message: QueryMegavaultTotalSharesResponse): QueryMegavaultTotalSharesResponseAmino {
    const obj: any = {};
    obj.total_shares = message.totalShares ? NumShares.toAmino(message.totalShares) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMegavaultTotalSharesResponseAminoMsg): QueryMegavaultTotalSharesResponse {
    return QueryMegavaultTotalSharesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMegavaultTotalSharesResponseProtoMsg): QueryMegavaultTotalSharesResponse {
    return QueryMegavaultTotalSharesResponse.decode(message.value);
  },
  toProto(message: QueryMegavaultTotalSharesResponse): Uint8Array {
    return QueryMegavaultTotalSharesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMegavaultTotalSharesResponse): QueryMegavaultTotalSharesResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryMegavaultTotalSharesResponse",
      value: QueryMegavaultTotalSharesResponse.encode(message).finish()
    };
  }
};
function createBaseQueryMegavaultOwnerSharesRequest(): QueryMegavaultOwnerSharesRequest {
  return {
    pagination: undefined
  };
}
export const QueryMegavaultOwnerSharesRequest = {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesRequest",
  encode(message: QueryMegavaultOwnerSharesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMegavaultOwnerSharesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMegavaultOwnerSharesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMegavaultOwnerSharesRequest>): QueryMegavaultOwnerSharesRequest {
    const message = createBaseQueryMegavaultOwnerSharesRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryMegavaultOwnerSharesRequestAmino): QueryMegavaultOwnerSharesRequest {
    const message = createBaseQueryMegavaultOwnerSharesRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryMegavaultOwnerSharesRequest): QueryMegavaultOwnerSharesRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMegavaultOwnerSharesRequestAminoMsg): QueryMegavaultOwnerSharesRequest {
    return QueryMegavaultOwnerSharesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMegavaultOwnerSharesRequestProtoMsg): QueryMegavaultOwnerSharesRequest {
    return QueryMegavaultOwnerSharesRequest.decode(message.value);
  },
  toProto(message: QueryMegavaultOwnerSharesRequest): Uint8Array {
    return QueryMegavaultOwnerSharesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryMegavaultOwnerSharesRequest): QueryMegavaultOwnerSharesRequestProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesRequest",
      value: QueryMegavaultOwnerSharesRequest.encode(message).finish()
    };
  }
};
function createBaseQueryMegavaultOwnerSharesResponse(): QueryMegavaultOwnerSharesResponse {
  return {
    ownerShares: [],
    pagination: undefined
  };
}
export const QueryMegavaultOwnerSharesResponse = {
  typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesResponse",
  encode(message: QueryMegavaultOwnerSharesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.ownerShares) {
      OwnerShare.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMegavaultOwnerSharesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMegavaultOwnerSharesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ownerShares.push(OwnerShare.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMegavaultOwnerSharesResponse>): QueryMegavaultOwnerSharesResponse {
    const message = createBaseQueryMegavaultOwnerSharesResponse();
    message.ownerShares = object.ownerShares?.map(e => OwnerShare.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryMegavaultOwnerSharesResponseAmino): QueryMegavaultOwnerSharesResponse {
    const message = createBaseQueryMegavaultOwnerSharesResponse();
    message.ownerShares = object.owner_shares?.map(e => OwnerShare.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryMegavaultOwnerSharesResponse): QueryMegavaultOwnerSharesResponseAmino {
    const obj: any = {};
    if (message.ownerShares) {
      obj.owner_shares = message.ownerShares.map(e => e ? OwnerShare.toAmino(e) : undefined);
    } else {
      obj.owner_shares = message.ownerShares;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMegavaultOwnerSharesResponseAminoMsg): QueryMegavaultOwnerSharesResponse {
    return QueryMegavaultOwnerSharesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMegavaultOwnerSharesResponseProtoMsg): QueryMegavaultOwnerSharesResponse {
    return QueryMegavaultOwnerSharesResponse.decode(message.value);
  },
  toProto(message: QueryMegavaultOwnerSharesResponse): Uint8Array {
    return QueryMegavaultOwnerSharesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMegavaultOwnerSharesResponse): QueryMegavaultOwnerSharesResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.vault.QueryMegavaultOwnerSharesResponse",
      value: QueryMegavaultOwnerSharesResponse.encode(message).finish()
    };
  }
};