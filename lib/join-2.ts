import { Kind2, URIS2 } from "@/URIS2";

export interface Joinable2<F extends URIS2> {
  readonly join: <E, A>(mma: Kind2<F, E, Kind2<F, E, A>>) => Kind2<F, E, A>;
}
