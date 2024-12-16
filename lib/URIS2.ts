export interface URItoKind2<E, A> {}

export type URIS2 = keyof URItoKind2<unknown, unknown>;

export type Kind2<F extends URIS2, E, A> = URItoKind2<E, A>[F];
