import { BiFunctor } from "./bi-functor.ts";

export type Left<L> = { tag: "Left"; value: L };
export type Right<R> = { tag: "Right"; value: R };
export type Either<L = unknown, R = unknown> = Left<L> | Right<R>;

export const of = <L, R>(value: R): Either<L, R> => right(value);

export const left = <L, R>(value: L): Either<L, R> => ({ tag: "Left", value });
export const right = <L, R>(value: R): Either<L, R> => ({ tag: "Right", value });

export const identity = <L, R>(value: Either<L, R>): Either<L, R> => value;

export const bimap =
  <L, R, U, V>(fn: (value: L) => U, gn: (value: R) => V) =>
  (either: Either<L, R>): Either<U, V> =>
    either.tag === "Left" ? left(fn(either.value)) : right(gn(either.value));

export const rmap =
  <R, U>(fn: (value: R) => U) =>
  <L>(either: Either<L, R>): Either<L, U> =>
    either.tag === "Right" ? right(fn(either.value)) : (either as Left<L>);

export const lmap =
  <L, U>(fn: (value: L) => U) =>
  <R>(either: Either<L, R>): Either<U, R> =>
    either.tag === "Left" ? left(fn(either.value)) : (either as Right<R>);

export const bind =
  <L, R, U>(fn: (value: R) => Either<L, U>) =>
  (either: Either<L, R>): Either<L, U> =>
    either.tag === "Right" ? fn(either.value) : (either as Left<L>);

export const bindLeft =
  <L, R, U>(fn: (value: L) => Either<U, R>) =>
  (either: Either<L, R>): Either<U, R> =>
    either.tag === "Left" ? fn(either.value) : (either as Right<R>);

export const tap =
  <R>(fn: (value: R) => void) =>
  <L>(either: Either<L, R>): Either<L, R> => {
    if (either.tag === "Right") fn(either.value);
    return either;
  };

export const tapLeft =
  <L>(fn: (value: L) => void) =>
  <R>(either: Either<L, R>): Either<L, R> => {
    if (either.tag === "Left") fn(either.value);
    return either;
  };

export const getOrElse =
  <R>(defaultValue: R) =>
  <L>(either: Either<L, R>): R =>
    either.tag === "Right" ? either.value : defaultValue;

export const getLeftOrElse =
  <L>(defaultValue: L) =>
  <R>(either: Either<L, R>): L =>
    either.tag === "Left" ? either.value : defaultValue;

export const fold =
  <L, R, T>(onLeft: (value: L) => T, onRight: (value: R) => T) =>
  (either: Either<L, R>): T =>
    either.tag === "Left" ? onLeft(either.value) : onRight(either.value);

export type Monad = "Either";

interface EF extends BiFunctor<Monad> {}

export const E: EF = { bimap };
