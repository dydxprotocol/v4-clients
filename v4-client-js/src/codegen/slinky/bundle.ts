import * as _134 from "./abci/v1/vote_extensions";
import * as _135 from "./alerts/module/v1/module";
import * as _136 from "./alerts/v1/alerts";
import * as _137 from "./alerts/v1/genesis";
import * as _138 from "./alerts/v1/query";
import * as _139 from "./alerts/v1/strategies";
import * as _140 from "./alerts/v1/tx";
import * as _141 from "./incentives/module/v1/module";
import * as _142 from "./incentives/v1/examples/badprice";
import * as _143 from "./incentives/v1/examples/goodprice";
import * as _144 from "./incentives/v1/genesis";
import * as _145 from "./incentives/v1/query";
import * as _146 from "./marketmap/module/v1/module";
import * as _147 from "./marketmap/v1/genesis";
import * as _148 from "./marketmap/v1/market";
import * as _149 from "./marketmap/v1/params";
import * as _150 from "./marketmap/v1/query";
import * as _151 from "./marketmap/v1/tx";
import * as _152 from "./oracle/module/v1/module";
import * as _153 from "./oracle/v1/genesis";
import * as _154 from "./oracle/v1/query";
import * as _155 from "./oracle/v1/tx";
import * as _156 from "./service/v1/oracle";
import * as _157 from "./sla/module/v1/module";
import * as _158 from "./sla/v1/genesis";
import * as _159 from "./sla/v1/query";
import * as _160 from "./sla/v1/tx";
import * as _161 from "./types/v1/currency_pair";
import * as _276 from "./alerts/v1/tx.amino";
import * as _277 from "./marketmap/v1/tx.amino";
import * as _278 from "./oracle/v1/tx.amino";
import * as _279 from "./sla/v1/tx.amino";
import * as _280 from "./alerts/v1/tx.registry";
import * as _281 from "./marketmap/v1/tx.registry";
import * as _282 from "./oracle/v1/tx.registry";
import * as _283 from "./sla/v1/tx.registry";
import * as _284 from "./alerts/v1/query.lcd";
import * as _285 from "./incentives/v1/query.lcd";
import * as _286 from "./marketmap/v1/query.lcd";
import * as _287 from "./oracle/v1/query.lcd";
import * as _288 from "./sla/v1/query.lcd";
import * as _289 from "./alerts/v1/query.rpc.Query";
import * as _290 from "./incentives/v1/query.rpc.Query";
import * as _291 from "./marketmap/v1/query.rpc.Query";
import * as _292 from "./oracle/v1/query.rpc.Query";
import * as _293 from "./sla/v1/query.rpc.Query";
import * as _294 from "./alerts/v1/tx.rpc.msg";
import * as _295 from "./marketmap/v1/tx.rpc.msg";
import * as _296 from "./oracle/v1/tx.rpc.msg";
import * as _297 from "./sla/v1/tx.rpc.msg";
import * as _307 from "./lcd";
import * as _308 from "./rpc.query";
import * as _309 from "./rpc.tx";
export namespace slinky {
  export namespace abci {
    export const v1 = {
      ..._134
    };
  }
  export namespace alerts {
    export namespace module {
      export const v1 = {
        ..._135
      };
    }
    export const v1 = {
      ..._136,
      ..._137,
      ..._138,
      ..._139,
      ..._140,
      ..._276,
      ..._280,
      ..._284,
      ..._289,
      ..._294
    };
  }
  export namespace incentives {
    export namespace module {
      export const v1 = {
        ..._141
      };
    }
    export const v1 = {
      ..._142,
      ..._143,
      ..._144,
      ..._145,
      ..._285,
      ..._290
    };
  }
  export namespace marketmap {
    export namespace module {
      export const v1 = {
        ..._146
      };
    }
    export const v1 = {
      ..._147,
      ..._148,
      ..._149,
      ..._150,
      ..._151,
      ..._277,
      ..._281,
      ..._286,
      ..._291,
      ..._295
    };
  }
  export namespace oracle {
    export namespace module {
      export const v1 = {
        ..._152
      };
    }
    export const v1 = {
      ..._153,
      ..._154,
      ..._155,
      ..._278,
      ..._282,
      ..._287,
      ..._292,
      ..._296
    };
  }
  export namespace service {
    export const v1 = {
      ..._156
    };
  }
  export namespace sla {
    export namespace module {
      export const v1 = {
        ..._157
      };
    }
    export const v1 = {
      ..._158,
      ..._159,
      ..._160,
      ..._279,
      ..._283,
      ..._288,
      ..._293,
      ..._297
    };
  }
  export namespace types {
    export const v1 = {
      ..._161
    };
  }
  export const ClientFactory = {
    ..._307,
    ..._308,
    ..._309
  };
}