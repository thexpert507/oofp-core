import { Kind, URIS } from "@/URIS";

export interface Delayable<F extends URIS> {
  delay: <A>(ms: number) => (fa: Kind<F, A>) => Kind<F, A>;
}
