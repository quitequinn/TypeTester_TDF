import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Fitter } from "../src/core/fit.js";

let host: HTMLDivElement;
let target: HTMLDivElement;

beforeEach(() => {
	host = document.createElement("div");
	target = document.createElement("div");
	host.appendChild(target);
	document.body.appendChild(host);
});

afterEach(() => {
	host.remove();
});

describe("Fitter lifecycle", () => {
	// jsdom cannot lay out, so we verify the engine starts and tears down cleanly
	// rather than asserting a measured size (covered by the integration tests).
	it("starts and destroys without throwing or leaking a mirror", () => {
		const fitter = new Fitter(target, 10, 200);
		fitter.start(() => {});
		fitter.schedule();
		fitter.destroy();
		// No measurement mirror should remain attached to the document.
		expect(document.querySelector('span[aria-hidden="true"]')).toBeNull();
	});

	it("ignores fit calls after destroy", () => {
		const fitter = new Fitter(target, 10, 200);
		let calls = 0;
		fitter.start(() => calls++);
		fitter.destroy();
		fitter.schedule();
		expect(calls).toBe(0);
	});
});
