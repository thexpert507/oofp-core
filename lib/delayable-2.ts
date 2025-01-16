import { Kind2, URIS2 } from "@/URIS2";

export interface Delayable2<F extends URIS2> {
  delay: <A>(ms: number) => <E>(fa: Kind2<F, E, A>) => Kind2<F, E, A>;
}
