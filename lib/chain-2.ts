import { Fn } from "./function.ts";
import { Kind2, URIS2 } from "./URIS2.ts";

export interface Chain2<F extends URIS2> {
  chain: <L, A, A2>(f: Fn<A, Kind2<F, L, A2>>) => (ma: Kind2<F, L, A>) => Kind2<F, L, A2>;
}
