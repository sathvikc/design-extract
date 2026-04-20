import { describe, it } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { extractMotion } from '../src/extractors/motion.js';
import { extractComponentAnatomy, formatAnatomyStubs } from '../src/extractors/component-anatomy.js';
import { extractVoice } from '../src/extractors/voice.js';
import { lintTokens } from '../src/lint.js';
import { formatMotionTokens } from '../src/formatters/motion-tokens.js';

describe('v9: motion extractor', () => {
  it('buckets durations into named tokens', () => {
    const styles = [
      { transition: 'opacity 200ms ease-out', animation: 'none' },
      { transition: 'transform 400ms cubic-bezier(0.2, 0, 0, 1.4)', animation: 'none' },
      { transition: 'color 80ms linear', animation: 'none' },
    ];
    const m = extractMotion(styles, []);
    const names = m.durations.map(d => d.name);
    assert.ok(names.includes('sm'));
    assert.ok(names.includes('md'));
    assert.ok(m.springs.length >= 1, 'detects overshoot cubic-bezier as spring');
  });

  it('detects scroll-linked signals', () => {
    const styles = [{ transition: 'none', animation: 'none', animationTimeline: 'view()' }];
    const m = extractMotion(styles, []);
    assert.equal(m.scrollLinked.present, true);
  });

  it('emits DTCG-ish motion tokens JSON', () => {
    const m = extractMotion([{ transition: 'opacity 250ms ease-out' }], []);
    const json = JSON.parse(formatMotionTokens(m));
    assert.ok(json.duration);
    assert.ok(json.easing);
  });
});

describe('v9: component anatomy', () => {
  const candidates = [
    { kind: 'button', variantHint: 'primary', sizeHint: 'md', text: 'Get started', slots: [{ role: 'icon' }, { role: 'content' }], structuralHash: 'button>svg>span', styleVector: [], css: {} },
    { kind: 'button', variantHint: 'primary', sizeHint: 'md', text: 'Start free trial', slots: [{ role: 'icon' }, { role: 'content' }], structuralHash: 'button>svg>span', styleVector: [], css: {} },
    { kind: 'button', variantHint: 'secondary', sizeHint: 'sm', text: 'Learn more', slots: [{ role: 'content' }], structuralHash: 'button>span', styleVector: [], css: {} },
    { kind: 'button', variantHint: '', sizeHint: '', disabled: true, text: '', slots: [], structuralHash: 'button', styleVector: [], css: {} },
  ];

  it('collapses instances to variant × size matrix', () => {
    const a = extractComponentAnatomy(candidates);
    assert.equal(a.length, 1);
    assert.equal(a[0].kind, 'button');
    assert.ok(a[0].variants.length >= 2);
    assert.ok(a[0].props.variant.includes('primary'));
  });

  it('formats typed React stubs', () => {
    const a = extractComponentAnatomy(candidates);
    const src = formatAnatomyStubs(a);
    assert.match(src, /export interface ButtonProps/);
    assert.match(src, /variant\?:/);
  });
});

describe('v9: voice extractor', () => {
  it('picks tone + top CTA verbs', () => {
    const data = {
      componentCandidates: [
        { kind: 'button', text: 'Get started free' },
        { kind: 'button', text: 'Get the docs' },
        { kind: 'link', text: 'Learn more about our API' },
      ],
      sections: [
        { headings: ['Ship faster with our platform'], text: "You'll love how we handle the hard stuff." },
      ],
    };
    const v = extractVoice(data);
    assert.ok(v.ctaVerbs.some(c => c.value === 'get'));
    assert.notEqual(v.tone, 'unknown');
  });
});

describe('v9: token lint', () => {
  it('flags color sprawl + contrast fails in a flat token file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'designlang-lint-'));
    const file = join(dir, 'tokens.json');
    const tokens = {
      colors: {
        'primary': '#0A0908',
        'primary-2': '#0A0909', // near-duplicate
        'text': '#888888',
        'bg': '#999999', // fails AA
      },
      spacing: { xs: '2px', sm: '4px', md: '8px', lg: '16px' },
      radii: { sm: '4px', md: '8px' },
    };
    writeFileSync(file, JSON.stringify(tokens));
    const r = lintTokens(file);
    assert.ok(r.findings.some(f => f.rule === 'color-sprawl'));
    assert.ok(r.findings.some(f => f.rule === 'contrast-wcag-aa'));
    assert.ok(typeof r.score === 'number');
  });
});
