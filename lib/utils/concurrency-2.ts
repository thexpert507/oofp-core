import * as L from "@/list";
import { pipe } from "@/pipe";
import { id } from "@/id";
import { Kind2, URIS2 } from "@/URIS2";
import { Monad2 } from "@/monad";
import { Applicative2 } from "@/applicative";
import { Delayable2 } from "@/delayable";

// Tipo de la instancia de la mónada
type Instance<F extends URIS2> = Monad2<F> & Applicative2<F> & Delayable2<F>;

// Tipo para los valores que contiene cada mónada, como un array de `Kind2<F,E,A>`
type VOK<F extends URIS2, Args extends Kind2<F, any, any>[]> = {
  [K in keyof Args]: Args[K] extends Kind2<F, unknown, infer A> ? A : never;
};

type ArgsType<F extends URIS2, E> = [Kind2<F, E, any>, ...Kind2<F, E, any>[]];

type Config = { concurrency: number; delay?: number };

const reduceFn =
  <F extends URIS2>(mo: Instance<F>) =>
  <E, Args extends Kind2<F, E, any>[] | ArgsType<F, E>>(
    acc: Kind2<F, E, VOK<F, Args>>,
    curr: Kind2<F, E, any>
  ) => {
    const merge = (result: any) => (values: VOK<F, Args>) => [...values, result];
    return pipe(acc, mo.apply(pipe(curr, mo.map(merge)))) as Kind2<F, E, VOK<F, Args>>;
  };

export const concurrency2 =
  <F extends URIS2>(mo: Instance<F>) =>
  (config: Config) =>
  <E, Args extends Kind2<F, E, any>[] | ArgsType<F, E>>(
    args: Args,
    acc = mo.of<E, VOK<F, Args>>([] as any)
  ): Kind2<F, E, VOK<F, Args>> => {
    if (L.isEmpty(args)) return acc;
    const portion = args.slice(0, config.concurrency) as Args;
    const rest = args.slice(config.concurrency) as Args;

    const newAcc = pipe(
      acc,
      config.delay ? mo.delay(config.delay) : id,
      mo.chain((values) => pipe(portion, L.reduce(mo.of(values), reduceFn(mo))))
    );

    return concurrency2(mo)(config)(rest, newAcc);
  };
