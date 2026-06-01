#!/usr/bin/env python3
"""
One-off: fetch the old-site pages that are still linked from exhibitions and
extract (a) the article body text and (b) all content image URLs, so the
content can be re-hosted into internal sub-pages. Prints JSON to stdout.
"""
import urllib.request
import json
import re
import sys
import html as htmllib

PAGES = {
    "galerie-belle-paletten": "https://sivertlindblom.se/folio/utstallningar/galerie-belle-malmo-vandringsutstallningar-1973-75/",
    "galerie-belle-lass-lassen": "https://sivertlindblom.se/galerie-belle-vasteras-1974/",
    "doktor-glas-azteker": "https://sivertlindblom.se/texter/azteker-i-kalejdoskop-nr-178/",
    "historiska-arkipelag": "https://sivertlindblom.se/folio/utstallningar/arkipelag-stockholms-europas-kulturhuvudstad-1998/",
    "luzern-north-information": "https://sivertlindblom.se/texter/katalog-live-show-ii-north-information-no-30-1977/",
    "biennale-leif-nylen": "https://sivertlindblom.se/dn-23-04-95-leif-nylen-om-venedigbiennalen-1968/",
    "biennale-bildens-emancipation": "https://sivertlindblom.se/texter/bildens-emancipation-sivert-lindblom-ur-paletten-nr-2-1968/",
    "biennale-katalog": "https://sivertlindblom.se/venedigbiennalen-katalog-1968/",
    "skissernas-visar-modeller": "https://sivertlindblom.se/biografi/sivert-lindblom-visar-modeller-pa-skissernas-museum-lund-1993/",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def extract_entry(html: str) -> str:
    # Theme container is <div class="gdl-page-content"> … social-share footer.
    m = re.search(r'<div[^>]*class="gdl-page-content"[^>]*>(.*?)(?:<div[^>]*class="sharedaddy|<div[^>]*id="jp-relatedposts|<footer)', html, re.S | re.I)
    if not m:
        m = re.search(r'<div[^>]*class="gdl-page-content"[^>]*>(.*)', html, re.S | re.I)
    frag = m.group(1) if m else ""
    # Cut at the Swedish social-share label if present
    frag = re.split(r'Dela detta\s*:', frag)[0]
    return frag


def images_in(fragment: str) -> list:
    urls = []
    for m in re.finditer(r'https://sivertlindblom\.se/wp-content/uploads/[^"\'\) ]+?\.(?:jpe?g|png)', fragment, re.I):
        u = m.group(0)
        # collapse thumbnail size suffix (-150x150) to the original file
        u = re.sub(r'-\d+x\d+(\.(?:jpe?g|png))$', r'\1', u, flags=re.I)
        if "Logga-Sivert" in u:
            continue
        if u not in urls:
            urls.append(u)
    return sorted(urls)


def to_text(fragment: str) -> str:
    # paragraphs
    parts = re.split(r'</p>|<br\s*/?>|</div>', fragment, flags=re.I)
    out = []
    for p in parts:
        t = re.sub(r'<[^>]+>', '', p)
        t = htmllib.unescape(t).strip()
        t = re.sub(r'\s+', ' ', t)
        if t and "Logga" not in t:
            out.append(t)
    return "\n\n".join(out)


def main():
    result = {}
    for key, url in PAGES.items():
        try:
            html = fetch(url)
            frag = extract_entry(html)
            title_m = re.search(r'<title>(.*?)</title>', html, re.S | re.I)
            title = htmllib.unescape(title_m.group(1)).split("»")[-1].strip() if title_m else key
            # Images from the full page (galleries sit outside the text container);
            # text from the content container only.
            body_only = re.split(r'<footer|class="gdl-footer', html)[0]
            result[key] = {
                "url": url,
                "title": title,
                "images": images_in(body_only),
                "text": to_text(frag),
            }
            print(f"[OK] {key}: {len(result[key]['images'])} imgs, {len(result[key]['text'])} chars", file=sys.stderr)
        except Exception as e:
            result[key] = {"url": url, "error": str(e)}
            print(f"[FAIL] {key}: {e}", file=sys.stderr)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
