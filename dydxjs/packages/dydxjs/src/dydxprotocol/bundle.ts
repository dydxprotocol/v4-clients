//@ts-nocheck
import * as _72 from "./accountplus/accountplus";
import * as _73 from "./accountplus/genesis";
import * as _74 from "./affiliates/affiliates";
import * as _75 from "./affiliates/genesis";
import * as _76 from "./affiliates/query";
import * as _77 from "./affiliates/tx";
import * as _78 from "./assets/asset";
import * as _79 from "./assets/genesis";
import * as _80 from "./assets/query";
import * as _81 from "./assets/tx";
import * as _82 from "./blocktime/blocktime";
import * as _83 from "./blocktime/genesis";
import * as _84 from "./blocktime/params";
import * as _85 from "./blocktime/query";
import * as _86 from "./blocktime/tx";
import * as _87 from "./bridge/bridge_event_info";
import * as _88 from "./bridge/bridge_event";
import * as _89 from "./bridge/genesis";
import * as _90 from "./bridge/params";
import * as _91 from "./bridge/query";
import * as _92 from "./bridge/tx";
import * as _93 from "./clob/block_rate_limit_config";
import * as _94 from "./clob/clob_pair";
import * as _95 from "./clob/equity_tier_limit_config";
import * as _96 from "./clob/genesis";
import * as _97 from "./clob/liquidations_config";
import * as _98 from "./clob/liquidations";
import * as _99 from "./clob/matches";
import * as _100 from "./clob/mev";
import * as _101 from "./clob/operation";
import * as _102 from "./clob/order_removals";
import * as _103 from "./clob/order";
import * as _104 from "./clob/process_proposer_matches_events";
import * as _105 from "./clob/query";
import * as _106 from "./clob/tx";
import * as _107 from "./daemons/bridge/bridge";
import * as _108 from "./daemons/liquidation/liquidation";
import * as _109 from "./daemons/pricefeed/price_feed";
import * as _110 from "./delaymsg/block_message_ids";
import * as _111 from "./delaymsg/delayed_message";
import * as _112 from "./delaymsg/genesis";
import * as _113 from "./delaymsg/query";
import * as _114 from "./delaymsg/tx";
import * as _115 from "./epochs/epoch_info";
import * as _116 from "./epochs/genesis";
import * as _117 from "./epochs/query";
import * as _118 from "./feetiers/genesis";
import * as _119 from "./feetiers/params";
import * as _120 from "./feetiers/query";
import * as _121 from "./feetiers/tx";
import * as _122 from "./govplus/genesis";
import * as _123 from "./govplus/query";
import * as _124 from "./govplus/tx";
import * as _125 from "./indexer/events/events";
import * as _126 from "./indexer/indexer_manager/event";
import * as _127 from "./indexer/off_chain_updates/off_chain_updates";
import * as _128 from "./indexer/protocol/v1/clob";
import * as _129 from "./indexer/protocol/v1/perpetual";
import * as _130 from "./indexer/protocol/v1/subaccount";
import * as _131 from "./indexer/redis/redis_order";
import * as _132 from "./indexer/shared/removal_reason";
import * as _133 from "./indexer/socks/messages";
import * as _134 from "./listing/genesis";
import * as _135 from "./listing/params";
import * as _136 from "./listing/query";
import * as _137 from "./listing/tx";
import * as _138 from "./perpetuals/genesis";
import * as _139 from "./perpetuals/params";
import * as _140 from "./perpetuals/perpetual";
import * as _141 from "./perpetuals/query";
import * as _142 from "./perpetuals/tx";
import * as _143 from "./prices/genesis";
import * as _144 from "./prices/market_param";
import * as _145 from "./prices/market_price";
import * as _146 from "./prices/query";
import * as _147 from "./prices/tx";
import * as _148 from "./ratelimit/capacity";
import * as _149 from "./ratelimit/genesis";
import * as _150 from "./ratelimit/limit_params";
import * as _151 from "./ratelimit/pending_send_packet";
import * as _152 from "./ratelimit/query";
import * as _153 from "./ratelimit/tx";
import * as _154 from "./revshare/genesis";
import * as _155 from "./revshare/params";
import * as _156 from "./revshare/query";
import * as _157 from "./revshare/revshare";
import * as _158 from "./revshare/tx";
import * as _159 from "./rewards/genesis";
import * as _160 from "./rewards/params";
import * as _161 from "./rewards/query";
import * as _162 from "./rewards/reward_share";
import * as _163 from "./rewards/tx";
import * as _164 from "./sending/genesis";
import * as _165 from "./sending/query";
import * as _166 from "./sending/transfer";
import * as _167 from "./sending/tx";
import * as _168 from "./stats/genesis";
import * as _169 from "./stats/params";
import * as _170 from "./stats/query";
import * as _171 from "./stats/stats";
import * as _172 from "./stats/tx";
import * as _173 from "./subaccounts/asset_position";
import * as _174 from "./subaccounts/genesis";
import * as _175 from "./subaccounts/perpetual_position";
import * as _176 from "./subaccounts/query";
import * as _177 from "./subaccounts/streaming";
import * as _178 from "./subaccounts/subaccount";
import * as _179 from "./vault/genesis";
import * as _180 from "./vault/params";
import * as _181 from "./vault/query";
import * as _182 from "./vault/share";
import * as _183 from "./vault/tx";
import * as _184 from "./vault/vault";
import * as _185 from "./vest/genesis";
import * as _186 from "./vest/query";
import * as _187 from "./vest/tx";
import * as _188 from "./vest/vest_entry";
import * as _303 from "./affiliates/tx.amino";
import * as _304 from "./blocktime/tx.amino";
import * as _305 from "./bridge/tx.amino";
import * as _306 from "./clob/tx.amino";
import * as _307 from "./delaymsg/tx.amino";
import * as _308 from "./feetiers/tx.amino";
import * as _309 from "./govplus/tx.amino";
import * as _310 from "./listing/tx.amino";
import * as _311 from "./perpetuals/tx.amino";
import * as _312 from "./prices/tx.amino";
import * as _313 from "./ratelimit/tx.amino";
import * as _314 from "./revshare/tx.amino";
import * as _315 from "./rewards/tx.amino";
import * as _316 from "./sending/tx.amino";
import * as _317 from "./stats/tx.amino";
import * as _318 from "./vault/tx.amino";
import * as _319 from "./vest/tx.amino";
import * as _320 from "./affiliates/tx.registry";
import * as _321 from "./blocktime/tx.registry";
import * as _322 from "./bridge/tx.registry";
import * as _323 from "./clob/tx.registry";
import * as _324 from "./delaymsg/tx.registry";
import * as _325 from "./feetiers/tx.registry";
import * as _326 from "./govplus/tx.registry";
import * as _327 from "./listing/tx.registry";
import * as _328 from "./perpetuals/tx.registry";
import * as _329 from "./prices/tx.registry";
import * as _330 from "./ratelimit/tx.registry";
import * as _331 from "./revshare/tx.registry";
import * as _332 from "./rewards/tx.registry";
import * as _333 from "./sending/tx.registry";
import * as _334 from "./stats/tx.registry";
import * as _335 from "./vault/tx.registry";
import * as _336 from "./vest/tx.registry";
import * as _337 from "./affiliates/query.rpc.Query";
import * as _338 from "./assets/query.rpc.Query";
import * as _339 from "./blocktime/query.rpc.Query";
import * as _340 from "./bridge/query.rpc.Query";
import * as _341 from "./clob/query.rpc.Query";
import * as _342 from "./delaymsg/query.rpc.Query";
import * as _343 from "./epochs/query.rpc.Query";
import * as _344 from "./feetiers/query.rpc.Query";
import * as _345 from "./govplus/query.rpc.Query";
import * as _346 from "./listing/query.rpc.Query";
import * as _347 from "./perpetuals/query.rpc.Query";
import * as _348 from "./prices/query.rpc.Query";
import * as _349 from "./ratelimit/query.rpc.Query";
import * as _350 from "./revshare/query.rpc.Query";
import * as _351 from "./rewards/query.rpc.Query";
import * as _352 from "./sending/query.rpc.Query";
import * as _353 from "./stats/query.rpc.Query";
import * as _354 from "./subaccounts/query.rpc.Query";
import * as _355 from "./vault/query.rpc.Query";
import * as _356 from "./vest/query.rpc.Query";
import * as _357 from "./affiliates/tx.rpc.msg";
import * as _358 from "./blocktime/tx.rpc.msg";
import * as _359 from "./bridge/tx.rpc.msg";
import * as _360 from "./clob/tx.rpc.msg";
import * as _361 from "./delaymsg/tx.rpc.msg";
import * as _362 from "./feetiers/tx.rpc.msg";
import * as _363 from "./govplus/tx.rpc.msg";
import * as _364 from "./listing/tx.rpc.msg";
import * as _365 from "./perpetuals/tx.rpc.msg";
import * as _366 from "./prices/tx.rpc.msg";
import * as _367 from "./ratelimit/tx.rpc.msg";
import * as _368 from "./revshare/tx.rpc.msg";
import * as _369 from "./rewards/tx.rpc.msg";
import * as _370 from "./sending/tx.rpc.msg";
import * as _371 from "./stats/tx.rpc.msg";
import * as _372 from "./vault/tx.rpc.msg";
import * as _373 from "./vest/tx.rpc.msg";
import * as _411 from "./rpc.query";
import * as _412 from "./rpc.tx";
export namespace dydxprotocol {
  export const accountplus = {
    ..._72,
    ..._73
  };
  export const affiliates = {
    ..._74,
    ..._75,
    ..._76,
    ..._77,
    ..._303,
    ..._320,
    ..._337,
    ..._357
  };
  export const assets = {
    ..._78,
    ..._79,
    ..._80,
    ..._81,
    ..._338
  };
  export const blocktime = {
    ..._82,
    ..._83,
    ..._84,
    ..._85,
    ..._86,
    ..._304,
    ..._321,
    ..._339,
    ..._358
  };
  export const bridge = {
    ..._87,
    ..._88,
    ..._89,
    ..._90,
    ..._91,
    ..._92,
    ..._305,
    ..._322,
    ..._340,
    ..._359
  };
  export const clob = {
    ..._93,
    ..._94,
    ..._95,
    ..._96,
    ..._97,
    ..._98,
    ..._99,
    ..._100,
    ..._101,
    ..._102,
    ..._103,
    ..._104,
    ..._105,
    ..._106,
    ..._306,
    ..._323,
    ..._341,
    ..._360
  };
  export namespace daemons {
    export const bridge = {
      ..._107
    };
    export const liquidation = {
      ..._108
    };
    export const pricefeed = {
      ..._109
    };
  }
  export const delaymsg = {
    ..._110,
    ..._111,
    ..._112,
    ..._113,
    ..._114,
    ..._307,
    ..._324,
    ..._342,
    ..._361
  };
  export const epochs = {
    ..._115,
    ..._116,
    ..._117,
    ..._343
  };
  export const feetiers = {
    ..._118,
    ..._119,
    ..._120,
    ..._121,
    ..._308,
    ..._325,
    ..._344,
    ..._362
  };
  export const govplus = {
    ..._122,
    ..._123,
    ..._124,
    ..._309,
    ..._326,
    ..._345,
    ..._363
  };
  export namespace indexer {
    export const events = {
      ..._125
    };
    export const indexer_manager = {
      ..._126
    };
    export const off_chain_updates = {
      ..._127
    };
    export namespace protocol {
      export const v1 = {
        ..._128,
        ..._129,
        ..._130
      };
    }
    export const redis = {
      ..._131
    };
    export const shared = {
      ..._132
    };
    export const socks = {
      ..._133
    };
  }
  export const listing = {
    ..._134,
    ..._135,
    ..._136,
    ..._137,
    ..._310,
    ..._327,
    ..._346,
    ..._364
  };
  export const perpetuals = {
    ..._138,
    ..._139,
    ..._140,
    ..._141,
    ..._142,
    ..._311,
    ..._328,
    ..._347,
    ..._365
  };
  export const prices = {
    ..._143,
    ..._144,
    ..._145,
    ..._146,
    ..._147,
    ..._312,
    ..._329,
    ..._348,
    ..._366
  };
  export const ratelimit = {
    ..._148,
    ..._149,
    ..._150,
    ..._151,
    ..._152,
    ..._153,
    ..._313,
    ..._330,
    ..._349,
    ..._367
  };
  export const revshare = {
    ..._154,
    ..._155,
    ..._156,
    ..._157,
    ..._158,
    ..._314,
    ..._331,
    ..._350,
    ..._368
  };
  export const rewards = {
    ..._159,
    ..._160,
    ..._161,
    ..._162,
    ..._163,
    ..._315,
    ..._332,
    ..._351,
    ..._369
  };
  export const sending = {
    ..._164,
    ..._165,
    ..._166,
    ..._167,
    ..._316,
    ..._333,
    ..._352,
    ..._370
  };
  export const stats = {
    ..._168,
    ..._169,
    ..._170,
    ..._171,
    ..._172,
    ..._317,
    ..._334,
    ..._353,
    ..._371
  };
  export const subaccounts = {
    ..._173,
    ..._174,
    ..._175,
    ..._176,
    ..._177,
    ..._178,
    ..._354
  };
  export const vault = {
    ..._179,
    ..._180,
    ..._181,
    ..._182,
    ..._183,
    ..._184,
    ..._318,
    ..._335,
    ..._355,
    ..._372
  };
  export const vest = {
    ..._185,
    ..._186,
    ..._187,
    ..._188,
    ..._319,
    ..._336,
    ..._356,
    ..._373
  };
  export const ClientFactory = {
    ..._411,
    ..._412
  };
}