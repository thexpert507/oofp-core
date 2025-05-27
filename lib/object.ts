import { Fn } from "./function";

/**
 * Nota sobre el uso de bucles for:
 *
 * Aunque este es un módulo funcional, utilizamos bucles for en lugar de métodos como
 * .reduce(), .map(), etc. por las siguientes razones de optimización:
 *
 * 1. **Rendimiento**: Los bucles for son significativamente más rápidos que los métodos
 *    de array, especialmente para objetos grandes, ya que evitan la creación de arrays
 *    intermedios y múltiples invocaciones de funciones.
 *
 * 2. **Inmutabilidad preservada**: A pesar de usar bucles imperativos internamente,
 *    todas las funciones mantienen la inmutabilidad - nunca mutan los objetos de entrada.
 *
 * 3. **Early returns**: Los bucles permiten optimizaciones como early returns en
 *    funciones como `every`, `some`, y `find`, terminando tan pronto como se encuentra
 *    el resultado deseado.
 *
 * 4. **Menor overhead**: Evitamos el overhead de Object.entries() seguido de métodos
 *    de array, usando directamente nuestras funciones entries() tipadas.
 *
 * Esta es una optimización interna que no afecta la API funcional externa.
 */

export type Obj<K extends string = string, V = unknown> = Record<K, V>;

export const mapValues =
	<K extends string, V, R>(fn: (value: V) => R) =>
	(obj: Obj<K, V>): Obj<K, R> => {
		const result = {} as Obj<K, R>;
		for (const [key, value] of entries(obj)) {
			result[key] = fn(value);
		}
		return result;
	};

export const mapKeyValues =
	<K extends string, V, R>(fn: (key: K) => (value: V) => R) =>
	(obj: Obj<K, V>): Obj<K, R> => {
		const result = {} as Obj<K, R>;
		for (const [key, value] of entries(obj)) {
			result[key] = fn(key)(value);
		}
		return result;
	};

export const mapProperty =
	<K extends Obj, P extends keyof K, B>(property: P, fn: Fn<K[P], B>) =>
	(obj: K): Omit<K, P> & Record<P, B> => {
		return { ...obj, [property]: fn(obj[property]) };
	};

export const mapPropertywc =
	<K extends Obj, P extends keyof K, B>(property: P, fn: Fn<{ value: K[P]; ctx: K }, B>) =>
	(obj: K): Omit<K, P> & Record<P, B> => {
		return { ...obj, [property]: fn({ value: obj[property], ctx: obj }) };
	};

export const values = <K extends string, V>(obj: Obj<K, V>): V[] => Object.values(obj);

export const keys = <K extends string, V>(obj: Obj<K, V>): K[] => Object.keys(obj) as K[];

export const entries = <K extends string, V>(obj: Obj<K, V>): [K, V][] =>
	Object.entries(obj) as [K, V][];

export const fromEntries = <K extends string, V>(entries: [K, V][]): Obj<K, V> =>
	Object.fromEntries(entries) as Obj<K, V>;

// Filtrar propiedades de un objeto
export const filter =
	<K extends string, V>(predicate: (value: V, key: K) => boolean) =>
	(obj: Obj<K, V>): Partial<Obj<K, V>> => {
		const result = {} as Partial<Obj<K, V>>;
		for (const [key, value] of entries(obj)) {
			// Early continue si el predicado es falso
			if (!predicate(value, key)) continue;
			result[key] = value;
		}
		return result;
	};

// Recoger solo las propiedades especificadas
export const pick =
	<K extends string, V, P extends K>(keys: readonly P[]) =>
	(obj: Obj<K, V>): Pick<Obj<K, V>, P> => {
		const result = {} as Pick<Obj<K, V>, P>;
		for (const key of keys) {
			// Early continue si la propiedad no existe
			if (!(key in obj)) continue;
			result[key] = obj[key];
		}
		return result;
	};

// Omitir propiedades especificadas
export const omit =
	<K extends string, V, P extends K>(keys: readonly P[]) =>
	(obj: Obj<K, V>): Omit<Obj<K, V>, P> => {
		const keysSet = new Set(keys);
		const result = {} as Omit<Obj<K, V>, P>;
		for (const [key, value] of entries(obj)) {
			// Early continue si la clave debe ser omitida
			if (keysSet.has(key as P)) continue;
			(result as Record<string, V>)[key] = value;
		}
		return result;
	};

// Tamaño de un objeto (número de propiedades)
export const size = <K extends string, V>(obj: Obj<K, V>): number => keys(obj).length;

// Verificar si un objeto está vacío
export const isEmpty = <K extends string, V>(obj: Obj<K, V>): boolean => {
	// Early return para objetos vacíos - más eficiente que calcular size completo
	for (const _ in obj) {
		return false;
	}
	return true;
};

// Verificar si una clave existe en el objeto
export const has =
	<K extends string>(key: K) =>
	<V>(obj: Obj<K, V>): boolean =>
		key in obj;

// Obtener un valor con valor por defecto
export const get =
	<K extends string, V>(key: K, defaultValue: V) =>
	(obj: Obj<K, V>): V =>
		obj[key] ?? defaultValue;

// Fusionar dos objetos
export const merge =
	<K extends string, V>(obj2: Obj<K, V>) =>
	(obj1: Obj<K, V>): Obj<K, V> => ({ ...obj1, ...obj2 });

// Fusión profunda de objetos
export const deepMerge =
	<K extends string, V>(obj2: Obj<K, V>) =>
	(obj1: Obj<K, V>): Obj<K, V> => {
		const result = { ...obj1 };
		for (const [key, value] of Object.entries(obj2)) {
			if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value) &&
				typeof result[key as K] === "object" &&
				result[key as K] !== null &&
				!Array.isArray(result[key as K])
			) {
				result[key as K] = deepMerge(value as Obj<string, unknown>)(
					result[key as K] as Obj<string, unknown>,
				) as V;
			} else {
				result[key as K] = value as V;
			}
		}
		return result;
	};

// Mapear solo las claves
export const mapKeys =
	<K extends string, V, R extends string>(fn: (key: K) => R) =>
	(obj: Obj<K, V>): Obj<R, V> => {
		const result = {} as Obj<R, V>;
		for (const [key, value] of entries(obj)) {
			result[fn(key)] = value;
		}
		return result;
	};

// Reducir un objeto a un valor
export const reduce =
	<K extends string, V, R>(fn: (acc: R, value: V, key: K) => R, initial: R) =>
	(obj: Obj<K, V>): R => {
		let result = initial;
		for (const [key, value] of entries(obj)) {
			result = fn(result, value, key);
		}
		return result;
	};

// Invertir un objeto (intercambiar claves y valores)
export const invert = <K extends string, V extends string>(obj: Obj<K, V>): Obj<V, K> => {
	const result = {} as Obj<V, K>;
	for (const [key, value] of entries(obj)) {
		result[value] = key;
	}
	return result;
};

// Agrupar por una función de agrupación
export const groupBy =
	<V, G extends string>(fn: (value: V) => G) =>
	<K extends string>(obj: Obj<K, V>): Obj<G, V[]> => {
		const result = {} as Obj<G, V[]>;
		for (const [, value] of entries(obj)) {
			const group = fn(value);
			// Early assignment si el grupo no existe
			if (!result[group]) {
				result[group] = [];
			}
			result[group].push(value);
		}
		return result;
	};

// Verificar si todos los valores cumplen una condición
export const every =
	<K extends string, V>(predicate: (value: V, key: K) => boolean) =>
	(obj: Obj<K, V>): boolean => {
		for (const [key, value] of entries(obj)) {
			if (!predicate(value, key)) return false;
		}
		return true;
	};

// Verificar si algún valor cumple una condición
export const some =
	<K extends string, V>(predicate: (value: V, key: K) => boolean) =>
	(obj: Obj<K, V>): boolean => {
		for (const [key, value] of entries(obj)) {
			if (predicate(value, key)) return true;
		}
		return false;
	};

// Encontrar la primera entrada que cumple una condición
export const find =
	<K extends string, V>(predicate: (value: V, key: K) => boolean) =>
	(obj: Obj<K, V>): [K, V] | undefined => {
		for (const [key, value] of entries(obj)) {
			if (predicate(value, key)) return [key, value];
		}
		return undefined;
	};

// Crear un objeto a partir de un array usando una función de mapeo
export const fromArray =
	<T, K extends string, V>(keyFn: (item: T) => K, valueFn: (item: T) => V) =>
	(array: readonly T[]): Obj<K, V> => {
		const result = {} as Obj<K, V>;
		for (const item of array) {
			result[keyFn(item)] = valueFn(item);
		}
		return result;
	};
