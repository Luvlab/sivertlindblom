#!/usr/bin/env python3
"""
Migrate hardcoded media.sivertlindblom.se URLs in TypeScript source files to Supabase.

Scans source files for URLs matching:
  http://media.sivertlindblom.se/YYYY/MM/filename.ext
  https://media.sivertlindblom.se/YYYY/MM/filename.ext

Downloads each file, uploads to Supabase storage at media/YYYY/MM/filename,
then rewrites the source files with the new Supabase URLs.

Mapping rule:
  http://media.sivertlindblom.se/2016/07/SAM_7062-1.jpg
  → storage path: media/2016/07/SAM_7062-1.jpg
  → public URL:   https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2016/07/SAM_7062-1.jpg

Unicode filenames (e.g. Här-och-Nu-1.jpg) are stored with their original Unicode names
(Supabase supports Unicode paths), but the storage path uses the decoded Unicode filename.

Usage:
  python3 migrate-media-images.py            # migrate + rewrite source files
  python3 migrate-media-images.py --dry-run  # show what would happen, no uploads
  python3 migrate-media-images.py --apply    # only rewrite files (after prior run)
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
MEDIA_PREFIX_HTTP  = "http://media.sivertlindblom.se/"
MEDIA_PREFIX_HTTPS = "https://media.sivertlindblom.se/"
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

MAPPING_FILE = Path(__file__).parent / "media-url-mapping.json"


# ── URL helpers ───────────────────────────────────────────────────────────────

def media_url_to_storage_path(media_url: str) -> str:
    """
    http://media.sivertlindblom.se/2016/07/SAM_7062-1.jpg
    → media/2016/07/SAM_7062-1.jpg   (decoded, keeping original filename)

    For Unicode filenames like Här-och-Nu-1.jpg the decoded name is kept as-is
    because Supabase supports Unicode object keys.
    """
    # Strip either prefix (http or https)
    if media_url.startswith(MEDIA_PREFIX_HTTPS):
        suffix = media_url[len(MEDIA_PREFIX_HTTPS):]
    else:
        suffix = media_url[len(MEDIA_PREFIX_HTTP):]
    # Decode any percent-encoding so the storage path is the real filename
    suffix = urllib.parse.unquote(suffix)
    return f"media/{suffix}"


def storage_path_to_public_url(storage_path: str) -> str:
    # Percent-encode the path for the public URL, preserving slashes
    encoded = urllib.parse.quote(storage_path, safe="/")
    return f"{SUPABASE_PUB}/{encoded}"


def encode_media_url(media_url: str) -> str:
    """Ensure percent-encoding is valid for urllib (handles raw Unicode filenames)."""
    parsed = urllib.parse.urlparse(media_url)
    # decode then re-encode: handles both already-encoded and raw Unicode paths
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


def download_file(media_url: str) -> tuple:
    safe_url = encode_media_url(media_url)
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

def collect_urls() -> list:
    # Matches both http:// and https:// variants, including raw Unicode filenames
    pattern = re.compile(
        r"https?://media\.sivertlindblom\.se/[^\'\"\s\)\]<>]+"
    )
    seen: set = set()
    for path in SOURCE_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for m in pattern.finditer(text):
            url = m.group(0).rstrip(".,;)")
            seen.add(url)
    return sorted(seen)


# ── Persistence ───────────────────────────────────────────────────────────────

def load_mapping() -> dict:
    if MAPPING_FILE.exists():
        return json.loads(MAPPING_FILE.read_text(encoding="utf-8"))
    return {}


def save_mapping(mapping: dict) -> None:
    MAPPING_FILE.write_text(
        json.dumps(mapping, indent=2, ensure_ascii=False), encoding="utf-8"
    )


# ── Migration ─────────────────────────────────────────────────────────────────

def content_type_for_url(url: str) -> str:
    lower = url.lower()
    if lower.endswith(".mp3"):
        return "audio/mpeg"
    if lower.endswith(".png"):
        return "image/png"
    if lower.endswith(".gif"):
        return "image/gif"
    if lower.endswith(".webp"):
        return "image/webp"
    return "image/jpeg"


def migrate_all(dry_run: bool = False) -> dict:
    urls = collect_urls()
    mapping = load_mapping()

    already = sum(1 for u in urls if u in mapping)
    todo = [u for u in urls if u not in mapping]

    print(f"Total unique media.sivertlindblom.se URLs : {len(urls)}")
    print(f"  Already migrated                        : {already}")
    print(f"  To process now                          : {len(todo)}")
    if dry_run:
        print("  *** DRY RUN — no uploads ***")
    print()

    ok = failed = 0
    fail_list: list = []

    for i, media_url in enumerate(todo, 1):
        storage_path = media_url_to_storage_path(media_url)
        new_url = storage_path_to_public_url(storage_path)
        fname = storage_path.split("/")[-1][:55]
        label = f"[{i:03d}/{len(todo)}] {fname:<55}"

        if dry_run:
            mapping[media_url] = new_url
            print(f"{label} (dry-run)")
            ok += 1
            continue

        # Fast-path: already in bucket
        if file_exists_in_supabase(storage_path):
            mapping[media_url] = new_url
            print(f"{label} already in bucket")
            ok += 1
            save_mapping(mapping)
            continue

        # Download
        data, err = download_file(media_url)
        if data is None:
            print(f"{label} DOWNLOAD FAILED: {err}")
            failed += 1
            fail_list.append(media_url)
            continue

        # Upload
        ct = content_type_for_url(media_url)
        if upload_to_supabase(storage_path, data, ct):
            mapping[media_url] = new_url
            print(f"{label} uploaded {len(data)//1024}kB")
            ok += 1
            save_mapping(mapping)
        else:
            print(f"{label} UPLOAD FAILED")
            failed += 1
            fail_list.append(media_url)

        time.sleep(0.12)

    print(f"\n{'─'*70}")
    print(f"OK: {ok+already}  (new this run: {ok}, resumed: {already})  Failed: {failed}")
    if fail_list:
        print("\nFailed URLs:")
        for u in fail_list:
            print(f"  {u}")
    return mapping


# ── Rewrite source files ──────────────────────────────────────────────────────

def apply_mapping(mapping: dict) -> None:
    print("\nRewriting source files ...")
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
            print(f"  OK {path.name}: {count} URL(s) replaced")
        else:
            remaining = sum(1 for u in mapping if u in updated)
            if remaining == 0:
                print(f"  -- {path.name}: nothing to replace (all already updated)")
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
