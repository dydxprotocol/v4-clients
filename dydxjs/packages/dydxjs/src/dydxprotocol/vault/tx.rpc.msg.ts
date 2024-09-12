//@ts-nocheck
import { Rpc } from "../../helpers";
import { BinaryReader } from "../../binary";
import { MsgDepositToMegavault, MsgDepositToMegavaultResponse, MsgUpdateDefaultQuotingParams, MsgUpdateDefaultQuotingParamsResponse, MsgSetVaultParams, MsgSetVaultParamsResponse } from "./tx";
/** Msg defines the Msg service. */
export interface Msg {
  /** DepositToMegavault deposits funds into megavault. */
  depositToMegavault(request: MsgDepositToMegavault): Promise<MsgDepositToMegavaultResponse>;
  /** UpdateDefaultQuotingParams updates the default quoting params in state. */
  updateDefaultQuotingParams(request: MsgUpdateDefaultQuotingParams): Promise<MsgUpdateDefaultQuotingParamsResponse>;
  /** SetVaultParams sets the parameters of a specific vault. */
  setVaultParams(request: MsgSetVaultParams): Promise<MsgSetVaultParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.depositToMegavault = this.depositToMegavault.bind(this);
    this.updateDefaultQuotingParams = this.updateDefaultQuotingParams.bind(this);
    this.setVaultParams = this.setVaultParams.bind(this);
  }
  depositToMegavault(request: MsgDepositToMegavault): Promise<MsgDepositToMegavaultResponse> {
    const data = MsgDepositToMegavault.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.vault.Msg", "DepositToMegavault", data);
    return promise.then(data => MsgDepositToMegavaultResponse.decode(new BinaryReader(data)));
  }
  updateDefaultQuotingParams(request: MsgUpdateDefaultQuotingParams): Promise<MsgUpdateDefaultQuotingParamsResponse> {
    const data = MsgUpdateDefaultQuotingParams.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.vault.Msg", "UpdateDefaultQuotingParams", data);
    return promise.then(data => MsgUpdateDefaultQuotingParamsResponse.decode(new BinaryReader(data)));
  }
  setVaultParams(request: MsgSetVaultParams): Promise<MsgSetVaultParamsResponse> {
    const data = MsgSetVaultParams.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.vault.Msg", "SetVaultParams", data);
    return promise.then(data => MsgSetVaultParamsResponse.decode(new BinaryReader(data)));
  }
}