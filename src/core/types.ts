// Public option and state types for the FontProof core.

import type { FeatureTag } from "./opentype.js";

/** Text alignment values supported by the tester. */
export type Align = "left" | "center" | "right";

/** Size can be a fixed pixel value or "fit" to auto-fit the container width. */
export type Size = number | "fit";

/** Numeric range with optional step, used to configure slider controls. */
export interface Range {
	/** Minimum value (inclusive). */
	min: number;
	/** Maximum value (inclusive). */
	max: number;
	/** Step granularity. Defaults are control-specific. */
	step?: number;
}

/**
 * Which interactive controls to render, and optional range overrides. A boolean
 * toggles a control on/off with default ranges; an object enables it with a
 * custom range.
 */
export interface ControlsConfig {
	/** Font-size slider (px). Default range 8–300. */
	size?: boolean | Range;
	/** Letter-spacing slider (em). Default range -0.1–0.5. */
	tracking?: boolean | Range;
	/** Font-weight slider. Default range 100–900 step 100 (or the variable axis). */
	weight?: boolean | Range;
	/** Italic toggle button. */
	italic?: boolean;
	/** Alignment control. */
	align?: boolean;
	/** Line-wrap toggle button. */
	wrap?: boolean;
	/**
	 * OpenType feature controls. `true` exposes the full default feature list;
	 * an array restricts the offered features to the given tags.
	 */
	features?: boolean | FeatureTag[];
}

/** Optional variable-font axis configuration. */
export interface VariableConfig {
	/** `wght` axis range; when set, weight is driven via font-variation-settings. */
	wght?: Range;
}

/** Options accepted by {@link FontProof}. All fields are optional. */
export interface FontProofOptions {
	/** Initial sample text. */
	text?: string;
	/** Primary font-family name to test. */
	fontFamily?: string;
	/** Fallback font stack appended after the tested family. */
	fallback?: string;
	/** Initial size in px, or "fit" for auto-fit. */
	size?: Size;
	/** Initial letter-spacing in em. */
	tracking?: number;
	/** Initial font weight. */
	weight?: number;
	/** Initial italic state. */
	italic?: boolean;
	/** Initial alignment. */
	align?: Align;
	/** Whether text wraps (multi-line) or stays on a single line. */
	wrap?: boolean;
	/** Initially active OpenType feature tags. */
	features?: FeatureTag[];
	/** Whether the sample text is user-editable. */
	editable?: boolean;
	/** Placeholder shown when the editable area is empty. */
	placeholder?: string;
	/** Which controls to render. Omit to show none (display-only). */
	controls?: ControlsConfig;
	/** Variable-font axis configuration. */
	variable?: VariableConfig;
	/** Accessible label for the editable region. */
	ariaLabel?: string;
	/** Called whenever the typographic state changes. */
	onChange?: (state: FontProofState) => void;
}

/** The live typographic state of a tester instance. */
export interface FontProofState {
	/** Current text content. */
	text: string;
	/** Resolved size in px (the fitted size when in "fit" mode). */
	size: number;
	/** Whether the tester is auto-fitting. */
	fit: boolean;
	/** Letter-spacing in em. */
	tracking: number;
	/** Font weight. */
	weight: number;
	/** Italic state. */
	italic: boolean;
	/** Alignment. */
	align: Align;
	/** Whether text wraps. */
	wrap: boolean;
	/** Active OpenType feature tags. */
	features: FeatureTag[];
}
