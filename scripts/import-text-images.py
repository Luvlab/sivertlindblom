#!/usr/bin/env python3
"""
Re-host content images for every `texts` row from the old WordPress site
(sivertlindblom.se) into Supabase Storage (bucket `images`, path wp/...),
and emit a slug -> {url, images:[new public urls]} proposal map.

Phase controlled by argv:
  build   - build slug->old-URL map (seed overrides + fuzzy match), write proposal stub
  extract - fetch each matched post, extract+rehost images, fill proposal images
  (default runs build only; extract reuses the saved match map)

Writes proposal to /tmp/text-images-proposal.json.
"""
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

SUPABASE_URL = "https://ixlvwwllvpweltntbsou.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0."
    "OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc"
)
BUCKET = "images"
UA = {"User-Agent": "Mozilla/5.0"}

PROPOSAL = "/tmp/text-images-proposal.json"
MATCHMAP = "/tmp/text-match-map.json"
ALL_URLS = "/tmp/all-urls.txt"


def ascii_fold(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def ascii_safe(s: str) -> str:
    return ascii_fold(s)


# ---------- image extraction ----------

IMG_RE = re.compile(
    r'(https?:)?//[^"\'\s)]*?(?:wp-content/uploads|media\.sivertlindblom\.se)[^"\'\s)]*?\.(?:jpe?g|png|gif)',
    re.IGNORECASE,
)
THUMB_RE = re.compile(r'-\d+x\d+(?=\.(?:jpe?g|png|gif)$)', re.IGNORECASE)


WP_CDN_RE = re.compile(r'^(https?:)?//i\d\.wp\.com/', re.IGNORECASE)


def canonicalize(u: str) -> str:
    """Return a clean http(s) URL pointing at the original old-site file.
    Strips Jetpack i0.wp.com CDN wrapper and thumbnail suffix; drops query/fragment.
    """
    if u.startswith("//"):
        u = "http:" + u
    # Jetpack CDN: //i0.wp.com/sivertlindblom.se/wp-content/... -> http://sivertlindblom.se/wp-content/...
    if WP_CDN_RE.match(u):
        inner = WP_CDN_RE.sub("", u)
        u = "http://" + inner
    parsed = urllib.parse.urlparse(u)
    path = THUMB_RE.sub("", parsed.path)
    return urllib.parse.urlunparse(parsed._replace(path=path, query="", fragment=""))


def extract_images(html: str):
    # cut at footer to avoid related-post / sidebar thumbs
    for marker in ('<footer', 'class="gdl-footer'):
        idx = html.find(marker)
        if idx != -1:
            html = html[:idx]
    seen = []           # ordered canonical URLs to download
    seen_paths = set()  # storage-path dedupe (media-mirror & wp-content are same file)
    for m in IMG_RE.finditer(html):
        raw = m.group(0)
        if "/wp-content/themes/" in raw:
            continue
        nu = canonicalize(raw)
        fname = nu.rsplit("/", 1)[-1]
        if "Logga" in fname:
            continue
        path = url_to_storage_path(nu)
        if path in seen_paths:
            continue
        seen_paths.add(path)
        seen.append(nu)
    return seen


# ---------- storage ----------

def url_to_storage_path(url: str) -> str:
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    path = ascii_safe(path)
    if "/wp-content/uploads/" in path:
        path = path.replace("/wp-content/uploads/", "wp/", 1)
    else:
        # media.sivertlindblom.se/2015/03/Foo.jpg -> wp/2015/03/Foo.jpg
        path = "wp/" + path.lstrip("/")
    return path.lstrip("/")


def _safe_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    # unquote first so already-encoded paths aren't double-encoded, then re-quote.
    safe_path = urllib.parse.quote(urllib.parse.unquote(parsed.path))
    return urllib.parse.urlunparse(parsed._replace(path=safe_path))


def download(url: str):
    safe = _safe_url(url)
    req = urllib.request.Request(safe, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        ct = r.headers.get("Content-Type", "application/octet-stream").split(";")[0].strip()
        return r.read(), ct


def upload(path: str, data: bytes, content_type: str) -> str:
    encoded = urllib.parse.quote(path, safe="/")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}",
        data=data, method="POST",
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": content_type or "application/octet-stream",
            "x-upsert": "true",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        r.read()
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{encoded}"


def fetch_html(url: str) -> str:
    req = urllib.request.Request(_safe_url(url), headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


# ---------- matching ----------

STOP = set("och om till for med av i pa en ett the to at och nr the a la le".split())


def tokens(s: str):
    s = ascii_fold(s.lower())
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return [t for t in s.split() if len(t) > 1 and t not in STOP]


def last_seg(url: str) -> str:
    p = urllib.parse.urlparse(url).path.rstrip("/")
    return urllib.parse.unquote(p.rsplit("/", 1)[-1])


# Manual high-confidence slug -> old URL overrides (seed.sql ground truth + clear root-level posts).
# DB slugs differ from seed.sql slugs, so we map by DB slug.
MANUAL = {
    # seed.sql exact source_urls, mapped to current DB slugs
    "peter-cornell-2012": "http://sivertlindblom.se/texter/andras-texter/peter-cornell-text-till-katalog-akvareller-m-m-2012/",
    "jan-oqvist-2012": "http://sivertlindblom.se/texter/andras-texter/jan-oqvist-text-till-katalog-akvareller-m-m-2012/",
    "catharina-gabrielsson-2012": "http://sivertlindblom.se/texter/andras-texter/catharina-gabrielsson-text-till-katalog-akvareller-2012/",
    "daniel-birnbaum-1993": "http://sivertlindblom.se/texter/andras-texter/daniel-birnbaum-forord-till-katalog-skulptur-lunds-konsthall-1993/",
    "stefan-alenius-1993": "http://sivertlindblom.se/texter/andras-texter/stefan-alenius-text-till-skulptur-arkitektur-skissernas-museum-1993/",
    "cecilia-nelson-1993": "http://sivertlindblom.se/texter/andras-texter/cecilia-nelson-forord-till-katalog-skulptur-lunds-konsthall-1993/",
    "stig-larsson-1993": "http://sivertlindblom.se/texter/andras-texter/stig-larsson-text-till-katalog-skulptur-lunds-konsthall-1993/",
    "jean-christophe-ammann-1977": "http://sivertlindblom.se/texter/andras-texter/jean-christophe-ammann-katalogtext-till-live-show-ii-kunstmuseum-luzern-1977/",
    "beate-sydhoff-1967": "http://sivertlindblom.se/texter/andras-texter/samtal-med-sivert-lindblom-beate-sydhoff-konstrevy-nr-2-1967/",
    "ulf-linde-1971": "http://sivertlindblom.se/texter/andras-texter/ulf-linde-text-to-exhibition-at-gimpel-hanover-zurich-1971/",
    "leon-rappaport-1963": "http://sivertlindblom.se/texter/andras-texter/forord-av-leon-rappaport-till-utstallningen-pa-galerie-buren-1963/",
    "stig-larsson-1981": "http://sivertlindblom.se/texter/andras-texter/stig-larsson-om-sivert-lindblom-galeri-asbaek-kopenhamn-1981/",
    "jan-hafstrom-1976": "http://sivertlindblom.se/texter/andras-texter/jan-hafstrom-om-live-show-moderna-museet-1976/",
    "sivert-lindblom-live-show-1974": "http://sivertlindblom.se/biografi/egna-texter/sivert-lindblom-katalogtext-till-live-show-moderna-museet-1974/",
    "gemensamma-rum-1998": "http://sivertlindblom.se/biografi/egna-texter/citat-ur-%e2%98%85-gemensamma-rum-av-peter-cornell-och-sivert-lindblom-1998/",
    "sivert-lindblom-bra-konst-1986": "http://sivertlindblom.se/biografi/egna-texter/bra-konst-i-bra-arkitektur-symposium-kro-distrikt-17-och-sar-msa-1986/",
    "ingela-lind-2012": "http://sivertlindblom.se/biografi/recensioner/ingela-lind-dn-1-november-om-sivert-lindblom-kungl-konstakademien-2012/",
    "janne-malmros-skanska-dagbladet-1993": "http://sivertlindblom.se/skanska-dagbladet-5-02-93-janne-malmros-skissernas-museum-lunds-konsthall/",
    "rebecka-tarschys-1989": "http://sivertlindblom.se/dn-29-09-89-rebecka-tarschys-blasieholms-torg/",
    "arkitektur-1983": "http://sivertlindblom.se/texter/andras-texter/intervju-med-sivert-lindblom-arkitektur-nr-5-1983/",
    "beate-sydhoff-english-1967": "http://sivertlindblom.se/texter/andras-texter/a-conversation-with-sivert-lindblom-by-beate-sydhoff-english-konstrevy-nr-2-1967/",
    "beate-sydhoff-italian-1967": "http://sivertlindblom.se/texter/andras-texter/conversazione-con-sivert-lindblom-italiano-by-beate-sydhoff-konstrevy-nr-2-1967/",
    "lars-bergquist-1980": "http://sivertlindblom.se/texter/andras-texter/preface-pour-la-exhibition-a-centre-culturel-suedois-lars-berquist-1980/",
    # additional clear matches
    "jan-torsten-ahlstrand-1993": "http://sivertlindblom.se/texter/andras-texter/jan-torsten-ahlstrand-forord-till-katalog-skulptur-arkitektur-skissernas-museum-1993/",
    "torsten-ekbom-1980": "http://sivertlindblom.se/texter/andras-texter/torsten-ekbom-pour-ccs-paris-1980/",
    "konstnaren-kro-1993": "http://sivertlindblom.se/texter/andras-texter/konstnaren-kro-nr-2mars-1993/",
    "birger-vikstrom-kofes": "http://sivertlindblom.se/texter/andras-texter/kofes-vad-ar-en-kofes-las-birger-vikstroms-berattelse-om-en-kofes-ur-hans-13-berattelser/",
    "tankar-om-konst-rodin": "http://sivertlindblom.se/texter/andras-texter/tankar-om-konst-auguste-rodin/",
    "om-multikonst-1968": "http://sivertlindblom.se/texter/andras-texter/om-multikonst-meddelande-fran-moderna-museets-vanner-nr-27-28-febr-1968/",
    "statens-konstrad-1988": "http://sivertlindblom.se/biografi/egna-texter/statens-konstrad-nr-17-18-april-1988/",
    "humanistiska-foreningen-1989": "http://sivertlindblom.se/biografi/egna-texter/intervju-for-humanistiska-foreningen-stockholms-universitet-75-ar-1989/",
    "intervju-humanistiska-foreningen-1989": "http://sivertlindblom.se/biografi/egna-texter/intervju-for-humanistiska-foreningen-stockholms-universitet-75-ar-1989/",
    "stenpriset-1985": "http://sivertlindblom.se/biografi/egna-texter/pdf-fil-att-skriva-ut-om-stenpriset-till-sivert-lindblom-av-sveriges-stenindustriforbund-1985/",
    "meddelande-konst-bostadsomraden-1985": "http://sivertlindblom.se/biografi/egna-texter/meddelande-om-konst-i-bostadsomraden-pa-allman-plats-i-offentliga-lokaler/",
    "meddelande-om-konst-offentlig-miljo": "http://sivertlindblom.se/biografi/egna-texter/meddelande-om-konst-i-bostadsomraden-pa-allman-plats-i-offentliga-lokaler/",
    "leif-nylen-italian-1966": "http://sivertlindblom.se/texter/andras-texter/leif-nylen-critico-darte-sivert-lindblom-italian-konstrevy-nr-5-6-1966/",
    "torsten-ekbom-ccs-1980-sv": "http://sivertlindblom.se/texter/andras-texter/torsten-ekbom-pour-ccs-paris-1980/",
    "beate-sydhoff-galerie-buren-1973": "http://sivertlindblom.se/texter/andras-texter/beate-sydhoff-om-galerie-buren-1973/",
    "ulf-linde-dn-1966": "http://sivertlindblom.se/biografi/recensioner/ulf-linde-i-dagens-nyheter-1966/",
    "ulf-linde-dn-forsvar-1967": "http://sivertlindblom.se/dn-1-06-67-ulf-linde-forsvar/",
    "uppsalareaktion-stadsbiblioteket-1987": "http://sivertlindblom.se/biografi/recensioner/uppsalareaktion-pa-vriden-pelare-utanfor-stadsbiblioteket-1987/",
    "recension-vadsbo-museum-mariestad-1962": "http://sivertlindblom.se/biografi/recensioner/recension-vadsbo-museum-mariestad-1962/",
    "bengt-nerman-live-show-1974": "http://sivertlindblom.se/biografi/recensioner/bengt-nerman-om-live-show-19-maj-1974/",
    "birgitta-nyblom-riksbanken-1976": "http://sivertlindblom.se/biografi/recensioner/riksbanken-birgitta-nyblom-dn-pa-stan-3-9-januari-1976/",
    "vastra-skogen-dn-1978": "http://sivertlindblom.se/biografi/recensioner/vastra-skogen-mellan-lars-kleen-och-olle-granath-dn-26-maj-1978/",
    "arne-tornqvist-stockholms-tidningen-1963": "http://sivertlindblom.se/biografi/recensioner/sivert-lindblom-stockholms-tidningen-arne-tornqvist-1963/",
    "torsten-ekbom-aronowitsch-1981": "http://sivertlindblom.se/biografi/recensioner/recension-galleri-aronowitsch-dn-torsten-ekbom-1981/",
    "lars-nittve-aronowitsch-1981": "http://sivertlindblom.se/biografi/recensioner/recension-galleri-aronowitsch-1981-lars-nittve/",
    "lars-nittve-galleri-olsson-1985": "http://sivertlindblom.se/biografi/recensioner/recension-galleri-olsson-lars-nittve-svd-6-april-1985/",
    "peder-alton-galleri-olsson-1985": "http://sivertlindblom.se/biografi/recensioner/recension-galleri-olsson-17-april-1985-peder-alton-dn/",
    "bengt-olvang-dn-liljevalchs-1966": "http://sivertlindblom.se/biografi/recensioner/bengt-olvang-dn-nutida-svensk-skulptur-liljevalchs-konsthall-1966/",
    "bengt-olvang-aftonbladet-1966": "http://sivertlindblom.se/biografi/recensioner/bengt-olvang-galerie-buren-dn-17-november-1966/",
    "beate-sydhoff-svd-1966": "http://sivertlindblom.se/biografi/recensioner/beate-sydhoff-galerie-buren-svd-17-november-1966/",
    "arne-tornqvist-aronowitsch-1986": "http://sivertlindblom.se/biografi/recensioner/arne-tornqvist-om-sivert-lindblom-galleri-aronowitsch-1986/",
    "folke-edwards-sydsvenska-1967": "http://sivertlindblom.se/biografi/recensioner/folke-edwards-sydsvenska-dagbladet-om-sivert-lindblom-krognoshuset-lund-1967/",
    "akermark-eskilstuna-2002": "http://sivertlindblom.se/texter/akermark-om-sivert-lindblom-eskilstuna-konsthall-2002/",
    "hakan-bull-2013": "http://sivertlindblom.se/texter/andras-texter/akvarellen-nr-2-2013/",
    "niels-hebert-omkonst-2012": "http://sivertlindblom.se/omkonst-konstnarer-skriver-om-konst-niels-hebert/",
    "karsten-thurfjell-vandalorum-2016": "http://sivertlindblom.se/karsten-thurfjell-for-kulturnytt-p1-4-augusti-2016/",
    # root-level newspaper-clip posts
    "amelie-bosson-arbetet-1993": "http://sivertlindblom.se/arbetet-6-02-93-amelie-bosson/",
    "arbetet-5-02-93": "http://sivertlindblom.se/arbetet-5-03-93/",
    "ingamaj-beck-aftonbladet-1993": "http://sivertlindblom.se/aftonbladet-25-02-93-ingamaj-beck/",
    "rebecka-tarschys-frescati-1986": "http://sivertlindblom.se/dn-6-03-86-rebecka-tarschys/",
    "ingmar-unge-1989": "http://sivertlindblom.se/dn-30-09-89-ingmar-unge-blasieholms-torg/",
    "expressen-1964-sven-malm": "http://sivertlindblom.se/9068-2/",
    "goteborgs-handel-1964-tord-baekstrom": "http://sivertlindblom.se/goteborgs-handelssjofartstidning-konstrond-gt-tord-baekstrom-19-09-64/",
    "goteborgs-tidningen-1964-b-a": "http://sivertlindblom.se/goteborgs-tidningen-19-09-64-b-a-4-stockholmare/",
    "jelena-zetterstrom-sydsvenskan-5feb-1993": "http://sivertlindblom.se/sydsvenskan-5-02-93-jelena-zetterstrom-lunds-konsthall-skissernas-museum/",
    "jelena-zetterstrom-sydsvenskan-6feb-1993": "http://sivertlindblom.se/sydsvenskan-6-02-93-jelena-zetterstrom-lunds-konsthall-skissernas-museum/",
    "lars-goran-oredsson-sydsvenskan-1993": "http://sivertlindblom.se/sydsvenskan-19-02-93-lars-goran-oredsson-skissernas-museum-lunds-konsthall/",
    "marten-castenfors-svd-1993": "http://sivertlindblom.se/svd-18-03-93-marten-castenfors-skissernas-museum-lunds-konsthall/",
    "monica-anrep-nordin-frescati-1986": "http://sivertlindblom.se/svd-6-03-86-monica-anrep-nordin-frescati/",
    "hedvig-hedqvist-1989": "http://sivertlindblom.se/svd-6-10-89-hedvig-hedqvist-blasieholmstorg/",
    "sodermanlands-nyheter-blasieholmstorg-1989": "http://sivertlindblom.se/sodermanlands-nyheter-nykoping-blasieholms-torg/",
}


def load_db_rows():
    return json.load(open("/tmp/db-texts.json", encoding="utf-8"))


def build_map():
    rows = load_db_rows()
    all_urls = [u.strip() for u in open(ALL_URLS, encoding="utf-8") if u.strip()]
    # candidate posts: exclude category index pages and obvious non-post sections
    cands = []
    for u in all_urls:
        path = urllib.parse.urlparse(u).path.rstrip("/")
        if not path:
            continue
        if u.endswith(("/texter/", "/texter/andras-texter/", "/biografi/recensioner/",
                       "/biografi/egna-texter/", "/folio/")):
            continue
        cands.append(u)
    cand_tokens = {u: set(tokens(last_seg(u))) for u in cands}

    result = {}
    unmatched = []
    for r in rows:
        slug = r["slug"]
        if slug in MANUAL:
            result[slug] = {"url": MANUAL[slug], "confidence": "manual", "title": r["title"]}
            continue
        # skip rows whose source_url is a youtube video (not an old-site post)
        su = (r.get("source_url") or "")
        if "youtube.com" in su:
            unmatched.append((slug, r["title"], "youtube source, no old-site post"))
            continue
        qt = set(tokens(slug)) | set(tokens(r["title"] or "")) | set(tokens(r.get("author") or ""))
        if r.get("year"):
            qt.add(str(r["year"]))
        best, best_score = None, 0
        for u, ct in cand_tokens.items():
            shared = qt & ct
            score = len(shared)
            if score > best_score:
                best, best_score = u, score
                best_shared = shared
        if best and best_score >= 3:
            result[slug] = {"url": best, "confidence": f"fuzzy({best_score})",
                            "shared": sorted(best_shared), "title": r["title"]}
        else:
            unmatched.append((slug, r["title"], f"best={best} score={best_score}"))
    json.dump(result, open(MATCHMAP, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"matched {len(result)} / {len(rows)}", file=sys.stderr)
    print(f"unmatched {len(unmatched)}:", file=sys.stderr)
    for s, t, why in unmatched:
        print(f"  - {s} | {t} | {why}", file=sys.stderr)
    return result, unmatched


def run_extract():
    mm = json.load(open(MATCHMAP, encoding="utf-8"))
    cache = {}
    proposal = {}
    for slug, info in mm.items():
        url = info["url"]
        try:
            html = fetch_html(url)
        except Exception as e:
            proposal[slug] = {"url": url, "error": f"fetch: {e}", "images": []}
            print(f"FETCHFAIL {slug}: {e}", file=sys.stderr)
            continue
        srcs = extract_images(html)
        new_urls = []
        for s in srcs:
            if s in cache:
                new_urls.append(cache[s])
                continue
            try:
                data, ct = download(s)
                path = url_to_storage_path(s)
                nu = upload(path, data, ct)
                cache[s] = nu
                new_urls.append(nu)
                print(f"  OK {slug} {len(data)//1024}KB -> {path}", file=sys.stderr)
            except Exception as e:
                print(f"  IMGFAIL {slug} {s}: {e}", file=sys.stderr)
            time.sleep(0.05)
        proposal[slug] = {"url": url, "src_images": srcs, "images": new_urls,
                          "confidence": info.get("confidence")}
        print(f"[{slug}] {len(new_urls)} images", file=sys.stderr)
    json.dump(proposal, open(PROPOSAL, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"\nproposal written: {len(proposal)} texts", file=sys.stderr)


if __name__ == "__main__":
    phase = sys.argv[1] if len(sys.argv) > 1 else "build"
    if phase == "build":
        build_map()
    elif phase == "extract":
        run_extract()
