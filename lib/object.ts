export const mapValues =
  <K extends string, V, R>(fn: (value: V) => R) =>
  (obj: Record<K, V>): Record<K, R> =>
    Object.entries(obj).reduce((prev, [key, value]) => {
      const result = fn(value as V);
      return { ...prev, [key]: result };
    }, {} as Record<K, R>);

export const mapKeyValues =
  <K extends string, V, R>(fn: (key: K) => (value: V) => R) =>
  (obj: Record<K, V>): Record<K, R> =>
    (Object.entries(obj) as [K, V][]).reduce((prev, [key, value]) => {
      const result = fn(key)(value);
      return { ...prev, [key]: result };
    }, {} as Record<K, R>);

export const values = <K extends string, V>(obj: Record<K, V>): V[] => Object.values(obj);
export const keys = <K extends string, V>(obj: Record<K, V>): K[] => Object.keys(obj) as K[];
export const entries = <K extends string, V>(obj: Record<K, V>): [K, V][] =>
  Object.entries(obj) as [K, V][];
export const fromEntries = <K extends string, V>(entries: [K, V][]): Record<K, V> =>
  Object.fromEntries(entries) as Record<K, V>;
