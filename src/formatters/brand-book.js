// designlang brand-book — full editorial brand-guidelines document.
//
// Hand-off-ready single-HTML book that documents every dimension of an
// extracted design system: cover, about, colour, typography, spacing,
// shape, iconography, motion, components, voice, accessibility, tokens,
// and "how to use" guidance. Editorial layout, print-ready, dark-mode
// toggle, TOC with anchor links. Self-contained — no external assets
// except Google Fonts.

const FONT_DISPLAY = 'Instrument Serif';
const FONT_BODY = 'Inter';
const FONT_MONO = 'JetBrains Mono';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function host(url) {
  try { return new URL(url).hostname; } catch { return String(url || ''); }
}

// Coerce *anything* into a list of strings. The component-anatomy
// extractor sometimes returns slots/props as an object keyed by name,
// sometimes as an array, sometimes as a single string. Real-world data
// gives us all three in one extraction.
function asList(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(x => x != null);
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  if (typeof v === 'object') return Object.keys(v);
  return [String(v)];
}

function familyName(f) {
  if (!f) return '';
  if (typeof f === 'string') return f;
  return f.name || f.family || '';
}

function gradeAccent(grade) {
  return ({ A: '#0a8a52', B: '#1f6feb', C: '#b08400', D: '#d2691e', F: '#c43d3d' })[grade] || '#1f1f1f';
}

// ── Color helpers ───────────────────────────────────────────────

function hexToRgb(hex) {
  if (!hex) return null;
  const s = String(hex).trim().replace(/^#/, '');
  const full = s.length === 3 ? s.split('').map(c => c + c).join('') : s.slice(0, 6);
  const m = full.match(/^[0-9a-f]{6}$/i);
  if (!m) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }) {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
      case gN: h = (bN - rN) / d + 2; break;
      case bN: h = (rN - gN) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function relLum({ r, g, b }) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function bestTextOn(rgb) {
  // Pick black or white text for readability against a swatch background.
  return relLum(rgb) > 0.5 ? '#0a0a0a' : '#ffffff';
}

function colorRow(c) {
  const hex = (typeof c === 'string' ? c : c?.hex) || '';
  const norm = String(hex).trim().toLowerCase();
  const rgb = hexToRgb(norm);
  if (!rgb) return '';
  const hsl = rgbToHsl(rgb);
  const fg = bestTextOn(rgb);
  const usage = (typeof c === 'object' && (c?.contexts?.[0] || c?.role)) || '';
  return `<div class="color-row">
    <div class="swatch-large" style="background:${esc(norm)};color:${fg}"><span>${esc(norm)}</span></div>
    <dl class="color-meta">
      <div><dt>HEX</dt><dd><code>${esc(norm)}</code></dd></div>
      <div><dt>RGB</dt><dd><code>${rgb.r}, ${rgb.g}, ${rgb.b}</code></dd></div>
      <div><dt>HSL</dt><dd><code>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</code></dd></div>
      ${usage ? `<div><dt>Use</dt><dd>${esc(usage)}</dd></div>` : ''}
    </dl>
  </div>`;
}

// ── Section builders ───────────────────────────────────────────

function buildCover(design) {
  const meta = design.meta || {};
  const hostName = host(meta.url);
  const date = new Date(meta.timestamp || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const grade = design.score?.grade || '—';
  const overall = design.score?.overall ?? '—';
  const intent = design.pageIntent?.type || 'site';
  return `
    <section class="cover" id="cover">
      <p class="kicker">Brand Guidelines · v1 · ${esc(date)}</p>
      <h1 class="cover-title">${esc(hostName)}</h1>
      <p class="cover-sub">A complete reading of the visual language at <a href="${esc(meta.url || '')}" target="_blank" rel="noopener">${esc(meta.url || hostName)}</a> — every token, every rule, every component. Use this as a starting point for derivative work, internal handoffs, or design audits.</p>
      <div class="cover-meta">
        <span><strong>${esc(intent)}</strong>page intent</span>
        <span><strong>${esc(grade)}</strong>system grade</span>
        <span><strong>${esc(String(overall))}/100</strong>quality score</span>
        <span><strong>${esc(String((design.colors?.all || []).length))}</strong>tokens</span>
      </div>
    </section>`;
}

function buildToc() {
  const items = [
    ['about', '01', 'About'],
    ['logo', '02', 'Logo'],
    ['color', '03', 'Colour'],
    ['type', '04', 'Typography'],
    ['spacing', '05', 'Spacing'],
    ['shape', '06', 'Shape'],
    ['iconography', '07', 'Iconography'],
    ['motion', '08', 'Motion'],
    ['components', '09', 'Components'],
    ['voice', '10', 'Voice & tone'],
    ['accessibility', '11', 'Accessibility'],
    ['tokens', '12', 'Tokens'],
    ['usage', '13', 'How to use'],
  ];
  return `
    <nav class="toc" aria-label="Table of contents">
      <h2 class="toc-title">Contents</h2>
      <ol>
        ${items.map(([id, n, label]) => `<li><a href="#${id}"><span class="toc-num">${n}</span><span class="toc-label">${label}</span></a></li>`).join('')}
      </ol>
    </nav>`;
}

function buildAbout(design) {
  const intent = design.pageIntent || {};
  const material = design.materialLanguage || {};
  const imagery = design.imageryStyle || {};
  const lib = design.componentLibrary || {};
  const stack = design.stack || {};
  const voice = design.voice || {};
  return `
    <section id="about">
      <header><span class="sec-num">01</span><h2>About</h2></header>
      <p class="lead">A short reading of what kind of site this is, what it's built on, and the broad visual posture of the brand.</p>
      <dl class="meta-grid">
        <div><dt>Page intent</dt><dd>${esc(intent.type || 'unknown')}${typeof intent.confidence === 'number' ? ` · ${(intent.confidence * 100).toFixed(0)}% confidence` : ''}</dd></div>
        <div><dt>Material language</dt><dd>${esc(material.label || 'unknown')}</dd></div>
        <div><dt>Imagery style</dt><dd>${esc(imagery.label || 'unknown')}</dd></div>
        <div><dt>Component library</dt><dd>${esc(lib.library || 'unknown')}</dd></div>
        <div><dt>Stack</dt><dd>${esc(stack.framework || 'unknown')}${stack.css?.tailwind ? ' · Tailwind' : ''}</dd></div>
        <div><dt>Voice tone</dt><dd>${esc(voice.tone || 'neutral')}</dd></div>
      </dl>
    </section>`;
}

function buildLogo(design) {
  const logo = design.logo || {};
  const hasSvg = typeof logo.svg === 'string' && logo.svg.includes('<svg');
  return `
    <section id="logo">
      <header><span class="sec-num">02</span><h2>Logo</h2></header>
      <p class="lead">Captured from the live site. Treat the dimensions below as the recommended minimum clear-space and as a guide for placement against ${design.colors?.primary?.hex ? 'the primary brand colour' : 'a neutral surface'}.</p>
      <div class="logo-card">
        <div class="logo-canvas" aria-label="Extracted logo on canvas">
          ${hasSvg ? logo.svg : `<span class="logo-placeholder">${esc(host(design.meta?.url) || 'logo')}</span>`}
        </div>
        <dl class="meta-grid logo-meta">
          <div><dt>Source</dt><dd>${esc(logo.source || 'inferred')}</dd></div>
          <div><dt>Dimensions</dt><dd>${logo.width ? `${logo.width} × ${logo.height} px` : '—'}</dd></div>
          <div><dt>Aspect</dt><dd>${logo.aspect ? logo.aspect.toFixed(2) : '—'}</dd></div>
          <div><dt>Format</dt><dd>${esc(logo.format || (hasSvg ? 'svg' : 'unknown'))}</dd></div>
        </dl>
      </div>
    </section>`;
}

function buildColor(design) {
  const colors = design.colors || {};
  const primary = colors.primary;
  const secondary = colors.secondary;
  const accent = colors.accent;
  const neutrals = colors.neutrals || [];
  const all = colors.all || [];
  const a11y = design.accessibility || {};

  const brandList = [
    ['Primary', primary],
    ['Secondary', secondary],
    ['Accent', accent],
  ].filter(([_, c]) => c?.hex);

  return `
    <section id="color">
      <header><span class="sec-num">03</span><h2>Colour</h2></header>
      <p class="lead">The full palette as it appears on the live site. Brand colours carry meaning. Neutrals carry structure. Each swatch lists the exact values to use.</p>

      ${brandList.length ? `
        <h3 class="sub">Brand</h3>
        ${brandList.map(([name, c]) => `
          <article class="brand-color">
            <h4>${esc(name)}</h4>
            ${colorRow(c)}
          </article>
        `).join('')}
      ` : ''}

      ${neutrals.length ? `
        <h3 class="sub">Neutrals</h3>
        <div class="palette-grid">
          ${neutrals.slice(0, 12).map(c => `
            <div class="mini-swatch" style="background:${esc(c.hex)};color:${bestTextOn(hexToRgb(c.hex) || { r: 0, g: 0, b: 0 })}">
              <code>${esc(c.hex)}</code>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <h3 class="sub">Full palette · ${all.length} tokens</h3>
      <div class="palette-grid">
        ${all.slice(0, 24).map(c => `
          <div class="mini-swatch" style="background:${esc(c.hex)};color:${bestTextOn(hexToRgb(c.hex) || { r: 0, g: 0, b: 0 })}">
            <code>${esc(c.hex)}</code>
          </div>
        `).join('')}
      </div>

      ${a11y.score != null ? `
        <div class="callout">
          <span class="callout-label">Accessibility</span>
          <p>WCAG score <strong>${a11y.score}%</strong> · ${a11y.passCount || 0} passing pairs · ${a11y.failCount || 0} failing. See §11 for remediation.</p>
        </div>
      ` : ''}
    </section>`;
}

function buildType(design) {
  const t = design.typography || {};
  const families = (t.families || []).map(familyName).filter(Boolean);
  const scaleRaw = (t.scale || []);
  const sizes = scaleRaw.map(s => typeof s === 'number' ? s : (s?.size ?? 0)).filter(n => n > 0).sort((a, b) => b - a);
  const weights = (t.weights || []).map(w => typeof w === 'object' ? (w.weight || w.value) : w).filter(Boolean);
  const head = families[0];
  const body = families[1] || head;

  return `
    <section id="type">
      <header><span class="sec-num">04</span><h2>Typography</h2></header>
      <p class="lead">Two families typically — display for headlines, body for paragraph text. Hold the weight count tight (3–4 max) and let size carry hierarchy.</p>

      <dl class="meta-grid">
        <div><dt>Display family</dt><dd>${esc(head || '—')}</dd></div>
        <div><dt>Body family</dt><dd>${esc(body || '—')}</dd></div>
        <div><dt>Scale</dt><dd>${sizes.length} sizes</dd></div>
        <div><dt>Weights</dt><dd>${weights.join(', ') || '—'}</dd></div>
      </dl>

      <h3 class="sub">Specimen</h3>
      <div class="specimen" style="font-family: ${head ? esc(head) + ',' : ''} '${FONT_DISPLAY}', serif;">
        ${sizes.slice(0, 5).map((s, i) => {
          const lines = [
            'The quiet authority of restraint.',
            'How the page reads at rest.',
            'Form follows feeling.',
            'Hierarchy is a craft.',
            'Body text · 16px · 1.5 line-height.',
          ];
          return `<div class="spec-line" style="font-size:${Math.min(s, 72)}px">${lines[i] || lines[lines.length - 1]}</div>`;
        }).join('')}
      </div>

      <h3 class="sub">Scale</h3>
      <table class="scale-table">
        <thead><tr><th>Step</th><th>Size</th><th>Sample</th></tr></thead>
        <tbody>
          ${sizes.slice(0, 12).map((s, i) => `
            <tr>
              <td><code>t${i}</code></td>
              <td><code>${s}px</code></td>
              <td style="font-size:${Math.min(s, 36)}px; font-family: ${head ? esc(head) + ',' : ''} '${FONT_DISPLAY}', serif;">Aa</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>`;
}

function buildSpacing(design) {
  const sp = design.spacing || {};
  const raw = (sp.scale || []).map(v => typeof v === 'number' ? v : (v?.value ?? v?.size ?? 0)).filter(n => n > 0);
  const scale = raw.slice().sort((a, b) => a - b).slice(0, 12);
  return `
    <section id="spacing">
      <header><span class="sec-num">05</span><h2>Spacing</h2></header>
      <p class="lead">A consistent spacing rhythm is what makes a page feel calm. Use these values for padding, margin, and gap. Resist one-off pixel values.</p>
      <dl class="meta-grid">
        <div><dt>Base unit</dt><dd>${sp.base ? `${sp.base}px` : '—'}</dd></div>
        <div><dt>Scale length</dt><dd>${(sp.scale || []).length} values</dd></div>
      </dl>
      <h3 class="sub">Rhythm</h3>
      <div class="rhythm">
        ${scale.map(v => `<div class="rhythm-bar" style="width:${Math.min(v * 1.6, 360)}px"><span>${v}px</span></div>`).join('')}
      </div>
    </section>`;
}

function buildShape(design) {
  const radii = (design.borders?.radii || []).map(r => typeof r === 'object' ? r.value : r).filter(n => n != null).sort((a, b) => a - b);
  const shadows = (design.shadows?.values || []).slice(0, 6);
  return `
    <section id="shape">
      <header><span class="sec-num">06</span><h2>Shape</h2></header>
      <p class="lead">Corners and elevation set the tactile feel of a brand. Sharper radii read precise; softer radii read approachable. Shadow elevation builds hierarchy in z.</p>

      <h3 class="sub">Border radii</h3>
      <div class="radii-row">
        ${radii.slice(0, 6).map(v => `
          <div class="radius-card">
            <div class="radius-block" style="border-radius:${v}px"></div>
            <code>${v}px</code>
          </div>
        `).join('')}
      </div>

      <h3 class="sub">Elevation</h3>
      <div class="shadows-row">
        ${shadows.map((s, i) => `
          <div class="shadow-card">
            <div class="shadow-block" style="box-shadow:${esc(typeof s === 'string' ? s : (s?.raw || ''))}"></div>
            <code>${esc(typeof s === 'string' ? s : (s?.label || `e${i}`))}</code>
          </div>
        `).join('')}
      </div>
    </section>`;
}

function buildIconography(design) {
  const sys = design.iconSystem || {};
  const icons = (sys.icons || design.icons?.icons || []).slice(0, 24);
  return `
    <section id="iconography">
      <header><span class="sec-num">07</span><h2>Iconography</h2></header>
      <p class="lead">Every recognisable icon library has a fingerprint — stroke width, grid size, terminal style. Match the existing icon family or commit to a new one wholesale.</p>
      <dl class="meta-grid">
        <div><dt>Library</dt><dd>${esc(sys.library || 'unknown')}</dd></div>
        <div><dt>Confidence</dt><dd>${sys.confidence != null ? Math.round(sys.confidence * 100) + '%' : '—'}</dd></div>
        <div><dt>Stroke style</dt><dd>${esc(sys.signals?.[0] || '—')}</dd></div>
        <div><dt>Count</dt><dd>${icons.length} captured</dd></div>
      </dl>
      ${icons.length ? `
        <div class="icon-grid">
          ${icons.map(i => `<div class="icon-cell">${i.svg ? i.svg : `<code>${esc(i.name || 'icon')}</code>`}</div>`).join('')}
        </div>
      ` : '<p class="muted">No icons captured.</p>'}
    </section>`;
}

function buildMotion(design) {
  const m = design.motion || {};
  const durations = (m.durations || []).slice(0, 6);
  const easings = (m.easings || []).slice(0, 4);
  return `
    <section id="motion">
      <header><span class="sec-num">08</span><h2>Motion</h2></header>
      <p class="lead">Motion sets the felt pace of an interface. Stay inside this duration / easing vocabulary so transitions sing the same note.</p>
      <dl class="meta-grid">
        <div><dt>Feel</dt><dd>${esc(m.feel || 'unknown')}</dd></div>
        <div><dt>Scroll-linked</dt><dd>${m.scrollLinked?.present ? 'yes' : 'no'}</dd></div>
        <div><dt>Spring presence</dt><dd>${(m.springs || []).length ? 'yes' : 'no'}</dd></div>
      </dl>

      <h3 class="sub">Durations</h3>
      <div class="motion-row">
        ${durations.map(d => `
          <div class="motion-card">
            <div class="motion-dot" style="--dur:${d.ms || d}ms"></div>
            <code>${d.ms || d}ms${d.label ? ` · ${esc(d.label)}` : ''}</code>
          </div>
        `).join('')}
      </div>

      ${easings.length ? `
        <h3 class="sub">Easings</h3>
        <ul class="easings">
          ${easings.map(e => `<li><code>${esc(typeof e === 'string' ? e : (e.value || e.label || e.family || ''))}</code></li>`).join('')}
        </ul>
      ` : ''}
    </section>`;
}

function buildComponents(design) {
  const lib = design.componentLibrary || {};
  const anatomy = design.componentAnatomy || [];
  const components = anatomy.slice(0, 6);
  return `
    <section id="components">
      <header><span class="sec-num">09</span><h2>Components</h2></header>
      <p class="lead">Reusable parts the auditor recognised on the site, with their slot anatomy. Use these as scaffolding — names + variants + sizes — when building new components.</p>
      <p class="muted">Detected library: <code>${esc(lib.library || 'unknown')}</code></p>

      ${components.length ? components.map(c => `
        <article class="component-card">
          <h4>${esc(c.kind || c.name || 'component')}</h4>
          <dl class="meta-grid">
            <div><dt>Slots</dt><dd>${asList(c.slots).map(esc).join(', ') || '—'}</dd></div>
            <div><dt>Variants</dt><dd>${asList(c.props && c.props.variant).map(esc).join(', ') || '—'}</dd></div>
            <div><dt>Sizes</dt><dd>${asList(c.props && c.props.size).map(esc).join(', ') || '—'}</dd></div>
          </dl>
        </article>
      `).join('') : '<p class="muted">No component anatomy captured. Run <code>designlang &lt;url&gt; --full</code> to enable component clustering.</p>'}
    </section>`;
}

function buildVoice(design) {
  const v = design.voice || {};
  const headings = (v.sampleHeadings || []).slice(0, 4);
  const verbs = (v.ctaVerbs || []).slice(0, 8);
  return `
    <section id="voice">
      <header><span class="sec-num">10</span><h2>Voice &amp; tone</h2></header>
      <p class="lead">Visual is half of brand. Voice is the other half. These signals were extracted from the live page copy.</p>
      <dl class="meta-grid">
        <div><dt>Tone</dt><dd>${esc(v.tone || 'neutral')}</dd></div>
        <div><dt>Pronoun posture</dt><dd>${esc(v.pronounPosture || '—')}</dd></div>
        <div><dt>Heading case</dt><dd>${esc(v.headingCase || '—')}</dd></div>
      </dl>

      ${verbs.length ? `
        <h3 class="sub">Top CTA verbs</h3>
        <ul class="cta-verbs">
          ${verbs.map(v2 => `<li><code>${esc(typeof v2 === 'string' ? v2 : (v2.verb || ''))}</code>${typeof v2 === 'object' && v2.count ? ` <span class="muted">×${v2.count}</span>` : ''}</li>`).join('')}
        </ul>
      ` : ''}

      ${headings.length ? `
        <h3 class="sub">Sample headings</h3>
        <ul class="quotes">
          ${headings.map(h => `<li>“${esc(h)}”</li>`).join('')}
        </ul>
      ` : ''}
    </section>`;
}

function buildAccessibility(design) {
  const a = design.accessibility || {};
  const failing = (a.failingPairs || []).slice(0, 5);
  const remediation = (a.remediation || []).slice(0, 5);
  return `
    <section id="accessibility">
      <header><span class="sec-num">11</span><h2>Accessibility</h2></header>
      <p class="lead">WCAG 2.1 contrast scoring across every foreground/background pair detected on the live page. Failing pairs come with proposed replacement values.</p>
      <dl class="meta-grid">
        <div><dt>Score</dt><dd>${a.score != null ? `${a.score}%` : '—'}</dd></div>
        <div><dt>Passing pairs</dt><dd>${a.passCount ?? '—'}</dd></div>
        <div><dt>Failing pairs</dt><dd>${a.failCount ?? '—'}</dd></div>
        <div><dt>Total pairs</dt><dd>${a.totalPairs ?? '—'}</dd></div>
      </dl>
      ${failing.length ? `
        <h3 class="sub">Failing pairs</h3>
        <table class="scale-table">
          <thead><tr><th>Foreground</th><th>Background</th><th>Ratio</th><th>Rule</th></tr></thead>
          <tbody>
            ${failing.map(p => `
              <tr>
                <td><code>${esc(p.fg || p.foreground)}</code></td>
                <td><code>${esc(p.bg || p.background)}</code></td>
                <td><code>${(p.ratio || 0).toFixed(2)}</code></td>
                <td><code>${esc(p.rule || 'AA')}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p class="muted">No failing contrast pairs detected.</p>'}
      ${remediation.length ? `
        <h3 class="sub">Suggested replacements</h3>
        <ul class="remediation">
          ${remediation.map(r => `<li><code>${esc(r.from || r.fg)}</code> → <code>${esc(r.to || r.suggested)}</code> ${r.ratio ? `<span class="muted">(${r.ratio.toFixed(2)}:1)</span>` : ''}</li>`).join('')}
        </ul>
      ` : ''}
    </section>`;
}

function buildTokens(design) {
  const primary = design.colors?.primary?.hex || '#0066cc';
  const fontHead = familyName((design.typography?.families || [])[0]) || 'Inter';
  const space = design.spacing?.base || 4;
  return `
    <section id="tokens">
      <header><span class="sec-num">12</span><h2>Tokens</h2></header>
      <p class="lead">Drop-in code for the most common stacks. All values pulled directly from the extraction.</p>

      <h3 class="sub">CSS variables</h3>
      <pre class="codeblock"><code>:root {
  --color-primary: ${esc(primary)};
  --font-display: "${esc(fontHead)}";
  --space-base: ${space}px;
  --radius-md: ${(design.borders?.radii || []).map(r => typeof r === 'object' ? r.value : r).filter(n => n != null).sort((a, b) => a - b)[1] || 8}px;
}</code></pre>

      <h3 class="sub">Tailwind config (extend)</h3>
      <pre class="codeblock"><code>// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: { brand: '${esc(primary)}' },
      fontFamily: { display: ['${esc(fontHead)}', 'serif'] },
      spacing: { base: '${space}px' },
    },
  },
};</code></pre>

      <h3 class="sub">Full token set</h3>
      <p class="muted">Run <code>npx designlang pack ${esc(host(design.meta?.url) || '<url>')}</code> for the complete bundle (DTCG, shadcn, Figma vars, motion, anatomy).</p>
    </section>`;
}

function buildUsage(design) {
  const hostName = host(design.meta?.url) || 'this site';
  return `
    <section id="usage">
      <header><span class="sec-num">13</span><h2>How to use</h2></header>
      <p class="lead">A few rules of thumb for applying these guidelines to derivative work.</p>
      <ol class="usage-list">
        <li><strong>Lead with brand colour.</strong> The primary lives on calls-to-action, key icons, and one accent moment per screen — not on body type.</li>
        <li><strong>Hold the type to two families.</strong> Display for headlines, body for paragraphs. Resist a third unless there's a real reason.</li>
        <li><strong>Snap to the spacing scale.</strong> Padding, margins, and gaps should land on the values in §05. One-off pixels accumulate into noise.</li>
        <li><strong>Keep the radius set tight.</strong> Three to four values across the whole product. Mixing too many radii reads as inconsistent craft.</li>
        <li><strong>Use motion for feedback, not decoration.</strong> The durations and easings in §08 set the brand's pace — match them rather than inventing your own.</li>
        <li><strong>Treat accessibility as a hard constraint.</strong> If a colour pair fails WCAG, fix the colour — not the contrast check.</li>
      </ol>
      <p class="muted">Generated from <code>${esc(hostName)}</code> with <a href="https://designlang.app" target="_blank" rel="noopener">designlang</a>. Re-run <code>designlang brand ${esc(hostName)}</code> any time to refresh.</p>
    </section>`;
}

// ── The book ────────────────────────────────────────────────────

export function formatBrandBook(design, opts = {}) {
  if (!design) throw new Error('formatBrandBook: design is required');
  const meta = design.meta || {};
  const hostName = host(meta.url);
  const grade = design.score?.grade || '—';
  const accent = gradeAccent(grade);
  const ogTitle = `${hostName} · brand guidelines`;
  const ogDesc = `Full design-system documentation for ${hostName} — colour, type, spacing, motion, voice, accessibility, components, and drop-in tokens.`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(ogTitle)}</title>
<meta name="description" content="${esc(ogDesc)}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(ogDesc)}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(FONT_DISPLAY)}&family=${encodeURIComponent(FONT_BODY)}:wght@400;500;600&family=${encodeURIComponent(FONT_MONO)}:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: #f7f5ef;
    --ink: #141414;
    --ink-soft: #555049;
    --ink-faint: #8a8579;
    --rule: #e5e1d6;
    --accent: ${accent};
    --display: '${FONT_DISPLAY}', 'Times New Roman', serif;
    --body: '${FONT_BODY}', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --mono: '${FONT_MONO}', ui-monospace, 'SF Mono', monospace;
  }
  [data-theme="dark"] {
    --paper: #0e0d0b;
    --ink: #f0ece2;
    --ink-soft: #9b9589;
    --ink-faint: #5b574e;
    --rule: #2a2823;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background .25s, color .25s;
  }
  a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule); padding-bottom: 1px; }
  a:hover { border-color: var(--ink); }
  code { font-family: var(--mono); font-size: 0.92em; }
  .muted { color: var(--ink-soft); }

  .wrap { max-width: 880px; margin: 0 auto; padding: 56px 40px 96px; }
  @media (max-width: 640px) { .wrap { padding: 32px 22px 64px; } }

  /* — Top bar — */
  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 64px; font-size: 13px; }
  .brand { font-family: var(--display); font-size: 22px; }
  .brand a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule); padding-bottom: 1px; }
  .topbar nav { display: flex; gap: 18px; align-items: center; color: var(--ink-soft); }
  .theme-btn { background: transparent; border: 1px solid var(--rule); color: var(--ink-soft); font-size: 12px; padding: 6px 12px; border-radius: 999px; cursor: pointer; letter-spacing: .04em; text-transform: uppercase; font-family: var(--body); }
  .theme-btn:hover { color: var(--ink); border-color: var(--ink); }

  /* — Cover — */
  .cover { padding: 32px 0 80px; border-bottom: 1px solid var(--rule); }
  .kicker { text-transform: uppercase; letter-spacing: .18em; font-size: 11px; color: var(--ink-soft); margin: 0 0 18px; }
  .cover-title { font-family: var(--display); font-weight: 400; font-size: clamp(56px, 10vw, 120px); line-height: .95; letter-spacing: -.02em; margin: 0 0 24px; }
  .cover-sub { font-size: 19px; line-height: 1.55; color: var(--ink-soft); max-width: 60ch; margin: 0 0 36px; }
  .cover-meta { display: flex; flex-wrap: wrap; gap: 36px; font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); }
  .cover-meta span { display: flex; flex-direction: column; gap: 4px; }
  .cover-meta strong { color: var(--ink); font-family: var(--display); font-size: 28px; font-weight: 400; letter-spacing: 0; text-transform: none; }

  /* — TOC — */
  .toc { padding: 56px 0; border-bottom: 1px solid var(--rule); }
  .toc-title { font-family: var(--display); font-weight: 400; font-size: 28px; margin: 0 0 24px; }
  .toc ol { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 48px; }
  @media (max-width: 640px) { .toc ol { columns: 1; } }
  .toc li { padding: 10px 0; border-top: 1px solid var(--rule); break-inside: avoid; }
  .toc li:last-child { border-bottom: 1px solid var(--rule); }
  .toc a { display: flex; gap: 14px; align-items: baseline; border: 0; }
  .toc-num { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); width: 26px; }
  .toc-label { font-family: var(--display); font-size: 18px; }

  /* — Sections — */
  section { padding: 64px 0; border-bottom: 1px solid var(--rule); }
  section:last-of-type { border-bottom: 0; }
  section header { display: flex; gap: 18px; align-items: baseline; margin-bottom: 18px; }
  .sec-num { font-family: var(--mono); font-size: 12px; letter-spacing: .14em; color: var(--ink-faint); }
  section h2 { font-family: var(--display); font-weight: 400; font-size: clamp(36px, 4.5vw, 56px); line-height: 1.04; letter-spacing: -.005em; margin: 0; }
  section .lead { color: var(--ink-soft); margin: 0 0 32px; max-width: 60ch; font-size: 17px; }
  .sub { font-family: var(--display); font-weight: 400; font-size: 22px; margin: 36px 0 14px; }

  /* — Meta grid — */
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px 32px; padding: 0; margin: 0 0 24px; }
  .meta-grid > div { padding: 0; }
  .meta-grid dt { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-faint); margin-bottom: 4px; }
  .meta-grid dd { margin: 0; font-size: 15px; }

  /* — Color section — */
  .brand-color { padding: 18px 0; border-top: 1px solid var(--rule); }
  .brand-color:last-of-type { border-bottom: 1px solid var(--rule); }
  .brand-color h4 { font-family: var(--display); font-weight: 400; font-size: 22px; margin: 0 0 14px; }
  .color-row { display: grid; grid-template-columns: minmax(140px, 1fr) 2fr; gap: 24px; align-items: stretch; }
  @media (max-width: 640px) { .color-row { grid-template-columns: 1fr; } }
  .swatch-large { min-height: 96px; border-radius: 6px; display: flex; align-items: flex-end; justify-content: flex-start; padding: 14px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }
  .swatch-large span { font-family: var(--mono); font-size: 13px; opacity: 0.92; }
  .color-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 18px; padding: 0; margin: 0; }
  .color-meta div { padding: 0; }
  .color-meta dt { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-faint); margin-bottom: 2px; }
  .color-meta dd { margin: 0; font-size: 14px; }

  .palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
  .mini-swatch { aspect-ratio: 1.6 / 1; border-radius: 6px; padding: 10px; display: flex; align-items: flex-end; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }
  .mini-swatch code { font-size: 11px; opacity: 0.92; }

  .callout { margin-top: 32px; padding: 18px 22px; background: rgba(0,0,0,.03); border-left: 3px solid var(--accent); border-radius: 4px; }
  [data-theme="dark"] .callout { background: rgba(255,255,255,.04); }
  .callout-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-faint); display: block; margin-bottom: 4px; }
  .callout p { margin: 0; }

  /* — Logo — */
  .logo-card { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: center; padding: 24px 0; }
  @media (max-width: 640px) { .logo-card { grid-template-columns: 1fr; } }
  .logo-canvas { aspect-ratio: 16 / 9; background: rgba(0,0,0,.03); border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 32px; box-shadow: inset 0 0 0 1px var(--rule); }
  [data-theme="dark"] .logo-canvas { background: rgba(255,255,255,.04); }
  .logo-canvas svg { max-width: 60%; max-height: 80%; }
  .logo-placeholder { font-family: var(--display); font-size: 40px; color: var(--ink-soft); }
  .logo-meta { grid-template-columns: 1fr; }

  /* — Type — */
  .specimen { padding: 24px 0; }
  .spec-line { line-height: 1.05; margin: 0 0 14px; letter-spacing: -.01em; }
  .scale-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .scale-table th, .scale-table td { padding: 12px 6px; text-align: left; border-bottom: 1px solid var(--rule); vertical-align: middle; }
  .scale-table th { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-faint); }

  /* — Spacing rhythm — */
  .rhythm { display: flex; flex-direction: column; gap: 6px; padding: 12px 0; }
  .rhythm-bar { height: 16px; background: var(--accent); opacity: .82; border-radius: 2px; display: flex; align-items: center; padding-left: 10px; }
  .rhythm-bar span { font-family: var(--mono); font-size: 10px; color: var(--paper); mix-blend-mode: difference; filter: invert(1); }

  /* — Shape — */
  .radii-row, .shadows-row, .motion-row, .icon-grid { display: grid; gap: 16px; }
  .radii-row { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
  .shadows-row { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .motion-row { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .icon-grid { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); }
  .radius-card, .shadow-card, .motion-card { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
  .radius-block { width: 80px; height: 80px; background: var(--accent); }
  .shadow-block { width: 100%; height: 80px; background: var(--paper); border-radius: 8px; }
  [data-theme="dark"] .shadow-block { background: rgba(255,255,255,.06); }
  .motion-dot { width: 28px; height: 28px; border-radius: 999px; background: var(--accent); animation: pulse var(--dur, 600ms) ease-in-out infinite alternate; }
  @keyframes pulse { from { transform: scale(.7); } to { transform: scale(1.2); } }
  .icon-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid var(--rule); border-radius: 6px; padding: 10px; }
  .icon-cell svg { width: 100%; height: 100%; }
  .easings { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 12px; }
  .easings li { padding: 6px 12px; background: rgba(0,0,0,.03); border-radius: 4px; font-size: 12px; }
  [data-theme="dark"] .easings li { background: rgba(255,255,255,.04); }

  /* — Components — */
  .component-card { padding: 18px 0; border-top: 1px solid var(--rule); }
  .component-card:last-of-type { border-bottom: 1px solid var(--rule); }
  .component-card h4 { font-family: var(--display); font-weight: 400; font-size: 22px; margin: 0 0 14px; }

  /* — Voice — */
  .cta-verbs { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px 14px; }
  .cta-verbs li { padding: 6px 12px; background: rgba(0,0,0,.03); border-radius: 4px; font-size: 13px; }
  [data-theme="dark"] .cta-verbs li { background: rgba(255,255,255,.04); }
  .quotes { list-style: none; padding: 0; margin: 0; }
  .quotes li { font-family: var(--display); font-size: 22px; padding: 14px 0; border-top: 1px solid var(--rule); color: var(--ink-soft); font-style: italic; }
  .quotes li:last-child { border-bottom: 1px solid var(--rule); }

  /* — Remediation — */
  .remediation { list-style: none; padding: 0; margin: 0; }
  .remediation li { padding: 10px 0; border-top: 1px solid var(--rule); display: flex; gap: 10px; align-items: baseline; }
  .remediation li:last-child { border-bottom: 1px solid var(--rule); }

  /* — Code blocks — */
  .codeblock { background: rgba(0,0,0,.04); border-radius: 6px; padding: 16px 18px; overflow-x: auto; font-family: var(--mono); font-size: 12px; line-height: 1.6; margin: 0 0 14px; }
  [data-theme="dark"] .codeblock { background: rgba(255,255,255,.05); }

  /* — Usage — */
  .usage-list { padding: 0; margin: 0; counter-reset: rule; list-style: none; }
  .usage-list li { padding: 18px 0; border-top: 1px solid var(--rule); position: relative; padding-left: 56px; counter-increment: rule; }
  .usage-list li:last-child { border-bottom: 1px solid var(--rule); }
  .usage-list li::before { content: counter(rule, decimal-leading-zero); position: absolute; left: 0; top: 22px; font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }

  /* — Footer — */
  footer { padding: 48px 0 0; font-size: 13px; color: var(--ink-soft); display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 16px; }
  footer .sig { font-family: var(--display); font-size: 22px; color: var(--ink); }
  footer .stamp { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }

  /* — Print — */
  @media print {
    body { background: white; color: black; }
    .topbar nav, .theme-btn { display: none; }
    section, .cover, .toc { page-break-inside: avoid; border-color: #ddd; }
    .toc { page-break-after: always; }
    .cover { page-break-after: always; }
    .scale-table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <header class="topbar">
      <div class="brand"><a href="https://designlang.app">designlang</a></div>
      <nav>
        <span>Brand Guidelines</span>
        <button class="theme-btn" id="themeBtn" type="button">Theme</button>
      </nav>
    </header>

    ${buildCover(design)}
    ${buildToc()}
    ${buildAbout(design)}
    ${buildLogo(design)}
    ${buildColor(design)}
    ${buildType(design)}
    ${buildSpacing(design)}
    ${buildShape(design)}
    ${buildIconography(design)}
    ${buildMotion(design)}
    ${buildComponents(design)}
    ${buildVoice(design)}
    ${buildAccessibility(design)}
    ${buildTokens(design)}
    ${buildUsage(design)}

    <footer>
      <div>
        <div class="sig">designlang</div>
        <div>Re-run: <code>npx designlang brand ${esc(host(design.meta?.url) || '<url>')}</code></div>
      </div>
      <div class="stamp">${esc(new Date(design.meta?.timestamp || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))} · v${esc(opts.version || '')}</div>
    </footer>
  </div>

  <script>
    (function () {
      var btn = document.getElementById('themeBtn');
      var saved = null;
      try { saved = localStorage.getItem('dl-theme'); } catch (e) {}
      if (saved) document.documentElement.setAttribute('data-theme', saved);
      btn && btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? '' : 'dark';
        if (cur) document.documentElement.setAttribute('data-theme', cur);
        else document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('dl-theme', cur); } catch (e) {}
      });
    })();
  </script>
</body>
</html>`;
}

export function formatBrandBookMarkdown(design) {
  const meta = design.meta || {};
  const hostName = host(meta.url);
  const date = new Date(meta.timestamp || Date.now()).toISOString().slice(0, 10);
  const colors = design.colors || {};
  const t = design.typography || {};
  const families = (t.families || []).map(familyName).filter(Boolean);
  const lines = [
    `# ${hostName} — Brand guidelines`,
    ``,
    `_Generated by designlang on ${date}._`,
    ``,
    `## 01 · About`,
    ``,
    `- Page intent: ${design.pageIntent?.type || 'unknown'}`,
    `- Material language: ${design.materialLanguage?.label || 'unknown'}`,
    `- Component library: ${design.componentLibrary?.library || 'unknown'}`,
    `- Voice tone: ${design.voice?.tone || 'neutral'}`,
    ``,
    `## 03 · Colour`,
    ``,
    colors.primary?.hex ? `- **Primary:** \`${colors.primary.hex}\`` : '- Primary: —',
    colors.secondary?.hex ? `- **Secondary:** \`${colors.secondary.hex}\`` : null,
    colors.accent?.hex ? `- **Accent:** \`${colors.accent.hex}\`` : null,
    `- ${(colors.all || []).length} total colours`,
    ``,
    `## 04 · Typography`,
    ``,
    `- Display: ${families[0] || '—'}`,
    `- Body: ${families[1] || families[0] || '—'}`,
    `- Scale: ${(t.scale || []).length} sizes`,
    ``,
    `## 05 · Spacing`,
    ``,
    `- Base unit: ${design.spacing?.base ? design.spacing.base + 'px' : '—'}`,
    `- Scale length: ${(design.spacing?.scale || []).length}`,
    ``,
    `## 11 · Accessibility`,
    ``,
    `- WCAG score: ${design.accessibility?.score ?? '—'}%`,
    `- Failing pairs: ${design.accessibility?.failCount ?? '—'}`,
    ``,
    `---`,
    `_Re-run: \`npx designlang brand ${hostName}\`_`,
  ].filter(Boolean);
  return lines.join('\n');
}
