import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { GetAllSLAsRequest, GetAllSLAsResponse, GetPriceFeedsRequest, GetPriceFeedsResponse, ParamsRequest, ParamsResponse } from "./query";
/** Query is the query service for the x/sla module. */
export interface Query {
  /** GetAllSLAs returns all SLAs that the module is currently enforcing. */
  getAllSLAs(request?: GetAllSLAsRequest): Promise<GetAllSLAsResponse>;
  /**
   * GetPriceFeeds returns all price feeds that the module is currently
   * tracking. This request type inputs the SLA ID to query price feeds for.
   */
  getPriceFeeds(request: GetPriceFeedsRequest): Promise<GetPriceFeedsResponse>;
  /** Params returns the current SLA module parameters. */
  params(request?: ParamsRequest): Promise<ParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.getAllSLAs = this.getAllSLAs.bind(this);
    this.getPriceFeeds = this.getPriceFeeds.bind(this);
    this.params = this.params.bind(this);
  }
  getAllSLAs(request: GetAllSLAsRequest = {}): Promise<GetAllSLAsResponse> {
    const data = GetAllSLAsRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Query", "GetAllSLAs", data);
    return promise.then(data => GetAllSLAsResponse.decode(new BinaryReader(data)));
  }
  getPriceFeeds(request: GetPriceFeedsRequest): Promise<GetPriceFeedsResponse> {
    const data = GetPriceFeedsRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Query", "GetPriceFeeds", data);
    return promise.then(data => GetPriceFeedsResponse.decode(new BinaryReader(data)));
  }
  params(request: ParamsRequest = {}): Promise<ParamsResponse> {
    const data = ParamsRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.sla.v1.Query", "Params", data);
    return promise.then(data => ParamsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    getAllSLAs(request?: GetAllSLAsRequest): Promise<GetAllSLAsResponse> {
      return queryService.getAllSLAs(request);
    },
    getPriceFeeds(request: GetPriceFeedsRequest): Promise<GetPriceFeedsResponse> {
      return queryService.getPriceFeeds(request);
    },
    params(request?: ParamsRequest): Promise<ParamsResponse> {
      return queryService.params(request);
    }
  };
};