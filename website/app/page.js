import HeroExtractor from './components/HeroExtractor';
import Grainient from './components/Grainient';

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

const GALLERY = [
  { host: 'stripe.com', a: '#635BFF', b: '#0A2540', grade: 'A+' },
  { host: 'linear.app', a: '#5E6AD2', b: '#101828', grade: 'A' },
  { host: 'vercel.com', a: '#000000', b: '#FAFAFA', grade: 'A' },
  { host: 'notion.so', a: '#191919', b: '#E03E3E', grade: 'A-' },
  { host: 'figma.com', a: '#0ACF83', b: '#A259FF', grade: 'A' },
  { host: 'apple.com', a: '#0071E3', b: '#1D1D1F', grade: 'A+' },
  { host: 'arc.net', a: '#FE6F61', b: '#5B51F5', grade: 'A' },
  { host: 'spotify.com', a: '#1DB954', b: '#191414', grade: 'A-' },
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
          <span className="dx-live"><span className="dx-live-dot" />LIVE</span>
          <h2 className="dx-section-title">See it work.</h2>
          <p className="dx-section-tag">Paste a URL. Watch the system land.</p>
        </header>
        <div className="dx-stage">
          <span className="dx-stage-corner mono">demo · /api/extract</span>
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
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">loved by developers</p>
        <h2 className="h2">From the threads.</h2>
        <p className="lede" style={{ marginBottom: 36 }}>
          Real comments from the r/ClaudeAI launch. Unedited, untouched.
        </p>
        <div className="reddit-grid">
          {REDDIT.map((r, i) => (
            <a key={r.user + i} href={r.href} target="_blank" rel="noreferrer" className="reddit-card">
              <header className="reddit-meta">
                <span className="reddit-sub">{r.sub}</span>
                <span>·</span>
                <span className="reddit-user">{r.user}</span>
              </header>
              <p className="reddit-body">{r.body}</p>
              <footer className="reddit-foot">
                <span className="reddit-vote">▲ {r.up}</span>
                <span>reply</span>
                <span>share</span>
                <span style={{ marginLeft: 'auto' }}>open thread</span>
              </footer>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">see them in action</p>
        <h2 className="h2">Extracted from the public web.</h2>
        <p className="lede" style={{ marginBottom: 36 }}>
          Eight design systems pulled from the wild. Click through for the full DTCG output.
        </p>
        <div className="gallery-grid">
          {GALLERY.map(g => (
            <a key={g.host} href={`/gallery#${g.host}`} className="gal-card">
              <div className="gal-swatch" style={{ background: `linear-gradient(135deg, ${g.a} 0%, ${g.b} 100%)` }} />
              <div className="gal-meta">
                <span className="gal-host">{g.host}</span>
                <span className="gal-grade">{g.grade}</span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <a href="/gallery" className="btn btn-ghost">Open gallery</a>
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
      <CtaSection />
    </main>
  );
}
