import { Kind, URIS } from "@/URIS";
import { Kind2, URIS2 } from "@/URIS2";

export interface Joinable<F extends URIS> {
  readonly join: <A>(mma: Kind<F, Kind<F, A>>) => Kind<F, A>;
}

export interface Joinable2<F extends URIS2> {
  readonly join: <E, A>(mma: Kind2<F, E, Kind2<F, E, A>>) => Kind2<F, E, A>;
}
