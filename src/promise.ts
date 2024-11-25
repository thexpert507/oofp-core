import { Functor } from "./functor.ts";

export const map =
  <A, B>(f: (a: A) => B) =>
  (value: Promise<A>): Promise<B> =>
    value.then(f);

export const isPromise = <A>(value: unknown): value is Promise<A> => value instanceof Promise;

export function promise<A>(value: Promise<A>): Functor<A> {
  return {
    map: <B>(f: (a: A) => B) => promise(map(f)(value)),
  };
}

export type PromiseFunctor<A> = ReturnType<typeof promise<A>>;
