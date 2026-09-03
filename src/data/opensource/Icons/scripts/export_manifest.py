#!/usr/bin/env python3
"""
export_manifest.py
Generates downloadable manifests and metadata lists for open-source icon libraries.
Supported export formats:
- csv: Tabular spreadsheet of libraries, licenses, total icons, and API endpoints
- json: Full structured metadata
- txt: Plain list of SVG API endpoints
- sh: Executable bash script containing curl commands
"""

import os
import sys
import json
import csv
import io
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")


def load_all_collections():
    coll_path = os.path.join(CATALOG_DIR, "icon_collections.json")
    if os.path.exists(coll_path):
        with open(coll_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def filter_collections(collections, query=None, license_type=None, category=None):
    filtered = []
    for c in collections:
        if query and (query.lower() not in c["name"].lower() and query.lower() not in c["prefix"].lower()):
            continue
        if license_type and (license_type.lower() not in str(c.get("license", "")).lower() and license_type.lower() not in str(c.get("license_spdx", "")).lower()):
            continue
        if category and (category.lower() not in str(c.get("category", "")).lower()):
            continue
        filtered.append(c)
    return filtered


def export_manifest(collections, fmt="csv", output_file=None):
    if fmt == "json":
        content = json.dumps(collections, indent=2, ensure_ascii=False)
    elif fmt == "csv":
        output_buffer = io.StringIO()
        fieldnames = ["name", "prefix", "total_icons", "license", "category", "author", "author_url", "svg_endpoint", "json_endpoint"]
        writer = csv.DictWriter(output_buffer, fieldnames=fieldnames)
        writer.writeheader()
        for c in collections:
            writer.writerow({
                "name": c.get("name"),
                "prefix": c.get("prefix"),
                "total_icons": c.get("total_icons", 0),
                "license": c.get("license_spdx") or c.get("license") or "Open Source",
                "category": c.get("category"),
                "author": c.get("author"),
                "author_url": c.get("author_url"),
                "svg_endpoint": c.get("svg_endpoint"),
                "json_endpoint": c.get("json_endpoint")
            })
        content = output_buffer.getvalue()
    elif fmt == "txt":
        lines = [c.get("json_endpoint") for c in collections if c.get("json_endpoint")]
        content = '\n'.join(lines) + '\n'
    elif fmt == "sh":
        lines = ["#!/usr/bin/env bash", "set -e", "mkdir -p downloads/manifests", ""]
        for c in collections:
            url = c.get("json_endpoint")
            if url:
                lines.append(f"# {c['name']} ({c['prefix']}) - {c.get('total_icons')} icons")
                lines.append(f"curl -fsSL '{url}' -o 'downloads/manifests/{c['prefix']}.json' || true\n")
        content = '\n'.join(lines)
    else:
        raise ValueError(f"Unknown format: {fmt}")

    if output_file:
        with open(output_file, "w", encoding="utf-8") as out:
            out.write(content)
        print(f"Manifest exported successfully ({len(collections)} collections) -> {output_file}")
    else:
        print(content)


def main():
    parser = argparse.ArgumentParser(description="Export download manifests and URL lists for open-source icon collections.")
    parser.add_argument("--format", "-f", choices=["json", "csv", "txt", "sh"], default="csv", help="Export format (default: csv)")
    parser.add_argument("--output", "-o", help="Output file path (default: stdout)")
    parser.add_argument("--query", "-q", help="Filter by name/prefix")
    parser.add_argument("--license", "-l", help="Filter by license (MIT, Apache-2.0, ISC, CC0)")
    parser.add_argument("--category", "-c", help="Filter by category")
    parser.add_argument("--limit", "-n", type=int, default=None, help="Maximum number of items to export (default: all)")

    args = parser.parse_args()

    all_colls = load_all_collections()
    filtered = filter_collections(
        all_colls,
        query=args.query,
        license_type=args.license,
        category=args.category
    )

    if args.limit:
        filtered = filtered[:args.limit]

    export_manifest(filtered, fmt=args.format, output_file=args.output)


if __name__ == "__main__":
    main()
