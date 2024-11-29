import { describe, it, expect } from "vitest";
import { maybeT } from "../lib/maybe-t.ts";
import { compose } from "../lib/compose.ts";
import * as P from "../lib/promise.ts";
import { id } from "../lib/id.ts";

describe("MaybeT", () => {
  it("should lift a value into a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const result = MT.lift(Promise.resolve(value));
    expect(await result).toEqual(value);
  });

  it("should map a function over a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const toUpperCase = (value: string) => value.toUpperCase();
    const result = compose(MT.map(toUpperCase), MT.lift, id<Promise<string>>);
    expect(await result(Promise.resolve(value))).toEqual(value.toUpperCase());
  });

  it("should chain functions over a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const toUpperCase = (value: string) => Promise.resolve(value.toUpperCase());
    const result = MT.chain(toUpperCase)(MT.lift(Promise.resolve(value)));
    expect(await result).toEqual(value.toUpperCase());
  });

  it("should handle Nothing in chain", async () => {
    const MT = maybeT<P.URI>(P);
    const value = null;
    const toUpperCase = (value: string) => Promise.resolve(value.toUpperCase());
    const result = MT.chain(toUpperCase)(MT.lift(Promise.resolve(value)));
    expect(await result).toBeNull();
  });
});
