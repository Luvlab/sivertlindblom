#!/usr/bin/env python3
"""
Migrate the 4 missing 'egna texter' image assets from media.sivertlindblom.se
to Supabase Storage.

Images/PDFs from media.sivertlindblom.se/YYYY/MM/file.ext are stored at
  images/media/YYYY/MM/file.ext
giving public URL:
  https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/YYYY/MM/file.ext
"""
import urllib.request
import urllib.parse
import urllib.error
import json
import time

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"

SOURCES = [
    # Stenpriset 1985
    "http://media.sivertlindblom.se/2015/02/Sten-omslag-1985-minst.jpg",
    "http://media.sivertlindblom.se/2015/02/Sten-1985opt-.pdf",
    # Statens Konstråd 1988
    "http://media.sivertlindblom.se/2015/03/Statens-Konst.jpg",
    "http://media.sivertlindblom.se/2015/03/Statens-Konst2.jpg",
    "http://media.sivertlindblom.se/2015/03/Statens-Konst3.jpg",
    "http://media.sivertlindblom.se/2015/03/Statens-Konst4.jpg",
    # Meddelande 1985
    "http://media.sivertlindblom.se/2015/03/Meddelande-SL-1-1-.jpg",
    "http://media.sivertlindblom.se/2015/03/Meddelande-SL-1-2-.jpg",
    "http://media.sivertlindblom.se/2015/03/Meddelande-SL-2-2-2.jpg",
    "http://media.sivertlindblom.se/2015/03/Meddelande-SL-2-3-.jpg",
    "http://media.sivertlindblom.se/2015/03/Meddelande-SL-3-.jpg",
    # Intervju Humanistiska Föreningen 1989
    "http://media.sivertlindblom.se/2015/03/Sivert-Lindblom-Frescati-1.jpg",
    "http://media.sivertlindblom.se/2015/03/Sivert-Lindblom-Frescati-2.jpg",
]

def source_to_storage_path(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    # media.sivertlindblom.se/YYYY/MM/file → media/YYYY/MM/file
    return ("media" + parsed.path).lstrip("/")

def download(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
        if not ct or ct == "text/html":
            ext = url.rsplit(".", 1)[-1].lower()
            ct = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
                  "pdf": "application/pdf"}.get(ext, "application/octet-stream")
        return r.read(), ct

def upload(storage_path: str, data: bytes, content_type: str) -> str:
    encoded = urllib.parse.quote(storage_path, safe="/")
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}"
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
            json.loads(r.read())
        return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"Upload failed {e.code}: {body}") from e

def main():
    print(f"Migrating {len(SOURCES)} assets to Supabase...\n")
    results = {}
    for url in SOURCES:
        path = source_to_storage_path(url)
        print(f"  ↓ {url.split('/')[-1]}")
        try:
            data, ct = download(url)
            public_url = upload(path, data, ct)
            results[url] = public_url
            print(f"    ✓ {public_url}")
        except Exception as e:
            results[url] = None
            print(f"    ✗ {e}")
        time.sleep(0.3)

    print("\n--- Results ---")
    ok = sum(1 for v in results.values() if v)
    print(f"{ok}/{len(SOURCES)} succeeded\n")

    if ok:
        print("Supabase URLs for texts-data.ts:")
        for src, dst in results.items():
            if dst:
                print(f"  {dst}")

if __name__ == "__main__":
    main()
