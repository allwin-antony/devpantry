# 🔤 Open-Source Fonts Dataset & On-Demand Fetcher

A comprehensive, lightweight metadata dataset and tooling suite for **verified open-source typography**.

Instead of downloading gigabytes of binary font files (`.ttf`, `.otf`, `.woff2`) upfront, this repository stores **complete source metadata, API endpoints, download patterns, and licenses for over 2,200+ open-source font families**. You can query, inspect, and download any font or category on-demand whenever needed.

---

## 📂 Directory Layout

```
Fonts/
├── README.md                          # Master documentation & usage guide
├── sources.json                       # Master registry of verified open-source sources & API endpoints
├── .gitignore                         # Prevents downloaded binaries from polluting git
├── catalogs/                          # Pre-indexed metadata catalogs (2,220+ fonts)
│   ├── fontsource_catalog.json        # Google Fonts & community fonts (2,100 families)
│   ├── fontshare_catalog.json         # Fontshare typography catalog (with SIL OFL filter)
│   └── github_repositories.json       # Curated independent GitHub foundries & superfamilies
├── scripts/                           # On-demand CLI tools (Zero external dependencies)
│   ├── fetch_font.py                  # Search, inspect, and download fonts on-demand
│   ├── sync_catalog.py                # Resync/refresh metadata from upstream APIs
│   └── export_manifest.py             # Export download URLs to CSV, JSON, aria2, or Shell scripts
└── guides/                            # Legal & technical references
    ├── licenses_explained.md          # Guide to SIL OFL 1.1, Apache 2.0, UFL, MIT, etc.
    └── font_formats_guide.md          # Technical guide to TTF, OTF, WOFF2, and Variable Fonts
```

---

## 🔍 Verified Open-Source Font Sources Included

| Source | Description | Total Fonts | Primary License |
| :--- | :--- | :--- | :--- |
| **[Google Fonts](https://fonts.google.com/)** | The world's largest libre typography repository | 1,700+ families | SIL OFL 1.1, Apache 2.0, UFL 1.0 |
| **[Fontshare](https://www.fontshare.com/)** | Quality typefaces by Indian Type Foundry (ITF) | 100 families (36+ OFL) | SIL OFL 1.1 & ITF Free License |
| **[Independent GitHub Foundries](https://github.com/showcases/fonts)** | Adobe, IBM Plex, Microsoft, GitHub Brand, JetBrains, League of Moveable Type, Velvetyne | 20+ superfamilies | SIL OFL 1.1, Apache 2.0, MIT |
| **[Fontsource](https://fontsource.org/)** | Open-source self-hosting font registry & CDN | 2,100+ packages | OFL-1.1, Apache-2.0, MIT, CC0 |
| **[Open Font Library](https://fontlibrary.org/)** | Libre font community index & repository | 1,000+ fonts | SIL OFL 1.1, Public Domain |

---

## 🚀 Quickstart & Usage

All scripts run out-of-the-box using standard Python 3 (`python3`) with **no `pip install` required**.

### 1. View Catalog Statistics
```bash
python3 scripts/fetch_font.py stats
```

### 2. Search for Fonts
Search across all indexed repositories by keyword, category, license, or source:

```bash
# Search by name
python3 scripts/fetch_font.py search "Inter"

# Search for monospace fonts (coding fonts)
python3 scripts/fetch_font.py search --category monospace

# Search for serif fonts licensed under OFL
python3 scripts/fetch_font.py search --category serif --license OFL-1.1

# Search specifically from Fontshare
python3 scripts/fetch_font.py search --source fontshare
```

### 3. Inspect Full Font Metadata
Get weights, styles, variable font axes, license, and repository links:

```bash
python3 scripts/fetch_font.py info "JetBrains Mono"
python3 scripts/fetch_font.py info "Satoshi"
python3 scripts/fetch_font.py info "Fira Code"
```

### 4. Download a Font On-Demand
Pulls the complete font assets (TTF, OTF, WOFF2, and CSS) and extracts them into `./downloads/<font-name>/`:

```bash
# Download Inter
python3 scripts/fetch_font.py download "Inter"

# Download Fira Code
python3 scripts/fetch_font.py download "Fira Code"

# Download Satoshi into a custom directory
python3 scripts/fetch_font.py download "Satoshi" --output ./my-fonts/satoshi
```

### 5. Export Manifests for Batch Downloads
Generate download manifests or URL lists for external download managers:

```bash
# Export all monospace fonts to CSV
python3 scripts/export_manifest.py --category monospace --format csv -o monospace_fonts.csv

# Export all variable fonts to an aria2c input file for ultra-fast parallel downloads
python3 scripts/export_manifest.py --variable-only --format aria2 -o variable_fonts.aria2
# Download with: aria2c -i variable_fonts.aria2

# Export all SIL OFL fonts to an executable bash script with curl commands
python3 scripts/export_manifest.py --license ofl --format sh -o download_ofl_fonts.sh
```

### 6. Refresh / Sync Metadata Catalogs
To fetch the latest metadata from Google Fonts / Fontsource and Fontshare:

```bash
python3 scripts/sync_catalog.py
```

---

## ⚖️ Legal & Licensing Summary

- **SIL Open Font License 1.1 (SIL OFL)**: 100% free for commercial & personal projects, web embedding, app embedding, and modifications. Cannot be sold as a standalone `.ttf`/`.otf` file without bundled software or design.
- **Apache 2.0**: Free commercial and personal use with express patent grant.
- **MIT / CC0**: Ultra-permissive open source / public domain.
- **Fontshare Note**: Filter with `--license ofl` if your project requires strict open-source redistribution. Fontshare's `itf_ffl` fonts are free for commercial use but are closed-source freeware.

👉 See [guides/licenses_explained.md](guides/licenses_explained.md) for full compliance details.
