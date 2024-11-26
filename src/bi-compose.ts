import { BiFunctor } from "./bi-functor.ts";
import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";
import { Kind, URIS } from "./URIS.ts";
import { Kind2, URIS2 } from "./URIS2.ts";

// export interface BiCompose<A, B> {
//   bimap<C, D>(f1: Fn<A, C>, f2: Fn<B, D>): BiCompose<C, D>;
// }

export type Bicompose<F extends URIS2, FA extends URIS, FB extends URIS> = {
  bimap: <A, B, C, D>(
    f: Fn<A, C>,
    g: Fn<B, D>
  ) => (as: Kind2<F, Kind<FA, A>, Kind<FB, B>>) => Kind2<F, Kind<FA, C>, Kind<FB, D>>;
};

export const bicompose = <F extends URIS2, FA extends URIS, FB extends URIS>(
  bifunctor: BiFunctor<F>,
  fa: Functor<FA>,
  fb: Functor<FB>
): Bicompose<F, FA, FB> => ({
  bimap:
    <A, B, C, D>(f: Fn<A, C>, g: Fn<B, D>) =>
    (as: Kind2<F, Kind<FA, A>, Kind<FB, B>>) =>
      bifunctor.bimap(fa.map(f), fb.map(g))(as),
});

// export const biCompose = <A, B>(bifunctor: Bifunctor<Functor<A>, Functor<B>>): BiCompose<A, B> => ({
//   bimap: <C, D>(f1: Fn<A, C>, f2: Fn<B, D>) =>
//     biCompose(
//       bifunctor.bimap(
//         (fa) => fa.map(f1),
//         (fb) => fb.map(f2)
//       )
//     ),
// });
