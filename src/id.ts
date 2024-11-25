import { Functor } from "./functor.ts";

export type Identity<A> = (a: A) => A;

export const id = <A>(x: A): A => x;

export function identity<A>(value: A): Functor<A> {
  return {
    map: <B>(f: (a: A) => B) => identity(f(value)),
  };
}
