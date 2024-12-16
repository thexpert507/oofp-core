import { BiFunctor } from "./bi-functor.ts";
import { Chain2 } from "./chain-2.ts";
import { Pointed2 } from "./pointed-2.ts";
import { ProFunctor } from "./profunctor.ts";
import { Kind2, URIS2 } from "./URIS2.ts";

interface Joinable<F extends URIS2> {
  readonly join: <E, A>(mma: Kind2<F, E, Kind2<F, E, A>>) => Kind2<F, E, A>;
}

export interface Monad2<F extends URIS2> extends BiFunctor<F>, Pointed2<F>, Chain2<F>, Joinable<F> {
  readonly URI: F;
}

export interface ProMonad2<F extends URIS2> extends ProFunctor<F>, Pointed2<F>, Chain2<F> {
  readonly URI: F;
}