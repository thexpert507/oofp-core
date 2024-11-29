import type { Maybe } from "./maybe.ts";
import * as M from "./maybe.ts";
import { Fn } from "./function.ts";
import { Monad2 } from "./monad-2.ts";

export const URI = "Either";
export type URI = typeof URI;

export type Left<E> = { tag: "Left"; value: E };
export type Right<A> = { tag: "Right"; value: A };
export type Either<E = never, A = never> = Left<E> | Right<A>;

export const left = <E, A>(value: E): Either<E, A> => ({ tag: "Left", value });
export const right = <E, A>(value: A): Either<E, A> => ({ tag: "Right", value });
export const of = right;

export const identity = <E, A>(value: Either<E, A>): Either<E, A> => value;

export const map =
  <A, B>(fn: Fn<A, B>) =>
  <E>(either: Either<E, A>): Either<E, B> =>
    either.tag === "Right" ? right(fn(either.value)) : (either as Either);

export const mapLeft =
  <E, E2>(fn: Fn<E, E2>) =>
  <A>(either: Either<E, A>): Either<E2, A> =>
    either.tag === "Left" ? left(fn(either.value)) : (either as Right<A>);

export const bimap =
  <E, A, E2, B>(fn: Fn<E, E2>, gn: Fn<A, B>) =>
  (either: Either<E, A>): Either<E2, B> =>
    either.tag === "Left" ? left(fn(either.value)) : right(gn(either.value));

export const rmap = map;

export const lmap =
  <E, E2>(fn: Fn<E, E2>) =>
  <A>(either: Either<E, A>): Either<E2, A> =>
    either.tag === "Left" ? left(fn(either.value)) : (either as Right<A>);

export const chain =
  <E, A, U>(fn: (value: A) => Either<E, U>) =>
  (either: Either<E, A>): Either<E, U> =>
    either.tag === "Right" ? fn(either.value) : (either as Left<E>);

export const orchain =
  <E, A, L2, R2>(fn: Fn<A, Either<L2, R2>>) =>
  (ma: Either<E, A>): Either<E | L2, R2> =>
    ma.tag === "Right" ? fn(ma.value) : (ma as Left<E | L2>);

export const join = <E, A>(mma: Either<E, Either<E, A>>): Either<E, A> =>
  mma.tag === "Left" ? mma : mma.value;

export const bindLeft =
  <E, A, U>(fn: (value: E) => Either<U, A>) =>
  (either: Either<E, A>): Either<U, A> =>
    either.tag === "Left" ? fn(either.value) : (either as Right<A>);

export const tap =
  <A>(fn: (value: A) => void) =>
  <E>(either: Either<E, A>): Either<E, A> => {
    if (either.tag === "Right") fn(either.value);
    return either;
  };

export const tapLeft =
  <E>(fn: (value: E) => void) =>
  <A>(either: Either<E, A>): Either<E, A> => {
    if (either.tag === "Left") fn(either.value);
    return either;
  };

export const getOrElse =
  <E, A>(f: Fn<E, A>) =>
  (either: Either<E, A>): A =>
    either.tag === "Right" ? either.value : f(either.value);

export const getLeftOrElse =
  <E>(defaultValue: E) =>
  <A>(either: Either<E, A>): E =>
    either.tag === "Left" ? either.value : defaultValue;

export const fold =
  <E, A, T>(onLeft: (value: E) => T, onRight: (value: A) => T) =>
  (either: Either<E, A>): T =>
    either.tag === "Left" ? onLeft(either.value) : onRight(either.value);

export const toUnion = <E, A>(either: Either<E, A>): E | A =>
  either.tag === "Left" ? either.value : either.value;

export const toNullable = <E, A>(either: Either<E, A>): A | null =>
  either.tag === "Right" ? either.value : null;

export const toMaybe = <E, A>(either: Either<E, A>): Maybe<A> =>
  either.tag === "Right" ? M.just(either.value) : M.nothing();

interface EF extends Monad2<URI> {}

export const E: EF = { URI, bimap, chain, left, right, join, of, map };
