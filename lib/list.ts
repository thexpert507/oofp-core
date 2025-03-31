import { Fn } from "./function.ts";
import { Functor } from "./functor.ts";
import * as U from "./utils";

export const map =
  <A, B>(fn: Fn<A, B>) =>
  (list: A[]): B[] =>
    list.map(fn);

export const tap =
  <A>(fn: Fn<A, void>) =>
  (list: A[]): A[] => {
    list.forEach(fn);
    return list;
  };

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

export const unique =
  <A, B = A>(fn?: Fn<A, B>) =>
  (list: A[]): A[] => {
    if (!fn) return [...new Set(list)];

    const seen = new Set<B>();
    return list.filter((item) => {
      const key = fn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

export const chunk =
  (size: number) =>
  <A>(list: A[]): A[][] => {
    /**
     * Se utiliza un enfoque iterativo con un bucle for en lugar de recursividad
     * para evitar problemas de desbordamiento de pila con listas grandes.
     * Esta implementación es más eficiente en términos de memoria y rendimiento,
     * ya que evita múltiples creaciones de arrays y llamadas a funciones
     * que ocurrirían con un enfoque recursivo.
     */
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

export const find =
  <A>(fn: Fn<A, boolean>) =>
  (list: A[]): A | undefined =>
    list.find(fn);

export const join =
  (separator: string) =>
  <A>(list: A[]): string =>
    list.join(separator);

export const update =
  (index: number) =>
  <A>(item: A) =>
  (list: A[]): A[] => {
    if (index < 0 || index >= list.length) return list;
    const result = [...list];
    result[index] = item;
    return result;
  };

export const L = { map } satisfies Functor<"Array">;
