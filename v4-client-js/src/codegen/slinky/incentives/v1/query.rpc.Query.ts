import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { GetIncentivesByTypeRequest, GetIncentivesByTypeResponse, GetAllIncentivesRequest, GetAllIncentivesResponse } from "./query";
/** Query is the query service for the x/incentives module. */
export interface Query {
  /**
   * GetIncentivesByType returns all incentives of a given type. If the type is
   * not registered with the module, an error is returned.
   */
  getIncentivesByType(request: GetIncentivesByTypeRequest): Promise<GetIncentivesByTypeResponse>;
  /** GetAllIncentives returns all incentives. */
  getAllIncentives(request?: GetAllIncentivesRequest): Promise<GetAllIncentivesResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.getIncentivesByType = this.getIncentivesByType.bind(this);
    this.getAllIncentives = this.getAllIncentives.bind(this);
  }
  getIncentivesByType(request: GetIncentivesByTypeRequest): Promise<GetIncentivesByTypeResponse> {
    const data = GetIncentivesByTypeRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.incentives.v1.Query", "GetIncentivesByType", data);
    return promise.then(data => GetIncentivesByTypeResponse.decode(new BinaryReader(data)));
  }
  getAllIncentives(request: GetAllIncentivesRequest = {}): Promise<GetAllIncentivesResponse> {
    const data = GetAllIncentivesRequest.encode(request).finish();
    const promise = this.rpc.request("slinky.incentives.v1.Query", "GetAllIncentives", data);
    return promise.then(data => GetAllIncentivesResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    getIncentivesByType(request: GetIncentivesByTypeRequest): Promise<GetIncentivesByTypeResponse> {
      return queryService.getIncentivesByType(request);
    },
    getAllIncentives(request?: GetAllIncentivesRequest): Promise<GetAllIncentivesResponse> {
      return queryService.getAllIncentives(request);
    }
  };
};