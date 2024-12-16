import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";

export const map =
  <A, B>(fn: Fn<A, B>) =>
  (list: A[]): B[] =>
    list.map(fn);

export const filter =
  <A>(fn: Fn<A, boolean>) =>
  (list: A[]): A[] =>
    list.filter(fn);

export const L = { map } satisfies Functor<"Array">;
