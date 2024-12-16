import { Monad } from "@/monad.ts";
import { Monad2 } from "@/monad-2.ts";
import { base, MaybeT } from "./base";
import { base2, BiMaybeT } from "./bi";

type InferF<M> = M extends Monad<infer F> ? F : M extends Monad2<infer F> ? F : never;

export function maybeT<M extends Monad<any>>(mo: M): MaybeT<InferF<M>>;
export function maybeT<M extends Monad2<any>>(mo: M): BiMaybeT<InferF<M>>;
export function maybeT(mo: Monad<any> | Monad2<any>): any {
  return "bimap" in mo ? base2(mo) : base(mo);
}
