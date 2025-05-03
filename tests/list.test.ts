import { describe, it, expect } from "vitest";
import * as L from "../lib/list";

describe("List Functor", () => {
	it("Is equals function", () => {
		const a1 = [1, 2, 3];
		const a2 = [1, 2, 3];

		expect(L.equals(a1)(a2)).toBe(true);
	});
});
