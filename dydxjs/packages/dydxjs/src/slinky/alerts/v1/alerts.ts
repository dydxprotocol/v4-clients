//@ts-nocheck
import { CurrencyPair, CurrencyPairAmino, CurrencyPairSDKType } from "../../types/v1/currency_pair";
import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/**
 * Alert defines the basic meta-data necessary for the alerts module to resolve
 * a claim that the price of a CurrencyPair on-chain is deviating from the price
 * off-chain.
 */
export interface Alert {
  /** height represents the height for which the alert is filed. */
  height: bigint;
  /**
   * signer is the signer of this alert, this is the address that will receive
   * the reward in the case of a positive conclusion, or whose bond will get
   * slashed in the event of a negative conclusion.
   */
  signer: string;
  /**
   * currency_pair is the currency-pair that this claim asserts is deviating
   * from the price off-chain.
   */
  currencyPair: CurrencyPair;
}
export interface AlertProtoMsg {
  typeUrl: "/slinky.alerts.v1.Alert";
  value: Uint8Array;
}
/**
 * Alert defines the basic meta-data necessary for the alerts module to resolve
 * a claim that the price of a CurrencyPair on-chain is deviating from the price
 * off-chain.
 */
export interface AlertAmino {
  /** height represents the height for which the alert is filed. */
  height?: string;
  /**
   * signer is the signer of this alert, this is the address that will receive
   * the reward in the case of a positive conclusion, or whose bond will get
   * slashed in the event of a negative conclusion.
   */
  signer?: string;
  /**
   * currency_pair is the currency-pair that this claim asserts is deviating
   * from the price off-chain.
   */
  currency_pair?: CurrencyPairAmino;
}
export interface AlertAminoMsg {
  type: "slinky/x/alerts/Alert";
  value: AlertAmino;
}
/**
 * Alert defines the basic meta-data necessary for the alerts module to resolve
 * a claim that the price of a CurrencyPair on-chain is deviating from the price
 * off-chain.
 */
export interface AlertSDKType {
  height: bigint;
  signer: string;
  currency_pair: CurrencyPairSDKType;
}
/**
 * AlertStatus contains the module specific state for an alert: Has the alert
 * been concluded? What height was the alert submitted, what height should the
 * alert be purged?
 */
export interface AlertStatus {
  /** ConclusionStatus determines whether the alert has been concluded. */
  conclusionStatus: bigint;
  /** SubmissionHeight is the height that the alert was submitted in. */
  submissionHeight: bigint;
  /**
   * SubmissionTimestamp is the block-timestamp of the block that the alert was
   * submitted in (as a UTC value in Unix time).
   */
  submissionTimestamp: bigint;
  /** PurgeHeight is the height at which the alert should be purged. */
  purgeHeight: bigint;
}
export interface AlertStatusProtoMsg {
  typeUrl: "/slinky.alerts.v1.AlertStatus";
  value: Uint8Array;
}
/**
 * AlertStatus contains the module specific state for an alert: Has the alert
 * been concluded? What height was the alert submitted, what height should the
 * alert be purged?
 */
export interface AlertStatusAmino {
  /** ConclusionStatus determines whether the alert has been concluded. */
  conclusion_status?: string;
  /** SubmissionHeight is the height that the alert was submitted in. */
  submission_height?: string;
  /**
   * SubmissionTimestamp is the block-timestamp of the block that the alert was
   * submitted in (as a UTC value in Unix time).
   */
  submission_timestamp?: string;
  /** PurgeHeight is the height at which the alert should be purged. */
  purge_height?: string;
}
export interface AlertStatusAminoMsg {
  type: "slinky/x/alerts/AlertStatus";
  value: AlertStatusAmino;
}
/**
 * AlertStatus contains the module specific state for an alert: Has the alert
 * been concluded? What height was the alert submitted, what height should the
 * alert be purged?
 */
export interface AlertStatusSDKType {
  conclusion_status: bigint;
  submission_height: bigint;
  submission_timestamp: bigint;
  purge_height: bigint;
}
/**
 * AlertWithStatus represents a wrapper around the Alert and AlertStatus
 * objects, this is so that the module specific information about Alerts can be
 * packaged together.
 */
export interface AlertWithStatus {
  /** alert is the alert that this status corresponds to. */
  alert: Alert;
  /** status is the status of the alert. */
  status: AlertStatus;
}
export interface AlertWithStatusProtoMsg {
  typeUrl: "/slinky.alerts.v1.AlertWithStatus";
  value: Uint8Array;
}
/**
 * AlertWithStatus represents a wrapper around the Alert and AlertStatus
 * objects, this is so that the module specific information about Alerts can be
 * packaged together.
 */
export interface AlertWithStatusAmino {
  /** alert is the alert that this status corresponds to. */
  alert?: AlertAmino;
  /** status is the status of the alert. */
  status?: AlertStatusAmino;
}
export interface AlertWithStatusAminoMsg {
  type: "slinky/x/alerts/AlertWithStatus";
  value: AlertWithStatusAmino;
}
/**
 * AlertWithStatus represents a wrapper around the Alert and AlertStatus
 * objects, this is so that the module specific information about Alerts can be
 * packaged together.
 */
export interface AlertWithStatusSDKType {
  alert: AlertSDKType;
  status: AlertStatusSDKType;
}
/** Signature is a container for a signer address mapped to a signature. */
export interface Signature {
  signer: string;
  signature: Uint8Array;
}
export interface SignatureProtoMsg {
  typeUrl: "/slinky.alerts.v1.Signature";
  value: Uint8Array;
}
/** Signature is a container for a signer address mapped to a signature. */
export interface SignatureAmino {
  signer?: string;
  signature?: string;
}
export interface SignatureAminoMsg {
  type: "/slinky.alerts.v1.Signature";
  value: SignatureAmino;
}
/** Signature is a container for a signer address mapped to a signature. */
export interface SignatureSDKType {
  signer: string;
  signature: Uint8Array;
}
/**
 * MultiSigConcluson defines a conclusion that is accompanied by a set of
 * signatures. The signature is defined over the alert UID, status, OracleData,
 * and PriceBound. The signatures are used to verify that the conclusion is
 * valid.
 */
export interface MultiSigConclusion {
  $typeUrl?: "/slinky.alerts.v1.MultiSigConclusion";
  /** alert is the alert that this conclusion corresponds to. */
  alert: Alert;
  /**
   * signatures is a map of signer -> signature. Where the signature is over
   * Alert.UID, PriceBound, the marshalled ExtendedCommitInfo, and status.
   */
  signatures: Signature[];
  /**
   * price-bound is the price bound of the currency-pair off-chain for the
   * designated time-range.
   */
  priceBound: PriceBound;
  /** status is the status of the conclusion. */
  status: boolean;
  /**
   * CurrencyPairID is the ID of the currency-pair that this conclusion
   * corresponds to.
   */
  currencyPairID: bigint;
}
export interface MultiSigConclusionProtoMsg {
  typeUrl: "/slinky.alerts.v1.MultiSigConclusion";
  value: Uint8Array;
}
/**
 * MultiSigConcluson defines a conclusion that is accompanied by a set of
 * signatures. The signature is defined over the alert UID, status, OracleData,
 * and PriceBound. The signatures are used to verify that the conclusion is
 * valid.
 */
export interface MultiSigConclusionAmino {
  /** alert is the alert that this conclusion corresponds to. */
  alert?: AlertAmino;
  /**
   * signatures is a map of signer -> signature. Where the signature is over
   * Alert.UID, PriceBound, the marshalled ExtendedCommitInfo, and status.
   */
  signatures?: SignatureAmino[];
  /**
   * price-bound is the price bound of the currency-pair off-chain for the
   * designated time-range.
   */
  price_bound?: PriceBoundAmino;
  /** status is the status of the conclusion. */
  status?: boolean;
  /**
   * CurrencyPairID is the ID of the currency-pair that this conclusion
   * corresponds to.
   */
  currency_pair_i_d?: string;
}
export interface MultiSigConclusionAminoMsg {
  type: "slinky/x/alerts/Conclusion";
  value: MultiSigConclusionAmino;
}
/**
 * MultiSigConcluson defines a conclusion that is accompanied by a set of
 * signatures. The signature is defined over the alert UID, status, OracleData,
 * and PriceBound. The signatures are used to verify that the conclusion is
 * valid.
 */
export interface MultiSigConclusionSDKType {
  $typeUrl?: "/slinky.alerts.v1.MultiSigConclusion";
  alert: AlertSDKType;
  signatures: SignatureSDKType[];
  price_bound: PriceBoundSDKType;
  status: boolean;
  currency_pair_i_d: bigint;
}
/**
 * MultiSigConclusionVerificationParams defines the parameters necessary to
 * verify a MultiSigConclusion. It contains a map between signer and public key.
 * Notice, the public-key (value) are the base-64 encoded bytes of the public
 * key. And the signer (key) is the bech32 encoded address of the signer.
 * Notice, all public keys must be secp256 keys.
 */
export interface MultiSigConclusionVerificationParams {
  $typeUrl?: "/slinky.alerts.v1.MultiSigConclusionVerificationParams";
  /** signers is a map of signer -> public key. */
  signers: Any[];
}
export interface MultiSigConclusionVerificationParamsProtoMsg {
  typeUrl: "/slinky.alerts.v1.MultiSigConclusionVerificationParams";
  value: Uint8Array;
}
/**
 * MultiSigConclusionVerificationParams defines the parameters necessary to
 * verify a MultiSigConclusion. It contains a map between signer and public key.
 * Notice, the public-key (value) are the base-64 encoded bytes of the public
 * key. And the signer (key) is the bech32 encoded address of the signer.
 * Notice, all public keys must be secp256 keys.
 */
export interface MultiSigConclusionVerificationParamsAmino {
  /** signers is a map of signer -> public key. */
  signers?: AnyAmino[];
}
export interface MultiSigConclusionVerificationParamsAminoMsg {
  type: "slinky/x/alerts/ConclusionVerificationParams";
  value: MultiSigConclusionVerificationParamsAmino;
}
/**
 * MultiSigConclusionVerificationParams defines the parameters necessary to
 * verify a MultiSigConclusion. It contains a map between signer and public key.
 * Notice, the public-key (value) are the base-64 encoded bytes of the public
 * key. And the signer (key) is the bech32 encoded address of the signer.
 * Notice, all public keys must be secp256 keys.
 */
export interface MultiSigConclusionVerificationParamsSDKType {
  $typeUrl?: "/slinky.alerts.v1.MultiSigConclusionVerificationParams";
  signers: AnySDKType[];
}
/**
 * PriceBound represents the bounds of the price of a currency-pair off chain
 * for a designated time-range
 */
export interface PriceBound {
  high: string;
  low: string;
}
export interface PriceBoundProtoMsg {
  typeUrl: "/slinky.alerts.v1.PriceBound";
  value: Uint8Array;
}
/**
 * PriceBound represents the bounds of the price of a currency-pair off chain
 * for a designated time-range
 */
export interface PriceBoundAmino {
  high?: string;
  low?: string;
}
export interface PriceBoundAminoMsg {
  type: "/slinky.alerts.v1.PriceBound";
  value: PriceBoundAmino;
}
/**
 * PriceBound represents the bounds of the price of a currency-pair off chain
 * for a designated time-range
 */
export interface PriceBoundSDKType {
  high: string;
  low: string;
}
function createBaseAlert(): Alert {
  return {
    height: BigInt(0),
    signer: "",
    currencyPair: CurrencyPair.fromPartial({})
  };
}
export const Alert = {
  typeUrl: "/slinky.alerts.v1.Alert",
  encode(message: Alert, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.height !== BigInt(0)) {
      writer.uint32(8).uint64(message.height);
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    if (message.currencyPair !== undefined) {
      CurrencyPair.encode(message.currencyPair, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Alert {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlert();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = reader.uint64();
          break;
        case 2:
          message.signer = reader.string();
          break;
        case 3:
          message.currencyPair = CurrencyPair.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Alert>): Alert {
    const message = createBaseAlert();
    message.height = object.height !== undefined && object.height !== null ? BigInt(object.height.toString()) : BigInt(0);
    message.signer = object.signer ?? "";
    message.currencyPair = object.currencyPair !== undefined && object.currencyPair !== null ? CurrencyPair.fromPartial(object.currencyPair) : undefined;
    return message;
  },
  fromAmino(object: AlertAmino): Alert {
    const message = createBaseAlert();
    if (object.height !== undefined && object.height !== null) {
      message.height = BigInt(object.height);
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    if (object.currency_pair !== undefined && object.currency_pair !== null) {
      message.currencyPair = CurrencyPair.fromAmino(object.currency_pair);
    }
    return message;
  },
  toAmino(message: Alert): AlertAmino {
    const obj: any = {};
    obj.height = message.height !== BigInt(0) ? message.height.toString() : undefined;
    obj.signer = message.signer === "" ? undefined : message.signer;
    obj.currency_pair = message.currencyPair ? CurrencyPair.toAmino(message.currencyPair) : undefined;
    return obj;
  },
  fromAminoMsg(object: AlertAminoMsg): Alert {
    return Alert.fromAmino(object.value);
  },
  toAminoMsg(message: Alert): AlertAminoMsg {
    return {
      type: "slinky/x/alerts/Alert",
      value: Alert.toAmino(message)
    };
  },
  fromProtoMsg(message: AlertProtoMsg): Alert {
    return Alert.decode(message.value);
  },
  toProto(message: Alert): Uint8Array {
    return Alert.encode(message).finish();
  },
  toProtoMsg(message: Alert): AlertProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.Alert",
      value: Alert.encode(message).finish()
    };
  }
};
function createBaseAlertStatus(): AlertStatus {
  return {
    conclusionStatus: BigInt(0),
    submissionHeight: BigInt(0),
    submissionTimestamp: BigInt(0),
    purgeHeight: BigInt(0)
  };
}
export const AlertStatus = {
  typeUrl: "/slinky.alerts.v1.AlertStatus",
  encode(message: AlertStatus, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.conclusionStatus !== BigInt(0)) {
      writer.uint32(8).uint64(message.conclusionStatus);
    }
    if (message.submissionHeight !== BigInt(0)) {
      writer.uint32(16).uint64(message.submissionHeight);
    }
    if (message.submissionTimestamp !== BigInt(0)) {
      writer.uint32(24).uint64(message.submissionTimestamp);
    }
    if (message.purgeHeight !== BigInt(0)) {
      writer.uint32(32).uint64(message.purgeHeight);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AlertStatus {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlertStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.conclusionStatus = reader.uint64();
          break;
        case 2:
          message.submissionHeight = reader.uint64();
          break;
        case 3:
          message.submissionTimestamp = reader.uint64();
          break;
        case 4:
          message.purgeHeight = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AlertStatus>): AlertStatus {
    const message = createBaseAlertStatus();
    message.conclusionStatus = object.conclusionStatus !== undefined && object.conclusionStatus !== null ? BigInt(object.conclusionStatus.toString()) : BigInt(0);
    message.submissionHeight = object.submissionHeight !== undefined && object.submissionHeight !== null ? BigInt(object.submissionHeight.toString()) : BigInt(0);
    message.submissionTimestamp = object.submissionTimestamp !== undefined && object.submissionTimestamp !== null ? BigInt(object.submissionTimestamp.toString()) : BigInt(0);
    message.purgeHeight = object.purgeHeight !== undefined && object.purgeHeight !== null ? BigInt(object.purgeHeight.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: AlertStatusAmino): AlertStatus {
    const message = createBaseAlertStatus();
    if (object.conclusion_status !== undefined && object.conclusion_status !== null) {
      message.conclusionStatus = BigInt(object.conclusion_status);
    }
    if (object.submission_height !== undefined && object.submission_height !== null) {
      message.submissionHeight = BigInt(object.submission_height);
    }
    if (object.submission_timestamp !== undefined && object.submission_timestamp !== null) {
      message.submissionTimestamp = BigInt(object.submission_timestamp);
    }
    if (object.purge_height !== undefined && object.purge_height !== null) {
      message.purgeHeight = BigInt(object.purge_height);
    }
    return message;
  },
  toAmino(message: AlertStatus): AlertStatusAmino {
    const obj: any = {};
    obj.conclusion_status = message.conclusionStatus !== BigInt(0) ? message.conclusionStatus.toString() : undefined;
    obj.submission_height = message.submissionHeight !== BigInt(0) ? message.submissionHeight.toString() : undefined;
    obj.submission_timestamp = message.submissionTimestamp !== BigInt(0) ? message.submissionTimestamp.toString() : undefined;
    obj.purge_height = message.purgeHeight !== BigInt(0) ? message.purgeHeight.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: AlertStatusAminoMsg): AlertStatus {
    return AlertStatus.fromAmino(object.value);
  },
  toAminoMsg(message: AlertStatus): AlertStatusAminoMsg {
    return {
      type: "slinky/x/alerts/AlertStatus",
      value: AlertStatus.toAmino(message)
    };
  },
  fromProtoMsg(message: AlertStatusProtoMsg): AlertStatus {
    return AlertStatus.decode(message.value);
  },
  toProto(message: AlertStatus): Uint8Array {
    return AlertStatus.encode(message).finish();
  },
  toProtoMsg(message: AlertStatus): AlertStatusProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.AlertStatus",
      value: AlertStatus.encode(message).finish()
    };
  }
};
function createBaseAlertWithStatus(): AlertWithStatus {
  return {
    alert: Alert.fromPartial({}),
    status: AlertStatus.fromPartial({})
  };
}
export const AlertWithStatus = {
  typeUrl: "/slinky.alerts.v1.AlertWithStatus",
  encode(message: AlertWithStatus, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.alert !== undefined) {
      Alert.encode(message.alert, writer.uint32(10).fork()).ldelim();
    }
    if (message.status !== undefined) {
      AlertStatus.encode(message.status, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AlertWithStatus {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlertWithStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alert = Alert.decode(reader, reader.uint32());
          break;
        case 2:
          message.status = AlertStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AlertWithStatus>): AlertWithStatus {
    const message = createBaseAlertWithStatus();
    message.alert = object.alert !== undefined && object.alert !== null ? Alert.fromPartial(object.alert) : undefined;
    message.status = object.status !== undefined && object.status !== null ? AlertStatus.fromPartial(object.status) : undefined;
    return message;
  },
  fromAmino(object: AlertWithStatusAmino): AlertWithStatus {
    const message = createBaseAlertWithStatus();
    if (object.alert !== undefined && object.alert !== null) {
      message.alert = Alert.fromAmino(object.alert);
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = AlertStatus.fromAmino(object.status);
    }
    return message;
  },
  toAmino(message: AlertWithStatus): AlertWithStatusAmino {
    const obj: any = {};
    obj.alert = message.alert ? Alert.toAmino(message.alert) : undefined;
    obj.status = message.status ? AlertStatus.toAmino(message.status) : undefined;
    return obj;
  },
  fromAminoMsg(object: AlertWithStatusAminoMsg): AlertWithStatus {
    return AlertWithStatus.fromAmino(object.value);
  },
  toAminoMsg(message: AlertWithStatus): AlertWithStatusAminoMsg {
    return {
      type: "slinky/x/alerts/AlertWithStatus",
      value: AlertWithStatus.toAmino(message)
    };
  },
  fromProtoMsg(message: AlertWithStatusProtoMsg): AlertWithStatus {
    return AlertWithStatus.decode(message.value);
  },
  toProto(message: AlertWithStatus): Uint8Array {
    return AlertWithStatus.encode(message).finish();
  },
  toProtoMsg(message: AlertWithStatus): AlertWithStatusProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.AlertWithStatus",
      value: AlertWithStatus.encode(message).finish()
    };
  }
};
function createBaseSignature(): Signature {
  return {
    signer: "",
    signature: new Uint8Array()
  };
}
export const Signature = {
  typeUrl: "/slinky.alerts.v1.Signature",
  encode(message: Signature, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.signature.length !== 0) {
      writer.uint32(18).bytes(message.signature);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Signature {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Signature>): Signature {
    const message = createBaseSignature();
    message.signer = object.signer ?? "";
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
  fromAmino(object: SignatureAmino): Signature {
    const message = createBaseSignature();
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = bytesFromBase64(object.signature);
    }
    return message;
  },
  toAmino(message: Signature): SignatureAmino {
    const obj: any = {};
    obj.signer = message.signer === "" ? undefined : message.signer;
    obj.signature = message.signature ? base64FromBytes(message.signature) : undefined;
    return obj;
  },
  fromAminoMsg(object: SignatureAminoMsg): Signature {
    return Signature.fromAmino(object.value);
  },
  fromProtoMsg(message: SignatureProtoMsg): Signature {
    return Signature.decode(message.value);
  },
  toProto(message: Signature): Uint8Array {
    return Signature.encode(message).finish();
  },
  toProtoMsg(message: Signature): SignatureProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.Signature",
      value: Signature.encode(message).finish()
    };
  }
};
function createBaseMultiSigConclusion(): MultiSigConclusion {
  return {
    $typeUrl: "/slinky.alerts.v1.MultiSigConclusion",
    alert: Alert.fromPartial({}),
    signatures: [],
    priceBound: PriceBound.fromPartial({}),
    status: false,
    currencyPairID: BigInt(0)
  };
}
export const MultiSigConclusion = {
  typeUrl: "/slinky.alerts.v1.MultiSigConclusion",
  encode(message: MultiSigConclusion, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.alert !== undefined) {
      Alert.encode(message.alert, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.signatures) {
      Signature.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.priceBound !== undefined) {
      PriceBound.encode(message.priceBound, writer.uint32(34).fork()).ldelim();
    }
    if (message.status === true) {
      writer.uint32(40).bool(message.status);
    }
    if (message.currencyPairID !== BigInt(0)) {
      writer.uint32(48).uint64(message.currencyPairID);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MultiSigConclusion {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiSigConclusion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alert = Alert.decode(reader, reader.uint32());
          break;
        case 3:
          message.signatures.push(Signature.decode(reader, reader.uint32()));
          break;
        case 4:
          message.priceBound = PriceBound.decode(reader, reader.uint32());
          break;
        case 5:
          message.status = reader.bool();
          break;
        case 6:
          message.currencyPairID = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MultiSigConclusion>): MultiSigConclusion {
    const message = createBaseMultiSigConclusion();
    message.alert = object.alert !== undefined && object.alert !== null ? Alert.fromPartial(object.alert) : undefined;
    message.signatures = object.signatures?.map(e => Signature.fromPartial(e)) || [];
    message.priceBound = object.priceBound !== undefined && object.priceBound !== null ? PriceBound.fromPartial(object.priceBound) : undefined;
    message.status = object.status ?? false;
    message.currencyPairID = object.currencyPairID !== undefined && object.currencyPairID !== null ? BigInt(object.currencyPairID.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MultiSigConclusionAmino): MultiSigConclusion {
    const message = createBaseMultiSigConclusion();
    if (object.alert !== undefined && object.alert !== null) {
      message.alert = Alert.fromAmino(object.alert);
    }
    message.signatures = object.signatures?.map(e => Signature.fromAmino(e)) || [];
    if (object.price_bound !== undefined && object.price_bound !== null) {
      message.priceBound = PriceBound.fromAmino(object.price_bound);
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    }
    if (object.currency_pair_i_d !== undefined && object.currency_pair_i_d !== null) {
      message.currencyPairID = BigInt(object.currency_pair_i_d);
    }
    return message;
  },
  toAmino(message: MultiSigConclusion): MultiSigConclusionAmino {
    const obj: any = {};
    obj.alert = message.alert ? Alert.toAmino(message.alert) : undefined;
    if (message.signatures) {
      obj.signatures = message.signatures.map(e => e ? Signature.toAmino(e) : undefined);
    } else {
      obj.signatures = message.signatures;
    }
    obj.price_bound = message.priceBound ? PriceBound.toAmino(message.priceBound) : undefined;
    obj.status = message.status === false ? undefined : message.status;
    obj.currency_pair_i_d = message.currencyPairID !== BigInt(0) ? message.currencyPairID.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MultiSigConclusionAminoMsg): MultiSigConclusion {
    return MultiSigConclusion.fromAmino(object.value);
  },
  toAminoMsg(message: MultiSigConclusion): MultiSigConclusionAminoMsg {
    return {
      type: "slinky/x/alerts/Conclusion",
      value: MultiSigConclusion.toAmino(message)
    };
  },
  fromProtoMsg(message: MultiSigConclusionProtoMsg): MultiSigConclusion {
    return MultiSigConclusion.decode(message.value);
  },
  toProto(message: MultiSigConclusion): Uint8Array {
    return MultiSigConclusion.encode(message).finish();
  },
  toProtoMsg(message: MultiSigConclusion): MultiSigConclusionProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MultiSigConclusion",
      value: MultiSigConclusion.encode(message).finish()
    };
  }
};
function createBaseMultiSigConclusionVerificationParams(): MultiSigConclusionVerificationParams {
  return {
    $typeUrl: "/slinky.alerts.v1.MultiSigConclusionVerificationParams",
    signers: []
  };
}
export const MultiSigConclusionVerificationParams = {
  typeUrl: "/slinky.alerts.v1.MultiSigConclusionVerificationParams",
  encode(message: MultiSigConclusionVerificationParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.signers) {
      Any.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MultiSigConclusionVerificationParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMultiSigConclusionVerificationParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signers.push(Any.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MultiSigConclusionVerificationParams>): MultiSigConclusionVerificationParams {
    const message = createBaseMultiSigConclusionVerificationParams();
    message.signers = object.signers?.map(e => Any.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MultiSigConclusionVerificationParamsAmino): MultiSigConclusionVerificationParams {
    const message = createBaseMultiSigConclusionVerificationParams();
    message.signers = object.signers?.map(e => Any.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MultiSigConclusionVerificationParams): MultiSigConclusionVerificationParamsAmino {
    const obj: any = {};
    if (message.signers) {
      obj.signers = message.signers.map(e => e ? Any.toAmino(e) : undefined);
    } else {
      obj.signers = message.signers;
    }
    return obj;
  },
  fromAminoMsg(object: MultiSigConclusionVerificationParamsAminoMsg): MultiSigConclusionVerificationParams {
    return MultiSigConclusionVerificationParams.fromAmino(object.value);
  },
  toAminoMsg(message: MultiSigConclusionVerificationParams): MultiSigConclusionVerificationParamsAminoMsg {
    return {
      type: "slinky/x/alerts/ConclusionVerificationParams",
      value: MultiSigConclusionVerificationParams.toAmino(message)
    };
  },
  fromProtoMsg(message: MultiSigConclusionVerificationParamsProtoMsg): MultiSigConclusionVerificationParams {
    return MultiSigConclusionVerificationParams.decode(message.value);
  },
  toProto(message: MultiSigConclusionVerificationParams): Uint8Array {
    return MultiSigConclusionVerificationParams.encode(message).finish();
  },
  toProtoMsg(message: MultiSigConclusionVerificationParams): MultiSigConclusionVerificationParamsProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.MultiSigConclusionVerificationParams",
      value: MultiSigConclusionVerificationParams.encode(message).finish()
    };
  }
};
function createBasePriceBound(): PriceBound {
  return {
    high: "",
    low: ""
  };
}
export const PriceBound = {
  typeUrl: "/slinky.alerts.v1.PriceBound",
  encode(message: PriceBound, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.high !== "") {
      writer.uint32(10).string(message.high);
    }
    if (message.low !== "") {
      writer.uint32(18).string(message.low);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PriceBound {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceBound();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.high = reader.string();
          break;
        case 2:
          message.low = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PriceBound>): PriceBound {
    const message = createBasePriceBound();
    message.high = object.high ?? "";
    message.low = object.low ?? "";
    return message;
  },
  fromAmino(object: PriceBoundAmino): PriceBound {
    const message = createBasePriceBound();
    if (object.high !== undefined && object.high !== null) {
      message.high = object.high;
    }
    if (object.low !== undefined && object.low !== null) {
      message.low = object.low;
    }
    return message;
  },
  toAmino(message: PriceBound): PriceBoundAmino {
    const obj: any = {};
    obj.high = message.high === "" ? undefined : message.high;
    obj.low = message.low === "" ? undefined : message.low;
    return obj;
  },
  fromAminoMsg(object: PriceBoundAminoMsg): PriceBound {
    return PriceBound.fromAmino(object.value);
  },
  fromProtoMsg(message: PriceBoundProtoMsg): PriceBound {
    return PriceBound.decode(message.value);
  },
  toProto(message: PriceBound): Uint8Array {
    return PriceBound.encode(message).finish();
  },
  toProtoMsg(message: PriceBound): PriceBoundProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.PriceBound",
      value: PriceBound.encode(message).finish()
    };
  }
};