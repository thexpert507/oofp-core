import { pipe } from "@/pipe";
import * as O from "@/object";
import { describe, it, expect } from "vitest";

describe("Object", () => {
  it("should map property", () => {
    const obj = { a: { c: 1 }, b: 2, c: 3 };

    const result = pipe(
      obj,
      O.mapProperty(
        "a",
        O.mapProperty("c", (x) => x.toString())
      )
    );

    expect(result).toEqual({ a: { c: "1" }, b: 2, c: 3 });
  });
});
