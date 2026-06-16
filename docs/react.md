# React guide

React is an optional **peer dependency** (>=17). The `typebar/react`
entry wraps the dependency-free core in a component.

## Install

```bash
npm install typebar
# react / react-dom are peers you already have in a React app
```

```tsx
import { TypeBarComponent } from "typebar/react";
import "typebar/styles.css";
```

## Basic usage

```tsx
export function Demo() {
  return (
    <TypeBarComponent
      text="Typography"
      fontFamily="Inter"
      size={96}
      controls={{ size: true, tracking: true, weight: true, italic: true, features: true }}
    />
  );
}
```

`TypeBarComponent` accepts every [option](../README.md#options) as a prop,
plus `className` for the host element.

## Reading state

```tsx
import { useState } from "react";
import { TypeBarComponent } from "typebar/react";
import type { TypeBarState } from "typebar/react";

export function Demo() {
  const [state, setState] = useState<TypeBarState | null>(null);
  return (
    <>
      <TypeBarComponent fontFamily="Inter" size={72} controls={{ weight: true }} onChange={setState} />
      <pre>{state && JSON.stringify(state, null, 2)}</pre>
    </>
  );
}
```

`onChange` is read from a ref internally, so updating it does not rebuild the
tester. The instance is rebuilt only when a **structural** option changes
(serialised via the option object) and is always torn down on unmount via
`destroy()`.

## Variable fonts

```tsx
<TypeBarComponent
  fontFamily="Inter Variable"
  size={120}
  weight={400}
  variable={{ wght: { min: 100, max: 900, step: 1 } }}
  controls={{ weight: true }}
/>
```

The weight slider then drives `font-variation-settings: "wght" …` (and
`font-weight` as a fallback for non-variable fonts).

## TypeScript

All option and state types are exported from `typebar/react` and
`typebar`:

```ts
import type {
  TypeBarOptions,
  TypeBarState,
  ControlsConfig,
  FeatureTag,
} from "typebar";
```
