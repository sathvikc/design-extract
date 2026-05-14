import HeroExtractor from './components/HeroExtractor';
import Grainient from './components/Grainient';
import RedditMarquee from './components/RedditMarquee';
import { FAQ } from './seo-config';

const FEATURES = [
  { tag: 'tokens', title: 'W3C DTCG tokens', body: 'Primitive, semantic and composite tokens — straight to Tailwind, CSS vars, Figma variables, shadcn theme.' },
  { tag: 'multi-platform', title: 'iOS, Android, Flutter, Web', body: 'One run, eight platforms. SwiftUI, Compose, Dart, React, Vue, Svelte, WordPress block theme.' },
  { tag: 'mcp', title: 'Stdio MCP server', body: 'Plug into Claude Code, Cursor or Windsurf. Your editor speaks design tokens natively.' },
  { tag: 'a11y', title: 'WCAG remediation', body: 'Real contrast audit, with the smallest hue-shift that passes AA. Not just a red badge.' },
  { tag: 'voice', title: 'Voice + anatomy', body: 'Real headlines, real CTAs, real component slots — extracted, named, and typed.' },
  { tag: 'pdf', title: 'Brand books, native PDF', body: 'Print-ready brand guidelines with chapter breaks, running footers and DTCG attached.' },
  { tag: 'css health', title: 'CSS health audit', body: 'Specificity, dead rules, duplicate declarations. Fix what AI agents will trip over.' },
  { tag: 'dark mode', title: 'Dark-mode pairing', body: 'Walks both themes, diffs them, and emits a dual token set. No guessing.' },
  { tag: 'ci', title: 'Drift CI bot', body: 'Snapshots design tokens. Fails the build when the system silently drifts.' },
];

// Real comments from r/ClaudeAI launch thread.
// https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/
const REDDIT = [
  { sub: 'r/ClaudeAI', user: 'u/PewPewDiie', body: 'Is the background representative of the token burn and the ungodly amount of work this task seems like for the model?', up: 39, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
  { sub: 'r/ClaudeAI', user: 'u/crypt0amat00r', body: 'Just turned this into an openclaw skill and tested it out. Works great! This is going to be super useful.', up: 17, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
  { sub: 'r/ClaudeAI', user: 'u/BeginningReflection4', body: 'yeah I want that background as much as I want the tool lol', up: 16, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
  { sub: 'r/ClaudeAI', user: 'u/Fidel___Castro', body: 'this is diabolical and will make so many companies unhappy, but I love it', up: 5, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
  { sub: 'r/ClaudeAI', user: 'u/llufnam', body: 'This my friend is bloody awesome! Starred.', up: 4, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
  { sub: 'r/ClaudeAI', user: 'u/crypt0amat00r', body: 'Yes! I have a dedicated "scraper" agent and this is the perfect addition to its skillset. Thank you!', up: 4, href: 'https://www.reddit.com/r/ClaudeAI/comments/1sm23sp/' },
];

// Real extractions from npx designlang <host>. Pre-rendered into
// /public/gallery/<slug>/ so each card opens the actual brand book.
const GALLERY = [
  { host: 'stripe.com',  slug: 'stripe-com',  primary: '#533afd', accent: '#e5edf5', bg: '#ffffff', grade: 'B'  },
  { host: 'linear.app',  slug: 'linear-app',  primary: '#5e6ad2', accent: '#e4f222', bg: '#08090a', grade: 'A'  },
  { host: 'vercel.com',  slug: 'vercel-com',  primary: '#0068d6', accent: '#52aeff', bg: '#fafafa', grade: 'A'  },
  { host: 'notion.so',   slug: 'notion-so',   primary: '#455dd3', accent: '#0075de', bg: '#ffffff', grade: 'A-' },
  { host: 'figma.com',   slug: 'figma-com',   primary: '#00b6ff', accent: '#e4ff97', bg: '#ffffff', grade: 'A'  },
  { host: 'apple.com',   slug: 'apple-com',   primary: '#0071e3', accent: '#f5f5f7', bg: '#ffffff', grade: 'A+' },
  { host: 'arc.net',     slug: 'arc-net',     primary: '#2702c2', accent: '#fffadd', bg: '#fffcec', grade: 'A'  },
  { host: 'spotify.com', slug: 'spotify-com', primary: '#1ed760', accent: '#346e4a', bg: '#121212', grade: 'A-' },
];

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden>
        <Grainient
          color1="#ff5757"
          color2="#000000"
          color3="#7f1d1d"
          timeSpeed={0.18}
          colorBalance={0.05}
          warpStrength={1.0}
          warpFrequency={4.5}
          warpSpeed={1.6}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.06}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.12}
          grainScale={2.0}
          grainAnimated={true}
          contrast={1.55}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.85}
        />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-pills">
              <span className="pill pill-red">v12.11.0</span>
              <span className="pill">PDF brand books</span>
            </div>
            <h1 className="h1">
              Reverse-engineer<br />
              any website&rsquo;s<br />
              design system.
            </h1>
            <p className="lede" style={{ marginTop: 24 }}>
              One command. DTCG tokens, Tailwind, CSS vars, Figma variables, iOS, Android, Flutter,
              WordPress, plus a stdio MCP for Claude Code and Cursor — back in seconds.
            </p>
            <div className="hero-cta">
              <a href="#extract" className="btn btn-primary">Run extraction</a>
              <a href="https://github.com/Manavarya09/design-extract" className="btn btn-ghost" target="_blank" rel="noreferrer">View source</a>
            </div>
            <div className="row mono" style={{ marginTop: 26, gap: 14, color: 'var(--fg-3)', fontSize: 12 }}>
              <span className="kbd">npx</span>
              <span>designlang stripe.com</span>
              <span className="faint">— no install, no account</span>
            </div>
          </div>

          <div className="code-card">
            <div className="code-head">
              <span className="code-dots"><span /><span /><span /></span>
              <div className="code-tabs">
                <span className="code-tab is-active">terminal</span>
                <span className="code-tab">tokens.json</span>
                <span className="code-tab">tailwind.js</span>
              </div>
              <span className="code-meta">~/projects/design</span>
            </div>
            <div className="code-body">
              <pre>
                <span className="tok-prompt">$</span> npx designlang stripe.com --pdf{'\n\n'}
                <span className="tok-com">{'// extracting design system…'}</span>{'\n'}
                <span className="tok-com">{'  walking dom            ✓'}</span>{'\n'}
                <span className="tok-com">{'  resolving palette      ✓'}</span>{'\n'}
                <span className="tok-com">{'  reading type           ✓'}</span>{'\n'}
                <span className="tok-com">{'  measuring rhythm       ✓'}</span>{'\n'}
                <span className="tok-com">{'  clustering components  ✓'}</span>{'\n'}
                <span className="tok-com">{'  auditing contrast      ✓'}</span>{'\n'}
                <span className="tok-com">{'  rendering pdf          ✓'}</span>{'\n\n'}
                <span className="tok-key">Brand book</span>
                <span className="tok-pun">{' · '}</span>
                <span className="tok-num">42</span>
                {' tokens '}
                <span className="tok-pun">·</span>
                {' '}
                <span className="tok-num">3</span>
                {' fonts '}
                <span className="tok-pun">·</span>
                {' grade '}
                <span className="tok-num">A+</span>{'\n\n'}
                <span className="tok-pun">{'  ▸ '}</span>
                {'stripe-com.brand.'}
                <span className="tok-fn">html</span>{'\n'}
                <span className="tok-pun">{'  ▸ '}</span>
                {'stripe-com.brand.'}
                <span className="tok-fn">pdf</span>{'\n'}
                <span className="tok-pun">{'  ▸ '}</span>
                {'stripe-com.tokens.'}
                <span className="tok-fn">json</span>{'\n'}
                <span className="tok-pun">{'  ▸ '}</span>
                {'stripe-com.tailwind.'}
                <span className="tok-fn">js</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExtractSection() {
  return (
    <section id="extract" className="section dx-section">
      <div className="dx-section-bg" aria-hidden />
      <div className="wrap dx-section-wrap">
        <header className="dx-section-head">
          <p className="eyebrow" style={{ marginBottom: 14 }}>try it now</p>
          <h2 className="dx-section-title">See it work.</h2>
          <p className="dx-section-tag">Paste a URL. Watch the system land.</p>
        </header>
        <div className="dx-stage">
          <HeroExtractor />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">what&rsquo;s inside</p>
        <h2 className="h2">Everything you would build by hand.</h2>
        <p className="lede" style={{ marginBottom: 36 }}>
          Nine extractors, eight emitters, one design system. No paid tier. No API keys.
        </p>
        <div className="grid-3">
          {FEATURES.map(f => (
            <article key={f.title} className="feature">
              <span className="feature-tag">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <a href="/features" className="btn btn-ghost">All features</a>
        </div>
      </div>
    </section>
  );
}

function RedditSection() {
  return (
    <section className="section rdt-section">
      <div className="wrap" style={{ textAlign: 'center', marginBottom: 36 }}>
        <p className="eyebrow">loved by developers</p>
        <h2 className="h2" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>From the threads.</h2>
        <p className="lede" style={{ margin: '0 auto' }}>
          Real, unedited comments from the r/ClaudeAI launch.
        </p>
      </div>
      <RedditMarquee />
    </section>
  );
}

function GallerySection() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">see them in action</p>
        <h2 className="h2">Real extractions, on this site.</h2>
        <p className="lede" style={{ marginBottom: 36 }}>
          Eight brands. Eight real <code className="kbd">npx designlang &lt;host&gt;</code> runs. Click any card to open the actual brand book.
        </p>
        <div className="gallery-grid">
          {GALLERY.map(g => (
            <a
              key={g.host}
              href={`/gallery/${g.slug}/brand.html`}
              target="_blank"
              rel="noreferrer"
              className="gal-card gal-real"
            >
              <div
                className="gal-swatch"
                style={{ background: `linear-gradient(135deg, ${g.primary} 0%, ${g.accent} 65%, ${g.bg === '#ffffff' ? '#1a1a1a' : g.bg} 100%)` }}
              />
              <div className="gal-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://icon.horse/icon/${g.host}`}
                  alt=""
                  loading="lazy"
                  width={64}
                  height={64}
                />
              </div>
              <div className="gal-meta">
                <span className="gal-host">{g.host}</span>
                <span className="gal-grade">brand book ↗</span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/gallery" className="btn btn-ghost">Browse gallery</a>
          <span className="mono faint" style={{ alignSelf: 'center', fontSize: 12 }}>
            extracted live · {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="section">
      <div className="wrap-narrow">
        <p className="eyebrow">faq</p>
        <h2 className="h2">Frequently asked.</h2>
        <p className="lede" style={{ marginBottom: 36 }}>
          Quick answers about installing designlang, the output formats, the MCP server, and how it compares to Style Dictionary, Subframe, v0 and design-extractor.com.
        </p>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary className="faq-q">{item.q}</summary>
              <div className="faq-a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeoCopySection() {
  return (
    <section id="about" className="section seo-copy-section">
      <div className="wrap-narrow seo-copy">
        <p className="eyebrow">about designlang</p>
        <h2 className="h2">An open-source CLI that turns any URL into a complete design system.</h2>
        <div className="seo-prose">
          <p>
            <strong>designlang</strong> is a free, MIT-licensed command-line tool that points a headless Chromium browser at any
            live website and reads its design system off the rendered DOM. One run emits W3C{' '}
            <strong>DTCG tokens</strong> in primitive, semantic and composite layers, plus a Tailwind config, CSS variables,
            Figma Variables JSON, a shadcn/ui theme, React / Vue / Svelte theme objects, iOS SwiftUI extensions,
            Android Jetpack Compose <code>Theme.kt</code>, Flutter <code>ThemeData</code>, a WordPress block theme, and a
            print-ready brand-book PDF with chapter bookmarks and the tokens embedded as a file attachment.
          </p>
          <p>
            designlang is built for the AI-coding era. The bundled <strong>stdio MCP server</strong> exposes every extracted
            artefact — colours, typography, spacing, motion, anatomy, accessibility findings — to Claude Code, Cursor and
            Windsurf as native MCP resources. The CLI also writes <code>AGENTS.md</code>, <code>.cursorrules</code> and
            Claude Code skills directly into your repo so any agent can read the system without prompting.
          </p>
          <p>
            Beyond extraction, designlang ships a <strong>CSS health audit</strong> (specificity graph, dead-rule detection,
            duplicate declaration count, <code>@keyframes</code> catalogue), a <strong>WCAG remediation</strong> step that
            picks the smallest hue-shift to pass AA, a <strong>semantic region classifier</strong> for navs / hero / pricing
            / testimonials / footer, <strong>component clustering</strong> with variant and slot detection, dark-mode pairing,
            authenticated crawling, and a <strong>CI drift bot</strong> that fails the build when the system silently changes.
          </p>
          <p>
            Designed as a strict superset of <a href="/vs/design-extractor">design-extractor.com</a>, designlang ships the
            entire DESIGN.md spec (see <a href="/spec">the spec page</a>) plus everything you actually need to build the design.
            Free, open source, no signup, no API key. Try it on <a href="#extract">any URL above</a> or run{' '}
            <code className="kbd" style={{ fontSize: 12 }}>npx designlang stripe.com</code> in your terminal.
          </p>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section">
      <div className="wrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 720, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
          <h2 className="h2" style={{ fontSize: 32 }}>Two seconds to first token.</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>
            Drop the command, get the system. Pipe it into Tailwind, your MCP-aware editor, or a PDF.
          </p>
          <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <code className="kbd" style={{ fontSize: 13, padding: '8px 14px' }}>npx designlang stripe.com</code>
            <a href="#extract" className="btn btn-primary">Try it now</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <ExtractSection />
      <FeaturesSection />
      <RedditSection />
      <GallerySection />
      <SeoCopySection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
