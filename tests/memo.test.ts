import { assert } from "@std/assert";
import { randomInt } from "node:crypto";
import { memo } from "../src/memo.ts";

const factorial = (n: number): number => {
  if (n === 0) return 1;
  return n * factorial(n - 1);
};

Deno.test("Memo: factorial", () => {
  const facMemo = memo(factorial);

  console.time("Memo: factorial");
  assert(facMemo(10) === 3628800);
  console.timeEnd("Memo: factorial");

  console.time("Memo: factorial");
  assert(facMemo(10) === 3628800);
  console.timeEnd("Memo: factorial");
});

Deno.test("Memo: random", () => {
  const random = () => randomInt(100);
  const mrandom = memo(random);

  console.time("Memo: random");
  assert(mrandom(undefined) === mrandom(undefined));
  console.timeEnd("Memo: random");

  console.time("Memo: random");
  assert(mrandom(undefined) === mrandom(undefined));
  console.timeEnd("Memo: random");
});
