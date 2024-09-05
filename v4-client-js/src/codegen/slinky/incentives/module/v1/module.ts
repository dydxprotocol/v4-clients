import { BinaryReader, BinaryWriter } from "../../../../binary";
/** Module is the config object of the incentives module. */
export interface Module {}
export interface ModuleProtoMsg {
  typeUrl: "/slinky.incentives.module.v1.Module";
  value: Uint8Array;
}
/** Module is the config object of the incentives module. */
export interface ModuleAmino {}
export interface ModuleAminoMsg {
  type: "/slinky.incentives.module.v1.Module";
  value: ModuleAmino;
}
/** Module is the config object of the incentives module. */
export interface ModuleSDKType {}
function createBaseModule(): Module {
  return {};
}
export const Module = {
  typeUrl: "/slinky.incentives.module.v1.Module",
  encode(_: Module, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Module {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModule();
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
  fromPartial(_: Partial<Module>): Module {
    const message = createBaseModule();
    return message;
  },
  fromAmino(_: ModuleAmino): Module {
    const message = createBaseModule();
    return message;
  },
  toAmino(_: Module): ModuleAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: ModuleAminoMsg): Module {
    return Module.fromAmino(object.value);
  },
  fromProtoMsg(message: ModuleProtoMsg): Module {
    return Module.decode(message.value);
  },
  toProto(message: Module): Uint8Array {
    return Module.encode(message).finish();
  },
  toProtoMsg(message: Module): ModuleProtoMsg {
    return {
      typeUrl: "/slinky.incentives.module.v1.Module",
      value: Module.encode(message).finish()
    };
  }
};