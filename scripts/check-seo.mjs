import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('out');
const origin = 'https://devpantry.com';
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([a-f0-9]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16))).replace(/&#([0-9]+);/g, (_, number) => String.fromCodePoint(Number(number))).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(match => [match[1].toLowerCase(), decode(match[2])]));
const htmlFile = pathname => pathname === '/' ? path.join(out, 'index.html') : path.join(out, `${decodeURIComponent(pathname).replace(/^\//, '')}.html`);
const exists = pathname => fs.existsSync(htmlFile(pathname)) || fs.existsSync(path.join(out, decodeURIComponent(pathname).replace(/^\//, '')));
const redirects = new Map(fs.readFileSync(path.join(out, '_redirects'), 'utf8').split('\n').filter(line => line.trim() && !line.startsWith('#')).map(line => line.trim().split(/\s+/).slice(0, 2)));
const allUrls = new Set();
const links = new Map();
let schemas = 0;

const index = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
assert.match(index, /<sitemapindex\b/, 'The root sitemap must be an index.');
const maps = locations(index);
assert.ok(maps.length > 0, 'The sitemap index must contain child sitemaps.');

for (const sitemap of maps) {
  const xml = fs.readFileSync(path.join(out, new URL(sitemap).pathname), 'utf8');
  assert.match(xml, /<urlset\b/, `${sitemap} must be a URL set.`);
  const urls = locations(xml);
  assert.ok(urls.length > 0, `${sitemap} is empty.`);
  for (const location of urls) {
    const url = new URL(location);
    assert.equal(url.origin, origin);
    assert.equal(url.search, '', `Query variant in sitemap: ${location}`);
    assert.equal(url.hash, '', `Fragment in sitemap: ${location}`);
    assert.ok(!allUrls.has(url.href), `Duplicate sitemap URL: ${location}`);
    allUrls.add(url.href);
    assert.ok(fs.existsSync(htmlFile(url.pathname)), `Missing exported page: ${location}`);
    const html = fs.readFileSync(htmlFile(url.pathname), 'utf8');
    const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(match => attrs(match[0]));
    const robots = tags.filter(tag => ['robots', 'googlebot'].includes(tag.name));
    assert.ok(robots.length > 0, `Missing robots metadata: ${location}`);
    assert.ok(!robots.some(tag => /\b(noindex|none)\b/.test(tag.content || '')), `Sitemap page is noindexed: ${location}`);
    const canonical = tags.filter(tag => tag.rel === 'canonical');
    assert.equal(canonical.length, 1, `Expected one canonical: ${location}`);
    assert.equal(new URL(canonical[0].href).href, url.href, `Canonical mismatch: ${location}`);
    assert.match(html, /<title>[^<]+<\/title>/, `Missing title: ${location}`);
    assert.ok(tags.some(tag => tag.name === 'description' && tag.content?.trim()), `Missing description: ${location}`);
    assert.match(html, /<h1\b/, `Missing server-rendered heading: ${location}`);
    for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      JSON.parse(match[1]);
      schemas++;
    }
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = decode(match[1]);
      if (href.startsWith('#')) continue;
      const target = new URL(href, url);
      if (target.origin === origin && !links.has(target.pathname)) links.set(target.pathname, location);
    }
  }
}

for (const [pathname, source] of links) {
  const target = redirects.get(pathname)?.split(/[?#]/)[0] || pathname;
  assert.ok(exists(target), `Broken internal link ${pathname} on ${source}`);
}

const policy = fs.readFileSync(path.join(out, '_headers'), 'utf8');
assert.match(policy, /script-src[^;]*https:\/\/www\.googletagmanager\.com/);
assert.match(policy, /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
assert.ok(!fs.existsSync(path.join(out, 'tools/mock-data%23schema-builder.html')), 'A fragment must not be exported as a page.');
console.log(`SEO check passed: ${allUrls.size} canonical sitemap pages, ${links.size} internal link targets, ${schemas} JSON-LD blocks.`);
