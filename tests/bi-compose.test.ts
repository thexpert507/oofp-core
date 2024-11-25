import * as E from "../src/either.ts";
import { promise } from "../src/promise.ts";
import { biCompose } from "../src/bi-compose.ts";
import { Functor } from "../src/functor.ts";
import { identity } from "../src/id.ts";

Deno.test("bi-compose", () => {
  const promiseF = promise(Promise.resolve([1, 2, 3]));
  const idF = identity(1);
  const value = E.left<Functor<number[]>, Functor<number>>(promiseF);

  const eitherF = E.either(value);

  const bicomp = biCompose(eitherF);

  const result = bicomp.bimap(
    (a) => `${a.length} length`,
    (b) => b * 2
  );
});
