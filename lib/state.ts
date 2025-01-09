import { Applicative2 } from "./applicative-2";
import { Fn } from "./function";
import { Functor2 } from "./functor-2";
import { Monad2 } from "./monad-2";
import { pipe } from "./pipe";
import { Pointed2 } from "./pointed-2";

export const URI = "State";
export type URI = typeof URI;

declare module "@/URIS2" {
  interface URItoKind2<E, A> {
    State: State<E, A>;
  }
}

export type State<S, A> = (s: S) => [A, S];

export const of =
  <S, A>(value: A): State<S, A> =>
  (s: S) =>
    [value, s];

export const map =
  <A, B>(fn: Fn<A, B>) =>
  <S>(as: State<S, A>): State<S, B> =>
  (s: S) =>
    pipe(as(s), ([a, s]) => [fn(a), s]);

export const join =
  <S, A>(ssa: State<S, State<S, A>>): State<S, A> =>
  (s: S) =>
    pipe(ssa(s), ([sa, s]) => sa(s));

export const chain =
  <S, A, B>(fn: Fn<A, State<S, B>>) =>
  (as: State<S, A>): State<S, B> =>
  (s: S) =>
    pipe(as(s), ([a, s]) => fn(a)(s));

export const apply =
  <S, A, B>(fs: State<S, Fn<A, B>>) =>
  (as: State<S, A>): State<S, B> =>
    pipe(
      fs,
      chain((f) => pipe(as, map(f)))
    );

export const run =
  <S>(s: S) =>
  <A>(as: State<S, A>) =>
    as(s);

export const runS =
  <S>(s: S) =>
  <A>(as: State<S, A>): S =>
    as(s)[1];

export const runEval =
  <S>(s: S) =>
  <A>(as: State<S, A>): A =>
    as(s)[0];

interface SF extends Monad2<URI>, Applicative2<URI>, Pointed2<URI>, Functor2<URI> {}

export const S: SF = { URI, of, map, chain, join, apply };
