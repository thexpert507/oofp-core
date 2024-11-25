import { Bifunctor } from "./bi-functor.ts";
import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";

export interface BiCompose<A, B> {
  bimap<C, D>(f1: Fn<A, C>, f2: Fn<B, D>): BiCompose<C, D>;
}

export const biCompose = <A, B>(bifunctor: Bifunctor<Functor<A>, Functor<B>>): BiCompose<A, B> => ({
  bimap: <C, D>(f1: Fn<A, C>, f2: Fn<B, D>) =>
    biCompose(
      bifunctor.bimap(
        (fa) => fa.map(f1),
        (fb) => fb.map(f2)
      )
    ),
});
