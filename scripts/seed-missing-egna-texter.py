#!/usr/bin/env python3
"""Upsert the 4 previously-missing egna texter entries to Supabase (with images)."""
import urllib.request, urllib.error, json, urllib.parse

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)

BASE = "https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media"

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
}

ROWS = [
    {
        "slug": "stenpriset-1985",
        "title": "Stenpriset till Sivert Lindblom — Sveriges Stenindustriförbund 1985",
        "author": "Sveriges Stenindustriförbund",
        "text_type": "own_writing",
        "publication": "Sten, nr 2 årgång 47, 1985",
        "year": 1985,
        "language": "sv",
        "content": (
            "Här kan du ladda ned Sveriges Stenindustriförbunds motivering för att Sivert Lindblom "
            "tilldelas Stenpriset 1985. Dokumentet är ett utdrag ur tidskriften Sten, nr 2, årgång 47.\n\n"
            "[Hämta PDF (3,8 MB) →](https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/02/Sten-1985opt-.pdf)"
        ),
        "images": [
            f"{BASE}/2015/02/Sten-omslag-1985-minst.jpg",
        ],
        "published": True,
    },
    {
        "slug": "statens-konstrad-1988",
        "title": "Statens Konstråd nr 17–18, april 1988",
        "author": "Sivert Lindblom",
        "text_type": "own_writing",
        "publication": "Statens Konstråd, nr 17–18, april 1988",
        "year": 1988,
        "language": "sv",
        "content": (
            "Statens Konstråd firade 50 år hösten 1987 med ett symposium om samarbetet mellan konstnärer "
            "och arkitekter. Redaktör Staffan Cullberg presenterade temat i detta specialnummer av Statens "
            "Konstråds tidskrift, och arkitekt Carl Norén beskrev hur konstnärer fungerat som "
            "\"problemlösare och inspiratörer\" i hans projekt — däribland samarbetena med Sivert Lindblom "
            "vid Pharmacia, Uppsala bibliotek och Blasieholmstorg."
        ),
        "images": [
            f"{BASE}/2015/03/Statens-Konst.jpg",
            f"{BASE}/2015/03/Statens-Konst2.jpg",
            f"{BASE}/2015/03/Statens-Konst3.jpg",
            f"{BASE}/2015/03/Statens-Konst4.jpg",
        ],
        "published": True,
    },
    {
        "slug": "meddelande-konst-bostadsomraden-1985",
        "title": "Meddelande – om konst i bostadsområden, på allmän plats, i offentliga lokaler",
        "author": "Riksutställningar / Konstnärscentrum",
        "text_type": "own_writing",
        "publication": "Meddelande, Riksutställningar & Konstnärscentrum, 1985",
        "year": 1985,
        "language": "sv",
        "content": (
            "Riksutställningar och Konstnärscentrum tog 1985 initiativet att visa hur samarbete mellan "
            "arkitektur och estetik kan komma till stånd. En specialutgåva av publikationen Meddelande "
            "gavs ut i samband med bostadsutställningen Bo 85 i Upplands Väsby och utställningen Konst är bra!\n\n"
            "Konstnärscentrum (KC) har sedan 1969 arbetat med kommuner, landsting, konstföreningar, "
            "folkrörelser och företag som köper konst eller behöver konstnärer för att gestalta miljöer."
        ),
        "images": [
            f"{BASE}/2015/03/Meddelande-SL-1-1-.jpg",
            f"{BASE}/2015/03/Meddelande-SL-1-2-.jpg",
            f"{BASE}/2015/03/Meddelande-SL-2-2-2.jpg",
            f"{BASE}/2015/03/Meddelande-SL-2-3-.jpg",
            f"{BASE}/2015/03/Meddelande-SL-3-.jpg",
        ],
        "published": True,
    },
    {
        "slug": "intervju-humanistiska-foreningen-1989",
        "title": "Intervju för Humanistiska Föreningen, Stockholms Universitet 75 år",
        "author": "Jan Åman (intervjuare)",
        "text_type": "own_writing",
        "publication": "Humanistiska Föreningens jubileumstidskrift, 1989",
        "year": 1989,
        "language": "sv",
        "content": (
            "Till Humanistiska Föreningens jubileumstidskrift gjorde redaktören Jan Åman en intervju med "
            "Sivert Lindblom om hans arbete med Stockholms universitets campusområde i Frescati.\n\n"
            "Universitetsområdet har vuxit fram under lång tid och de enskilda byggnaderna har formats av "
            "funktionella krav och respektive arkitekts intentioner. Den omgivande miljön med de spridda "
            "byggnaderna har däremot fått mindre uppmärksamhet och inte gestaltats utifrån en "
            "sammanhållande estetisk idé.\n\n"
            "Lindblom beskriver hur han skapade en \"estetiskt och visuellt markerad linje\" från "
            "universitetets tunnelbaneentré och ut mot omgivande marker, med vridsna tegeltorn och "
            "skulpturer hämtade ur den klassiska mytologin."
        ),
        "images": [
            f"{BASE}/2015/03/Sivert-Lindblom-Frescati-1.jpg",
            f"{BASE}/2015/03/Sivert-Lindblom-Frescati-2.jpg",
        ],
        "published": True,
    },
]

def upsert(rows):
    payload = json.dumps(rows).encode("utf-8")
    url = f"{SUPABASE_URL}/rest/v1/texts?on_conflict=slug"
    req = urllib.request.Request(url, data=payload, method="POST", headers=HEADERS)
    try:
        with urllib.request.urlopen(req) as r:
            print(f"  ✓ {r.status} — {len(rows)} rows upserted")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ✗ {e.code}: {body}")

def verify():
    slugs = [r["slug"] for r in ROWS]
    filter_q = "slug=in.(" + ",".join(slugs) + ")"
    url = f"{SUPABASE_URL}/rest/v1/texts?{filter_q}&select=slug,year,images"
    req = urllib.request.Request(url, headers={
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
    })
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    print(f"\nVerification — {len(data)}/{len(ROWS)} found in DB:")
    for row in sorted(data, key=lambda x: x["year"]):
        img_count = len(row.get("images") or [])
        print(f"  ✓ {row['slug']} ({row['year']}) — {img_count} image(s)")

if __name__ == "__main__":
    print(f"Upserting {len(ROWS)} egna texter (with images) to Supabase...")
    upsert(ROWS)
    verify()
