import { assert } from "@std/assert";
import { curry, uncurry } from "../src/curry.ts";

Deno.test("Curry", () => {
  const add = (a: number, b: number) => a + b;

  const curried = curry(add);

  assert(curried(1)(2) === 3);
});

Deno.test("Uncurry", () => {
  const add = (a: number) => (b: number) => a + b;

  const uncurried = uncurry(add);

  assert(uncurried(1, 2) === 3);
});
