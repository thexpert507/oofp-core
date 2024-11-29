import { compose } from "./compose.ts";
import { Fn } from "./function.ts";
import { id } from "./id.ts";

export interface Profunctor<A, B> {
  dimap<C, D>(f1: Fn<C, A>, f2: Fn<B, D>): Profunctor<C, D>;

  lmap<C>(f: Fn<C, A>): Profunctor<C, B>;

  rmap<D>(f: Fn<B, D>): Profunctor<A, D>;

  call(a: A): B;
}

export const profunctor = <A, B>(fn: Fn<A, B>): Profunctor<A, B> => ({
  dimap: <C, D>(f1: Fn<C, A>, f2: Fn<B, D>) => profunctor(compose(f2, fn, f1, id<C>)),
  lmap: <C>(f: Fn<C, A>) => profunctor(compose(fn, f, id<C>)),
  rmap: <D>(f: Fn<B, D>) => profunctor(compose(f, fn, id<A>)),
  call: (a: A) => fn(a),
});
