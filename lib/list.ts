import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";
import * as U from "./utils";

export const map =
  <A, B>(fn: Fn<A, B>) =>
  (list: A[]): B[] =>
    list.map(fn);

export const mapIndexed =
  <A, B>(fn: Fn<number, Fn<A, B>>) =>
  (list: A[]): B[] =>
    list.map((item, index) => fn(index)(item));

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

export const groupBy =
  <A>(fn: Fn<A, string>) =>
  (list: A[]): Record<string, A[]> =>
    U.groupBy(fn)(list);

export const indexBy =
  <A>(fn: Fn<A, string>) =>
  (list: A[]): Record<string, A> =>
    U.indexBy(fn)(list);

export const sort =
  <A>(fn: Fn<{ a: A; b: A }, number>) =>
  (list: A[]): A[] =>
    list.sort((a, b) => fn({ a, b }));

export const concat =
  <A>(list1: A[]) =>
  (list2: A[]): A[] =>
    list1.concat(list2);

export const append =
  <A>(item: A) =>
  (list: A[]): A[] =>
    list.concat(item);

export const prepend =
  <A>(item: A) =>
  (list: A[]): A[] =>
    [item].concat(list);

export const L = { map } satisfies Functor<"Array">;
