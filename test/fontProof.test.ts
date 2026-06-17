import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FontProof } from "../src/core/fontProof.js";

let host: HTMLDivElement;

beforeEach(() => {
	host = document.createElement("div");
	document.body.appendChild(host);
});

afterEach(() => {
	host.remove();
});

describe("FontProof rendering", () => {
	it("builds an accessible editable text region", () => {
		new FontProof(host, { text: "Hello", editable: true, ariaLabel: "Sample" });
		const text = host.querySelector(".fp__text")!;
		expect(text.getAttribute("role")).toBe("textbox");
		expect(text.getAttribute("aria-label")).toBe("Sample");
		expect(text.getAttribute("contenteditable")).toBe("true");
		expect(text.textContent).toBe("Hello");
	});

	it("never injects user text as HTML", () => {
		new FontProof(host, { text: "<img src=x onerror=alert(1)>", editable: true });
		const text = host.querySelector(".fp__text")!;
		expect(text.querySelector("img")).toBeNull();
		expect(text.textContent).toContain("<img");
	});

	it("applies typographic state via inline styles", () => {
		new FontProof(host, {
			size: 64,
			weight: 700,
			italic: true,
			tracking: 0.1,
			align: "center",
			fontFamily: "Test Sans",
		});
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.fontSize).toBe("64px");
		expect(type.style.fontWeight).toBe("700");
		expect(type.style.fontStyle).toBe("italic");
		expect(type.style.letterSpacing).toBe("0.1em");
		expect(type.style.textAlign).toBe("center");
		expect(type.style.fontFamily).toContain("Test Sans");
	});

	it("renders only the requested controls", () => {
		new FontProof(host, {
			size: 40,
			controls: { size: true, weight: true },
		});
		expect(host.querySelector(".fp__slider--size")).not.toBeNull();
		expect(host.querySelector(".fp__slider--weight")).not.toBeNull();
		expect(host.querySelector(".fp__slider--tracking")).toBeNull();
		expect(host.querySelector(".fp__toggle--italic")).toBeNull();
	});
});

describe("FontProof controls", () => {
	it("updates size from the slider and fires onChange", () => {
		const onChange = vi.fn();
		new FontProof(host, { size: 40, controls: { size: true }, onChange });
		const slider = host.querySelector<HTMLInputElement>(".fp__slider--size")!;
		slider.value = "120";
		slider.dispatchEvent(new Event("input"));
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.fontSize).toBe("120px");
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls.at(-1)![0].size).toBe(120);
	});

	it("composes multiple OpenType features", () => {
		const tester = new FontProof(host, { controls: { features: true } });
		const boxes = host.querySelectorAll<HTMLInputElement>(".fp__feature input");
		const byTag = (tag: string) =>
			Array.from(boxes).find((b) => b.value === tag)!;
		const smcp = byTag("smcp");
		const onum = byTag("onum");
		smcp.checked = true;
		smcp.dispatchEvent(new Event("change"));
		onum.checked = true;
		onum.dispatchEvent(new Event("change"));
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.fontFeatureSettings).toBe('"smcp" 1, "onum" 1');
		expect(tester.getState().features).toEqual(["smcp", "onum"]);
	});

	it("toggles the features panel with aria-expanded", () => {
		new FontProof(host, { controls: { features: true } });
		const toggle = host.querySelector<HTMLButtonElement>(".fp__toggle--features")!;
		const panel = host.querySelector<HTMLElement>(".fp__panel")!;
		expect(panel.hasAttribute("hidden")).toBe(true);
		toggle.click();
		expect(toggle.getAttribute("aria-expanded")).toBe("true");
		expect(panel.hasAttribute("hidden")).toBe(false);
	});

	it("toggles italic via aria-pressed button", () => {
		new FontProof(host, { controls: { italic: true } });
		const button = host.querySelector<HTMLButtonElement>(".fp__toggle--italic")!;
		expect(button.getAttribute("aria-pressed")).toBe("false");
		button.click();
		expect(button.getAttribute("aria-pressed")).toBe("true");
		expect(host.querySelector<HTMLElement>(".fp__type")!.style.fontStyle).toBe("italic");
	});

	it("clamps out-of-range initial size to the slider range", () => {
		new FontProof(host, { size: 5000, controls: { size: { min: 10, max: 200 } } });
		const slider = host.querySelector<HTMLInputElement>(".fp__slider--size")!;
		expect(Number(slider.value)).toBe(200);
	});

	it("sets the --fp-fill track variable from the slider value", () => {
		new FontProof(host, { size: 100, controls: { size: { min: 0, max: 200 } } });
		const slider = host.querySelector<HTMLInputElement>(".fp__slider--size")!;
		expect(slider.style.getPropertyValue("--fp-fill")).toBe("50%");
		slider.value = "150";
		slider.dispatchEvent(new Event("input"));
		expect(slider.style.getPropertyValue("--fp-fill")).toBe("75%");
	});
});

describe("FontProof more controls", () => {
	it("updates tracking and weight from sliders", () => {
		new FontProof(host, { controls: { tracking: true, weight: true } });
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		const tracking = host.querySelector<HTMLInputElement>(".fp__slider--tracking")!;
		tracking.value = "0.2";
		tracking.dispatchEvent(new Event("input"));
		expect(type.style.letterSpacing).toBe("0.2em");
		const weight = host.querySelector<HTMLInputElement>(".fp__slider--weight")!;
		weight.value = "700";
		weight.dispatchEvent(new Event("input"));
		expect(type.style.fontWeight).toBe("700");
	});

	it("changes alignment via the select", () => {
		new FontProof(host, { controls: { align: true } });
		const select = host.querySelector<HTMLSelectElement>(".fp__select--align")!;
		select.value = "right";
		select.dispatchEvent(new Event("change"));
		expect(host.querySelector<HTMLElement>(".fp__type")!.style.textAlign).toBe("right");
	});

	it("wrap toggle updates white-space and aria-multiline", () => {
		new FontProof(host, { wrap: true, controls: { wrap: true } });
		const text = host.querySelector<HTMLElement>(".fp__text")!;
		expect(text.getAttribute("aria-multiline")).toBe("true");
		host.querySelector<HTMLButtonElement>(".fp__toggle--wrap")!.click();
		expect(text.getAttribute("aria-multiline")).toBe("false");
		expect(text.style.whiteSpace).toBe("nowrap");
	});

	it("drives weight via font-variation-settings when variable", () => {
		new FontProof(host, {
			weight: 500,
			variable: { wght: { min: 100, max: 900 } },
			controls: { weight: true },
		});
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.getPropertyValue("font-variation-settings")).toBe('"wght" 500');
	});

	it("restricted features keep their real group/label", () => {
		const tester = new FontProof(host, { controls: { features: ["liga", "onum"] } });
		const labels = Array.from(host.querySelectorAll(".fp__feature span")).map(
			(s) => s.textContent,
		);
		expect(labels).toContain("Standard Ligatures");
		expect(labels).toContain("Oldstyle Figures");
		tester.destroy();
	});

	it("emits a complete state payload", () => {
		let last: ReturnType<FontProof["getState"]> | null = null;
		new FontProof(host, {
			size: 40,
			controls: { size: true },
			onChange: (s) => (last = s),
		});
		const slider = host.querySelector<HTMLInputElement>(".fp__slider--size")!;
		slider.value = "50";
		slider.dispatchEvent(new Event("input"));
		expect(last).not.toBeNull();
		expect(Object.keys(last!).sort()).toEqual(
			[
				"align",
				"axes",
				"features",
				"fit",
				"italic",
				"palette",
				"size",
				"text",
				"tracking",
				"weight",
				"wrap",
			].sort(),
		);
	});
});

describe("FontProof variable axes", () => {
	it("renders a slider per configured non-wght axis and composes them", () => {
		const tester = new FontProof(host, {
			weight: 400,
			variable: { wght: { min: 100, max: 900 }, opsz: { min: 9, max: 144, default: 40 } },
			controls: { weight: true, axes: true },
		});
		const opsz = host.querySelector<HTMLInputElement>(".fp__slider--axis-opsz")!;
		expect(opsz).not.toBeNull();
		expect(tester.getState().axes.opsz).toBe(40);
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.getPropertyValue("font-variation-settings")).toBe('"wght" 400, "opsz" 40');
		opsz.value = "100";
		opsz.dispatchEvent(new Event("input"));
		expect(type.style.getPropertyValue("font-variation-settings")).toBe('"wght" 400, "opsz" 100');
		expect(type.style.getPropertyValue("font-optical-sizing")).toBe("none");
	});

	it("restricts axis sliders with controls.axes array", () => {
		new FontProof(host, {
			variable: { slnt: { min: -10, max: 0 }, GRAD: { min: -200, max: 150 } },
			controls: { axes: ["slnt"] },
		});
		expect(host.querySelector(".fp__slider--axis-slnt")).not.toBeNull();
		expect(host.querySelector(".fp__slider--axis-GRAD")).toBeNull();
	});
});

describe("FontProof colour fonts & synthesis", () => {
	it("sets font-palette and updates it from the palette control", () => {
		const tester = new FontProof(host, {
			palette: "light",
			controls: { palette: ["normal", "light", "dark", "--brand"] },
		});
		const type = host.querySelector<HTMLElement>(".fp__type")!;
		expect(type.style.getPropertyValue("font-palette")).toBe("light");
		const select = host.querySelector<HTMLSelectElement>(".fp__select--palette")!;
		select.value = "--brand";
		select.dispatchEvent(new Event("change"));
		expect(type.style.getPropertyValue("font-palette")).toBe("--brand");
		expect(tester.getState().palette).toBe("--brand");
	});

	it("disables font-synthesis when synthesis is false", () => {
		new FontProof(host, { synthesis: false });
		expect(host.querySelector<HTMLElement>(".fp__type")!.style.getPropertyValue("font-synthesis")).toBe(
			"none",
		);
	});
});

describe("FontProof features panel behaviour", () => {
	it("closes on Escape and restores focus to the toggle", () => {
		new FontProof(host, { controls: { features: true } });
		const toggle = host.querySelector<HTMLButtonElement>(".fp__toggle--features")!;
		const panel = host.querySelector<HTMLElement>(".fp__panel")!;
		toggle.click();
		expect(panel.hasAttribute("hidden")).toBe(false);
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(panel.hasAttribute("hidden")).toBe(true);
		expect(toggle.getAttribute("aria-expanded")).toBe("false");
	});

	it("closes on outside click", () => {
		new FontProof(host, { controls: { features: true } });
		const toggle = host.querySelector<HTMLButtonElement>(".fp__toggle--features")!;
		const panel = host.querySelector<HTMLElement>(".fp__panel")!;
		toggle.click();
		expect(panel.hasAttribute("hidden")).toBe(false);
		document.body.click();
		expect(panel.hasAttribute("hidden")).toBe(true);
	});
});

describe("FontProof captions & values", () => {
	it("renders the title in a caption for each control", () => {
		new FontProof(host, { controls: { size: true, align: true, italic: true } });
		expect(host.querySelector(".fp__control--size .fp__caption .fp__label")?.textContent).toBe(
			"Size",
		);
		expect(host.querySelector(".fp__control--align .fp__label")?.textContent).toBe("Align");
		expect(host.querySelector(".fp__toggle--italic .fp__label")?.textContent).toBe("Italic");
	});

	it("hides values by default and exposes them with showValues", () => {
		new FontProof(host, { controls: { size: true } });
		expect(host.classList.contains("fp--show-values")).toBe(false);

		const other = document.createElement("div");
		document.body.appendChild(other);
		new FontProof(other, { showValues: true, controls: { size: true } });
		expect(other.classList.contains("fp--show-values")).toBe(true);
		other.remove();
	});

	it("updates the align value as the selection changes", () => {
		new FontProof(host, { align: "left", controls: { align: true } });
		const value = host.querySelector<HTMLElement>(".fp__control--align .fp__value")!;
		expect(value.textContent).toBe("left");
		const select = host.querySelector<HTMLSelectElement>(".fp__select--align")!;
		select.value = "center";
		select.dispatchEvent(new Event("change"));
		expect(value.textContent).toBe("center");
	});
});

describe("FontProof teardown", () => {
	it("removes all DOM on destroy", () => {
		const tester = new FontProof(host, { controls: { size: true }, size: 40 });
		expect(host.children.length).toBeGreaterThan(0);
		tester.destroy();
		expect(host.children.length).toBe(0);
	});

	it("removes document-level listeners on destroy", () => {
		const tester = new FontProof(host, { controls: { features: true } });
		tester.destroy();
		// After destroy the outside-click/Escape listeners must be gone: dispatching
		// must not throw and there is no panel left to toggle.
		document.body.click();
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(host.querySelector(".fp__panel")).toBeNull();
	});
});
