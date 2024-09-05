import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { AlertWithStatus, AlertWithStatusAmino, AlertWithStatusSDKType } from "./alerts";
import { BinaryReader, BinaryWriter } from "../../../binary";
/**
 * AlertParams is the set of parameters for the x/Alerts module's Alerting. It
 * defines whether or not Alerts can be submitted, and if so, the minimum
 * bond amount required to submit an Alert.
 */
export interface AlertParams {
  /**
   * Enabled is a boolean defining whether or not Alerts can be submitted
   * to the module
   */
  enabled: boolean;
  /**
   * BondAmount is the minimum amount of bond required to submit an
   * Alert
   */
  bondAmount: Coin;
  /**
   * MaxBlockAge defines the maximum age of an Alert before it is pruned, notice
   * this is defined wrt. the height that the Alert references, i.e Alerts are
   * only relevant until Alert.Height + MaxBlockAge is reached.
   */
  maxBlockAge: bigint;
}
export interface AlertParamsProtoMsg {
  typeUrl: "/slinky.alerts.v1.AlertParams";
  value: Uint8Array;
}
/**
 * AlertParams is the set of parameters for the x/Alerts module's Alerting. It
 * defines whether or not Alerts can be submitted, and if so, the minimum
 * bond amount required to submit an Alert.
 */
export interface AlertParamsAmino {
  /**
   * Enabled is a boolean defining whether or not Alerts can be submitted
   * to the module
   */
  enabled?: boolean;
  /**
   * BondAmount is the minimum amount of bond required to submit an
   * Alert
   */
  bond_amount: CoinAmino;
  /**
   * MaxBlockAge defines the maximum age of an Alert before it is pruned, notice
   * this is defined wrt. the height that the Alert references, i.e Alerts are
   * only relevant until Alert.Height + MaxBlockAge is reached.
   */
  max_block_age?: string;
}
export interface AlertParamsAminoMsg {
  type: "/slinky.alerts.v1.AlertParams";
  value: AlertParamsAmino;
}
/**
 * AlertParams is the set of parameters for the x/Alerts module's Alerting. It
 * defines whether or not Alerts can be submitted, and if so, the minimum
 * bond amount required to submit an Alert.
 */
export interface AlertParamsSDKType {
  enabled: boolean;
  bond_amount: CoinSDKType;
  max_block_age: bigint;
}
/** PruningParams defines the criterion for pruning Alerts from the state. */
export interface PruningParams {
  /** Enabled defines whether Alerts are to be pruned */
  enabled: boolean;
  /**
   * BlocksToPrune defines the number of blocks until an Alert will be pruned
   * from state, notice this is defined wrt. the current block height, i.e
   * Alerts will be stored in state until current_height + BlocksToPrune is
   * reached.
   */
  blocksToPrune: bigint;
}
export interface PruningParamsProtoMsg {
  typeUrl: "/slinky.alerts.v1.PruningParams";
  value: Uint8Array;
}
/** PruningParams defines the criterion for pruning Alerts from the state. */
export interface PruningParamsAmino {
  /** Enabled defines whether Alerts are to be pruned */
  enabled?: boolean;
  /**
   * BlocksToPrune defines the number of blocks until an Alert will be pruned
   * from state, notice this is defined wrt. the current block height, i.e
   * Alerts will be stored in state until current_height + BlocksToPrune is
   * reached.
   */
  blocks_to_prune?: string;
}
export interface PruningParamsAminoMsg {
  type: "/slinky.alerts.v1.PruningParams";
  value: PruningParamsAmino;
}
/** PruningParams defines the criterion for pruning Alerts from the state. */
export interface PruningParamsSDKType {
  enabled: boolean;
  blocks_to_prune: bigint;
}
/** Params is the set of parameters for the x/Alerts module. */
export interface Params {
  /** AlertParams is the set of parameters for the x/Alerts module's Alerting. */
  alertParams: AlertParams;
  /**
   * ConclusionVerificationParams is the set of parameters for the x/Alerts
   * module's conclusion verification.
   */
  conclusionVerificationParams?: Any;
  /** PruningParams is the set of parameters for the x/Alerts module's pruning. */
  pruningParams: PruningParams;
}
export interface ParamsProtoMsg {
  typeUrl: "/slinky.alerts.v1.Params";
  value: Uint8Array;
}
/** Params is the set of parameters for the x/Alerts module. */
export interface ParamsAmino {
  /** AlertParams is the set of parameters for the x/Alerts module's Alerting. */
  alert_params?: AlertParamsAmino;
  /**
   * ConclusionVerificationParams is the set of parameters for the x/Alerts
   * module's conclusion verification.
   */
  conclusion_verification_params?: AnyAmino;
  /** PruningParams is the set of parameters for the x/Alerts module's pruning. */
  pruning_params?: PruningParamsAmino;
}
export interface ParamsAminoMsg {
  type: "/slinky.alerts.v1.Params";
  value: ParamsAmino;
}
/** Params is the set of parameters for the x/Alerts module. */
export interface ParamsSDKType {
  alert_params: AlertParamsSDKType;
  conclusion_verification_params?: AnySDKType;
  pruning_params: PruningParamsSDKType;
}
/**
 * GenesisState is the state that must be provided at genesis. It contains
 * params for the module, and the set initial Alerts.
 */
export interface GenesisState {
  /** Params is the set of x/Alerts parameters */
  params: Params;
  /** Alerts is the set of Alerts that have been submitted to the module */
  alerts: AlertWithStatus[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/slinky.alerts.v1.GenesisState";
  value: Uint8Array;
}
/**
 * GenesisState is the state that must be provided at genesis. It contains
 * params for the module, and the set initial Alerts.
 */
export interface GenesisStateAmino {
  /** Params is the set of x/Alerts parameters */
  params?: ParamsAmino;
  /** Alerts is the set of Alerts that have been submitted to the module */
  alerts?: AlertWithStatusAmino[];
}
export interface GenesisStateAminoMsg {
  type: "/slinky.alerts.v1.GenesisState";
  value: GenesisStateAmino;
}
/**
 * GenesisState is the state that must be provided at genesis. It contains
 * params for the module, and the set initial Alerts.
 */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  alerts: AlertWithStatusSDKType[];
}
function createBaseAlertParams(): AlertParams {
  return {
    enabled: false,
    bondAmount: Coin.fromPartial({}),
    maxBlockAge: BigInt(0)
  };
}
export const AlertParams = {
  typeUrl: "/slinky.alerts.v1.AlertParams",
  encode(message: AlertParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.enabled === true) {
      writer.uint32(8).bool(message.enabled);
    }
    if (message.bondAmount !== undefined) {
      Coin.encode(message.bondAmount, writer.uint32(18).fork()).ldelim();
    }
    if (message.maxBlockAge !== BigInt(0)) {
      writer.uint32(24).uint64(message.maxBlockAge);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AlertParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlertParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.enabled = reader.bool();
          break;
        case 2:
          message.bondAmount = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.maxBlockAge = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AlertParams>): AlertParams {
    const message = createBaseAlertParams();
    message.enabled = object.enabled ?? false;
    message.bondAmount = object.bondAmount !== undefined && object.bondAmount !== null ? Coin.fromPartial(object.bondAmount) : undefined;
    message.maxBlockAge = object.maxBlockAge !== undefined && object.maxBlockAge !== null ? BigInt(object.maxBlockAge.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: AlertParamsAmino): AlertParams {
    const message = createBaseAlertParams();
    if (object.enabled !== undefined && object.enabled !== null) {
      message.enabled = object.enabled;
    }
    if (object.bond_amount !== undefined && object.bond_amount !== null) {
      message.bondAmount = Coin.fromAmino(object.bond_amount);
    }
    if (object.max_block_age !== undefined && object.max_block_age !== null) {
      message.maxBlockAge = BigInt(object.max_block_age);
    }
    return message;
  },
  toAmino(message: AlertParams): AlertParamsAmino {
    const obj: any = {};
    obj.enabled = message.enabled === false ? undefined : message.enabled;
    obj.bond_amount = message.bondAmount ? Coin.toAmino(message.bondAmount) : Coin.toAmino(Coin.fromPartial({}));
    obj.max_block_age = message.maxBlockAge !== BigInt(0) ? message.maxBlockAge.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: AlertParamsAminoMsg): AlertParams {
    return AlertParams.fromAmino(object.value);
  },
  fromProtoMsg(message: AlertParamsProtoMsg): AlertParams {
    return AlertParams.decode(message.value);
  },
  toProto(message: AlertParams): Uint8Array {
    return AlertParams.encode(message).finish();
  },
  toProtoMsg(message: AlertParams): AlertParamsProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.AlertParams",
      value: AlertParams.encode(message).finish()
    };
  }
};
function createBasePruningParams(): PruningParams {
  return {
    enabled: false,
    blocksToPrune: BigInt(0)
  };
}
export const PruningParams = {
  typeUrl: "/slinky.alerts.v1.PruningParams",
  encode(message: PruningParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.enabled === true) {
      writer.uint32(8).bool(message.enabled);
    }
    if (message.blocksToPrune !== BigInt(0)) {
      writer.uint32(16).uint64(message.blocksToPrune);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PruningParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePruningParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.enabled = reader.bool();
          break;
        case 2:
          message.blocksToPrune = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PruningParams>): PruningParams {
    const message = createBasePruningParams();
    message.enabled = object.enabled ?? false;
    message.blocksToPrune = object.blocksToPrune !== undefined && object.blocksToPrune !== null ? BigInt(object.blocksToPrune.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: PruningParamsAmino): PruningParams {
    const message = createBasePruningParams();
    if (object.enabled !== undefined && object.enabled !== null) {
      message.enabled = object.enabled;
    }
    if (object.blocks_to_prune !== undefined && object.blocks_to_prune !== null) {
      message.blocksToPrune = BigInt(object.blocks_to_prune);
    }
    return message;
  },
  toAmino(message: PruningParams): PruningParamsAmino {
    const obj: any = {};
    obj.enabled = message.enabled === false ? undefined : message.enabled;
    obj.blocks_to_prune = message.blocksToPrune !== BigInt(0) ? message.blocksToPrune.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: PruningParamsAminoMsg): PruningParams {
    return PruningParams.fromAmino(object.value);
  },
  fromProtoMsg(message: PruningParamsProtoMsg): PruningParams {
    return PruningParams.decode(message.value);
  },
  toProto(message: PruningParams): Uint8Array {
    return PruningParams.encode(message).finish();
  },
  toProtoMsg(message: PruningParams): PruningParamsProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.PruningParams",
      value: PruningParams.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    alertParams: AlertParams.fromPartial({}),
    conclusionVerificationParams: undefined,
    pruningParams: PruningParams.fromPartial({})
  };
}
export const Params = {
  typeUrl: "/slinky.alerts.v1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.alertParams !== undefined) {
      AlertParams.encode(message.alertParams, writer.uint32(10).fork()).ldelim();
    }
    if (message.conclusionVerificationParams !== undefined) {
      Any.encode(message.conclusionVerificationParams, writer.uint32(18).fork()).ldelim();
    }
    if (message.pruningParams !== undefined) {
      PruningParams.encode(message.pruningParams, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alertParams = AlertParams.decode(reader, reader.uint32());
          break;
        case 2:
          message.conclusionVerificationParams = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.pruningParams = PruningParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.alertParams = object.alertParams !== undefined && object.alertParams !== null ? AlertParams.fromPartial(object.alertParams) : undefined;
    message.conclusionVerificationParams = object.conclusionVerificationParams !== undefined && object.conclusionVerificationParams !== null ? Any.fromPartial(object.conclusionVerificationParams) : undefined;
    message.pruningParams = object.pruningParams !== undefined && object.pruningParams !== null ? PruningParams.fromPartial(object.pruningParams) : undefined;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.alert_params !== undefined && object.alert_params !== null) {
      message.alertParams = AlertParams.fromAmino(object.alert_params);
    }
    if (object.conclusion_verification_params !== undefined && object.conclusion_verification_params !== null) {
      message.conclusionVerificationParams = Any.fromAmino(object.conclusion_verification_params);
    }
    if (object.pruning_params !== undefined && object.pruning_params !== null) {
      message.pruningParams = PruningParams.fromAmino(object.pruning_params);
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.alert_params = message.alertParams ? AlertParams.toAmino(message.alertParams) : undefined;
    obj.conclusion_verification_params = message.conclusionVerificationParams ? Any.toAmino(message.conclusionVerificationParams) : undefined;
    obj.pruning_params = message.pruningParams ? PruningParams.toAmino(message.pruningParams) : undefined;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    alerts: []
  };
}
export const GenesisState = {
  typeUrl: "/slinky.alerts.v1.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.alerts) {
      AlertWithStatus.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.alerts.push(AlertWithStatus.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.alerts = object.alerts?.map(e => AlertWithStatus.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    message.alerts = object.alerts?.map(e => AlertWithStatus.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    if (message.alerts) {
      obj.alerts = message.alerts.map(e => e ? AlertWithStatus.toAmino(e) : undefined);
    } else {
      obj.alerts = message.alerts;
    }
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/slinky.alerts.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};