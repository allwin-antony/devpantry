import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { getFontBySlug, isFontIndexable } from '../src/lib/loaders/fontLoader';
import { getIconCollectionByPrefix, isIconIndexable } from '../src/lib/loaders/iconLoader';
import { getFontSnippets, getFontStylesheetUrls } from '../src/lib/fontPresentation';
import { getSitemapEntries, SITEMAP_IDS } from '../src/lib/sitemaps';
import { getCatalogEntries, getCatalogPage, getCatalogPageCount } from '../src/lib/catalogPages';
import { canonicalRedirect } from '../src/workers/canonicalRedirect';
import { analyticsPageLocation, analyticsReferrer, completionAction, isAnalyticsHost } from '../src/lib/analytics';

describe('Search visibility regressions', () => {
  it('keeps usable long-tail fonts and small icon collections eligible', () => {
    for (const slug of ['abel', 'rajdhani', 'kalam', 'inter']) {
      const font = getFontBySlug(slug);
      assert.ok(font, `${slug} exists`);
      assert.ok(isFontIndexable(font), `${slug} must not be excluded for lack of popularity`);
      assert.ok(getSitemapEntries('fonts').some(entry => entry.url.endsWith(`/fonts/${slug}`)));
    }
    const icons = getIconCollectionByPrefix('zondicons');
    assert.ok(icons);
    assert.ok(icons.total_icons < 500);
    assert.ok(isIconIndexable(icons));
    assert.ok(getSitemapEntries('icons').some(entry => entry.url.endsWith('/icons/zondicons')));
  });

  it('excludes incomplete previews rather than advertising unavailable functionality', () => {
    const font = getFontBySlug('inter')!;
    assert.equal(isFontIndexable({ ...font, weights: [], cdn_stylesheet_url: undefined }), false);
    const icons = getIconCollectionByPrefix('zondicons')!;
    assert.equal(isIconIndexable({ ...icons, total_icons: 0, samples: [] }), false);
  });

  it('publishes each canonical URL once, without virtual routes or query variants', () => {
    const entries = SITEMAP_IDS.flatMap(getSitemapEntries);
    const seen = new Set<string>();
    for (const entry of entries) {
      const url = new URL(entry.url);
      assert.equal(url.origin, 'https://devpantry.com');
      assert.equal(url.hash, '');
      assert.equal(url.search, '');
      assert.ok(!seen.has(url.href), `Duplicate sitemap entry: ${url.href}`);
      seen.add(url.href);
      if (entry.lastModified) assert.ok(Number.isFinite(new Date(entry.lastModified).getTime()));
    }
    assert.equal(entries.filter(entry => entry.url.endsWith('/tools/api-templates')).length, 1);
    assert.ok(!entries.some(entry => entry.url.includes('schema-builder')));
  });

  it('makes the complete catalog reachable through non-overlapping directory pages', () => {
    for (const type of ['fonts', 'icons'] as const) {
      const pages = Array.from({ length: getCatalogPageCount(type) }, (_, index) => getCatalogPage(type, index + 1)!);
      assert.deepEqual(pages.flatMap(page => page.entries), getCatalogEntries(type));
      assert.equal(getCatalogPage(type, 0), null);
      assert.equal(getCatalogPage(type, 1.5), null);
      assert.equal(getCatalogPage(type, pages.length + 1), null);
    }
  });
});

describe('Catalogue accuracy', () => {
  it('classifies Inter as sans serif and exports an executable Tailwind config', () => {
    const font = getFontBySlug('inter')!;
    assert.equal(font.category, 'Sans');
    const module = { exports: {} as any };
    runInNewContext(getFontSnippets(font).tailwind, { module });
    assert.equal(module.exports.theme.extend.fontFamily.inter[0], 'Inter');
    assert.equal(module.exports.theme.extend.fontFamily.inter[1], 'sans-serif');
  });

  it('uses the published single weight for Kihim, and distinguishes ITF from OFL', () => {
    const font = getFontBySlug('kihim')!;
    assert.deepEqual(font.weights, [400]);
    assert.equal(font.is_sil_ofl, false);
    assert.match(font.license_type, /ITF/);
    assert.match(getFontStylesheetUrls(font)[0], /@400&display=swap$/);
    assert.equal(getFontSnippets(font).npm, '');
  });

  it('does not request Google Fonts for a Fontsource-only font', () => {
    const font = getFontBySlug('aileron')!;
    assert.ok(font);
    const urls = getFontStylesheetUrls(font);
    assert.ok(urls.length > 0);
    assert.ok(urls.every(url => url.startsWith('https://cdn.jsdelivr.net/npm/@fontsource/aileron/')));
    const hack = getFontBySlug('hack')!;
    assert.ok(isFontIndexable(hack));
    assert.equal(hack.npm_package, 'hack-font');
    assert.match(getFontStylesheetUrls(hack)[0], /hack-font@3\.3\.0/);
  });
});

describe('Canonical delivery and measurement', () => {
  it('redirects HTTP and www while preserving path and query parameters', () => {
    assert.equal(canonicalRedirect('http://www.devpantry.com/tools/api-templates?template=stripe-billing'), 'https://devpantry.com/tools/api-templates?template=stripe-billing');
    assert.equal(canonicalRedirect('https://www.devpantry.com/fonts/inter'), 'https://devpantry.com/fonts/inter');
    assert.equal(canonicalRedirect('http://devpantry.com/fonts/inter'), 'https://devpantry.com/fonts/inter');
    assert.equal(canonicalRedirect('https://devpantry.com/fonts/inter'), null);
    assert.equal(canonicalRedirect('http://localhost:8787/tools/json-to-zod'), null);
  });

  it('keeps shared input and referrer details out of custom analytics', () => {
    assert.equal(analyticsPageLocation('/tools/json-to-zod?token=private#state=%7B%22secret%22%3A1%7D'), 'https://devpantry.com/tools/json-to-zod');
    assert.equal(analyticsReferrer('https://example.com/private/path?token=secret#data'), 'https://example.com');
    assert.equal(analyticsReferrer('not a URL'), '');
    assert.equal(completionAction('schema-copy-zod'), 'copy');
    assert.equal(completionAction('private filename.png'), 'process');
    assert.equal(isAnalyticsHost('localhost'), false);
    assert.equal(isAnalyticsHost('devpantry.com'), true);
  });
});
