import { Kind2, URIS2 } from "@/URIS2";
import { Kind, URIS } from "./URIS.ts";

export interface Pointed<F extends URIS> {
  of: <A>(a: A) => Kind<F, A>;
}

export interface Pointed2<F extends URIS2> {
  readonly of: <E, A>(value: A) => Kind2<F, E, A>;
}
