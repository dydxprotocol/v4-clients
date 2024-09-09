//@ts-nocheck
import { MsgRegisterAffiliate, MsgUpdateAffiliateTiers } from "./tx";
export const AminoConverter = {
  "/dydxprotocol.affiliates.MsgRegisterAffiliate": {
    aminoType: "/dydxprotocol.affiliates.MsgRegisterAffiliate",
    toAmino: MsgRegisterAffiliate.toAmino,
    fromAmino: MsgRegisterAffiliate.fromAmino
  },
  "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers": {
    aminoType: "/dydxprotocol.affiliates.MsgUpdateAffiliateTiers",
    toAmino: MsgUpdateAffiliateTiers.toAmino,
    fromAmino: MsgUpdateAffiliateTiers.fromAmino
  }
};