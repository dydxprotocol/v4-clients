//@ts-nocheck
import { MsgAlert, MsgConclusion, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/slinky.alerts.v1.MsgAlert": {
    aminoType: "slinky/x/alerts/MsgAlert",
    toAmino: MsgAlert.toAmino,
    fromAmino: MsgAlert.fromAmino
  },
  "/slinky.alerts.v1.MsgConclusion": {
    aminoType: "slinky/x/alerts/MsgConclusion",
    toAmino: MsgConclusion.toAmino,
    fromAmino: MsgConclusion.fromAmino
  },
  "/slinky.alerts.v1.MsgUpdateParams": {
    aminoType: "slinky/x/alerts/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};