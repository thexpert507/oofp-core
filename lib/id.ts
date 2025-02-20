export type Identity<A> = (a: A) => A;

export const id =
  <A>(): Identity<A> =>
  (x: A): A =>
    x;
