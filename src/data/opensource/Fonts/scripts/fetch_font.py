#!/usr/bin/env python3
"""
fetch_font.py
CLI Tool to search, inspect metadata, and download open-source fonts on-demand.
Uses cached catalogs in ../catalogs/ and pulls font files directly when requested.
Zero external dependencies required (uses standard library urllib, json, zipfile, tarfile, etc.).
"""

import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
import zipfile
import tarfile
import io
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_DIR = os.path.join(BASE_DIR, "catalogs")
DOWNLOADS_DIR = os.path.join(BASE_DIR, "downloads")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenSourceFontFetcher/1.0"


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
    fs_path = os.path.join(CATALOG_DIR, "fontsource_catalog.json")
    fsh_path = os.path.join(CATALOG_DIR, "fontshare_catalog.json")
    gh_path = os.path.join(CATALOG_DIR, "github_repositories.json")

    fontsource = load_json(fs_path) or []
    fontshare = load_json(fsh_path) or []
    github = load_json(gh_path) or []

    return fontsource, fontshare, github


def search_fonts(query=None, category=None, license_type=None, source=None, limit=50):
    fontsource, fontshare, github = get_catalogs()
    results = []

    # Search Fontsource (covers Google Fonts & open source community fonts)
    if not source or source.lower() in ["fontsource", "google"]:
        for item in fontsource:
            name = item.get("family", "")
            cat = item.get("category", "")
            lic = item.get("license", "")
            
            if query and query.lower() not in name.lower() and query.lower() not in item.get("id", "").lower():
                continue
            if category and category.lower() not in cat.lower():
                continue
            if license_type and license_type.lower() not in lic.lower():
                continue

            results.append({
                "name": name,
                "id": item.get("id"),
                "source": f"Google Fonts / Fontsource ({item.get('type')})",
                "source_type": "google",
                "category": cat,
                "license": lic,
                "variable": item.get("variable", False),
                "weights": item.get("weights", []),
                "styles": item.get("styles", []),
                "download_url": f"https://registry.npmjs.org/@fontsource/{item.get('id')}"
            })

    # Search Fontshare
    if not source or source.lower() in ["fontshare", "itf"]:
        for item in fontshare:
            name = item.get("name", "")
            cat = item.get("category", "")
            lic = "SIL OFL 1.1" if item.get("is_sil_ofl") else "ITF Free Font License (Proprietary Freeware)"

            if query and query.lower() not in name.lower() and query.lower() not in item.get("slug", "").lower():
                continue
            if category and category.lower() not in cat.lower():
                continue
            if license_type and license_type.lower() not in lic.lower():
                continue

            results.append({
                "name": name,
                "id": item.get("slug"),
                "source": "Fontshare (Indian Type Foundry)",
                "source_type": "fontshare",
                "category": cat,
                "license": lic,
                "variable": False,
                "weights": [],
                "styles": [f"{item.get('styles_count')} styles"],
                "download_url": item.get("download_url")
            })

    # Search GitHub
    if not source or source.lower() in ["github", "foundry"]:
        for item in github:
            name = item.get("family", "")
            cat = item.get("category", "")
            lic = item.get("license", "")

            if query and query.lower() not in name.lower() and query.lower() not in item.get("description", "").lower():
                continue
            if category and category.lower() not in cat.lower():
                continue
            if license_type and license_type.lower() not in lic.lower():
                continue

            results.append({
                "name": name,
                "id": item.get("repository"),
                "source": f"GitHub ({item.get('owner')})",
                "source_type": "github",
                "category": cat,
                "license": lic,
                "variable": item.get("variable", False),
                "weights": [],
                "styles": [],
                "download_url": item.get("direct_zip_url") or item.get("repository")
            })

    return results[:limit]


def get_font_info(name_or_id):
    fontsource, fontshare, github = get_catalogs()
    target = name_or_id.lower().strip()

    # Check GitHub first
    for item in github:
        if target in item.get("family", "").lower() or target in item.get("repository", "").lower():
            return {"type": "github", "data": item}

    # Check Fontshare
    for item in fontshare:
        if target == item.get("name", "").lower() or target == item.get("slug", "").lower():
            return {"type": "fontshare", "data": item}

    # Check Fontsource
    for item in fontsource:
        if target == item.get("family", "").lower() or target == item.get("id", "").lower():
            return {"type": "fontsource", "data": item}

    # Partial match Fontsource
    for item in fontsource:
        if target in item.get("family", "").lower():
            return {"type": "fontsource", "data": item}

    return None


def download_from_fontshare(data, target_folder):
    slug = data.get("slug")
    download_url = data.get("download_url")
    req = urllib.request.Request(download_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        content = resp.read()
    with zipfile.ZipFile(io.BytesIO(content)) as z:
        z.extractall(target_folder)
        return z.namelist()


def download_from_fontsource(data, target_folder):
    font_id = data.get("id")
    # Fetch npm metadata to get latest tarball URL
    npm_url = f"https://registry.npmjs.org/@fontsource/{font_id}"
    req = urllib.request.Request(npm_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            meta = json.loads(resp.read().decode("utf-8"))
        latest = meta.get("dist-tags", {}).get("latest")
        if not latest:
            raise ValueError("No latest dist-tag in npm package.")
        tarball_url = meta["versions"][latest]["dist"]["tarball"]
        
        # Download tarball
        req_tar = urllib.request.Request(tarball_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req_tar, timeout=30) as resp:
            tar_content = resp.read()
            
        with tarfile.open(fileobj=io.BytesIO(tar_content), mode="r:gz") as tar:
            # Extract only files directory, font files, and license
            extracted_files = []
            for member in tar.getmembers():
                if member.name.startswith("package/"):
                    # Strip 'package/' prefix
                    rel_name = member.name[len("package/"):]
                    if not rel_name:
                        continue
                    dest_path = os.path.join(target_folder, rel_name)
                    if member.isdir():
                        os.makedirs(dest_path, exist_ok=True)
                    elif member.isfile():
                        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                        with open(dest_path, "wb") as f:
                            f.write(tar.extractfile(member).read())
                        extracted_files.append(rel_name)
            return extracted_files
    except Exception as e:
        # Fallback to direct font file fetch from CDN
        print(f"NPM package fetch failed ({e}). Falling back to CDN index...", file=sys.stderr)
        cdn_css = f"https://cdn.jsdelivr.net/npm/@fontsource/{font_id}/index.css"
        req_cdn = urllib.request.Request(cdn_css, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req_cdn, timeout=15) as resp:
            css_data = resp.read().decode("utf-8")
        with open(os.path.join(target_folder, "index.css"), "w", encoding="utf-8") as f:
            f.write(css_data)
        return ["index.css"]


def download_from_github(data, target_folder):
    download_url = data.get("direct_zip_url")
    if not download_url or not download_url.startswith("http"):
        raise ValueError(f"No direct download URL available. Please visit {data.get('repository')}")

    req = urllib.request.Request(download_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=45) as resp:
        content = resp.read()

    try:
        with zipfile.ZipFile(io.BytesIO(content)) as z:
            z.extractall(target_folder)
            return z.namelist()
    except zipfile.BadZipFile:
        # Save raw binary
        fname = os.path.basename(download_url) or "download.bin"
        fpath = os.path.join(target_folder, fname)
        with open(fpath, "wb") as f:
            f.write(content)
        return [fname]


def download_font(name_or_id, output_dir=None):
    info = get_font_info(name_or_id)
    if not info:
        print(f"Error: Font '{name_or_id}' not found in catalogs. Run `python3 fetch_font.py search {name_or_id}` to find matches.", file=sys.stderr)
        return False

    font_type = info["type"]
    data = info["data"]
    
    if font_type == "fontsource":
        family_name = data.get("family")
        slug = data.get("id")
        license_name = data.get("license")
    elif font_type == "fontshare":
        family_name = data.get("name")
        slug = data.get("slug")
        license_name = "SIL OFL 1.1" if data.get("is_sil_ofl") else "ITF Free Font License"
    else: # github
        family_name = data.get("family")
        slug = family_name.split()[0].lower()
        license_name = data.get("license")

    target_folder = output_dir if output_dir else os.path.join(DOWNLOADS_DIR, slug)
    os.makedirs(target_folder, exist_ok=True)

    print("=" * 60)
    print(f" Fetching Font: {family_name}")
    print(f" Source Type:   {font_type.capitalize()}")
    print(f" License:       {license_name}")
    print(f" Destination:   {target_folder}")
    print("=" * 60)

    try:
        print("Downloading font assets...")
        if font_type == "fontshare":
            files = download_from_fontshare(data, target_folder)
        elif font_type == "fontsource":
            files = download_from_fontsource(data, target_folder)
        else:
            files = download_from_github(data, target_folder)

        print(f"\n Successfully saved {len(files)} files into {target_folder}/")
        print("Extracted assets:")
        font_files = [f for f in files if f.endswith(('.ttf', '.otf', '.woff2', '.woff', '.css', '.txt', '.md'))]
        for fname in sorted(font_files)[:15]:
            print(f"  ✓ {fname}")
        if len(font_files) > 15:
            print(f"  ... and {len(font_files) - 15} additional files")
        return True

    except Exception as e:
        print(f"\nDownload failed: {e}", file=sys.stderr)
        if font_type == "github":
            print(f"  You can clone directly via: git clone {data.get('repository')}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Open-Source Font Fetcher: Search, query, and download verified open-source fonts on-demand."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Search command
    search_p = subparsers.add_parser("search", help="Search fonts in catalog")
    search_p.add_argument("query", nargs="?", default=None, help="Name or keyword to search")
    search_p.add_argument("--category", "-c", help="Filter by category (sans-serif, serif, monospace, display, handwriting, etc.)")
    search_p.add_argument("--license", "-l", help="Filter by license (OFL-1.1, Apache-2.0, MIT, etc.)")
    search_p.add_argument("--source", "-s", help="Filter by source (google, fontshare, github)")
    search_p.add_argument("--limit", "-n", type=int, default=25, help="Max results to display (default: 25)")

    # Info command
    info_p = subparsers.add_parser("info", help="Get detailed metadata for a specific font")
    info_p.add_argument("name", help="Font family name or slug (e.g., 'Inter', 'jetbrains-mono', 'Fira Code', 'Satoshi')")

    # Download command
    dl_p = subparsers.add_parser("download", help="Download a font on-demand")
    dl_p.add_argument("name", help="Font family name or slug")
    dl_p.add_argument("--output", "-o", help="Target directory for downloaded files (default: ./downloads/<slug>)")

    # Stats command
    subparsers.add_parser("stats", help="Display summary statistics of indexed open-source fonts")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "search":
        results = search_fonts(
            query=args.query,
            category=args.category,
            license_type=args.license,
            source=args.source,
            limit=args.limit
        )
        if not results:
            print("No fonts matched your search criteria.")
            return

        print(f"\nFound {len(results)} match(es):\n")
        print(f"{'Name':<30} {'Category':<15} {'License':<15} {'Source':<30}")
        print("-" * 92)
        for r in results:
            name_str = r['name'][:28]
            cat_str = r['category'][:13]
            lic_str = r['license'][:13]
            src_str = r['source'][:28]
            print(f"{name_str:<30} {cat_str:<15} {lic_str:<15} {src_str:<30}")
        print("\nTip: Run `python3 scripts/fetch_font.py info \"<Font Name>\"` to see full details.")
        print("     Run `python3 scripts/fetch_font.py download \"<Font Name>\"` to download on demand.\n")

    elif args.command == "info":
        info = get_font_info(args.name)
        if not info:
            print(f"Font '{args.name}' not found. Try searching with `python3 scripts/fetch_font.py search {args.name}`")
            return
        print(json.dumps(info, indent=2))

    elif args.command == "download":
        download_font(args.name, output_dir=args.output)

    elif args.command == "stats":
        fs, fsh, gh = get_catalogs()
        print("\n================ Open-Source Font Index Statistics ================")
        print(f"  • Google Fonts / Fontsource: {len(fs)} font families")
        print(f"  • Fontshare (ITF):           {len(fsh)} font families ({sum(1 for f in fsh if f.get('is_sil_ofl'))} SIL OFL)")
        print(f"  • Curated GitHub Repos:      {len(gh)} foundries & superfamilies")
        print(f"  • Total Searchable Fonts:    {len(fs) + len(fsh) + len(gh)}")
        print("===================================================================\n")


if __name__ == "__main__":
    main()
