#!/usr/bin/env python3
"""
Migrate hardcoded WordPress image URLs in TypeScript source files to Supabase.

Scans source files for URLs matching:
  https://sivertlindblom.se/wp-content/uploads/...

Downloads each image, uploads to Supabase storage at wp/YYYY/MM/filename,
then rewrites the source files with the new Supabase URLs.

Usage:
  python3 migrate-static-images.py            # migrate + rewrite source files
  python3 migrate-static-images.py --dry-run  # show what would happen, no uploads
  python3 migrate-static-images.py --apply    # only rewrite files (after failed run)
"""

import os
import re
import sys
import json
import time
import urllib.request
import urllib.parse
import urllib.error
import unicodedata
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"
WP_PREFIX = "https://sivertlindblom.se/wp-content/uploads/"
SUPABASE_PUB = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}"

PROJECT_ROOT = Path(__file__).parent.parent / "src"
SOURCE_FILES = [
    PROJECT_ROOT / "lib" / "exhibitions-data.ts",
    PROJECT_ROOT / "lib" / "public-works.ts",
    PROJECT_ROOT / "lib" / "sculpture-projects.ts",
    PROJECT_ROOT / "lib" / "publications-data.ts",
    PROJECT_ROOT / "lib" / "fotografier-data.ts",
    PROJECT_ROOT / "app" / "[locale]" / "references" / "page.tsx",
    PROJECT_ROOT / "app" / "[locale]" / "portfolio" / "scenography" / "page.tsx",
    PROJECT_ROOT / "app" / "[locale]" / "layout.tsx",
]

MAPPING_FILE = Path(__file__).parent / "static-url-mapping.json"

# ── URL helpers ───────────────────────────────────────────────────────────────

def ascii_slug(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def wp_url_to_storage_path(wp_url: str) -> str:
    """
    https://sivertlindblom.se/wp-content/uploads/2015/01/Foo%20Bar.jpg
    → wp/2015/01/Foo Bar.jpg  (decoded, keeping original filename casing)
    """
    # Decode percent-encoding
    decoded = urllib.parse.unquote(wp_url)
    suffix = decoded[len(WP_PREFIX):]  # e.g. 2015/01/Foo Bar.jpg
    return f"wp/{suffix}"


def storage_path_to_public_url(storage_path: str) -> str:
    encoded = urllib.parse.quote(storage_path, safe="/")
    return f"{SUPABASE_PUB}/{encoded}"


def encode_wp_url(wp_url: str) -> str:
    """Ensure percent-encoding is valid for urllib."""
    parsed = urllib.parse.urlparse(wp_url)
    safe_path = urllib.parse.quote(urllib.parse.unquote(parsed.path), safe="/%")
    return urllib.parse.urlunparse((
        parsed.scheme, parsed.netloc, safe_path, "", "", ""
    ))


# ── Supabase helpers ──────────────────────────────────────────────────────────

def file_exists_in_supabase(storage_path: str) -> bool:
    encoded = urllib.parse.quote(storage_path, safe="/")
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}"
    req = urllib.request.Request(url, method="HEAD")
    req.add_header("Authorization", f"Bearer {SUPABASE_KEY}")
    req.add_header("apikey", SUPABASE_KEY)
    try:
        with urllib.request.urlopen(req, timeout=10):
            return True
    except urllib.error.HTTPError as e:
        return e.code != 404
    except Exception:
        return False


def download_image(wp_url: str) -> tuple[bytes, str] | None:
    safe_url = encode_wp_url(wp_url)
    req = urllib.request.Request(safe_url)
    req.add_header("User-Agent", "Mozilla/5.0 (compatible; luvlab-migration/1.0)")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
            return r.read(), ct
    except Exception as e:
        return None, str(e)


def upload_to_supabase(storage_path: str, data: bytes, content_type: str) -> bool:
    encoded = urllib.parse.quote(storage_path, safe="/")
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}"
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {SUPABASE_KEY}")
    req.add_header("apikey", SUPABASE_KEY)
    req.add_header("Content-Type", content_type)
    req.add_header("x-upsert", "true")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status in (200, 201)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        if e.code == 409 or "already exists" in body:
            return True
        print(f"\n    HTTP {e.code}: {body[:300]}")
        return False
    except Exception as e:
        print(f"\n    Upload error: {e}")
        return False


# ── Collection ────────────────────────────────────────────────────────────────

def collect_urls() -> list[str]:
    pattern = re.compile(r"https://sivertlindblom\.se/wp-content/uploads/[^\'\"\s\)\]]+")
    seen: set[str] = set()
    for path in SOURCE_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for m in pattern.finditer(text):
            url = m.group(0).rstrip(".,;)")
            seen.add(url)
    return sorted(seen)


# ── Persistence ───────────────────────────────────────────────────────────────

def load_mapping() -> dict[str, str]:
    if MAPPING_FILE.exists():
        return json.loads(MAPPING_FILE.read_text(encoding="utf-8"))
    return {}


def save_mapping(mapping: dict[str, str]) -> None:
    MAPPING_FILE.write_text(
        json.dumps(mapping, indent=2, ensure_ascii=False), encoding="utf-8"
    )


# ── Migration ─────────────────────────────────────────────────────────────────

def migrate_all(dry_run: bool = False) -> dict[str, str]:
    urls = collect_urls()
    mapping = load_mapping()

    already = sum(1 for u in urls if u in mapping)
    todo = [u for u in urls if u not in mapping]

    print(f"Total unique WordPress image URLs : {len(urls)}")
    print(f"  Already migrated                : {already}")
    print(f"  To process now                  : {len(todo)}")
    if dry_run:
        print("  *** DRY RUN — no uploads ***")
    print()

    ok = failed = 0
    fail_list: list[str] = []

    for i, wp_url in enumerate(todo, 1):
        storage_path = wp_url_to_storage_path(wp_url)
        new_url = storage_path_to_public_url(storage_path)
        fname = storage_path.split("/")[-1][:50]
        label = f"[{i:03d}/{len(todo)}] {fname:<50}"

        if dry_run:
            mapping[wp_url] = new_url
            print(f"{label} (dry-run)")
            ok += 1
            continue

        # Fast-path: already in bucket
        if file_exists_in_supabase(storage_path):
            mapping[wp_url] = new_url
            print(f"{label} ✓ (already in bucket)")
            ok += 1
            save_mapping(mapping)
            continue

        # Download
        data, err = download_image(wp_url)
        if data is None:
            print(f"{label} ✗ download: {err}")
            failed += 1
            fail_list.append(wp_url)
            continue

        # Upload
        ct = (
            "image/png" if wp_url.lower().endswith(".png") else
            "image/gif" if wp_url.lower().endswith(".gif") else
            "image/jpeg"
        )
        if upload_to_supabase(storage_path, data, ct):
            mapping[wp_url] = new_url
            print(f"{label} ✓ {len(data)//1024}kB")
            ok += 1
            save_mapping(mapping)
        else:
            print(f"{label} ✗ upload failed")
            failed += 1
            fail_list.append(wp_url)

        time.sleep(0.12)

    print(f"\n{'─'*70}")
    print(f"OK: {ok+already}  (new this run: {ok}, resumed: {already})  Failed: {failed}")
    if fail_list:
        print("\nFailed URLs:")
        for u in fail_list:
            print(f"  {u}")
    return mapping


# ── Rewrite source files ──────────────────────────────────────────────────────

def apply_mapping(mapping: dict[str, str]) -> None:
    print("\nRewriting source files …")
    for path in SOURCE_FILES:
        if not path.exists():
            continue
        original = path.read_text(encoding="utf-8")
        updated = original
        count = 0
        for old_url, new_url in mapping.items():
            if old_url in updated:
                updated = updated.replace(old_url, new_url)
                count += 1
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            print(f"  ✓ {path.name}: {count} URL(s) replaced")
        else:
            # Check if any old URLs remain
            remaining = sum(1 for u in mapping if u in updated)
            if remaining == 0:
                print(f"  — {path.name}: nothing to replace (all already updated)")
    print("Done.")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    dry_run    = "--dry-run" in sys.argv
    apply_only = "--apply"   in sys.argv

    if apply_only:
        m = load_mapping()
        print(f"Loaded {len(m)} URL mappings from {MAPPING_FILE}")
        apply_mapping(m)
    else:
        m = migrate_all(dry_run=dry_run)
        if not dry_run:
            apply_mapping(m)
