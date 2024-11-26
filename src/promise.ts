import { Functor } from "./functor.ts";

export const map =
  <A, B>(f: (a: A) => B) =>
  (value: Promise<A>): Promise<B> =>
    value.then(f);

export const isPromise = <A>(value: unknown): value is Promise<A> => value instanceof Promise;

export type Monad = "Promise";

interface PF extends Functor<Monad> {}

export const P: PF = { map };
