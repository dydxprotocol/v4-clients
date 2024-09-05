import * as _110 from "./applications/transfer/v1/genesis";
import * as _111 from "./applications/transfer/v1/query";
import * as _112 from "./applications/transfer/v1/transfer";
import * as _113 from "./applications/transfer/v1/tx";
import * as _114 from "./applications/transfer/v2/packet";
import * as _115 from "./core/channel/v1/channel";
import * as _116 from "./core/channel/v1/genesis";
import * as _117 from "./core/channel/v1/query";
import * as _118 from "./core/channel/v1/tx";
import * as _119 from "./core/client/v1/client";
import * as _120 from "./core/client/v1/genesis";
import * as _121 from "./core/client/v1/query";
import * as _122 from "./core/client/v1/tx";
import * as _123 from "./core/commitment/v1/commitment";
import * as _124 from "./core/connection/v1/connection";
import * as _125 from "./core/connection/v1/genesis";
import * as _126 from "./core/connection/v1/query";
import * as _127 from "./core/connection/v1/tx";
import * as _128 from "./core/port/v1/query";
import * as _129 from "./core/types/v1/genesis";
import * as _130 from "./lightclients/localhost/v1/localhost";
import * as _131 from "./lightclients/solomachine/v1/solomachine";
import * as _132 from "./lightclients/solomachine/v2/solomachine";
import * as _133 from "./lightclients/tendermint/v1/tendermint";
import * as _255 from "./applications/transfer/v1/tx.amino";
import * as _256 from "./core/channel/v1/tx.amino";
import * as _257 from "./core/client/v1/tx.amino";
import * as _258 from "./core/connection/v1/tx.amino";
import * as _259 from "./applications/transfer/v1/tx.registry";
import * as _260 from "./core/channel/v1/tx.registry";
import * as _261 from "./core/client/v1/tx.registry";
import * as _262 from "./core/connection/v1/tx.registry";
import * as _263 from "./applications/transfer/v1/query.lcd";
import * as _264 from "./core/channel/v1/query.lcd";
import * as _265 from "./core/client/v1/query.lcd";
import * as _266 from "./core/connection/v1/query.lcd";
import * as _267 from "./applications/transfer/v1/query.rpc.Query";
import * as _268 from "./core/channel/v1/query.rpc.Query";
import * as _269 from "./core/client/v1/query.rpc.Query";
import * as _270 from "./core/connection/v1/query.rpc.Query";
import * as _271 from "./core/port/v1/query.rpc.Query";
import * as _272 from "./applications/transfer/v1/tx.rpc.msg";
import * as _273 from "./core/channel/v1/tx.rpc.msg";
import * as _274 from "./core/client/v1/tx.rpc.msg";
import * as _275 from "./core/connection/v1/tx.rpc.msg";
import * as _304 from "./lcd";
import * as _305 from "./rpc.query";
import * as _306 from "./rpc.tx";
export namespace ibc {
  export namespace applications {
    export namespace transfer {
      export const v1 = {
        ..._110,
        ..._111,
        ..._112,
        ..._113,
        ..._255,
        ..._259,
        ..._263,
        ..._267,
        ..._272
      };
      export const v2 = {
        ..._114
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = {
        ..._115,
        ..._116,
        ..._117,
        ..._118,
        ..._256,
        ..._260,
        ..._264,
        ..._268,
        ..._273
      };
    }
    export namespace client {
      export const v1 = {
        ..._119,
        ..._120,
        ..._121,
        ..._122,
        ..._257,
        ..._261,
        ..._265,
        ..._269,
        ..._274
      };
    }
    export namespace commitment {
      export const v1 = {
        ..._123
      };
    }
    export namespace connection {
      export const v1 = {
        ..._124,
        ..._125,
        ..._126,
        ..._127,
        ..._258,
        ..._262,
        ..._266,
        ..._270,
        ..._275
      };
    }
    export namespace port {
      export const v1 = {
        ..._128,
        ..._271
      };
    }
    export namespace types {
      export const v1 = {
        ..._129
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = {
        ..._130
      };
    }
    export namespace solomachine {
      export const v1 = {
        ..._131
      };
      export const v2 = {
        ..._132
      };
    }
    export namespace tendermint {
      export const v1 = {
        ..._133
      };
    }
  }
  export const ClientFactory = {
    ..._304,
    ..._305,
    ..._306
  };
}