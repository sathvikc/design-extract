import { SITE_URL } from './seo-config';

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: '',                       priority: 1.0,  freq: 'daily'   },
    { path: '/features',              priority: 0.9,  freq: 'weekly'  },
    { path: '/gallery',               priority: 0.9,  freq: 'hourly'  },
    { path: '/spec',                  priority: 0.9,  freq: 'monthly' },
    { path: '/vs/design-extractor',   priority: 0.9,  freq: 'weekly'  },
  ];
  return routes.map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
