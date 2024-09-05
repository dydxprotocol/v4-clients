import { MsgAddSLAs, MsgRemoveSLAs, MsgParams } from "./tx";
export const AminoConverter = {
  "/slinky.sla.v1.MsgAddSLAs": {
    aminoType: "/slinky.sla.v1.MsgAddSLAs",
    toAmino: MsgAddSLAs.toAmino,
    fromAmino: MsgAddSLAs.fromAmino
  },
  "/slinky.sla.v1.MsgRemoveSLAs": {
    aminoType: "/slinky.sla.v1.MsgRemoveSLAs",
    toAmino: MsgRemoveSLAs.toAmino,
    fromAmino: MsgRemoveSLAs.fromAmino
  },
  "/slinky.sla.v1.MsgParams": {
    aminoType: "/slinky.sla.v1.MsgParams",
    toAmino: MsgParams.toAmino,
    fromAmino: MsgParams.fromAmino
  }
};