#!/usr/bin/env python3
"""
fetch_icon.py
CLI Tool to search, inspect metadata, and download open-source SVG icons on-demand.
Uses cached catalogs in ../catalogs/ and pulls SVG assets directly when requested.
Zero external dependencies required (uses standard library urllib, json, os, sys, argparse).
"""

import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")
DOWNLOADS_DIR = os.path.join(BASE_DIR, "downloads")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenSourceIconFetcher/1.0"


def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}", file=sys.stderr)
        return None


def get_catalogs():
    coll_path = os.path.join(CATALOG_DIR, "icon_collections.json")
    feat_path = os.path.join(CATALOG_DIR, "featured_libraries.json")
    npm_path = os.path.join(CATALOG_DIR, "npm_packages.json")

    collections = load_json(coll_path) or []
    featured = load_json(feat_path) or []
    npm_packages = load_json(npm_path) or {}

    return collections, featured, npm_packages


def search_libraries(query=None, license_type=None, category=None, limit=30):
    collections, featured, _ = get_catalogs()
    results = []

    for c in collections:
        name = c.get("name", "")
        prefix = c.get("prefix", "")
        lic = c.get("license", "") or c.get("license_spdx", "")
        cat = c.get("category", "")

        if query and (query.lower() not in name.lower() and query.lower() not in prefix.lower()):
            continue
        if license_type and (license_type.lower() not in str(lic).lower()):
            continue
        if category and (category.lower() not in str(cat).lower()):
            continue

        results.append({
            "name": name,
            "prefix": prefix,
            "total_icons": c.get("total_icons", 0),
            "license": lic,
            "category": cat,
            "author": c.get("author", "Unknown"),
            "samples": c.get("samples", [])[:5]
        })

    return results[:limit]


def get_library_info(prefix_or_name):
    collections, featured, npm_pkgs = get_catalogs()
    target = prefix_or_name.lower().strip()

    # Match in featured first
    feat_match = None
    for f in featured:
        if target == f.get("id") or target == f.get("api_prefix") or target == f.get("name", "").lower():
            feat_match = f
            break

    # Match in all collections
    coll_match = None
    for c in collections:
        if target == c.get("prefix") or target == c.get("name", "").lower():
            coll_match = c
            break

    if not coll_match and not feat_match:
        # Partial match
        for c in collections:
            if target in c.get("prefix") or target in c.get("name", "").lower():
                coll_match = c
                break

    return {
        "collection": coll_match,
        "featured_details": feat_match,
        "framework_bindings": npm_pkgs
    }


def download_svg_icon(icon_ref, output_path=None):
    """
    Downloads an SVG icon by reference (e.g. 'lucide:sparkles', 'tabler/check', or 'sparkles' with default prefix).
    """
    if ":" in icon_ref:
        prefix, icon_name = icon_ref.split(":", 1)
    elif "/" in icon_ref:
        prefix, icon_name = icon_ref.split("/", 1)
    else:
        prefix = "lucide"
        icon_name = icon_ref

    prefix = prefix.strip().lower()
    icon_name = icon_name.strip().lower()

    svg_url = f"https://api.iconify.design/{prefix}/{icon_name}.svg"
    req = urllib.request.Request(svg_url, headers={"User-Agent": USER_AGENT})

    if not output_path:
        target_dir = os.path.join(DOWNLOADS_DIR, prefix)
        os.makedirs(target_dir, exist_ok=True)
        output_file = os.path.join(target_dir, f"{icon_name}.svg")
    else:
        if output_path.endswith(".svg"):
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            output_file = output_path
        else:
            os.makedirs(output_path, exist_ok=True)
            output_file = os.path.join(output_path, f"{icon_name}.svg")

    print("=" * 60)
    print(f" Fetching SVG Icon: {prefix}:{icon_name}")
    print(f" Source URL:        {svg_url}")
    print(f" Destination:       {output_file}")
    print("=" * 60)

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            svg_content = resp.read().decode("utf-8")

        if "<svg" not in svg_content:
            print(f"Error: Received invalid SVG from API for '{icon_ref}'. Verify the icon name.", file=sys.stderr)
            return False

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(svg_content)

        print(f" Successfully downloaded SVG ({len(svg_content)} bytes)")
        print(f" Saved to: {output_file}\n")
        return True

    except Exception as e:
        print(f"Download failed: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Open-Source Icons Fetcher: Search, query, and download verified open-source SVG icons on-demand."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Search command
    search_p = subparsers.add_parser("search", help="Search icon collections in catalog")
    search_p.add_argument("query", nargs="?", default=None, help="Collection name or prefix to search (e.g., 'lucide', 'tabler', 'hero')")
    search_p.add_argument("--license", "-l", help="Filter by license (MIT, Apache-2.0, ISC, CC0)")
    search_p.add_argument("--category", "-c", help="Filter by category")
    search_p.add_argument("--limit", "-n", type=int, default=25, help="Max results to display (default: 25)")

    # Info command
    info_p = subparsers.add_parser("info", help="Get detailed metadata and package install commands for an icon library")
    info_p.add_argument("name", help="Library prefix or name (e.g. 'lucide', 'tabler', 'material-symbols', 'heroicons', 'iconoir')")

    # Download command
    dl_p = subparsers.add_parser("download", help="Download an SVG icon on-demand")
    dl_p.add_argument("icon", help="Icon reference in format 'prefix:name' (e.g. 'lucide:sparkles', 'tabler:settings', 'heroicons:arrow-right')")
    dl_p.add_argument("--output", "-o", help="Target output file or directory (default: ./downloads/<prefix>/<name>.svg)")

    # Stats command
    subparsers.add_parser("stats", help="Display summary statistics of indexed open-source icon collections")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "search":
        results = search_libraries(
            query=args.query,
            license_type=args.license,
            category=args.category,
            limit=args.limit
        )
        if not results:
            print("No icon collections matched your search criteria.")
            return

        print(f"\nFound {len(results)} collection(s):\n")
        print(f"{'Name':<28} {'Prefix':<18} {'Total Icons':<14} {'License':<15}")
        print("-" * 78)
        for r in results:
            name_str = r['name'][:26]
            pre_str = r['prefix'][:16]
            tot_str = f"{r['total_icons']:,}"
            lic_str = str(r['license'])[:14]
            print(f"{name_str:<28} {pre_str:<18} {tot_str:<14} {lic_str:<15}")
        print("\nTip: Run `python3 scripts/fetch_icon.py info \"<prefix>\"` to see install commands and sample icons.")
        print("     Run `python3 scripts/fetch_icon.py download \"<prefix>:<icon_name>\"` to fetch any SVG directly.\n")

    elif args.command == "info":
        info = get_library_info(args.name)
        if not info["collection"] and not info["featured_details"]:
            print(f"Library '{args.name}' not found. Try searching with `python3 scripts/fetch_icon.py search {args.name}`")
            return
        
        coll = info["collection"] or {}
        feat = info["featured_details"] or {}
        
        print("\n" + "=" * 65)
        print(f"  {coll.get('name') or feat.get('name')} ({coll.get('prefix') or feat.get('api_prefix')})")
        print("=" * 65)
        if feat.get("tagline"):
            print(f" Description:  {feat.get('tagline')}")
        print(f" Total Icons:  {coll.get('total_icons', feat.get('total_icons'))}")
        print(f" License:      {coll.get('license') or feat.get('license')} (SPDX: {coll.get('license_spdx', 'N/A')})")
        print(f" Author:       {coll.get('author')}")
        if coll.get("author_url"):
            print(f" Author URL:   {coll.get('author_url')}")
        if feat.get("website"):
            print(f" Website:      {feat.get('website')}")
        if feat.get("github"):
            print(f" GitHub Repo:  {feat.get('github')}")

        print(f"\n SVG Fetch API:")
        print(f"   curl https://api.iconify.design/{coll.get('prefix', args.name)}/{{icon_name}}.svg -o icon.svg")

        if feat.get("npm_packages"):
            print(f"\n NPM Packages:")
            for framework, pkg in feat.get("npm_packages").items():
                print(f"   • {framework.capitalize():<12}: npm install {pkg}")

        if coll.get("samples"):
            print(f"\n Sample Icon Names (download with `fetch_icon.py download {coll.get('prefix')}:<name>`):")
            print("   " + ", ".join(coll.get("samples", [])))
        print("=" * 65 + "\n")

    elif args.command == "download":
        download_svg_icon(args.icon, output_path=args.output)

    elif args.command == "stats":
        collections, featured, _ = get_catalogs()
        total_icons = sum(c.get("total_icons", 0) for c in collections)
        print("\n================ Open-Source Icons Index Statistics ================")
        print(f"  • Open-Source Collections:  {len(collections)} libraries")
        print(f"  • Curated Featured Sets:    {len(featured)} top design libraries")
        print(f"  • Total Searchable Icons:   {total_icons:,} individual vector shapes")
        print("====================================================================\n")


if __name__ == "__main__":
    main()
