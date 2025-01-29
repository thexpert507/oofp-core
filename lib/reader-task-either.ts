import { Fn } from "./function";
import { pipe } from "./pipe";
import * as R from "./reader";
import { Task } from "./task";
import * as TE from "./task-either";
import { concurrency2 } from "./utils";

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

export const ask =
  <R>(): ReaderTaskEither<R, never, R> =>
  (ctx: R) =>
    TE.of(ctx);

export const tap =
  <R, E, A>(fn: Fn<A, void>) =>
  (rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
  (ctx: R) =>
    pipe(rte(ctx), TE.tap(fn));

export const tapLeft =
  <R, E, A>(fn: Fn<E, void>) =>
  (rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> =>
  (ctx: R) =>
    pipe(rte(ctx), TE.tapLeft(fn));

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
  <R, E, A>(rte: ReaderTaskEither<R, E, A>) =>
  <B>(rtfn: ReaderTaskEither<R, E, Fn<A, B>>): ReaderTaskEither<R, E, B> => {
    return (ctx: R) =>
      pipe(
        rte(ctx),
        TE.chain((a) =>
          pipe(
            rtfn(ctx),
            TE.map((fn) => fn(a))
          )
        )
      );
  };

export const sequenceArray = <R, E, A>(
  arr: ReaderTaskEither<R, E, A>[]
): ReaderTaskEither<R, E, A[]> => {
  return (ctx: R) => TE.sequenceArray(arr.map((rte) => rte(ctx)));
};

type Config = { concurrency: number; delay?: number };
export const concurrency =
  (config: Config) =>
  <R, E, A>(arr: ReaderTaskEither<R, E, A>[]): ReaderTaskEither<R, E, A[]> => {
    return (ctx: R) => concurrency2(TE)(config)(arr.map((rte) => rte(ctx)));
  };

export const delay =
  (ms: number) =>
  <R, E, A>(rte: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, A> => {
    return (ctx: R) => pipe(rte(ctx), TE.delay(ms));
  };
