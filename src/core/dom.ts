// Minimal, safe DOM construction helpers. All text is set via textContent and
// all attributes via setAttribute, so untrusted values can never be interpreted
// as HTML or script (no innerHTML, no eval).

/** Properties accepted by {@link el}. */
export interface ElProps {
	/** Space-separated class names. */
	class?: string;
	/** Text content (set via textContent — never parsed as HTML). */
	text?: string;
	/** Attributes to set via setAttribute. Nullish values are skipped. */
	attrs?: Record<string, string | number | boolean | null | undefined>;
	/** Child nodes to append. */
	children?: Node[];
}

/**
 * Creates an element of the given tag with safe text/attribute/children
 * assignment. Returns the typed element.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	props: ElProps = {},
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	if (props.class) node.className = props.class;
	if (props.text != null) node.textContent = props.text;
	if (props.attrs) {
		for (const [name, value] of Object.entries(props.attrs)) {
			if (value == null || value === false) continue;
			node.setAttribute(name, value === true ? "" : String(value));
		}
	}
	if (props.children) {
		for (const child of props.children) node.appendChild(child);
	}
	return node;
}

/** Clamps a number into the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Parses a numeric attribute/string, returning the fallback when the value is
 * missing or not a finite number. Prevents NaN leaking into the UI.
 */
export function toNumber(value: unknown, fallback: number): number {
	if (value == null || value === "") return fallback;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : fallback;
}
