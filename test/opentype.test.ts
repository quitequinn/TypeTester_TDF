import { describe, expect, it } from "vitest";
import {
	FEATURES,
	featureLabel,
	featureSettings,
	isKnownFeature,
} from "../src/core/opentype.js";

describe("opentype registry", () => {
	it("has unique, unambiguous labels", () => {
		const labels = FEATURES.map((f) => f.label);
		expect(new Set(labels).size).toBe(labels.length);
	});

	it("exposes stylistic sets ss01–ss20", () => {
		for (let n = 1; n <= 20; n++) {
			const tag = `ss${String(n).padStart(2, "0")}`;
			expect(isKnownFeature(tag)).toBe(true);
		}
	});

	it("includes case, ordn and cpsp", () => {
		for (const tag of ["case", "ordn", "cpsp"]) {
			expect(isKnownFeature(tag)).toBe(true);
		}
	});

	it("labels nalt correctly (Alternate Annotation Forms)", () => {
		expect(featureLabel("nalt")).toBe("Alternate Annotation Forms");
	});

	it("distinguishes calt/clig and hlig/hist labels", () => {
		expect(featureLabel("calt")).not.toBe(featureLabel("clig"));
		expect(featureLabel("hlig")).not.toBe(featureLabel("hist"));
	});

	it("composes multiple features into one settings value", () => {
		expect(featureSettings(["smcp", "onum"])).toBe('"smcp" 1, "onum" 1');
	});

	it("returns normal for no active features", () => {
		expect(featureSettings([])).toBe("normal");
	});

	it("ignores unknown tags", () => {
		expect(featureSettings(["smcp", "zzzz"])).toBe('"smcp" 1');
	});
});
