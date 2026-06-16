# Panel Review — Project Specialists

Saved: 2026-06-15

## Specialists
1. Font / Variable Font Engineer — detected: font-feature-settings usage, vendor-prefixed feature settings, weightselection axis-like UI
2. Glyph / Typography Engineer — detected: OpenType feature tag table (liga/dlig/smcp/c2sc/onum/frac/ss0x/swsh), type sizing
3. Browser Layout Engineer — detected: bigtext auto-fit, window.load/keyup re-fit, layout read-then-write hot paths
4. Deep Accessibility Specialist — detected: contenteditable editor, spellcheck=false, slider keyboard interaction, no ARIA

(Animation Engineer detected but excluded by user on 2026-06-15.)

## Known intentional patterns
- Compose-everything OpenType model: the tester intentionally lets logically
  mutually-exclusive features (e.g. lnum/onum, pnum/tnum) be active at once and
  leaves resolution to the browser/font. Not a bug.
- Auto-fit measures a single (nowrap) line even when wrap mode is on; it fits the
  unwrapped width. Intentional definition of "fit".
- When a variable `wght` axis is configured, both `font-variation-settings: "wght"`
  and `font-weight` are set — the latter is an intentional fallback for
  non-variable fonts.
- The React wrapper keys instance rebuilds on `JSON.stringify(options)` and reads
  `onChange` via a ref (so changing the callback does not rebuild). Intentional.
- `legacy/` holds the original v1 jQuery widget for reference; it is not the
  shipped module and should not be reviewed as product code.

## History
- 2026-06-15/16: Full panel review of legacy v1 → 36 issues (#2–#37). Rewrote as
  dependency-free npm module (v2) on branch `rewrite/npm-module`; all 36 issues
  closed as resolved-by-rewrite. Second panel pass fixed: ResizeObserver height
  feedback loop, restricted-features grouping, deterministic ids, document-level
  Escape, aria-multiline string value. 37 tests passing.
