# React guide

React is an optional **peer dependency** (>=17). The `type-tester-tdf/react`
entry wraps the dependency-free core in a component.

## Install

```bash
npm install type-tester-tdf
# react / react-dom are peers you already have in a React app
```

```tsx
import { TypeTesterComponent } from "type-tester-tdf/react";
import "type-tester-tdf/styles.css";
```

## Basic usage

```tsx
export function Demo() {
  return (
    <TypeTesterComponent
      text="Typography"
      fontFamily="Inter"
      size={96}
      controls={{ size: true, tracking: true, weight: true, italic: true, features: true }}
    />
  );
}
```

`TypeTesterComponent` accepts every [option](../README.md#options) as a prop,
plus `className` for the host element.

## Reading state

```tsx
import { useState } from "react";
import { TypeTesterComponent } from "type-tester-tdf/react";
import type { TypeTesterState } from "type-tester-tdf/react";

export function Demo() {
  const [state, setState] = useState<TypeTesterState | null>(null);
  return (
    <>
      <TypeTesterComponent fontFamily="Inter" size={72} controls={{ weight: true }} onChange={setState} />
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
<TypeTesterComponent
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

All option and state types are exported from `type-tester-tdf/react` and
`type-tester-tdf`:

```ts
import type {
  TypeTesterOptions,
  TypeTesterState,
  ControlsConfig,
  FeatureTag,
} from "type-tester-tdf";
```
