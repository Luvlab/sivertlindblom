#!/usr/bin/env python3
"""
Seed all data to Supabase via REST API.
Run from project root: python3 scripts/seed.py
"""
import json, subprocess, urllib.request, urllib.error, sys

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0.OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

def rest_get(path: str) -> list:
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers={**HEADERS, "Accept": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def upsert(table: str, rows: list, batch=50) -> bool:
    if not rows:
        print(f"  (no rows for {table})")
        return True
    ok = True
    for i in range(0, len(rows), batch):
        chunk = rows[i:i+batch]
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        data = json.dumps(chunk).encode()
        req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                print(f"  ✓ {table} batch {i//batch+1}: {len(chunk)} rows (HTTP {resp.status})")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"  ✗ {table} batch {i//batch+1} ERROR {e.code}: {body[:200]}")
            ok = False
    return ok

def extract(table: str) -> list:
    result = subprocess.run(
        ["npx", "tsx", "scripts/extract-data.ts", table],
        capture_output=True, text=True,
        cwd="/Users/gordoncyrus/Documents/dev/sivertlindblom"
    )
    if result.returncode != 0:
        print(f"  extract error: {result.stderr[:300]}")
        return []
    return json.loads(result.stdout)


# ─── 1. Exhibitions ───────────────────────────────────────────────────────────
print("\n=== 1/5  Exhibitions ===")
exhs = extract("exhibitions")
print(f"  {len(exhs)} exhibitions found")
upsert("works", exhs)

print("  → fetching inserted work IDs...")
works_list = rest_get("works?select=id,slug&category=eq.exhibition")
slug_to_id = {w["slug"]: w["id"] for w in works_list}

print(f"  extracting exhibition images...")
exh_imgs_raw = extract("exhibition-images")
exh_img_rows = [
    {"work_id": slug_to_id[r["work_slug"]], "url": r["url"], "alt": r.get("alt"), "sort_order": r["sort_order"]}
    for r in exh_imgs_raw if r["work_slug"] in slug_to_id
]
print(f"  {len(exh_img_rows)} exhibition images")
upsert("images", exh_img_rows, batch=100)


# ─── 2. Public works ─────────────────────────────────────────────────────────
print("\n=== 2/5  Public works ===")
pws = extract("public-works")
print(f"  {len(pws)} public works found")
upsert("public_works", pws)

print("  → fetching inserted public_work IDs...")
pw_list = rest_get("public_works?select=id,slug")
pw_slug_to_id = {w["slug"]: w["id"] for w in pw_list}

pw_imgs_raw = extract("public-work-images")
pw_img_rows = [
    {"work_id": pw_slug_to_id[r["work_slug"]], "url": r["url"], "alt": r.get("alt"), "sort_order": r["sort_order"]}
    for r in pw_imgs_raw if r["work_slug"] in pw_slug_to_id
]
print(f"  {len(pw_img_rows)} public work images")
upsert("public_work_images", pw_img_rows)


# ─── 3. Texts ─────────────────────────────────────────────────────────────────
print("\n=== 3/5  Texts ===")
# Parse texts-data.ts directly with tsx using a dedicated extractor
texts_ts = """
import { readFileSync } from 'fs';
const src = readFileSync('./src/lib/texts-data.ts', 'utf8');
// Find and eval the RAW_TEXTS_DATA array — strip TypeScript type annotation
const cleaned = src
  .replace(/const RAW_TEXTS_DATA:\\s*Omit<[^>]+>\\[\\]\\s*=/, 'const RAW_TEXTS_DATA =')
  .replace(/^import.*$/gm, '')
  .replace(/^export.*$/gm, '');
// Dynamic eval in a function scope
const fn = new Function('return ' + cleaned.match(/const RAW_TEXTS_DATA\\s*=\\s*(\\[[\\s\\S]*?\\n\\];)/)[1]);
const data = fn();
const rows = data.map(t => ({
  slug: t.slug,
  title: t.title,
  author: t.author || null,
  text_type: t.type,
  publication: t.publication || null,
  year: t.year || null,
  language: t.lang || 'sv',
  content: t.body || null,
  published: true,
}));
console.log(JSON.stringify(rows));
"""

# Write temp extractor
import os, tempfile
tmp = tempfile.NamedTemporaryFile(suffix=".mjs", mode='w', delete=False)
tmp.write(texts_ts)
tmp.close()
try:
    result = subprocess.run(
        ["node", tmp.name],
        capture_output=True, text=True,
        cwd="/Users/gordoncyrus/Documents/dev/sivertlindblom"
    )
    if result.returncode != 0 or not result.stdout.strip():
        print(f"  node texts extractor failed: {result.stderr[:200]}")
        texts = []
    else:
        texts = json.loads(result.stdout)
finally:
    os.unlink(tmp.name)

print(f"  {len(texts)} texts found")
upsert("texts", texts)


# ─── 4. Map pins (already done via MCP, verify count) ─────────────────────────
print("\n=== 4/5  Map pins ===")
existing_pins = rest_get("map_pins?select=slug")
print(f"  {len(existing_pins)} map pins already in DB")


# ─── 5. Biography (already done via MCP, verify count) ────────────────────────
print("\n=== 5/5  Biography ===")
existing_bio = rest_get("biography_entries?select=id")
print(f"  {len(existing_bio)} biography entries already in DB")

print("\n✅ Seeding complete!")
