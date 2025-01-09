import { Monad } from "@/monad.ts";
import { match } from "ts-pattern";
import { Fn } from "./function";

export const URI = "Maybe";
export type URI = typeof URI;

export type Maybe<T = never> = { kind: "Just"; value: T } | { kind: "Nothing" };

declare module "./URIS" {
  interface URItoKind<A> {
    Maybe: Maybe<A>;
  }
}

const Nothing: Maybe<unknown> = { kind: "Nothing" };

export const just = <T>(value: T): Maybe<T> => ({ kind: "Just", value });
export const nothing = <T>(): Maybe<T> => Nothing;

export const fromNullable = <T>(value: T | null | undefined): Maybe<T> =>
  value === null || value === undefined ? Nothing : just(value);

export const of = <T>(value: T | null | undefined): Maybe<T> =>
  match(value)
    .with(null, () => nothing<T>())
    .otherwise((value) => just<T>(value));

export const isNothing = <T>(value: Maybe<T>): value is { kind: "Nothing" } =>
  match(value)
    .with(Nothing, () => true)
    .otherwise(() => false);

export const isJust = <T>(value: Maybe<T>): value is { kind: "Just"; value: T } =>
  !isNothing(value);

export const identity = <T>(value: Maybe<T>): Maybe<T> => value;

export const iif =
  <T>(condition: Fn<T, boolean>) =>
  (value: Maybe<T>): Maybe<T> => {
    if (isNothing(value)) return value;
    return condition(value.value) ? value : Nothing;
  };

export const map =
  <T, U>(fn: (value: T) => U) =>
  (mo: Maybe<T>): Maybe<U> =>
    isNothing(mo) ? Nothing : just(fn(mo.value));

export const chain =
  <T, U>(fn: (value: T) => Maybe<U>) =>
  (mo: Maybe<T>): Maybe<U> =>
    isNothing(mo) ? Nothing : fn(mo.value);

export const join = <T>(mo: Maybe<Maybe<T>>): Maybe<T> => (isNothing(mo) ? Nothing : mo.value);

export const chainNothing =
  <T, U>(fn: () => Maybe<U>) =>
  (mo: Maybe<T>): Maybe<U> =>
    isNothing(mo) ? fn() : Nothing;

export const tap =
  <T>(fn: (value: T) => void) =>
  (mo: Maybe<T>): Maybe<T> => {
    if (isJust(mo)) fn(mo.value);
    return mo;
  };

export const tapNothing =
  (fn: () => void) =>
  <T>(value: Maybe<T>): Maybe<T> => {
    if (isNothing(value)) fn();
    return value;
  };

export const fold =
  <T, U>(onNothing: () => U, onJust: (value: T) => U) =>
  (mo: Maybe<T>): U =>
    isNothing(mo) ? onNothing() : onJust(mo.value);

export const getOrElse =
  <T>(defaultValue: T) =>
  (mo: Maybe<T>): T =>
    isNothing(mo) ? defaultValue : mo.value;

interface MF extends Monad<URI> {}

export const M: MF = { URI, map, chain, of, join };
