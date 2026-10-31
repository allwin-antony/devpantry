# Search recovery: deployment and measurement

## What changed

- Font/icon eligibility now depends on a usable preview and source metadata, rather than popularity or collection size. Incomplete repository-only font entries remain excluded.
- Sitemaps contain distinct, canonical, indexable URLs. Virtual fragment routes are excluded. Only guides with maintained update dates emit `lastmod`.
- Paginated font/icon directories provide crawlable links to the full usable catalogue.
- The Worker canonicalizes HTTP/www requests, then serves the static export through `ASSETS`. Existing API and collaboration routes remain in the Worker.
- Page titles, catalogue facts, installation snippets, tool-specific defaults, and supporting content were corrected.
- The homepage emphasizes developer tasks, search, and useful assets. Mobile navigation scrolls within the viewport.
- Google Analytics records route page views and `tool_complete` events. Query strings, fragments, filenames, and input/output contents are not sent by custom events. The CSP also permits Cloudflare's injected analytics beacon. The unused AdSense script was removed.

## Verification checkpoint: October 31, 2026

The recovered session completed local verification on October 30:

- All 47 tests passed, along with TypeScript checking and the production build.
- The exported-site audit passed for 2,466 canonical sitemap pages, 2,466 internal link targets, and 4,897 JSON-LD blocks.
- Lint completed with warnings.
- Browser checks passed for tool workflows, analytics events, mobile navigation, search ordering, font controls, and feedback metadata.
- The Cloudflare Worker deployment dry run passed.

On October 31, the application source still matched that verified checkpoint. A fresh production check found the older behavior:

| Live URL | Observed result |
| --- | --- |
| `https://devpantry.com/fonts/abel` | HTTP 200 with `noindex, follow` |
| `https://devpantry.com/icons/zondicons` | HTTP 200 with `noindex, follow` |
| `https://devpantry.com/feedback` | HTTP 200 without a canonical tag |
| `http://devpantry.com/fonts/abel?source=check` | HTTP 200 without a redirect |
| `https://www.devpantry.com/fonts/abel?source=check` | HTTP 200 without a redirect |

**The verified recovery changes still need to be deployed to production.** Publish the Worker and assets together, then repeat the production checks below before requesting Google to recrawl the corrected pages.

## Before deploying

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The build runs `scripts/check-seo.mjs` against the actual exported HTML. It fails on missing pages, canonical mismatches, noindexed sitemap entries, malformed JSON-LD, broken internal links, or blocked analytics script origins.

Deploy both the Worker and the new assets/configuration together using the project's Cloudflare deployment pipeline. Publishing only the HTML will not activate the Worker canonical redirects. A successful local build does not publish the site.

## Verify production

Check the response and rendered page for `/`, `/fonts/abel`, `/fonts/rajdhani`, `/icons/zondicons`, `/tools/json-to-zod`, and `/tools/png-to-webp`:

- HTTP 200 at the preferred URL, a self-canonical, and no `noindex` instruction.
- One permanent redirect from HTTP/www to HTTPS without www. Paths and query parameters must survive.
- `robots.txt`, the root sitemap index, and every child sitemap return successfully.
- Unknown pages return HTTP 404, rather than a successful empty application shell.
- A new private browser session loads the analytics scripts without CSP errors. Check a media page too, because its cross-origin isolation differs.

## Google Analytics settings

The existing GA4 measurement ID is retained. `NEXT_PUBLIC_GA_ID` can override it at build time. Localhost/preview hosts do not send GA events.

1. In the GA4 web data stream, **turn off Enhanced measurement** for this stream. This app sends sanitized page views itself; automatic history-change views or form/search events can create duplicates and collect URL/input details outside this integration.
2. Keep Google signals, advertising personalization, and user-provided data collection off for these tools. The code also disables signals and ad-personalization signals in its configuration.
3. In Realtime, verify one page view per route change and a `tool_complete` event after copying generated code or exporting a file.
4. Register `tool_id` and `action` as event-scoped custom dimensions. Actions are `copy`, `download`, `share`, or `process`.
5. Compare completed tasks with tool-page visits. A download and the preceding processing operation are separate actions, not two users.

The public privacy policy describes analytics and collaboration persistence. Keep it synchronized with implementation and account settings.

## Search Console after deployment

1. Run URL Inspection's live test on the homepage, formerly excluded pages that previously received impressions, and the main tool pages.
2. Compare the indexed and live versions: last crawl, indexing permission, fetched HTML, and Google-selected canonical.
3. Request indexing for a small set of important corrected pages. Resubmit `https://devpantry.com/sitemap.xml`; repeated daily submissions are unnecessary.
4. Review the page-indexing reason table. Intentional exclusions and valid redirects need different treatment from server errors or unexpected canonical selection.
5. Check Manual actions, Security issues, Crawl stats, and Cloudflare crawler/WAF events, especially around October 3–5. These account-side records are needed to investigate the loss on pages that remained indexable.

The supplied reports show roughly 2.39K impressions before October 5 and 30 during October 5–30. The periods are different lengths. The later average position is based on the small surviving set of impressions and is not evidence of a recovery.

## Track progress weekly

Keep separate views for tools, fonts, and icons. Record eligible/indexed URLs, search impressions, clicks, landing pages, and tool completion actions. Compare equal-length periods and the same page/query cohorts.

Start with the JSON/Zod, JWT, and mock-data workflows. Share a working demonstration and a useful explanation with relevant developer communities, and watch users try a real task. Use their failures and completion data to select subsequent improvements. Indexing corrections enable discovery; they do not guarantee ranking or a recovery date.
