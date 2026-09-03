#!/usr/bin/env python3
"""
export_manifest.py
Generates downloadable manifests and URL lists for bulk fetching open-source fonts.
Supported export formats:
- json: Full structured metadata
- csv: Tabular spreadsheet with font name, category, license, and download links
- txt / urls: Plain text URL list for `wget -i` or `curl`
- aria2: Input file for ultra-fast parallel downloads via `aria2c -i manifest.aria2`
- sh: Executable bash script containing curl commands
"""

import os
import sys
import json
import csv
import urllib.parse
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")


def load_all_fonts():
    fs_path = os.path.join(CATALOG_DIR, "fontsource_catalog.json")
    fsh_path = os.path.join(CATALOG_DIR, "fontshare_catalog.json")
    gh_path = os.path.join(CATALOG_DIR, "github_repositories.json")

    items = []

    if os.path.exists(fs_path):
        with open(fs_path, "r", encoding="utf-8") as f:
            for d in json.load(f):
                items.append({
                    "name": d.get("family"),
                    "slug": d.get("id"),
                    "source": "Google Fonts / Fontsource",
                    "category": d.get("category", "other"),
                    "license": d.get("license", "Open Source"),
                    "variable": d.get("variable", False),
                    "download_url": f"https://registry.npmjs.org/@fontsource/{d.get('id')}",
                    "repo_url": "https://github.com/google/fonts"
                })

    if os.path.exists(fsh_path):
        with open(fsh_path, "r", encoding="utf-8") as f:
            for d in json.load(f):
                items.append({
                    "name": d.get("name"),
                    "slug": d.get("slug"),
                    "source": "Fontshare (ITF)",
                    "category": d.get("category", "other"),
                    "license": "SIL OFL 1.1" if d.get("is_sil_ofl") else "ITF Free Font License",
                    "variable": False,
                    "download_url": d.get("download_url"),
                    "repo_url": d.get("web_url")
                })

    if os.path.exists(gh_path):
        with open(gh_path, "r", encoding="utf-8") as f:
            for d in json.load(f):
                items.append({
                    "name": d.get("family"),
                    "slug": d.get("family", "").lower().replace(" ", "-"),
                    "source": "GitHub Foundries",
                    "category": d.get("category", "other"),
                    "license": d.get("license", "SIL OFL 1.1"),
                    "variable": d.get("variable", False),
                    "download_url": d.get("direct_zip_url") or d.get("repository"),
                    "repo_url": d.get("repository")
                })

    return items


def filter_fonts(fonts, source=None, category=None, license_type=None, variable_only=False):
    filtered = []
    for f in fonts:
        if source and source.lower() not in f["source"].lower():
            continue
        if category and category.lower() not in f["category"].lower():
            continue
        if license_type and license_type.lower() not in f["license"].lower():
            continue
        if variable_only and not f["variable"]:
            continue
        filtered.append(f)
    return filtered


def export_manifest(fonts, fmt="json", output_file=None):
    if fmt == "json":
        content = json.dumps(fonts, indent=2, ensure_ascii=False)
    elif fmt == "csv":
        import io
        output_buffer = io.StringIO()
        writer = csv.DictWriter(output_buffer, fieldnames=["name", "slug", "source", "category", "license", "variable", "download_url", "repo_url"])
        writer.writeheader()
        for f in fonts:
            writer.writerow({
                "name": f.get("name"),
                "slug": f.get("slug"),
                "source": f.get("source"),
                "category": f.get("category"),
                "license": f.get("license"),
                "variable": f.get("variable"),
                "download_url": f.get("download_url"),
                "repo_url": f.get("repo_url")
            })
        content = output_buffer.getvalue()
    elif fmt in ["txt", "urls"]:
        urls = [f["download_url"] for f in fonts if f.get("download_url")]
        content = '\n'.join(urls) + '\n'
    elif fmt == "aria2":
        lines = []
        for f in fonts:
            url = f.get("download_url")
            if url:
                lines.append(f"{url}")
                lines.append(f"  out={f['slug']}.zip\n")
        content = '\n'.join(lines)
    elif fmt == "sh":
        lines = ["#!/usr/bin/env bash", "set -e", "mkdir -p downloads", ""]
        for f in fonts:
            url = f.get("download_url")
            if url:
                lines.append(f"# {f['name']} ({f['license']})")
                lines.append(f"curl -fsSL -A 'Mozilla/5.0' '{url}' -o 'downloads/{f['slug']}.zip' || true\n")
        content = '\n'.join(lines)
    else:
        raise ValueError(f"Unknown format: {fmt}")

    if output_file:
        with open(output_file, "w", encoding="utf-8") as out:
            out.write(content)
        print(f"Manifest exported successfully ({len(fonts)} items) -> {output_file}")
    else:
        print(content)


def main():
    parser = argparse.ArgumentParser(description="Export download manifests and URL lists for open-source fonts.")
    parser.add_argument("--format", "-f", choices=["json", "csv", "txt", "urls", "aria2", "sh"], default="csv", help="Export format (default: csv)")
    parser.add_argument("--output", "-o", help="Output file path (default: stdout)")
    parser.add_argument("--source", "-s", help="Filter by source (google, fontshare, github)")
    parser.add_argument("--category", "-c", help="Filter by category (sans-serif, serif, monospace, display, etc.)")
    parser.add_argument("--license", "-l", help="Filter by license (ofl, apache, mit, etc.)")
    parser.add_argument("--variable-only", action="store_true", help="Only include variable font families")

    parser.add_argument("--limit", "-n", type=int, default=None, help="Maximum number of items to export (default: all)")

    args = parser.parse_args()

    all_fonts = load_all_fonts()
    filtered = filter_fonts(
        all_fonts,
        source=args.source,
        category=args.category,
        license_type=args.license,
        variable_only=args.variable_only
    )
    if args.limit:
        filtered = filtered[:args.limit]

    export_manifest(filtered, fmt=args.format, output_file=args.output)


if __name__ == "__main__":
    main()
