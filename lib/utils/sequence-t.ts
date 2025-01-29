import { Applicative } from "@/applicative";
import { Monad } from "@/monad";
import { pipe } from "@/pipe";
import { Kind, URIS } from "@/URIS";
import * as L from "@/list";

// Definimos el tipo de la instancia de la mónada, que tiene tanto `Monad` como `Applicative`.
type Instance<F extends URIS> = Monad<F> & Applicative<F>;

// Tipo para los valores que contiene cada mónada, como un array de `Kind<F, A>`
type ValueOfKind<F extends URIS, Args extends Kind<F, any>[]> = {
  [K in keyof Args]: Args[K] extends Kind<F, infer A> ? A : never;
};

type ArgsType<F extends URIS> = [Kind<F, any>, ...Kind<F, any>[]] | Kind<F, any>[];

// `sequenceT` que toma una instancia de la mónada y un array de mónadas, y devuelve una mónada con el tipo de los resultados combinados
export const sequenceT =
  <F extends URIS>(mo: Instance<F>) =>
  <Args extends ArgsType<F>>(args: Args): Kind<F, ValueOfKind<F, Args>> => {
    const initial = mo.of([] as ValueOfKind<F, Args>);

    const merge = (result: any) => (values: ValueOfKind<F, Args>) => [...values, result];

    return pipe(
      args,
      L.reduce(initial, (acc, curr) => {
        return pipe(acc, mo.apply(pipe(curr, mo.map(merge)))) as Kind<F, ValueOfKind<F, Args>>;
      })
    );
  };
