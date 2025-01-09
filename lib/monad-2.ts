import { Functor2 } from "./functor-2.ts";
import { Chain2 } from "./chain-2.ts";
import { Pointed2 } from "./pointed-2.ts";
import { URIS2 } from "./URIS2.ts";
import { Joinable2 } from "./join-2.ts";

export interface Monad2<F extends URIS2> extends Functor2<F>, Pointed2<F>, Chain2<F>, Joinable2<F> {
  readonly URI: F;
}
