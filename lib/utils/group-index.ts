export const groupBy =
  <T>(fn: (item: T) => string | number) =>
  (iterable: Iterable<T>) => {
    return [...iterable].reduce<Record<string, T[]>>((groups, curr) => {
      const key = fn(curr);
      const group = groups[key] ?? [];
      group.push(curr);
      return { ...groups, [key]: group };
    }, {});
  };

export const indexBy =
  <T>(fn: (item: T) => string | number) =>
  (iterable: Iterable<T>) => {
    return [...iterable].reduce<Record<string, T>>((groups, curr) => {
      const key = fn(curr);
      return { ...groups, [key]: curr };
    }, {});
  };
