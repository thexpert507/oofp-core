import { compose } from "./compose.ts";
import * as E from "./either.ts";
import * as M from "./maybe.ts";

type MaybeT<A = unknown> =
  | { tag: "Promise"; monad: Promise<M.Maybe<A>> }
  | { tag: "Either"; monad: E.Either<unknown, M.Maybe<A>> }
  | { tag: "Maybe"; monad: M.Maybe<A> };

type MReturn<M extends MaybeT, A> = M extends { tag: "Promise" }
  ? Promise<M.Maybe<A>>
  : M extends { tag: "Either" }
  ? E.Either<unknown, M.Maybe<A>>
  : M.Maybe<A>;

type Monads = MaybeT["tag"];
type MValues<M extends Monads, A> = M extends "Promise"
  ? Promise<M.Maybe<A>>
  : M extends "Either"
  ? E.Either<unknown, M.Maybe<A>>
  : M.Maybe<A>;

export const identity = <A>(value: MaybeT<A>): MaybeT<A> => value;

export const of =
  <M extends Monads>(tag: M) =>
  <A>(value: A): MaybeT<A> => {
    if (tag === "Promise") return { tag, monad: Promise.resolve(M.just(value)) };
    if (tag === "Either") return { tag, monad: E.right(M.just(value)) };
    return { tag, monad: M.just(value) };
  };

export const from =
  <M extends Monads>(tag: M) =>
  <A>(value: MValues<M, A>): MaybeT<A> => {
    if (tag === "Promise") return { tag, monad: value as Promise<M.Maybe<A>> };
    if (tag === "Either") return { tag, monad: value as E.Either<unknown, M.Maybe<A>> };
    return { tag, monad: value as M.Maybe<A> };
  };

export const map =
  <A, B>(fn: (value: A) => B) =>
  ({ tag, monad }: MaybeT<A>): MaybeT<B> => {
    if (tag === "Promise") return { tag, monad: monad.then(M.map(fn)) };
    if (tag === "Either") return { tag, monad: E.map(M.map(fn))(monad) };
    return { tag, monad: M.map(fn)(monad) };
  };

export const bind =
  <A, B>(fn: (value: A) => MaybeT<B>) =>
  ({ tag, monad }: MaybeT<A>): MaybeT<B> => {
    if (tag === "Promise") return { tag, monad: monad.then(M.bind(fn)) as Promise<M.Maybe<B>> };
    if (tag === "Either") {
      return { tag, monad: E.map(M.bind(fn))(monad) as E.Either<unknown, M.Maybe<B>> };
    }
    return { tag, monad: M.bind(fn)(monad) as M.Maybe<B> };
  };

export const getOrElse =
  <A>(defaultValue: A) =>
  <M extends MaybeT<A>>({ tag, monad }: M): A | Promise<A> => {
    if (tag === "Promise") return monad.then(M.getOrElse(defaultValue));
    if (tag === "Either")
      return compose(
        M.getOrElse(defaultValue),
        E.getOrElse(M.just(defaultValue)),
        E.identity<unknown, M.Maybe<A>>
      )(monad);
    return M.getOrElse(defaultValue)(monad);
  };
