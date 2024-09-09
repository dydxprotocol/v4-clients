//@ts-nocheck
import { MsgSetMarketMapperRevenueShare, MsgSetMarketMapperRevShareDetailsForMarket } from "./tx";
export const AminoConverter = {
  "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare": {
    aminoType: "/dydxprotocol.revshare.MsgSetMarketMapperRevenueShare",
    toAmino: MsgSetMarketMapperRevenueShare.toAmino,
    fromAmino: MsgSetMarketMapperRevenueShare.fromAmino
  },
  "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket": {
    aminoType: "/dydxprotocol.revshare.MsgSetMarketMapperRevShareDetailsForMarket",
    toAmino: MsgSetMarketMapperRevShareDetailsForMarket.toAmino,
    fromAmino: MsgSetMarketMapperRevShareDetailsForMarket.fromAmino
  }
};