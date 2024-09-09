//@ts-nocheck
import { Tendermint34Client, HttpEndpoint } from "@cosmjs/tendermint-rpc";
import { QueryClient } from "@cosmjs/stargate";
export const createRPCQueryClient = async ({
  rpcEndpoint
}: {
  rpcEndpoint: string | HttpEndpoint;
}) => {
  const tmClient = await Tendermint34Client.connect(rpcEndpoint);
  const client = new QueryClient(tmClient);
  return {
    cosmos: {
      auth: {
        v1beta1: (await import("../cosmos/auth/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      authz: {
        v1beta1: (await import("../cosmos/authz/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      bank: {
        v1beta1: (await import("../cosmos/bank/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      distribution: {
        v1beta1: (await import("../cosmos/distribution/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      feegrant: {
        v1beta1: (await import("../cosmos/feegrant/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      gov: {
        v1: (await import("../cosmos/gov/v1/query.rpc.Query")).createRpcQueryExtension(client),
        v1beta1: (await import("../cosmos/gov/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      group: {
        v1: (await import("../cosmos/group/v1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      mint: {
        v1beta1: (await import("../cosmos/mint/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      params: {
        v1beta1: (await import("../cosmos/params/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      staking: {
        v1beta1: (await import("../cosmos/staking/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      },
      tx: {
        v1beta1: (await import("../cosmos/tx/v1beta1/service.rpc.Service")).createRpcQueryExtension(client)
      },
      upgrade: {
        v1beta1: (await import("../cosmos/upgrade/v1beta1/query.rpc.Query")).createRpcQueryExtension(client)
      }
    },
    dydxprotocol: {
      affiliates: (await import("./affiliates/query.rpc.Query")).createRpcQueryExtension(client),
      assets: (await import("./assets/query.rpc.Query")).createRpcQueryExtension(client),
      blocktime: (await import("./blocktime/query.rpc.Query")).createRpcQueryExtension(client),
      bridge: (await import("./bridge/query.rpc.Query")).createRpcQueryExtension(client),
      clob: (await import("./clob/query.rpc.Query")).createRpcQueryExtension(client),
      delaymsg: (await import("./delaymsg/query.rpc.Query")).createRpcQueryExtension(client),
      epochs: (await import("./epochs/query.rpc.Query")).createRpcQueryExtension(client),
      feetiers: (await import("./feetiers/query.rpc.Query")).createRpcQueryExtension(client),
      govplus: (await import("./govplus/query.rpc.Query")).createRpcQueryExtension(client),
      listing: (await import("./listing/query.rpc.Query")).createRpcQueryExtension(client),
      perpetuals: (await import("./perpetuals/query.rpc.Query")).createRpcQueryExtension(client),
      prices: (await import("./prices/query.rpc.Query")).createRpcQueryExtension(client),
      ratelimit: (await import("./ratelimit/query.rpc.Query")).createRpcQueryExtension(client),
      revshare: (await import("./revshare/query.rpc.Query")).createRpcQueryExtension(client),
      rewards: (await import("./rewards/query.rpc.Query")).createRpcQueryExtension(client),
      sending: (await import("./sending/query.rpc.Query")).createRpcQueryExtension(client),
      stats: (await import("./stats/query.rpc.Query")).createRpcQueryExtension(client),
      subaccounts: (await import("./subaccounts/query.rpc.Query")).createRpcQueryExtension(client),
      vault: (await import("./vault/query.rpc.Query")).createRpcQueryExtension(client),
      vest: (await import("./vest/query.rpc.Query")).createRpcQueryExtension(client)
    }
  };
};