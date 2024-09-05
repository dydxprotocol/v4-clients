import { LCDClient } from "@cosmology/lcd";
import { AlertsRequest, AlertsResponseSDKType, ParamsRequest, ParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.alerts = this.alerts.bind(this);
    this.params = this.params.bind(this);
  }
  /* Alerts gets all alerts in state under the given status. If no status is
   given, all Alerts are returned */
  async alerts(params: AlertsRequest): Promise<AlertsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.status !== "undefined") {
      options.params.status = params.status;
    }
    const endpoint = `slinky/alerts/v1/alerts`;
    return await this.req.get<AlertsResponseSDKType>(endpoint, options);
  }
  /* Params */
  async params(_params: ParamsRequest = {}): Promise<ParamsResponseSDKType> {
    const endpoint = `slinky/alerts/v1/params`;
    return await this.req.get<ParamsResponseSDKType>(endpoint);
  }
}