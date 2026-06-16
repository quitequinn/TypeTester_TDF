import { describe, expect, it } from "vitest";
import { clamp, el, toNumber } from "../src/core/dom.js";

describe("dom utilities", () => {
	it("clamps into range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(99, 0, 10)).toBe(10);
	});

	it("toNumber handles edge cases", () => {
		expect(toNumber("42", 0)).toBe(42);
		expect(toNumber("", 7)).toBe(7);
		expect(toNumber(null, 7)).toBe(7);
		expect(toNumber(undefined, 7)).toBe(7);
		expect(toNumber("not-a-number", 7)).toBe(7);
		expect(toNumber(Number.POSITIVE_INFINITY, 7)).toBe(7);
		expect(toNumber(3.5, 0)).toBe(3.5);
	});

	it("el sets text via textContent, not HTML", () => {
		const node = el("div", { text: "<b>x</b>" });
		expect(node.querySelector("b")).toBeNull();
		expect(node.textContent).toBe("<b>x</b>");
	});

	it("el omits false/nullish attributes but keeps string values", () => {
		const node = el("button", {
			attrs: { hidden: false, title: null, "data-x": "1", disabled: true },
		});
		expect(node.hasAttribute("hidden")).toBe(false);
		expect(node.hasAttribute("title")).toBe(false);
		expect(node.getAttribute("data-x")).toBe("1");
		expect(node.hasAttribute("disabled")).toBe(true);
	});
});
