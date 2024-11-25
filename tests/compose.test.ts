import { assert } from "@std/assert";
import { compose } from "../src/compose.ts";
import * as M from "../src/maybe.ts";
import * as E from "../src/either.ts";
import * as L from "../src/list.ts";

Deno.test("Compose: equals types", () => {
  const f1 = (x: number) => x + 1;
  const f2 = (x: number) => x * 2;
  const composed = compose(f1, f2);
  assert(composed(1) === 3);
});

Deno.test("Compose: different types", () => {
  const f1 = (x: number) => x + 1;
  const f2 = (x: string) => x.length;
  const composed = compose(f1, f2);
  assert(composed("1") === 2);
});

Deno.test("Compose: 3 functions", () => {
  const composed = compose(M.getOrElse(0), E.getOrElse(M.just(0)), E.identity<never, number>);
  const result = composed(E.right(10));
  assert(result === 10);
});

type Fn<A, B> = (value: A) => B;

Deno.test("Compose: Functors", () => {
  const square = (x: number) => x * x;

  const mis = M.just([1, 2, 3]);

  const map = compose(M.map, L.map<number, number>);

  const mis2 = map(square)(mis);

  assert(M.getOrElse<number[]>([])(mis2).join(",") === "1,4,9");
});
