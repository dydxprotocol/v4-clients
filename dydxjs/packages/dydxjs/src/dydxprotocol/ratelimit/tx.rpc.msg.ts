//@ts-nocheck
import { Rpc } from "../../helpers";
import { BinaryReader } from "../../binary";
import { MsgSetLimitParams, MsgSetLimitParamsResponse } from "./tx";
/** Msg defines the Msg service. */
export interface Msg {
  /** SetLimitParams sets a `LimitParams` object in state. */
  setLimitParams(request: MsgSetLimitParams): Promise<MsgSetLimitParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.setLimitParams = this.setLimitParams.bind(this);
  }
  setLimitParams(request: MsgSetLimitParams): Promise<MsgSetLimitParamsResponse> {
    const data = MsgSetLimitParams.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.ratelimit.Msg", "SetLimitParams", data);
    return promise.then(data => MsgSetLimitParamsResponse.decode(new BinaryReader(data)));
  }
}