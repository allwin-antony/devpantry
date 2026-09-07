# ⚡ 100% Open-Source Icon Libraries Dataset & On-Demand Fetcher

A comprehensive, lightweight metadata dataset and tooling suite for **verified 100% open-source, attribution-free vector icon libraries**.

Instead of downloading tens of thousands of raw `.svg` files upfront, this repository stores **complete source metadata, API endpoints, NPM package commands, and direct download patterns for over 238 icon collections (350,000+ icons)**. You can search, inspect, and download any SVG icon or library on-demand whenever needed.

---

## 📂 Directory Layout

```
Icons/
├── README.md                          # Master documentation & quickstart guide
├── sources.json                       # Master registry of verified open-source libraries & API endpoints
├── .gitignore                         # Prevents downloaded SVGs from polluting git
├── catalogs/                          # Pre-indexed metadata catalogs (238 collections, 353,000+ icons)
│   ├── icon_collections.json          # Complete registry of all 238 open-source collections
│   ├── featured_libraries.json        # Detailed metadata for Lucide, Tabler, Material, Heroicons, Iconoir, etc.
│   └── npm_packages.json              # Framework bindings (React, Vue, Svelte, Angular, Flutter)
├── scripts/                           # On-demand CLI tools (Zero external dependencies)
│   ├── fetch_icon.py                  # Search collections, inspect info, and download SVGs on-demand
│   ├── sync_catalog.py                # Resync/update icon collection catalogs from upstream APIs
│   └── export_manifest.py             # Export icon lists to CSV, JSON, TXT, or Shell scripts
└── guides/                            # Legal & integration guides
    ├── licenses_explained.md          # Guide to MIT, ISC, Apache 2.0, and attribution-free usage
    └── web_integration_guide.md       # Integration guide for React, Vue, Svelte, and raw SVG
```

---

## 🔍 Featured 100% Open-Source Icon Libraries Included

| Library | Total Icons | License | Attribution Required? | Key Strengths |
| :--- | :---: | :---: | :---: | :--- |
| **[Lucide](https://lucide.dev/)** | 1,800+ | ISC / MIT | ❌ **No** | Modern community fork of Feather Icons. Ultra-consistent 24x24 grid. |
| **[Tabler Icons](https://tabler.io/icons)** | 6,100+ | MIT | ❌ **No** | Massive stroke-based vector library. Ideal for SaaS dashboards. |
| **[Google Material Symbols](https://fonts.google.com/icons)** | 15,000+ | Apache 2.0 | ❌ **No** | Google's official variable icon set with optical size and weight controls. |
| **[Heroicons](https://heroicons.com/)** | 1,200+ | MIT | ❌ **No** | Handcrafted by the Tailwind CSS team. 24px outline, solid, and 20px mini. |
| **[Iconoir](https://iconoir.com/)** | 1,600+ | MIT | ❌ **No** | Pristine geometric shapes, zero paywalls or premium tiers. |
| **[Phosphor Icons](https://phosphoricons.com/)** | 7,000+ | MIT | ❌ **No** | 6 flexible styles: thin, light, regular, bold, fill, duotone. |
| **[Remix Icon](https://remixicon.com/)** | 2,800+ | Apache 2.0 | ❌ **No** | Neutral system symbols for modern enterprise UI. |
| **[Simple Icons](https://simpleicons.org/)** | 3,200+ | CC0 1.0 | ❌ **No** | Vector SVG logos for global tech brands, dev tools, and social media. |
| **[Radix Icons](https://icons.radix-ui.com/)** | 318 | MIT | ❌ **No** | Crisp 15x15 pixel icons designed by WorkOS for compact UI. |

---

## 🚀 Quickstart & Usage

All scripts run out-of-the-box using standard Python 3 (`python3`) with **no `pip install` required**.

### 1. View Catalog Statistics
```bash
python3 scripts/fetch_icon.py stats
```

### 2. Search Icon Libraries
Search across all 238 indexed collections by name, prefix, category, or license:

```bash
# Search for a library
python3 scripts/fetch_icon.py search "lucide"
python3 scripts/fetch_icon.py search "tabler"

# Search for MIT licensed libraries
python3 scripts/fetch_icon.py search --license MIT
```

### 3. Inspect Library Metadata & Framework Commands
Get full library details, author, website, repository, sample icon names, and npm install commands:

```bash
python3 scripts/fetch_icon.py info "lucide"
python3 scripts/fetch_icon.py info "tabler"
python3 scripts/fetch_icon.py info "heroicons"
```

### 4. Download Individual SVG Icons On-Demand
Pulls the clean SVG file directly and saves it locally:

```bash
# Download a Lucide icon
python3 scripts/fetch_icon.py download lucide:sparkles

# Download a Tabler icon into a custom directory
python3 scripts/fetch_icon.py download tabler:device-desktop --output ./public/icons/desktop.svg

# Download Heroicons or Iconoir icons
python3 scripts/fetch_icon.py download heroicons:arrow-right
python3 scripts/fetch_icon.py download iconoir:edit
```

### 5. Export Manifests for Batch Tasks & Spreadsheets
```bash
# Export all 238 icon collections to CSV
python3 scripts/export_manifest.py --format csv -o icon_collections.csv

# Export MIT-licensed collections to JSON
python3 scripts/export_manifest.py --license MIT --format json -o mit_icons.json
```

### 6. Refresh / Sync Metadata Catalogs
To refresh the icon metadata catalogs from upstream APIs at any time:

```bash
python3 scripts/sync_catalog.py
```

---

## ⚖️ Legal & Licensing Summary

All featured libraries are governed by **MIT**, **ISC**, **Apache 2.0**, or **CC0 1.0**:
- **Commercial Use**: 100% permitted in commercial applications, SaaS products, mobile apps, and websites.
- **Attribution**: No mandatory visible attribution required on your public website or app UI.

👉 See [guides/licenses_explained.md](guides/licenses_explained.md) for full compliance details.
