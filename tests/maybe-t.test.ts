import { assertEquals } from "@std/assert";
import * as MT from "../src/maybe-t.ts";
import * as M from "../src/maybe.ts";
import * as E from "../src/either.ts";
import { compose } from "../src/compose.ts";

Deno.test("MaybeT - identity", () => {
  const value = MT.of("Maybe")("Hello, World!");
  const result = MT.identity(value);
  assertEquals(result, value);
});

Deno.test("MaybeT - of", async () => {
  const value = "Hello, World!";
  const result = MT.of("Promise")(value);
  assertEquals(await result.monad, value);
});

Deno.test("MaybeT - map", async () => {
  const value = "Hello, World!";
  const result = MT.map((value: string) => value.toUpperCase())(MT.of("Promise")(value));
  assertEquals(await result.monad, value.toUpperCase());
});

Deno.test("MaybeT - getOrElse", async () => {
  const value = "Hello, World!";
  const result = MT.getOrElse("Goodbye, World!")(MT.of("Promise")(value));
  assertEquals(await result, value);
});

Deno.test.ignore("MaybeT - compose", async () => {
  const value1 = E.right(M.just("Hello, World!"));
  const value2 = (_: string) => Promise.resolve(M.nothing<number>());

  const composed = compose(
    // MT.getOrElse(0),
    // MT.map((value: number) => value.toString()),
    MT.bind((value: string) => ({ tag: "Promise", monad: value2(value) })),
    MT.map((value: string) => value.toUpperCase()),
    MT.from("Either"),
    E.identity<unknown, M.Maybe<string>>
  );

  const result = await composed(value1).monad;
  console.log(result);
  //   assertEquals(result, "Goodbye, World!");
  assertEquals(result, 0);
});
