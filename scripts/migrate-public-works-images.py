#!/usr/bin/env python3
"""
Download all public works images from sivertlindblom.se and upload to Supabase.
Skips images already present in Supabase (HTTP 200 HEAD check).
Usage: python3 scripts/migrate-public-works-images.py
"""
import json
import urllib.request
import urllib.parse
import urllib.error
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

def ascii_safe(s: str) -> str:
    normalized = unicodedata.normalize("NFKD", s)
    return normalized.encode("ascii", "ignore").decode("ascii")

def wp_url_to_storage_path(wp_url: str) -> str:
    """Convert a WP uploads URL to a Supabase storage path."""
    url = wp_url.strip()
    # Decode any percent-encoding, then apply ASCII transliteration
    url = urllib.parse.unquote(url)
    url = ascii_safe(url)
    # Strip the wp-content/uploads prefix
    for prefix in [
        "https://sivertlindblom.se/wp-content/uploads/",
        "http://sivertlindblom.se/wp-content/uploads/",
        "https://media.sivertlindblom.se/wp-content/uploads/",
        "http://media.sivertlindblom.se/wp-content/uploads/",
    ]:
        if url.startswith(prefix):
            return "wp/" + url[len(prefix):]
    return None

def storage_path_to_public_url(path: str) -> str:
    encoded = urllib.parse.quote(path, safe="/")
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"

def check_exists(path: str) -> bool:
    """Return True if the object already exists in Supabase storage."""
    encoded = urllib.parse.quote(path, safe="/")
    url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status == 200
    except urllib.error.HTTPError as e:
        return e.code == 200
    except Exception:
        return False

def download_image(url: str) -> tuple[bytes, str]:
    safe_url = urllib.parse.urlunparse(
        urllib.parse.urlparse(url)._replace(
            path=urllib.parse.quote(urllib.parse.unquote(urllib.parse.urlparse(url).path), safe="/%")
        )
    )
    req = urllib.request.Request(safe_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
        return r.read(), ct

def upload_to_storage(path: str, data: bytes, content_type: str) -> str:
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
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"Upload failed {e.code}: {body}") from e
    return storage_path_to_public_url(path)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "public-works.json")

    with open(json_path, encoding="utf-8") as f:
        works = json.load(f)

    # Collect unique WP URLs
    wp_urls = {}  # wp_url -> storage_path
    for w in works:
        for img in w["images"]:
            wp_url = img.get("wpUrl", "")
            if not wp_url:
                continue
            path = wp_url_to_storage_path(wp_url)
            if path:
                wp_urls[wp_url] = path

    total = len(wp_urls)
    print(f"Found {total} unique WP image URLs")

    migrated = 0
    skipped = 0
    failed = 0
    failed_urls = []

    for i, (wp_url, storage_path) in enumerate(wp_urls.items(), 1):
        filename = os.path.basename(storage_path)
        print(f"[{i:4d}/{total}] {filename[:60]:<60}", end=" ", flush=True)

        if check_exists(storage_path):
            print("EXISTS")
            skipped += 1
            continue

        try:
            img_bytes, ct = download_image(wp_url)
            upload_to_storage(storage_path, img_bytes, ct)
            print(f"OK ({len(img_bytes)//1024}KB)")
            migrated += 1
        except Exception as e:
            print(f"FAIL: {e}")
            failed += 1
            failed_urls.append((wp_url, str(e)))

        time.sleep(0.08)

    print(f"\n{'='*60}")
    print(f"Done: {migrated} uploaded, {skipped} already existed, {failed} failed")
    if failed_urls:
        print(f"\nFailed URLs:")
        for url, err in failed_urls[:20]:
            print(f"  {url[:80]} — {err[:60]}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
