# Type Tester TDF

[![npm](https://img.shields.io/npm/v/type-tester-tdf.svg)](https://www.npmjs.com/package/type-tester-tdf)

An accessible, **dependency-free** type tester for the web. Type a sample, then
adjust size, tracking, weight, italic, alignment, line-wrap, and **composable
OpenType features** live. Ships a framework-agnostic vanilla core and an optional
React component.

> **v2 is a ground-up rewrite.** The legacy jQuery + jQuery UI + BigText widget
> (v1) is preserved under [`legacy/`](./legacy). v2 has **no runtime
> dependencies**, builds accessible native controls, escapes all input (no
> `eval`, no `innerHTML`), composes multiple OpenType features at once, and
> auto-fits with `ResizeObserver`. See [Migrating from v1](#migrating-from-v1).

- [Install](#install)
- [Vanilla JS](#vanilla-js) · full guide in [docs/vanilla.md](./docs/vanilla.md)
- [React](#react) · full guide in [docs/react.md](./docs/react.md)
- [Options](#options)
- [Controls](#controls)
- [OpenType features](#opentype-features)
- [Accessibility](#accessibility)
- [Migrating from v1](#migrating-from-v1)
- [Development](#development)

## Install

```bash
npm install type-tester-tdf
```

Import the stylesheet once (optional — the component works without it):

```js
import "type-tester-tdf/styles.css";
```

## Vanilla JS

### Programmatic

```js
import { TypeTester } from "type-tester-tdf";
import "type-tester-tdf/styles.css";

const tester = new TypeTester(document.querySelector("#demo"), {
  text: "Typography",
  fontFamily: "Inter",
  size: 96,
  controls: { size: true, tracking: true, weight: true, italic: true, features: true },
});

// later…
tester.destroy();
```

### Declarative (`data-*` auto-init)

```html
<div
  data-type-tester
  data-font="Inter"
  data-size="96"
  data-text="Typography"
  data-controls="size,tracking,weight,italic,align,features"
></div>

<script type="module">
  import { autoInit } from "type-tester-tdf";
  import "type-tester-tdf/styles.css";
  autoInit(); // initialises every [data-type-tester] element
</script>
```

`autoInit()` is idempotent — already-initialised elements are skipped.

## React

```tsx
import { TypeTesterComponent } from "type-tester-tdf/react";
import "type-tester-tdf/styles.css";

export function Demo() {
  return (
    <TypeTesterComponent
      text="Typography"
      fontFamily="Inter"
      size={96}
      controls={{ size: true, weight: true, features: true }}
      onChange={(state) => console.log(state)}
    />
  );
}
```

React is a **peer dependency** (>=17); the core stays dependency-free.

## Options

`new TypeTester(host, options)` / `<TypeTesterComponent {...options} />`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `""` | Initial sample text. |
| `fontFamily` | `string` | — | Primary family to test. |
| `fallback` | `string` | `"sans-serif"` | Fallback stack appended after the family. |
| `size` | `number \| "fit"` | `80` | Px size, or `"fit"` to auto-fit the container. |
| `tracking` | `number` | `0` | Letter-spacing in em. |
| `weight` | `number` | `400` | Font weight (or variable `wght` axis). |
| `italic` | `boolean` | `false` | Italic state. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment. |
| `wrap` | `boolean` | `true` | Multi-line wrap vs single line. |
| `features` | `string[]` | `[]` | Initially active OpenType feature tags. |
| `editable` | `boolean` | `true` | Whether the sample is user-editable. |
| `placeholder` | `string` | `"Type to test…"` | Empty-state placeholder (CSS, not real text). |
| `controls` | `ControlsConfig` | `{}` | Which controls to render (see below). |
| `variable` | `{ wght?: { min, max, step? } }` | — | Drive weight via `font-variation-settings`. |
| `ariaLabel` | `string` | `"Sample text"` | Accessible name for the editable region. |
| `onChange` | `(state) => void` | — | Called on every state change. |

## Controls

`controls` selects which interactive controls appear. A `true` value uses the
default range; an object overrides it:

```js
controls: {
  size: { min: 12, max: 240, step: 1 }, // or `true`
  tracking: true,                       // em slider
  weight: true,                         // 100–900, or the variable axis
  italic: true,                         // aria-pressed toggle button
  align: true,                          // native <select>
  wrap: true,                           // single-line toggle
  features: true,                       // full OpenType list (or string[] subset)
}
```

Default ranges: size `8–300px`, tracking `-0.1–0.5em`, weight `100–900` step 100.

## OpenType features

Unlike v1 (one feature at a time), **features compose**: selecting Small Caps
and Oldstyle Figures yields `font-feature-settings: "smcp" 1, "onum" 1`.

```js
import { FEATURES, featureSettings } from "type-tester-tdf";

featureSettings(["smcp", "onum"]); // => '"smcp" 1, "onum" 1'
```

Supported tags include ligatures (`liga`, `dlig`, `hlig`, `clig`), case (`smcp`,
`c2sc`, `case`, `cpsp`), figures (`lnum`, `onum`, `pnum`, `tnum`, `zero`, `ordn`),
fractions (`frac`, `afrc`), alternates (`swsh`, `calt`, `salt`, `hist`, `nalt`),
position (`sups`, `subs`), and stylistic sets `ss01`–`ss20`. Restrict the offered
set with `controls: { features: ["smcp", "onum", "ss01"] }`.

## Accessibility

- Native `<input type="range">`, `<button aria-pressed>`, `<select>`, and
  checkbox feature toggles — full keyboard support out of the box.
- Editable region is a labelled `role="textbox"` with `aria-multiline`; the
  placeholder is CSS-only, so screen readers never read stale text.
- The features panel manages focus, closes on `Escape` / outside click, and
  exposes `aria-expanded` / `aria-haspopup`.
- State changes are announced via a polite live region.
- Toggle states use weight + colour (not colour alone); animations respect
  `prefers-reduced-motion`.

## Migrating from v1

| v1 (jQuery attributes) | v2 |
| --- | --- |
| `class="typeTester"` | `data-type-tester` (or `new TypeTester(el, …)`) |
| `font="Inter"` | `data-font="Inter"` / `fontFamily: "Inter"` |
| `size="90"` / `size=""` (fit) | `data-size="90"` / `data-size="fit"` |
| `weightoptions="true"` | `data-controls="weight"` / `controls: { weight: true }` |
| `optoptions="dlig,hlig"` | `data-features` / `controls: { features: [...] }` |
| magic words `"yup"`, `"nope"` | plain booleans / `"true"` / `"false"` |
| jQuery + jQuery UI + BigText | **no dependencies** |

The v1 source remains in [`legacy/`](./legacy) for reference.

## Development

```bash
npm install
npm run build      # bundle ESM + CJS + types (tsup)
npm test           # vitest + jsdom
npm run typecheck  # tsc --noEmit
npm run dev        # watch build
```

## License

ISC © Quinn Keaveney. Originally built for [The Designers Foundry](https://www.thedesignersfoundry.com/).
