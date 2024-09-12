//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgSetLimitParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/dydxprotocol.ratelimit.MsgSetLimitParams", MsgSetLimitParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    setLimitParams(value: MsgSetLimitParams) {
      return {
        typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams",
        value: MsgSetLimitParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    setLimitParams(value: MsgSetLimitParams) {
      return {
        typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams",
        value
      };
    }
  },
  fromPartial: {
    setLimitParams(value: MsgSetLimitParams) {
      return {
        typeUrl: "/dydxprotocol.ratelimit.MsgSetLimitParams",
        value: MsgSetLimitParams.fromPartial(value)
      };
    }
  }
};