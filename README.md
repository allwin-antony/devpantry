# DevPlayground.io ⚡

> **The Ultimate Developer Playground, Edge Image Studio & Open-Source Asset Suite.**  
> *Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. 100% Client-Side Sandbox.*

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-blue.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2-cyan.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![Author](https://img.shields.io/badge/Author-Allwin%20S%20Antony-violet.svg)](https://github.com/allwin-antony)

DevPlayground is a fast, high-density developer suite consolidating the essential image editing utilities, edge-case mock data generators, open-source typography catalogs, vector icons, and real-world API fixtures developers need every single day.

All processing occurs **100% client-side in your browser** with zero network tracking, no account required, and unlimited usage — safe for proprietary designs, internal schemas, and enterprise assets.

---

## 🚀 Core Playgrounds & Studios

### 1. 🖼️ Edge Image Studio — On-Demand AI & Artboard Suite

A high-performance visual image suite running entirely inside the browser using modern WebGPU, WebAssembly (WASM), and Canvas APIs.

#### ✨ Free AI Background Remover (`/background-removal`)
* **On-Demand Neural Inference**: Loads with **0ms latency** on upload. Neural model execution is deferred until the user clicks **`✨ Remove Background (AI)`**, preserving battery and GPU memory.
* **Transformers.js / RMBG-1.4 Neural Engine**: Runs state-of-the-art background segmentation client-side in browser memory without sending a single byte to external servers.
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

### 2. ⚡ Chaos Mock Data Synthesizer & Schema Builder (`/chaos-data`)
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
* **5 Export Targets**:
  * **Table Grid**: High-density monospaced data table with sticky headers, color-coded nulls/numbers, and live byte size counters.
  * **JSON**: Formatted JSON array for API mocks and test fixtures.
  * **CSV**: Quote-escaped comma-separated values for Excel or database import.
  * **TypeScript**: Typed interface declarations (`export interface CustomDataRecord`) with typed mock arrays.
  * **Zod**: Ready-to-use runtime Zod validation schema (`export const CustomRecordSchema = z.object(...)`).
  * **SQL**: Multi-row `INSERT INTO ... VALUES (...)` statements for PostgreSQL, MySQL, and SQLite.
* **Re-roll Hotkey**: Press <kbd>R</kbd> anywhere to re-generate permutations instantly.

---

### 3. 🔤 Open Source Fonts Studio (`/fonts`)
An interactive typography testing playground and integration directory for **120+ open-source typefaces**:

* **Curated Font Catalogs**:
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

### 4. 🎨 Vector Icons Studio & SVG Customizer (`/icons`)
An open-source vector icon laboratory featuring **25,000+ vector icons** across 7 leading developer icon toolkits:

* **Supported Libraries**:
  * **Lucide Icons**: 1,800+ consistent stroke icons (fork of Feather).
  * **Tabler Icons**: 6,100+ stroke-based vector icons for SaaS dashboards.
  * **Heroicons**: Handcrafted icons by the Tailwind CSS team.
  * **Phosphor Icons**: 1,200+ flexible icon family.
  * **Simple Icons**: 3,000+ brand logos and developer tech stack marks.
  * **Radix Icons**: UI component primitives.
  * **Feather Icons**: Minimalist 24x24 icons.
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

### 5. 🔌 Real-World API & Chaos Templates (`/chaos-templates`)
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

## 🔍 SEO & Discovery Architecture

DevPlayground is built from the ground up for search engine indexing:
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
