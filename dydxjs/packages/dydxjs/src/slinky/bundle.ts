//@ts-nocheck
import * as _217 from "./abci/v1/vote_extensions";
import * as _218 from "./alerts/module/v1/module";
import * as _219 from "./alerts/v1/alerts";
import * as _220 from "./alerts/v1/genesis";
import * as _221 from "./alerts/v1/query";
import * as _222 from "./alerts/v1/strategies";
import * as _223 from "./alerts/v1/tx";
import * as _224 from "./incentives/module/v1/module";
import * as _225 from "./incentives/v1/examples/badprice";
import * as _226 from "./incentives/v1/examples/goodprice";
import * as _227 from "./incentives/v1/genesis";
import * as _228 from "./incentives/v1/query";
import * as _229 from "./marketmap/module/v1/module";
import * as _230 from "./marketmap/v1/genesis";
import * as _231 from "./marketmap/v1/market";
import * as _232 from "./marketmap/v1/params";
import * as _233 from "./marketmap/v1/query";
import * as _234 from "./marketmap/v1/tx";
import * as _235 from "./oracle/module/v1/module";
import * as _236 from "./oracle/v1/genesis";
import * as _237 from "./oracle/v1/query";
import * as _238 from "./oracle/v1/tx";
import * as _239 from "./service/v1/oracle";
import * as _240 from "./sla/module/v1/module";
import * as _241 from "./sla/v1/genesis";
import * as _242 from "./sla/v1/query";
import * as _243 from "./sla/v1/tx";
import * as _244 from "./types/v1/currency_pair";
import * as _390 from "./alerts/v1/tx.amino";
import * as _391 from "./marketmap/v1/tx.amino";
import * as _392 from "./oracle/v1/tx.amino";
import * as _393 from "./sla/v1/tx.amino";
import * as _394 from "./alerts/v1/tx.registry";
import * as _395 from "./marketmap/v1/tx.registry";
import * as _396 from "./oracle/v1/tx.registry";
import * as _397 from "./sla/v1/tx.registry";
import * as _398 from "./alerts/v1/query.rpc.Query";
import * as _399 from "./incentives/v1/query.rpc.Query";
import * as _400 from "./marketmap/v1/query.rpc.Query";
import * as _401 from "./oracle/v1/query.rpc.Query";
import * as _402 from "./sla/v1/query.rpc.Query";
import * as _403 from "./alerts/v1/tx.rpc.msg";
import * as _404 from "./marketmap/v1/tx.rpc.msg";
import * as _405 from "./oracle/v1/tx.rpc.msg";
import * as _406 from "./sla/v1/tx.rpc.msg";
import * as _415 from "./rpc.query";
import * as _416 from "./rpc.tx";
export namespace slinky {
  export namespace abci {
    export const v1 = {
      ..._217
    };
  }
  export namespace alerts {
    export namespace module {
      export const v1 = {
        ..._218
      };
    }
    export const v1 = {
      ..._219,
      ..._220,
      ..._221,
      ..._222,
      ..._223,
      ..._390,
      ..._394,
      ..._398,
      ..._403
    };
  }
  export namespace incentives {
    export namespace module {
      export const v1 = {
        ..._224
      };
    }
    export const v1 = {
      ..._225,
      ..._226,
      ..._227,
      ..._228,
      ..._399
    };
  }
  export namespace marketmap {
    export namespace module {
      export const v1 = {
        ..._229
      };
    }
    export const v1 = {
      ..._230,
      ..._231,
      ..._232,
      ..._233,
      ..._234,
      ..._391,
      ..._395,
      ..._400,
      ..._404
    };
  }
  export namespace oracle {
    export namespace module {
      export const v1 = {
        ..._235
      };
    }
    export const v1 = {
      ..._236,
      ..._237,
      ..._238,
      ..._392,
      ..._396,
      ..._401,
      ..._405
    };
  }
  export namespace service {
    export const v1 = {
      ..._239
    };
  }
  export namespace sla {
    export namespace module {
      export const v1 = {
        ..._240
      };
    }
    export const v1 = {
      ..._241,
      ..._242,
      ..._243,
      ..._393,
      ..._397,
      ..._402,
      ..._406
    };
  }
  export namespace types {
    export const v1 = {
      ..._244
    };
  }
  export const ClientFactory = {
    ..._415,
    ..._416
  };
}