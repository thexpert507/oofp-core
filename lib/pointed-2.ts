import { Kind2, URIS2 } from "./URIS2.ts";

export interface Pointed2<F extends URIS2> {
  of: <E, A>(value: A) => Kind2<F, E, A>;
  left: <E, A>(value: E) => Kind2<F, E, A>;
  right: <E, A>(value: A) => Kind2<F, E, A>;
}
