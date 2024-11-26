import { assertEquals } from "@std/assert";
import { maybeT } from "../src/maybe-t.ts";
import { compose } from "../src/compose.ts";
import * as P from "../src/promise.ts";
import { id } from "../src/id.ts";

Deno.test("MaybeT - of", async () => {
  const MT = maybeT<P.Monad>(P);
  const value = "Hello, World!";
  const result = MT.of(Promise.resolve(value));
  assertEquals(await result, value);
});

Deno.test("MaybeT - map", async () => {
  const MT = maybeT<P.Monad>(P);
  const value = "Hello, World!";
  const toUpperCase = (value: string) => value.toUpperCase();
  const result = compose(MT.map(toUpperCase), MT.of, id<Promise<string>>);
  assertEquals(await result(Promise.resolve(value)), value.toUpperCase());
});
