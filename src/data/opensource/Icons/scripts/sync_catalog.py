#!/usr/bin/env python3
"""
sync_catalog.py
Fetches and syncs metadata for open-source icon collections from authoritative sources:
1. Iconify Open Icon Collections Registry (230+ open source icon collections, 150,000+ icons)
2. Curated Featured Libraries Dataset (Lucide, Tabler, Material Symbols, Heroicons, Iconoir, Phosphor, Remix, etc.)
3. Official NPM Package Registries & Framework Bindings

No SVG binary files or zips are downloaded; only lightweight JSON metadata manifests are stored.
"""

import os
import json
import urllib.request
import urllib.error
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenSourceIconCatalog/1.0"


def fetch_url_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error fetching {url}: {e}", file=sys.stderr)
        return None


def sync_icon_collections():
    print("[1/3] Syncing Open-Source Icon Collections Registry...")
    url = "https://api.iconify.design/collections"
    data = fetch_url_json(url)
    if not data:
        print("  -> Failed to fetch from Iconify API.")
        return 0

    collections = []
    for prefix, info in data.items():
        collections.append({
            "prefix": prefix,
            "name": info.get("name"),
            "total_icons": info.get("total", 0),
            "version": info.get("version"),
            "author": info.get("author", {}).get("name") if isinstance(info.get("author"), dict) else info.get("author"),
            "author_url": info.get("author", {}).get("url") if isinstance(info.get("author"), dict) else None,
            "license": info.get("license", {}).get("title") if isinstance(info.get("license"), dict) else info.get("license"),
            "license_spdx": info.get("license", {}).get("spdx") if isinstance(info.get("license"), dict) else None,
            "license_url": info.get("license", {}).get("url") if isinstance(info.get("license"), dict) else None,
            "category": info.get("category", "General"),
            "samples": info.get("samples", []),
            "svg_endpoint": f"https://api.iconify.design/{prefix}/{{icon_name}}.svg",
            "json_endpoint": f"https://api.iconify.design/{prefix}.json"
        })

    output_path = os.path.join(CATALOG_DIR, "icon_collections.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(collections, f, indent=2, ensure_ascii=False)

    total_icons = sum(c["total_icons"] for c in collections)
    print(f"  -> Successfully saved {len(collections)} icon collections ({total_icons:,} total icons) to {os.path.relpath(output_path, BASE_DIR)}")
    return len(collections)


def sync_featured_libraries():
    print("[2/3] Syncing Curated Featured Icon Libraries Dataset...")
    featured = [
        {
            "id": "lucide",
            "name": "Lucide",
            "tagline": "Beautiful & consistent icon toolkit made by the community, forked from Feather.",
            "total_icons": "1,800+",
            "license": "ISC / MIT",
            "license_note": "100% free for commercial and personal projects. No mandatory attribution.",
            "website": "https://lucide.dev/",
            "github": "https://github.com/lucide-icons/lucide",
            "releases_url": "https://github.com/lucide-icons/lucide/releases",
            "npm_packages": {
                "vanilla": "lucide",
                "static": "lucide-static",
                "react": "lucide-react",
                "vue": "lucide-vue-next",
                "svelte": "lucide-svelte",
                "angular": "lucide-angular",
                "flutter": "lucide_icons"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/{name}.svg",
            "api_prefix": "lucide"
        },
        {
            "id": "tabler-icons",
            "name": "Tabler Icons",
            "tagline": "Massive library of 6,100+ highly customizable stroke-based vector icons for SaaS & dashboards.",
            "total_icons": "6,100+",
            "license": "MIT",
            "license_note": "100% free for commercial use. No attribution required.",
            "website": "https://tabler.io/icons",
            "github": "https://github.com/tabler/tabler-icons",
            "releases_url": "https://github.com/tabler/tabler-icons/releases",
            "npm_packages": {
                "core": "@tabler/icons",
                "react": "@tabler/icons-react",
                "vue": "@tabler/icons-vue",
                "svelte": "@tabler/icons-svelte",
                "webfont": "@tabler/icons-webfont"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/{name}.svg",
            "api_prefix": "tabler"
        },
        {
            "id": "google-material-symbols",
            "name": "Google Material Symbols",
            "tagline": "Google's official variable icon library with optical size, weight, and grade controls.",
            "total_icons": "15,000+ variants",
            "license": "Apache 2.0",
            "license_note": "100% free for commercial use. Open source under Apache 2.0 license.",
            "website": "https://fonts.google.com/icons",
            "github": "https://github.com/google/material-design-icons",
            "releases_url": "https://github.com/google/material-design-icons/releases",
            "npm_packages": {
                "font": "material-symbols",
                "svg_24": "@material-symbols/svg-24",
                "svg_48": "@material-symbols/svg-48"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/@material-symbols/svg-24@latest/{style}/{name}.svg",
            "api_prefix": "material-symbols"
        },
        {
            "id": "heroicons",
            "name": "Heroicons",
            "tagline": "Hand-crafted vector icons by the Tailwind CSS team. 24px outline, 24px solid, and 20px solid/mini.",
            "total_icons": "1,200+ variants",
            "license": "MIT",
            "license_note": "100% free for commercial and personal projects. Attribution not required.",
            "website": "https://heroicons.com/",
            "github": "https://github.com/tailwindlabs/heroicons",
            "releases_url": "https://github.com/tailwindlabs/heroicons/releases",
            "npm_packages": {
                "core": "heroicons",
                "react": "@heroicons/react",
                "vue": "@heroicons/vue"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/heroicons@latest/24/outline/{name}.svg",
            "api_prefix": "heroicons"
        },
        {
            "id": "iconoir",
            "name": "Iconoir",
            "tagline": "High-quality open-source geometric icons with no paywalls or premium tiers.",
            "total_icons": "1,600+",
            "license": "MIT",
            "license_note": "100% open source under MIT. Free for commercial and personal usage.",
            "website": "https://iconoir.com/",
            "github": "https://github.com/iconoir-icons/iconoir",
            "releases_url": "https://github.com/iconoir-icons/iconoir/releases",
            "npm_packages": {
                "core": "iconoir",
                "react": "iconoir-react",
                "vue": "iconoir-vue",
                "svelte": "iconoir-svelte",
                "flutter": "iconoir_flutter"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/iconoir@latest/icons/regular/{name}.svg",
            "api_prefix": "iconoir"
        },
        {
            "id": "phosphor-icons",
            "name": "Phosphor Icons",
            "tagline": "Flexible icon family for interfaces, diagrams, and presentations in 6 weights (thin, light, regular, bold, fill, duotone).",
            "total_icons": "7,000+ variants (1,200+ unique shapes)",
            "license": "MIT",
            "license_note": "100% open source under MIT license.",
            "website": "https://phosphoricons.com/",
            "github": "https://github.com/phosphor-icons/core",
            "releases_url": "https://github.com/phosphor-icons/core/releases",
            "npm_packages": {
                "core": "@phosphor-icons/core",
                "react": "@phosphor-icons/react",
                "vue": "@phosphor-icons/vue",
                "web": "@phosphor-icons/web"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@latest/assets/regular/{name}.svg",
            "api_prefix": "ph"
        },
        {
            "id": "remix-icon",
            "name": "Remix Icon",
            "tagline": "Elaborately crafted open-source neutral style system symbols for designers and developers.",
            "total_icons": "2,800+",
            "license": "Apache 2.0",
            "license_note": "100% free for commercial use under Apache 2.0.",
            "website": "https://remixicon.com/",
            "github": "https://github.com/Remix-Design/RemixIcon",
            "releases_url": "https://github.com/Remix-Design/RemixIcon/releases",
            "npm_packages": {
                "core": "remixicon",
                "react": "remixicon-react"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.symbol.svg",
            "api_prefix": "ri"
        },
        {
            "id": "simple-icons",
            "name": "Simple Icons",
            "tagline": "Over 3,200 free SVG icons for popular global brands, tech stacks, and open-source tools.",
            "total_icons": "3,200+",
            "license": "CC0 1.0 (Public Domain)",
            "license_note": "Public Domain (subject to trademark fair use).",
            "website": "https://simpleicons.org/",
            "github": "https://github.com/simple-icons/simple-icons",
            "releases_url": "https://github.com/simple-icons/simple-icons/releases",
            "npm_packages": {
                "core": "simple-icons"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/{name}.svg",
            "api_prefix": "simple-icons"
        },
        {
            "id": "radix-icons",
            "name": "Radix Icons",
            "tagline": "A crisp set of 15x15 icons designed by WorkOS for clean, dense UI components.",
            "total_icons": "318",
            "license": "MIT",
            "license_note": "100% open source under MIT.",
            "website": "https://icons.radix-ui.com/",
            "github": "https://github.com/radix-ui/icons",
            "releases_url": "https://github.com/radix-ui/icons/releases",
            "npm_packages": {
                "react": "@radix-ui/react-icons"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/@radix-ui/react-icons@latest/dist/module/{name}.js",
            "api_prefix": "radix-icons"
        },
        {
            "id": "feather-icons",
            "name": "Feather Icons",
            "tagline": "Simply beautiful open source icons designed on a 24x24 grid by Cole Bemis.",
            "total_icons": "287",
            "license": "MIT",
            "license_note": "100% free under MIT.",
            "website": "https://feathericons.com/",
            "github": "https://github.com/feathericons/feather",
            "releases_url": "https://github.com/feathericons/feather/releases",
            "npm_packages": {
                "core": "feather-icons"
            },
            "cdn_svg_template": "https://cdn.jsdelivr.net/npm/feather-icons@latest/dist/icons/{name}.svg",
            "api_prefix": "feather"
        }
    ]

    output_path = os.path.join(CATALOG_DIR, "featured_libraries.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(featured, f, indent=2, ensure_ascii=False)

    print(f"  -> Successfully saved {len(featured)} featured libraries to {os.path.relpath(output_path, BASE_DIR)}")
    return len(featured)


def sync_npm_packages():
    print("[3/3] Syncing Framework Package Bindings...")
    framework_bindings = {
        "react": [
            {"library": "Lucide", "package": "lucide-react", "command": "npm install lucide-react"},
            {"library": "Tabler Icons", "package": "@tabler/icons-react", "command": "npm install @tabler/icons-react"},
            {"library": "Heroicons", "package": "@heroicons/react", "command": "npm install @heroicons/react"},
            {"library": "Iconoir", "package": "iconoir-react", "command": "npm install iconoir-react"},
            {"library": "Phosphor Icons", "package": "@phosphor-icons/react", "command": "npm install @phosphor-icons/react"},
            {"library": "Radix Icons", "package": "@radix-ui/react-icons", "command": "npm install @radix-ui/react-icons"},
            {"library": "Remix Icon", "package": "remixicon-react", "command": "npm install remixicon-react"}
        ],
        "vue": [
            {"library": "Lucide", "package": "lucide-vue-next", "command": "npm install lucide-vue-next"},
            {"library": "Tabler Icons", "package": "@tabler/icons-vue", "command": "npm install @tabler/icons-vue"},
            {"library": "Heroicons", "package": "@heroicons/vue", "command": "npm install @heroicons/vue"},
            {"library": "Iconoir", "package": "iconoir-vue", "command": "npm install iconoir-vue"},
            {"library": "Phosphor Icons", "package": "@phosphor-icons/vue", "command": "npm install @phosphor-icons/vue"}
        ],
        "svelte": [
            {"library": "Lucide", "package": "lucide-svelte", "command": "npm install lucide-svelte"},
            {"library": "Tabler Icons", "package": "@tabler/icons-svelte", "command": "npm install @tabler/icons-svelte"},
            {"library": "Iconoir", "package": "iconoir-svelte", "command": "npm install iconoir-svelte"},
            {"library": "Phosphor Icons", "package": "@phosphor-icons/svelte", "command": "npm install @phosphor-icons/svelte"}
        ],
        "flutter": [
            {"library": "Lucide", "package": "lucide_icons", "command": "flutter pub add lucide_icons"},
            {"library": "Iconoir", "package": "iconoir_flutter", "command": "flutter pub add iconoir_flutter"},
            {"library": "Phosphor Icons", "package": "phosphor_flutter", "command": "flutter pub add phosphor_flutter"}
        ]
    }

    output_path = os.path.join(CATALOG_DIR, "npm_packages.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(framework_bindings, f, indent=2, ensure_ascii=False)

    print(f"  -> Successfully saved framework bindings to {os.path.relpath(output_path, BASE_DIR)}")
    return len(framework_bindings)


def main():
    os.makedirs(CATALOG_DIR, exist_ok=True)
    print("==================================================")
    print(" Open-Source Icons Metadata Catalog Synchronizer  ")
    print("==================================================")
    c_count = sync_icon_collections()
    f_count = sync_featured_libraries()
    p_count = sync_npm_packages()
    print("--------------------------------------------------")
    print(f"Summary: Stored metadata for {c_count} icon collections & {f_count} featured libraries.")
    print("No binary SVG files were downloaded. Catalog is ready for on-demand fetching!")
    print("==================================================")


if __name__ == "__main__":
    main()
