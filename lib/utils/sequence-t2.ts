import { pipe } from "@/pipe";
import * as L from "@/list";
import { URIS2, Kind2 } from "@/URIS2";
import { Monad2 } from "@/monad";
import { Applicative2 } from "@/applicative";

// Definimos el tipo de la instancia de la mónada, que tiene tanto `Monad` como `Applicative`.
type Instance<F extends URIS2> = Monad2<F> & Applicative2<F>;

type ArgsType<F extends URIS2, E> = [Kind2<F, E, any>, ...Kind2<F, E, any>[]] | Kind2<F, E, any>[];

// Tipo para los valores que contiene cada mónada, como un array de `Kind<F, A>`
type VOK<F extends URIS2, Args> = {
  [K in keyof Args]: Args[K] extends Kind2<F, unknown, infer A> ? A : never;
};

type InferE<F extends URIS2, Args> = Args extends ArgsType<F, infer E> ? E : never;

type Result<F extends URIS2, Args> = Kind2<F, InferE<F, Args>, VOK<F, Args>>;

export const sequenceT2 =
  <F extends URIS2>(mo: Instance<F>) =>
  <Args extends ArgsType<F, any>>(args: Args): Result<F, Args> => {
    const initial = mo.of<any, VOK<F, Args>>([] as any);

    const merge = (result: any) => (values: VOK<F, Args>) => [...values, result];

    return pipe(
      args,
      L.reduce(initial, (acc, curr) => {
        return pipe(acc, mo.apply(pipe(curr, mo.map(merge)))) as Kind2<F, any, VOK<F, Args>>;
      })
    );
  };
