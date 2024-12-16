import { describe, it, expect } from "vitest";
import * as TE from "../lib/task-either";
import * as E from "../lib/either";
import * as T from "../lib/task";
import { pipe } from "@/pipe";

describe("TaskEither", () => {
  it("should create a right TaskEither", async () => {
    const taskEither = TE.of("success");
    const result = await TE.run(taskEither);
    expect(result).toEqual(E.right("success"));
  });

  it("should create a left TaskEither", async () => {
    const taskEither = TE.left("error");
    const result = await TE.run(taskEither);
    expect(result).toEqual(E.left("error"));
  });

  it("should map over a right TaskEither", async () => {
    const taskEither = TE.of(1);
    const mapped = TE.map((n: number) => n + 1)(taskEither);
    const result = await TE.run(mapped);
    expect(result).toEqual(E.right(2));
  });

  it("should map over a left TaskEither", async () => {
    const taskEither = TE.left<string, number>("error");
    const mapped = TE.map((n: number) => n + 1)(taskEither);
    const result = await TE.run(mapped);
    expect(result).toEqual(E.left("error"));
  });

  it("should chain over a right TaskEither", async () => {
    const taskEither = TE.of(1);
    const chained = TE.chain((n: number) => TE.of(n + 1))(taskEither);
    const result = await TE.run(chained);
    expect(result).toEqual(E.right(2));
  });

  it("should chain over a left TaskEither", async () => {
    const taskEither = TE.left<string, number>("error");
    const chained = TE.chain((n: number) => TE.of(n + 1))(taskEither);
    const result = await TE.run(chained);
    expect(result).toEqual(E.left("error"));
  });

  it("should handle errors with orElse", async () => {
    const taskEither = TE.left<string, string>("error");
    const handled = TE.orElse((e: string) => TE.of(`handled ${e}`))(taskEither);
    const result = await TE.run(handled);
    expect(result).toEqual(E.right("handled error"));
  });

  it("should getOrElse from a right TaskEither", async () => {
    const taskEither = TE.of("success");
    const result = await T.run(TE.getOrElse(() => "default")(taskEither));
    expect(result).toEqual("success");
  });

  it("should getOrElse from a left TaskEither", async () => {
    const taskEither = TE.left<string, string>("error");
    const result = await T.run(TE.getOrElse(() => "default")(taskEither));
    expect(result).toEqual("default");
  });

  it("should tryCatch a successful task", async () => {
    const task = T.of("success");
    const taskEither = TE.tryCatch(() => "error")(task);
    const result = await TE.run(taskEither);
    expect(result).toEqual(E.right("success"));
  });

  it("should tryCatch a failing task", async () => {
    const task = () => Promise.reject("failure");
    const taskEither = TE.tryCatch(() => "error")(task);
    const result = await TE.run(taskEither);
    expect(result).toEqual(E.left("error"));
  });

  it("should fold a TaskEither", async () => {
    const result = await pipe(
      TE.of("success"),
      TE.fold(
        (e) => `error: ${e}`,
        (a) => `success: ${a}`
      ),
      T.run
    );

    expect(result).toEqual("success: success");
  });
});
