//@ts-nocheck
import { Rpc } from "../../helpers";
import { BinaryReader } from "../../binary";
import { MsgSlashValidator, MsgSlashValidatorResponse } from "./tx";
/** Msg defines the Msg service. */
export interface Msg {
  /**
   * SlashValidator is exposed to allow slashing of a misbehaving validator via
   * governance.
   */
  slashValidator(request: MsgSlashValidator): Promise<MsgSlashValidatorResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.slashValidator = this.slashValidator.bind(this);
  }
  slashValidator(request: MsgSlashValidator): Promise<MsgSlashValidatorResponse> {
    const data = MsgSlashValidator.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.govplus.Msg", "SlashValidator", data);
    return promise.then(data => MsgSlashValidatorResponse.decode(new BinaryReader(data)));
  }
}