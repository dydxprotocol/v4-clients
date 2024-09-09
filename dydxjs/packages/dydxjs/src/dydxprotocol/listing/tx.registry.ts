//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgSetMarketsHardCap, MsgCreateMarketPermissionless, MsgSetListingVaultDepositParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/dydxprotocol.listing.MsgSetMarketsHardCap", MsgSetMarketsHardCap], ["/dydxprotocol.listing.MsgCreateMarketPermissionless", MsgCreateMarketPermissionless], ["/dydxprotocol.listing.MsgSetListingVaultDepositParams", MsgSetListingVaultDepositParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    setMarketsHardCap(value: MsgSetMarketsHardCap) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetMarketsHardCap",
        value: MsgSetMarketsHardCap.encode(value).finish()
      };
    },
    createMarketPermissionless(value: MsgCreateMarketPermissionless) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgCreateMarketPermissionless",
        value: MsgCreateMarketPermissionless.encode(value).finish()
      };
    },
    setListingVaultDepositParams(value: MsgSetListingVaultDepositParams) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetListingVaultDepositParams",
        value: MsgSetListingVaultDepositParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    setMarketsHardCap(value: MsgSetMarketsHardCap) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetMarketsHardCap",
        value
      };
    },
    createMarketPermissionless(value: MsgCreateMarketPermissionless) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgCreateMarketPermissionless",
        value
      };
    },
    setListingVaultDepositParams(value: MsgSetListingVaultDepositParams) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetListingVaultDepositParams",
        value
      };
    }
  },
  fromPartial: {
    setMarketsHardCap(value: MsgSetMarketsHardCap) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetMarketsHardCap",
        value: MsgSetMarketsHardCap.fromPartial(value)
      };
    },
    createMarketPermissionless(value: MsgCreateMarketPermissionless) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgCreateMarketPermissionless",
        value: MsgCreateMarketPermissionless.fromPartial(value)
      };
    },
    setListingVaultDepositParams(value: MsgSetListingVaultDepositParams) {
      return {
        typeUrl: "/dydxprotocol.listing.MsgSetListingVaultDepositParams",
        value: MsgSetListingVaultDepositParams.fromPartial(value)
      };
    }
  }
};