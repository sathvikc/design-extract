# designlang — competitive plan (May 2026)

> Snapshot taken after the v12.12.0 website launch. Current state:
> ~2.6k GitHub stars, MIT, free, no signup, npm-published.

---

## State of play

The space has split into 4 lanes:

| Lane                       | Players                                | What they sell                                |
| -------------------------- | -------------------------------------- | --------------------------------------------- |
| URL → tokens (open source) | **designlang**, **dembrandt**, design-extractor.com | Extract a design system from any live site   |
| Token sync (paid SaaS)     | Tokens Studio, Supernova, ~~Specify~~  | Round-trip Figma ↔ code, enterprise governance |
| AI UI generators           | v0, Subframe, Builder.io, Lovable      | Prompt → working app, not "your" brand        |
| CSS analytics              | Project Wallace                        | Audit, complexity, dead-rule reports           |

**Specify shut down** in 2025 — confirms the pure-token-sync SaaS lane is unmonetisable. designlang's free/OSS positioning is on the right side of that trend.

---

## Where designlang already leads

1. **Output breadth** — DTCG + Tailwind + CSS vars + Figma vars + shadcn + React/Vue/Svelte + iOS/Android/Flutter/WordPress + brand-book PDF, all from one run. Nobody else emits more than 4–5 of these.
2. **Agent surface** — stdio MCP server + auto-generated AGENTS.md / .cursorrules / Claude skills + the website demo + Chrome ext + Figma plugin + VS Code ext + Raycast ext + GitHub Action. dembrandt has the MCP piece; nobody else has the spread.
3. **End-to-end loop** — URL → tokens → MCP in your IDE → clone scaffold → CI drift bot. Category of one.
4. **Audit + remediation** — CSS health + WCAG fix-it suggestions live next to the tokens. Project Wallace has the audit; nobody else combines it with extraction.

---

## Where we're behind / honest gaps

1. **First-impression friction** — `npm i` to see anything. Subframe / v0 / Builder all win the 10-second test in the browser. The website demo helps but the live extractor still feels like a side dish, not the main course.
2. **No social-share artifact** — extracted palettes, brand books and DESIGN.md cards should be one-click shareable with OG images. Currently each extraction is private to the runner.
3. **Distribution surface is passive** — GitHub stars are great but no scheduled content (no changelog newsletter, no "extracted today" feed, no Hacker News / Product Hunt drum).
4. **No "brand-locked code generation"** — v0 / Subframe / Lovable own the "give me a working component" loop. designlang has all the inputs to do this *better* (real brand tokens, not made-up) but doesn't expose it as a flow.
5. **Studio is local-only** — `designlang studio` requires a CLI install. The hosted version of this is the product.

---

## The plan — ranked by ROI

### 1. Public hosted studio (1–2 weeks) — highest ROI

Ship `designlang.app/x/<hash>` as the canonical share view. Every extraction the website runs gets a permalink with:
- The full DTCG tokens browser
- The live preview iframe
- The brand-book HTML embedded
- "Copy AGENTS.md" / "Download PDF" / "Open in MCP" buttons
- An auto-generated OG image of the palette (1200×630)

**Why first:** turns every extraction into a viral artifact. One person extracts stripe.com → tweets the share link → preview card shows the actual palette → that's the recruiter for the next 100 users. Subframe et al. cannot match this because they don't extract.

**Status:** the `/x/[hash]` page already exists — needs the social-share polish + OG image generation + a "share" button on the extractor.

### 2. "Brand-locked v0" — clone command upgrade (2–3 weeks)

Re-pitch the existing `designlang clone` command:

```bash
npx designlang clone stripe.com --prompt "pricing page with 3 tiers and a comparison table"
```

Output: a working Next.js page using Stripe's *actually-extracted* tokens, anatomy and voice. Not a guess. Not a generic component.

Hosted version at `designlang.app/build` — same input, but the extraction → scaffold → preview → download-zip happens in the browser.

**Why second:** directly attacks v0/Subframe/Lovable's biggest weakness. Their UI looks "AI". Ours looks like *you*. This is the clearest selling line in the entire competitive map.

### 3. Drift Leaderboard (1 week)

Public dashboard at `designlang.app/drift` running `designlang ci` against 50 well-known sites on a daily schedule. Surfaces:
- "stripe.com drifted 3% from their published Tailwind config this week"
- "linear.app added a new accent — your token snapshot is stale"
- Embeds + RSS so design Twitter / DesignSystems Slack pick it up

**Why:** turns the CI feature into a content engine. Press-friendly. Nothing else in the list has it.

**Companion:** marketplace-installable GitHub Action with a one-click button on every README.

### 4. AI-Overview / answer-engine SEO (always-on)

The new `llms.txt` + JSON-LD push is good. Compound it:
- One launch post per integration: "designlang on Cursor", "designlang on Windsurf", "designlang on Claude Code", "designlang in your CI", "designlang in WordPress"
- Each post answers a single keyword cluster crisply (300–500 words, schema-ready).
- Goal: be the cited source when ChatGPT / Perplexity / Google AI Overviews answer "how do I extract design tokens from a website".

### 5. The "extract → tweet" loop (1–2 days)

Tiny but high-leverage:
- "Tweet this extraction" button on the share page → opens X with a pre-composed post (`extracted stripe.com — 47 tokens, grade A+, ⤓ <link>`) plus the OG image attached.
- Same for LinkedIn and Bluesky.
- Track click-through with UTMs.

This is the part Subframe forgot. Their share is gated; ours is open.

### 6. Scheduled launches (4-week cadence)

A small launch every 2 weeks keeps us in the timeline:

| Week | Launch                                          | Channel                  |
| ---- | ----------------------------------------------- | ------------------------ |
| 0    | v12.12.0 site (already live)                    | Twitter, Reddit          |
| 2    | Public studio + share permalinks                | Hacker News (Show HN)    |
| 4    | Brand-locked clone                              | Product Hunt             |
| 6    | Drift leaderboard                               | Twitter, design blogs    |
| 8    | "MCP gallery" — designlang as the canonical tool for design-system MCPs | Anthropic MCP directory  |

---

## What NOT to chase

- **Real-time multiplayer studio** — Tokens Studio / Supernova own this lane and it requires sales motion. Skip.
- **Visual editor / canvas** — Subframe's home turf. We win by being the system *behind* their generated UI, not competing on canvas.
- **Enterprise SSO / RBAC** — premature. Get to 10k stars first.
- **Pricing tier** — staying free is the moat. Specify proved the alternative doesn't work. If monetisation is needed later, host the studio + drift bot as the paid layer; keep the CLI permanently free.

---

## Single sentence to remember

> designlang is the only tool that turns any URL into a design system *and* the AI agent that respects it.

Everything in the plan above is a different way of telling that one story.
