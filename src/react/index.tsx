// React wrapper around the framework-agnostic TypeBar core. React is a peer
// dependency, externalised at build time, so the core stays dependency-free.

import { useEffect, useRef } from "react";
import { TypeBar } from "../core/typeBar.js";
import type { TypeBarOptions, TypeBarState } from "../core/types.js";

/** Props for {@link TypeBarComponent}. Mirrors {@link TypeBarOptions}. */
export interface TypeBarProps extends TypeBarOptions {
	/** Class applied to the host element. */
	className?: string;
}

/**
 * Renders a {@link TypeBar} into a host div. The instance is recreated when
 * any structural option changes and is always torn down on unmount.
 */
export function TypeBarComponent(props: TypeBarProps): JSX.Element {
	const { className, onChange, ...options } = props;
	const hostRef = useRef<HTMLDivElement>(null);
	// Keep the latest onChange without forcing a tester rebuild on each render.
	const onChangeRef = useRef<((state: TypeBarState) => void) | undefined>(onChange);
	onChangeRef.current = onChange;

	// Serialise structural options so the effect only re-runs on real changes.
	const key = JSON.stringify(options);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const instance = new TypeBar(host, {
			...options,
			onChange: (state) => onChangeRef.current?.(state),
		});
		return () => instance.destroy();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	return <div ref={hostRef} className={className} />;
}

export { TypeBar } from "../core/typeBar.js";
export type {
	Align,
	ControlsConfig,
	Range,
	Size,
	TypeBarOptions,
	TypeBarState,
	VariableConfig,
} from "../core/types.js";
export type { FeatureTag } from "../core/opentype.js";
