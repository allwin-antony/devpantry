<p align="center">
  <img src="github-preview.png" alt="DevPantry Dashboard" />
</p>

# DevPantry

### The privacy-first developer toolbox for building, testing and breaking things.

Image processing, JWT inspection, chaos data, API fixtures, social previews, fonts, icons, developer registries and collaborative tools — designed to run in your browser whenever possible.

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-blue.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2-cyan.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-~6.0.2-blue.svg)](https://www.typescriptlang.org)
[![Author](https://img.shields.io/badge/Author-Allwin%20S%20Antony-violet.svg)](https://github.com/allwin-antony)

*[_link](https://devpantry.com/)*

---

## Why DevPantry?

**🔒 Privacy-first**  
Sensitive files, tokens and test data are processed locally whenever possible.

**⚡ Fast**  
Static delivery and browser-native APIs keep tools responsive without backend round trips.

**🧪 Built for edge cases**  
Generate malformed tokens, strange Unicode, broken media, extreme data and other production failures.

**🚫 No account required**  
Open a tool and use it.

**🌐 Open source**  
Inspect how the tools work and contribute improvements.

---

## Privacy Model

| Tool type                | Data leaves browser?                    |
| ------------------------ | --------------------------------------- |
| Image processing         | ❌ No                                    |
| JWT inspection           | ❌ No                                    |
| Mock data generation     | ❌ No                                    |
| Schema builder           | ❌ No                                    |
| Font testing             | ❌ No                                    |
| Icon customization       | Browser/API dependent                   |
| Social Preview URL fetch | ⚠️ Yes — metadata fetch                 |
| P2P collaboration        | ⚠️ Signaling only; document data is P2P |

---

## The Toolbox

### 🖼️ Create & Transform
* **[Background Remover](/tools/background-remover)**: 100% local AI neural inference via WebGPU.
* **[Image Resizer](/tools/image-resizer)**: Aspect ratio framing and smart padding.
* **[Image Compressor](/tools/image-compressor)**: Target KB budgeting.
* **[PDF Tools](/tools/image-to-pdf)**: Client-side merge, compress, and photo kit.
* **[EXIF Stripper](/tools/exif-stripper)**: Canvas stripping technique to remove metadata.
* **[HEIC Converter](/tools/heic-converter)**: Fast & private WebAssembly decoding.

### 🧪 Test & Debug
* **[JWT Inspector](/tools/jwt-decoder)**: Decode, validate, and chaos-tamper JWTs in-memory.
* **[Chaos Data Studio](/tools/mock-data)**: Synthesize high-entropy mock datasets.
* **[JSON to TS & Zod](/tools/json-to-ts-zod)**: Client-side AST parsing for schemas.
* **[API Templates](/tools/api-templates)**: Real-world response fixtures for Stripe, Supabase, etc.
* **[Social Share Preview](/tools/social-preview)**: Multi-platform mockups and OG checker.
* **Media Card Tester** *(Beta)*: Stress-test media cards with realistic and broken content (missing images, extremely long descriptions, error states) before shipping them.

### 🎨 Design Resources
* **[Fonts Studio](/fonts)**: 2,180+ open-source typefaces with live testing.
* **[Icons Studio](/icons)**: 350k+ vector icons across 238 open-source toolkits.

### 🤝 Collaboration
* **[P2P Collaborative Editor](/tools/collab)**: Zero-knowledge, real-time code editor powered by WebRTC & Yjs CRDTs.

### 📚 Developer Registries
* **[Public APIs Registry](/tools/public-apis)**: Searchable registry of 3k+ free public APIs.
* **[AI MCP & Tools Registry](/tools/mcp-registry)**: 4k+ open-source Model Context Protocol servers.

---

## Architecture & Documentation

DevPantry is a static-first, client-heavy application. Most processing happens inside the browser using Web APIs, WebAssembly, WebGPU and Canvas.

Detailed documentation is available in the `docs/` directory:
* **[Architecture](./docs/architecture.md)** — Detailed breakdown of performance optimizations, SEO routing, and tool implementations.
* **[Privacy](./docs/privacy.md)** — Explaining our zero-tracking philosophy and network behavior.
* **[Contributing](./docs/contributing.md)** — Local development setup and contribution guidelines.

---

## 💻 Developer Quickstart

### Prerequisites
* **Node.js**: `v18.0.0` or higher (`v20+` / `v24+` recommended)
* **npm**: `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/allwin-antony/devpantry.git
cd devpantry

# Install dependencies (Automatically downloads ~200MB of AI models locally via postinstall)
npm install

# Start local development server
npm run dev
```

Open **http://localhost:3000** (or http://localhost:5173) in your browser.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router with Turbopack)
* **Runtime**: React 19 + TypeScript
* **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Custom Design Tokens
* **Edge AI**: `@imgly/background-removal` (WebAssembly + WebGL) with local ISNet model serving
* **Icons**: Lucide React
* **Dataset**: OpenSourceDataset (Fonts, Icons, Service Responses)
* **Author**: [Allwin S Antony](https://github.com/allwin-antony)
* **License**: MIT License
