#!/usr/bin/env python3
"""
Migrate images from sivertlindblom.se and media.sivertlindblom.se
to Supabase Storage, then update DB records with new URLs.
"""
import urllib.request
import urllib.parse
import urllib.error
import json
import sys
import os
import time
import unicodedata
from pathlib import PurePosixPath

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
}

def rest_get(path):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers={**HEADERS, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def rest_patch(path, data, match_col, match_val):
    payload = json.dumps(data).encode()
    url = f"{SUPABASE_URL}/rest/v1/{path}?{match_col}=eq.{urllib.parse.quote(str(match_val))}"
    req = urllib.request.Request(
        url,
        data=payload,
        method="PATCH",
        headers={**HEADERS, "Content-Type": "application/json", "Prefer": "return=minimal"},
    )
    with urllib.request.urlopen(req) as r:
        return r.status

def ascii_safe(s: str) -> str:
    """Transliterate Unicode chars to ASCII (e.g. ä→a, ö→o, å→a)."""
    normalized = unicodedata.normalize("NFKD", s)
    return normalized.encode("ascii", "ignore").decode("ascii")

def url_to_storage_path(url: str) -> str:
    """Derive an ASCII-safe storage path from the source URL."""
    parsed = urllib.parse.urlparse(url)
    host = parsed.netloc
    # Decode percent-encoding first
    path = urllib.parse.unquote(parsed.path)
    # Apply ASCII transliteration to the entire path
    path = ascii_safe(path)

    if "media.sivertlindblom" in host:
        storage_path = "media" + path
    else:
        storage_path = path.replace("/wp-content/uploads/", "wp/", 1)

    return storage_path.lstrip("/")

def encode_url(url: str) -> str:
    """Ensure URL is ASCII-safe by percent-encoding the path/query parts."""
    parsed = urllib.parse.urlparse(url)
    # Re-encode path, keeping existing %XX sequences and safe chars
    safe_path = urllib.parse.quote(urllib.parse.unquote(parsed.path), safe="/%")
    safe_query = urllib.parse.quote(urllib.parse.unquote(parsed.query), safe="=%&+")
    return urllib.parse.urlunparse((
        parsed.scheme, parsed.netloc, safe_path,
        parsed.params, safe_query, parsed.fragment
    ))

def download_image(url: str) -> tuple[bytes, str]:
    """Download image, return (bytes, content_type)."""
    safe_url = encode_url(url)
    req = urllib.request.Request(safe_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
        return r.read(), ct

def upload_to_storage(path: str, data: bytes, content_type: str) -> str:
    """Upload file to Supabase Storage, return public URL."""
    encoded_path = urllib.parse.quote(path, safe="/")
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded_path}"
    req = urllib.request.Request(
        upload_url,
        data=data,
        method="POST",
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": content_type,
            "x-upsert": "true",
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"Upload failed {e.code}: {body}") from e

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded_path}"
    return public_url

def migrate_table(table: str, id_col: str, url_col: str, label: str):
    print(f"\n{'='*60}")
    print(f"Migrating {label}...")
    print(f"{'='*60}")

    records = rest_get(f"{table}?select={id_col},{url_col}&order={id_col}")
    total = len(records)
    print(f"Found {total} records")

    migrated = 0
    skipped = 0
    failed = 0

    for i, rec in enumerate(records, 1):
        rid = rec[id_col]
        url = rec[url_col]

        # Skip already migrated
        if "supabase.co" in url or not url:
            skipped += 1
            continue

        storage_path = url_to_storage_path(url)
        print(f"[{i}/{total}] {os.path.basename(storage_path)}", end=" ... ", flush=True)

        try:
            img_bytes, ct = download_image(url)
            new_url = upload_to_storage(storage_path, img_bytes, ct)
            rest_patch(table, {url_col: new_url}, id_col, rid)
            print(f"OK ({len(img_bytes)//1024}KB)")
            migrated += 1
        except Exception as e:
            print(f"FAIL: {e}")
            failed += 1

        # Small delay to avoid hammering
        time.sleep(0.1)

    print(f"\nDone: {migrated} migrated, {skipped} skipped, {failed} failed")
    return migrated, failed

def main():
    print("Starting image migration to Supabase Storage")
    print(f"Bucket: {BUCKET}")

    total_migrated = 0
    total_failed = 0

    m, f = migrate_table("images", "id", "url", "Exhibition images (images table)")
    total_migrated += m; total_failed += f

    m, f = migrate_table("public_work_images", "id", "url", "Public work images (public_work_images table)")
    total_migrated += m; total_failed += f

    print(f"\n{'='*60}")
    print(f"TOTAL: {total_migrated} migrated, {total_failed} failed")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
