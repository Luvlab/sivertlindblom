#!/usr/bin/env python3
"""
One-off: re-host all images (and the Venedig catalogue PDF) referenced by the
old-site pages that are still linked from exhibitions, into Supabase Storage
(bucket `images`, path wp/...). Prints a JSON map {old_url: new_url}.
Reads the image lists from /tmp/oldsite-extract.json.
"""
import urllib.request
import urllib.parse
import json
import sys
import time
import unicodedata

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"

EXTRA = [
    "http://sivertlindblom.se/wp-content/uploads/2018/05/Venedigkatalogen-1968.pdf",
]


def ascii_safe(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def url_to_storage_path(url: str) -> str:
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    path = ascii_safe(path)
    return path.replace("/wp-content/uploads/", "wp/", 1).lstrip("/")


def download(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        ct = r.headers.get("Content-Type", "application/octet-stream").split(";")[0].strip()
        return r.read(), ct


def upload(path: str, data: bytes, content_type: str) -> str:
    encoded = urllib.parse.quote(path, safe="/")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}",
        data=data,
        method="POST",
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": content_type,
            "x-upsert": "true",
        },
    )
    with urllib.request.urlopen(req) as r:
        r.read()
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"


def main():
    pages = json.load(open("/tmp/oldsite-extract.json", encoding="utf-8"))
    sources = []
    for p in pages.values():
        for u in p.get("images", []):
            if u not in sources:
                sources.append(u)
    for u in EXTRA:
        if u not in sources:
            sources.append(u)

    out = {}
    total = len(sources)
    for i, src in enumerate(sources, 1):
        path = url_to_storage_path(src)
        try:
            data, ct = download(src)
            new_url = upload(path, data, ct)
            out[src] = new_url
            print(f"[{i}/{total}] OK {len(data)//1024}KB {ct} -> {path}", file=sys.stderr)
        except Exception as e:
            print(f"[{i}/{total}] FAIL {src}: {e}", file=sys.stderr)
        time.sleep(0.1)
    print(json.dumps(out, indent=2))
    print(f"\n{len(out)}/{total} uploaded", file=sys.stderr)


if __name__ == "__main__":
    main()
