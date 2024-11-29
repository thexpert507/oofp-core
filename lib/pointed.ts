import { Kind, URIS } from "./URIS.ts";

export interface Pointed<F extends URIS> {
  of: <A>(a: A) => Kind<F, A>;
}
