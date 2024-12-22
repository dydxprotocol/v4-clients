//@ts-nocheck
import { Rpc } from "../helpers";
export const createRPCMsgClient = async ({
  rpc
}: {
  rpc: Rpc;
}) => ({
  cosmos: {
    authz: {
      v1beta1: new (await import("../cosmos/authz/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    bank: {
      v1beta1: new (await import("../cosmos/bank/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    distribution: {
      v1beta1: new (await import("../cosmos/distribution/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    feegrant: {
      v1beta1: new (await import("../cosmos/feegrant/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    gov: {
      v1: new (await import("../cosmos/gov/v1/tx.rpc.msg")).MsgClientImpl(rpc),
      v1beta1: new (await import("../cosmos/gov/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    group: {
      v1: new (await import("../cosmos/group/v1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    staking: {
      v1beta1: new (await import("../cosmos/staking/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    upgrade: {
      v1beta1: new (await import("../cosmos/upgrade/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    vesting: {
      v1beta1: new (await import("../cosmos/vesting/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    }
  },
  dydxprotocol: {
    affiliates: new (await import("./affiliates/tx.rpc.msg")).MsgClientImpl(rpc),
    blocktime: new (await import("./blocktime/tx.rpc.msg")).MsgClientImpl(rpc),
    bridge: new (await import("./bridge/tx.rpc.msg")).MsgClientImpl(rpc),
    clob: new (await import("./clob/tx.rpc.msg")).MsgClientImpl(rpc),
    delaymsg: new (await import("./delaymsg/tx.rpc.msg")).MsgClientImpl(rpc),
    feetiers: new (await import("./feetiers/tx.rpc.msg")).MsgClientImpl(rpc),
    govplus: new (await import("./govplus/tx.rpc.msg")).MsgClientImpl(rpc),
    listing: new (await import("./listing/tx.rpc.msg")).MsgClientImpl(rpc),
    perpetuals: new (await import("./perpetuals/tx.rpc.msg")).MsgClientImpl(rpc),
    prices: new (await import("./prices/tx.rpc.msg")).MsgClientImpl(rpc),
    ratelimit: new (await import("./ratelimit/tx.rpc.msg")).MsgClientImpl(rpc),
    revshare: new (await import("./revshare/tx.rpc.msg")).MsgClientImpl(rpc),
    rewards: new (await import("./rewards/tx.rpc.msg")).MsgClientImpl(rpc),
    sending: new (await import("./sending/tx.rpc.msg")).MsgClientImpl(rpc),
    stats: new (await import("./stats/tx.rpc.msg")).MsgClientImpl(rpc),
    vault: new (await import("./vault/tx.rpc.msg")).MsgClientImpl(rpc),
    vest: new (await import("./vest/tx.rpc.msg")).MsgClientImpl(rpc)
  }
});