import { Kind, URIS } from "@/URIS";
import { Fn } from "./function";
import { Kind2, URIS2 } from "@/URIS2";

export interface Applicative<F extends URIS> {
  apply: <A, B>(fab: Kind<F, Fn<A, B>>) => (fa: Kind<F, A>) => Kind<F, B>;
}

export interface Applicative2<F extends URIS2> {
  apply: <E, A, B>(fab: Kind2<F, E, Fn<A, B>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}
