import { Applicative } from "@/applicative";
import { Monad } from "@/monad";
import { pipe } from "@/pipe";
import { Kind, URIS } from "@/URIS";
import * as L from "@/list";

// Definimos el tipo Instance para Monad y Applicative
type Instance<F extends URIS> = Monad<F> & Applicative<F>;

// Implementamos `sequenceT` para objetos
export const sequenceObjectT =
  <F extends URIS>(mo: Instance<F>) =>
  <Args extends { [K in keyof Args]: Kind<F, any> }>(
    args: Args
  ): Kind<F, { [K in keyof Args]: Args[K] extends Kind<F, infer A> ? A : never }> => {
    return pipe(
      args,
      Object.entries,
      L.reduce(mo.of({} as { [K in keyof Args]: any }), (acc, [key, curr]) => {
        const merge = (result: unknown) => (values: any) => ({ ...values, [key]: result });
        return pipe(acc, mo.apply(pipe(curr, mo.map(merge))));
      })
    );
  };
