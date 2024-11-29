/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        ["bi-compose"]: resolve(__dirname, "lib/bi-compose.ts"),
        ["bi-functor"]: resolve(__dirname, "lib/bi-functor.ts"),
        ["chain-2"]: resolve(__dirname, "lib/chain-2.ts"),
        chain: resolve(__dirname, "lib/chain.ts"),
        compose: resolve(__dirname, "lib/compose.ts"),
        curry: resolve(__dirname, "lib/curry.ts"),
        either: resolve(__dirname, "lib/either.ts"),
        function: resolve(__dirname, "lib/function.ts"),
        functor: resolve(__dirname, "lib/functor.ts"),
        id: resolve(__dirname, "lib/id.ts"),
        list: resolve(__dirname, "lib/list.ts"),
        ["maybe-t"]: resolve(__dirname, "lib/maybe-t.ts"),
        maybe: resolve(__dirname, "lib/maybe.ts"),
        memo: resolve(__dirname, "lib/memo.ts"),
        ["monad-2"]: resolve(__dirname, "lib/monad-2.ts"),
        monad: resolve(__dirname, "lib/monad.ts"),
        ["pointed-2"]: resolve(__dirname, "lib/pointed-2.ts"),
        pointed: resolve(__dirname, "lib/pointed.ts"),
        profunctor: resolve(__dirname, "lib/profunctor.ts"),
        promise: resolve(__dirname, "lib/promise.ts"),
        URIS: resolve(__dirname, "lib/URIS.ts"),
        URIS2: resolve(__dirname, "lib/URIS2.ts"),
      },
      name: "fp",
      formats: ["es", "cjs"],
    },
    rollupOptions: { external: [] },
  },
  test: { watch: false },
});
