export const isEmpty = <T>(value: T): boolean => {
  if (typeof value === "string") return value.trim().length === 0;
  if (value instanceof Date) return isNaN(value.getTime());
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Object) return Object.keys(value).length === 0;
  return false;
};
