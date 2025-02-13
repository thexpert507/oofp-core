import { Applicative } from "@/applicative";
import { Monad } from "@/monad";
import { Kind, URIS } from "@/URIS";
import * as L from "@/list";
import { pipe } from "@/pipe";
import { Delayable } from "@/delayable";
import { id } from "@/id";

// Tipo de la instancia de la mónada
type Instance<F extends URIS> = Monad<F> & Applicative<F> & Delayable<F>;

// Tipo para los valores que contiene cada mónada, como un array de `Kind<F, A>`
type VOK<F extends URIS, Args extends Kind<F, any>[]> = {
  [K in keyof Args]: Args[K] extends Kind<F, infer A> ? A : never;
};

type ArgsType<F extends URIS> = [Kind<F, any>, ...Kind<F, any>[]];

type Config = { concurrency: number; delay?: number };

const reduceFn =
  <F extends URIS>(mo: Instance<F>) =>
  <Args extends ArgsType<F> | Kind<F, any>[]>(acc: Kind<F, VOK<F, Args>>, curr: Kind<F, any>) => {
    const merge = (result: any) => (values: VOK<F, Args>) => [...values, result];
    return pipe(acc, mo.apply(pipe(curr, mo.map(merge)))) as Kind<F, VOK<F, Args>>;
  };

export const concurrencyT =
  <F extends URIS>(mo: Instance<F>) =>
  (config: Config) =>
  <Args extends ArgsType<F> | Kind<F, any>[]>(
    args: Args,
    acc = mo.of([] as VOK<F, Args>)
  ): Kind<F, VOK<F, Args>> => {
    if (L.isEmpty(args)) return acc;
    const portion = args.slice(0, config.concurrency) as Args;
    const rest = args.slice(config.concurrency) as Args;

    const newAcc = pipe(
      acc,
      config.delay ? mo.delay(config.delay) : id,
      mo.chain((values) => pipe(portion, L.reduce(mo.of(values), reduceFn(mo))))
    );

    return concurrencyT(mo)(config)(rest, newAcc);
  };
