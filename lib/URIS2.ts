import { Either } from "./either.ts";

export interface URItoKind2<A, B> {
  Either: Either<A, B>;
}

export type URIS2 = keyof URItoKind2<unknown, unknown>;

export type Kind2<F extends URIS2, A, B> = URItoKind2<A, B>[F];
