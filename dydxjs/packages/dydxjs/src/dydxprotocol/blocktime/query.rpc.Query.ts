//@ts-nocheck
import { Rpc } from "../../helpers";
import { BinaryReader } from "../../binary";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryDowntimeParamsRequest, QueryDowntimeParamsResponse, QueryPreviousBlockInfoRequest, QueryPreviousBlockInfoResponse, QueryAllDowntimeInfoRequest, QueryAllDowntimeInfoResponse } from "./query";
/** Query defines the gRPC querier service. */
export interface Query {
  /** Queries the DowntimeParams. */
  downtimeParams(request?: QueryDowntimeParamsRequest): Promise<QueryDowntimeParamsResponse>;
  /** Queries the information of the previous block */
  previousBlockInfo(request?: QueryPreviousBlockInfoRequest): Promise<QueryPreviousBlockInfoResponse>;
  /** Queries all recorded downtime info. */
  allDowntimeInfo(request?: QueryAllDowntimeInfoRequest): Promise<QueryAllDowntimeInfoResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.downtimeParams = this.downtimeParams.bind(this);
    this.previousBlockInfo = this.previousBlockInfo.bind(this);
    this.allDowntimeInfo = this.allDowntimeInfo.bind(this);
  }
  downtimeParams(request: QueryDowntimeParamsRequest = {}): Promise<QueryDowntimeParamsResponse> {
    const data = QueryDowntimeParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.blocktime.Query", "DowntimeParams", data);
    return promise.then(data => QueryDowntimeParamsResponse.decode(new BinaryReader(data)));
  }
  previousBlockInfo(request: QueryPreviousBlockInfoRequest = {}): Promise<QueryPreviousBlockInfoResponse> {
    const data = QueryPreviousBlockInfoRequest.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.blocktime.Query", "PreviousBlockInfo", data);
    return promise.then(data => QueryPreviousBlockInfoResponse.decode(new BinaryReader(data)));
  }
  allDowntimeInfo(request: QueryAllDowntimeInfoRequest = {}): Promise<QueryAllDowntimeInfoResponse> {
    const data = QueryAllDowntimeInfoRequest.encode(request).finish();
    const promise = this.rpc.request("dydxprotocol.blocktime.Query", "AllDowntimeInfo", data);
    return promise.then(data => QueryAllDowntimeInfoResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    downtimeParams(request?: QueryDowntimeParamsRequest): Promise<QueryDowntimeParamsResponse> {
      return queryService.downtimeParams(request);
    },
    previousBlockInfo(request?: QueryPreviousBlockInfoRequest): Promise<QueryPreviousBlockInfoResponse> {
      return queryService.previousBlockInfo(request);
    },
    allDowntimeInfo(request?: QueryAllDowntimeInfoRequest): Promise<QueryAllDowntimeInfoResponse> {
      return queryService.allDowntimeInfo(request);
    }
  };
};