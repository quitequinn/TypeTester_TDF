// React wrapper around the framework-agnostic FontProof core. React is a peer
// dependency, externalised at build time, so the core stays dependency-free.

import { useEffect, useRef } from "react";
import { FontProof } from "../core/fontProof.js";
import type { FontProofOptions, FontProofState } from "../core/types.js";

/** Props for {@link FontProofComponent}. Mirrors {@link FontProofOptions}. */
export interface FontProofProps extends FontProofOptions {
	/** Class applied to the host element. */
	className?: string;
}

/**
 * Renders a {@link FontProof} into a host div. The instance is recreated when
 * any structural option changes and is always torn down on unmount.
 */
export function FontProofComponent(props: FontProofProps): JSX.Element {
	const { className, onChange, ...options } = props;
	const hostRef = useRef<HTMLDivElement>(null);
	// Keep the latest onChange without forcing a tester rebuild on each render.
	const onChangeRef = useRef<((state: FontProofState) => void) | undefined>(onChange);
	onChangeRef.current = onChange;

	// Serialise structural options so the effect only re-runs on real changes.
	const key = JSON.stringify(options);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const instance = new FontProof(host, {
			...options,
			onChange: (state) => onChangeRef.current?.(state),
		});
		return () => instance.destroy();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	return <div ref={hostRef} className={className} />;
}

export { FontProof } from "../core/fontProof.js";
export type {
	Align,
	AxisConfig,
	ControlsConfig,
	Range,
	Size,
	FontProofOptions,
	FontProofState,
	VariableConfig,
} from "../core/types.js";
export type { FeatureTag } from "../core/opentype.js";
