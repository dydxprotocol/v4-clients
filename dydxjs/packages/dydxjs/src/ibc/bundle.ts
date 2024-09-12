//@ts-nocheck
import * as _195 from "./applications/transfer/v1/genesis";
import * as _196 from "./applications/transfer/v1/query";
import * as _197 from "./applications/transfer/v1/transfer";
import * as _198 from "./applications/transfer/v1/tx";
import * as _199 from "./applications/transfer/v2/packet";
import * as _200 from "./core/channel/v1/channel";
import * as _201 from "./core/channel/v1/genesis";
import * as _202 from "./core/channel/v1/query";
import * as _203 from "./core/channel/v1/tx";
import * as _204 from "./core/client/v1/client";
import * as _205 from "./core/client/v1/genesis";
import * as _206 from "./core/client/v1/query";
import * as _207 from "./core/client/v1/tx";
import * as _208 from "./core/commitment/v1/commitment";
import * as _209 from "./core/connection/v1/connection";
import * as _210 from "./core/connection/v1/genesis";
import * as _211 from "./core/connection/v1/query";
import * as _212 from "./core/connection/v1/tx";
import * as _213 from "./lightclients/localhost/v1/localhost";
import * as _214 from "./lightclients/solomachine/v1/solomachine";
import * as _215 from "./lightclients/solomachine/v2/solomachine";
import * as _216 from "./lightclients/tendermint/v1/tendermint";
import * as _374 from "./applications/transfer/v1/tx.amino";
import * as _375 from "./core/channel/v1/tx.amino";
import * as _376 from "./core/client/v1/tx.amino";
import * as _377 from "./core/connection/v1/tx.amino";
import * as _378 from "./applications/transfer/v1/tx.registry";
import * as _379 from "./core/channel/v1/tx.registry";
import * as _380 from "./core/client/v1/tx.registry";
import * as _381 from "./core/connection/v1/tx.registry";
import * as _382 from "./applications/transfer/v1/query.rpc.Query";
import * as _383 from "./core/channel/v1/query.rpc.Query";
import * as _384 from "./core/client/v1/query.rpc.Query";
import * as _385 from "./core/connection/v1/query.rpc.Query";
import * as _386 from "./applications/transfer/v1/tx.rpc.msg";
import * as _387 from "./core/channel/v1/tx.rpc.msg";
import * as _388 from "./core/client/v1/tx.rpc.msg";
import * as _389 from "./core/connection/v1/tx.rpc.msg";
import * as _413 from "./rpc.query";
import * as _414 from "./rpc.tx";
export namespace ibc {
  export namespace applications {
    export namespace transfer {
      export const v1 = {
        ..._195,
        ..._196,
        ..._197,
        ..._198,
        ..._374,
        ..._378,
        ..._382,
        ..._386
      };
      export const v2 = {
        ..._199
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = {
        ..._200,
        ..._201,
        ..._202,
        ..._203,
        ..._375,
        ..._379,
        ..._383,
        ..._387
      };
    }
    export namespace client {
      export const v1 = {
        ..._204,
        ..._205,
        ..._206,
        ..._207,
        ..._376,
        ..._380,
        ..._384,
        ..._388
      };
    }
    export namespace commitment {
      export const v1 = {
        ..._208
      };
    }
    export namespace connection {
      export const v1 = {
        ..._209,
        ..._210,
        ..._211,
        ..._212,
        ..._377,
        ..._381,
        ..._385,
        ..._389
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = {
        ..._213
      };
    }
    export namespace solomachine {
      export const v1 = {
        ..._214
      };
      export const v2 = {
        ..._215
      };
    }
    export namespace tendermint {
      export const v1 = {
        ..._216
      };
    }
  }
  export const ClientFactory = {
    ..._413,
    ..._414
  };
}