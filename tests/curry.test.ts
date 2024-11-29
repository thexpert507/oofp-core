import { describe, it, expect } from "vitest";
import { curry, uncurry } from "../lib/curry";

describe("Curry and Uncurry Functions", () => {
  it("should curry a function", () => {
  const add = (a: number, b: number) => a + b;
  const curried = curry(add);
    expect(curried(1)(2)).toBe(3);
});

  it("should uncurry a function", () => {
  const add = (a: number) => (b: number) => a + b;
  const uncurried = uncurry(add);
    expect(uncurried(1, 2)).toBe(3);
  });

  it("should handle multiple arguments", () => {
    const multiply = (a: number, b: number, c: number) => a * b * c;
    const curried = curry(multiply);
    expect(curried(2)(3)(4)).toBe(24);
  });

  it("should handle uncurrying of multiple arguments", () => {
    const multiply = (a: number) => (b: number) => (c: number) => a * b * c;
    const uncurried = uncurry(multiply);
    expect(uncurried(2, 3, 4)).toBe(24);
  });

  it("should handle single argument functions", () => {
    const identity = (a: number) => a;
    const curried = curry(identity);
    expect(curried(5)).toBe(5);
  });

  it("should handle uncurrying of single argument functions", () => {
    const identity = (a: number) => a;
    const uncurried = uncurry(identity);
    expect(uncurried(5)).toBe(5);
  });

  it("should handle no arguments", () => {
    const noArgs = () => 42;
    const curried = curry(noArgs);
    expect(curried()).toBe(42);
  });

  it("should handle uncurrying of no arguments", () => {
    const noArgs = () => 42;
    const uncurried = uncurry(noArgs);
    expect(uncurried()).toBe(42);
  });
});
