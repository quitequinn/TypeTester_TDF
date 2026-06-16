import { afterEach, describe, expect, it } from "vitest";
import { autoInit, createFromElement } from "../src/index.js";

afterEach(() => {
	document.body.replaceChildren();
});

describe("dataset auto-init", () => {
	it("parses data-* attributes into options", () => {
		const host = document.createElement("div");
		host.setAttribute("data-type-tester", "");
		host.dataset.font = "Inter";
		host.dataset.size = "48";
		host.dataset.weight = "600";
		host.dataset.align = "center";
		host.dataset.features = "smcp, onum";
		host.dataset.controls = "size,weight,features";
		document.body.appendChild(host);

		const tester = createFromElement(host);
		const state = tester.getState();
		expect(state.size).toBe(48);
		expect(state.weight).toBe(600);
		expect(state.align).toBe("center");
		expect(state.features).toEqual(["smcp", "onum"]);
		expect(host.querySelector(".tt__slider--size")).not.toBeNull();
		expect(host.querySelector(".tt__slider--weight")).not.toBeNull();
		expect(host.querySelector(".tt__control--features")).not.toBeNull();
	});

	it("auto-inits all marked elements once (idempotent)", () => {
		document.body.innerHTML = `
			<div data-type-tester data-size="40"></div>
			<div data-type-tester data-size="60"></div>
		`;
		expect(autoInit().length).toBe(2);
		// Second pass should find nothing new.
		expect(autoInit().length).toBe(0);
	});

	it("initialises only within the given subtree", () => {
		const outside = document.createElement("div");
		outside.setAttribute("data-type-tester", "");
		document.body.appendChild(outside);
		const container = document.createElement("section");
		const inside = document.createElement("div");
		inside.setAttribute("data-type-tester", "");
		container.appendChild(inside);
		document.body.appendChild(container);

		expect(autoInit(container).length).toBe(1);
		expect(inside.dataset.ttReady).toBe("true");
		expect(outside.dataset.ttReady).toBeUndefined();
	});

	it("supports auto-fit mode without throwing", () => {
		const host = document.createElement("div");
		host.setAttribute("data-type-tester", "");
		host.dataset.size = "fit";
		document.body.appendChild(host);
		const tester = createFromElement(host);
		expect(tester.getState().fit).toBe(true);
	});
});
