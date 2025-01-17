import { Kind, URIS } from "@/URIS";
import { Kind2, URIS2 } from "@/URIS2";

export interface Delayable<F extends URIS> {
  delay: <A>(ms: number) => (fa: Kind<F, A>) => Kind<F, A>;
}

export interface Delayable2<F extends URIS2> {
  delay: <A>(ms: number) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>;
}
