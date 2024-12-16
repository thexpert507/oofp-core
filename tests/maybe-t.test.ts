import { describe, it, expect } from "vitest";
import { maybeT } from "@/maybe-t.ts";
import { compose } from "@/compose.ts";
import * as P from "@/promise.ts";
import * as M from "@/maybe.ts";
import { id } from "@/id.ts";
import { pipe } from "@/pipe.ts";

describe("MaybeT", () => {
  it("performance", async () => {
    const start = performance.now();
    const MT = maybeT<P.URI>(P);
    const result = await pipe(
      P.of(M.of(10)),
      MT.map((x) => x + 1),
      MT.map((x) => x * 2),
      MT.map((x) => `Result: ${x}`)
    );
    const end = performance.now();
    console.log("Performance:", end - start);
    console.log(result);
  });

  it("should lift a value into a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const result = await MT.lift(Promise.resolve(value));
    expect(result).toEqual(M.of(value));
  });

  it("should map a function over a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const toUpperCase = (value: string) => value.toUpperCase();
    const composed = compose(MT.map(toUpperCase), MT.lift, id<Promise<string>>);
    const result = await composed(Promise.resolve(value));
    expect(result).toEqual(M.of(value.toUpperCase()));
  });

  it("should chain functions over a MaybeT", async () => {
    const MT = maybeT<P.URI>(P);
    const value = "Hello, World!";
    const toUpperCase = (value: string) => Promise.resolve(M.of(value.toUpperCase()));
    const result = await MT.chain(toUpperCase)(MT.lift(Promise.resolve(value)));
    expect(result).toEqual(M.of(value.toUpperCase()));
  });

  it("should handle Nothing in chain", async () => {
    const MT = maybeT<P.URI>(P);
    const toUpperCase = (value: string) => Promise.resolve(M.of(value.toUpperCase()));
    const result = await MT.chain(toUpperCase)(Promise.resolve(M.nothing()));
    expect(result).toEqual(M.nothing());
  });
});
