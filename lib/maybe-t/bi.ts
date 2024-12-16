import { Kind2, URIS2 } from "@/URIS2";
import { Fn } from "@/function";
import * as M from "@/maybe";
import { Monad2 } from "@/monad-2";

export interface BiMaybeT<F extends URIS2> {
  lift: <E, A>(ma: Kind2<F, E, A>) => Kind2<F, E, M.Maybe<A>>;
  map: <A, B>(f: Fn<A, B>) => <E>(ma: Kind2<F, E, M.Maybe<A>>) => Kind2<F, E, M.Maybe<B>>;
  bimap: <E, A, E2, B>(
    f: Fn<E, E2>,
    g: Fn<A, B>
  ) => (ma: Kind2<F, E, M.Maybe<A>>) => Kind2<F, E2, M.Maybe<B>>;
}

export const base2 = <F extends URIS2>(mo: Monad2<F>): BiMaybeT<F> => ({
  lift: <E, A>(ma: Kind2<F, E, A>) => mo.map<A, M.Maybe<A>>(M.of)(ma),
  map: <A, B>(f: Fn<A, B>) => mo.map(M.map(f)),
  bimap: <E, A, E2, B>(f: Fn<E, E2>, g: Fn<A, B>) => mo.bimap(f, M.map(g)),
});
