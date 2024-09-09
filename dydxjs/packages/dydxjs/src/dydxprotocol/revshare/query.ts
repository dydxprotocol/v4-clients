//@ts-nocheck
import { MarketMapperRevenueShareParams, MarketMapperRevenueShareParamsAmino, MarketMapperRevenueShareParamsSDKType } from "./params";
import { MarketMapperRevShareDetails, MarketMapperRevShareDetailsAmino, MarketMapperRevShareDetailsSDKType } from "./revshare";
import { BinaryReader, BinaryWriter } from "../../binary";
/** Queries for the default market mapper revenue share params */
export interface QueryMarketMapperRevenueShareParams {}
export interface QueryMarketMapperRevenueShareParamsProtoMsg {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParams";
  value: Uint8Array;
}
/** Queries for the default market mapper revenue share params */
export interface QueryMarketMapperRevenueShareParamsAmino {}
export interface QueryMarketMapperRevenueShareParamsAminoMsg {
  type: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParams";
  value: QueryMarketMapperRevenueShareParamsAmino;
}
/** Queries for the default market mapper revenue share params */
export interface QueryMarketMapperRevenueShareParamsSDKType {}
/** Response type for QueryMarketMapperRevenueShareParams */
export interface QueryMarketMapperRevenueShareParamsResponse {
  params: MarketMapperRevenueShareParams;
}
export interface QueryMarketMapperRevenueShareParamsResponseProtoMsg {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParamsResponse";
  value: Uint8Array;
}
/** Response type for QueryMarketMapperRevenueShareParams */
export interface QueryMarketMapperRevenueShareParamsResponseAmino {
  params?: MarketMapperRevenueShareParamsAmino;
}
export interface QueryMarketMapperRevenueShareParamsResponseAminoMsg {
  type: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParamsResponse";
  value: QueryMarketMapperRevenueShareParamsResponseAmino;
}
/** Response type for QueryMarketMapperRevenueShareParams */
export interface QueryMarketMapperRevenueShareParamsResponseSDKType {
  params: MarketMapperRevenueShareParamsSDKType;
}
/** Queries market mapper revenue share details for a specific market */
export interface QueryMarketMapperRevShareDetails {
  marketId: number;
}
export interface QueryMarketMapperRevShareDetailsProtoMsg {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetails";
  value: Uint8Array;
}
/** Queries market mapper revenue share details for a specific market */
export interface QueryMarketMapperRevShareDetailsAmino {
  market_id?: number;
}
export interface QueryMarketMapperRevShareDetailsAminoMsg {
  type: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetails";
  value: QueryMarketMapperRevShareDetailsAmino;
}
/** Queries market mapper revenue share details for a specific market */
export interface QueryMarketMapperRevShareDetailsSDKType {
  market_id: number;
}
/** Response type for QueryMarketMapperRevShareDetails */
export interface QueryMarketMapperRevShareDetailsResponse {
  details: MarketMapperRevShareDetails;
}
export interface QueryMarketMapperRevShareDetailsResponseProtoMsg {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetailsResponse";
  value: Uint8Array;
}
/** Response type for QueryMarketMapperRevShareDetails */
export interface QueryMarketMapperRevShareDetailsResponseAmino {
  details?: MarketMapperRevShareDetailsAmino;
}
export interface QueryMarketMapperRevShareDetailsResponseAminoMsg {
  type: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetailsResponse";
  value: QueryMarketMapperRevShareDetailsResponseAmino;
}
/** Response type for QueryMarketMapperRevShareDetails */
export interface QueryMarketMapperRevShareDetailsResponseSDKType {
  details: MarketMapperRevShareDetailsSDKType;
}
function createBaseQueryMarketMapperRevenueShareParams(): QueryMarketMapperRevenueShareParams {
  return {};
}
export const QueryMarketMapperRevenueShareParams = {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParams",
  encode(_: QueryMarketMapperRevenueShareParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapperRevenueShareParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapperRevenueShareParams();
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
  fromPartial(_: Partial<QueryMarketMapperRevenueShareParams>): QueryMarketMapperRevenueShareParams {
    const message = createBaseQueryMarketMapperRevenueShareParams();
    return message;
  },
  fromAmino(_: QueryMarketMapperRevenueShareParamsAmino): QueryMarketMapperRevenueShareParams {
    const message = createBaseQueryMarketMapperRevenueShareParams();
    return message;
  },
  toAmino(_: QueryMarketMapperRevenueShareParams): QueryMarketMapperRevenueShareParamsAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapperRevenueShareParamsAminoMsg): QueryMarketMapperRevenueShareParams {
    return QueryMarketMapperRevenueShareParams.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapperRevenueShareParamsProtoMsg): QueryMarketMapperRevenueShareParams {
    return QueryMarketMapperRevenueShareParams.decode(message.value);
  },
  toProto(message: QueryMarketMapperRevenueShareParams): Uint8Array {
    return QueryMarketMapperRevenueShareParams.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapperRevenueShareParams): QueryMarketMapperRevenueShareParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParams",
      value: QueryMarketMapperRevenueShareParams.encode(message).finish()
    };
  }
};
function createBaseQueryMarketMapperRevenueShareParamsResponse(): QueryMarketMapperRevenueShareParamsResponse {
  return {
    params: MarketMapperRevenueShareParams.fromPartial({})
  };
}
export const QueryMarketMapperRevenueShareParamsResponse = {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParamsResponse",
  encode(message: QueryMarketMapperRevenueShareParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      MarketMapperRevenueShareParams.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapperRevenueShareParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapperRevenueShareParamsResponse();
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
  fromPartial(object: Partial<QueryMarketMapperRevenueShareParamsResponse>): QueryMarketMapperRevenueShareParamsResponse {
    const message = createBaseQueryMarketMapperRevenueShareParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? MarketMapperRevenueShareParams.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: QueryMarketMapperRevenueShareParamsResponseAmino): QueryMarketMapperRevenueShareParamsResponse {
    const message = createBaseQueryMarketMapperRevenueShareParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = MarketMapperRevenueShareParams.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: QueryMarketMapperRevenueShareParamsResponse): QueryMarketMapperRevenueShareParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? MarketMapperRevenueShareParams.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapperRevenueShareParamsResponseAminoMsg): QueryMarketMapperRevenueShareParamsResponse {
    return QueryMarketMapperRevenueShareParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapperRevenueShareParamsResponseProtoMsg): QueryMarketMapperRevenueShareParamsResponse {
    return QueryMarketMapperRevenueShareParamsResponse.decode(message.value);
  },
  toProto(message: QueryMarketMapperRevenueShareParamsResponse): Uint8Array {
    return QueryMarketMapperRevenueShareParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapperRevenueShareParamsResponse): QueryMarketMapperRevenueShareParamsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevenueShareParamsResponse",
      value: QueryMarketMapperRevenueShareParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryMarketMapperRevShareDetails(): QueryMarketMapperRevShareDetails {
  return {
    marketId: 0
  };
}
export const QueryMarketMapperRevShareDetails = {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetails",
  encode(message: QueryMarketMapperRevShareDetails, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.marketId !== 0) {
      writer.uint32(8).uint32(message.marketId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapperRevShareDetails {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapperRevShareDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMarketMapperRevShareDetails>): QueryMarketMapperRevShareDetails {
    const message = createBaseQueryMarketMapperRevShareDetails();
    message.marketId = object.marketId ?? 0;
    return message;
  },
  fromAmino(object: QueryMarketMapperRevShareDetailsAmino): QueryMarketMapperRevShareDetails {
    const message = createBaseQueryMarketMapperRevShareDetails();
    if (object.market_id !== undefined && object.market_id !== null) {
      message.marketId = object.market_id;
    }
    return message;
  },
  toAmino(message: QueryMarketMapperRevShareDetails): QueryMarketMapperRevShareDetailsAmino {
    const obj: any = {};
    obj.market_id = message.marketId === 0 ? undefined : message.marketId;
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapperRevShareDetailsAminoMsg): QueryMarketMapperRevShareDetails {
    return QueryMarketMapperRevShareDetails.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapperRevShareDetailsProtoMsg): QueryMarketMapperRevShareDetails {
    return QueryMarketMapperRevShareDetails.decode(message.value);
  },
  toProto(message: QueryMarketMapperRevShareDetails): Uint8Array {
    return QueryMarketMapperRevShareDetails.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapperRevShareDetails): QueryMarketMapperRevShareDetailsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetails",
      value: QueryMarketMapperRevShareDetails.encode(message).finish()
    };
  }
};
function createBaseQueryMarketMapperRevShareDetailsResponse(): QueryMarketMapperRevShareDetailsResponse {
  return {
    details: MarketMapperRevShareDetails.fromPartial({})
  };
}
export const QueryMarketMapperRevShareDetailsResponse = {
  typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetailsResponse",
  encode(message: QueryMarketMapperRevShareDetailsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.details !== undefined) {
      MarketMapperRevShareDetails.encode(message.details, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryMarketMapperRevShareDetailsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryMarketMapperRevShareDetailsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.details = MarketMapperRevShareDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<QueryMarketMapperRevShareDetailsResponse>): QueryMarketMapperRevShareDetailsResponse {
    const message = createBaseQueryMarketMapperRevShareDetailsResponse();
    message.details = object.details !== undefined && object.details !== null ? MarketMapperRevShareDetails.fromPartial(object.details) : undefined;
    return message;
  },
  fromAmino(object: QueryMarketMapperRevShareDetailsResponseAmino): QueryMarketMapperRevShareDetailsResponse {
    const message = createBaseQueryMarketMapperRevShareDetailsResponse();
    if (object.details !== undefined && object.details !== null) {
      message.details = MarketMapperRevShareDetails.fromAmino(object.details);
    }
    return message;
  },
  toAmino(message: QueryMarketMapperRevShareDetailsResponse): QueryMarketMapperRevShareDetailsResponseAmino {
    const obj: any = {};
    obj.details = message.details ? MarketMapperRevShareDetails.toAmino(message.details) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryMarketMapperRevShareDetailsResponseAminoMsg): QueryMarketMapperRevShareDetailsResponse {
    return QueryMarketMapperRevShareDetailsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryMarketMapperRevShareDetailsResponseProtoMsg): QueryMarketMapperRevShareDetailsResponse {
    return QueryMarketMapperRevShareDetailsResponse.decode(message.value);
  },
  toProto(message: QueryMarketMapperRevShareDetailsResponse): Uint8Array {
    return QueryMarketMapperRevShareDetailsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryMarketMapperRevShareDetailsResponse): QueryMarketMapperRevShareDetailsResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.revshare.QueryMarketMapperRevShareDetailsResponse",
      value: QueryMarketMapperRevShareDetailsResponse.encode(message).finish()
    };
  }
};