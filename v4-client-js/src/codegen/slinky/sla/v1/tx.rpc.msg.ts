import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgAddSLAs, MsgAddSLAsResponse, MsgRemoveSLAs, MsgRemoveSLAsResponse, MsgParams, MsgParamsResponse } from "./tx";
/** Msg is the message service for the x/sla module. */
export interface Msg {
  /**
   * AddSLA defines a method for adding a new SLAs to the store. Note, this will
   * overwrite any existing SLA with the same ID.
   */
  addSLAs(request: MsgAddSLAs): Promise<MsgAddSLAsResponse>;
  /**
   * RemoveSLA defines a method for removing existing SLAs from the store. Note,
   * this will not panic if the SLA does not exist.
   */
  removeSLAs(request: MsgRemoveSLAs): Promise<MsgRemoveSLAsResponse>;
  /** Params defines a method for updating the SLA module parameters. */
  params(request: MsgParams): Promise<MsgParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.addSLAs = this.addSLAs.bind(this);
    this.removeSLAs = this.removeSLAs.bind(this);
    this.params = this.params.bind(this);
  }
  addSLAs(request: MsgAddSLAs): Promise<MsgAddSLAsResponse> {
    const data = MsgAddSLAs.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Msg", "AddSLAs", data);
    return promise.then(data => MsgAddSLAsResponse.decode(new BinaryReader(data)));
  }
  removeSLAs(request: MsgRemoveSLAs): Promise<MsgRemoveSLAsResponse> {
    const data = MsgRemoveSLAs.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Msg", "RemoveSLAs", data);
    return promise.then(data => MsgRemoveSLAsResponse.decode(new BinaryReader(data)));
  }
  params(request: MsgParams): Promise<MsgParamsResponse> {
    const data = MsgParams.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Msg", "Params", data);
    return promise.then(data => MsgParamsResponse.decode(new BinaryReader(data)));
  }
}