export type Identity<A> = (a: A) => A;

export const id = <A>(x: A): A => x;
