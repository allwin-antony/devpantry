# DevPlayground.io ⚡

> **The Ultimate Developer Playground, Edge-Case Synthesizer & Open-Source Asset Studio.**  
> *Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. 100% Client-Side Sandbox.*

DevPlayground is a fast, high-density developer suite consolidating the essential assets, edge-case mock data generators, open-source typography, vector icons, and real-world API fixtures developers need every single day.

All processing occurs **100% client-side in your browser** with zero network tracking, making it completely safe for proprietary schemas and internal enterprise testing.

---

## 🚀 Core Playgrounds

### 1. ⚡ Chaos Mock Data Synthesizer & Custom Schema Builder (`/chaos-data`)
Generate battle-tested, high-entropy test datasets to stress-test UI layout bounds, database schemas, and API parsers before production.

* **Curated Domain Presets**:
  * **E-Commerce Orders**: High-entropy items, zero-amount promotions, extreme quantities (`999999`), multi-currency anomalies (`BTC`, `JPY`, `KWD`, `CLF`), negative unit prices, and floating-point rounding traps.
  * **B2B Users & Identities**: Complex multi-script names (Kanji, Cyrillic, Arabic), diacritics and hyphens (`Dr. O'Connor-Smith, Jr.`), exotic emails (`user+tag@sub.domain.co.uk`, punycode), and extreme phone formats.
  * **Invoicing & Transactions**: Floating-point precision traps (`0.1 + 0.2`), delinquent status flags, 18-decimal cryptocurrency fees, and negative discounts.
  * **BLNS Naughty Strings Suite**: Direct injection of 100+ strings from the Big List of Naughty Strings covering zero-width invisible joiners, RTL directionality overrides (`\u202E`), Zalgo text stacks, homoglyph confusables, and inert injection fragments.
* **Visual Custom Schema Builder**:
  * Visual GUI to compose custom schemas without writing code.
  * **13+ Field Types**: `UUID / ID`, `Full Name`, `Email Address`, `Mailing Address`, `Phone Number`, `Integer`, `Float / Currency`, `Boolean Flag`, `Date / Timestamp`, `Enum / Status`, `Web URL`, `Naughty String (BLNS)`, and `JSON Metadata`.
  * **Per-Column Chaos Sliders**: Tune the failure probability of each individual field independently from 0% to 100%.
  * **Quick Domain Starters**: One-click templates for *User Profile*, *E-Commerce Product*, *Billing Transaction*, and *API Telemetry*.
  * **Automatic Local Storage**: Custom schemas persist in `localStorage` across visits.
* **5 Export Targets**:
  * **Table Grid**: High-density monospaced data table with sticky headers, color-coded nulls/numbers, and live byte size counters.
  * **JSON**: Formatted JSON array for API mocks and test fixtures.
  * **CSV**: Quote-escaped comma-separated values for Excel or database import.
  * **TypeScript**: Typed interface declarations (`export interface CustomDataRecord`) with typed mock arrays.
  * **Zod**: Ready-to-use runtime Zod validation schema (`export const CustomRecordSchema = z.object(...)`).
  * **SQL**: Multi-row `INSERT INTO ... VALUES (...)` statements for PostgreSQL, MySQL, and SQLite.
* **Re-roll Hotkey**: Press <kbd>R</kbd> anywhere to re-generate permutations instantly.

---

### 2. 🔤 Open Source Fonts Studio (`/fonts`)
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

### 3. 🎨 Vector Icons Studio & SVG Customizer (`/icons`)
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

### 4. 🔌 Real-World API & SSO Responses Vault (`/api-vault`)
Actual production API response payloads and schemas for 17 real-world enterprise services:

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
  * **Data Types Table**: Field-by-field specification description and data type definitions.

---

## 🔍 Supreme SEO Architecture

DevPlayground is built from the ground up for maximum search discoverability:
* **Server-Side Generation (SSG)**: All 5 routes are pre-rendered at build time for instant first-contentful paint.
* **Per-Route Metadata**: Dedicated `<title>`, `<meta name="description">`, `<meta name="keywords">`, and OpenGraph cards on every page.
* **Dynamic XML Sitemap**: Automatic `https://devplayground.io/sitemap.xml` listing all endpoints with daily/weekly change frequencies.
* **Robots Configuration**: `https://devplayground.io/robots.txt` granting full search indexability.
* **Structured JSON-LD Data**: Embedded `SoftwareApplication` / `DeveloperApplication` schema on the root layout for Google Rich Results.

---

## 🌓 Dark & Light Mode (Mandatory Compliance)

DevPlayground strictly adheres to the dual-theme engineering standards in `GEMINI.md`:
* **Theme Switcher**: Click the Sun/Moon toggle in the top right header.
* **High-Contrast CSS Custom Properties**: Uses `--bg-panel`, `--bg-sidebar`, `--border-dev`, `--text-primary`, and `--text-code` for WCAG-compliant contrast in both dark and light modes.
* **Automatic Persistence**: Active theme preference synchronizes with `localStorage['failstate-theme']` and root `<html class="dark/light">`.

---

## 🛡️ Privacy & Zero-Tracking Guarantee

DevPlayground operates **100% client-side in your browser**:
* **Zero Telemetry**: No custom schemas, dirty strings, search queries, or generated mock records are sent to an external server.
* **Offline Capable**: All datasets are bundled directly into the application.

---

## 💻 Developer Quickstart

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ / v24+ recommended)
* **npm**: v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/allwin-antony/failstate.git
cd failstate

# Install dependencies
npm install

# Start local Next.js development server
npm run dev
```

Open **http://localhost:5173** (or http://localhost:3000) in your browser.

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
* **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Theme Design Tokens
* **Icons**: Lucide React
* **Dataset**: OpenSourceDataset (Fonts, Icons, ServiceResponses)
* **License**: MIT License
