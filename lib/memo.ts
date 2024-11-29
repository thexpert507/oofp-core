type Fn<A = unknown, B = unknown> = (a: A) => B;

export const memo = <A, B>(fn: Fn<A, B>): Fn<A, B> => {
  const cache = new Map<A, B>();
  return (arg: A): B => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};
