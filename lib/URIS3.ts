export interface URItoKind3<_R, _E, _A> {}

export type URIS3 = keyof URItoKind3<unknown, unknown, unknown>;

export type Kind3<F extends URIS3, R, E, A> = URItoKind3<R, E, A>[F];
