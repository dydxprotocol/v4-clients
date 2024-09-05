import { LCDClient } from "@cosmology/lcd";
import { GetAllSLAsRequest, GetAllSLAsResponseSDKType, GetPriceFeedsRequest, GetPriceFeedsResponseSDKType, ParamsRequest, ParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.getAllSLAs = this.getAllSLAs.bind(this);
    this.getPriceFeeds = this.getPriceFeeds.bind(this);
    this.params = this.params.bind(this);
  }
  /* GetAllSLAs returns all SLAs that the module is currently enforcing. */
  async getAllSLAs(_params: GetAllSLAsRequest = {}): Promise<GetAllSLAsResponseSDKType> {
    const endpoint = `slinky/sla/v1/slas`;
    return await this.req.get<GetAllSLAsResponseSDKType>(endpoint);
  }
  /* GetPriceFeeds returns all price feeds that the module is currently
   tracking. This request type inputs the SLA ID to query price feeds for. */
  async getPriceFeeds(params: GetPriceFeedsRequest): Promise<GetPriceFeedsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.id !== "undefined") {
      options.params.id = params.id;
    }
    const endpoint = `slinky/sla/v1/price_feeds`;
    return await this.req.get<GetPriceFeedsResponseSDKType>(endpoint, options);
  }
  /* Params returns the current SLA module parameters. */
  async params(_params: ParamsRequest = {}): Promise<ParamsResponseSDKType> {
    const endpoint = `slinky/sla/v1/params`;
    return await this.req.get<ParamsResponseSDKType>(endpoint);
  }
}