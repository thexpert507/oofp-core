import { Kind2, URIS2 } from "@/URIS2";
import { Fn } from "./function";

export interface Applicative2<F extends URIS2> {
  apply: <E, A, B>(fab: Kind2<F, E, Fn<A, B>>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}
