#!/usr/bin/env python3
"""
Scrape images from sivertlindblom.se for public works that have 0 images in Supabase.
"""

import urllib.request
import urllib.parse
import json
import re
import time

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0.OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Map DB slug → source URL on sivertlindblom.se
# Works that need images (0 in DB)
SLUG_TO_URL = {
    # Exteriors
    "korsbarsgarden-2010": "https://sivertlindblom.se/folio/utstallningar/korsbarsgarden-gotland-2010/",
    "nobelmonument-new-york-2003": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/nobelmonument-new-york-2003/",
    "eskilstuna-2002": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/eskilstuna-rondellen-profilen-2002/",
    "potatisackern-2001": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/potatisakern-bostadsomrade-malmo-2001/",
    "grubbens-trappor-2000": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/st-erik-grubbens-trappa-kungsholmen-stockholm-2000/",
    "grev-magnigatan-10": None,  # Not in main listing — will search
    "gustav-adolfs-torg-2002": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/gustav-adolfs-torg-malmo-2002/",
    "sergels-torg-1998": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sergels-torg-sergel-monumentet-stockholm-1998/",
    "kungstradgarden-1997": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kungstradgarden-norra-delen-1997-98/",
    "skovde-1995": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/cavallobrunnen-resecentrum-skovde-1995-96/",
    "ambassad-tokyo-1990": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sveriges-ambassaden-entre-tokyo-1990-91/",
    "lindholmsallen-goteborg": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/lindholmsallen-regnbagsgatan-goteborg/",
    "kalmar-1990": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/kvarteret-baronen-kalmar-1990/",
    "kristianstad-1989": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kristianstad-tivoliparken-1989/",
    "trollhattan-1989": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/norra-alvsborgs-lanssjukhus-trollhattan-1989-91/",
    "ringvagen-1989": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kvarteret-svardet-stockholm1989/",
    "skissernas-museum-1988": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/skissernas-museum-fasad-1988/",
    "uppsala-stadsbibliotek-1986": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/uppsala-stadsbibliotek-1986/",
    "tetra-pak-1984": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/tetra-pak-lausanne-schweiz-1984-85/",
    "arbyparken-1973": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/lekplats-arby-omradet-eskilstuna-1973/",
    "garnisonen-1972": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/garnisonen-stockholm-1972/",
    "vallingby-backe-1966": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/vallingby-backe-1966-67/",
    "dagens-nyheter-1965": "https://sivertlindblom.se/bronsgaller-dagens-nyheter-stockholm-1965/",
    "vadsbo-museum-1962": "https://sivertlindblom.se/folio/utstallningar/vadsbo-museum-mariestad-1962/",

    # Interiors
    "norrtälje-stadsbibliotek-2006": None,  # Will try multiple URL patterns via candidates
    "kungliga-biblioteket-1998": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kungl-biblioteket-stockholm-1998/",
    "synagogan-1998": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/synagoga-forintelsemonumentet-stockholm-1998/",
    "nobel-forum-1993": "https://sivertlindblom.se/nobel-forum/",
    "haga-norra-1993": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/haga-norra-gangbro-stockholm-1993/",
    "seb-banken-1992": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/seb-banken-huvudkontor-rissne-1992/",
    "sas-huvudkontor-1988": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sas-huvudkontor-frosundavik-stockholm-1988/",
    "norrkoping-1986": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/lanssjukhuset-vrinnevi-innergard-norrkoping-1986/",
    "norra-begravningsplatsen": None,  # Will search
    "gu-biblioteket-1985": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/goteborgs-universitetsbibliotek-1985/",
    "pharmacia-1984": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/pharmacia-entreplats-uppsala-1984-85/",
    "medelhavsmuseet-1982": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/medelhavsmuseet-stockholm-1982-utstallning-ar-numera-utbytt/",
    "paris-ccs-1980": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sans-titre-centre-culturel-suedois-ccs-paris-1980/",
    "fersenska-palatset-1975": "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/fersenska-palatset-handelsbanken-stockholm-1975/",
    "vastra-skogen-1975": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/vastra-skogen-t-banestation-1975-1985/",
    "riksbanken-1973": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/sveriges-riksbank-stockholm-1973/",
    "haninge-1970": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/vasterhaninge-bibliotek-haninge-kulturhus-1970/",
    "stadsteatern-1970": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/stadsteatern-stockholm-1970/",
    "nk-ljusgard-1968": "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/nk-ljusgard-1968/",
}

# Works with images already (skip these)
WORKS_WITH_IMAGES = {
    "88798587-859e-4f12-ab67-031fd9a19073",  # baltesspaennarparken
    "6ce97cfd-1c1b-4462-b294-fe02d4e6c35e",  # frescati
    "e9ec215c-3950-4418-90a4-c0bcbd1da0f0",  # blasieholmstorg
    "a3136cef-6c9f-4257-8604-cceecd2f0560",  # medborgarplatsen
    "c3992cb5-9d8b-4db5-ab55-1479174915f8",  # berns
    "7b98f2ea-beb0-442d-8557-9b828678c745",  # visby
}


def rest_get(path):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers=HEADERS,
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def rest_post(table, rows):
    data = json.dumps(rows).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{table}",
        data=data,
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status
    except Exception as e:
        print(f"  POST error: {e}")
        return 0


def fetch_page(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  Fetch error for {url}: {e}")
        return ""


def extract_images(html, base_url="https://sivertlindblom.se"):
    """Extract all wp-content/uploads image URLs from HTML, preferring full-size over thumbnails."""
    images = set()

    # Pattern to match URLs containing wp-content/uploads with image extensions
    img_url_pattern = re.compile(
        r'(?:src|href|data-src|data-lazy-src|data-original)=["\']([^"\']*wp-content/uploads[^"\']*\.(?:jpe?g|png|webp|gif))["\']',
        re.IGNORECASE
    )

    # Also find srcset attributes
    srcset_pattern = re.compile(
        r'srcset=["\']([^"\']+)["\']',
        re.IGNORECASE
    )

    # Extract from standard attributes
    for match in img_url_pattern.finditer(html):
        url = match.group(1)
        if url.startswith("//"):
            url = "https:" + url
        elif url.startswith("/"):
            url = base_url + url
        images.add(url)

    # Extract from srcset
    for srcset_match in srcset_pattern.finditer(html):
        srcset_val = srcset_match.group(1)
        for part in srcset_val.split(","):
            part = part.strip().split(" ")[0]  # Get just the URL part
            if "wp-content/uploads" in part and re.search(r'\.(jpe?g|png|webp|gif)', part, re.IGNORECASE):
                if part.startswith("//"):
                    part = "https:" + part
                elif part.startswith("/"):
                    part = base_url + part
                images.add(part)

    # Filter out logo
    logo_pattern = re.compile(r'Logga-Sivert', re.IGNORECASE)
    images = {url for url in images if not logo_pattern.search(url)}

    return images


def get_full_size_images(images):
    """
    From a set of image URLs, prefer the full-size versions over thumbnails.
    WordPress thumbnails have patterns like -390x390, -150x150, -300x300, etc.
    """
    thumbnail_pattern = re.compile(r'-\d+x\d+(\.\w+)$')

    # Build a map: base_name -> set of sizes
    base_to_urls = {}
    for url in images:
        # Get base (without dimension suffix)
        base = thumbnail_pattern.sub(r'\1', url)
        if base not in base_to_urls:
            base_to_urls[base] = []
        base_to_urls[base].append(url)

    # For each base, prefer the full-size (the one without -WxH suffix)
    result = []
    for base, urls in base_to_urls.items():
        # Check if the base URL (full-size) is in our set
        if base in images:
            result.append(base)
        else:
            # Use the thumbnail (but try to construct full-size URL)
            # Just add the base URL (might 404 but worth trying)
            # For now, use the largest thumbnail or the base
            result.append(base)  # base might not exist, but full-size likely does

    return sorted(result)


def scrape_work(slug, url):
    """Scrape images for a single work from the given URL."""
    print(f"\n  Fetching: {url}")
    html = fetch_page(url)
    if not html:
        print(f"  No HTML returned for {slug}")
        return []

    raw_images = extract_images(html)
    print(f"  Raw images found: {len(raw_images)}")

    full_size = get_full_size_images(raw_images)
    print(f"  Full-size images: {len(full_size)}")

    return full_size


def try_search_for_work(title_keywords):
    """Try to find the URL for a work by searching the site."""
    # Try searching via WordPress search
    search_url = f"https://sivertlindblom.se/?s={urllib.parse.quote(title_keywords)}"
    print(f"  Searching: {search_url}")
    html = fetch_page(search_url)
    if not html:
        return None

    # Look for links to the work
    link_pattern = re.compile(r'href=["\']([^"\']*sivertlindblom\.se/[^"\']+)["\']')
    links = set()
    for m in link_pattern.finditer(html):
        link = m.group(1)
        if any(kw.lower() in link.lower() for kw in title_keywords.split()):
            links.add(link)

    if links:
        return list(links)[0]
    return None


# ─── Main ────────────────────────────────────────────────────────────────────

print("=" * 60)
print("Scraping missing images from sivertlindblom.se")
print("=" * 60)

# Get all works from DB
pw_list = rest_get("public_works?select=id,slug,title")
slug_to_id = {w["slug"]: w["id"] for w in pw_list}
id_to_slug = {w["id"]: w["slug"] for w in pw_list}
id_to_title = {w["id"]: w["title"] for w in pw_list}
print(f"Found {len(slug_to_id)} works in DB")

# Get existing images count per work
existing_images = rest_get("public_work_images?select=work_id&limit=2000")
images_per_work = {}
for row in existing_images:
    wid = row["work_id"]
    images_per_work[wid] = images_per_work.get(wid, 0) + 1

print(f"Works with existing images: {len(images_per_work)}")
for wid, cnt in sorted(images_per_work.items(), key=lambda x: -x[1]):
    slug = id_to_slug.get(wid, wid)
    print(f"  {slug}: {cnt} images (SKIPPING)")

# Results tracking
results = {}
not_found = []
errors = []

# Process each work that needs images
print("\n" + "=" * 60)
print("Processing works with 0 images...")
print("=" * 60)

for slug, source_url in SLUG_TO_URL.items():
    # Get work ID from DB
    work_id = slug_to_id.get(slug)
    if not work_id:
        print(f"\n[SKIP] Slug not in DB: {slug}")
        continue

    # Skip if already has images
    if work_id in images_per_work:
        print(f"\n[SKIP] Already has images: {slug} ({images_per_work[work_id]} images)")
        continue

    title = id_to_title.get(work_id, slug)
    print(f"\n[WORK] {slug}")
    print(f"  Title: {title}")

    # Try to get images
    images = []

    if source_url:
        images = scrape_work(slug, source_url)
    else:
        # Try to find the URL
        print(f"  No URL configured, trying to find...")
        # Try some common patterns
        candidates = []

        if slug == "grev-magnigatan-10":
            candidates = [
                "https://sivertlindblom.se/grev-magnigatan-10/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/grev-magnigatan-10-stockholm/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/grev-magnigatan-10/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/grev-magnigatan-10-stockholm/",
            ]
        elif slug == "norra-begravningsplatsen":
            candidates = [
                "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/norra-begravningsplatsen-solna/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/norra-begravningsplatsen-solna/",
                "https://sivertlindblom.se/norra-begravningsplatsen-solna/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/norra-begravningsplatsen/",
            ]
        elif "norrt" in slug and "stads" in slug:
            candidates = [
                "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/norrtalje-stadsbibliotek/",
                "https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/norrtalje-stadsbibliotek-2006/",
                "https://sivertlindblom.se/gdlgallery/norrtalje-stadsbibliotek/",
            ]

        for candidate in candidates:
            print(f"  Trying: {candidate}")
            imgs = scrape_work(slug, candidate)
            if imgs:
                images = imgs
                break
            time.sleep(0.3)

    if not images:
        print(f"  No images found!")
        not_found.append(slug)
    else:
        print(f"  Found {len(images)} images")
        results[slug] = {"work_id": work_id, "images": images}

    time.sleep(0.5)  # Be polite to the server

# ─── Insert into Supabase ────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("Inserting images into Supabase...")
print("=" * 60)

total_inserted = 0
insert_summary = {}

for slug, data in results.items():
    work_id = data["work_id"]
    images = data["images"]

    rows = []
    for i, url in enumerate(images):
        rows.append({
            "work_id": work_id,
            "url": url,
            "alt": id_to_title.get(work_id, slug),
            "sort_order": i,
        })

    print(f"\n  Inserting {len(rows)} images for {slug}...")
    status = rest_post("public_work_images", rows)
    if status and status < 300:
        print(f"  OK (status {status})")
        total_inserted += len(rows)
        insert_summary[slug] = len(rows)
    else:
        print(f"  Failed (status {status})")
        errors.append(slug)

# ─── Summary ────────────────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"\nTotal images inserted: {total_inserted}")
print(f"\nWorks with images inserted ({len(insert_summary)}):")
for slug, cnt in sorted(insert_summary.items(), key=lambda x: -x[1]):
    print(f"  {slug}: {cnt} images")

if not_found:
    print(f"\nWorks with 0 images found ({len(not_found)}):")
    for slug in not_found:
        print(f"  {slug}")

if errors:
    print(f"\nInsert errors ({len(errors)}):")
    for slug in errors:
        print(f"  {slug}")
