import * as M from "./maybe.ts";
import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";
import { Kind, URIS } from "./URIS.ts";
import { Kind2, URIS2 } from "./URIS2.ts";
import { BiFunctor } from "./bi-functor.ts";

export interface MaybeT<F extends URIS> {
  of: <A>(a: Kind<F, A>) => M.Maybe<Kind<F, A>>;
  map: <A, B>(f: Fn<A, B>) => (as: M.Maybe<Kind<F, A>>) => M.Maybe<Kind<F, B>>;
}

export interface BiMaybeT<F extends URIS2> {
  of: <A, B>(a: Kind2<F, A, B>) => M.Maybe<Kind2<F, A, B>>;
  bimap: <A, B, C, D>(
    f: Fn<A, B>,
    g: Fn<C, D>
  ) => (as: M.Maybe<Kind2<F, A, C>>) => M.Maybe<Kind2<F, B, D>>;
}

const base = <F extends URIS>(functor: Functor<F>): MaybeT<F> => ({
  of: <A>(a: Kind<F, A>) => M.of(a),
  map: <A, B>(f: Fn<A, B>) => M.map(functor.map(f)),
});

const base2 = <F extends URIS2>(functor: BiFunctor<F>): BiMaybeT<F> => ({
  of: <A, B>(a: Kind2<F, A, B>) => M.of(a),
  bimap: <A, B, C, D>(f: Fn<A, B>, g: Fn<C, D>) => M.map(functor.bimap(f, g)),
});

export function maybeT<F extends URIS>(functor: Functor<F>): MaybeT<F>;
export function maybeT<F extends URIS2>(functor: BiFunctor<F>): BiMaybeT<F>;
// deno-lint-ignore no-explicit-any
export function maybeT(functor: any) {
  return "bimap" in functor ? base2(functor) : base(functor);
}
