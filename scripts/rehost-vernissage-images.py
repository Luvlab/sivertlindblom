#!/usr/bin/env python3
"""
One-off: re-host the 58 "vernissage" sub-page images from sivertlindblom.se
into Supabase Storage (bucket `images`, path wp/2015/02/...), so nothing on the
new site links back to the old WordPress site.

Prints the resulting Supabase public URLs as a JSON array on stdout.
Re-uses the upload approach from scripts/migrate-images.py.
"""
import urllib.request
import urllib.parse
import urllib.error
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

SOURCES = [
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_100911.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_173309.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_173437.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_173456.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121003_164152.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_114630.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_114451.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_114328.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_114332.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_114318.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121003_162256.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121003_162352.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/Ulrik-och-Sivert.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121002_102232.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7647-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_175132.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_175143.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130530.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130245.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130139.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130433.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7665-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7675-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7660-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130310.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130255.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/CamMaj.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130503.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/CamMaj-2.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_134718.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_134714.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_134706.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130424.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130406.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130250.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121006_130109.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7931-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7878-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7838-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7781-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7788-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7744-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7748-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7747-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_121047.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_121128.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_164033.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_164054.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_160739.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121005_160431.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7831-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7785-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7603-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7641-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121028_160220-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7755-kopia.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/20121004_175007.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_7845-kopia.jpg",
]


def ascii_safe(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def url_to_storage_path(url: str) -> str:
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    path = ascii_safe(path)
    return path.replace("/wp-content/uploads/", "wp/", 1).lstrip("/")


def download(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
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
    out = []
    total = len(SOURCES)
    for i, src in enumerate(SOURCES, 1):
        path = url_to_storage_path(src)
        try:
            data, ct = download(src)
            new_url = upload(path, data, ct)
            out.append(new_url)
            print(f"[{i}/{total}] OK {len(data)//1024}KB -> {path}", file=sys.stderr)
        except Exception as e:
            print(f"[{i}/{total}] FAIL {src}: {e}", file=sys.stderr)
        time.sleep(0.1)
    print(json.dumps(out, indent=2))
    print(f"\n{len(out)}/{total} uploaded", file=sys.stderr)


if __name__ == "__main__":
    main()
