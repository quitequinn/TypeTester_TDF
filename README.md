# FontProof

[![npm](https://img.shields.io/npm/v/fontproof.svg)](https://www.npmjs.com/package/fontproof)
[![CI](https://github.com/quitequinn/fontproof/actions/workflows/ci.yml/badge.svg)](https://github.com/quitequinn/fontproof/actions/workflows/ci.yml)

**[▶ Live demo](https://quitequinn.github.io/fontproof/)**

A **micro toolbar** for testing type on the web — a compact bar of controls over a
live, editable sample. Accessible and **dependency-free**: adjust size, tracking,
weight, italic, alignment, line-wrap, and **composable OpenType features** live.
Ships a framework-agnostic vanilla core and an optional React component.

> Formerly published as `type-tester-tdf` (and briefly `typebar-tdf`); renamed to
> **FontProof** to reflect what it really is — a focused type-proofing toolbar: a
> compact bar of controls over a live sample.

> **v2 is a ground-up rewrite.** The legacy jQuery + jQuery UI + BigText widget
> (v1) is preserved at the [`v1.0.0`](https://github.com/quitequinn/fontproof/releases/tag/v1.0.0)
> git tag. v2 has **no runtime
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
npm install fontproof
```

Import the stylesheet once (optional — the component works without it):

```js
import "fontproof/styles.css";
```

## Vanilla JS

### Programmatic

```js
import { FontProof } from "fontproof";
import "fontproof/styles.css";

const tester = new FontProof(document.querySelector("#demo"), {
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
  data-fontproof
  data-font="Inter"
  data-size="96"
  data-text="Typography"
  data-controls="size,tracking,weight,italic,align,features"
></div>

<script type="module">
  import { autoInit } from "fontproof";
  import "fontproof/styles.css";
  autoInit(); // initialises every [data-fontproof] element
</script>
```

`autoInit()` is idempotent — already-initialised elements are skipped.

## React

```tsx
import { FontProofComponent } from "fontproof/react";
import "fontproof/styles.css";

export function Demo() {
  return (
    <FontProofComponent
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

`new FontProof(host, options)` / `<FontProofComponent {...options} />`:

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
| `showValues` | `boolean` | `false` | Show each control's value inline (e.g. `Size: 96px`). |
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
import { FEATURES, featureSettings } from "fontproof";

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

## Styling & themes

The controls render as a **slim, borderless segmented bar** under the sample. It
stays hidden until the tester is engaged — clicking the sample (or tabbing into
any control) reveals it via `:focus-within`, and it collapses again when focus
leaves. Each segment shows only its **title** by default; the control titles
`mix-blend-mode: difference` against the bar so they stay legible over the slider
fills. Set [`showValues`](#options) to also show the value (`Size: 96px`). Import
the stylesheet to get it:

```js
import "fontproof/styles.css";
```

The look is **monochrome by default** and driven by CSS variables on the host:

| Variable | Default | Purpose |
| --- | --- | --- |
| `--fp-accent` | `#000` | Focus rings, slider/checkbox accent |
| `--fp-bg` / `--fp-fg` | `#fff` / `#000` | Component background / text |
| `--fp-bar-bg` | `#fff` | Bar background |
| `--fp-bar-track` | `#e5e5e5` | Unfilled slider track |
| `--fp-bar-fill` | `#000` | Filled slider track / pressed toggle |
| `--fp-bar-h` | `26px` | Bar (segment) height |
| `--fp-bar-radius` | `6px` | Bar corner radius |
| `--fp-speed` | `0.18s` | Reveal transition |

Override any of them, e.g. `.fp { --fp-accent: #e11d48; }`.

A faithful **TDF green-on-black** preset ships built in — add `fp--tdf` to the host:

```js
new FontProof(el, { /* … */ });
el.classList.add("fp--tdf");
// React: <FontProofComponent className="fp--tdf" … />
```

## Migrating from v1

| v1 (jQuery attributes) | v2 |
| --- | --- |
| `class="typeTester"` | `data-fontproof` (or `new FontProof(el, …)`) |
| `font="Inter"` | `data-font="Inter"` / `fontFamily: "Inter"` |
| `size="90"` / `size=""` (fit) | `data-size="90"` / `data-size="fit"` |
| `weightoptions="true"` | `data-controls="weight"` / `controls: { weight: true }` |
| `optoptions="dlig,hlig"` | `data-features` / `controls: { features: [...] }` |
| magic words `"yup"`, `"nope"` | plain booleans / `"true"` / `"false"` |
| jQuery + jQuery UI + BigText | **no dependencies** |

The v1 source remains available at the [`v1.0.0`](https://github.com/quitequinn/fontproof/releases/tag/v1.0.0) git tag.

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
