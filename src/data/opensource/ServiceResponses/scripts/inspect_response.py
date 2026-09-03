#!/usr/bin/env python3
"""
inspect_response.py
CLI Tool to inspect, search, and display standard API response schemas and payloads
for SSO, E-Commerce, B2B, and Open Source cloud services.
"""

import os
import sys
import json
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_all_services():
    services = {}
    for folder in ["auth_and_sso", "ecommerce_and_b2b", "developer_and_cloud", "schemas"]:
        folder_path = os.path.join(BASE_DIR, folder)
        if not os.path.exists(folder_path):
            continue
        for fname in sorted(os.listdir(folder_path)):
            if fname.endswith(".json"):
                key = fname[:-5]
                fpath = os.path.join(folder_path, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    services[key] = {
                        "category": folder,
                        "file": fname,
                        "path": fpath,
                        "service": data.get("service") or data.get("title") or key,
                        "provider": data.get("provider", "Standard"),
                        "data": data
                    }
                except Exception as e:
                    pass
    return services


def list_services():
    services = get_all_services()
    print("\n================ Available Service Response Schemas ================\n")
    current_cat = None
    for key, info in sorted(services.items(), key=lambda x: (x[1]["category"], x[0])):
        if info["category"] != current_cat:
            current_cat = info["category"]
            print(f"\n📂 [{current_cat.upper()}]")
            print("-" * 65)
        print(f"  • {key:<26} -> {info['service']} ({info['provider']})")
    print("\nTip: Run `python3 scripts/inspect_response.py view <service_key>` to view responses.\n")


def view_service(service_key, field=None, show_types=False):
    services = get_all_services()
    match = services.get(service_key.lower().strip())
    if not match:
        # Try partial match
        for k, v in services.items():
            if service_key.lower() in k:
                match = v
                break

    if not match:
        print(f"Service '{service_key}' not found. Run `python3 scripts/inspect_response.py list` to see available keys.")
        return

    data = match["data"]
    responses = data.get("responses", data)

    if show_types:
        print(f"\n================ Data Types for {match['service']} ================\n")
        if field:
            if field in responses:
                resp = responses[field]
                types = resp.get("data_types", resp)
                print(f"Response: {field}")
                print(json.dumps(types, indent=2))
            else:
                print(f"Field '{field}' not found. Available fields in {match['file']}: {list(responses.keys())}")
        else:
            for rname, rval in responses.items():
                types = rval.get("data_types")
                if types:
                    print(f"▶ Response: {rname}")
                    print(json.dumps(types, indent=2))
                    print("-" * 65)
        print()
        return

    if field:
        if field in responses:
            print(json.dumps(responses[field], indent=2))
        else:
            print(f"Field '{field}' not found. Available fields in {match['file']}: {list(responses.keys())}")
    else:
        print(json.dumps(data, indent=2))


def search_payloads(query):
    services = get_all_services()
    results = []
    q = query.lower()

    for key, info in services.items():
        text = json.dumps(info["data"]).lower()
        if q in text:
            results.append((key, info["service"], info["category"]))

    print(f"\nSearch results for '{query}' ({len(results)} matches):\n")
    for key, s_name, cat in results:
        print(f"  ✓ {key:<26} [{cat}] -> {s_name}")
    print("\n")


def main():
    parser = argparse.ArgumentParser(description="Inspect standard API response payloads for developer services.")
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    subparsers.add_parser("list", help="List all available service response schemas")
    
    view_p = subparsers.add_parser("view", help="View full schema & payloads for a service")
    view_p.add_argument("service", help="Service key (e.g., 'google_sso', 'microsoft_entra_sso', 'shopify_admin_api', 'stripe_billing')")
    view_p.add_argument("--field", "-f", help="Specific response payload or key to extract")
    view_p.add_argument("--types", "-t", action="store_true", help="Display only the data types mapping")

    search_p = subparsers.add_parser("search", help="Search across all service payloads for keywords or field names")
    search_p.add_argument("query", help="Keyword or field name to search (e.g., 'sub', 'customer', 'payment_intent')")

    args = parser.parse_args()

    if not args.command or args.command == "list":
        list_services()
    elif args.command == "view":
        view_service(args.service, field=args.field, show_types=args.types)
    elif args.command == "search":
        search_payloads(args.query)


if __name__ == "__main__":
    main()
