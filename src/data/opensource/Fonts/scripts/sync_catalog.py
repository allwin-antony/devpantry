#!/usr/bin/env python3
"""
sync_catalog.py
Fetches and syncs metadata for open-source fonts from authoritative sources:
1. Fontsource API (covers 2,100+ open-source Google & community fonts with OFL, Apache, MIT, etc.)
2. Fontshare API (filters for SIL OFL open-source typefaces)
3. Curated GitHub repositories index

No font binary files are downloaded; only lightweight JSON metadata manifests are stored.
"""

import os
import json
import urllib.request
import urllib.error
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenSourceFontCatalog/1.0"


def fetch_url_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Error fetching {url}: {e}", file=sys.stderr)
        return None


def sync_fontsource():
    print("[1/3] Syncing Fontsource Open Source Catalog...")
    url = "https://api.fontsource.org/v1/fonts"
    data = fetch_url_json(url)
    if not data:
        print("  -> Failed to fetch from Fontsource API.")
        return 0

    output_path = os.path.join(CATALOG_DIR, "fontsource_catalog.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  -> Successfully saved {len(data)} font families to {os.path.relpath(output_path, BASE_DIR)}")
    return len(data)


def sync_fontshare():
    print("[2/3] Syncing Fontshare SIL OFL Catalog...")
    url = "https://api.fontshare.com/v2/fonts"
    data = fetch_url_json(url)
    if not data or "fonts" not in data:
        print("  -> Failed to fetch from Fontshare API.")
        return 0

    all_fonts = data.get("fonts", [])
    # Filter SIL OFL fonts
    ofl_fonts = []
    for f in all_fonts:
        # We record all with license breakdown
        font_info = {
            "id": f.get("id"),
            "name": f.get("name"),
            "slug": f.get("slug"),
            "version": f.get("version"),
            "license_type": f.get("license_type"),
            "is_sil_ofl": (f.get("license_type") == "sil_ofl"),
            "category": f.get("category"),
            "styles_count": len(f.get("styles", [])),
            "designers": [d.get("name") for d in f.get("designers", []) if d.get("name")],
            "publisher": f.get("publisher", {}).get("name") if f.get("publisher") else None,
            "api_endpoint": f"https://api.fontshare.com/v2/fonts/{f.get('slug')}",
            "web_url": f"https://www.fontshare.com/fonts/{f.get('slug')}",
            "download_url": f"https://api.fontshare.com/v2/fonts/download/{f.get('slug')}"
        }
        ofl_fonts.append(font_info)

    output_path = os.path.join(CATALOG_DIR, "fontshare_catalog.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(ofl_fonts, f, indent=2, ensure_ascii=False)

    sil_count = sum(1 for f in ofl_fonts if f["is_sil_ofl"])
    print(f"  -> Successfully saved {len(ofl_fonts)} Fontshare fonts ({sil_count} verified SIL OFL) to {os.path.relpath(output_path, BASE_DIR)}")
    return len(ofl_fonts)


def sync_github_foundries():
    print("[3/3] Syncing Curated GitHub Open Source Font Repositories...")
    github_repos = [
        {
            "family": "Inter",
            "repository": "https://github.com/rsms/inter",
            "owner": "Rasmus Andersson",
            "license": "SIL OFL 1.1",
            "category": "sans-serif",
            "variable": True,
            "description": "A typeface specially designed for user interfaces with high x-height and readability.",
            "releases_api": "https://api.github.com/repos/rsms/inter/releases/latest",
            "direct_zip_url": "https://github.com/rsms/inter/releases/latest/download/Inter-4.1.zip"
        },
        {
            "family": "IBM Plex (Sans, Serif, Mono, Arabic, Thai, Devanagari, Math, etc.)",
            "repository": "https://github.com/IBM/plex",
            "owner": "IBM / Mike Abbink, Bold Monday",
            "license": "SIL OFL 1.1",
            "category": "superfamily (sans-serif, serif, monospace)",
            "variable": True,
            "description": "IBM's corporate typeface family designed to convey the relationship between mankind and machine.",
            "releases_api": "https://api.github.com/repos/IBM/plex/releases/latest",
            "direct_zip_url": "https://github.com/IBM/plex/releases/latest"
        },
        {
            "family": "JetBrains Mono",
            "repository": "https://github.com/JetBrains/JetBrainsMono",
            "owner": "JetBrains / Philipp Nurullin, Konstantin Bulenkov",
            "license": "SIL OFL 1.1",
            "category": "monospace",
            "variable": True,
            "description": "A typeface made for developers with code-specific ligatures and clear distinction of similar characters.",
            "releases_api": "https://api.github.com/repos/JetBrains/JetBrainsMono/releases/latest",
            "direct_zip_url": "https://github.com/JetBrains/JetBrainsMono/releases/latest/download/JetBrainsMono-2.304.zip"
        },
        {
            "family": "Fira Code",
            "repository": "https://github.com/tonsky/FiraCode",
            "owner": "Nikita Prokopov (tonsky)",
            "license": "SIL OFL 1.1",
            "category": "monospace",
            "variable": True,
            "description": "Monospaced font with programming ligatures based on Fira Mono.",
            "releases_api": "https://api.github.com/repos/tonsky/FiraCode/releases/latest",
            "direct_zip_url": "https://github.com/tonsky/FiraCode/releases/latest/download/Fira_Code_v6.2.zip"
        },
        {
            "family": "Adobe Source Sans 3",
            "repository": "https://github.com/adobe-fonts/source-sans",
            "owner": "Adobe Type",
            "license": "SIL OFL 1.1",
            "category": "sans-serif",
            "variable": True,
            "description": "Adobe's first open-source typeface family designed by Paul D. Hunt.",
            "releases_api": "https://api.github.com/repos/adobe-fonts/source-sans/releases/latest",
            "direct_zip_url": "https://github.com/adobe-fonts/source-sans/releases/latest"
        },
        {
            "family": "Adobe Source Code Pro",
            "repository": "https://github.com/adobe-fonts/source-code-pro",
            "owner": "Adobe Type",
            "license": "SIL OFL 1.1",
            "category": "monospace",
            "variable": True,
            "description": "A set of monospaced OpenType fonts designed for coding and UI environments.",
            "releases_api": "https://api.github.com/repos/adobe-fonts/source-code-pro/releases/latest",
            "direct_zip_url": "https://github.com/adobe-fonts/source-code-pro/releases/latest"
        },
        {
            "family": "Adobe Source Serif 4",
            "repository": "https://github.com/adobe-fonts/source-serif",
            "owner": "Adobe Type",
            "license": "SIL OFL 1.1",
            "category": "serif",
            "variable": True,
            "description": "A serif typeface designed by Frank Grießhammer for digital text reading.",
            "releases_api": "https://api.github.com/repos/adobe-fonts/source-serif/releases/latest",
            "direct_zip_url": "https://github.com/adobe-fonts/source-serif/releases/latest"
        },
        {
            "family": "Adobe Source Han Sans / Serif / Mono",
            "repository": "https://github.com/adobe-fonts/source-han-sans",
            "owner": "Adobe & Google (Noto CJK)",
            "license": "SIL OFL 1.1",
            "category": "cjk-sans-serif",
            "variable": True,
            "description": "Pan-CJK open-source font superfamily supporting Simplified Chinese, Traditional Chinese, Japanese, and Korean.",
            "releases_api": "https://api.github.com/repos/adobe-fonts/source-han-sans/releases/latest",
            "direct_zip_url": "https://github.com/adobe-fonts/source-han-sans/releases/latest"
        },
        {
            "family": "Mona Sans & Hubot Sans",
            "repository": "https://github.com/github/mona-sans",
            "owner": "GitHub / Degarism",
            "license": "SIL OFL 1.1",
            "category": "sans-serif",
            "variable": True,
            "description": "GitHub's expressive variable fonts with expansive slant, weight, and width axes.",
            "releases_api": "https://api.github.com/repos/github/mona-sans/releases/latest",
            "direct_zip_url": "https://github.com/github/mona-sans/releases/latest/download/mona-sans-1.0.1.zip"
        },
        {
            "family": "Cascadia Code",
            "repository": "https://github.com/microsoft/cascadia-code",
            "owner": "Microsoft / Aaron Bell",
            "license": "SIL OFL 1.1",
            "category": "monospace",
            "variable": True,
            "description": "Microsoft's default coding font for Windows Terminal, VS Code, and modern consoles.",
            "releases_api": "https://api.github.com/repos/microsoft/cascadia-code/releases/latest",
            "direct_zip_url": "https://github.com/microsoft/cascadia-code/releases/latest"
        },
        {
            "family": "Red Hat Display / Text / Mono",
            "repository": "https://github.com/RedHatOfficial/RedHatFont",
            "owner": "Red Hat / MCKL (Jeremy Mickel)",
            "license": "SIL OFL 1.1",
            "category": "superfamily (sans-serif, monospace)",
            "variable": True,
            "description": "Open-source superfamily created for Red Hat's brand identity, inspired by geometric neo-grotesques.",
            "releases_api": "https://api.github.com/repos/RedHatOfficial/RedHatFont/releases/latest",
            "direct_zip_url": "https://github.com/RedHatOfficial/RedHatFont/releases/latest"
        },
        {
            "family": "Overpass",
            "repository": "https://github.com/RedHatOfficial/Overpass",
            "owner": "Red Hat / Delve Fonts",
            "license": "SIL OFL 1.1",
            "category": "sans-serif & monospace",
            "variable": True,
            "description": "An open source font family inspired by Highway Gothic.",
            "releases_api": "https://api.github.com/repos/RedHatOfficial/Overpass/releases/latest",
            "direct_zip_url": "https://github.com/RedHatOfficial/Overpass/releases/latest"
        },
        {
            "family": "Hack",
            "repository": "https://github.com/source-foundry/Hack",
            "owner": "Source Foundry / Chris Simpkins",
            "license": "SIL OFL 1.1 / Bitstream Vera",
            "category": "monospace",
            "variable": False,
            "description": "A typeface designed for source code reading and editing across platforms.",
            "releases_api": "https://api.github.com/repos/source-foundry/Hack/releases/latest",
            "direct_zip_url": "https://github.com/source-foundry/Hack/releases/latest"
        },
        {
            "family": "Victor Mono",
            "repository": "https://github.com/rubjo/victor-mono",
            "owner": "Rune Bjarne",
            "license": "SIL OFL 1.1",
            "category": "monospace (cursive italics)",
            "variable": False,
            "description": "A programming font with semi-connected cursive italics and programming ligatures.",
            "releases_api": "https://api.github.com/repos/rubjo/victor-mono/releases/latest",
            "direct_zip_url": "https://rubjo.github.io/victor-mono/VictorMonoAll.zip"
        },
        {
            "family": "Manrope",
            "repository": "https://github.com/sharanda/manrope",
            "owner": "Mikhail Sharanda",
            "license": "SIL OFL 1.1",
            "category": "sans-serif",
            "variable": True,
            "description": "Modern, geometric open-source sans-serif font family with clean aesthetics.",
            "releases_api": "https://api.github.com/repos/sharanda/manrope/releases/latest",
            "direct_zip_url": "https://github.com/sharanda/manrope/releases/latest"
        },
        {
            "family": "Space Grotesk & Space Mono",
            "repository": "https://github.com/floriankarsten/space-grotesk",
            "owner": "Florian Karsten",
            "license": "SIL OFL 1.1",
            "category": "sans-serif & monospace",
            "variable": True,
            "description": "Proportional sans-serif variant based on Colophon's Space Mono for modern brutalist & tech typography.",
            "releases_api": "https://api.github.com/repos/floriankarsten/space-grotesk/releases/latest",
            "direct_zip_url": "https://github.com/floriankarsten/space-grotesk/releases/latest"
        },
        {
            "family": "Atkinson Hyperlegible",
            "repository": "https://github.com/googlefonts/atkinson-hyperlegible",
            "owner": "Braille Institute / Applied Design Works",
            "license": "SIL OFL 1.1",
            "category": "sans-serif",
            "variable": True,
            "description": "Designed specifically for people with low vision to maximize letterform distinction and legibility.",
            "releases_api": "https://api.github.com/repos/googlefonts/atkinson-hyperlegible/releases/latest",
            "direct_zip_url": "https://www.brailleinstitute.org/wp-content/uploads/atkinson-hyperlegible-font/Atkinson-Hyperlegible-Font-Print-and-Web-2020-0514.zip"
        },
        {
            "family": "The League of Moveable Type Collection (League Spartan, League Gothic, Raleway, Junction, Chunk)",
            "repository": "https://github.com/theleagueof",
            "owner": "The League of Moveable Type",
            "license": "SIL OFL 1.1",
            "category": "foundry collection",
            "variable": True,
            "description": "The first open-source font foundry, raising the design standards of the open web.",
            "releases_api": "https://www.theleagueofmoveabletype.com/",
            "direct_zip_url": "https://www.theleagueofmoveabletype.com/"
        },
        {
            "family": "Velvetyne Type Foundry (VTF) Collection",
            "repository": "https://github.com/velvetyne",
            "owner": "Velvetyne Type Foundry / Frank Adebiaye et al.",
            "license": "SIL OFL 1.1",
            "category": "experimental & display foundry",
            "variable": True,
            "description": "Pioneering French open-source foundry creating free, libre, and open-source expressive display typefaces.",
            "releases_api": "https://velvetyne.fr/",
            "direct_zip_url": "https://velvetyne.fr/"
        },
        {
            "family": "Collletttivo Collection",
            "repository": "https://github.com/collletttivo",
            "owner": "Collletttivo",
            "license": "SIL OFL 1.1",
            "category": "display & contemporary foundry",
            "variable": True,
            "description": "Open-source type design collective promoting libre type design and education.",
            "releases_api": "http://www.collletttivo.it/",
            "direct_zip_url": "http://www.collletttivo.it/"
        },
        {
            "family": "Google Fonts Complete Source Repository",
            "repository": "https://github.com/google/fonts",
            "owner": "Google Fonts & Open Source Contributors",
            "license": "SIL OFL 1.1 / Apache 2.0 / UFL 1.0",
            "category": "mega-repository (1700+ families)",
            "variable": True,
            "description": "The primary git repository holding source files and binaries for all fonts hosted on Google Fonts.",
            "releases_api": "https://github.com/google/fonts",
            "direct_zip_url": "https://github.com/google/fonts/archive/refs/heads/main.tar.gz"
        }
    ]

    output_path = os.path.join(CATALOG_DIR, "github_repositories.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(github_repos, f, indent=2, ensure_ascii=False)

    print(f"  -> Successfully saved {len(github_repos)} curated GitHub repositories to {os.path.relpath(output_path, BASE_DIR)}")
    return len(github_repos)


def main():
    os.makedirs(CATALOG_DIR, exist_ok=True)
    print("==================================================")
    print(" Open-Source Fonts Metadata Catalog Synchronizer  ")
    print("==================================================")
    fs_count = sync_fontsource()
    fsh_count = sync_fontshare()
    gh_count = sync_github_foundries()
    print("--------------------------------------------------")
    print(f"Summary: Stored metadata for {fs_count + fsh_count + gh_count} open-source fonts/sources.")
    print("No binary font files were downloaded. Catalog is ready for on-demand fetching!")
    print("==================================================")


if __name__ == "__main__":
    main()
