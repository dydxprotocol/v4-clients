import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgAlert, MsgConclusion, MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/slinky.alerts.v1.MsgAlert", MsgAlert], ["/slinky.alerts.v1.MsgConclusion", MsgConclusion], ["/slinky.alerts.v1.MsgUpdateParams", MsgUpdateParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    alert(value: MsgAlert) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgAlert",
        value: MsgAlert.encode(value).finish()
      };
    },
    conclusion(value: MsgConclusion) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgConclusion",
        value: MsgConclusion.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    alert(value: MsgAlert) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgAlert",
        value
      };
    },
    conclusion(value: MsgConclusion) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgConclusion",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgUpdateParams",
        value
      };
    }
  },
  fromPartial: {
    alert(value: MsgAlert) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgAlert",
        value: MsgAlert.fromPartial(value)
      };
    },
    conclusion(value: MsgConclusion) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgConclusion",
        value: MsgConclusion.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/slinky.alerts.v1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};