import { Fn } from "@/function";

export const tap =
  <A>(fn: Fn<A, void>) =>
  (a: A): A => {
    fn(a);
    return a;
  };

export const map =
  <A, B>(fn: Fn<A, B>) =>
  (a: A): B =>
    fn(a);
