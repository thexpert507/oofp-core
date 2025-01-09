import { Kind, URIS } from "@/URIS";

export interface Joinable<F extends URIS> {
  readonly join: <A>(mma: Kind<F, Kind<F, A>>) => Kind<F, A>;
}
