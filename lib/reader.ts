import { Fn } from "./function";
import { ProMonad2 } from "./monad-2";
import { pipe } from "./pipe";

export const URI = "Reader";
export type URI = typeof URI;

export type Reader<R, A> = (r: R) => A;

declare module "@/URIS2" {
  interface URItoKind2<E, A> {
    Reader: Reader<E, A>;
  }
}

export const of =
  <R, A>(value: A): Reader<R, A> =>
  () =>
    value;

export const ask =
  <R>(): Reader<R, R> =>
  (r: R) =>
    r;

export const rmap =
  <A, B>(fn: Fn<A, B>) =>
  <R>(as: Reader<R, A>): Reader<R, B> =>
  (r: R) =>
    pipe(as(r), fn);

export const lmap =
  <R, R2>(fn: Fn<R2, R>) =>
  <A>(ra: Reader<R, A>): Reader<R2, A> =>
  (r: R2) =>
    ra(fn(r));

export const dimap =
  <R, A, R2, A2>(fn: Fn<R2, R>, gn: Fn<A, A2>) =>
  (ra: Reader<R, A>): Reader<R2, A2> =>
  (r: R2) =>
    pipe(ra(fn(r)), gn);

export const call =
  <R>(r: R) =>
  <A>(ra: Reader<R, A>): A =>
    ra(r);

export const chain =
  <R, A, B>(fn: Fn<A, Reader<R, B>>) =>
  (ra: Reader<R, A>): Reader<R, B> =>
  (r: R) =>
    pipe(ra(r), fn, call(r));

export const chainw =
  <R2, A, B>(fn: Fn<A, Reader<R2, B>>) =>
  <R>(ra: Reader<R, A>): Reader<R & R2, B> =>
  (r: R & R2) =>
    pipe(ra(r), fn, call(r));

export const provide =
  <R extends Record<any, any>, R2 extends Partial<R>>(r2: R2) =>
  <A>(ra: Reader<R, A>): Reader<Omit<R, keyof R2>, A> =>
  (r: Omit<R, keyof R2>) =>
    ra({ ...r2, ...r } as unknown as R);

export const run =
  <R>(r: R) =>
  <A>(ra: Reader<R, A>): A =>
    ra(r);

interface RF extends ProMonad2<URI> {}

export const R: RF = { URI, of, rmap, lmap, dimap, chain };
