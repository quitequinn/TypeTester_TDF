// React wrapper around the framework-agnostic TypeTester core. React is a peer
// dependency, externalised at build time, so the core stays dependency-free.

import { useEffect, useRef } from "react";
import { TypeTester } from "../core/typeTester.js";
import type { TypeTesterOptions, TypeTesterState } from "../core/types.js";

/** Props for {@link TypeTesterComponent}. Mirrors {@link TypeTesterOptions}. */
export interface TypeTesterProps extends TypeTesterOptions {
	/** Class applied to the host element. */
	className?: string;
}

/**
 * Renders a {@link TypeTester} into a host div. The instance is recreated when
 * any structural option changes and is always torn down on unmount.
 */
export function TypeTesterComponent(props: TypeTesterProps): JSX.Element {
	const { className, onChange, ...options } = props;
	const hostRef = useRef<HTMLDivElement>(null);
	// Keep the latest onChange without forcing a tester rebuild on each render.
	const onChangeRef = useRef<((state: TypeTesterState) => void) | undefined>(onChange);
	onChangeRef.current = onChange;

	// Serialise structural options so the effect only re-runs on real changes.
	const key = JSON.stringify(options);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const instance = new TypeTester(host, {
			...options,
			onChange: (state) => onChangeRef.current?.(state),
		});
		return () => instance.destroy();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	return <div ref={hostRef} className={className} />;
}

export { TypeTester } from "../core/typeTester.js";
export type {
	Align,
	ControlsConfig,
	Range,
	Size,
	TypeTesterOptions,
	TypeTesterState,
	VariableConfig,
} from "../core/types.js";
export type { FeatureTag } from "../core/opentype.js";
