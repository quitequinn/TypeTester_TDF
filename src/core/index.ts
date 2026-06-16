// Public surface of the framework-agnostic core.

export { TypeBar } from "./typeBar.js";
export {
	FEATURES,
	FEATURE_BY_TAG,
	featureLabel,
	featureSettings,
	isKnownFeature,
} from "./opentype.js";
export type { FeatureDef, FeatureGroup, FeatureTag } from "./opentype.js";
export type {
	Align,
	ControlsConfig,
	Range,
	Size,
	TypeBarOptions,
	TypeBarState,
	VariableConfig,
} from "./types.js";
