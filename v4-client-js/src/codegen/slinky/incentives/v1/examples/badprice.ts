import { BinaryReader, BinaryWriter } from "../../../../binary";
/**
 * BadPriceIncentive is a message that contains the information about a bad
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a bad price incentive. It is not used in
 * production.
 */
export interface BadPriceIncentive {
  /** Validator is the address of the validator that submitted the bad price. */
  validator: string;
  /** Amount is the amount to slash. */
  amount: string;
}
export interface BadPriceIncentiveProtoMsg {
  typeUrl: "/slinky.incentives.v1.BadPriceIncentive";
  value: Uint8Array;
}
/**
 * BadPriceIncentive is a message that contains the information about a bad
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a bad price incentive. It is not used in
 * production.
 */
export interface BadPriceIncentiveAmino {
  /** Validator is the address of the validator that submitted the bad price. */
  validator?: string;
  /** Amount is the amount to slash. */
  amount?: string;
}
export interface BadPriceIncentiveAminoMsg {
  type: "slinky/oracle/BadPriceIncentive";
  value: BadPriceIncentiveAmino;
}
/**
 * BadPriceIncentive is a message that contains the information about a bad
 * price that was submitted by a validator.
 * 
 * NOTE: This is an example of a bad price incentive. It is not used in
 * production.
 */
export interface BadPriceIncentiveSDKType {
  validator: string;
  amount: string;
}
function createBaseBadPriceIncentive(): BadPriceIncentive {
  return {
    validator: "",
    amount: ""
  };
}
export const BadPriceIncentive = {
  typeUrl: "/slinky.incentives.v1.BadPriceIncentive",
  encode(message: BadPriceIncentive, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): BadPriceIncentive {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBadPriceIncentive();
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
  fromPartial(object: Partial<BadPriceIncentive>): BadPriceIncentive {
    const message = createBaseBadPriceIncentive();
    message.validator = object.validator ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
  fromAmino(object: BadPriceIncentiveAmino): BadPriceIncentive {
    const message = createBaseBadPriceIncentive();
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = object.validator;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    return message;
  },
  toAmino(message: BadPriceIncentive): BadPriceIncentiveAmino {
    const obj: any = {};
    obj.validator = message.validator === "" ? undefined : message.validator;
    obj.amount = message.amount === "" ? undefined : message.amount;
    return obj;
  },
  fromAminoMsg(object: BadPriceIncentiveAminoMsg): BadPriceIncentive {
    return BadPriceIncentive.fromAmino(object.value);
  },
  toAminoMsg(message: BadPriceIncentive): BadPriceIncentiveAminoMsg {
    return {
      type: "slinky/oracle/BadPriceIncentive",
      value: BadPriceIncentive.toAmino(message)
    };
  },
  fromProtoMsg(message: BadPriceIncentiveProtoMsg): BadPriceIncentive {
    return BadPriceIncentive.decode(message.value);
  },
  toProto(message: BadPriceIncentive): Uint8Array {
    return BadPriceIncentive.encode(message).finish();
  },
  toProtoMsg(message: BadPriceIncentive): BadPriceIncentiveProtoMsg {
    return {
      typeUrl: "/slinky.incentives.v1.BadPriceIncentive",
      value: BadPriceIncentive.encode(message).finish()
    };
  }
};