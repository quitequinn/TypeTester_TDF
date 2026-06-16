import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypeTester } from "../src/core/typeTester.js";

let host: HTMLDivElement;

beforeEach(() => {
	host = document.createElement("div");
	document.body.appendChild(host);
});

afterEach(() => {
	host.remove();
});

describe("TypeTester rendering", () => {
	it("builds an accessible editable text region", () => {
		new TypeTester(host, { text: "Hello", editable: true, ariaLabel: "Sample" });
		const text = host.querySelector(".tt__text")!;
		expect(text.getAttribute("role")).toBe("textbox");
		expect(text.getAttribute("aria-label")).toBe("Sample");
		expect(text.getAttribute("contenteditable")).toBe("true");
		expect(text.textContent).toBe("Hello");
	});

	it("never injects user text as HTML", () => {
		new TypeTester(host, { text: "<img src=x onerror=alert(1)>", editable: true });
		const text = host.querySelector(".tt__text")!;
		expect(text.querySelector("img")).toBeNull();
		expect(text.textContent).toContain("<img");
	});

	it("applies typographic state via inline styles", () => {
		new TypeTester(host, {
			size: 64,
			weight: 700,
			italic: true,
			tracking: 0.1,
			align: "center",
			fontFamily: "Test Sans",
		});
		const type = host.querySelector<HTMLElement>(".tt__type")!;
		expect(type.style.fontSize).toBe("64px");
		expect(type.style.fontWeight).toBe("700");
		expect(type.style.fontStyle).toBe("italic");
		expect(type.style.letterSpacing).toBe("0.1em");
		expect(type.style.textAlign).toBe("center");
		expect(type.style.fontFamily).toContain("Test Sans");
	});

	it("renders only the requested controls", () => {
		new TypeTester(host, {
			size: 40,
			controls: { size: true, weight: true },
		});
		expect(host.querySelector(".tt__slider--size")).not.toBeNull();
		expect(host.querySelector(".tt__slider--weight")).not.toBeNull();
		expect(host.querySelector(".tt__slider--tracking")).toBeNull();
		expect(host.querySelector(".tt__toggle--italic")).toBeNull();
	});
});

describe("TypeTester controls", () => {
	it("updates size from the slider and fires onChange", () => {
		const onChange = vi.fn();
		new TypeTester(host, { size: 40, controls: { size: true }, onChange });
		const slider = host.querySelector<HTMLInputElement>(".tt__slider--size")!;
		slider.value = "120";
		slider.dispatchEvent(new Event("input"));
		const type = host.querySelector<HTMLElement>(".tt__type")!;
		expect(type.style.fontSize).toBe("120px");
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls.at(-1)![0].size).toBe(120);
	});

	it("composes multiple OpenType features", () => {
		const tester = new TypeTester(host, { controls: { features: true } });
		const boxes = host.querySelectorAll<HTMLInputElement>(".tt__feature input");
		const byTag = (tag: string) =>
			Array.from(boxes).find((b) => b.value === tag)!;
		const smcp = byTag("smcp");
		const onum = byTag("onum");
		smcp.checked = true;
		smcp.dispatchEvent(new Event("change"));
		onum.checked = true;
		onum.dispatchEvent(new Event("change"));
		const type = host.querySelector<HTMLElement>(".tt__type")!;
		expect(type.style.fontFeatureSettings).toBe('"smcp" 1, "onum" 1');
		expect(tester.getState().features).toEqual(["smcp", "onum"]);
	});

	it("toggles the features panel with aria-expanded", () => {
		new TypeTester(host, { controls: { features: true } });
		const toggle = host.querySelector<HTMLButtonElement>(".tt__toggle--features")!;
		const panel = host.querySelector<HTMLElement>(".tt__panel")!;
		expect(panel.hasAttribute("hidden")).toBe(true);
		toggle.click();
		expect(toggle.getAttribute("aria-expanded")).toBe("true");
		expect(panel.hasAttribute("hidden")).toBe(false);
	});

	it("toggles italic via aria-pressed button", () => {
		new TypeTester(host, { controls: { italic: true } });
		const button = host.querySelector<HTMLButtonElement>(".tt__toggle--italic")!;
		expect(button.getAttribute("aria-pressed")).toBe("false");
		button.click();
		expect(button.getAttribute("aria-pressed")).toBe("true");
		expect(host.querySelector<HTMLElement>(".tt__type")!.style.fontStyle).toBe("italic");
	});

	it("clamps out-of-range initial size to the slider range", () => {
		new TypeTester(host, { size: 5000, controls: { size: { min: 10, max: 200 } } });
		const slider = host.querySelector<HTMLInputElement>(".tt__slider--size")!;
		expect(Number(slider.value)).toBe(200);
	});
});

describe("TypeTester teardown", () => {
	it("removes all DOM on destroy", () => {
		const tester = new TypeTester(host, { controls: { size: true }, size: 40 });
		expect(host.children.length).toBeGreaterThan(0);
		tester.destroy();
		expect(host.children.length).toBe(0);
	});
});
