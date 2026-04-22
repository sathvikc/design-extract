# Changelog

## [10.3.0] — 2026-04-22

**Perf + SEO.** designlang now doubles as a lightweight auditor.

### Added

- **`src/extractors/perf.js`** — `captureCoreWebVitals(url)` opens a fresh Playwright context, measures LCP / CLS / INP via PerformanceObserver, categorises every network response into JS / CSS / font / image / document / other, counts third-party requests against a known-host list, and synthesises an interaction so INP reports. Returns grade buckets (good / needs-improvement / poor) per vital.
- **`src/extractors/seo.js`** — pure extractor for Open Graph, Twitter cards, canonical, manifest, theme-color, viewport, every favicon, and inline JSON-LD blocks (schema.org structured data).
- Crawler now captures `favicons`, `manifest`, and `<script type="application/ld+json">` content.
- New flag `--perf`. Auto-on with `--full`.
- New outputs: `*-seo.json`, `*-perf.json`.

## [10.2.0] — 2026-04-22

**Dark mode pairing + responsive screenshots.** Joins the light & dark extractor passes into semantic pairs, and adds full-page captures at 4 breakpoints × (light, dark).

### Added

- **`src/extractors/dark-mode-pair.js`** — pure function that maps light ↔ dark pairs for primary/secondary/accent/background/text roles and every CSS variable that actually differs between themes. Emits a drop-in Tailwind `darkMode: 'class'` config plus an audit (tokens missing from either pass).
- **`src/extractors/responsive-screenshots.js`** — full-page PNGs at mobile / tablet / desktop / wide × (light, dark). Writes to `screenshots/responsive/<breakpoint>-<scheme>.png` with an index.
- New flag `--responsive-shots`. Auto-on with `--full`.
- New outputs: `*-dark-mode.json`, `*-responsive.json`.

### Changed

- CLI version test now reads from `package.json` instead of a hardcoded string — no per-release test churn going forward.

## [10.1.0] — 2026-04-22

**Component screenshots.** The existing `--screenshots` flag now emits cluster-aware, retina (2×), multi-variant PNGs instead of five hardcoded selectors and a full-page image.

### Added

- **`src/extractors/component-screenshots.js`** — queries the live DOM with the same candidate selector the crawler uses, groups matches by `kind + variantHint + sizeHint`, and captures up to three representatives per group. Falls back to the v9 hardcoded list when no clusters produced anything (auth / docs pages).
- Retina capture via a dedicated Playwright context at `deviceScaleFactor: 2`.
- **`*-screenshots.json`** — index file mapping every cropped PNG to its cluster name, variant, bounds, and fallback flag.
- Markdown formatter gains a **Component Screenshots** section listing the first 20 crops.

### Behaviour

- No new CLI flags. `--screenshots` and `--full` continue to opt into capture.
- Backward compatible — when no clusters match, the v9 hardcoded selector set still fires.

### Tests

297 → **299** passing.

## [10.0.0] — 2026-04-22

**The Intent Release.** v9 captured *how* a site looks; v10 captures *what it is* — the semantic layer LLM agents need to rebuild a site faithfully, not just restyle a generic scaffold. Six new extractors, a multi-page crawl orchestrator, an optional smart-classifier LLM fallback, and a ready-to-paste prompt pack. 297/297 tests passing.

### Added — extraction

- **Page Intent classifier** (`src/extractors/page-intent.js`) — labels the crawled URL as `landing` / `pricing` / `docs` / `blog` / `blog-post` / `product` / `about` / `dashboard` / `auth` / `legal`, with URL + title + meta + DOM-shape signals, a confidence score, and ranked alternates.
- **Section Roles** (`src/extractors/section-roles.js`) — annotates every semantic region with a role (`hero`, `feature-grid`, `logo-wall`, `stats`, `testimonial`, `pricing-table`, `faq`, `steps`, `comparison`, `gallery`, `bento`, `cta`, `footer`), extracts slot copy (headings, lede, CTA counts), and emits reading order.
- **Material Language** (`src/extractors/material-language.js`) — classifies the visual vocabulary (`glassmorphism` / `neumorphism` / `flat` / `brutalist` / `skeuomorphic` / `material-you` / `soft-ui` / `mixed`) from shadow complexity, backdrop-filter usage, saturation, and geometry.
- **Imagery Style** (`src/extractors/imagery-style.js`) — fingerprints the imagery (`photography` / `3d-render` / `isometric` / `flat-illustration` / `gradient-mesh` / `icon-only` / `screenshot` / `mixed`), plus dominant aspect ratio and image-radius profile.
- **Component Library detector** (`src/extractors/component-library.js`) — identifies shadcn/ui, Radix, Headless UI, MUI, Chakra, Mantine, Ant Design, Bootstrap, HeroUI/NextUI, Tailwind UI, Vuetify, or plain Tailwind, with evidence and alternates.
- **Logo extractor** (`src/extractors/logo.js`) — pulls the site's logo (SVG source or `<img>` bytes) and samples clearspace; writes `*-logo.svg` or `.png` plus `*-logo.json`.

### Added — orchestration

- **Multi-page crawl** (`src/multipage.js`) — `--full` or `--pages <n>` auto-discovers canonical pages from nav (pricing/docs/blog/about/product), runs the full extractor pipeline on each, and emits a cross-page consistency report with shared tokens, per-page uniques, and pairwise Jaccard scores.
- **Smart classifier fallback** (`src/classifiers/smart.js`) — opt-in `--smart` flag routes low-confidence classifications through the OpenAI or Anthropic API (via `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`). Gracefully no-ops when no key is set. Zero-dep — uses global `fetch`.

### Added — LLM-native outputs

- **Prompt pack** (`src/formatters/prompt-pack.js`) — writes a `*-prompts/` directory with `v0.txt`, `lovable.txt`, `cursor.md`, `claude-artifacts.md`, and atomic `recipe-<component>.md` cards. Tokens, section order, voice, and library guidance are all inlined so one paste is enough.
- **Markdown sections** (`src/formatters/markdown.js`) — adds Page Intent, Section Roles, Material Language, Imagery Style, Component Library, and (when `--full`) Multi-Page Map sections to `*-design-language.md`.

### Added — output files

- `*-intent.json` — page-type + section-role map
- `*-visual-dna.json` — material language + imagery style
- `*-library.json` — component library detection + evidence
- `*-logo.svg` | `*-logo.png` + `*-logo.json` (with `--full`)
- `*-multipage.json` — per-page design languages + consistency (with `--full` / `--pages`)
- `*-prompts/` — prompt pack directory

### New CLI flags

- `--smart` — enable optional LLM refinement for low-confidence classifiers
- `--pages <n>` — explicitly crawl N canonical pages
- `--no-prompts` — skip the prompt-pack directory

### Tests

- `tests/v10-features.test.js` — 15 new subtests covering page intent, section roles, component library, material language, imagery style, multi-page discovery, cross-page consistency, and prompt pack. Full suite: 297 passing.

## [9.0.0] — 2026-04-21

**The Motion & Voice release.** Six new capabilities that push designlang past "extract the paint" and into "extract the *feel*, the *anatomy*, and the *voice*." No competing tool does any of these. All work ships with tests (282/282 passing).

### Added — extraction

- **Motion language extractor** (`src/extractors/motion.js`) — easings are classified into families (`ease-in`, `ease-in-out`, `ease-out`, `linear`, `steps`, `spring`, `custom`) via cubic-bezier geometry, durations are bucketed into a named scale (`instant`/`xs`/`sm`/`md`/`lg`/`xl`/`xxl`), spring/overshoot cubic-beziers are surfaced, scroll-linked animation usage is detected via `animation-timeline` / `view-timeline-name` / `scroll-timeline-name`, and each `@keyframes` rule is classified by kind (`slide-x`, `slide-y`, `fade`, `reveal`, `rotate`, `scale`, `pulse`, `custom`). A one-word `feel` fingerprint (`springy`/`responsive`/`smooth`/`mechanical`/`mixed`) summarizes the whole system.
- **Motion tokens formatter** (`src/formatters/motion-tokens.js`) — emits `*-motion-tokens.json` in a DTCG-flavored shape with `$type: duration` / `$type: cubicBezier`.
- **Component Anatomy v2** (`src/extractors/component-anatomy.js`) — groups components by variant-class hints, infers slot roles (icon / label / badge / heading / media / footer), builds a variant × size × state matrix, captures sample button labels, and emits typed React stubs via `formatAnatomyStubs`. Output: `*-anatomy.tsx`.
- **Brand voice extractor** (`src/extractors/voice.js`) — classifies tone (friendly / formal / technical / playful / neutral) from lexical markers, picks pronoun posture (`we→you`, `you-only`, `we-only`, `third-person`), detects heading style, top CTA verbs, and microcopy patterns. Output: `*-voice.json`.
- **Crawler extensions** (`src/crawler.js`) — per-element `animation-timeline`, view/scroll timeline names; per-candidate `text`, `slots[]`, `disabled`, `variantHint`, `sizeHint` to feed anatomy + voice.

### Added — new commands

- **`designlang lint <file>`** — audits DTCG / flat-JSON / CSS-vars token files for color sprawl, spacing-scale drift, radius/shadow bloat, and WCAG AA fg/bg contrast. Exits non-zero on `error`-level findings. CI-ready.
- **`designlang drift <url> --tokens <file>`** — compares local tokens against a live site, reports `in-sync` / `minor-drift` / `notable-drift` / `major-drift` with a drift ratio. `--fail-on <level>` controls CI exit code.
- **`designlang visual-diff <before> <after>`** — single-file HTML side-by-side report with embedded base64 screenshots, file-size deltas, and a changed-color-tokens table.

### Added — markdown output

Three new sections in `*-design-language.md`: **Motion Language**, **Component Anatomy**, **Brand Voice**.

### Changed

- Default extraction now writes **11+ files** (up from 8): `*-motion-tokens.json`, `*-anatomy.tsx` (when candidates exist), `*-voice.json`.
- `bin/design-extract.js` version → `9.0.0`.
- `package.json` — description refreshed; new keywords: `motion`, `animation`, `component-anatomy`, `brand-voice`, `token-lint`, `visual-diff`.
- README: "What's New in v9" hero block, new feature sections 24-29, new CLI entries (`lint`, `drift`, `visual-diff`).

### Tests

- New `tests/v9-features.test.js` — 7 suites, 21 assertions across motion, anatomy, voice, and lint.
- Full suite: **282/282 passing**.

## [8.0.0] — 2026-04-20

A credibility-and-distribution release. Three reliability bugs that hurt trust on real sites are fixed; three DX flags close the most-requested CLI gaps; five new surfaces (VS Code, Raycast, Figma, GitHub Actions, MCP registry) ship alongside.

### Reliability

- **Brand / primary color detection rewritten** — the extractor now ranks chromatic clusters by `interactiveBg × 100 + saturation × 2 + log(usage)` and requires either HSL saturation > 25 or an interactive-bg hit to qualify as chromatic. Previously the extractor picked the most-counted color, which on neutral-heavy sites like Linear meant the "Primary" was a pale gray (`#d0d6e0`). v8 correctly picks Linear's lime CTA (`#e4f222`) and Stripe's purple (`#533afd`). `src/extractors/colors.js`.
- **Accessibility scoring defused** — the crawler now emits a `hasText` boolean per element (a direct text-node child with visible characters), and the WCAG extractor filters out decorative glyph wrappers, transparent/overlay pairs, and non-text containers. Linear's WCAG score moved from 25% (171 failing pairs) to 83% (1 failing pair). `src/extractors/accessibility.js`, `src/crawler.js`.
- **Design-system score recalibrated** — thresholds for color count, shadow count, border-radii count, typography weight, and type-scale size were re-fit against ground-truth sites (Stripe, Linear, Vercel, GitHub, Apple). `cssHealth` is now weighted in the overall (8/100). Linear 47→76, Stripe 81→88, Apple 83→86, Vercel 64→76. `src/extractors/scoring.js`.

### Added

- **`--selector <css>`** — scopes extraction to a DOM subtree (e.g. `designlang https://stripe.com --selector "footer"`). Stripe full-page extraction drops from 2,409 elements to 112 when scoped to the footer. Falls back to the full document if the selector is invalid or empty.
- **`--system-chrome`** — forces Playwright to use the locally installed Chrome (`channel: 'chrome'`) instead of the ~150 MB bundled Chromium, for faster `npx` first-runs in environments that already have Chrome.
- **`--json` output mode** — full extraction payload written to stdout (suppresses progress UI) for piping into other tools. This was a partial implementation in v7; v8 makes it first-class and adds it to the CLI reference.
- **VS Code extension** (`vscode-extension/`) — `designlang: Extract design from URL` and `designlang: Extract and inject into workspace` commands.
- **Raycast extension** (`raycast-extension/`) — Extract, Score, and "Copy CLI command for URL" commands.
- **Figma plugin** (`figma-plugin/`) — URL or paste-JSON → Figma Variables collections (MV for Figma's `figma.variables` API, with multi-mode support).
- **GitHub Action** (`github-action/`) — "Design regression guard": runs `designlang` on a URL, diffs tokens vs a committed baseline, and comments the delta on the pull request. Optional `fail-on-change`.
- **Smithery + MCP registry** (`smithery.yaml`, `smithery.dockerfile`, `docs/MCP-REGISTRY.md`) — one-command install in Smithery; checklist for the official MCP registry, Cursor, and Claude Desktop.
- **Chrome Web Store + Firefox + Edge listing prep** (`chrome-extension/PRIVACY.md`, `chrome-extension/STORE_LISTING.md`) — privacy policy and store copy.
- **README hero demo tape** (`docs/demo.tape`) — VHS script that renders an animated terminal GIF into `website/public/demo.gif`.
- **Launch kit** (`docs/LAUNCH.md`) — Product Hunt / Show HN / Twitter copy + day-of checklist.

### Changed

- README: hero image now references the animated demo (with static PNG fallback), adds an "Install everywhere" table covering all surfaces, documents `--selector`, `--system-chrome`, and `--json`.
- `.npmignore`: excludes all companion-surface directories (`vscode-extension/`, `raycast-extension/`, `figma-plugin/`, `github-action/`, `chrome-extension/`, `website/`) and test fixtures so the npm tarball stays small — each surface publishes to its own registry.
- `bin/design-extract.js`: reports `8.0.0` from `--version`.
- `src/config.js`: whitelists `selector` and `systemChrome` from CLI/config.

### Thanks

- To everyone who flagged that Linear's primary was coming out as light gray — that single complaint drove the brand-color rewrite.

## [7.2.0] — 2026-04-19

### Added

- **Modern CSS surfacing (Tier 1a)** — crawler now captures pseudo-elements, variable-font axes (`font-variation-settings`), `@container` queries, and `env()` usage. Surfaced on `design.modernCss`. (#33)
- **Wide-gamut color + CSS source attribution (Tier 1b)** — `oklch()`, `oklab()`, `color-mix()`, `light-dark()`, Display P3, and Rec2020 references are collected on `design.wideGamut`. A new `design.tokenSources` maps each extracted token to the stylesheet URL it first appeared in. (#34)
- **Auto-interact pass (Tier 2)** — new `--deep-interact` flag (implied by `--full`) runs an interaction pass before extraction: full-page scroll in 4 steps, menu/dropdown opens, hover snapshots for the first batch of buttons/links with computed-style diffs, accordion clicks, and first-match modal trigger. Results populate `design.interactionStates` (hover deltas, menu/modal snapshots). Every step is wrapped in try/catch with per-step timeouts so interaction failures never kill the crawl.
- **Multi-page token reconciliation (Tier 2)** — when `--depth >= 1` the extractor now emits three new artifacts alongside the merged baseline: `*-tokens-shared.json` (tokens shared across every route), `*-tokens-routes/<slug>.json` (per-route `added` and `changed` deltas), and `*-routes-report.md` (readable summary). Slugs are derived from the route path (`/` → `index`) with automatic collision handling.

### Changed

- `--full` now also enables `--deep-interact`.
- `--depth <n>` description updated to mention the new reconciliation outputs.

## [7.1.0] — 2026-04-19

### Added

- **Cookie file support** — `--cookie-file <path>` loads cookies from a JSON array, a Playwright `storageState.json`, or a Netscape `cookies.txt` (browser extensions, curl exports). The new loader lives in `src/utils-cookies.js` and merges cleanly with the existing `--cookie name=value` flag.
- **`--insecure`** — ignores HTTPS/SSL certificate errors. Useful for self-signed dev servers, internal staging environments behind corporate proxies, and local extraction through MITM tools. Passes `ignoreHTTPSErrors: true` to the Playwright context plus the matching Chromium launch flags.
- **`--user-agent <ua>`** — override the browser User-Agent string for extraction.
- **Chrome extension** — `chrome-extension/` ships a Manifest v3 popup that hands the current tab off to [designlang.manavaryasingh.com](https://designlang.manavaryasingh.com) with the URL prefilled. Also emits a "Copy CLI" button that drops `npx designlang <url>` into the clipboard. Developer-mode install for now; Chrome Web Store listing pending.
- **Website URL query parameter** — the extractor input on the hosted site now honours `?url=<encoded>` so the Chrome extension (and any deep link) can prefill.
- **CONTRIBUTING**: "Good first issues" and "Credits" sections.

### Thanks

- A developer from China opened a conversation proposing cookie-file handling, SSL bypass, and a Chrome packaging story — this release ships all three.

## [7.0.0] — 2026-04-18

### Breaking

- **Design token JSON format** — the default `*-design-tokens.json` now follows the W3C Design Tokens Community Group (DTCG) v1 spec: every leaf is `{ "$value": ..., "$type": ... }`, with two layers (`primitive.*` and `semantic.*`) and composite tokens for typography, shadow, border, and gradient. If a downstream consumer expects the pre-v7 flat shape, pass `--tokens-legacy` to preserve it.

  Before (v6):
  ```json
  { "color": { "primary": "#3b82f6" }, "fontFamily": { "sans": "Inter" } }
  ```

  After (v7, default):
  ```json
  {
    "$metadata": { "generator": "designlang", "version": "7.0.0" },
    "primitive": { "color": { "brand": { "primary": { "$value": "#3b82f6", "$type": "color" } } } },
    "semantic":  { "color": { "action": { "primary": { "$value": "{primitive.color.brand.primary}", "$type": "color" } } } }
  }
  ```

  Migration: either (a) update consumers to read the DTCG shape (recommended — long-term stable, ecosystem-compatible), or (b) add `--tokens-legacy` to the CLI invocation.

### Added

- **MCP server** — new `designlang mcp --output-dir <dir>` subcommand. Stdio JSON-RPC. Resources: `designlang://tokens/primitive`, `designlang://tokens/semantic`, `designlang://regions`, `designlang://components`, `designlang://health`. Tools: `search_tokens`, `find_nearest_color`, `get_region`, `get_component`, `list_failing_contrast_pairs`.
- **Agent rules emitter** — `--emit-agent-rules` writes `.cursor/rules/designlang.mdc`, `.claude/skills/designlang/SKILL.md`, `CLAUDE.md.fragment`, and `agents.md`. All four template from the resolved semantic tokens.
- **Multi-platform emitters** — `--platforms <csv>` (values `web`, `ios`, `android`, `flutter`, `wordpress`, `all`). Additive to default web output. Emits iOS SwiftUI, Android Compose + XML, Flutter Dart + ThemeData, and a full WordPress block-theme skeleton (`theme.json` v3, `style.css`, `functions.php`, `index.php`, `templates/index.html`).
- **Stack + Tailwind fingerprint** — framework detection, Tailwind utility-class frequency map, analytics stack inventory. Surfaced on `design.stack`.
- **CSS health audit** — specificity distribution, `!important` count, duplicate declarations, unused CSS via Playwright Coverage API, `@keyframes` catalog, vendor-prefix audit. Surfaced on `design.cssHealth` and added as an additive `cssHealth` dimension in the design score.
- **A11y remediation** — for every failing WCAG contrast pair, suggests the nearest palette color that passes AA (4.5:1 / 3:1) or AAA (7:1 / 4.5:1). Surfaced on `design.accessibility.remediation`.
- **Semantic regions** — classifies page sections into `nav`, `hero`, `features`, `pricing`, `testimonials`, `cta`, `footer`, `sidebar`, `content`. Surfaced on `design.regions`.
- **Reusable component detection** — DOM subtree structural hash + cosine-similarity style vector clustering with variant detection. Surfaced on `design.componentClusters` and rendered in the markdown output.
- **MCP companion file** — `*-mcp.json` written at extract time so later `designlang mcp` invocations can serve regions / components / health / remediation from disk, not just memory.

### Dependencies

- Added `@modelcontextprotocol/sdk` (runtime).

### Tests

- 241/241 passing (baseline 186 + 55 new tests).
