import { Kind2, URIS2 } from "@/URIS2";
import { Fn } from "./function.ts";
import { Kind, URIS } from "./URIS.ts";

export interface Functor<F extends URIS> {
  map: <A, B>(f: Fn<A, B>) => (as: Kind<F, A>) => Kind<F, B>;
}

export interface Functor2<F extends URIS2> {
  map: <A, B>(f: Fn<A, B>) => <E>(as: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export interface BiFunctor2<F extends URIS2> extends Functor2<F> {
  bimap: <E, A, E2, B>(f: Fn<E, E2>, g: Fn<A, B>) => (as: Kind2<F, E, A>) => Kind2<F, E2, B>;
}
