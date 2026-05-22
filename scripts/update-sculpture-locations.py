#!/usr/bin/env python3
"""
Rebuild sculpture-locations.ts:
- Add slug links to existing entries
- Add new entries for works in public-works.json that lack coordinates
"""
import json, re

# ── Slug additions to existing entries ───────────────────────────
SLUG_MAP = {
    'sergels-torg-1998':              'sergels-torg-sergel-monumentet-stockholm-1998',
    'kungliga-biblioteket-1998':      'kungl-biblioteket-stockholm-1998',
    'synagogan-1998':                 'synagoga-forintelsemonumentet-stockholm-1998',
    'sas-huvudkontor-1988':           'sas-huvudkontor-frosundavik-stockholm-1988',
    'haga-norra-1993':                'haga-norra-gangbro-stockholm-1993',
    'seb-banken-1992':                'seb-banken-huvudkontor-rissne-1992',
    'kungstradgarden-1997':           'kungstradgarden-norra-delen-1997-98',
    'fersenska-palatset-1975':        'fersenska-palatset-handelsbanken-stockholm-1975',
    'garnisonen-1972':                'garnisonen-stockholm-1972',
    'vallingby-backe-1966':           'vallingby-backe-1966-67',
    'dagens-nyheter-1965':            'bronsgaller-dagens-nyheter-stockholm-1965',
    'riksbanken-1973':                'sveriges-riksbank-stockholm-1973',
    'medborgarplatsen-1984':          'riksbyggen-gota-ark-medborgarplatsen-stockholm-1984',
    'stadsteatern-1970':              'stadsteatern-stockholm-1970',
    'nk-ljusgard-1968':               'nk-ljusgard-1968',
    'berns-1991':                     'berns-ljusgard-1991',
    'medelhavsmuseet-1982':           'medelhavsmuseet-stockholm-1982-utstallning-ar-numera-utbytt',
    'nobel-forum-1993':               'nobel-forum',
    'gu-biblioteket-1985':            'goteborgs-universitetsbibliotek-1985',
    'lindholmsallen-goteborg':        'lindholmsallen-regnbagsgatan-goteborg',
    'pharmacia-1984':                 'pharmacia-entreplats-uppsala-1984-85',
    'uppsala-stadsbibliotek-1986':    'uppsala-stadsbibliotek-1986',
    'eskilstuna-2002':                'eskilstuna-rondellen-profilen-2002',
    'arbyparken-1973':                'lekplats-arby-omradet-eskilstuna-1973',
    'skövde-1995':                    'cavallobrunnen-resecentrum-skovde-1995-96',
    'norrtälje-stadsbibliotek-2006':  'roslagens-sparbank-norrtalje-2004',
    'kristianstad-1989':              'kristianstad-tivoliparken-1989',
    'trollhattan-1989':               'norra-alvsborgs-lanssjukhus-trollhattan-1989-91',
    'kalmar-1990':                    'kvarteret-baronen-kalmar-1990',
    'norrkoping-1986':                'lanssjukhuset-vrinnevi-innergard-norrkoping-1986',
    'haninge-1970':                   'vasterhaninge-bibliotek-haninge-kulturhus-1970',
    'visby-lasarett':                 'visby-lasarett-urna',
    'tetra-pak-1984':                 'tetra-pak-lausanne-schweiz-1984-85',
    'paris-ccs-1980':                 'sans-titre-centre-culturel-suedois-ccs-paris-1980',
    'ambassad-tokyo-1990':            'sveriges-ambassaden-entre-tokyo-1990-91',
    'potatisackern-2001':             'potatisakern-bostadsomrade-malmo-2001',
    'skissernas-museum-1988':         'skissernas-museum-fasad-1988',
    'ringvagen-1989':                 'kvarteret-svardet-stockholm1989',
    'norra-begravningsplatsen':       None,  # no public work page, keep as-is
}

# ── New entries (not currently in the file) ───────────────────────
NEW_ENTRIES = [
    # Returned to Haga Norra (re-inauguration 2015)
    {
        'id': 'aterinvigning-av-ulriksdalsbron',
        'title': 'Återinvigning Haga Norra gångbro 2015',
        'year': 2015,
        'city': 'Solna',
        'country': 'Sweden',
        'lat': 59.3633,
        'lng': 18.0253,
        'type': 'exterior',
        'slug': 'aterinvigning-av-ulriksdalsbron',
        'description': 'Återinvigning av Haga Norra gångbro med rekonstruerade bronssfärer och urna.',
    },
    # S:t Erik / Grubbens trappa
    {
        'id': 'st-erik-grubbens-trappa',
        'title': 'S:t Erik, Grubbens trappa',
        'year': 2000,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3350,
        'lng': 18.0418,
        'type': 'exterior',
        'slug': 'st-erik-grubbens-trappa-kungsholmen-stockholm-2000',
        'description': 'Bronsprofilhuvuden längs trappan på f.d. S:t Eriks sjukhustomt.',
    },
    # Farsta sjukhus
    {
        'id': 'farsta-sjukhus-1967',
        'title': 'Farsta sjukhus — Kepler',
        'year': 1967,
        'city': 'Farsta',
        'country': 'Sweden',
        'lat': 59.2405,
        'lng': 18.0977,
        'type': 'exterior',
        'slug': 'farsta-sjukhus-1967',
        'description': 'Balanserad skulptur "Kepler" utanför Farsta sjukhus.',
    },
    # Lugnet park (Falun)
    {
        'id': 'lugnet-park',
        'title': 'Lugnet park',
        'year': 1980,
        'city': 'Falun',
        'country': 'Sweden',
        'lat': 60.5931,
        'lng': 15.6319,
        'type': 'exterior',
        'slug': 'lugnet-park-projektforslag-1979-80',
        'description': 'Projektförslag för parkgestaltning i Lugnet.',
    },
    # Celsingarkivet (interior/archive, Stockholm)
    {
        'id': 'celsingarkivet',
        'title': 'Celsingarkivet',
        'year': 1980,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3220,
        'lng': 18.0694,
        'type': 'interior',
        'slug': 'celsingarkivet-kornhamnstorg-49-3tr',
        'description': 'Arkiv med ritningar och modeller från Peter Celsings produktion.',
    },
    # Scenografi: Drivved (Moderna Dansteatern)
    {
        'id': 'drivved-1987',
        'title': 'Scenografi: Drivved',
        'year': 1987,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3198,
        'lng': 18.0720,
        'type': 'interior',
        'slug': 'drivved-fragment-ur-tidigare-koreografier-av-och-med-margareta-asberg',
        'description': 'Scenografi för Margaretha Åsbergs koreografiska verk på Moderna Dansteatern.',
    },
    # Scenografi: Sand (Fylkingen)
    {
        'id': 'sand-1974',
        'title': 'Scenografi: Sand',
        'year': 1974,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3198,
        'lng': 18.0715,
        'type': 'interior',
        'slug': 'sand-10-rorelsedikter-med-koreograf-margareta-asberg-1974',
        'description': 'Scenografi till "Sand" av Margaretha Åsberg på Fylkingen.',
    },
    # Scenografi: Falska förtroenden (Stockholms Stadsteater)
    {
        'id': 'falska-fortroenden-1982',
        'title': 'Scenografi: Falska förtroenden',
        'year': 1982,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3318,
        'lng': 18.0648,
        'type': 'interior',
        'slug': 'scenografi-falska-fortroenden-av-marivaux-stockholms-stadsteater-1982',
        'description': 'Scenografi till Marivaux pjäs på Stockholms Stadsteater.',
    },
    # Motala Folkets Hus
    {
        'id': 'motala-folkets-hus',
        'title': 'Motala Folkets Hus',
        'year': 1978,
        'city': 'Motala',
        'country': 'Sweden',
        'lat': 58.5381,
        'lng': 15.0428,
        'type': 'interior',
        'slug': 'motala-folkets-hus-motala-i-samarbete-med-ulrik-samuelson-1978',
        'description': 'Tegelvägginstallationer i Motala Folkets Hus.',
    },
    # Norrlands Nationshus, Uppsala (takmålning)
    {
        'id': 'norrlands-nationshus-1972',
        'title': 'Norrlands Nationshus — takmålning',
        'year': 1972,
        'city': 'Uppsala',
        'country': 'Sweden',
        'lat': 59.8591,
        'lng': 17.6372,
        'type': 'interior',
        'slug': 'takmalning-norrlands-nationshus-uppsala-i-samarbete-med-ulrik-samuelson-1972',
        'description': 'Stor takmålning av målade glasrutor i Norrlands Nationshus.',
    },
    # Gustav Adolfs församlingshem, Borås
    {
        'id': 'tegelvagg-boras-1957',
        'title': 'Tegelvägg, Gustav Adolfs församlingshem',
        'year': 1957,
        'city': 'Borås',
        'country': 'Sweden',
        'lat': 57.7210,
        'lng': 12.9407,
        'type': 'interior',
        'slug': 'tegelvagg-gustav-adolfs-forsamlingshem-boras-med-olle-adrin-1957',
        'description': 'Inre tegelvägg i Gustav Adolfs församlingshem, ett av Lindbloms tidigaste offentliga verk.',
    },
    # Krucifix, Smögen
    {
        'id': 'krucifix-smogen',
        'title': 'Krucifix — frikyrka på Smögen',
        'year': 1955,
        'city': 'Smögen',
        'country': 'Sweden',
        'lat': 58.3583,
        'lng': 11.2268,
        'type': 'interior',
        'slug': 'krucefix-frikyrka-pa-smogen',
        'description': 'Tidigt krucifix för en frikyrka på Smögen.',
    },
    # Förbindelsegång Kulturhuset–Stadsteatern (distinct from Stadsteatern 1970)
    {
        'id': 'kulturhuset-stadsteatern-passage',
        'title': 'Förbindelsegång Kulturhuset–Stadsteatern',
        'year': 1989,
        'city': 'Stockholm',
        'country': 'Sweden',
        'lat': 59.3318,
        'lng': 18.0648,
        'type': 'interior',
        'slug': 'forbindelsegang-mellan-kulturhuset-och-stadsteaterns-stora-scen-stockholm-1989-92',
        'description': 'Passage som förbinder Kulturhuset med Stadsteaterns Stora Scen.',
    },
    # Norra Älvsborgs Länssjukhus interior (already in as exterior trollhattan-1989)
    # Skip — already linked above via SLUG_MAP
]

# ── Read current file ─────────────────────────────────────────────
with open('src/lib/sculpture-locations.ts', encoding='utf-8') as f:
    content = f.read()

# Add slug to existing entries that don't yet have one
for entry_id, new_slug in SLUG_MAP.items():
    if new_slug is None:
        continue
    # Find the entry block and add slug if missing
    # Pattern: id: 'entry_id' followed somewhere by the closing },
    pattern = rf"(id: '{re.escape(entry_id)}'[^}}]*)(\n  \}})"
    def add_slug(m):
        block = m.group(1)
        if 'slug:' in block:
            return m.group(0)  # already has slug
        # Add slug before closing
        return block + f"\n    slug: '{new_slug}'," + m.group(2)
    content, n = re.subn(pattern, add_slug, content, flags=re.DOTALL)
    if n == 0:
        print(f"WARNING: could not find entry id='{entry_id}'")

# ── Append new entries ────────────────────────────────────────────
new_blocks = []
for e in NEW_ENTRIES:
    lines = [
        '  {',
        f"    id: '{e['id']}',",
        f"    title: '{e['title']}',",
        f"    year: {e['year']},",
        f"    city: '{e['city']}',",
        f"    country: '{e['country']}',",
        f"    lat: {e['lat']},",
        f"    lng: {e['lng']},",
        f"    type: '{e['type']}',",
        f"    slug: '{e['slug']}',",
        f"    description: '{e['description']}',",
        '  },'
    ]
    new_blocks.append('\n'.join(lines))

# Insert before closing ]
insert_block = '\n\n  // ── Additional works (added by migration script) ─────────────\n' + '\n'.join(new_blocks)
content = content.rstrip()
if content.endswith(']'):
    content = content[:-1] + insert_block + '\n]\n'

with open('src/lib/sculpture-locations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done. sculpture-locations.ts updated.")
print(f"  Existing entries updated with slugs: {sum(1 for v in SLUG_MAP.values() if v)}")
print(f"  New entries added: {len(NEW_ENTRIES)}")
