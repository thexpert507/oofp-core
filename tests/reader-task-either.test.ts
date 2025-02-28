import { describe, it, expect } from "vitest";
import * as RTE from "@/reader-task-either";
import * as E from "@/either";
import { pipe } from "@/pipe";

describe("ReaderTaskEither", () => {
  it("should create a right ReaderTaskEither", async () => {
    const rte = RTE.of("success");
    const result = await rte({})();
    expect(result).toEqual(E.right("success"));
  });

  it("should be run concurrency", async () => {
    const rte1 = pipe(RTE.of(1), RTE.delay(100));
    const rte2 = RTE.of(2);
    const rte3 = RTE.of(3);

    const result = await RTE.concurrency({ concurrency: 1, delay: 500 })([rte1, rte2, rte3])({})();

    expect(result).toEqual(E.right([1, 2, 3]));
  });

  it("should be run sequence object", async () => {
    type C1 = { a: number };
    type C2 = { b: number };
    type C3 = { c: number };
    const rte1 = RTE.of<C1, never, number>(1);
    const rte2 = RTE.of<C2, never, number>(2);
    const rte3 = RTE.of<C3, never, number>(3);

    const result = await RTE.sequenceObject({ a: rte1, b: rte2, c: rte3 })({ a: 1, b: 2, c: 3 })();

    expect(result).toEqual(E.right({ a: 1, b: 2, c: 3 }));
  });
});
