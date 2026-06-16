import { defineConfig } from "tsup";

// Build the dependency-free core/vanilla entry and the optional React entry.
// React is externalised so consumers supply their own copy via peerDependencies.
export default defineConfig({
	entry: {
		index: "src/index.ts",
		react: "src/react/index.tsx",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	treeshake: true,
	sourcemap: true,
	target: "es2020",
	external: ["react", "react-dom", "react/jsx-runtime"],
	// Ship the stylesheet verbatim alongside the bundles.
	onSuccess: "cp src/styles.css dist/styles.css",
});
