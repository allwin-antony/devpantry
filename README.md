# DevPantry.com ⚡

> **The Developer Asset Pantry, Edge Image Studio & Chaos Mock Data Suite.**  
> *Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. 100% Client-Side Sandbox.*

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-blue.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2-cyan.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Author](https://img.shields.io/badge/Author-Allwin%20S%20Antony-violet.svg)](https://github.com/allwin-antony)

DevPantry is a fast, high-density developer suite consolidating the essential image editing utilities, edge-case mock data generators, open-source typography catalogs, vector icons, and real-world API fixtures developers need every single day.

All processing occurs **100% client-side in your browser** with zero network tracking, no account required, and unlimited usage — safe for proprietary designs, internal schemas, and enterprise assets.

---

## 🚀 Core Playgrounds & Studios

### 1. 🖼️ Edge Image Studio — On-Demand AI & Artboard Suite

A high-performance visual image suite running entirely inside the browser using modern WebGPU, WebAssembly (WASM), and Canvas APIs.

#### ✨ Free AI Background Remover (`/background-removal`)
* **On-Demand Neural Inference**: Loads with **0ms latency** on upload. Neural model execution is deferred until the user clicks **`✨ Remove Background (AI)`**, preserving battery and GPU memory.
* **Hardware Acceleration & Dedicated Web Worker**: Utilizes `proxyToWorker` to offload neural segmentation entirely to a background thread, while automatically utilizing WebGPU hardware acceleration for blazing-fast inference without locking the main UI thread.
* **Eager Idle Preloading**: The AI model weights and WASM compiler are silently pre-fetched during idle browser time so the segmentation engine is warm the moment a user acts.
* **Studio Backdrops & Matting**:
  * Alpha transparency grid
  * Solid colors & modern gradient presets
  * Portrait bokeh blur (depth-of-field blur on original backdrop)
* **Backdrop Lock Overlay**: Backdrop swatches are intelligently disabled with a frosted glass lock until AI background removal is executed.
* **Before / After Comparison Slider**: Interactive split-screen scrubber to inspect edge matting and hair segmentation.
* **No Signup & Unlimited**: Export as many high-resolution cutouts as needed with zero rate limits or watermarks.

#### 📐 Free Image Resizer & Artboard Studio (`/image-resizer`)
* **Aspect Ratio Framing**: Instant cropping and framing for social and document standards:
  * Square (`1:1`) — Instagram Post / Avatar
  * Portrait (`4:5`) — Feed Portrait
  * Story (`9:16`) — TikTok, Reels, Stories
  * Landscape (`16:9`) — YouTube, Twitter, OpenGraph
  * Standard Formats (`4:3`, `3:2`, `21:9`)
* **Smart Padding & Resizing**: Scale dimensions up or down while maintaining aspect ratios or adding color-matched canvas padding.
* **Canvas Transforms**: Rotate (90° steps or free rotation), horizontal/vertical flip, zoom, brightness, contrast, and saturation tuning.

#### 🗜️ Free Image Compressor & WebP Converter (`/image-compressor`)
* **Target File Size Budgeting**:
  * Presets: `< 200 KB` (Avatars/Thumbnails), `< 500 KB` (Web Standard), `< 1 MB` (High Detail)
  * Custom KB target: Enter any target kilobyte ceiling.
* **Binary Search Quality Optimization**: Automatically iterates WebP/JPEG compression quality to meet the target file budget while preserving visual fidelity.
* **Side-by-Side Export Diagnostics**: Live preview showing original file size, compressed file size, compression ratio percentage, output dimensions, and estimated savings before downloading.

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
An open-source vector icon laboratory featuring **353,000+ vector icons** across 238 open-source icon toolkits:

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

### 4. 🔑 Client-Side JWT Inspector & Chaos Tamperer (`/jwt-inspector`)

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

### 5. ⚡ Chaos Mock Data Synthesizer & Schema Builder (`/chaos-data`)
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

### 6. 🔌 Real-World API & Chaos Templates (`/chaos-templates`)
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

### 7. ⌨️ Global Command Palette (`Cmd + K` / `Ctrl + K`)

A unified search dialog accessible from anywhere in the suite via keyboard shortcut or header button:
* **Instant Tool Switching**: Jump directly to Overview, AI Studio, Fonts, Icons, JWT Inspector, Chaos Data, or API Mocks.
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
* **2,450+ Pre-Rendered Static Pages**: Generated via Next.js SSG (`generateStaticParams`) for instantaneous First Contentful Paint.
* **Dedicated Targeted URLs**: Independent routes (`/background-removal`, `/image-resizer`, `/image-compressor`, `/fonts/[slug]`, `/icons/[prefix]`, `/chaos-templates/[id]`) targeting specific high-volume developer search intents.
* **No Signup / Unlimited Keywords**: Explicit search intent keyword placement across titles, meta tags, and structured data.
* **Dynamic XML Sitemap**: Automatic `sitemap.xml` listing all pages with daily change frequencies.
* **Structured Data (JSON-LD)**: Rich snippet markup for `WebApplication` and `DeveloperApplication`.

---

## 🌓 Dark & Light Mode Support

* **Seamless Dual-Theme System**: Built using CSS custom design tokens (`var(--bg-panel)`, `var(--bg-sidebar)`, `var(--border-dev)`, `var(--text-primary)`, `var(--text-secondary)`).
* **Instant Toggle**: Switch effortlessly between Dark Carbon and Crisp Light mode via the header toggle.
* **Local Persistence**: Automatically saves and restores user theme preference from `localStorage`.

---

## 🛡️ Privacy & Zero-Tracking Guarantee

* **100% Client-Side Processing**: No images, custom schemas, dirty strings, search queries, or generated mock records are sent to any remote server.
* **WebGPU / WebAssembly Offline Engine**: All AI neural inferences and canvas manipulations execute locally inside your browser sandbox.

---

## 💻 Developer Quickstart

### Prerequisites
* **Node.js**: `v18.0.0` or higher (`v20+` / `v24+` recommended)
* **npm**: `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/allwin-antony/failstate.git
cd failstate

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open **http://localhost:3000** (or http://localhost:5173) in your browser.

### Production Build

```bash
# Compile and build static pages
npm run build

# Start production server
npm run start
```

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router with Turbopack)
* **Runtime**: React 19 + TypeScript
* **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Custom Design Tokens
* **Edge AI**: Transformers.js (`@xenova/transformers`) with RMBG-1.4 model
* **Icons**: Lucide React
* **Dataset**: OpenSourceDataset (Fonts, Icons, Service Responses)
* **Author**: [Allwin S Antony](https://github.com/allwin-antony)
* **License**: MIT License
