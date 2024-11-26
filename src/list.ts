import { Functor } from "./functor.ts";

export const map =
  <A, B>(fn: (value: A) => B) =>
  (list: A[]): B[] =>
    list.map(fn);

export const L = { map } satisfies Functor<"Array">;
