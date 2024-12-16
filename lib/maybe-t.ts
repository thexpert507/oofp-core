import * as M from "./maybe.ts";
import { Fn } from "./function.ts";
import { Kind, URIS } from "./URIS.ts";
import { Kind2, URIS2 } from "./URIS2.ts";
import { Monad } from "./monad.ts";
import { Monad2 } from "./monad-2.ts";
import { pipe } from "./pipe.ts";

export interface MaybeT<F extends URIS> {
  lift: <A>(ma: Kind<F, A>) => Kind<F, M.Maybe<A>>;
  map: <A, B>(f: Fn<A, B>) => (as: Kind<F, M.Maybe<A>>) => Kind<F, M.Maybe<B>>;
  chain: <A, B>(f: Fn<A, Kind<F, M.Maybe<B>>>) => (as: Kind<F, M.Maybe<A>>) => Kind<F, M.Maybe<B>>;
}

export interface BiMaybeT<F extends URIS2> {
  lift: <E, A>(ma: Kind2<F, E, A>) => Kind2<F, E, M.Maybe<A>>;
  map: <A, B>(f: Fn<A, B>) => <E>(ma: Kind2<F, E, M.Maybe<A>>) => Kind2<F, E, M.Maybe<B>>;
  bimap: <E, A, E2, B>(
    f: Fn<E, E2>,
    g: Fn<A, B>
  ) => (ma: Kind2<F, E, M.Maybe<A>>) => Kind2<F, E2, M.Maybe<B>>;
}

const base = <F extends URIS>(mo: Monad<F>): MaybeT<F> => ({
  lift: mo.map(M.of),
  map: <A, B>(f: Fn<A, B>) => mo.map(M.map(f)),
  chain:
    <A, B>(f: Fn<A, Kind<F, M.Maybe<B>>>) =>
    (as: Kind<F, M.Maybe<A>>) => {
      return pipe(as, mo.chain(M.fold(() => mo.of(M.nothing<B>()), f)));
    },
});

const base2 = <F extends URIS2>(mo: Monad2<F>): BiMaybeT<F> => ({
  lift: <E, A>(ma: Kind2<F, E, A>) => mo.map<A, M.Maybe<A>>(M.of)(ma),
  map: <A, B>(f: Fn<A, B>) => mo.map(M.map(f)),
  bimap: <E, A, E2, B>(f: Fn<E, E2>, g: Fn<A, B>) => mo.bimap(f, M.map(g)),
});

export function maybeT<F extends URIS>(mo: Monad<F>): MaybeT<F>;
export function maybeT<F extends URIS2>(mo: Monad2<F>): BiMaybeT<F>;
// deno-lint-ignore no-explicit-any
export function maybeT(mo: Monad<any> | Monad2<any>): any {
  return "bimap" in mo ? base2(mo) : base(mo);
}
