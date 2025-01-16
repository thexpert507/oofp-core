import { pipe } from "@/pipe";
import * as L from "@/list";
import { URIS2, Kind2 } from "@/URIS2";
import { Monad2 } from "@/monad-2";
import { Applicative2 } from "@/applicative-2";

// Definimos el tipo de la instancia de la mónada, que tiene tanto `Monad` como `Applicative`.
type Instance<F extends URIS2> = Monad2<F> & Applicative2<F>;

// Tipo para los valores que contiene cada mónada, como un array de `Kind<F, A>`
type ValueOfKind<F extends URIS2, Args extends Kind2<F, any, any>[]> = {
  [K in keyof Args]: Args[K] extends Kind2<F, unknown, infer A> ? A : never;
};

type ArgsType<F extends URIS2, E> = [Kind2<F, E, any>, ...Kind2<F, E, any>[]];

// `sequenceT` que toma una instancia de la mónada y un array de mónadas, y devuelve una mónada con el tipo de los resultados combinados
export const sequenceT2 =
  <F extends URIS2>(mo: Instance<F>) =>
  <E, Args extends ArgsType<F, E>>(...args: Args): Kind2<F, E, ValueOfKind<F, Args>> => {
    const initial = mo.of<E, ValueOfKind<F, Args>>([] as any);

    const merge = (result: any) => (values: ValueOfKind<F, Args>) => [...values, result];

    return pipe(
      args,
      L.reduce(initial, (acc, curr) => {
        return pipe(acc, mo.apply(pipe(curr, mo.map(merge)))) as Kind2<F, E, ValueOfKind<F, Args>>;
      })
    );
  };
