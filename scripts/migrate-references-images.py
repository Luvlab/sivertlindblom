#!/usr/bin/env python3
"""
Migrate ögonblick, utmärkelse, and other references-page images to Supabase.
"""
import urllib.request, urllib.parse, urllib.error, json, time, unicodedata

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"

def ascii_safe(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")

def wp_to_storage_path(wp_url):
    u = urllib.parse.unquote(wp_url)
    u = ascii_safe(u)
    for p in [
        "https://sivertlindblom.se/wp-content/uploads/",
        "http://sivertlindblom.se/wp-content/uploads/",
        "https://media.sivertlindblom.se/wp-content/uploads/",
        "http://media.sivertlindblom.se/wp-content/uploads/",
    ]:
        if u.startswith(p):
            return "wp/" + u[len(p):]
    return None

def check_exists(path):
    encoded = urllib.parse.quote(path, safe="/")
    url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status == 200
    except:
        return False

def download(wp_url):
    safe = urllib.parse.urlunparse(urllib.parse.urlparse(wp_url)._replace(
        path=urllib.parse.quote(urllib.parse.unquote(urllib.parse.urlparse(wp_url).path), safe="/%")
    ))
    req = urllib.request.Request(safe, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        ct = r.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()
        return r.read(), ct

def upload(path, data, ct):
    enc = urllib.parse.quote(path, safe="/")
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{enc}"
    req = urllib.request.Request(url, data=data, method="POST", headers={
        "apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}",
        "Content-Type": ct, "x-upsert": "true",
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return True
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Upload {e.code}: {e.read().decode()[:120]}")

# All WP image URLs that need to be in Supabase
WP_URLS = [
    # ── Ögonblick ──────────────────────────────────────────────
    "https://sivertlindblom.se/wp-content/uploads/2018/07/20180714_181121.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/07/20180714_181104.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/07/20180714_181039.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/07/20180714_181150.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/10/20181018_195227.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/10/20181018_195108.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/10/20181018_195148.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180203_160556.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180203_160613.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180203_160538.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180203_160518.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180203_160623_001.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/Lykta-Konstakademin.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/img296.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/08/20180817_135602.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/08/20180817_135547.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/08/20180817_135534.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/08/20180817_135458.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/08/20180817_135440.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111554.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111159.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111221.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111324.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111349.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/02/20180131_111425.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2015/01/20150118_201040.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2017/10/20170927_181311.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2017/10/20170927_181256.jpg",
    # ── Utmärkelser ────────────────────────────────────────────
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Medaljer-Front.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/20180316_172048_001.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Asplund-medalj-1.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Asplund-medalj-2.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Isis-gudinna.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Balusterdockor-1-1.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Akademien-Viridis-1.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Akademien-Viridis-2.jpg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Jubileumsmedalj-1.jpeg",
    "https://sivertlindblom.se/wp-content/uploads/2018/05/Jubileumsmedalj-2.jpeg",
    # ── Portrait ───────────────────────────────────────────────
    "https://sivertlindblom.se/wp-content/uploads/2015/01/Portratt-SivertMattias.jpg",
    # ── Media folder images sent by Jan ────────────────────────
    # (uploaded separately from local files)
]

total = len(WP_URLS)
ok = skip = fail = 0

for i, url in enumerate(WP_URLS, 1):
    path = wp_to_storage_path(url)
    if not path:
        print(f"[{i:3d}/{total}] SKIP (no path): {url}")
        skip += 1
        continue
    fname = path.split("/")[-1]
    print(f"[{i:3d}/{total}] {fname[:60]:<60}", end=" ", flush=True)
    if check_exists(path):
        print("EXISTS")
        skip += 1
        continue
    try:
        data, ct = download(url)
        upload(path, data, ct)
        print(f"OK ({len(data)//1024}KB)")
        ok += 1
    except Exception as e:
        print(f"FAIL: {e}")
        fail += 1
    time.sleep(0.08)

print(f"\nDone: {ok} uploaded, {skip} already existed, {fail} failed")
