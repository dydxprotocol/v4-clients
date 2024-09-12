//@ts-nocheck
import * as _245 from "./abci/types";
import * as _246 from "./crypto/keys";
import * as _247 from "./crypto/proof";
import * as _248 from "./libs/bits/types";
import * as _249 from "./p2p/types";
import * as _250 from "./types/block";
import * as _251 from "./types/evidence";
import * as _252 from "./types/params";
import * as _253 from "./types/types";
import * as _254 from "./types/validator";
import * as _255 from "./version/types";
export namespace tendermint {
  export const abci = {
    ..._245
  };
  export const crypto = {
    ..._246,
    ..._247
  };
  export namespace libs {
    export const bits = {
      ..._248
    };
  }
  export const p2p = {
    ..._249
  };
  export const types = {
    ..._250,
    ..._251,
    ..._252,
    ..._253,
    ..._254
  };
  export const version = {
    ..._255
  };
}