import { URIS } from "./URIS.ts";
import { URIS2 } from "@/URIS2";
import { Chain, Chain2 } from "./chain.ts";
import { Functor, Functor2 } from "./functor.ts";
import { Pointed, Pointed2 } from "./pointed.ts";
import { Joinable, Joinable2 } from "./join.ts";

export interface Monad<F extends URIS> extends Functor<F>, Pointed<F>, Chain<F>, Joinable<F> {
  readonly URI: F;
}

export interface Monad2<F extends URIS2> extends Functor2<F>, Pointed2<F>, Chain2<F>, Joinable2<F> {
  readonly URI: F;
}
