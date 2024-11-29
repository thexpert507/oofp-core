import type { Either } from "./either";
import type { Task } from "./task";
import * as T from "./task";
import * as E from "./either";
import { URIS2 } from "./URIS2";
import { Monad2 } from "./monad-2";
import { compose } from "./compose";
import { Fn } from "./function";
import { P } from "./promise";

export const URI = "TaskEither";
export type URI = typeof URI;

export type TaskEither<E, T> = Task<Either<E, T>>;

export const taskify =
  <Args extends any[], E, R>(fn: (...args: Args) => Promise<Either<E, R>>) =>
  (...args: Args): TaskEither<E, R> =>
  () =>
    fn(...args);

export const tryCatch =
  <E>(onError: Fn<unknown, E>) =>
  <A>(task: Task<A>): TaskEither<E, A> =>
  () => {
    return T.run(task)
      .then(E.right)
      .catch((error) => E.left(onError(error))) as Promise<Either<E, A>>;
  };

export const identity = <E, A>(tea: TaskEither<E, A>): TaskEither<E, A> => tea;

export const run = <E, A>(task: TaskEither<E, A>): Promise<Either<E, A>> => task();

export const of = <E, A>(a: A): TaskEither<E, A> => T.of(E.right(a));

export const left = <E, A>(e: E): TaskEither<E, A> => T.of(E.left(e));

export const right = of;

export const rightTask = <E, A>(ta: Task<A>): TaskEither<E, A> => T.map(E.right)(ta);

export const leftTask = <E, A>(ta: Task<E>): TaskEither<E, A> => T.map(E.left)(ta);

export const tap = <A>(f: Fn<A, void>) => compose(T.map(E.tap(f)));

export const map = <A, B>(f: Fn<A, B>) => compose(T.map(E.map(f)));

export const mapLeft = <E, E2>(f: Fn<E, E2>) => compose(T.map(E.mapLeft(f)));

export const bimap = <E, A, E2, B>(f: Fn<E, E2>, g: Fn<A, B>) => compose(T.map(E.bimap(f, g)));

export const join = <E, A>(tta: TaskEither<E, TaskEither<E, A>>): TaskEither<E, A> => {
  return () => tta().then(E.fold(compose(P.of, E.left<E, A>), run));
};

export const chain = <E, A, B>(f: Fn<A, TaskEither<E, B>>) =>
  compose(T.chain(E.fold(left<E, B>, f)));

export const orElse = <E, A, E2>(f: Fn<E, TaskEither<E2, A>>) =>
  compose(T.chain(E.fold(f, right<E2, A>)));

export const getOrElse = <E, A>(f: Fn<E, A>) => compose(T.map(E.getOrElse(f)));

export const alt =
  <E, A>(tea: TaskEither<E, A>) =>
  (tea2: TaskEither<E, A>): TaskEither<E, A> =>
  () =>
    tea().then(E.fold(tea2, tea));

export const toUnion = compose(T.map(E.toUnion));

export const toNullable = compose(T.map(E.toNullable));

export const toMaybe = compose(T.map(E.toMaybe));

interface MTaskEither<F extends URIS2> extends Monad2<F> {}

export const TE: MTaskEither<URI> = { URI, of, map, bimap, join, chain, left, right };
