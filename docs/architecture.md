# DevPantry Architecture & Technical Details

This document provides in-depth technical details about the architecture, performance optimizations, and the inner workings of the various tools within the DevPantry suite.

## 🚀 Core Playgrounds & Studios

### 1. 🖼️ Edge Image Studio — On-Demand AI & Artboard Suite

A high-performance visual image suite running entirely inside the browser using modern WebGPU, WebAssembly (WASM), and Canvas APIs.

#### ✨ Free AI Background Remover (`/tools/background-remover`)
* **On-Demand Neural Inference**: Loads with **0ms latency** on upload. Neural model execution is deferred until the user clicks **`✨ Remove Background (AI)`**, preserving battery and GPU memory.
* **Hardware Acceleration & Dedicated Web Worker**: Utilizes `proxyToWorker` to offload neural segmentation entirely to a background thread. Employs `SharedArrayBuffer` with COOP/COEP isolation for true multi-threaded WebAssembly execution.
* **On-demand model loading**: AI weights are downloaded when background removal is requested. Merely opening the resizer or compressor does not load the AI model.
* **Studio Backdrops & Matting**:
  * Alpha transparency grid
  * Solid colors & modern gradient presets
  * Portrait bokeh blur (depth-of-field blur on original backdrop)
* **Backdrop Lock Overlay**: Backdrop swatches are intelligently disabled with a frosted glass lock until AI background removal is executed.
* **Before / After Comparison Slider**: Interactive split-screen scrubber to inspect edge matting and hair segmentation.
* **No Signup & Unlimited**: Export as many high-resolution cutouts as needed with zero rate limits or watermarks.

#### 📐 Free Image Resizer & Artboard Studio (`/tools/image-resizer`)
* **Aspect Ratio Framing**: Instant cropping and framing for social and document standards:
  * Square (`1:1`) — Instagram Post / Avatar
  * Portrait (`4:5`) — Feed Portrait
  * Story (`9:16`) — TikTok, Reels, Stories
  * Landscape (`16:9`) — YouTube, Twitter, OpenGraph
  * Standard Formats (`4:3`, `3:2`, `21:9`)
* **Smart Padding & Resizing**: Scale dimensions up or down while maintaining aspect ratios or adding color-matched canvas padding.
* **Canvas Transforms**: Rotate (90° steps or free rotation), horizontal/vertical flip, zoom, brightness, contrast, and saturation tuning.

#### 🗜️ Free Image Compressor & WebP Converter (`/tools/image-compressor`)
* **Target File Size Budgeting**:
  * Presets: `< 200 KB` (Avatars/Thumbnails), `< 500 KB` (Web Standard), `< 1 MB` (High Detail)
  * Custom KB target: Enter any target kilobyte ceiling.
* **Binary Search Quality Optimization**: Automatically iterates WebP/JPEG compression quality to meet the target file budget while preserving visual fidelity.
* **Side-by-Side Export Diagnostics**: Live preview showing original file size, compressed file size, compression ratio percentage, output dimensions, and estimated savings before downloading.

#### 📄 Free PDF Exam & Photo Kit (`/tools/image-to-pdf`, `/tools/merge-pdf`, `/tools/compress-pdf`, `/tools/passport-photo-maker`)
* **100% Client-Side Privacy**: Perfect for sensitive documents like IDs, passports, and exam marksheets. Your files never leave your browser.
* **Target Size Budgets (KB)**: Photo export attempts the requested limit and reports whether it was reached, alongside actual output dimensions and bytes.
* **Image to PDF Converter**: Combine JPEGs/PNGs in selection order, one image per PDF page.
* **Merge PDF**: Append and combine multiple existing PDF documents locally.
* **Compress PDF**: Rewrite object streams and clear common document-info fields. Embedded images are not downsampled, and a size reduction is not guaranteed.
* **Passport Photo Maker**: Precise cropping for official visa and passport form requirements.

#### 🕵️ Free Image Metadata Viewer & EXIF Stripper (`/tools/exif-stripper`)
* **100% Client-Side Privacy**: Analyze photos for hidden GPS coordinates, camera models, and EXIF footprints purely in your browser.
* **Canvas Stripping Technique**: Instantly strip all metadata from JPEGs and PNGs without server uploads by re-rendering the image natively.

#### 🔄 Free HEIC to JPG Converter (`/tools/heic-converter`)
* **100% Local Conversion**: Convert Apple's HEIC photos to widely supported JPG format entirely in your browser without uploading your personal photos to a server.
* **Fast & Private**: Uses WebAssembly to decode high-efficiency image containers instantly.

---

### 2. 🔤 Open Source Fonts Studio (`/fonts`)
An interactive typography testing playground and integration directory for **2,180+ open-source typefaces**:

* **Curated Font Catalogs**:
  * **Fontsource Catalog**: 2,100+ open-source typefaces packaged for self-hosting with variable font axes support.
  * **Fontshare (Indian Type Foundry)**: High-caliber commercial-grade fonts including *Satoshi*, *Clash Display*, *General Sans*, *Cabinet Grotesk*, *Ranade*, *Alpino*, *Comico*, *Synonym*, *Boska*, and *Tanker*.
  * **GitHub Top Open Fonts**: Community classics including *Inter*, *Fira Code*, *JetBrains Mono*, *Cascadia Code*, *Source Code Pro*, *Hack*, and *Roboto Mono*.
* **Interactive Live Typing Tester**:
  * Test any font in real-time with custom developer phrases.
  * Interactive sliders for **Font Size** (14px–72px), **Font Weight** (300–800), **Tracking / Letter Spacing** (-2px–8px), **Line Height** (1.0–2.2), and **Text Transform** (Uppercase, Lowercase, Title Case).
* **One-Click Integration Snippets**:
  * Copy `@import` CSS snippet
  * Copy `@fontsource/` npm install command
  * Link to official documentation and direct download URLs
* **Multi-Attribute Filters**:
  * Filter by category: *Sans-Serif*, *Serif*, *Display*, *Monospace*.
  * Filter by license: *SIL Open Font License (OFL 1.1)* or *ITF Free Font License*.

---

### 3. 🎨 Vector Icons Studio & SVG Customizer (`/icons`)
An open-source vector icon laboratory featuring **350k+ vector icons** across 238 open-source icon toolkits:

* **Supported Libraries**:
  * **Lucide Icons**: 1,800+ consistent stroke icons (fork of Feather).
  * **Tabler Icons**: 6,100+ stroke-based vector icons for SaaS dashboards.
  * **Material Symbols & Icons**: 10,000+ Google vector glyphs in regular and light variants.
  * **Heroicons**: Handcrafted icons by the Tailwind CSS team.
  * **Phosphor Icons**: 1,200+ flexible icon family.
  * **Simple Icons**: 3,000+ brand logos and developer tech stack marks.
  * **Radix, Carbon, Feather & Iconoir**: Complete design system component primitives.
* **Interactive SVG Canvas**:
  * Live stroke width adjuster (1px to 3px).
  * Icon canvas size slider (16px to 48px).
  * Color presets (Rose, Cyan, Emerald, Amber, Violet, CurrentColor).
* **One-Click Code Copy**:
  * React JSX Component: `<Flame size={28} strokeWidth={2} color="#f43f5e" />`
  * Raw SVG markup string
  * Vue template component
  * `npm install` package command per library

---

### 4. 🔑 Client-Side JWT Inspector & Chaos Tamperer (`/tools/jwt-decoder`)

A 100% in-memory client-side JWT decoder, diagnostic radar, and negative-path chaos testing workbench with **zero network transmission** (placed immediately after Icons in navigation).

* **Zero Token-Leak Architecture**:
  * Decodes headers, payloads, and signatures strictly inside browser memory.
  * Never stored in `localStorage`, `sessionStorage`, or cookies. Safe for production tokens.
* **Color-Coded Token Decomposition**:
  * Visual 3-part syntax highlighting: Header in **Rose**, Payload in **Violet**, and Signature in **Cyan**.
  * Real-time two-way synchronized JSON editor (edits to JSON automatically update the compact token, and vice-versa).
* **Live Status Radar & Countdown**:
  * Real-time status detection: `Active & Valid`, `Expired`, `Not Yet Valid (nbf in future)`, `Insecure alg: none`, or `Malformed`.
  * Live expiration countdown timer with an animated remaining lifetime progress bar.
  * In-place expandable claim hints with RFC specifications, plain-English definitions, and security testing gotchas.
* **🔥 1-Click Chaos Mutations (Test Negative Auth Paths)**:
  * ⏱️ **Expire Now (-5m)**: Sets `exp = now - 300` to test token expiry handlers and refresh loops.
  * ⚡ **Expire in 10s (Race Condition)**: Sets `exp = now + 10` to test near-expiry token refreshing.
  * ⏳ **Clock Skew (+5m)**: Sets `nbf` and `iat` into the future to verify clock-drift tolerance.
  * 🔓 **`alg: none` Exploit**: Rewrites header to `{"alg":"none","typ":"JWT"}` and removes signature to test parser vulnerability (CVE-2015-9235).
  * 💥 **Corrupt Signature**: Mutates cryptographic signature characters to test 401 Unauthorized handling.
  * 🕳️ **Strip Claims**: Selectively strip `sub`, `exp`, `roles`, or `aud` to test frontend null-pointer safety.
  * 👾 **Inject BLNS / Zalgo**: Injects high-entropy strings from the Big List of Naughty Strings into user claims.
  * 🔀 **Swap Algorithm (HS256)**: Simulates Public Key Confusion attacks by setting `HS256` on an asymmetric token.
* **Browser WebCrypto Signer & Verifier**:
  * Verify `HS256`, `HS384`, and `HS512` signatures against custom secrets.
  * Cryptographically sign modified tokens with browser `crypto.subtle`.
  * Generate ephemeral RSA-2048 key pairs in memory and sign with `RS256`.
* **Curated Provider Presets**:
  * One-click samples for Supabase Auth, Google OAuth 2.0 / OIDC, Auth0 / Clerk RBAC, GitHub App JWTs, and Microservice M2M tokens.
* **Quick Export Snippets**:
  * Copy Raw Compact JWT, `Authorization: Bearer <token>`, executable `curl` commands, TypeScript Interface definitions, and Playwright test snippets.

---

### 5. ⚡ Chaos Mock Data Synthesizer & Schema Builder (`/tools/mock-data`)
Generate battle-tested, high-entropy test datasets to stress-test UI layout bounds, database schemas, and API parsers before production.

* **Curated Domain Presets**:
  * **E-Commerce Orders**: High-entropy items, zero-amount promotions, extreme quantities (`999999`), multi-currency anomalies (`BTC`, `JPY`, `KWD`, `CLF`), negative unit prices, and floating-point rounding traps.
  * **B2B Users & Identities**: Complex multi-script names (Kanji, Cyrillic, Arabic), diacritics and hyphens (`Dr. O'Connor-Smith, Jr.`), exotic emails (`user+tag@sub.domain.co.uk`, punycode), and extreme phone formats.
  * **Invoicing & Transactions**: Floating-point precision traps (`0.1 + 0.2`), delinquent status flags, 18-decimal cryptocurrency fees, and negative discounts.
  * **BLNS Naughty Strings Suite**: Direct injection of 100+ strings from the Big List of Naughty Strings covering zero-width invisible joiners, RTL directionality overrides (`\u202E`), Zalgo text stacks, homoglyph confusables, and inert injection fragments.
* **Visual Custom Schema Builder**:
  * Compose custom schemas visually without writing code.
  * **13+ Field Types**: `UUID / ID`, `Full Name`, `Email Address`, `Mailing Address`, `Phone Number`, `Integer`, `Float / Currency`, `Boolean Flag`, `Date / Timestamp`, `Enum / Status`, `Web URL`, `Naughty String (BLNS)`, and `JSON Metadata`.
  * **Per-Column Chaos Sliders**: Tune the failure probability of each individual field independently from 0% to 100%.
  * **Domain Starters**: One-click templates for *User Profile*, *E-Commerce Product*, *Billing Transaction*, and *API Telemetry*.
* **7 Modern Export Targets & Fixture Standards**:
  * **Table Grid**: High-density monospaced data table with sticky headers, color-coded nulls/numbers, and live byte size counters.
  * **JSON**: Formatted JSON array for API mocks and test fixtures.
  * **CSV**: Quote-escaped comma-separated values for Excel or database import.
  * **TypeScript**: Typed interface declarations (`export interface CustomDataRecord`) with typed mock arrays.
  * **Zod**: Ready-to-use runtime Zod validation schema (`export const CustomRecordSchema = z.object(...)`).
  * **SQL**: Multi-row `INSERT INTO ... VALUES (...)` statements for PostgreSQL, MySQL, and SQLite.
  * **MSW v2 Handlers**: Ready-to-paste Mock Service Worker handlers (`http.get('/api/mock-data', () => HttpResponse.json(...))`).
  * **Prisma Seed Script**: Production database seeding scripts (`await prisma.mockRecord.createMany({ data: records })`).
* **🔗 Shareable URL Hash (`#schema=...`)**:
  * 1-click **Share Link** button encodes custom schema definitions into the URL hash, allowing engineers to share reproducible schema edge cases directly in GitHub issues or Slack.
* **Re-roll Hotkey**: Press <kbd>R</kbd> anywhere to re-generate permutations instantly.

---

### 6. 🔗 Social Share Preview & Open Graph Inspector (`/tools/social-preview`)
Generate pixel-perfect mockups of how your links will appear when shared across major social networks and messaging platforms.

* **Multi-Platform Accurate Mockups**:
  * Instantly preview cards for **X/Twitter**, **LinkedIn**, **Facebook**, **Discord**, **Slack**, and **WhatsApp**.
  * Accurately reflects truncation limits, fallback card types (e.g., `summary` vs `summary_large_image`), and platform-specific background colors.
* **Stateless Edge Fetcher**:
  * Bypasses CORS restrictions securely using a Cloudflare Pages edge function (`/api/og-fetch`).
  * **Zero logs & zero storage**: The relay fetches metadata in transit and drops the connection, guaranteeing absolute privacy for unreleased staging environments.
* **Raw HTML Source Parser**:
  * Developing on localhost? Switch to **Paste Source** mode to paste your raw `<head>` HTML (or `document.documentElement.outerHTML`) for instant offline parsing without needing a public tunnel.
* **Comprehensive Metadata Inspector**:
  * Extracts and validates `og:title`, `og:description`, `og:image`, `twitter:card`, and image dimensions.
  * Real-time **Validation Warnings**: Flags missing critical tags or character limits that will cause truncation on specific platforms.
  * Expandable raw tag viewer showing all detected meta tags in a formatted code block.
* **Shareable Previews**:
  * Generates shareable URL hashes (`#url=...`) so you can send a specific preview state to your marketing or engineering teams.

---

### 7. 🔌 Real-World API & Chaos Templates (`/tools/api-templates`)
Actual production API response payloads and edge-case schemas for 19 real-world enterprise services:

* **Service Categories**:
  * **Auth & SSO**: Google OAuth 2.0 / OIDC, GitHub OAuth & Apps, Apple Sign-In, Supabase Auth, Auth.js / NextAuth, Microsoft Entra SSO (Azure AD), Keycloak OIDC, and Meta / Facebook Login.
  * **E-Commerce & B2B**: Stripe Billing (Charges & Webhooks), Shopify Admin REST API, HubSpot CRM Contacts, and Salesforce CRM Objects.
  * **Cloud & Developer**: GitHub Webhooks (push, pull_request), Supabase PostgREST, Resend Email API, Twilio Messaging, and Strapi Headless CMS.
  * **Schemas & Standards**: Unified User Profile Standard and IETF RFC 7807 Standard Error Response.
* **Developer Workbench**:
  * Full JSON payload viewer with syntax highlighting and live byte size calculator.
  * **TypeScript Interface Generator**: Converts any API response payload into typed TypeScript interfaces with one click.
  * **Production cURL Generator**: Generates executable cURL requests with realistic auth headers and content types.
  * **HTTP Status Code Simulator**: Test how your frontend responds to simulated `200 OK`, `400 Bad Request`, `401 Unauthorized`, `429 Rate Limited`, or `500 Server Error` payloads.

---

### 8. 🧩 JSON to TS & Zod Converter (`/tools/json-to-ts-zod`, `/tools/json-to-zod`)

Instantly convert JSON API responses into strict TypeScript interfaces and Zod validation schemas.

* **100% Client-Side AST Parsing**: Paste your JSON payloads and get typed interfaces instantly without sending data to a server.
* **Zod Schema Generation**: Automatically infers types and generates ready-to-use runtime Zod validation schemas (`z.object(...)`, `z.array(...)`, `z.string()`, etc.).
* **Client-Side `#state=` Sharing**: Serializes payloads into URL fragments (`#state=...`), which are not sent with the page's HTTP request. Anyone receiving the link can read its payload; do not share secrets this way.
* **Local Parsing**: Conversion does not submit JSON to a processing API. Users should still use a trusted device and browser when working with sensitive data.

---

### 9. 🤝 Encrypted Collaborative Editor (`/tools/collab`)

A real-time collaborative text and code editor using Yjs CRDTs (Conflict-free Replicated Data Types), browser-side encryption, and a Cloudflare WebSocket relay. The current implementation does not use direct WebRTC data channels.

* **Encrypted Relay Architecture**:
  * Document updates are encrypted in the browser, then relayed and stored by a **Cloudflare Durable Object** (`SignalingRoom`) for later synchronization.
  * Password-derived encryption keys stay in the client.
  * The relay uses the **WebSocket Hibernation API** to retain socket connections while the Worker hibernates.
* **Signaling Hardening & DoS Protection**:
  * **Payload Limiting**: Strict 64 KB message size ceiling on all incoming WebSocket messages.
  * **Peer Capacity**: Maximum of 25 concurrent peers per room (`HTTP 429` on overflow).
  * **Rate Limiting**: Per-socket token burst limiter capping traffic to 60 messages/sec.
  * **Bounded Storage**: Automatic pruning of SQLite update delta logs (capped at 500 rows).
* **Client-Side AES-GCM Encryption**:
  * Uses `PBKDF2` to derive a strong 256-bit AES-GCM key from the room password entirely in the browser.
  * Every Yjs document update is encrypted before transmission over the WebSocket relay.
  * Updates encrypted with a different password cannot be decrypted with the local key.
* **Resilient CRDT Sync (Yjs)**:
  * Powered by `Yjs` for robust, conflict-free syncing of document state across multiple peers.
  * Automatically handles offline editing via `IndexedDB` persistence and resyncs seamlessly when the network is restored.
* **Rich Code Editing (`@uiw/react-codemirror`)**:
  * Clean, fast, and responsive CodeMirror 6 interface tailored for collaborative coding.
  * Supports dynamic light and dark mode toggling.

---

### 10. 🌐 Public APIs Registry (`/tools/public-apis`)

A massive, searchable, and filterable registry of 3k+ free public APIs for software and web development.

* **Massive Open-Source Aggregation**: 
  * Automatically aggregated via `npm run sync-apis` from three major GitHub repositories (`public-apis`, `public-api-lists`, and `marcelscruz`).
  * Deduplicated and strictly sorted alphabetically by category and API name.
* **Powerful Local Filtering**:
  * Lightning-fast client-side search across all 3k+ APIs.
  * Filter by **CORS** support (Yes, No, Unknown).
  * Filter by **Auth requirements** (API Key, OAuth, or No Auth Required).
  * 1-Click **HTTPS Only** toggle.
* **SEO Optimized**:
  * Integrates Next.js Dynamic Metadata and injects `Dataset` JSON-LD Structured Data to tell Google search crawlers about the massive registry.

---

### 11. 🤖 AI MCP & Tools Registry (`/tools/mcp-registry`)

A collective list of 4k+ open-source Model Context Protocol (MCP) servers and tools for AI agents (Claude Desktop, Cursor, and autonomous agents).

* **Multi-Source Aggregation**: 
  * Aggregated via `npm run sync-mcp-tools` from major community repositories (e.g., `punkpeye`, `wong2`, `habitoai`) and the official MCP registry.
* **Powerful Local Filtering**:
  * Instant, client-side search across all 4k+ servers by name or description.
  * Rapid contextual filtering and categorisation.
* **Seamless Internal Workflow**:
  * Tightly integrated with the Public APIs registry to easily find APIs to wrap into custom MCP servers.

---

### 12. ⌨️ Global Command Palette (`Cmd + K` / `Ctrl + K`)

A unified search dialog accessible from anywhere in the suite via keyboard shortcut or header button:
* **Instant Tool Switching**: Jump directly to Overview, AI Studio, Fonts, Icons, JWT Inspector, Chaos Data, Public APIs Registry, or API Mocks.
* **Typeface Quick Jump**: Type "inter", "jetbrains", "satoshi", or "clash" to jump straight to the typeface preview.
* **Icon Toolkit Search**: Type "lucide", "tabler", "heroicons", or "phosphor" to open the respective icon library.
* **API Fixture Jump**: Type "stripe", "supabase", "google", or "github" to open the respective production mock response.
* **1-Click Quick Actions**: Quick actions to simulate expired tokens or algorithm confusion attacks.

---

## ⚡ Performance Architecture: Modular Catalog Loaders

To ensure minimal client bundle sizes and sub-second page loads:
* **Decoupled Loaders (`src/lib/loaders/`)**:
  * `fontLoader.ts`: Isolates Fontsource & Fontshare catalogs (860+ KB) strictly to typography routes.
  * `iconLoader.ts`: Isolates icon library and collection definitions (150+ KB) strictly to icon pages.
  * `serviceResponseLoader.ts`: Isolates enterprise API fixtures strictly to chaos template pages.
* **Re-export Facade (`datasetLoader.ts`)**: Maintains 100% backward compatibility for sitemap generation and static routing while enabling aggressive tree-shaking on client bundles.

---

## 🔍 SEO & Discovery Architecture

DevPantry is built from the ground up for search engine indexing:
* **2,460+ Pre-Rendered Static Pages**: Generated via Next.js SSG (`generateStaticParams`) for instantaneous First Contentful Paint.
* **Dedicated High-Intent Preset URLs**: Independent routes targeting high-volume developer search intents:
  * `/tools/background-remover` — AI neural background segmentation
  * `/tools/image-resizer` — Canvas framing & aspect ratio studio
  * `/tools/image-compressor` — Budget-targeted lossless & WebP compression
  * `/tools/png-to-webp` — Instant browser-side WebP converter
  * `/tools/json-to-zod` — Zod schema generation from raw JSON
  * `/tools/strip-gps-from-photo` — Browser-local EXIF & GPS coordinate removal
  * `/fonts/[slug]` — Individual typeface playgrounds (2,180+ typefaces)
  * `/icons/[prefix]` — Individual vector icon library catalogs
* **Root Sitemap Index (`sitemap.xml`)**: Built post-export to provide a clean `<sitemapindex>` linking partitioned sub-sitemaps (`core`, `tools`, `fonts`, `icons`, `templates`, `guides`) directly to Google Search Console and Bing Webmaster Tools.
* **Canonical 301 Redirects (`_redirects`)**: Cloudflare edge rules that seamlessly alias legacy root-level paths to canonical `/tools/*` destinations.
* **Structured Data (JSON-LD)**: Rich snippet markup for `WebApplication` and `DeveloperApplication`.

---

## 🛡️ Edge Security & Cloudflare Architecture

DevPantry is deployed using Cloudflare's unified **Workers + Static Assets** (`wrangler.jsonc`):
* **Static Assets Engine**: All pre-rendered HTML, client JS, CSS, and font files from `./out` are served directly by Cloudflare's edge cache with zero serverless cold-start latency.
* **Edge Compute & Durable Objects**: Dynamic WebRTC signaling (`/api/collab/*`) and OpenGraph metadata relay (`/api/og-fetch`) run in the same Worker without requiring a separate backend domain.
* **Defense-in-Depth Headers (`_headers`)**:
  * Cross-Origin Opener Policy (`COOP: same-origin`) and Embedder Policy (`COEP: require-corp`) for multithreaded WASM tools.
  * Content Security Policy (CSP) blocking rogue data exfiltration while explicitly allowing Google Fonts, Fontshare (`api.fontshare.com`, `cdn.fontshare.com`), and jsDelivr.

---

## 🌓 Dark & Light Mode Support

* **Seamless Dual-Theme System**: Built using CSS custom design tokens (`var(--bg-panel)`, `var(--bg-sidebar)`, `var(--border-dev)`, `var(--text-primary)`, `var(--text-secondary)`).
* **Instant Toggle**: Switch effortlessly between Dark Carbon and Crisp Light mode via the header toggle.
* **Local Persistence**: Automatically saves and restores user theme preference from `localStorage`.
