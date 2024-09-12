//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
import { Decimal } from "@cosmjs/math";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/** MsgSlashValidator is the Msg/SlashValidator request type. */
export interface MsgSlashValidator {
  authority: string;
  /** Consensus address of the validator to slash */
  validatorAddress: string;
  /**
   * Colloquially, the height at which the validator is deemed to have
   * misbehaved. In practice, this is the height used to determine the targets
   * of the slash. For example, undelegating after this height will not escape
   * slashing. This height should be set to a recent height at the time of the
   * proposal to prevent delegators from undelegating during the vote period.
   * i.e. infraction_height <= proposal submission height.
   * 
   * NB: At the time this message is applied, this height must have occured
   * equal to or less than an unbonding period in the past in order for the
   * slash to be effective.
   * i.e. time(proposal pass height) - time(infraction_height) < unbonding
   * period
   */
  infractionHeight: number;
  /**
   * Tokens of the validator at the specified height. Used to compute the slash
   * amount. The x/staking HistoricalInfo query endpoint can be used to find
   * this.
   */
  tokensAtInfractionHeight: Uint8Array;
  /**
   * Multiplier for how much of the validator's stake should be slashed.
   * slash_factor * tokens_at_infraction_height = tokens slashed
   */
  slashFactor: string;
}
export interface MsgSlashValidatorProtoMsg {
  typeUrl: "/dydxprotocol.govplus.MsgSlashValidator";
  value: Uint8Array;
}
/** MsgSlashValidator is the Msg/SlashValidator request type. */
export interface MsgSlashValidatorAmino {
  authority?: string;
  /** Consensus address of the validator to slash */
  validator_address?: string;
  /**
   * Colloquially, the height at which the validator is deemed to have
   * misbehaved. In practice, this is the height used to determine the targets
   * of the slash. For example, undelegating after this height will not escape
   * slashing. This height should be set to a recent height at the time of the
   * proposal to prevent delegators from undelegating during the vote period.
   * i.e. infraction_height <= proposal submission height.
   * 
   * NB: At the time this message is applied, this height must have occured
   * equal to or less than an unbonding period in the past in order for the
   * slash to be effective.
   * i.e. time(proposal pass height) - time(infraction_height) < unbonding
   * period
   */
  infraction_height?: number;
  /**
   * Tokens of the validator at the specified height. Used to compute the slash
   * amount. The x/staking HistoricalInfo query endpoint can be used to find
   * this.
   */
  tokens_at_infraction_height?: string;
  /**
   * Multiplier for how much of the validator's stake should be slashed.
   * slash_factor * tokens_at_infraction_height = tokens slashed
   */
  slash_factor: string;
}
export interface MsgSlashValidatorAminoMsg {
  type: "/dydxprotocol.govplus.MsgSlashValidator";
  value: MsgSlashValidatorAmino;
}
/** MsgSlashValidator is the Msg/SlashValidator request type. */
export interface MsgSlashValidatorSDKType {
  authority: string;
  validator_address: string;
  infraction_height: number;
  tokens_at_infraction_height: Uint8Array;
  slash_factor: string;
}
/** MsgSlashValidatorResponse is the Msg/SlashValidator response type. */
export interface MsgSlashValidatorResponse {}
export interface MsgSlashValidatorResponseProtoMsg {
  typeUrl: "/dydxprotocol.govplus.MsgSlashValidatorResponse";
  value: Uint8Array;
}
/** MsgSlashValidatorResponse is the Msg/SlashValidator response type. */
export interface MsgSlashValidatorResponseAmino {}
export interface MsgSlashValidatorResponseAminoMsg {
  type: "/dydxprotocol.govplus.MsgSlashValidatorResponse";
  value: MsgSlashValidatorResponseAmino;
}
/** MsgSlashValidatorResponse is the Msg/SlashValidator response type. */
export interface MsgSlashValidatorResponseSDKType {}
function createBaseMsgSlashValidator(): MsgSlashValidator {
  return {
    authority: "",
    validatorAddress: "",
    infractionHeight: 0,
    tokensAtInfractionHeight: new Uint8Array(),
    slashFactor: ""
  };
}
export const MsgSlashValidator = {
  typeUrl: "/dydxprotocol.govplus.MsgSlashValidator",
  encode(message: MsgSlashValidator, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.validatorAddress !== "") {
      writer.uint32(18).string(message.validatorAddress);
    }
    if (message.infractionHeight !== 0) {
      writer.uint32(24).uint32(message.infractionHeight);
    }
    if (message.tokensAtInfractionHeight.length !== 0) {
      writer.uint32(34).bytes(message.tokensAtInfractionHeight);
    }
    if (message.slashFactor !== "") {
      writer.uint32(42).string(Decimal.fromUserInput(message.slashFactor, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSlashValidator {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSlashValidator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        case 3:
          message.infractionHeight = reader.uint32();
          break;
        case 4:
          message.tokensAtInfractionHeight = reader.bytes();
          break;
        case 5:
          message.slashFactor = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSlashValidator>): MsgSlashValidator {
    const message = createBaseMsgSlashValidator();
    message.authority = object.authority ?? "";
    message.validatorAddress = object.validatorAddress ?? "";
    message.infractionHeight = object.infractionHeight ?? 0;
    message.tokensAtInfractionHeight = object.tokensAtInfractionHeight ?? new Uint8Array();
    message.slashFactor = object.slashFactor ?? "";
    return message;
  },
  fromAmino(object: MsgSlashValidatorAmino): MsgSlashValidator {
    const message = createBaseMsgSlashValidator();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.validator_address !== undefined && object.validator_address !== null) {
      message.validatorAddress = object.validator_address;
    }
    if (object.infraction_height !== undefined && object.infraction_height !== null) {
      message.infractionHeight = object.infraction_height;
    }
    if (object.tokens_at_infraction_height !== undefined && object.tokens_at_infraction_height !== null) {
      message.tokensAtInfractionHeight = bytesFromBase64(object.tokens_at_infraction_height);
    }
    if (object.slash_factor !== undefined && object.slash_factor !== null) {
      message.slashFactor = object.slash_factor;
    }
    return message;
  },
  toAmino(message: MsgSlashValidator): MsgSlashValidatorAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.validator_address = message.validatorAddress === "" ? undefined : message.validatorAddress;
    obj.infraction_height = message.infractionHeight === 0 ? undefined : message.infractionHeight;
    obj.tokens_at_infraction_height = message.tokensAtInfractionHeight ? base64FromBytes(message.tokensAtInfractionHeight) : undefined;
    obj.slash_factor = message.slashFactor ?? "";
    return obj;
  },
  fromAminoMsg(object: MsgSlashValidatorAminoMsg): MsgSlashValidator {
    return MsgSlashValidator.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSlashValidatorProtoMsg): MsgSlashValidator {
    return MsgSlashValidator.decode(message.value);
  },
  toProto(message: MsgSlashValidator): Uint8Array {
    return MsgSlashValidator.encode(message).finish();
  },
  toProtoMsg(message: MsgSlashValidator): MsgSlashValidatorProtoMsg {
    return {
      typeUrl: "/dydxprotocol.govplus.MsgSlashValidator",
      value: MsgSlashValidator.encode(message).finish()
    };
  }
};
function createBaseMsgSlashValidatorResponse(): MsgSlashValidatorResponse {
  return {};
}
export const MsgSlashValidatorResponse = {
  typeUrl: "/dydxprotocol.govplus.MsgSlashValidatorResponse",
  encode(_: MsgSlashValidatorResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSlashValidatorResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSlashValidatorResponse();
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
  fromPartial(_: Partial<MsgSlashValidatorResponse>): MsgSlashValidatorResponse {
    const message = createBaseMsgSlashValidatorResponse();
    return message;
  },
  fromAmino(_: MsgSlashValidatorResponseAmino): MsgSlashValidatorResponse {
    const message = createBaseMsgSlashValidatorResponse();
    return message;
  },
  toAmino(_: MsgSlashValidatorResponse): MsgSlashValidatorResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSlashValidatorResponseAminoMsg): MsgSlashValidatorResponse {
    return MsgSlashValidatorResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSlashValidatorResponseProtoMsg): MsgSlashValidatorResponse {
    return MsgSlashValidatorResponse.decode(message.value);
  },
  toProto(message: MsgSlashValidatorResponse): Uint8Array {
    return MsgSlashValidatorResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSlashValidatorResponse): MsgSlashValidatorResponseProtoMsg {
    return {
      typeUrl: "/dydxprotocol.govplus.MsgSlashValidatorResponse",
      value: MsgSlashValidatorResponse.encode(message).finish()
    };
  }
};