import { assert } from "@std/assert";
import { compose } from "../src/compose.ts";
import * as E from "../src/either.ts";

const divide = (x: number, y: number): E.Either<string, number> => {
  if (y === 0) return E.left("Division by zero");
  return E.right(x / y);
};

Deno.test("Either", () => {
  const op = compose(
    E.rmap((x: number) => x + 1),
    E.bind((x: number) => divide(x, 2)),
    E.bind((x: number) => divide(x, 2))
  );

  const result = op(E.right(10));
  assert(result.value === 3.5);
});
