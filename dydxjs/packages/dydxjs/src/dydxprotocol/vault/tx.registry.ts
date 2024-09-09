//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgDepositToMegavault, MsgUpdateDefaultQuotingParams, MsgSetVaultParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/dydxprotocol.vault.MsgDepositToMegavault", MsgDepositToMegavault], ["/dydxprotocol.vault.MsgUpdateDefaultQuotingParams", MsgUpdateDefaultQuotingParams], ["/dydxprotocol.vault.MsgSetVaultParams", MsgSetVaultParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    depositToMegavault(value: MsgDepositToMegavault) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault",
        value: MsgDepositToMegavault.encode(value).finish()
      };
    },
    updateDefaultQuotingParams(value: MsgUpdateDefaultQuotingParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
        value: MsgUpdateDefaultQuotingParams.encode(value).finish()
      };
    },
    setVaultParams(value: MsgSetVaultParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgSetVaultParams",
        value: MsgSetVaultParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    depositToMegavault(value: MsgDepositToMegavault) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault",
        value
      };
    },
    updateDefaultQuotingParams(value: MsgUpdateDefaultQuotingParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
        value
      };
    },
    setVaultParams(value: MsgSetVaultParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgSetVaultParams",
        value
      };
    }
  },
  fromPartial: {
    depositToMegavault(value: MsgDepositToMegavault) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgDepositToMegavault",
        value: MsgDepositToMegavault.fromPartial(value)
      };
    },
    updateDefaultQuotingParams(value: MsgUpdateDefaultQuotingParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
        value: MsgUpdateDefaultQuotingParams.fromPartial(value)
      };
    },
    setVaultParams(value: MsgSetVaultParams) {
      return {
        typeUrl: "/dydxprotocol.vault.MsgSetVaultParams",
        value: MsgSetVaultParams.fromPartial(value)
      };
    }
  }
};