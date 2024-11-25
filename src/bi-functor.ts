import { Fn } from "./function.ts";

export interface Bifunctor<A = unknown, B = unknown, F = unknown> {
  bimap<C, D>(f: Fn<A, C>, g: Fn<B, D>): Bifunctor<C, D, F>;
}
