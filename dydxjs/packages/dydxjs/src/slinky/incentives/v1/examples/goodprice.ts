//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../../binary";
/**
 * GoodPriceIncentive is a message that contains the information about a good
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a good price incentive. It is not used in
 * production.
 */
export interface GoodPriceIncentive {
  $typeUrl?: "/slinky.incentives.v1.GoodPriceIncentive";
  /** Validator is the address of the validator that submitted the good price. */
  validator: string;
  /** Amount is the amount to reward. */
  amount: string;
}
export interface GoodPriceIncentiveProtoMsg {
  typeUrl: "/slinky.incentives.v1.GoodPriceIncentive";
  value: Uint8Array;
}
/**
 * GoodPriceIncentive is a message that contains the information about a good
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a good price incentive. It is not used in
 * production.
 */
export interface GoodPriceIncentiveAmino {
  /** Validator is the address of the validator that submitted the good price. */
  validator?: string;
  /** Amount is the amount to reward. */
  amount?: string;
}
export interface GoodPriceIncentiveAminoMsg {
  type: "slinky/oracle/BadPriceIncentive";
  value: GoodPriceIncentiveAmino;
}
/**
 * GoodPriceIncentive is a message that contains the information about a good
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a good price incentive. It is not used in
 * production.
 */
export interface GoodPriceIncentiveSDKType {
  $typeUrl?: "/slinky.incentives.v1.GoodPriceIncentive";
  validator: string;
  amount: string;
}
function createBaseGoodPriceIncentive(): GoodPriceIncentive {
  return {
    $typeUrl: "/slinky.incentives.v1.GoodPriceIncentive",
    validator: "",
    amount: ""
  };
}
export const GoodPriceIncentive = {
  typeUrl: "/slinky.incentives.v1.GoodPriceIncentive",
  encode(message: GoodPriceIncentive, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GoodPriceIncentive {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGoodPriceIncentive();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validator = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GoodPriceIncentive>): GoodPriceIncentive {
    const message = createBaseGoodPriceIncentive();
    message.validator = object.validator ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
  fromAmino(object: GoodPriceIncentiveAmino): GoodPriceIncentive {
    const message = createBaseGoodPriceIncentive();
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = object.validator;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    return message;
  },
  toAmino(message: GoodPriceIncentive): GoodPriceIncentiveAmino {
    const obj: any = {};
    obj.validator = message.validator === "" ? undefined : message.validator;
    obj.amount = message.amount === "" ? undefined : message.amount;
    return obj;
  },
  fromAminoMsg(object: GoodPriceIncentiveAminoMsg): GoodPriceIncentive {
    return GoodPriceIncentive.fromAmino(object.value);
  },
  toAminoMsg(message: GoodPriceIncentive): GoodPriceIncentiveAminoMsg {
    return {
      type: "slinky/oracle/BadPriceIncentive",
      value: GoodPriceIncentive.toAmino(message)
    };
  },
  fromProtoMsg(message: GoodPriceIncentiveProtoMsg): GoodPriceIncentive {
    return GoodPriceIncentive.decode(message.value);
  },
  toProto(message: GoodPriceIncentive): Uint8Array {
    return GoodPriceIncentive.encode(message).finish();
  },
  toProtoMsg(message: GoodPriceIncentive): GoodPriceIncentiveProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.GoodPriceIncentive",
      value: GoodPriceIncentive.encode(message).finish()
    };
  }
};