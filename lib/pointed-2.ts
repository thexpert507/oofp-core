import { Kind2, URIS2 } from "./URIS2.ts";

export interface Pointed2<F extends URIS2> {
  readonly of: <E, A>(value: A) => Kind2<F, E, A>;
}
