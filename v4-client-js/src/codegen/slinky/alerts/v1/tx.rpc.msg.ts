import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgAlert, MsgAlertResponse, MsgConclusion, MsgConclusionResponse, MsgUpdateParams, MsgUpdateParamsResponse } from "./tx";
/** Msg is the message service for the x/alerts module. */
export interface Msg {
  /**
   * Alert creates a new alert. On alert creation (if valid), the alert will be
   * saved to state, and its bond will be escrowed until a corresponding
   * Conclusion is filed to close the alert.
   */
  alert(request: MsgAlert): Promise<MsgAlertResponse>;
  /**
   * Conclusion closes an alert. On alert conclusion (if valid), the alert will
   * be marked as Concluded, the bond for the alert will either be burned or
   * returned, and a set of incentives will be issued to the validators deemed
   * malicious by the conclusion.
   */
  conclusion(request: MsgConclusion): Promise<MsgConclusionResponse>;
  /**
   * UpdateParams updates the parameters of the alerts module. Specifically, the
   * only address that is capable of submitting this Msg is the
   * module-authority, in general, the x/gov module-account. The process for
   * executing this message will be via governance proposal
   */
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.alert = this.alert.bind(this);
    this.conclusion = this.conclusion.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }
  alert(request: MsgAlert): Promise<MsgAlertResponse> {
    const data = MsgAlert.encode(request).finish();
    const promise = this.rpc.request("slinky.alerts.v1.Msg", "Alert", data);
    return promise.then(data => MsgAlertResponse.decode(new BinaryReader(data)));
  }
  conclusion(request: MsgConclusion): Promise<MsgConclusionResponse> {
    const data = MsgConclusion.encode(request).finish();
    const promise = this.rpc.request("slinky.alerts.v1.Msg", "Conclusion", data);
    return promise.then(data => MsgConclusionResponse.decode(new BinaryReader(data)));
  }
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request("slinky.alerts.v1.Msg", "UpdateParams", data);
    return promise.then(data => MsgUpdateParamsResponse.decode(new BinaryReader(data)));
  }
}