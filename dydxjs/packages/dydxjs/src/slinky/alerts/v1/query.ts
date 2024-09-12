//@ts-nocheck
import { Alert, AlertAmino, AlertSDKType } from "./alerts";
import { Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * AlertStatus is the type for the status of an Alert, it can be Unconcluded or
 * Concluded.
 */
export enum AlertStatusID {
  CONCLUSION_STATUS_UNSPECIFIED = 0,
  CONCLUSION_STATUS_UNCONCLUDED = 1,
  CONCLUSION_STATUS_CONCLUDED = 2,
  UNRECOGNIZED = -1,
}
export const AlertStatusIDSDKType = AlertStatusID;
export const AlertStatusIDAmino = AlertStatusID;
export function alertStatusIDFromJSON(object: any): AlertStatusID {
  switch (object) {
    case 0:
    case "CONCLUSION_STATUS_UNSPECIFIED":
      return AlertStatusID.CONCLUSION_STATUS_UNSPECIFIED;
    case 1:
    case "CONCLUSION_STATUS_UNCONCLUDED":
      return AlertStatusID.CONCLUSION_STATUS_UNCONCLUDED;
    case 2:
    case "CONCLUSION_STATUS_CONCLUDED":
      return AlertStatusID.CONCLUSION_STATUS_CONCLUDED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AlertStatusID.UNRECOGNIZED;
  }
}
export function alertStatusIDToJSON(object: AlertStatusID): string {
  switch (object) {
    case AlertStatusID.CONCLUSION_STATUS_UNSPECIFIED:
      return "CONCLUSION_STATUS_UNSPECIFIED";
    case AlertStatusID.CONCLUSION_STATUS_UNCONCLUDED:
      return "CONCLUSION_STATUS_UNCONCLUDED";
    case AlertStatusID.CONCLUSION_STATUS_CONCLUDED:
      return "CONCLUSION_STATUS_CONCLUDED";
    case AlertStatusID.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/**
 * AlertsRequest is the request type for the Query.Alerts RPC method, the status
 * field indicates whether the request should return only Unconcluded /
 * Concluded Alerts, or all Alerts.
 */
export interface AlertsRequest {
  status: AlertStatusID;
}
export interface AlertsRequestProtoMsg {
  typeUrl: "/slinky.alerts.v1.AlertsRequest";
  value: Uint8Array;
}
/**
 * AlertsRequest is the request type for the Query.Alerts RPC method, the status
 * field indicates whether the request should return only Unconcluded /
 * Concluded Alerts, or all Alerts.
 */
export interface AlertsRequestAmino {
  status?: AlertStatusID;
}
export interface AlertsRequestAminoMsg {
  type: "/slinky.alerts.v1.AlertsRequest";
  value: AlertsRequestAmino;
}
/**
 * AlertsRequest is the request type for the Query.Alerts RPC method, the status
 * field indicates whether the request should return only Unconcluded /
 * Concluded Alerts, or all Alerts.
 */
export interface AlertsRequestSDKType {
  status: AlertStatusID;
}
/**
 * AlertsResponse is the response type for the Query.Alerts RPC method, it
 * contains the list of Alerts that are being tracked by the alerts module.
 */
export interface AlertsResponse {
  alerts: Alert[];
}
export interface AlertsResponseProtoMsg {
  typeUrl: "/slinky.alerts.v1.AlertsResponse";
  value: Uint8Array;
}
/**
 * AlertsResponse is the response type for the Query.Alerts RPC method, it
 * contains the list of Alerts that are being tracked by the alerts module.
 */
export interface AlertsResponseAmino {
  alerts?: AlertAmino[];
}
export interface AlertsResponseAminoMsg {
  type: "/slinky.alerts.v1.AlertsResponse";
  value: AlertsResponseAmino;
}
/**
 * AlertsResponse is the response type for the Query.Alerts RPC method, it
 * contains the list of Alerts that are being tracked by the alerts module.
 */
export interface AlertsResponseSDKType {
  alerts: AlertSDKType[];
}
/** ParamsRequest is the request type for the Query.Params RPC method. */
export interface ParamsRequest {}
export interface ParamsRequestProtoMsg {
  typeUrl: "/slinky.alerts.v1.ParamsRequest";
  value: Uint8Array;
}
/** ParamsRequest is the request type for the Query.Params RPC method. */
export interface ParamsRequestAmino {}
export interface ParamsRequestAminoMsg {
  type: "/slinky.alerts.v1.ParamsRequest";
  value: ParamsRequestAmino;
}
/** ParamsRequest is the request type for the Query.Params RPC method. */
export interface ParamsRequestSDKType {}
/**
 * ParamsResponse is the response type for the Query.Params RPC method, it
 * contains the Params of the module.
 */
export interface ParamsResponse {
  params: Params;
}
export interface ParamsResponseProtoMsg {
  typeUrl: "/slinky.alerts.v1.ParamsResponse";
  value: Uint8Array;
}
/**
 * ParamsResponse is the response type for the Query.Params RPC method, it
 * contains the Params of the module.
 */
export interface ParamsResponseAmino {
  params?: ParamsAmino;
}
export interface ParamsResponseAminoMsg {
  type: "/slinky.alerts.v1.ParamsResponse";
  value: ParamsResponseAmino;
}
/**
 * ParamsResponse is the response type for the Query.Params RPC method, it
 * contains the Params of the module.
 */
export interface ParamsResponseSDKType {
  params: ParamsSDKType;
}
function createBaseAlertsRequest(): AlertsRequest {
  return {
    status: 0
  };
}
export const AlertsRequest = {
  typeUrl: "/slinky.alerts.v1.AlertsRequest",
  encode(message: AlertsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AlertsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlertsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AlertsRequest>): AlertsRequest {
    const message = createBaseAlertsRequest();
    message.status = object.status ?? 0;
    return message;
  },
  fromAmino(object: AlertsRequestAmino): AlertsRequest {
    const message = createBaseAlertsRequest();
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    }
    return message;
  },
  toAmino(message: AlertsRequest): AlertsRequestAmino {
    const obj: any = {};
    obj.status = message.status === 0 ? undefined : message.status;
    return obj;
  },
  fromAminoMsg(object: AlertsRequestAminoMsg): AlertsRequest {
    return AlertsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: AlertsRequestProtoMsg): AlertsRequest {
    return AlertsRequest.decode(message.value);
  },
  toProto(message: AlertsRequest): Uint8Array {
    return AlertsRequest.encode(message).finish();
  },
  toProtoMsg(message: AlertsRequest): AlertsRequestProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.AlertsRequest",
      value: AlertsRequest.encode(message).finish()
    };
  }
};
function createBaseAlertsResponse(): AlertsResponse {
  return {
    alerts: []
  };
}
export const AlertsResponse = {
  typeUrl: "/slinky.alerts.v1.AlertsResponse",
  encode(message: AlertsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.alerts) {
      Alert.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AlertsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlertsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alerts.push(Alert.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AlertsResponse>): AlertsResponse {
    const message = createBaseAlertsResponse();
    message.alerts = object.alerts?.map(e => Alert.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: AlertsResponseAmino): AlertsResponse {
    const message = createBaseAlertsResponse();
    message.alerts = object.alerts?.map(e => Alert.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: AlertsResponse): AlertsResponseAmino {
    const obj: any = {};
    if (message.alerts) {
      obj.alerts = message.alerts.map(e => e ? Alert.toAmino(e) : undefined);
    } else {
      obj.alerts = message.alerts;
    }
    return obj;
  },
  fromAminoMsg(object: AlertsResponseAminoMsg): AlertsResponse {
    return AlertsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: AlertsResponseProtoMsg): AlertsResponse {
    return AlertsResponse.decode(message.value);
  },
  toProto(message: AlertsResponse): Uint8Array {
    return AlertsResponse.encode(message).finish();
  },
  toProtoMsg(message: AlertsResponse): AlertsResponseProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.AlertsResponse",
      value: AlertsResponse.encode(message).finish()
    };
  }
};
function createBaseParamsRequest(): ParamsRequest {
  return {};
}
export const ParamsRequest = {
  typeUrl: "/slinky.alerts.v1.ParamsRequest",
  encode(_: ParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsRequest();
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
  fromPartial(_: Partial<ParamsRequest>): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
  fromAmino(_: ParamsRequestAmino): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
  toAmino(_: ParamsRequest): ParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: ParamsRequestAminoMsg): ParamsRequest {
    return ParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsRequestProtoMsg): ParamsRequest {
    return ParamsRequest.decode(message.value);
  },
  toProto(message: ParamsRequest): Uint8Array {
    return ParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: ParamsRequest): ParamsRequestProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.ParamsRequest",
      value: ParamsRequest.encode(message).finish()
    };
  }
};
function createBaseParamsResponse(): ParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const ParamsResponse = {
  typeUrl: "/slinky.alerts.v1.ParamsResponse",
  encode(message: ParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ParamsResponse>): ParamsResponse {
    const message = createBaseParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: ParamsResponseAmino): ParamsResponse {
    const message = createBaseParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: ParamsResponse): ParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: ParamsResponseAminoMsg): ParamsResponse {
    return ParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsResponseProtoMsg): ParamsResponse {
    return ParamsResponse.decode(message.value);
  },
  toProto(message: ParamsResponse): Uint8Array {
    return ParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: ParamsResponse): ParamsResponseProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.ParamsResponse",
      value: ParamsResponse.encode(message).finish()
    };
  }
};