import * as E from "../src/either.ts";
import * as P from "../src/promise.ts";
import * as M from "../src/maybe.ts";
import { bicompose } from "../src/bi-compose.ts";
import { compose } from "../src/compose.ts";
import { id } from "../src/id.ts";
import { assert } from "@std/assert";

Deno.test("bi-compose", () => {
  const BI = bicompose<E.Monad, P.Monad, M.Monad>(E, P, M);

  const length = (a: number[]) => `${a.length} items`;
  const double = (b: number) => b * 2;

  const composed = compose(
    BI.bimap(length, double),
    id<E.Either<Promise<number[]>, M.Maybe<number>>>
  );

  const result = composed(E.left(Promise.resolve([1])));

  assert(result.tag === "Left");
  assert(result.value instanceof Promise);
});
