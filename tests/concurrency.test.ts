import { describe, it, expect } from "vitest";
import * as T from "@/task";
import * as TE from "@/task-either";
import * as E from "@/either";
import { concurrency, concurrency2 } from "@/utils";
import { pipe } from "@/pipe";

describe("Concurrency", () => {
  it.concurrent("should be able to run two tasks concurrently", async () => {
    const concurrently = concurrency(T)({ concurrency: 2, delay: 1000 });

    const log = (value: number) => console.log(`Concurrently value: ${value}`);

    const t1 = pipe(T.of(1), T.tap(log));
    const t2 = pipe(T.of(2), T.tap(log));
    const t3 = pipe(T.of(3), T.tap(log));
    const t4 = pipe(T.of(4), T.tap(log));

    const result = concurrently([t1, t2, t3, t4]);

    expect(await result()).toEqual([1, 2, 3, 4]);
  });

  it.concurrent("should be able to run tasks eithers concurrently", async () => {
    const concurrently = concurrency2(TE)({ concurrency: 2, delay: 1000 });

    const log = (value: number) => console.log(`Concurrently value: ${value}`);

    const t1 = pipe(TE.of(1), TE.tap(log));
    const t2 = pipe(TE.of(2), TE.tap(log));
    const t3 = pipe(TE.of(3), TE.tap(log));
    const t4 = pipe(TE.of(4), TE.tap(log));

    const result = concurrently([t1, t2, t3, t4]);

    expect(await result()).toEqual(E.right([1, 2, 3, 4]));
  });
});
