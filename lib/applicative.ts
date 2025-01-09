import { Kind, URIS } from "@/URIS";
import { Fn } from "./function";

export interface Applicative<F extends URIS> {
  apply: <A, B>(fab: Kind<F, Fn<A, B>>) => (fa: Kind<F, A>) => Kind<F, B>;
}
