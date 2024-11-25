import { assert } from "@std/assert";
import { id } from "../src/id.ts";

Deno.test("ID", () => {
  const value = 1;
  assert(value === id(value));
});
