//@ts-nocheck
import { MsgSetMarketsHardCap, MsgCreateMarketPermissionless, MsgSetListingVaultDepositParams } from "./tx";
export const AminoConverter = {
  "/dydxprotocol.listing.MsgSetMarketsHardCap": {
    aminoType: "/dydxprotocol.listing.MsgSetMarketsHardCap",
    toAmino: MsgSetMarketsHardCap.toAmino,
    fromAmino: MsgSetMarketsHardCap.fromAmino
  },
  "/dydxprotocol.listing.MsgCreateMarketPermissionless": {
    aminoType: "/dydxprotocol.listing.MsgCreateMarketPermissionless",
    toAmino: MsgCreateMarketPermissionless.toAmino,
    fromAmino: MsgCreateMarketPermissionless.fromAmino
  },
  "/dydxprotocol.listing.MsgSetListingVaultDepositParams": {
    aminoType: "/dydxprotocol.listing.MsgSetListingVaultDepositParams",
    toAmino: MsgSetListingVaultDepositParams.toAmino,
    fromAmino: MsgSetListingVaultDepositParams.fromAmino
  }
};