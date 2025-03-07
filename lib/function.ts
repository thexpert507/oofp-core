export type Fn<A = unknown, B = unknown> = (a: A) => B;
export type Fn2<A = unknown, B = unknown, C = unknown> = (a: A) => (b: B) => C;
export type Fn3<A = unknown, B = unknown, C = unknown, D = unknown> = (
  a: A
) => (b: B) => (c: C) => D;

export type Predicate<T = unknown> = Fn<T, boolean>;
