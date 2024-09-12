//@ts-nocheck
import { MsgDepositToMegavault, MsgUpdateDefaultQuotingParams, MsgSetVaultParams } from "./tx";
export const AminoConverter = {
  "/dydxprotocol.vault.MsgDepositToMegavault": {
    aminoType: "/dydxprotocol.vault.MsgDepositToMegavault",
    toAmino: MsgDepositToMegavault.toAmino,
    fromAmino: MsgDepositToMegavault.fromAmino
  },
  "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams": {
    aminoType: "/dydxprotocol.vault.MsgUpdateDefaultQuotingParams",
    toAmino: MsgUpdateDefaultQuotingParams.toAmino,
    fromAmino: MsgUpdateDefaultQuotingParams.fromAmino
  },
  "/dydxprotocol.vault.MsgSetVaultParams": {
    aminoType: "/dydxprotocol.vault.MsgSetVaultParams",
    toAmino: MsgSetVaultParams.toAmino,
    fromAmino: MsgSetVaultParams.fromAmino
  }
};