import { pipe } from "@/pipe";
import { Kind2, URIS2 } from "@/URIS2";
import * as L from "@/list";
import { Monad2 } from "@/monad-2";
import { Applicative2 } from "@/applicative-2";

// Definimos el tipo Instance para Monad y Applicative
type Instance<F extends URIS2> = Monad2<F> & Applicative2<F>;

type InferE<F extends URIS2, Args> = Args extends {
  [K in keyof Args]: Kind2<F, infer E, any>;
}
  ? E
  : never;

type InferA<F extends URIS2, Args> = {
  [K in keyof Args]: Args[K] extends Kind2<F, any, infer A> ? A : never;
};

// Implementamos `sequenceT` para objetos
export const sequenceObjectT2 =
  <F extends URIS2>(mo: Instance<F>) =>
  <Args extends { [K in keyof Args]: Kind2<F, any, any> }>(
    args: Args
  ): Kind2<F, InferE<F, Args>, InferA<F, Args>> => {
    const initial = mo.of<InferE<F, Args>, InferA<F, Args>>({} as InferA<F, Args>);
    return pipe(
      args,
      Object.entries,
      L.reduce(initial, (acc, [key, curr]: [string, Kind2<F, any, any>]) => {
        const merge = (result: unknown) => (values: any) => ({
          ...values,
          [key]: result,
        });
        return pipe(acc, mo.apply(pipe(curr, mo.map(merge))));
      })
    );
  };
