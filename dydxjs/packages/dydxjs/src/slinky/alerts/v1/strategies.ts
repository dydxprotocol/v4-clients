//@ts-nocheck
import { Validator, ValidatorAmino, ValidatorSDKType } from "../../../tendermint/abci/types";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * ValidatorAlertIncentive defines the incentive strategy to be executed for a
 * validator that has been confirmed to have at fault for an x/alerts alert.
 * This strategy is expected to slash half of the validator's stake.
 */
export interface ValidatorAlertIncentive {
  $typeUrl?: "/slinky.alerts.v1.ValidatorAlertIncentive";
  /** The validator that has been confirmed to have been at fault for an alert. */
  validator: Validator;
  /**
   * AlertSigner is the signer of the alert referenced by the conclusion that
   * created this incentive.
   */
  alertSigner: string;
  /** AlertHeight is the height at which the infraction occurred */
  alertHeight: bigint;
}
export interface ValidatorAlertIncentiveProtoMsg {
  typeUrl: "/slinky.alerts.v1.ValidatorAlertIncentive";
  value: Uint8Array;
}
/**
 * ValidatorAlertIncentive defines the incentive strategy to be executed for a
 * validator that has been confirmed to have at fault for an x/alerts alert.
 * This strategy is expected to slash half of the validator's stake.
 */
export interface ValidatorAlertIncentiveAmino {
  /** The validator that has been confirmed to have been at fault for an alert. */
  validator?: ValidatorAmino;
  /**
   * AlertSigner is the signer of the alert referenced by the conclusion that
   * created this incentive.
   */
  alert_signer?: string;
  /** AlertHeight is the height at which the infraction occurred */
  alert_height?: string;
}
export interface ValidatorAlertIncentiveAminoMsg {
  type: "slinky/x/alerts/ValidatorAlertIncentive";
  value: ValidatorAlertIncentiveAmino;
}
/**
 * ValidatorAlertIncentive defines the incentive strategy to be executed for a
 * validator that has been confirmed to have at fault for an x/alerts alert.
 * This strategy is expected to slash half of the validator's stake.
 */
export interface ValidatorAlertIncentiveSDKType {
  $typeUrl?: "/slinky.alerts.v1.ValidatorAlertIncentive";
  validator: ValidatorSDKType;
  alert_signer: string;
  alert_height: bigint;
}
function createBaseValidatorAlertIncentive(): ValidatorAlertIncentive {
  return {
    $typeUrl: "/slinky.alerts.v1.ValidatorAlertIncentive",
    validator: Validator.fromPartial({}),
    alertSigner: "",
    alertHeight: BigInt(0)
  };
}
export const ValidatorAlertIncentive = {
  typeUrl: "/slinky.alerts.v1.ValidatorAlertIncentive",
  encode(message: ValidatorAlertIncentive, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.validator !== undefined) {
      Validator.encode(message.validator, writer.uint32(10).fork()).ldelim();
    }
    if (message.alertSigner !== "") {
      writer.uint32(18).string(message.alertSigner);
    }
    if (message.alertHeight !== BigInt(0)) {
      writer.uint32(24).uint64(message.alertHeight);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ValidatorAlertIncentive {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorAlertIncentive();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validator = Validator.decode(reader, reader.uint32());
          break;
        case 2:
          message.alertSigner = reader.string();
          break;
        case 3:
          message.alertHeight = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ValidatorAlertIncentive>): ValidatorAlertIncentive {
    const message = createBaseValidatorAlertIncentive();
    message.validator = object.validator !== undefined && object.validator !== null ? Validator.fromPartial(object.validator) : undefined;
    message.alertSigner = object.alertSigner ?? "";
    message.alertHeight = object.alertHeight !== undefined && object.alertHeight !== null ? BigInt(object.alertHeight.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: ValidatorAlertIncentiveAmino): ValidatorAlertIncentive {
    const message = createBaseValidatorAlertIncentive();
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = Validator.fromAmino(object.validator);
    }
    if (object.alert_signer !== undefined && object.alert_signer !== null) {
      message.alertSigner = object.alert_signer;
    }
    if (object.alert_height !== undefined && object.alert_height !== null) {
      message.alertHeight = BigInt(object.alert_height);
    }
    return message;
  },
  toAmino(message: ValidatorAlertIncentive): ValidatorAlertIncentiveAmino {
    const obj: any = {};
    obj.validator = message.validator ? Validator.toAmino(message.validator) : undefined;
    obj.alert_signer = message.alertSigner === "" ? undefined : message.alertSigner;
    obj.alert_height = message.alertHeight !== BigInt(0) ? message.alertHeight.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: ValidatorAlertIncentiveAminoMsg): ValidatorAlertIncentive {
    return ValidatorAlertIncentive.fromAmino(object.value);
  },
  toAminoMsg(message: ValidatorAlertIncentive): ValidatorAlertIncentiveAminoMsg {
    return {
      type: "slinky/x/alerts/ValidatorAlertIncentive",
      value: ValidatorAlertIncentive.toAmino(message)
    };
  },
  fromProtoMsg(message: ValidatorAlertIncentiveProtoMsg): ValidatorAlertIncentive {
    return ValidatorAlertIncentive.decode(message.value);
  },
  toProto(message: ValidatorAlertIncentive): Uint8Array {
    return ValidatorAlertIncentive.encode(message).finish();
  },
  toProtoMsg(message: ValidatorAlertIncentive): ValidatorAlertIncentiveProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.ValidatorAlertIncentive",
      value: ValidatorAlertIncentive.encode(message).finish()
    };
  }
};