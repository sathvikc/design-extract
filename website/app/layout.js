import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import StructuredData from './components/StructuredData';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from './seo-config';
import './globals.css';

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s — designlang',
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Manav Arya Singh', url: 'https://manavaryasingh.com' }],
  creator: 'Manav Arya Singh',
  publisher: 'Manav Arya Singh',
  applicationName: SITE_NAME,
  category: 'developer tools',
  generator: 'Next.js',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'designlang', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
    creator: '@manavaryasingh',
    site: '@manavaryasingh',
  },
  robots: {
    index: true, follow: true, nocache: false,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport = {
  themeColor: '#120F17',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

async function fetchStars() {
  try {
    const res = await fetch('https://api.github.com/repos/Manavarya09/design-extract', {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'designlang-website' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

function formatStars(n) {
  if (n == null) return '—';
  if (n < 1000) return String(n);
  const k = n / 1000;
  return (k >= 10 ? k.toFixed(0) : k.toFixed(1)) + 'k';
}

async function Nav() {
  const stars = await fetchStars();
  return (
    <div className="nav-wrap">
      <header className="nav" role="banner">
        <a href="/" className="nav-brand" aria-label="designlang home">
          <span className="nav-mark" aria-hidden>
            <span className="nav-mark-dot" />
          </span>
          <span className="nav-wordmark">designlang</span>
          <span className="nav-version mono">v12.11</span>
        </a>

        <nav className="nav-pillnav" aria-label="primary">
          <a href="/features"><span>Features</span></a>
          <a href="/gallery"><span>Gallery</span></a>
          <a href="/spec"><span>Spec</span></a>
          <a href="/vs/design-extractor"><span>vs</span></a>
        </nav>

        <div className="nav-right">
          <a
            href="https://github.com/Manavarya09/design-extract"
            target="_blank"
            rel="noreferrer"
            className="nav-stars"
            aria-label={`Star designlang on GitHub (${stars ?? 'unknown'} stars)`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="mono">{formatStars(stars)}</span>
          </a>
          <a href="https://www.npmjs.com/package/designlang" target="_blank" rel="noreferrer" className="nav-cta">
            <span>npm i designlang</span>
            <span className="nav-cta-glyph" aria-hidden>↗</span>
          </a>
        </div>
      </header>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="stack" style={{ gap: 8 }}>
          <span className="mono" style={{ color: '#fff' }}>designlang</span>
          <span className="faint">Reverse-engineer any website into a complete design system.</span>
          <span className="faint mono" style={{ fontSize: 11, letterSpacing: '0.06em' }}>v12.11.0 · built by Manav Arya Singh</span>
        </div>
        <div className="cols">
          <div className="col">
            <span className="col-title">Product</span>
            <a href="/features">Features</a>
            <a href="/gallery">Gallery</a>
            <a href="/spec">Spec</a>
            <a href="/vs/design-extractor">Compare</a>
          </div>
          <div className="col">
            <span className="col-title">Resources</span>
            <a href="https://github.com/Manavarya09/design-extract" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.npmjs.com/package/designlang" target="_blank" rel="noreferrer">npm</a>
            <a href="/llms.txt">llms.txt</a>
          </div>
          <div className="col">
            <span className="col-title">Author</span>
            <a href="https://manavaryasingh.com" target="_blank" rel="noreferrer">manavaryasingh.com</a>
            <a href="https://github.com/Manavarya09" target="_blank" rel="noreferrer">github</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="author" href="https://manavaryasingh.com" />
        <link rel="me" href="https://github.com/Manavarya09" />
        <StructuredData />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
