import { Maybe } from "./maybe.ts";
import { Task } from "./task.ts";

export interface URItoKind<A> {
  Array: Array<A>;
  Promise: Promise<A>;
  Maybe: Maybe<A>;
  Task: Task<A>;
}

export type URIS = keyof URItoKind<unknown>;

export type Kind<F extends URIS, A> = URItoKind<A>[F];
