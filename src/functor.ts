export interface Functor<A = unknown, F = unknown> {
  map<B>(f: (a: A) => B): Functor<B, F>;
}
