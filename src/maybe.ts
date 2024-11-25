export type Maybe<T = unknown> = T | null | undefined;

export const of = <T>(value: T): Maybe<T> => value;

export const just = <T>(value: T): Maybe<T> => value;
export const nothing = <T>(): Maybe<T> => null;

export const isNothing = <T>(value: Maybe<T>): value is null | undefined =>
  value === null || value === undefined;

export const isJust = <T>(value: Maybe<T>): value is T => value !== null && value !== undefined;

export const identity = <T>(value: Maybe<T>): Maybe<T> => value;

export const map =
  <T, U>(fn: (value: T) => U) =>
  (value: Maybe<T>): Maybe<U> =>
    isNothing(value) ? null : fn(value);

export const bind =
  <T, U>(fn: (value: T) => Maybe<U>) =>
  (value: Maybe<T>): Maybe<U> =>
    isNothing(value) ? null : fn(value);

export const bindNothing =
  <T, U>(fn: () => Maybe<U>) =>
  (value: Maybe<T>): Maybe<U> =>
    isNothing(value) ? fn() : null;

export const tap =
  <T>(fn: (value: T) => void) =>
  (value: Maybe<T>): Maybe<T> => {
    if (isJust(value)) fn(value);
    return value;
  };

export const tapNothing =
  (fn: () => void) =>
  <T>(value: Maybe<T>): Maybe<T> => {
    if (isNothing(value)) fn();
    return value;
  };

export const fold =
  <T, U>(onNothing: () => U, onJust: (value: T) => U) =>
  (value: Maybe<T>): U =>
    isNothing(value) ? onNothing() : onJust(value);

export const getOrElse =
  <T>(defaultValue: T) =>
  (value: Maybe<T>): T =>
    isNothing(value) ? defaultValue : value;
