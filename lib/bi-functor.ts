import { Fn } from "./function.ts";
import { Kind2, URIS2 } from "./URIS2.ts";

export interface BiFunctor<F extends URIS2> {
  readonly map: <A, B>(f: Fn<A, B>) => <E>(as: Kind2<F, E, A>) => Kind2<F, E, B>;
  readonly bimap: <E, A, E2, B>(
    f: Fn<E, E2>,
    g: Fn<A, B>
  ) => (as: Kind2<F, E, A>) => Kind2<F, E2, B>;
}
