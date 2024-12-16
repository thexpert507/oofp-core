import type { Either } from "./either";
import type { Task } from "./task";
import * as T from "./task";
import * as E from "./either";
import { URIS2 } from "./URIS2";
import { Monad2 } from "./monad-2";
import { compose } from "./compose";
import { Fn } from "./function";
import { P } from "./promise";
import { pipe } from "./pipe";

export const URI = "TaskEither";
export type URI = typeof URI;

export type TaskEither<E, T> = Task<Either<E, T>>;

declare module "@/URIS2" {
  interface URItoKind2<E, A> {
    TaskEither: TaskEither<E, A>;
  }
}

export const taskify =
  <Args extends any[], R>(fn: (...args: Args) => Promise<R>) =>
  (...args: Args): TaskEither<Error, R> =>
  () =>
    fn(...args)
      .then(E.right)
      .catch((e) => E.left(new Error(String(e)))) as Promise<Either<Error, R>>;

export const taskifyEither =
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

export const tap =
  <A>(f: Fn<A, void>) =>
  <E>(as: TaskEither<E, A>) =>
    pipe(as, T.map(E.tap(f)));

export const tapLeft =
  <E>(f: Fn<E, void>) =>
  <A>(as: TaskEither<E, A>) =>
    pipe(as, T.map(E.tapLeft(f)));

export const map =
  <A, B>(f: Fn<A, B>) =>
  <E>(as: TaskEither<E, A>) =>
    pipe(as, T.map(E.map(f)));

export const mapLeft =
  <E, E2>(f: Fn<E, E2>) =>
  <A>(as: TaskEither<E, A>) =>
    pipe(as, T.map(E.mapLeft(f)));

export const bimap =
  <E, A, E2, B>(f: Fn<E, E2>, g: Fn<A, B>) =>
  (as: TaskEither<E, A>) =>
    pipe(as, T.map(E.bimap(f, g)));

export const join = <E, A>(tta: TaskEither<E, TaskEither<E, A>>): TaskEither<E, A> => {
  return () => tta().then(E.fold(compose(P.of, E.left<E, A>), run));
};

export const chain =
  <E, A, B>(f: Fn<A, TaskEither<E, B>>) =>
  (as: TaskEither<E, A>): TaskEither<E, B> =>
    pipe(as, T.chain(E.fold(left<E, B>, f)));

export const chainw =
  <E2, A, B>(f: Fn<A, TaskEither<E2, B>>) =>
  <E>(as: TaskEither<E, A>): TaskEither<E | E2, B> =>
    pipe(as, T.chain(E.fold(left<E | E2, B>, f)));

export const orElse = <E, A, E2>(f: Fn<E, TaskEither<E2, A>>) =>
  compose(T.chain(E.fold(f, right<E2, A>)));

export const getOrElse =
  <E, A>(f: Fn<E, A>) =>
  (as: TaskEither<E, A>) =>
    pipe(as, T.map(E.getOrElse(f)));

export const alt =
  <E, A>(tea: TaskEither<E, A>) =>
  (tea2: TaskEither<E, A>): TaskEither<E, A> =>
  () =>
    tea().then(E.fold(tea2, tea));

export const toUnion = compose(T.map(E.toUnion));

export const toNullable = compose(T.map(E.toNullable));

export const toMaybe = compose(T.map(E.toMaybe));

export const apply =
  <E, A, B>(ap: TaskEither<E, Fn<A, B>>) =>
  (ta: TaskEither<E, A>): TaskEither<E, B> => {
    return async () => {
      const [fn, a] = await Promise.all([ap(), ta()]);
      return E.apply(fn)(a);
    };
  };

export const applyw =
  <E, A, B>(ap: TaskEither<E, Fn<A, B>>) =>
  <E2>(ta: TaskEither<E2, A>): TaskEither<E | E2, B> => {
    return async () => {
      const [fn, a] = await Promise.all([ap(), ta()]);
      return E.applyw(fn)(a);
    };
  };

export const sapply =
  <E, A, B>(ap: TaskEither<E, Fn<A, B>>) =>
  (ta: TaskEither<E, A>): TaskEither<E, B> => {
    return pipe(
      ap,
      chain((fn) => pipe(ta, map(fn)))
    );
  };

export const sapplyw =
  <E2, A, B>(ap: TaskEither<E2, Fn<A, B>>) =>
  <E>(ta: TaskEither<E, A>): TaskEither<E | E2, B> => {
    return pipe(
      ap,
      chainw((fn) => pipe(ta, map(fn)))
    );
  };

const merge =
  <E, A>(as: TaskEither<E, A>) =>
  (acc: A[]) =>
    pipe(
      as,
      map((v) => [...acc, v])
    );

export const sequenceArray = <E, A>(tasks: TaskEither<E, A>[]): TaskEither<E, A[]> => {
  return tasks.reduce((acc, task) => {
    return pipe(acc, chain(merge(task)));
  }, of<E, A[]>([]));
};

interface MTaskEither<F extends URIS2> extends Monad2<F> {}

export const TE: MTaskEither<URI> = { URI, of, map, bimap, join, chain, left, right };
