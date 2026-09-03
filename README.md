# FailState Studio ⚡

> **High-Entropy Edge-Case Data Synthesizer & Visual Schema Builder for Developers.**

FailState Studio is a fast, high-density developer platform built to stress-test applications, frontends, APIs, and database schemas against dirty real-world data before deploying to production.

Most software fails on edge-case boundaries: 150-character unbroken strings, RTL bidirectional overrides, floating-point rounding traps (`0.1 + 0.2 = 0.30000000000000004`), zero-width invisible joiners, and unexpected nulls. FailState Studio produces high-entropy mock records and custom dirty schemas with zero setup.

---

## 🎯 Core Capabilities

### 1. 🔥 Domain Presets Synthesizer
Instant access to curated, battle-tested edge-case test datasets:
* **E-Commerce Orders**: High-entropy items, zero-quantity discounts, extreme quantities (`999999`), multi-currency anomalies (`BTC`, `JPY`, `KWD`), negative unit prices, and subtotal precision glitches.
* **B2B Users & Identities**: Complex multi-script names (Kanji, Cyrillic, Arabic), diacritics and hyphens (`Dr. O'Connor-Smith, Jr.`), exotic email formats (`user+tag@sub.domain.co.uk`, punycode), and extreme phone formats.
* **Invoicing & Transactions**: Floating-point anomalies, delinquent flags, 18-decimal cryptocurrency fees, and negative discounts.
* **BLNS Naughty Strings**: Direct integration of the Big List of Naughty Strings covering Unicode exploits, SQL injection fragments, XSS tokens, and script mixing.
* **Interactive Controls**: Toggle row volume (`[10] [25] [50] [100]`), adjust the entropy slider (0%–100%), and press <kbd>R</kbd> to re-roll permutations.

---

### 2. 🧩 Custom Schema Builder (Visual Field Composer)
Compose your own custom dirty schemas directly in the browser through a visual interface — **no code required**:
* **13+ Built-In Field Types**:
  * `UUID / ID` (v4 UUIDs, zero-UUIDs, null representations)
  * `Full Name` (multilingual names, diacritics, untrimmed spaces)
  * `Email Address` (nested plus tags, unicode domains, extreme lengths)
  * `Mailing Address` (multiline street lines, international formats)
  * `Phone Number` (international country codes, extensions, bad formats)
  * `Integer` (min/max boundaries, negative, zero, overflows)
  * `Float / Currency` (0.1+0.2 precision traps, 18-decimal fractions, tiny fractions)
  * `Boolean Flag` (true/false with null and falsy string anomalies)
  * `Date / Timestamp` (Epoch 0, Y2038 bug, timezone offset traps)
  * `Enum / Status` (user-defined comma-separated options with unexpected stray values)
  * `Web URL` (punycode, query param floods, localhost)
  * `Naughty String (BLNS)` (Unicode Zalgo, script injection fragments)
  * `JSON Metadata` (nested objects, recursive traps, null values)
* **Per-Column Chaos Sliders**: Tune the exact failure probability of each individual field independently.
* **One-Click Domain Starters**: Instant templates for *User Profile*, *E-Commerce Product*, *Billing Transaction*, and *API Telemetry*.
* **Automatic Persistence**: Custom schemas are automatically saved to `localStorage` so your setup is preserved across sessions.

---

## 📦 Multi-Format Exports

Export generated datasets into your preferred format with one click:
* **Table Grid**: High-density monospaced data table with sticky headers, color-coded nulls/numbers, and payload byte size counters.
* **JSON**: Formatted JSON array ready for API testing or fixture files.
* **CSV**: Standard comma-separated values with escaped quotes for Excel or database import.
* **TypeScript**: Typed interface definitions (`export interface CustomDataRecord`) with typed mock arrays.
* **Zod**: Ready-to-use Zod runtime validation schema (`export const CustomRecordSchema = z.object(...)`).
* **SQL**: Multi-row `INSERT INTO ... VALUES (...)` statements for PostgreSQL, MySQL, and SQLite.

---

## ⌨️ Hotkeys & Ergonomics

| Key | Action |
| :--- | :--- |
| <kbd>R</kbd> | Re-roll permutations and generate fresh chaos data |
| <kbd>Sun</kbd> / <kbd>Moon</kbd> | Toggle between Dark Mode and Light Mode |

---

## 🌓 Dark & Light Mode

FailState Studio strictly supports both **Dark Mode** and **Light Mode**:
* **Theme Switcher**: Click the Sun/Moon icon in the top right header.
* **Persistence**: The active theme is stored in `localStorage` under `failstate-theme` and synchronized on startup.
* **High-Contrast Design Tokens**: Built using CSS custom properties (`--bg-panel`, `--bg-sidebar`, `--border-dev`, `--text-primary`) ensuring WCAG-compliant contrast in both modes.

---

## 🛡️ Privacy & Zero-Tracking Guarantee

FailState Studio runs **100% client-side directly in your browser**:
* **No Remote Telemetry**: No user inputs, custom schemas, or generated datasets are ever sent to an external server.
* **Safe for Real Schemas**: Compose private schemas or paste proprietary field structures with complete confidence.

---

## 💻 Developer Quickstart

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/your-username/failstate.git
cd failstate

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit **http://127.0.0.1:5173/** in your browser.

### Production Build

```bash
# Run TypeScript check and production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript
* **Bundler**: Vite 8 with `@tailwindcss/vite`
* **Styling**: Tailwind CSS v4 + Theme Custom Properties
* **Icons**: Lucide React
* **Privacy**: 100% Client-Side Sandbox

---

## 📄 License
MIT License. Built for developers who build resilient software.
