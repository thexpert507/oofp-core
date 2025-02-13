import type { Either } from "./either";
import type { Task } from "./task";
import * as T from "./task";
import * as E from "./either";
import { Monad2 } from "./monad";
import { compose } from "./compose";
import { Fn } from "./function";
import { P } from "./promise";
import { pipe } from "./pipe";
import { BiFunctor2 } from "./functor";
import { Delayable2 } from "./delayable";
import { id } from "./id";
import { sequenceT2, sequenceObjectT2, concurrency2 } from "./utils";
import { Applicative2 } from "./applicative";

export const URI = "TaskEither";
export type URI = typeof URI;

export type TaskEither<E, T> = Task<Either<E, T>>;

declare module "./URIS2" {
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

const mapE = (e: unknown) => new Error(String(e));

export const fromPromise = <A>(fn: () => Promise<A>): TaskEither<Error, A> => tryCatch(mapE)(fn);

export const fromEither =
  <E, A>(either: Either<E, A>): TaskEither<E, A> =>
  () =>
    Promise.resolve(either);

export const fromTask = <A>(task: Task<A>): TaskEither<Error, A> => tryCatch(mapE)(task);

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

export const tapTE =
  <E2, A>(f: Fn<A, TaskEither<E2, void>>) =>
  <E1>(as: TaskEither<E1, A>): TaskEither<E1 | E2, A> => {
    return pipe(
      as,
      T.chain(
        E.fold(left<E1 | E2, A>, (result) => {
          return pipe(f(result), T.map(E.fold(E.left<E1 | E2, A>, () => E.right(result))));
        })
      )
    );
  };

export const tapLeftTE =
  <E1, E2, A>(f: Fn<E1, TaskEither<E2, void>>) =>
  (as: TaskEither<E1, A>): TaskEither<E1 | E2, A> => {
    return pipe(
      as,
      T.chain(
        E.fold(
          (error) => {
            return pipe(
              f(error),
              T.map(
                E.fold(
                  () => E.left(error),
                  () => E.left(error)
                )
              )
            );
          },
          (result) => T.of(E.right(result))
        )
      )
    );
  };

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

export const tchain =
  <E, A>(f: Fn<A, TaskEither<E, void>>) =>
  (as: TaskEither<E, A>): TaskEither<E, A> => {
    return pipe(
      as,
      chain((a) =>
        pipe(
          f(a),
          map(() => a)
        )
      )
    );
  };

export const chainw =
  <E2, A, B>(f: Fn<A, TaskEither<E2, B>>) =>
  <E>(as: TaskEither<E, A>): TaskEither<E | E2, B> =>
    pipe(as, T.chain(E.fold(left<E | E2, B>, f)));

export const chainLeft =
  <E, A>(f: Fn<E, TaskEither<E, A>>) =>
  (as: TaskEither<E, A>): TaskEither<E, A> =>
    pipe(as, T.chain(E.fold(f, right<E, A>)));

export const chainLeftw =
  <E2, E, A>(f: Fn<E, TaskEither<E2, A>>) =>
  (as: TaskEither<E, A>): TaskEither<E | E2, A> =>
    pipe(as, T.chain(E.fold(f, right<E | E2, A>)));

export const fold =
  <E, A, B>(onLeft: Fn<E, B>, onRight: Fn<A, B>) =>
  (as: TaskEither<E, A>): Task<B> =>
    pipe(as, T.map(E.fold(onLeft, onRight)));

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

export const toPromise = <E, A>(tea: TaskEither<E, A>): Promise<A> => {
  return tea().then(
    E.fold(
      (e) => Promise.reject(e),
      (a) => Promise.resolve(a)
    )
  );
};

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

export const delay =
  (ms: number) =>
  <E, A>(tea: TaskEither<E, A>): TaskEither<E, A> => {
    return async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
      return tea();
    };
  };

type RetryOptions<E = unknown> = {
  maxRetries: number;
  delay?: number;
  onError?: Fn<E, void>;
  skipIf?: Fn<E, boolean>;
};
export const retry =
  <E>(options: RetryOptions<E>, acc = 0) =>
  <A>(ta: TaskEither<E, A>): TaskEither<E, A> => {
    return pipe(
      ta,
      chainLeft((e) => {
        if (options.skipIf && options.skipIf(e)) return left(e);
        if (acc >= options.maxRetries) return left(e);
        if (options.onError) options.onError(e);
        return pipe(ta, options.delay ? delay(options.delay) : id, retry(options, acc + 1));
      })
    );
  };

interface TEF extends Monad2<URI>, BiFunctor2<URI>, Delayable2<URI>, Applicative2<URI> {}

export const TE: TEF = { URI, of, map, bimap, join, chain, delay, apply };

export const sequence = sequenceT2(TE);
export const sequenceObject = sequenceObjectT2(TE);
export const concurrency = concurrency2(TE);
