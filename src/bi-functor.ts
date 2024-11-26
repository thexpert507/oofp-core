import { Fn } from "./function.ts";
import { Kind2, URIS2 } from "./URIS2.ts";

export interface BiFunctor<F extends URIS2> {
  bimap<A, B, C, D>(f: Fn<A, C>, g: Fn<B, D>): (bifunctor: Kind2<F, A, B>) => Kind2<F, C, D>;
}
