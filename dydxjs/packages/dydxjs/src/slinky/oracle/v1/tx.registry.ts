//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgAddCurrencyPairs, MsgRemoveCurrencyPairs } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/slinky.oracle.v1.MsgAddCurrencyPairs", MsgAddCurrencyPairs], ["/slinky.oracle.v1.MsgRemoveCurrencyPairs", MsgRemoveCurrencyPairs]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    addCurrencyPairs(value: MsgAddCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgAddCurrencyPairs",
        value: MsgAddCurrencyPairs.encode(value).finish()
      };
    },
    removeCurrencyPairs(value: MsgRemoveCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgRemoveCurrencyPairs",
        value: MsgRemoveCurrencyPairs.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    addCurrencyPairs(value: MsgAddCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgAddCurrencyPairs",
        value
      };
    },
    removeCurrencyPairs(value: MsgRemoveCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgRemoveCurrencyPairs",
        value
      };
    }
  },
  fromPartial: {
    addCurrencyPairs(value: MsgAddCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgAddCurrencyPairs",
        value: MsgAddCurrencyPairs.fromPartial(value)
      };
    },
    removeCurrencyPairs(value: MsgRemoveCurrencyPairs) {
      return {
        typeUrl: "/slinky.oracle.v1.MsgRemoveCurrencyPairs",
        value: MsgRemoveCurrencyPairs.fromPartial(value)
      };
    }
  }
};