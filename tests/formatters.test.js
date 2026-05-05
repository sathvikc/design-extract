import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { formatMarkdown } from '../src/formatters/markdown.js';
import { formatTokens } from '../src/formatters/tokens.js';
import { formatTailwind } from '../src/formatters/tailwind.js';
import { formatCssVars } from '../src/formatters/css-vars.js';
import { formatPreview } from '../src/formatters/preview.js';
import { formatFigma } from '../src/formatters/figma.js';
import { formatReactTheme, formatShadcnTheme } from '../src/formatters/theme.js';
import { formatDtcgTokens } from '../src/formatters/dtcg-tokens.js';
import { resolveRef } from '../src/formatters/_token-ref.js';
import { formatIosSwiftUI } from '../src/formatters/ios-swiftui.js';
import { formatAndroidCompose } from '../src/formatters/android-compose.js';
import { formatFlutterDart } from '../src/formatters/flutter-dart.js';
import { formatWordPressTheme } from '../src/formatters/wordpress.js';
import { formatAgentRules } from '../src/formatters/agent-rules.js';
import { formatGrade, formatGradeMarkdown } from '../src/formatters/grade.js';
import { formatBattle, formatBattleMarkdown, compareScores } from '../src/formatters/battle.js';
import { formatBadge, formatScoreBadge } from '../src/formatters/badge.js';
import { formatRemix } from '../src/formatters/remix.js';
import { VOCABULARIES, getVocabulary, listVocabularies } from '../src/vocabularies/index.js';

// ── Shared mock design object ───────────────────────────────────

const mockDesign = {
  meta: {
    url: 'https://example.com',
    title: 'Test Site',
    timestamp: new Date().toISOString(),
    elementCount: 100,
    pagesAnalyzed: 1,
  },
  colors: {
    primary: { hex: '#0066cc', rgb: { r: 0, g: 102, b: 204 }, hsl: { h: 210, s: 100, l: 40 }, count: 50 },
    secondary: { hex: '#cc6600', rgb: { r: 204, g: 102, b: 0 }, hsl: { h: 30, s: 100, l: 40 }, count: 25 },
    accent: { hex: '#00cc66', rgb: { r: 0, g: 204, b: 102 }, hsl: { h: 150, s: 100, l: 40 }, count: 10 },
    neutrals: [
      { hex: '#333333', rgb: { r: 51, g: 51, b: 51 }, hsl: { h: 0, s: 0, l: 20 }, count: 30 },
      { hex: '#666666', rgb: { r: 102, g: 102, b: 102 }, hsl: { h: 0, s: 0, l: 40 }, count: 20 },
    ],
    backgrounds: ['#ffffff', '#f5f5f5'],
    text: ['#333333', '#666666'],
    gradients: ['linear-gradient(to right, #0066cc, #00cc66)'],
    all: [
      { hex: '#0066cc', rgb: { r: 0, g: 102, b: 204 }, hsl: { h: 210, s: 100, l: 40 }, count: 50, contexts: ['text', 'background'] },
      { hex: '#333333', rgb: { r: 51, g: 51, b: 51 }, hsl: { h: 0, s: 0, l: 20 }, count: 30, contexts: ['text'] },
    ],
  },
  typography: {
    families: [
      { name: 'Inter', count: 80, usage: 'all' },
      { name: 'Playfair Display', count: 20, usage: 'headings' },
    ],
    scale: [
      { size: 48, weight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', tags: ['h1'], count: 5 },
      { size: 36, weight: '700', lineHeight: '1.3', letterSpacing: 'normal', tags: ['h2'], count: 8 },
      { size: 24, weight: '600', lineHeight: '1.4', letterSpacing: 'normal', tags: ['h3'], count: 12 },
      { size: 16, weight: '400', lineHeight: '1.5', letterSpacing: 'normal', tags: ['p', 'span'], count: 60 },
    ],
    headings: [
      { size: 48, weight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', tags: ['h1'], count: 5 },
      { size: 36, weight: '700', lineHeight: '1.3', letterSpacing: 'normal', tags: ['h2'], count: 8 },
    ],
    body: { size: 16, weight: '400', lineHeight: '1.5', letterSpacing: 'normal', tags: ['p'], count: 60 },
    weights: [{ weight: '400', count: 60 }, { weight: '600', count: 12 }, { weight: '700', count: 13 }],
  },
  spacing: {
    base: 4,
    scale: [4, 8, 12, 16, 24, 32, 48, 64],
    tokens: { '1': '4px', '2': '8px', '3': '12px', '4': '16px', '6': '24px', '8': '32px', '12': '48px', '16': '64px' },
    raw: [4, 8, 12, 16, 24, 32, 48, 64],
  },
  shadows: {
    values: [
      { raw: '0 1px 3px rgba(0,0,0,0.1)', blur: 3, inset: false, label: 'sm' },
      { raw: '0 4px 12px rgba(0,0,0,0.15)', blur: 12, inset: false, label: 'md' },
    ],
  },
  borders: {
    radii: [
      { value: 4, label: 'sm', count: 20 },
      { value: 8, label: 'md', count: 15 },
      { value: 16, label: 'lg', count: 5 },
    ],
    widths: [1, 2],
    styles: ['solid'],
  },
  variables: { colors: { '--color-primary': '#0066cc' }, spacing: {}, typography: {} },
  breakpoints: [
    { value: 640, label: 'mobile', type: 'min-width' },
    { value: 768, label: 'tablet', type: 'min-width' },
    { value: 1024, label: 'desktop', type: 'min-width' },
  ],
  animations: {
    transitions: ['all 0.2s ease', 'opacity 0.3s ease-in-out'],
    keyframes: [],
    easings: ['ease', 'ease-in-out'],
    durations: ['0.2s', '0.3s'],
  },
  components: {
    buttons: {
      count: 10,
      baseStyle: { backgroundColor: '#0066cc', color: '#ffffff', borderRadius: '4px', fontSize: '14px' },
    },
  },
  accessibility: { score: 90, passCount: 45, failCount: 5, totalPairs: 50, pairs: [] },
  layout: {
    gridCount: 5,
    flexCount: 20,
    gridColumns: [{ columns: 3, count: 5 }],
    flexDirections: { 'row/nowrap': 15, 'column/nowrap': 5 },
    justifyPatterns: {},
    alignPatterns: {},
    containerWidths: [{ maxWidth: '1200px', padding: '16px' }],
    gaps: ['16px', '24px'],
    topGrids: [{ columns: 'repeat(3, 1fr)', rows: 'none', gap: '24px' }],
    topFlex: [],
  },
  gradients: { count: 0, gradients: [] },
  zIndex: { allValues: [], layers: [], issues: [], scale: [] },
  icons: { icons: [], count: 0 },
  fonts: { fonts: [], systemFonts: [] },
  images: { patterns: [], aspectRatios: [] },
  componentScreenshots: {},
  score: {
    overall: 85,
    grade: 'B',
    scores: {
      colorDiscipline: 85,
      typographyConsistency: 100,
      spacingSystem: 90,
      shadowConsistency: 100,
      radiusConsistency: 100,
      accessibility: 90,
      tokenization: 50,
    },
    issues: ['No CSS custom properties found'],
    strengths: ['Tight, disciplined color palette'],
  },
};

// ── formatMarkdown ──────────────────────────────────────────────

describe('formatMarkdown', () => {
  it('returns a string', () => {
    const result = formatMarkdown(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('contains the site title', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('Test Site'));
  });

  it('contains color palette section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Color Palette'));
  });

  it('contains typography section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Typography'));
  });

  it('contains spacing section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Spacing'));
  });

  it('contains the primary color hex', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('#0066cc'));
  });

  it('contains font family names', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('Inter'));
  });

  it('contains component patterns section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Component Patterns'));
  });

  it('contains design system score section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Design System Score'));
  });

  it('contains layout section', () => {
    const result = formatMarkdown(mockDesign);
    assert.ok(result.includes('## Layout System'));
  });
});

// ── formatTokens ────────────────────────────────────────────────

describe('formatTokens', () => {
  it('returns valid JSON', () => {
    const result = formatTokens(mockDesign);
    const parsed = JSON.parse(result);
    assert.ok(typeof parsed === 'object');
  });

  it('contains color tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.color);
    assert.ok(parsed.color.primary);
    assert.equal(parsed.color.primary.$value, '#0066cc');
    assert.equal(parsed.color.primary.$type, 'color');
  });

  it('contains fontFamily tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.fontFamily);
  });

  it('contains spacing tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.spacing);
  });

  it('contains borderRadius tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.borderRadius);
    assert.ok(parsed.borderRadius.sm);
  });

  it('contains shadow tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.shadow);
    assert.ok(parsed.shadow.sm);
  });

  it('contains breakpoint tokens', () => {
    const parsed = JSON.parse(formatTokens(mockDesign));
    assert.ok(parsed.breakpoint);
  });
});

// ── formatDtcgTokens ────────────────────────────────────────────

describe('formatDtcgTokens', () => {
  const minimalDesign = {
    colors: { primary: '#3b82f6', secondary: '#10b981', neutrals: ['#111','#888','#eee'], backgrounds: ['#fff'], text: ['#111'], all: [] },
    typography: { families: ['Inter'], scale: [{ size:'16px', weight:'400', lineHeight:'1.5' }] },
    spacing: { scale: ['4px','8px','16px'], base: '4px' },
    shadows: { values: ['0 1px 2px rgba(0,0,0,0.1)'] },
    borders: { radii: ['4px','8px'] },
    variables: {},
  };

  it('emits $value/$type for every leaf', () => {
    const out = formatDtcgTokens(minimalDesign);
    assert.equal(out.primitive.color.brand.primary.$value, '#3b82f6');
    assert.equal(out.primitive.color.brand.primary.$type, 'color');
  });

  it('emits semantic aliases referencing primitives', () => {
    const out = formatDtcgTokens(minimalDesign);
    assert.match(out.semantic.color.action.primary.$value, /^\{primitive\.color\.brand\.primary\}$/);
    assert.equal(out.semantic.color.action.primary.$type, 'color');
  });

  it('emits composite typography tokens', () => {
    const out = formatDtcgTokens(minimalDesign);
    const body = out.semantic.typography.body;
    assert.equal(body.$type, 'typography');
    assert.equal(body.$value.fontFamily, 'Inter');
    assert.equal(body.$value.fontSize, '16px');
  });

  it('round-trips through JSON unchanged', () => {
    const out = formatDtcgTokens(minimalDesign);
    assert.deepEqual(JSON.parse(JSON.stringify(out)), out);
  });
});

// ── formatTailwind ──────────────────────────────────────────────

describe('formatTailwind', () => {
  it('returns a string', () => {
    const result = formatTailwind(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('contains export default', () => {
    const result = formatTailwind(mockDesign);
    assert.ok(result.includes('export default'));
  });

  it('contains primary color', () => {
    const result = formatTailwind(mockDesign);
    assert.ok(result.includes('#0066cc'));
  });

  it('contains font family', () => {
    const result = formatTailwind(mockDesign);
    assert.ok(result.includes('Inter'));
  });

  it('contains spacing values', () => {
    const result = formatTailwind(mockDesign);
    assert.ok(result.includes('4px'));
  });

  it('contains screen breakpoints', () => {
    const result = formatTailwind(mockDesign);
    assert.ok(result.includes('768px'));
  });
});

// ── formatCssVars ───────────────────────────────────────────────

describe('formatCssVars', () => {
  it('returns a string', () => {
    const result = formatCssVars(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('starts with :root {', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.startsWith(':root {'));
  });

  it('ends with closing brace', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.trimEnd().endsWith('}'));
  });

  it('contains color variables', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.includes('--color-primary: #0066cc;'));
  });

  it('contains spacing variables', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.includes('--spacing-'));
  });

  it('contains font variables', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.includes('--font-'));
  });

  it('contains radius variables', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.includes('--radius-'));
  });

  it('contains shadow variables', () => {
    const result = formatCssVars(mockDesign);
    assert.ok(result.includes('--shadow-'));
  });
});

// ── formatPreview ───────────────────────────────────────────────

describe('formatPreview', () => {
  it('returns a string', () => {
    const result = formatPreview(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('returns valid HTML with doctype', () => {
    const result = formatPreview(mockDesign);
    assert.ok(result.includes('<!DOCTYPE html>'));
  });

  it('contains html and body tags', () => {
    const result = formatPreview(mockDesign);
    assert.ok(result.includes('<html'));
    assert.ok(result.includes('<body>'));
    assert.ok(result.includes('</body>'));
    assert.ok(result.includes('</html>'));
  });

  it('contains the site title', () => {
    const result = formatPreview(mockDesign);
    assert.ok(result.includes('Test Site'));
  });

  it('contains color swatches section', () => {
    const result = formatPreview(mockDesign);
    assert.ok(result.includes('Color Palette'));
  });

  it('contains typography section', () => {
    const result = formatPreview(mockDesign);
    assert.ok(result.includes('Typography'));
  });
});

// ── formatFigma ─────────────────────────────────────────────────

describe('formatFigma', () => {
  it('returns valid JSON', () => {
    const result = formatFigma(mockDesign);
    const parsed = JSON.parse(result);
    assert.ok(typeof parsed === 'object');
  });

  it('has collections array with Brand collection', () => {
    const parsed = JSON.parse(formatFigma(mockDesign));
    assert.ok(Array.isArray(parsed.collections));
    const brand = parsed.collections.find(c => c.name === 'Brand');
    assert.ok(brand);
    assert.ok(Array.isArray(brand.modes));
    assert.ok(brand.variables.length > 0);
  });

  it('has Typography and Spacing collections', () => {
    const parsed = JSON.parse(formatFigma(mockDesign));
    const typo = parsed.collections.find(c => c.name === 'Typography');
    const spacing = parsed.collections.find(c => c.name === 'Spacing');
    assert.ok(typo);
    assert.ok(spacing);
    assert.ok(typo.variables.length > 0);
    assert.ok(spacing.variables.length > 0);
  });

  it('contains color variables with normalized RGB in light mode', () => {
    const parsed = JSON.parse(formatFigma(mockDesign));
    const brand = parsed.collections.find(c => c.name === 'Brand');
    const primary = brand.variables.find(v => v.name === 'color/primary');
    assert.ok(primary);
    assert.ok(primary.values.light.r >= 0 && primary.values.light.r <= 1);
  });

  it('contains spacing variables', () => {
    const parsed = JSON.parse(formatFigma(mockDesign));
    const spacing = parsed.collections.find(c => c.name === 'Spacing');
    const spacingVars = spacing.variables.filter(v => v.name.startsWith('spacing/'));
    assert.ok(spacingVars.length > 0);
  });

  it('contains radius variables', () => {
    const parsed = JSON.parse(formatFigma(mockDesign));
    const spacing = parsed.collections.find(c => c.name === 'Spacing');
    const radiusVars = spacing.variables.filter(v => v.name.startsWith('radius/'));
    assert.ok(radiusVars.length > 0);
  });
});

// ── formatReactTheme ────────────────────────────────────────────

describe('formatReactTheme', () => {
  it('returns a string', () => {
    const result = formatReactTheme(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('contains export const theme', () => {
    const result = formatReactTheme(mockDesign);
    assert.ok(result.includes('export const theme'));
  });

  it('contains export default theme', () => {
    const result = formatReactTheme(mockDesign);
    assert.ok(result.includes('export default theme'));
  });

  it('contains the primary color', () => {
    const result = formatReactTheme(mockDesign);
    assert.ok(result.includes('#0066cc'));
  });

  it('contains font family', () => {
    const result = formatReactTheme(mockDesign);
    assert.ok(result.includes('Inter'));
  });

  it('contains spacing values', () => {
    const result = formatReactTheme(mockDesign);
    assert.ok(result.includes('4px'));
  });

  it('contains the embedded JSON as valid JS', () => {
    const result = formatReactTheme(mockDesign);
    // Extract the JSON object from the template
    const jsonMatch = result.match(/export const theme = ({[\s\S]+?});/);
    assert.ok(jsonMatch, 'Should contain a theme object');
    // The JSON should be parseable
    const parsed = JSON.parse(jsonMatch[1]);
    assert.ok(parsed.colors);
    assert.ok(parsed.fonts);
  });
});

// ── formatShadcnTheme ───────────────────────────────────────────

describe('formatShadcnTheme', () => {
  it('returns a string', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.equal(typeof result, 'string');
  });

  it('contains @layer base', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes('@layer base'));
  });

  it('contains :root', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes(':root'));
  });

  it('contains --primary variable', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes('--primary:'));
  });

  it('contains --background variable', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes('--background:'));
  });

  it('contains --radius variable', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes('--radius:'));
  });

  it('contains shadcn/ui comment', () => {
    const result = formatShadcnTheme(mockDesign);
    assert.ok(result.includes('shadcn/ui'));
  });
});

// ── resolveRef (token reference helper) ─────────────────────────

describe('resolveRef', () => {
  const tokens = {
    primitive: {
      color: { brand: { primary: { $value: '#3B82F6', $type: 'color' } } },
      spacing: { s0: { $value: '4px', $type: 'dimension' } },
    },
    semantic: {
      color: {
        action: {
          primary: { $value: '{primitive.color.brand.primary}', $type: 'color' },
        },
      },
      alias: {
        ref: { $value: '{semantic.color.action.primary}', $type: 'color' },
      },
    },
  };

  it('returns the raw $value for non-reference tokens', () => {
    assert.equal(resolveRef(tokens, 'primitive.color.brand.primary'), '#3B82F6');
  });

  it('follows one-level references', () => {
    assert.equal(resolveRef(tokens, 'semantic.color.action.primary'), '#3B82F6');
  });

  it('follows chained references', () => {
    assert.equal(resolveRef(tokens, 'semantic.alias.ref'), '#3B82F6');
  });

  it('returns undefined for missing paths', () => {
    assert.equal(resolveRef(tokens, 'primitive.does.not.exist'), undefined);
  });

  it('resolves dimension tokens', () => {
    assert.equal(resolveRef(tokens, 'primitive.spacing.s0'), '4px');
  });
});

// ── formatIosSwiftUI ────────────────────────────────────────────

describe('formatIosSwiftUI', () => {
  const tokens = formatDtcgTokens(mockDesign);

  it('emits import SwiftUI and extension Color', () => {
    const result = formatIosSwiftUI(tokens);
    assert.ok(result.includes('import SwiftUI'));
    assert.ok(result.includes('extension Color'));
  });

  it('emits actionPrimary with resolved primitive hex', () => {
    const result = formatIosSwiftUI(tokens);
    // mockDesign primary is #0066cc → semantic.color.action.primary resolves to #0066cc
    assert.ok(
      /static let actionPrimary = Color\(hex: 0x0066CC\)/.test(result),
      'expected actionPrimary with resolved hex',
    );
  });

  it('resolves semantic references (no raw {...} strings in output)', () => {
    const result = formatIosSwiftUI(tokens);
    assert.ok(!result.includes('{primitive.'), 'should not leak DTCG refs');
  });

  it('is idempotent', () => {
    const a = formatIosSwiftUI(tokens);
    const b = formatIosSwiftUI(tokens);
    assert.equal(a, b);
  });
});

// ── formatAndroidCompose ────────────────────────────────────────

describe('formatAndroidCompose', () => {
  const tokens = formatDtcgTokens(mockDesign);

  it('Theme.kt contains object DesignTokens and ActionPrimary', () => {
    const out = formatAndroidCompose(tokens);
    assert.ok(out['Theme.kt'].includes('object DesignTokens'));
    assert.ok(/val ActionPrimary = Color\(0xFF0066CC\)/.test(out['Theme.kt']));
  });

  it('colors.xml has <color name="action_primary">', () => {
    const out = formatAndroidCompose(tokens);
    assert.ok(out['colors.xml'].includes('<color name="action_primary">#FF0066CC</color>'));
  });

  it('dimens.xml has <dimen name="spacing_s0"> with dp unit', () => {
    const out = formatAndroidCompose(tokens);
    assert.ok(/<dimen name="spacing_s0">\d+dp<\/dimen>/.test(out['dimens.xml']));
  });
});

// ── formatFlutterDart ───────────────────────────────────────────

describe('formatFlutterDart', () => {
  const tokens = formatDtcgTokens(mockDesign);

  it('contains class DesignTokens', () => {
    const out = formatFlutterDart(tokens);
    assert.ok(out.includes('class DesignTokens'));
  });

  it('emits actionPrimary with resolved ARGB hex', () => {
    const out = formatFlutterDart(tokens);
    assert.ok(
      /static const Color actionPrimary = Color\(0xFF0066CC\);/.test(out),
      'expected actionPrimary with resolved hex',
    );
  });
});

// ── formatWordPressTheme (block-theme skeleton) ─────────────────

describe('formatWordPressTheme', () => {
  const tokens = formatDtcgTokens(mockDesign);
  const out = formatWordPressTheme(tokens, mockDesign);

  it('theme.json parses and has color palette with at least one entry', () => {
    const parsed = JSON.parse(out['theme.json']);
    assert.ok(Array.isArray(parsed.settings.color.palette));
    assert.ok(parsed.settings.color.palette.length > 0);
    // At least one entry should have a hex color derived from semantics
    const actionPrimary = parsed.settings.color.palette.find(p => p.slug === 'action-primary');
    assert.ok(actionPrimary);
    assert.equal(actionPrimary.color.toLowerCase(), '#0066cc');
  });

  it('theme.json is version 3', () => {
    const parsed = JSON.parse(out['theme.json']);
    assert.equal(parsed.version, 3);
  });

  it('style.css contains Theme Name and --action-primary custom prop', () => {
    assert.ok(out['style.css'].includes('Theme Name:'));
    assert.ok(out['style.css'].includes('--action-primary:'));
  });

  it('functions.php starts with <?php', () => {
    assert.ok(out['functions.php'].startsWith('<?php'));
  });
});

// ── formatAgentRules ────────────────────────────────────────────

describe('formatAgentRules', () => {
  const tokens = formatDtcgTokens(mockDesign);
  const url = 'https://example.com';
  const designWithRegions = { ...mockDesign, regions: [{ role: 'hero' }, { role: 'footer' }] };
  const out = formatAgentRules({ design: designWithRegions, tokens, url });

  it('emits all four files, each non-empty', () => {
    for (const key of [
      '.cursor/rules/designlang.mdc',
      '.claude/skills/designlang/SKILL.md',
      'CLAUDE.md.fragment',
      'agents.md',
    ]) {
      assert.ok(typeof out[key] === 'string' && out[key].length > 0, `missing ${key}`);
    }
  });

  it('Cursor .mdc begins with frontmatter containing alwaysApply: true', () => {
    const mdc = out['.cursor/rules/designlang.mdc'];
    assert.ok(mdc.startsWith('---'), 'expected frontmatter start');
    const fm = mdc.split('---')[1];
    assert.ok(fm.includes('alwaysApply: true'), 'expected alwaysApply: true');
  });

  it('all four files reference the source URL', () => {
    for (const key of Object.keys(out)) {
      assert.ok(out[key].includes(url), `${key} missing url`);
    }
  });

  it('all four files contain resolved hex for semantic.color.action.primary', () => {
    // mockDesign primary is #0066cc — resolved value should appear verbatim,
    // and the raw DTCG reference must not leak.
    for (const key of Object.keys(out)) {
      assert.ok(out[key].toLowerCase().includes('#0066cc'), `${key} missing resolved hex`);
      assert.ok(!out[key].includes('{primitive.color.brand.primary}'), `${key} leaked raw DTCG ref`);
    }
  });
});

// ── formatGrade (Design Report Card) ───────────────────────────

describe('formatGrade', () => {
  it('returns a self-contained HTML document with the grade letter and score', () => {
    const html = formatGrade(mockDesign, { version: '12.1.0' });
    assert.ok(html.startsWith('<!doctype html>'), 'should be a complete HTML document');
    assert.match(html, /<title>[^<]*Grade B[^<]*<\/title>/);
    assert.ok(html.includes('class="grade-letter">B<'), 'grade letter should be B');
    assert.ok(html.includes('85 / 100'), 'overall score should appear');
    // Anchored within rendered markup; not a URL-origin check (CodeQL js/incomplete-url-substring-sanitization).
    assert.match(html, />example\.com</, 'host should appear in rendered markup');
  });

  it('embeds evidence from the audited design (palette, type, dimensions)', () => {
    const html = formatGrade(mockDesign);
    assert.ok(html.includes('#0066cc'), 'palette swatch hex must render');
    assert.ok(html.includes('Color Discipline'), 'dimension label must render');
    assert.ok(html.includes('Tight, disciplined color palette'), 'strength must render');
    assert.ok(html.includes('No CSS custom properties found'), 'issue must render');
  });

  it('escapes user-controlled content to prevent HTML injection', () => {
    const malicious = { ...mockDesign, meta: { ...mockDesign.meta, title: '<script>alert(1)</script>' } };
    const html = formatGrade(malicious);
    assert.ok(!html.includes('<script>alert(1)'), 'script tag must be escaped');
    assert.ok(html.includes('&lt;script&gt;'), 'should contain escaped form');
  });

  it('handles typography scale entries shaped as objects ({size, weight, ...})', () => {
    // Real extractor output is objects with .size, not raw numbers.
    const html = formatGrade(mockDesign);
    assert.ok(!html.includes('font-size:NaN'), 'must not produce NaN sizes');
    assert.ok(!html.includes('[object Object]'), 'must resolve object→number');
  });

  it('throws a clear error when score is missing', () => {
    const noScore = { ...mockDesign, score: null };
    assert.throws(() => formatGrade(noScore), /score missing/);
  });
});

describe('formatGradeMarkdown', () => {
  it('produces a markdown report with grade, dimensions table, strengths, and fixes', () => {
    const md = formatGradeMarkdown(mockDesign);
    assert.match(md, /^# Design Report Card/m);
    assert.match(md, /\*\*Grade B\*\* · 85\/100/);
    assert.match(md, /\| Dimension \| Score \| Verdict \|/);
    assert.match(md, /## Strengths/);
    assert.match(md, /## What to fix/);
    assert.match(md, /designlang/);
  });
});

// ── compareScores (battle internals) ────────────────────────────

describe('compareScores', () => {
  const a = { overall: 90, scores: { colorDiscipline: 90, typographyConsistency: 80, accessibility: 70 } };
  const b = { overall: 75, scores: { colorDiscipline: 70, typographyConsistency: 82, accessibility: 70 } };

  it('counts wins per side using a 3-point gap threshold', () => {
    const cmp = compareScores(a, b);
    assert.equal(cmp.aWins, 1, 'a wins on color (90 vs 70 → +20)');
    assert.equal(cmp.bWins, 0);
    assert.equal(cmp.ties, 2, 'typography (80 vs 82, gap=-2) and a11y (70 vs 70) both within 3');
    assert.equal(cmp.verdict, 'a', 'overall delta is +15 → a wins');
  });

  it('returns tie when overall deltas are within 3 points', () => {
    const aClose = { overall: 80, scores: { colorDiscipline: 80 } };
    const bClose = { overall: 78, scores: { colorDiscipline: 80 } };
    assert.equal(compareScores(aClose, bClose).verdict, 'tie');
  });

  it('skips dimensions missing on either side', () => {
    const aPartial = { overall: 80, scores: { colorDiscipline: 80 } };
    const bPartial = { overall: 80, scores: { typographyConsistency: 80 } };
    assert.equal(compareScores(aPartial, bPartial).rows.length, 0);
  });
});

// ── formatBattle (head-to-head HTML) ────────────────────────────

describe('formatBattle', () => {
  const designB = JSON.parse(JSON.stringify(mockDesign));
  designB.meta = { ...designB.meta, url: 'https://other.example.com', title: 'Other Site' };
  designB.score = { ...mockDesign.score, overall: 70, grade: 'C', scores: { ...mockDesign.score.scores, colorDiscipline: 60 } };

  it('returns a self-contained HTML document with both grades and a verdict', () => {
    const html = formatBattle(mockDesign, designB, { version: '12.2.0' });
    assert.ok(html.startsWith('<!doctype html>'), 'should be a complete HTML document');
    // Anchored within rendered markup; not a URL-origin check (CodeQL js/incomplete-url-substring-sanitization).
    assert.match(html, />example\.com</, 'host A must render in markup');
    assert.match(html, />other\.example\.com</, 'host B must render in markup');
    assert.ok(html.includes('class="grade">B<'), 'grade A=B must render');
    assert.ok(html.includes('class="grade">C<'), 'grade B=C must render');
    assert.ok(/takes it\.|close.* to call/.test(html), 'must include a verdict line');
  });

  it('uses paddings + bars for both sides (no NaN, both colors present)', () => {
    const html = formatBattle(mockDesign, designB);
    assert.ok(!html.includes('NaN'), 'no NaN math');
    assert.ok(html.includes('bar-a') && html.includes('bar-b'), 'both bar classes render');
  });

  it('throws a clear error when either design is missing a score', () => {
    const noScore = { ...mockDesign, score: null };
    assert.throws(() => formatBattle(noScore, designB), /score/i);
    assert.throws(() => formatBattle(mockDesign, noScore), /score/i);
  });
});

describe('formatBattleMarkdown', () => {
  const designB = JSON.parse(JSON.stringify(mockDesign));
  designB.meta = { ...designB.meta, url: 'https://other.example.com' };
  designB.score = { ...mockDesign.score, overall: 70, grade: 'C' };

  it('emits a battle table with overall row and per-dimension rows', () => {
    const md = formatBattleMarkdown(mockDesign, designB);
    assert.match(md, /^# example\.com vs other\.example\.com/m);
    assert.match(md, /\*\*Verdict:\*\* example\.com wins/);
    assert.match(md, /\*\*Overall\*\* \| 85 \(B\) \| 70 \(C\)/);
    assert.match(md, /\| Color \|/);
  });
});

// ── formatBadge / formatScoreBadge ──────────────────────────────

describe('formatBadge', () => {
  it('returns valid SVG with both label and value sections', () => {
    const svg = formatBadge({ label: 'design', value: 'B · 87', grade: 'B' });
    assert.ok(svg.startsWith('<svg'), 'must be SVG');
    assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
    assert.ok(svg.includes('design'), 'label must render');
    assert.ok(svg.includes('B · 87'), 'value must render');
    assert.match(svg, /role="img"/);
    assert.match(svg, /aria-label="design: B · 87"/);
  });

  it('picks color from grade letter', () => {
    assert.match(formatBadge({ value: 'A', grade: 'A' }), /#0a8a52/);
    assert.match(formatBadge({ value: 'F', grade: 'F' }), /#c43d3d/);
  });

  it('escapes user-controlled text', () => {
    const svg = formatBadge({ label: '<script>', value: '"&\'' });
    assert.ok(!svg.includes('<script>'));
    assert.ok(svg.includes('&lt;script&gt;'));
  });

  it('handles missing/unknown grade with a fallback color', () => {
    const svg = formatBadge({ value: '—' });
    assert.match(svg, /#555/);
  });
});

describe('formatScoreBadge', () => {
  it('shows "grade · overall" derived from a design.score object', () => {
    const svg = formatScoreBadge({ grade: 'B', overall: 87 });
    assert.ok(svg.includes('B · 87'));
  });

  it('returns an em-dash badge when score is missing', () => {
    const svg = formatScoreBadge(null);
    assert.ok(svg.includes('—'));
  });
});

// ── Vocabularies registry ───────────────────────────────────────

describe('vocabularies', () => {
  it('exposes six built-in vocabularies', () => {
    const ids = Object.keys(VOCABULARIES);
    assert.deepEqual(ids.sort(), ['art-deco', 'brutalist', 'cyberpunk', 'editorial', 'soft-ui', 'swiss']);
  });

  it('listVocabularies returns id + name + blurb for each', () => {
    const list = listVocabularies();
    assert.equal(list.length, 6);
    for (const v of list) {
      assert.ok(v.id, 'must have id');
      assert.ok(v.name, 'must have name');
      assert.ok(v.blurb, 'must have blurb');
    }
  });

  it('every vocabulary defines tokens, fonts, and css', () => {
    for (const [id, v] of Object.entries(VOCABULARIES)) {
      assert.ok(v.tokens, `${id}: tokens missing`);
      assert.ok(v.tokens.paper && v.tokens.ink && v.tokens.accent, `${id}: core color tokens missing`);
      assert.ok(v.fonts?.display && v.fonts?.body, `${id}: font stack missing`);
      assert.ok(typeof v.css === 'string' && v.css.length > 0, `${id}: signature css missing`);
    }
  });

  it('getVocabulary returns the vocab by id', () => {
    assert.equal(getVocabulary('brutalist').name, 'Brutalist');
    assert.equal(getVocabulary('art-deco').name, 'Art Deco');
  });

  it('getVocabulary throws on unknown id with a helpful message', () => {
    assert.throws(() => getVocabulary('vaporwave'), /unknown vocabulary "vaporwave"/);
    assert.throws(() => getVocabulary('vaporwave'), /available:.*brutalist.*swiss/);
  });
});

// ── formatRemix (vocabulary-styled page render) ─────────────────

describe('formatRemix', () => {
  // mockDesign doesn't carry sectionRoles by default — synthesize for these tests.
  const remixDesign = {
    ...mockDesign,
    pageIntent: { type: 'landing', confidence: 0.9, signals: [] },
    voice: {
      tone: 'technical',
      ctaVerbs: ['Get started', 'Learn more', 'Try free'],
      sampleHeadings: ['Build the future', 'Ship faster', 'Designed for scale', 'Join thousands'],
    },
    sectionRoles: {
      sections: [
        { role: 'hero', heading: 'Build the future', buttonCount: 2, slots: { lede: 'A platform for the next generation.' } },
        { role: 'feature-grid', heading: 'What you get', buttonCount: 0, slots: {} },
        { role: 'pricing-table', heading: 'Simple pricing', buttonCount: 3, slots: {} },
        { role: 'cta', heading: '', buttonCount: 1, slots: {} },
        { role: 'footer', heading: '', buttonCount: 0, slots: {} },
      ],
      counts: {},
      readingOrder: ['hero', 'feature-grid', 'pricing-table', 'cta', 'footer'],
    },
  };

  it('returns a self-contained HTML document with the host name and vocab name', () => {
    const html = formatRemix(remixDesign, getVocabulary('brutalist'), { vocabId: 'brutalist' });
    assert.ok(html.startsWith('<!doctype html>'));
    assert.ok(html.includes('example.com'), 'host must render');
    assert.ok(html.includes('Brutalist'), 'vocab name must render');
    assert.ok(html.includes('Build the future'), 'extracted heading must render');
  });

  it('embeds vocabulary tokens as CSS custom properties', () => {
    const brutalist = formatRemix(remixDesign, getVocabulary('brutalist'));
    const cyberpunk = formatRemix(remixDesign, getVocabulary('cyberpunk'));
    // Brutalist accent is orange, cyberpunk is magenta — different vocabs, different output.
    assert.match(brutalist, /--accent: #ff4800/);
    assert.match(cyberpunk, /--accent: #ff2bd6/);
  });

  it('imports each vocabulary\'s display font from Google Fonts', () => {
    const editorial = formatRemix(remixDesign, getVocabulary('editorial'));
    assert.match(editorial, /fonts\.googleapis\.com.*Instrument\+Serif/);
  });

  it('omits nav and footer sections from the body', () => {
    const html = formatRemix(remixDesign, getVocabulary('swiss'));
    // Footer section had no heading; should not produce a stray <h2>Footer</h2>.
    const h2Count = (html.match(/<h2/g) || []).length;
    assert.ok(h2Count <= 4, `expected ≤4 h2 elements, got ${h2Count}`);
  });

  it('dedupes sections that share a heading (real-world SPA pattern)', () => {
    const dup = {
      ...remixDesign,
      sectionRoles: {
        sections: [
          { role: 'hero', heading: 'Same Heading', buttonCount: 1, slots: {} },
          { role: 'pricing-table', heading: 'Same Heading', buttonCount: 1, slots: {} },
          { role: 'cta', heading: 'Different', buttonCount: 1, slots: {} },
        ],
        counts: {}, readingOrder: [],
      },
    };
    const html = formatRemix(dup, getVocabulary('swiss'));
    const sameHeadingCount = (html.match(/Same Heading/g) || []).length;
    assert.equal(sameHeadingCount, 1, 'duplicate heading should appear exactly once');
  });

  it('does not re-shift a section heading from the voice pool (no duplicate render)', () => {
    // Repro for the bug fixed before tests landed: a heading-less section
    // (cta, footer band) used to pull a heading from voice.sampleHeadings
    // that was already claimed by another section, producing duplicate h2s.
    const aliased = {
      ...remixDesign,
      voice: { ...remixDesign.voice, sampleHeadings: ['Build the future', 'Ship faster'] },
      sectionRoles: {
        sections: [
          { role: 'cta', heading: '', buttonCount: 1, slots: {} }, // heading-less
          { role: 'pricing-table', heading: 'Build the future', buttonCount: 2, slots: {} },
        ],
        counts: {}, readingOrder: [],
      },
    };
    const html = formatRemix(aliased, getVocabulary('brutalist'));
    const buildFutureCount = (html.match(/Build the future/g) || []).length;
    assert.equal(buildFutureCount, 1, 'pool heading already on a section must not be re-shifted');
  });

  it('synthesizes a believable artifact when no sections are extracted', () => {
    const noSections = { ...remixDesign, sectionRoles: { sections: [], counts: {}, readingOrder: [] } };
    const html = formatRemix(noSections, getVocabulary('cyberpunk'));
    assert.ok(html.includes('Build the future') || html.includes('example.com'));
    assert.ok(html.includes('<section'), 'must still render sections');
  });

  it('escapes user-controlled section content', () => {
    const evil = {
      ...remixDesign,
      sectionRoles: {
        sections: [{ role: 'hero', heading: '<script>alert(1)</script>', buttonCount: 1, slots: {} }],
        counts: {}, readingOrder: [],
      },
    };
    const html = formatRemix(evil, getVocabulary('brutalist'));
    assert.ok(!html.includes('<script>alert(1)'));
    assert.ok(html.includes('&lt;script&gt;'));
  });

  it('throws clear errors on missing inputs', () => {
    assert.throws(() => formatRemix(null, getVocabulary('brutalist')), /design/i);
    assert.throws(() => formatRemix(remixDesign, null), /vocabulary/i);
  });
});

// ── buildPack (design-system bundle) ────────────────────────────

describe('buildPack', () => {
  // Use a non-formatters import block to avoid circular deps.
  let buildPack;
  let mkdtempSync, rmSync, readdirSync, readFileSync, statSync;
  let tmpdir, join;

  before(async () => {
    ({ buildPack } = await import('../src/pack.js'));
    ({ mkdtempSync, rmSync, readdirSync, readFileSync, statSync } = await import('node:fs'));
    ({ tmpdir } = await import('node:os'));
    ({ join } = await import('node:path'));
  });

  function withTempDir(fn) {
    const dir = mkdtempSync(join(tmpdir(), 'dl-pack-test-'));
    try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  it('produces a complete bundle with all expected top-level directories', () => {
    withTempDir(dir => {
      const result = buildPack(mockDesign, { outDir: dir, version: '12.4.0' });
      assert.ok(result.files.length > 10, `expected many files, got ${result.files.length}`);
      const top = readdirSync(dir).sort();
      // README + LICENSE + 6 directories
      for (const expected of ['README.md', 'LICENSE.txt', 'tokens', 'components', 'storybook', 'starter', 'prompts', 'extras']) {
        assert.ok(top.includes(expected), `top-level missing: ${expected}`);
      }
    });
  });

  it('writes valid token files (DTCG, Tailwind, CSS vars, Figma vars, motion)', () => {
    withTempDir(dir => {
      buildPack(mockDesign, { outDir: dir, version: '12.4.0' });
      const dtcg = JSON.parse(readFileSync(join(dir, 'tokens', 'design-tokens.json'), 'utf-8'));
      assert.ok(dtcg.primitive, 'DTCG must have primitive layer');
      assert.ok(dtcg.semantic, 'DTCG must have semantic layer');

      const tw = readFileSync(join(dir, 'tokens', 'tailwind.config.js'), 'utf-8');
      assert.match(tw, /export default \{/, 'tailwind config exports default');

      const cssVars = readFileSync(join(dir, 'tokens', 'variables.css'), 'utf-8');
      assert.match(cssVars, /:root \{/, 'css vars wrap in :root');

      const figma = JSON.parse(readFileSync(join(dir, 'tokens', 'figma-variables.json'), 'utf-8'));
      assert.ok(typeof figma === 'object', 'figma variables export is an object');

      const motion = JSON.parse(readFileSync(join(dir, 'tokens', 'motion-tokens.json'), 'utf-8'));
      assert.ok(typeof motion === 'object', 'motion tokens parse');
    });
  });

  it('writes a README that references the source URL and grade', () => {
    withTempDir(dir => {
      buildPack(mockDesign, { outDir: dir, version: '12.4.0' });
      const readme = readFileSync(join(dir, 'README.md'), 'utf-8');
      assert.match(readme, /Built from `https:\/\/example\.com`/);
      assert.match(readme, /Grade.*B/);
      assert.match(readme, /v12\.4\.0/);
    });
  });

  it('writes a starter index.html that links to tokens/variables.css', () => {
    withTempDir(dir => {
      buildPack(mockDesign, { outDir: dir, version: '12.4.0' });
      const starter = readFileSync(join(dir, 'starter', 'index.html'), 'utf-8');
      assert.ok(starter.includes('<!doctype html>'));
      assert.ok(starter.includes('../tokens/variables.css'), 'starter must reference tokens/variables.css');
    });
  });

  it('writes recipe files with proper names (not array indices)', () => {
    withTempDir(dir => {
      buildPack(mockDesign, { outDir: dir, version: '12.4.0' });
      const recipesDir = join(dir, 'prompts', 'recipes');
      try {
        const recipes = readdirSync(recipesDir);
        for (const file of recipes) {
          assert.match(file, /\.md$/, `recipe should end in .md, got: ${file}`);
          assert.ok(!/^\d+$/.test(file.replace('.md', '')), `recipe filename must not be a bare index: ${file}`);
        }
      } catch {
        // No componentClusters in mockDesign → no recipes; that's allowed.
      }
    });
  });

  it('throws a clear error when outDir is missing', () => {
    assert.throws(() => buildPack(mockDesign, {}), /outDir is required/);
  });

  it('coerces non-string emitter outputs to JSON without throwing', () => {
    // Smoke test: even if some downstream emitter returns an object, the
    // toText normaliser must handle it (this is the bug that broke the
    // first integration test).
    withTempDir(dir => {
      const minimal = { ...mockDesign, motion: { feel: 'springy', durations: [], easings: [] } };
      assert.doesNotThrow(() => buildPack(minimal, { outDir: dir, version: '12.4.0' }));
    });
  });
});
