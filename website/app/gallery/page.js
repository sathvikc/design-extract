import { listRecent } from '../../lib/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

export const metadata = {
  title: 'Gallery — design systems extracted by designlang',
  description:
    'Public gallery of recent extractions. Every entry is a permalink: tap a card to read the DESIGN.md, browse DTCG tokens, copy the Tailwind config, or download the full bundle.',
  alternates: { canonical: 'https://designlang.app/gallery' },
  openGraph: { title: 'designlang gallery', description: 'Recent extractions — every card is a shareable permalink.' },
};

function relTime(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function host(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

export default async function Gallery() {
  const entries = await listRecent(48);

  return (
    <main>
      <section className="section" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="wrap">
          <p className="eyebrow">gallery</p>
          <h1 className="h1" style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', maxWidth: '14ch' }}>
            Every extraction, a permalink.
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            A live feed of sites people have run through designlang. Each card opens a full
            shareable view — DESIGN.md, DTCG tokens, Tailwind, every output, copy &amp; download.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          {entries.length === 0 ? (
            <div className="card" style={{ padding: '36px 32px', textAlign: 'center' }}>
              <p className="lede" style={{ margin: '0 auto 18px' }}>
                No recent extractions yet. Be the first.
              </p>
              <a href="/" className="btn btn-primary">Run an extraction</a>
            </div>
          ) : (
            <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {entries.map((e) => {
                const palette = [e.primary, e.secondary, e.accent, e.foreground, e.background].filter(Boolean);
                const a = palette[0] || '#7f1d1d';
                const b = palette[palette.length - 1] || '#000';
                return (
                  <a key={e.hash} href={`/x/${e.hash}`} className="gal-card" style={{ aspectRatio: 'auto', display: 'block' }}>
                    <div style={{ display: 'flex', height: 110 }}>
                      {palette.length > 0 ? palette.map((c, i) => (
                        <div key={i} style={{ flex: 1, background: c }} />
                      )) : (
                        <div style={{ flex: 1, background: `linear-gradient(135deg, ${a}, ${b})` }} />
                      )}
                    </div>
                    <div style={{ padding: '14px 16px 16px' }}>
                      <div className="h3" style={{ fontSize: 16, marginBottom: 4 }}>{host(e.url)}</div>
                      <div className="mono faint" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                        {[e.intent, e.material, e.library].filter((x) => x && x !== 'unknown').join(' · ') || '—'}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-2)', display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--hairline)' }}>
                        <span>{e.colors} colors</span>
                        <span className="faint">{relTime(e.generatedAt)}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
