import { Chain } from "./chain.ts";
import { Functor } from "./functor.ts";
import { Pointed } from "./pointed.ts";
import { Kind, URIS } from "./URIS.ts";

export interface Monad<F extends URIS> extends Functor<F>, Pointed<F>, Chain<F> {
  readonly URI: F;
  join: <A>(as: Kind<F, Kind<F, A>>) => Kind<F, A>;
}
