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

export const reduce =
  <A, B>(initial: B, fn: (acc: B, curr: A) => B) =>
  (list: A[]): B =>
    list.reduce(fn, initial);

export const reduceRight =
  <A, B>(initial: B, fn: (acc: B, curr: A) => B) =>
  (list: A[]): B =>
    list.reduceRight(fn, initial);

export const isEmpty = <A>(list: A[]): boolean => list.length === 0;

export const flatten = <A>(list: A[][]): A[] => list.flat();

export const chunk =
  (size: number) =>
  <A>(list: A[]): A[][] => {
    const result: A[][] = [];
    for (let i = 0; i < list.length; i += size) {
      result.push(list.slice(i, i + size));
    }
    return result;
  };

export const L = { map } satisfies Functor<"Array">;
