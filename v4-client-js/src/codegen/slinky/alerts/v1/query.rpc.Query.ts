import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { AlertsRequest, AlertsResponse, ParamsRequest, ParamsResponse } from "./query";
/** Query is the query service for the x/alerts module. */
export interface Query {
  /**
   * Alerts gets all alerts in state under the given status. If no status is
   * given, all Alerts are returned
   */
  alerts(request: AlertsRequest): Promise<AlertsResponse>;
  params(request?: ParamsRequest): Promise<ParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.alerts = this.alerts.bind(this);
    this.params = this.params.bind(this);
  }
  alerts(request: AlertsRequest): Promise<AlertsResponse> {
    const data = AlertsRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.alerts.v1.Query", "Alerts", data);
    return promise.then(data => AlertsResponse.decode(new BinaryReader(data)));
  }
  params(request: ParamsRequest = {}): Promise<ParamsResponse> {
    const data = ParamsRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.alerts.v1.Query", "Params", data);
    return promise.then(data => ParamsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    alerts(request: AlertsRequest): Promise<AlertsResponse> {
      return queryService.alerts(request);
    },
    params(request?: ParamsRequest): Promise<ParamsResponse> {
      return queryService.params(request);
    }
  };
};