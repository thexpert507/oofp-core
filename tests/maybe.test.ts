import { assert } from "@std/assert";
import { compose } from "../src/compose.ts";
import * as M from "../src/maybe.ts";

const toUpper = (s: string) => s.toUpperCase();
const toLower = (s: string) => s.toLowerCase();

const toFullName = (name: string) => (lastName: string) => `${name} ${lastName}`;

const countLetters = (s: string) => s.length;

Deno.test("Maybe", () => {
  const name = M.just("Adriel");

  const op = compose(
    M.getOrElse(0),
    M.map(countLetters),
    M.map(toUpper),
    M.map(toLower),
    M.map(toUpper),
    M.bind((name: string) => M.just(toFullName(name)("Avila")))
  );

  const result = op(name);
  assert(result === 12);
});
