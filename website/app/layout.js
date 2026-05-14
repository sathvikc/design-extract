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

function Nav() {
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
          <a href="https://github.com/Manavarya09/design-extract" target="_blank" rel="noreferrer" className="nav-stars" aria-label="GitHub stars">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
            </svg>
            <span className="mono">412</span>
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
