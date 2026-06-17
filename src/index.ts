// Main entry: re-exports the core plus a vanilla, declarative auto-initialiser
// that reads `data-*` attributes — the modern replacement for the legacy
// attribute-driven `.fontProof` markup (without eval or magic-word strings).

import { FontProof } from "./core/fontProof.js";
import { isKnownFeature, type FeatureTag } from "./core/opentype.js";
import type { Align, ControlsConfig, Size, FontProofOptions } from "./core/types.js";

export * from "./core/index.js";

/** Parses a comma/space list, e.g. data-features="smcp,onum". */
function parseList(value: string | null): string[] {
	if (!value) return [];
	return value
		.split(/[\s,]+/)
		.map((s) => s.trim())
		.filter(Boolean);
}

/** Parses the data-controls list into a ControlsConfig. */
function parseControls(value: string | null): ControlsConfig {
	const keys = parseList(value);
	const config: ControlsConfig = {};
	for (const key of keys) {
		if (key === "size") config.size = true;
		else if (key === "tracking") config.tracking = true;
		else if (key === "weight") config.weight = true;
		else if (key === "italic") config.italic = true;
		else if (key === "align") config.align = true;
		else if (key === "wrap") config.wrap = true;
		else if (key === "features") config.features = true;
	}
	return config;
}

/** Builds options from a host element's dataset. */
function optionsFromDataset(host: HTMLElement): FontProofOptions {
	const d = host.dataset;
	const sizeAttr = d.size;
	let size: Size | undefined;
	if (sizeAttr === "fit") size = "fit";
	else if (sizeAttr != null && sizeAttr !== "") size = Number(sizeAttr);

	const align = d.align as Align | undefined;
	const features = parseList(d.features ?? null).filter((t): t is FeatureTag =>
		isKnownFeature(t),
	);

	return {
		text: d.text ?? host.textContent?.trim() ?? "",
		fontFamily: d.font,
		fallback: d.fallback,
		size,
		tracking: d.tracking != null ? Number(d.tracking) : undefined,
		weight: d.weight != null ? Number(d.weight) : undefined,
		italic: d.italic != null ? d.italic !== "false" : undefined,
		align: align && ["left", "center", "right"].includes(align) ? align : undefined,
		wrap: d.wrap != null ? d.wrap !== "false" : undefined,
		features: features.length ? features : undefined,
		editable: d.editable !== "false",
		placeholder: d.placeholder,
		ariaLabel: d.ariaLabel,
		showValues: d.showValues != null ? d.showValues !== "false" : undefined,
		controls: parseControls(d.controls ?? null),
	};
}

/**
 * Initialises a single host element as a tester from its `data-*` attributes.
 */
export function createFromElement(host: HTMLElement): FontProof {
	return new FontProof(host, optionsFromDataset(host));
}

/**
 * Finds and initialises every `[data-fontproof]` element within `root`
 * (default: document). Returns the created instances. Idempotent: elements
 * already initialised (marked with `data-tt-ready`) are skipped.
 */
export function autoInit(root: ParentNode = document): FontProof[] {
	const hosts = Array.from(
		root.querySelectorAll<HTMLElement>("[data-fontproof]"),
	).filter((host) => host.dataset.fontproofReady !== "true");
	return hosts.map((host) => {
		host.dataset.fontproofReady = "true";
		return createFromElement(host);
	});
}
