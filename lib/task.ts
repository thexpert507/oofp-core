import { Fn } from "./function";
import { URIS } from "./URIS";
import * as P from "./promise";
import { Monad } from "./monad";

export const URI = "Task";
export type URI = typeof URI;

export type Task<T> = () => Promise<T>;

declare module "@/URIS" {
  interface URItoKind<A> {
    Task: Task<A>;
  }
}

export const taskify =
  <Args extends any[], R>(fn: (...args: Args) => Promise<R>) =>
  (...args: Args): Task<R> =>
  () =>
    fn(...args);

export const run = <A>(task: Task<A>): Promise<A> => task();

export const of =
  <A>(a: A): Task<A> =>
  () =>
    P.of(a);

export const tap =
  <A>(f: Fn<A, void>) =>
  (ta: Task<A>): Task<A> =>
  () =>
    P.tap(f)(ta());

export const map =
  <A, B>(f: Fn<A, B>) =>
  (ta: Task<A>): Task<B> =>
  () =>
    P.map(f)(ta());

export const join =
  <A>(tta: Task<Task<A>>): Task<A> =>
  () =>
    tta().then((ta) => ta());

export const chain =
  <A, B>(f: Fn<A, Task<B>>) =>
  (ta: Task<A>): Task<B> =>
  () =>
    ta().then((a) => run(f(a)));

interface MTask<F extends URIS> extends Monad<F> {}

export const T: MTask<URI> = { URI, of, map, join, chain };
