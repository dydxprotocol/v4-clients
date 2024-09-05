import { LCDClient } from "@cosmology/lcd";
import { GetIncentivesByTypeRequest, GetIncentivesByTypeResponseSDKType, GetAllIncentivesRequest, GetAllIncentivesResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.getIncentivesByType = this.getIncentivesByType.bind(this);
    this.getAllIncentives = this.getAllIncentives.bind(this);
  }
  /* GetIncentivesByType returns all incentives of a given type. If the type is
   not registered with the module, an error is returned. */
  async getIncentivesByType(params: GetIncentivesByTypeRequest): Promise<GetIncentivesByTypeResponseSDKType> {
    const endpoint = `slinky/incentives/v1/get_incentives_by_type/${params.incentiveType}`;
    return await this.req.get<GetIncentivesByTypeResponseSDKType>(endpoint);
  }
  /* GetAllIncentives returns all incentives. */
  async getAllIncentives(_params: GetAllIncentivesRequest = {}): Promise<GetAllIncentivesResponseSDKType> {
    const endpoint = `slinky/incentives/v1/get_all_incentives`;
    return await this.req.get<GetAllIncentivesResponseSDKType>(endpoint);
  }
}