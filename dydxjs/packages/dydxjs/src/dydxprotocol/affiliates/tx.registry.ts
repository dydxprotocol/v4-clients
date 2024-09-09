//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgRegisterAffiliate, MsgUpdateAffiliateTiers } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/dydxprotocol.affiliates.MsgRegisterAffiliate", MsgRegisterAffiliate], ["/dydxprotocol.affiliates.MsgUpdateAffiliateTiers", MsgUpdateAffiliateTiers]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    registerAffiliate(value: MsgRegisterAffiliate) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
        value: MsgRegisterAffiliate.encode(value).finish()
      };
    },
    updateAffiliateTiers(value: MsgUpdateAffiliateTiers) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
        value: MsgUpdateAffiliateTiers.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    registerAffiliate(value: MsgRegisterAffiliate) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
        value
      };
    },
    updateAffiliateTiers(value: MsgUpdateAffiliateTiers) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
        value
      };
    }
  },
  fromPartial: {
    registerAffiliate(value: MsgRegisterAffiliate) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
        value: MsgRegisterAffiliate.fromPartial(value)
      };
    },
    updateAffiliateTiers(value: MsgUpdateAffiliateTiers) {
      return {
        typeUrl: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
        value: MsgUpdateAffiliateTiers.fromPartial(value)
      };
    }
  }
};