import { Fn } from "./function";
import { pipe } from "./pipe";
import * as R from "./reader";
import { Task } from "./task";
import * as TE from "./task-either";
import * as O from "./object";
import { Applicative3 } from "./applicative";
import { Monad3 } from "./monad";

export const URI = "ReaderTaskEither";
export type URI = typeof URI;

export type ReaderTaskEither<R, E, A> = R.Reader<R, TE.TaskEither<E, A>>;

declare module "./URIS3" {
  interface URItoKind3<_R, _E, _A> {
    ReaderTaskEither: ReaderTaskEither<_R, _E, _A>;
  }
}

export const of =
  <R, E, A>(a: A): ReaderTaskEither<R, E, A> =>
  () =>
    TE.of(a);

export const from =
  <R, E, A>(te: TE.TaskEither<E, A>): ReaderTaskEither<R, E, A> =>
  () =>
    te;

export const fromReader =
  <R, A>(r: R.Reader<R, A>): ReaderTaskEither<R, never, A> =>
  (ctx: R) =>
    TE.of(r(ctx));

export const ask =
  <R>(): ReaderTaskEither<R, never, R> =>
  (ctx: R) =>
    TE.of(ctx);

export const tap =
  <R, E, A>(fn: Fn<A, void>) =>
  (rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
  (ctx: R) =>
    pipe(rte(ctx), TE.tap(fn));

export const tapR =
  <R, A>(fn: Fn<R, Fn<A, void>>) =>
  <E>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> => {
    return (ctx: R) => pipe(rte(ctx), TE.tap(fn(ctx)));
  };

export const tapLeft =
  <R, E, A>(fn: Fn<E, void>) =>
  (rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
  (ctx: R) =>
    pipe(rte(ctx), TE.tapLeft(fn));

export const tapRTE =
  <R2, E2, A>(fn: Fn<A, ReaderTaskEither<R2, E2, void>>) =>
  <R1, E1>(rte: ReaderTaskEither<R1, E1, A>): ReaderTaskEither<R1 & R2, E1 | E2, A> => {
    return (ctx: R1 & R2) =>
      pipe(
        rte(ctx),
        TE.tapTE((a) => fn(a)(ctx))
      );
  };

export const tapLeftRTE =
  <R2, E1, E2, A>(fn: Fn<E1, ReaderTaskEither<R2, E2, void>>) =>
  <R1>(rte: ReaderTaskEither<R1, E1, A>): ReaderTaskEither<R1 & R2, E1 | E2, A> => {
    return (ctx: R1 & R2) =>
      pipe(
        rte(ctx),
        TE.tapLeftTE((e) => fn(e)(ctx))
      );
  };

export const map =
  <A, B>(fn: Fn<A, B>) =>
  <R, E>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => {
    return (ctx: R) => pipe(rte(ctx), TE.map(fn));
  };

export const mapWhithContext =
  <R, A, B>(fn: Fn<R, Fn<A, B>>) =>
  <E>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => {
    return (ctx: R) => pipe(rte(ctx), TE.map(fn(ctx)));
  };

export const mapLeft =
  <E, E2>(fn: Fn<E, E2>) =>
  <R, A>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E2, A> => {
    return (ctx: R) => pipe(rte(ctx), TE.mapLeft(fn));
  };

export const join = <R, E, A>(
  rte: ReaderTaskEither<R, E, ReaderTaskEither<R, E, A>>
): ReaderTaskEither<R, E, A> => {
  return (ctx: R) =>
    pipe(
      rte(ctx),
      TE.chain((rte) => rte(ctx))
    );
};

export const chain =
  <R, E, A, B>(fn: Fn<A, ReaderTaskEither<R, E, B>>) =>
  (rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => {
    return (ctx: R) =>
      pipe(
        rte(ctx),
        TE.chain((a) => fn(a)(ctx))
      );
  };

export const chaint =
  <E, A, B>(fn: Fn<A, TE.TaskEither<E, B>>) =>
  <R>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => {
    return (ctx: R) => pipe(rte(ctx), TE.chain(fn));
  };

export const chainw =
  <R, E2, A, B>(fn: Fn<A, ReaderTaskEither<R, E2, B>>) =>
  <E1>(rte: ReaderTaskEither<R, E1, A>): ReaderTaskEither<R, E1 | E2, B> => {
    return (ctx: R) =>
      pipe(
        rte(ctx),
        TE.chainw((a) => fn(a)(ctx))
      );
  };

export const chainwc =
  <R2, E, A, B>(fn: Fn<A, ReaderTaskEither<R2, E, B>>) =>
  <R1>(rte: ReaderTaskEither<R1, E, A>): ReaderTaskEither<R1 & R2, E, B> => {
    return (ctx: R1 & R2) =>
      pipe(
        rte(ctx),
        TE.chain((a) => fn(a)(ctx))
      );
  };

export const provide =
  <R extends Record<any, any>, R2 extends Partial<R>>(r2: R2) =>
  <E, A>(ra: ReaderTaskEither<R, E, A>): ReaderTaskEither<Omit<R, keyof R2>, E, A> =>
  (r: Omit<R, keyof R2>) =>
    ra({ ...r2, ...r } as unknown as R);

export const fold =
  <R, E, A, B>(onLeft: Fn<E, B>, onRight: Fn<A, B>) =>
  (rte: ReaderTaskEither<R, E, A>): R.Reader<R, Task<B>> => {
    return (ctx: R) => pipe(rte(ctx), TE.fold(onLeft, onRight));
  };

export const run =
  <R>(r: R) =>
  <E, A>(rte: ReaderTaskEither<R, E, A>): TE.TaskEither<E, A> =>
    rte(r);

export const apply =
  <R2, E, A, B>(rtefn: ReaderTaskEither<R2, E, Fn<A, B>>) =>
  <R1>(rte: ReaderTaskEither<R1, E, A>): ReaderTaskEither<R1 & R2, E, B> => {
    return (ctx: R1 & R2) => pipe(rte(ctx), TE.apply(rtefn(ctx)));
  };

// Helper types for the new sequenceObject and sequence
type ReaderContexts<T extends ReaderTaskEither<any, any, any>[]> = UnionToIntersection<
  {
    [K in keyof T]: T[K] extends ReaderTaskEither<infer R, any, any> ? R : never;
  }[keyof T & number]
>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

type ReaderErrors<T extends ReaderTaskEither<any, any, any>[]> = {
  [K in keyof T & number]: T[K] extends ReaderTaskEither<any, infer E, any> ? E : never;
}[keyof T & number];

type ReaderValues<T extends ReaderTaskEither<any, any, any>[]> = {
  [K in keyof T & number]: T[K] extends ReaderTaskEither<any, any, infer A> ? A : never;
};

export const sequence = <T extends ReaderTaskEither<any, any, any>[]>(
  arr: T
): ReaderTaskEither<ReaderContexts<T>, ReaderErrors<T>, ReaderValues<T>> => {
  return (ctx: ReaderContexts<T>) => {
    const taskEitherArr = arr.map((rte) => rte(ctx));
    return pipe(taskEitherArr, TE.sequence) as TE.TaskEither<ReaderErrors<T>, ReaderValues<T>>;
  };
};

// Helper types for the new sequenceObject
type ReaderObjectContexts<T extends Record<string, ReaderTaskEither<any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof T]: T[K] extends ReaderTaskEither<infer R, any, any> ? R : never;
    }[keyof T]
  >;

type ReaderObjectErrors<T extends Record<string, ReaderTaskEither<any, any, any>>> = {
  [K in keyof T]: T[K] extends ReaderTaskEither<any, infer E, any> ? E : never;
}[keyof T];

type ReaderObjectValues<T extends Record<string, ReaderTaskEither<any, any, any>>> = {
  [K in keyof T]: T[K] extends ReaderTaskEither<any, any, infer A> ? A : never;
};

export const sequenceObject = <T extends Record<string, ReaderTaskEither<any, any, any>>>(
  obj: T
): ReaderTaskEither<ReaderObjectContexts<T>, ReaderObjectErrors<T>, ReaderObjectValues<T>> => {
  return (ctx: ReaderObjectContexts<T>) => {
    return pipe(
      obj,
      O.mapValues((rte) => rte(ctx)),
      TE.sequenceObject,
      (d) => d as TE.TaskEither<ReaderObjectErrors<T>, ReaderObjectValues<T>>
    );
  };
};

type Config = { concurrency: number; delay?: number };
export const concurrency =
  (config: Config) =>
  <R, E, A>(arr: ReaderTaskEither<R, E, A>[]): ReaderTaskEither<R, E, A[]> => {
    return (ctx: R) => TE.concurrency(config)(arr.map((rte) => rte(ctx)));
  };

export const delay =
  (ms: number) =>
  <R, E, A>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> => {
    return (ctx: R) => pipe(rte(ctx), TE.delay(ms));
  };

interface RTEF extends Monad3<URI>, Applicative3<URI> {}

export const RTE: RTEF = { URI, of, map, join, chain, apply };
