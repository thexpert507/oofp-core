import { Fn } from "./function.ts";
import { Kind, URIS } from "./URIS.ts";

export interface Chain<F extends URIS> {
  chain: <A, B>(f: Fn<A, Kind<F, B>>) => (as: Kind<F, A>) => Kind<F, B>;
}
