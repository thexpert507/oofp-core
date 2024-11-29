import { Monad } from "./monad.ts";

export const URI = "Promise";
export type URI = typeof URI;

export const of = <A>(value: A): Promise<A> => Promise.resolve(value);

export const join = <A>(value: Promise<Promise<A>>): Promise<A> => value.then((value) => value);

export const map =
  <A, B>(f: (a: A) => B) =>
  (value: Promise<A>): Promise<B> =>
    value.then(f);

export const chain =
  <A, B>(f: (a: A) => Promise<B>) =>
  (value: Promise<A>): Promise<B> =>
    value.then(f);

export const isPromise = <A>(value: unknown): value is Promise<A> => value instanceof Promise;

interface PF extends Monad<URI> {}

export const P: PF = { URI, map, join, of, chain };
