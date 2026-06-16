// Framework-agnostic, dependency-free type tester.
//
// Replaces the legacy jQuery/jQuery-UI/bigtext widget. Key differences:
//  - No eval, no innerHTML with user data — DOM is built with createElement and
//    textContent, styles via element.style (no string injection).
//  - Native, accessible controls: <input type=range>, <button aria-pressed>,
//    <select>, and checkbox-based feature toggles with a focus-managed panel.
//  - OpenType features compose (multiple active at once).
//  - Auto-fit via ResizeObserver (tracks container resizes) instead of bigtext.
//  - No global state; each instance owns its DOM, listeners and observers and is
//    fully torn down by destroy().

import { Fitter } from "./fit.js";
import { clamp, el, toNumber } from "./dom.js";
import {
	FEATURES,
	type FeatureDef,
	type FeatureTag,
	featureLabel,
	featureSettings,
	isKnownFeature,
} from "./opentype.js";
import type {
	Align,
	ControlsConfig,
	Range,
	TypeTesterOptions,
	TypeTesterState,
} from "./types.js";

/** Default slider ranges, overridable per control. */
const DEFAULT_RANGES = {
	size: { min: 8, max: 300, step: 1 },
	tracking: { min: -0.1, max: 0.5, step: 0.005 },
	weight: { min: 100, max: 900, step: 100 },
} as const;

const ALIGNS: readonly Align[] = ["left", "center", "right"];

/** Resolves a boolean|Range control config against a default range. */
function resolveRange(value: boolean | Range | undefined, fallback: Range): Range | null {
	if (!value) return null;
	if (value === true) return { ...fallback };
	return { min: value.min, max: value.max, step: value.step ?? fallback.step };
}

/** A type tester instance bound to a host element. */
export class TypeTester {
	private readonly host: HTMLElement;
	private readonly options: TypeTesterOptions;
	private readonly controls: ControlsConfig;
	private readonly state: TypeTesterState;
	private readonly activeFeatures = new Set<FeatureTag>();
	private readonly cleanups: Array<() => void> = [];

	private typeEl!: HTMLElement;
	private textEl!: HTMLElement;
	private liveEl!: HTMLElement;
	private sizeOutput: HTMLOutputElement | null = null;
	private fitter: Fitter | null = null;

	/**
	 * @param host Element to render the tester into.
	 * @param options Configuration; all fields optional.
	 */
	constructor(host: HTMLElement, options: TypeTesterOptions = {}) {
		this.host = host;
		this.options = options;
		this.controls = options.controls ?? {};

		const fit = options.size === "fit";
		for (const tag of options.features ?? []) {
			if (isKnownFeature(tag)) this.activeFeatures.add(tag);
		}
		this.state = {
			text: options.text ?? "",
			size: fit ? 0 : toNumber(options.size, 80),
			fit,
			tracking: toNumber(options.tracking, 0),
			weight: toNumber(options.weight, 400),
			italic: options.italic ?? false,
			align: options.align ?? "left",
			wrap: options.wrap ?? true,
			features: Array.from(this.activeFeatures),
		};

		this.render();
	}

	/** Returns a snapshot of the current state. */
	getState(): TypeTesterState {
		return { ...this.state, features: Array.from(this.activeFeatures) };
	}

	/** Removes all DOM, listeners and observers created by this instance. */
	destroy(): void {
		this.fitter?.destroy();
		this.fitter = null;
		for (const off of this.cleanups.splice(0)) off();
		this.host.replaceChildren();
	}

	// ---- rendering -------------------------------------------------------

	private render(): void {
		this.host.classList.add("tt");

		this.textEl = el("div", {
			class: "tt__text",
			text: this.state.text,
			attrs: {
				role: "textbox",
				"aria-label": this.options.ariaLabel ?? "Sample text",
				"aria-multiline": this.state.wrap,
				contenteditable: this.options.editable !== false ? "true" : null,
				spellcheck: "true",
				"data-placeholder": this.options.placeholder ?? "Type to test…",
			},
		});
		this.typeEl = el("div", { class: "tt__type", children: [this.textEl] });
		const stage = el("div", { class: "tt__stage", children: [this.typeEl] });

		this.liveEl = el("div", {
			class: "tt__sr-only",
			attrs: { "aria-live": "polite", "aria-atomic": "true" },
		});

		const controls = this.buildControls();
		const children: Node[] = [stage];
		if (controls) children.push(controls);
		children.push(this.liveEl);
		this.host.replaceChildren(...children);

		if (this.options.editable !== false) this.wireEditable();
		this.applyStyles();
		this.setupFit();
	}

	private buildControls(): HTMLElement | null {
		const items: Node[] = [];
		const sizeRange = resolveRange(this.controls.size, DEFAULT_RANGES.size);
		if (sizeRange && !this.state.fit) items.push(this.buildSize(sizeRange));
		const trackingRange = resolveRange(this.controls.tracking, DEFAULT_RANGES.tracking);
		if (trackingRange) items.push(this.buildTracking(trackingRange));
		const weightRange = resolveRange(
			this.controls.weight,
			this.options.variable?.wght ?? DEFAULT_RANGES.weight,
		);
		if (weightRange) items.push(this.buildWeight(weightRange));
		if (this.controls.italic) items.push(this.buildItalic());
		if (this.controls.align) items.push(this.buildAlign());
		if (this.controls.wrap) items.push(this.buildWrap());
		if (this.controls.features) items.push(this.buildFeatures());

		if (items.length === 0) return null;
		return el("div", {
			class: "tt__controls",
			attrs: { role: "group", "aria-label": "Typography controls" },
			children: items,
		});
	}

	// ---- generic control builders (no per-control copy-paste) -------------

	private buildSlider(
		key: "size" | "tracking" | "weight",
		label: string,
		range: Range,
		value: number,
		unit: string,
		onInput: (value: number) => void,
	): HTMLElement {
		const output = el("output", { class: "tt__value", text: `${value}${unit}` });
		const input = el("input", {
			class: `tt__slider tt__slider--${key}`,
			attrs: {
				type: "range",
				min: range.min,
				max: range.max,
				step: range.step ?? 1,
				value,
				"aria-label": label,
			},
		});
		const handler = () => {
			const v = Number(input.value);
			output.textContent = `${v}${unit}`;
			onInput(v);
			this.announce(`${label} ${v}${unit}`);
		};
		input.addEventListener("input", handler);
		this.cleanups.push(() => input.removeEventListener("input", handler));
		if (key === "size") this.sizeOutput = output;
		return el("label", {
			class: `tt__control tt__control--${key}`,
			children: [el("span", { class: "tt__label", text: label }), input, output],
		});
	}

	private buildSize(range: Range): HTMLElement {
		this.state.size = clamp(this.state.size, range.min, range.max);
		return this.buildSlider("size", "Size", range, this.state.size, "px", (v) => {
			this.state.size = v;
			this.applyStyles();
			this.emitChange();
		});
	}

	private buildTracking(range: Range): HTMLElement {
		this.state.tracking = clamp(this.state.tracking, range.min, range.max);
		return this.buildSlider(
			"tracking",
			"Tracking",
			range,
			this.state.tracking,
			"em",
			(v) => {
				this.state.tracking = v;
				this.applyStyles();
				this.emitChange();
			},
		);
	}

	private buildWeight(range: Range): HTMLElement {
		this.state.weight = clamp(this.state.weight, range.min, range.max);
		return this.buildSlider("weight", "Weight", range, this.state.weight, "", (v) => {
			this.state.weight = v;
			this.applyStyles();
			this.emitChange();
		});
	}

	private buildToggle(
		key: string,
		label: string,
		pressed: boolean,
		onToggle: (pressed: boolean) => void,
	): HTMLButtonElement {
		const button = el("button", {
			class: `tt__toggle tt__toggle--${key}`,
			text: label,
			// aria-pressed is a string-valued ARIA state and must always be present
			// ("false"), unlike boolean HTML attributes which are omitted when off.
			attrs: { type: "button", "aria-pressed": String(pressed) },
		});
		const handler = () => {
			const next = button.getAttribute("aria-pressed") !== "true";
			button.setAttribute("aria-pressed", String(next));
			onToggle(next);
			this.announce(`${label} ${next ? "on" : "off"}`);
		};
		button.addEventListener("click", handler);
		this.cleanups.push(() => button.removeEventListener("click", handler));
		return button;
	}

	private buildItalic(): HTMLElement {
		const button = this.buildToggle("italic", "Italic", this.state.italic, (on) => {
			this.state.italic = on;
			this.applyStyles();
			this.emitChange();
		});
		return el("div", { class: "tt__control", children: [button] });
	}

	private buildWrap(): HTMLElement {
		const button = this.buildToggle("wrap", "Wrap", this.state.wrap, (on) => {
			this.state.wrap = on;
			this.textEl.setAttribute("aria-multiline", String(on));
			this.applyStyles();
			this.emitChange();
		});
		return el("div", { class: "tt__control", children: [button] });
	}

	private buildAlign(): HTMLElement {
		const select = el("select", {
			class: "tt__select tt__select--align",
			attrs: { "aria-label": "Alignment" },
			children: ALIGNS.map((a) =>
				el("option", {
					text: a.charAt(0).toUpperCase() + a.slice(1),
					attrs: { value: a, selected: a === this.state.align },
				}),
			),
		});
		const handler = () => {
			const value = select.value as Align;
			if (ALIGNS.includes(value)) {
				this.state.align = value;
				this.applyStyles();
				this.emitChange();
				this.announce(`Alignment ${value}`);
			}
		};
		select.addEventListener("change", handler);
		this.cleanups.push(() => select.removeEventListener("change", handler));
		return el("label", {
			class: "tt__control tt__control--align",
			children: [el("span", { class: "tt__label", text: "Align" }), select],
		});
	}

	private buildFeatures(): HTMLElement {
		const offered: readonly FeatureDef[] = Array.isArray(this.controls.features)
			? this.controls.features.filter(isKnownFeature).map((tag) => ({
					tag,
					label: featureLabel(tag),
					group: "Alternates" as const,
				}))
			: FEATURES;

		const panelId = `tt-feat-${Math.round(performance.now())}-${offered.length}`;
		const toggle = el("button", {
			class: "tt__toggle tt__toggle--features",
			text: "Features",
			attrs: {
				type: "button",
				"aria-haspopup": "true",
				"aria-expanded": "false",
				"aria-controls": panelId,
			},
		});

		const checks = offered.map((f) => {
			const input = el("input", {
				attrs: { type: "checkbox", value: f.tag, checked: this.activeFeatures.has(f.tag) },
			});
			const onChange = () => this.toggleFeature(f.tag, input.checked);
			input.addEventListener("change", onChange);
			this.cleanups.push(() => input.removeEventListener("change", onChange));
			return el("label", {
				class: "tt__feature",
				children: [input, el("span", { text: f.label })],
			});
		});

		const panel = el("div", {
			class: "tt__panel",
			attrs: { id: panelId, role: "group", "aria-label": "OpenType features", hidden: true },
			children: checks,
		});

		const wrapper = el("div", {
			class: "tt__control tt__control--features",
			children: [toggle, panel],
		});

		const setOpen = (open: boolean) => {
			toggle.setAttribute("aria-expanded", String(open));
			panel.toggleAttribute("hidden", !open);
			if (open) {
				const first = panel.querySelector<HTMLInputElement>("input");
				first?.focus();
			}
		};
		const onToggleClick = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
				setOpen(false);
				toggle.focus();
			}
		};
		const onOutside = (e: MouseEvent) => {
			if (toggle.getAttribute("aria-expanded") !== "true") return;
			if (!wrapper.contains(e.target as Node)) setOpen(false);
		};
		toggle.addEventListener("click", onToggleClick);
		wrapper.addEventListener("keydown", onKeydown);
		document.addEventListener("click", onOutside);
		this.cleanups.push(() => {
			toggle.removeEventListener("click", onToggleClick);
			wrapper.removeEventListener("keydown", onKeydown);
			document.removeEventListener("click", onOutside);
		});

		return wrapper;
	}

	private toggleFeature(tag: FeatureTag, on: boolean): void {
		if (on) this.activeFeatures.add(tag);
		else this.activeFeatures.delete(tag);
		this.state.features = Array.from(this.activeFeatures);
		this.applyStyles();
		this.emitChange();
		this.announce(`${featureLabel(tag)} ${on ? "on" : "off"}`);
	}

	// ---- behaviour -------------------------------------------------------

	private wireEditable(): void {
		const handler = () => {
			this.state.text = this.textEl.textContent ?? "";
			if (this.state.fit) this.fitter?.schedule();
			this.emitChange();
		};
		this.textEl.addEventListener("input", handler);
		this.cleanups.push(() => this.textEl.removeEventListener("input", handler));
	}

	private setupFit(): void {
		if (!this.state.fit) return;
		const range = resolveRange(this.controls.size, DEFAULT_RANGES.size) ?? DEFAULT_RANGES.size;
		this.fitter = new Fitter(this.textEl, range.min, range.max);
		this.fitter.start((size) => {
			this.state.size = size;
			this.typeEl.style.fontSize = `${size}px`;
			if (this.sizeOutput) this.sizeOutput.textContent = `${size}px`;
		});
	}

	/** Applies the full typographic state to the type element via element.style. */
	private applyStyles(): void {
		const s = this.typeEl.style;
		const family = this.options.fontFamily
			? `"${this.options.fontFamily}"${this.options.fallback ? `, ${this.options.fallback}` : ", sans-serif"}`
			: (this.options.fallback ?? "sans-serif");
		s.fontFamily = family;
		if (!this.state.fit) s.fontSize = `${this.state.size}px`;
		s.letterSpacing = `${this.state.tracking}em`;
		s.fontStyle = this.state.italic ? "italic" : "normal";
		s.textAlign = this.state.align;
		this.textEl.style.whiteSpace = this.state.wrap ? "normal" : "nowrap";

		if (this.options.variable?.wght) {
			s.fontVariationSettings = `"wght" ${this.state.weight}`;
		}
		s.fontWeight = String(this.state.weight);

		const settings = featureSettings(this.activeFeatures);
		s.fontFeatureSettings = settings;
		// Older Safari needs the prefixed property; modern engines ignore it.
		s.setProperty("-webkit-font-feature-settings", settings);
	}

	private announce(message: string): void {
		this.liveEl.textContent = message;
	}

	private emitChange(): void {
		this.options.onChange?.(this.getState());
	}
}
