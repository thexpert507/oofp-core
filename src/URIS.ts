import { Maybe } from "./maybe.ts";

interface URItoKind<A> {
  Array: Array<A>;
  Promise: Promise<A>;
  Maybe: Maybe<A>;
}

export type URIS = keyof URItoKind<unknown>;

export type Kind<F extends URIS, A> = URItoKind<A>[F];
