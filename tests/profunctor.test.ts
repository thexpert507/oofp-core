import { profunctor } from "../src/profunctor.ts";

Deno.test("Profunctor", () => {
  const log = (msg: string) => console.log(msg);

  const logger = profunctor(log);

  const upperLogger = logger.lmap((msg: string) => msg.toUpperCase());

  const numberLogger = logger.lmap((numbers: number[]) => numbers.join(", "));

  const doubleLogger = logger.rmap(() => "Double: ");

  logger.call("Hello, World!");
  upperLogger.call("Hello, World!");
  numberLogger.call([1, 2, 3]);
  doubleLogger.call("Hello, World!");
});
