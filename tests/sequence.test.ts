import { describe, it, expect } from "vitest";
import * as M from "@/maybe";
import * as T from "@/task";
import * as E from "@/either";
import * as TE from "@/task-either";
import { sequenceT, sequenceT2 } from "@/utils";

describe("Sequence array", () => {
  it("should be able to sequence two maybes", () => {
    const result = sequenceT(M)(M.just(1), M.just("2"));

    expect(M.toNullable(result)).toEqual([1, "2"]);
  });

  it("should be able to sequence two tasks", async () => {
    const result = sequenceT(T)(T.of(1), T.of("2"));

    expect(await result()).toEqual([1, "2"]);
  });

  it("should be able to sequence two either", () => {
    const result = sequenceT2(E)([E.right(1), E.right("2")]);

    expect(result).toEqual(E.right([1, "2"]));
  });

  it("should be able to sequence two either with different types", () => {
    const e1 = E.right<string, number>(1);
    const e2 = E.right<string, string>("2");
    const e3 = E.right<string, number>(3);
    const e4 = E.left<string, number>("El unico error");

    const arr: E.Either<string, number | string>[] = [e1, e2, e3, e4];

    const result = sequenceT2(E)(arr);

    expect(result).toEqual(E.left("El unico error"));
  });

  it("should be able to sequence two task either", async () => {
    const result = sequenceT2(TE)([TE.right(1), TE.right("2")]);

    expect(await result()).toEqual(E.right([1, "2"]));
  });

  it("should be able to sequence two task either with different types", async () => {
    const result = sequenceT2(TE)([TE.right(1), TE.left("El unico error")]);

    expect(await result()).toEqual(E.left("El unico error"));
  });
});
