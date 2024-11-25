import { Functor } from "./functor.ts";

export const map =
  <A, B>(fn: (value: A) => B) =>
  (list: A[]): B[] =>
    list.map(fn);

export function list<A>(value: A[]): Functor<A> {
  return {
    map: <B>(f: (a: A) => B) => list(map(f)(value)),
  };
}

export type ListFunctor<A> = ReturnType<typeof list<A>>;
