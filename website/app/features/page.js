import Rule from '../components/Rule';
import TokenBrowser from '../components/TokenBrowser';
import McpSection from '../components/McpSection';
import PlatformTabs from '../components/PlatformTabs';
import CssHealth from '../components/CssHealth';
import A11ySlider from '../components/A11ySlider';
import RegionsComponents from '../components/RegionsComponents';
import Specimens from '../components/Specimens';
import Comparison from '../components/Comparison';
import {
  V11Showcase,
  V10Capabilities,
  V9Capabilities,
  InstallTracks,
  SiteFooter,
} from '../page';

export const metadata = {
  title: 'Features — designlang',
  description:
    'Every capability behind designlang: clone, ci, studio (v11), the v10 semantic layer (intent · sections · material · library), motion · anatomy · voice (v9), DTCG token browser, MCP server, multi-platform emitters, CSS health, A11y remediation, regions + components, install tracks.',
  alternates: { canonical: 'https://designlang.app/features' },
  openGraph: {
    title: 'Features — designlang',
    description: 'Everything designlang ships, on one page.',
  },
};

export default function Features() {
  return (
    <main className="page">
      {/* ── HEAD SLUG ─────────────────────────────────────── */}
      <header style={{ paddingTop: 'var(--r4)', paddingBottom: 'var(--r5)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 'var(--r5)',
            borderBottom: 'var(--hair)',
            paddingBottom: 'var(--r3)',
          }}
        >
          <a href="/" className="mono" style={{ fontSize: 13, letterSpacing: '0.02em', borderBottom: 0, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mark.svg" alt="" width={22} height={22} style={{ display: 'block' }} />
            designlang <span style={{ color: 'var(--ink-3)', marginLeft: 12 }}>v11</span>
          </a>
          <nav
            className="mono"
            style={{ display: 'flex', gap: 'var(--r5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            <a href="/" style={{ borderBottom: 0 }}>Home</a>
            <a href="/features" style={{ borderBottom: 0, color: 'var(--accent)' }}>Features</a>
            <a href="/vs/design-extractor" style={{ borderBottom: 0 }}>vs</a>
            <a href="https://github.com/Manavarya09/design-extract" style={{ borderBottom: 0 }}>GitHub</a>
            <a href="https://www.npmjs.com/package/designlang" style={{ borderBottom: 0 }}>npm</a>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--r7) var(--r8)' }}>
        <div className="section-label" style={{ marginBottom: 'var(--r6)' }}>
          <span>§00 — features</span>
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '-0.035em', lineHeight: 0.96, marginBottom: 'var(--r6)' }}>
          Every capability,<br />
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>one page</em>.
        </h1>
        <p className="prose" style={{ fontSize: 19, lineHeight: 1.5, maxWidth: '54ch', color: 'var(--ink-2)' }}>
          Three commands at the top — <code className="mono">clone</code>, <code className="mono">ci</code>, <code className="mono">studio</code> — sit on a stack of nine semantic classifiers, six v9 tools, an editorial token browser, a live MCP server, multi-platform emitters, CSS health, A11y remediation, and four install tracks. Everything below this line is real, shipped, and free.
        </p>
      </section>

      {/* ── §01 v11 — CLONE · CI · STUDIO ────────────────── */}
      <section id="v11">
        <Rule number="01" label="v11 — clone · ci · studio" />
        <V11Showcase />
      </section>

      {/* ── §02 v10 — SEMANTIC INTELLIGENCE ──────────────── */}
      <section id="v10">
        <Rule number="02" label="v10 — semantic intelligence" />
        <V10Capabilities />
      </section>

      {/* ── §03 v9 — MOTION · ANATOMY · VOICE ────────────── */}
      <section id="v9">
        <Rule number="03" label="v9 — motion · anatomy · voice" />
        <V9Capabilities />
      </section>

      {/* ── §04 DTCG BROWSER ─────────────────────────────── */}
      <section id="tokens">
        <Rule number="04" label="DTCG token browser" />
        <div style={{ padding: 'var(--r6) 0' }}>
          <TokenBrowser />
        </div>
      </section>

      {/* ── §05 MCP ──────────────────────────────────────── */}
      <section id="mcp">
        <Rule number="05" label="MCP server" />
        <McpSection />
      </section>

      {/* ── §06 MULTI-PLATFORM ───────────────────────────── */}
      <section id="platforms">
        <Rule number="06" label="multi-platform emitters" />
        <PlatformTabs />
      </section>

      {/* ── §07 HEALTH ───────────────────────────────────── */}
      <section id="health">
        <CssHealth />
      </section>

      {/* ── §08 REMEDIATION ──────────────────────────────── */}
      <section id="a11y">
        <A11ySlider />
      </section>

      {/* ── §09 REGIONS + COMPONENTS ─────────────────────── */}
      <section id="regions">
        <RegionsComponents />
      </section>

      {/* ── §10 SPECIMENS ────────────────────────────────── */}
      <section id="specimens">
        <Rule number="10" label="specimens" />
        <Specimens />
      </section>

      {/* ── §11 COMPARISON ───────────────────────────────── */}
      <section id="compared">
        <Rule number="11" label="compared" />
        <Comparison />
      </section>

      {/* ── §12 INSTALL ──────────────────────────────────── */}
      <section id="install" style={{ paddingBottom: 'var(--r9)' }}>
        <Rule number="12" label="install" />
        <InstallTracks />
      </section>

      <SiteFooter />
    </main>
  );
}
