import { Fn } from "./function.ts";
import { Kind, URIS } from "./URIS.ts";

export interface Functor<F extends URIS> {
  map: <A, B>(f: Fn<A, B>) => (as: Kind<F, A>) => Kind<F, B>;
}
