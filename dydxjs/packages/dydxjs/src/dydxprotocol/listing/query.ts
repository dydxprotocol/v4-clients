//@ts-nocheck
import { ListingVaultDepositParams, ListingVaultDepositParamsAmino, ListingVaultDepositParamsSDKType } from "./params";
import { BinaryReader, BinaryWriter } from "../../binary";
/** Queries for the hard cap on listed markets */
export interface QueryMarketsHardCap {}
export interface QueryMarketsHardCapProtoMsg {
  typeUrl: "/dydxprotocol.listing.QueryMarketsHardCap";
  value: Uint8Array;
}
/** Queries for the hard cap on listed markets */
export interface QueryMarketsHardCapAmino {}
export interface QueryMarketsHardCapAminoMsg {
  type: "/dydxprotocol.listing.QueryMarketsHardCap";
  value: QueryMarketsHardCapAmino;
}
/** Queries for the hard cap on listed markets */
export interface QueryMarketsHardCapSDKType {}
/** Response type indicating the hard cap on listed markets */
export interface QueryMarketsHardCapResponse {
  hardCap: number;
}
export interface QueryMarketsHardCapResponseProtoMsg {
  typeUrl: "/dydxprotocol.listing.QueryMarketsHardCapResponse";
  value: Uint8Array;
}
/** Response type indicating the hard cap on listed markets */
export interface QueryMarketsHardCapResponseAmino {
  hard_cap?: number;
}
export interface QueryMarketsHardCapResponseAminoMsg {
  type: "/dydxprotocol.listing.QueryMarketsHardCapResponse";
  value: QueryMarketsHardCapResponseAmino;
}
/** Response type indicating the hard cap on listed markets */
export interface QueryMarketsHardCapResponseSDKType {
  hard_cap: number;
}
/** Queries the listing vault deposit params */
export interface QueryListingVaultDepositParams {}
export interface QueryListingVaultDepositParamsProtoMsg {
  typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParams";
  value: Uint8Array;
}
/** Queries the listing vault deposit params */
export interface QueryListingVaultDepositParamsAmino {}
export interface QueryListingVaultDepositParamsAminoMsg {
  type: "/dydxprotocol.listing.QueryListingVaultDepositParams";
  value: QueryListingVaultDepositParamsAmino;
}
/** Queries the listing vault deposit params */
export interface QueryListingVaultDepositParamsSDKType {}
/** Response type for QueryListingVaultDepositParams */
export interface QueryListingVaultDepositParamsResponse {
  params: ListingVaultDepositParams;
}
export interface QueryListingVaultDepositParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParamsResponse";
  value: Uint8Array;
}
/** Response type for QueryListingVaultDepositParams */
export interface QueryListingVaultDepositParamsResponseAmino {
  params?: ListingVaultDepositParamsAmino;
}
export interface QueryListingVaultDepositParamsResponseAminoMsg {
  type: "/dydxprotocol.listing.QueryListingVaultDepositParamsResponse";
  value: QueryListingVaultDepositParamsResponseAmino;
}
/** Response type for QueryListingVaultDepositParams */
export interface QueryListingVaultDepositParamsResponseSDKType {
  params: ListingVaultDepositParamsSDKType;
}
function createBaseQueryMarketsHardCap(): QueryMarketsHardCap {
  return {};
}
export const QueryMarketsHardCap = {
  typeUrl: "/dydxprotocol.listing.QueryMarketsHardCap",
  encode(_: QueryMarketsHardCap, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketsHardCap {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketsHardCap();
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
  fromPartial(_: Partial<QueryMarketsHardCap>): QueryMarketsHardCap {
    const message = createBaseQueryMarketsHardCap();
    return message;
  },
  fromAmino(_: QueryMarketsHardCapAmino): QueryMarketsHardCap {
    const message = createBaseQueryMarketsHardCap();
    return message;
  },
  toAmino(_: QueryMarketsHardCap): QueryMarketsHardCapAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryMarketsHardCapAminoMsg): QueryMarketsHardCap {
    return QueryMarketsHardCap.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketsHardCapProtoMsg): QueryMarketsHardCap {
    return QueryMarketsHardCap.decode(message.value);
  },
  toProto(message: QueryMarketsHardCap): Uint8Array {
    return QueryMarketsHardCap.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketsHardCap): QueryMarketsHardCapProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.QueryMarketsHardCap",
      value: QueryMarketsHardCap.encode(message).finish()
    };
  }
};
function createBaseQueryMarketsHardCapResponse(): QueryMarketsHardCapResponse {
  return {
    hardCap: 0
  };
}
export const QueryMarketsHardCapResponse = {
  typeUrl: "/dydxprotocol.listing.QueryMarketsHardCapResponse",
  encode(message: QueryMarketsHardCapResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.hardCap !== 0) {
      writer.uint32(8).uint32(message.hardCap);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketsHardCapResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketsHardCapResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hardCap = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMarketsHardCapResponse>): QueryMarketsHardCapResponse {
    const message = createBaseQueryMarketsHardCapResponse();
    message.hardCap = object.hardCap ?? 0;
    return message;
  },
  fromAmino(object: QueryMarketsHardCapResponseAmino): QueryMarketsHardCapResponse {
    const message = createBaseQueryMarketsHardCapResponse();
    if (object.hard_cap !== undefined && object.hard_cap !== null) {
      message.hardCap = object.hard_cap;
    }
    return message;
  },
  toAmino(message: QueryMarketsHardCapResponse): QueryMarketsHardCapResponseAmino {
    const obj: any = {};
    obj.hard_cap = message.hardCap === 0 ? undefined : message.hardCap;
    return obj;
  },
  fromAminoMsg(object: QueryMarketsHardCapResponseAminoMsg): QueryMarketsHardCapResponse {
    return QueryMarketsHardCapResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketsHardCapResponseProtoMsg): QueryMarketsHardCapResponse {
    return QueryMarketsHardCapResponse.decode(message.value);
  },
  toProto(message: QueryMarketsHardCapResponse): Uint8Array {
    return QueryMarketsHardCapResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketsHardCapResponse): QueryMarketsHardCapResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.QueryMarketsHardCapResponse",
      value: QueryMarketsHardCapResponse.encode(message).finish()
    };
  }
};
function createBaseQueryListingVaultDepositParams(): QueryListingVaultDepositParams {
  return {};
}
export const QueryListingVaultDepositParams = {
  typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParams",
  encode(_: QueryListingVaultDepositParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryListingVaultDepositParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryListingVaultDepositParams();
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
  fromPartial(_: Partial<QueryListingVaultDepositParams>): QueryListingVaultDepositParams {
    const message = createBaseQueryListingVaultDepositParams();
    return message;
  },
  fromAmino(_: QueryListingVaultDepositParamsAmino): QueryListingVaultDepositParams {
    const message = createBaseQueryListingVaultDepositParams();
    return message;
  },
  toAmino(_: QueryListingVaultDepositParams): QueryListingVaultDepositParamsAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryListingVaultDepositParamsAminoMsg): QueryListingVaultDepositParams {
    return QueryListingVaultDepositParams.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryListingVaultDepositParamsProtoMsg): QueryListingVaultDepositParams {
    return QueryListingVaultDepositParams.decode(message.value);
  },
  toProto(message: QueryListingVaultDepositParams): Uint8Array {
    return QueryListingVaultDepositParams.encode(message).finish();
  },
  toProtoMsg(message: QueryListingVaultDepositParams): QueryListingVaultDepositParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParams",
      value: QueryListingVaultDepositParams.encode(message).finish()
    };
  }
};
function createBaseQueryListingVaultDepositParamsResponse(): QueryListingVaultDepositParamsResponse {
  return {
    params: ListingVaultDepositParams.fromPartial({})
  };
}
export const QueryListingVaultDepositParamsResponse = {
  typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParamsResponse",
  encode(message: QueryListingVaultDepositParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      ListingVaultDepositParams.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryListingVaultDepositParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryListingVaultDepositParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = ListingVaultDepositParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryListingVaultDepositParamsResponse>): QueryListingVaultDepositParamsResponse {
    const message = createBaseQueryListingVaultDepositParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? ListingVaultDepositParams.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: QueryListingVaultDepositParamsResponseAmino): QueryListingVaultDepositParamsResponse {
    const message = createBaseQueryListingVaultDepositParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = ListingVaultDepositParams.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: QueryListingVaultDepositParamsResponse): QueryListingVaultDepositParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? ListingVaultDepositParams.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryListingVaultDepositParamsResponseAminoMsg): QueryListingVaultDepositParamsResponse {
    return QueryListingVaultDepositParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryListingVaultDepositParamsResponseProtoMsg): QueryListingVaultDepositParamsResponse {
    return QueryListingVaultDepositParamsResponse.decode(message.value);
  },
  toProto(message: QueryListingVaultDepositParamsResponse): Uint8Array {
    return QueryListingVaultDepositParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryListingVaultDepositParamsResponse): QueryListingVaultDepositParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.QueryListingVaultDepositParamsResponse",
      value: QueryListingVaultDepositParamsResponse.encode(message).finish()
    };
  }
};