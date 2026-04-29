-- ─────────────────────────────────────────────
-- SEED: Sivert Lindblom — full content database
-- ─────────────────────────────────────────────

-- SITE SETTINGS
INSERT INTO settings (key, value) VALUES
  ('site_title',       'Sivert Lindblom'),
  ('site_subtitle',    'Skulptör · Konstnär · Stockholm'),
  ('hero_tagline',     'Skulptur, offentlig konst, akvareller och scenografi sedan 1963'),
  ('contact_email',    'info@sivertlindblom.se'),
  ('contact_phone',    ''),
  ('about_short',      'Sivert Lindblom (f. 1931) är en av Sveriges mest betydande skulptörer. Han studerade vid Kungliga Konsthögskolan 1958–1963 och har sedan dess skapat ett omfattande verk av skulpturer, offentliga installationer, akvareller och scenografi.')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- BIOGRAPHY ENTRIES
-- ─────────────────────────────────────────────
INSERT INTO biography_entries (entry_type, year_start, year_end, title, description, location, sort_order) VALUES
  ('personal',    1931, NULL, 'Född i Husby-Rekarne, Södermanland', '', 'Sverige', 1),
  ('education',   1945, 1949, 'Teknisk utbildning', '', 'Eskilstuna', 2),
  ('education',   1949, 1951, 'Lärlingsplats hos arkitekt Sigurd Lewerentz', '', 'Sverige', 3),
  ('education',   1954, 1958, 'Teckningslärarseminarium', '', 'Stockholm', 4),
  ('education',   1958, 1963, 'Kungliga Konsthögskolan', '', 'Stockholm', 5),
  ('position',    1957, 1974, 'Samarbete med arkitekt Peter Celsing', '', 'Stockholm', 6),
  ('position',    1963, 1966, 'Bosatt i Locarno', '', 'Schweiz', 7),
  ('position',    1966, 1970, 'Lärare i formteori, KTH Arkitekturskolan', '', 'Stockholm', 8),
  ('position',    1974, NULL, 'Ledamot, Kungliga Akademien för de fria konsterna', '', 'Stockholm', 9),
  ('position',    1975, 1979, 'Ledamot, Statens konstråd', '', 'Sverige', 10),
  ('position',    1989, NULL, 'Ledamot, Vägverkets skönhetsråd', '', 'Sverige', 11),
  ('position',    1991, NULL, 'Professor i skulptur, Kungliga Konsthögskolan', '', 'Stockholm', 12),
  ('award',       1985, NULL, 'Stenpriset, Sveriges Stenindustrifförbund', '', '', 13),
  ('award',       1995, NULL, 'Sergelpriset', '', 'Stockholm', 14),
  ('public_commission', 1965, NULL, 'Bronsgaller, Dagens Nyheter', '', 'Stockholm', 20),
  ('public_commission', 1966, 1967, 'Vällingby backe', '', 'Stockholm', 21),
  ('public_commission', 1972, NULL, 'Garnisonen', '', 'Stockholm', 22),
  ('public_commission', 1973, NULL, 'Lekplats, Ärbybostäder', '', 'Eskilstuna', 23),
  ('public_commission', 1975, NULL, 'Fersenska palatset, Handelsbanken', '', 'Stockholm', 24),
  ('public_commission', 1975, 1985, 'Västra skogen T-banestation', '', 'Stockholm', 25),
  ('public_commission', 1982, NULL, 'Riksbyggen/Göta Ark, Medborgarplatsen', '', 'Stockholm', 26),
  ('public_commission', 1984, 1985, 'Pharmacia entréplats', '', 'Uppsala', 27),
  ('public_commission', 1984, 1985, 'Tetra Pak', '', 'Lausanne, Schweiz', 28),
  ('public_commission', 1985, NULL, 'Göteborgs Universitetsbibliotek', '', 'Göteborg', 29),
  ('public_commission', 1986, NULL, 'Uppsala Stadsbibliotek', '', 'Uppsala', 30),
  ('public_commission', 1986, NULL, 'Länssjukhuset Vrinnevi, innergård', '', 'Norrköping', 31),
  ('public_commission', 1987, 1991, 'Stockholms Universitet Campus', '', 'Stockholm', 32),
  ('public_commission', 1988, NULL, 'Skissernas Museum fasad', '', 'Lund', 33),
  ('public_commission', 1988, NULL, 'SAS Huvudkontor, Frösundavik', '', 'Stockholm', 34),
  ('public_commission', 1989, NULL, 'Blasieholmstorg — hästar i brons', '', 'Stockholm', 35),
  ('public_commission', 1989, NULL, 'Kvarteret Svärd', '', 'Stockholm', 36),
  ('public_commission', 1989, NULL, 'Kristianstad, Tivoliparken', '', 'Kristianstad', 37),
  ('public_commission', 1990, 1991, 'Sveriges ambassad, entré', '', 'Tokyo', 38),
  ('public_commission', 1991, NULL, 'Berns Ljusgård', '', 'Stockholm', 39),
  ('public_commission', 1992, NULL, 'SEB Banken Huvudkontor', '', 'Rissne', 40),
  ('public_commission', 1993, NULL, 'Nobel Forum', '', 'Solna', 41),
  ('public_commission', 1993, NULL, 'Haga Norra gångbro', '', 'Stockholm', 42),
  ('public_commission', 1995, 1996, 'Cavallobrunnen, Resecentrum', '', 'Skövde', 43),
  ('public_commission', 1997, 1998, 'Kungsträdgården, norra delen', '', 'Stockholm', 44),
  ('public_commission', 1998, NULL, 'Synagoga förintelsenmonumentet', '', 'Stockholm', 45),
  ('public_commission', 1998, NULL, 'Sergels torg, Sergel monumentet', '', 'Stockholm', 46),
  ('public_commission', 1998, NULL, 'Kungliga Biblioteket', '', 'Stockholm', 47),
  ('public_commission', 2000, NULL, 'St Erik, Grubbens trappa, Kungsholmen', '', 'Stockholm', 48),
  ('public_commission', 2001, NULL, 'Potatisåkern bostadsområde, Profilen', '', 'Malmö', 49),
  ('public_commission', 2002, NULL, 'Gustav Adolfs torg, fontäner', '', 'Malmö', 50),
  ('public_commission', 2002, NULL, 'Eskilstuna rondellen, Profilen', '', 'Eskilstuna', 51),
  ('public_commission', 2003, NULL, 'Nobelmonument', '', 'New York', 52),
  ('public_commission', 2004, NULL, 'Roslagens Sparbank', '', 'Norrtälje', 53),
  ('public_commission', 2013, NULL, 'Bältesspännarparken', '', 'Göteborg', 54),
  ('group_exhibition', 1968, NULL, '34:e Biennalen i Venedig', '', 'Venedig', 60),
  ('group_exhibition', 1973, NULL, 'Images du Nord, Art Suédois, Musée Dynamique', '', 'Dakar', 61),
  ('group_exhibition', 1977, NULL, 'Kunstmuseum Luzern, Live Show II', '', 'Schweiz', 62),
  ('group_exhibition', 1979, NULL, 'Biennale Middelheim', '', 'Antwerpen', 63),
  ('group_exhibition', 1972, NULL, 'Swedish Art 1972', '', 'Tokyo & Kyoto', 64)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- WORKS — EXHIBITIONS
-- ─────────────────────────────────────────────
INSERT INTO works (slug, title, category, year_start, year_end, location, source_url, sort_order) VALUES
  ('vandalorum-2016',               'VANDALORUM',                                    'exhibition', 2016, 2016, 'Värnamo',    'https://sivertlindblom.se/folio/utstallningar/vandalorum-11-juni-28-augusti-2016/', 1),
  ('konstakademien-2012',           'Kungl. Konstakademien för de fria konsterna',   'exhibition', 2012, 2012, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/kungl-konstakademien-for-de-fria-konsterna-stockholm-2012/', 2),
  ('korsbarsgarden-2010',           'Körsbärsgården',                                'exhibition', 2010, 2010, 'Gotland',    'https://sivertlindblom.se/folio/utstallningar/korsbarsgarden-gotland-2010/', 3),
  ('galerie-aronowitsch-2005',      'Galerie Aronowitsch',                           'exhibition', 2005, 2005, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galerie-aronowitsch-2005/', 4),
  ('historiska-museet-1998',        'Historiska Museet, Kulturåret',                 'exhibition', 1998, 1998, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/historiska-museet-kulturaret-stockholm-1998/', 5),
  ('eskilstuna-konstforening-1996', 'Eskilstuna Konstförening',                      'exhibition', 1996, 1996, 'Eskilstuna', 'https://sivertlindblom.se/folio/utstallningar/eskilstuna-konstforening-1996/', 6),
  ('skovde-konsthall-1996',         'Skövde Konsthall',                              'exhibition', 1996, 1996, 'Skövde',     'https://sivertlindblom.se/folio/utstallningar/skovde-konsthall-1996/', 7),
  ('lunds-konsthall-1993',          'Lunds Konsthall',                               'exhibition', 1993, 1993, 'Lund',       'https://sivertlindblom.se/folio/utstallningar/lunds-konsthall-1993/', 8),
  ('skissernas-museum-1993',        'Skissernas Museum',                             'exhibition', 1993, 1993, 'Lund',       NULL, 9),
  ('bildmuseet-umea-1993',          'Bildmuseet',                                    'exhibition', 1993, 1993, 'Umeå',       'https://sivertlindblom.se/folio/utstallningar/bildmuseet-umea-1993/', 10),
  ('galleri-wallner-1987',          'Galleri Wallner',                               'exhibition', 1987, 1987, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galleri-wallner-1987/', 11),
  ('malmo-konsthall-1986',          'Malmö Konsthall, Metapolis',                    'exhibition', 1986, 1986, 'Malmö',      'https://sivertlindblom.se/folio/utstallningar/malmo-konsthall-metapolis-1986/', 12),
  ('liljevalchs-1986',              'Liljevalchs Konsthall, Skulpturer',             'exhibition', 1986, 1986, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/liljevalchs-konsthall-skulpturer-stockholm-1986/', 13),
  ('ibid-ii-1983',                  'IBID II, Linoljefabriken, Danviken',            'exhibition', 1983, 1983, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/ibid-ii-linoljefabriken-danviken-1983/', 14),
  ('ibid-i-1982',                   'IBID, Linoljefabriken, Danviken',               'exhibition', 1982, 1982, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/ibid-linoljefabriken-danviken-stockholm-1982/', 15),
  ('galerie-aronowitsch-1981',      'Galerie Aronowitsch',                           'exhibition', 1981, 1981, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galerie-aronowitsch-1981/', 16),
  ('biennale-middelheim-1979',      'Biennale Middelheim',                           'exhibition', 1979, 1979, 'Antwerpen',  'https://sivertlindblom.se/folio/utstallningar/biennale-middelheim-antwerpen-1979/', 17),
  ('galleri-wallner-1978',          'Galleri Wallner',                               'exhibition', 1978, 1978, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galleri-wallner-1978/', 18),
  ('doktor-glas-1978',              'Galleri Doktor Glas',                           'exhibition', 1978, 1978, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galleri-doktor-glas-stockholm-1978/', 19),
  ('kunstmuseum-luzern-1977',       'Kunstmuseum Luzern, Live Show II',              'exhibition', 1977, 1977, 'Schweiz',    'https://sivertlindblom.se/folio/utstallningar/kunstmuseum-luzern-live-show-ii-schweiz-1977/', 20),
  ('galleri-wallner-1977',          'Galleri Wallner',                               'exhibition', 1977, 1977, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galleri-wallner-1977/', 21),
  ('moderna-museet-1974',           'Moderna Museet, Live Show',                     'exhibition', 1974, 1974, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/moderna-museet-live-show-stockholm-1974/', 22),
  ('galerie-buren-1973',            'Galerie Buren, Föreslagna Åtgärder',            'exhibition', 1973, 1973, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galerie-buren-foreslagna-atgarder-stockholm-1973/', 23),
  ('galerie-gimpel-1971',           'Galerie Gimpel, Hanover & Zürich',              'exhibition', 1971, 1971, 'Europa',     'https://sivertlindblom.se/folio/utstallningar/galerie-gimpel-hanover-zurich-1971/', 24),
  ('ars-baltica-1970',              'Gotlands Fornsal, Ars Baltica IV',              'exhibition', 1970, 1970, 'Visby',      'https://sivertlindblom.se/folio/utstallningar/gotlands-fornsal-ars-baltica-iv-visby-1970/', 25),
  ('biennale-venezia-1968',         '34:e Biennalen i Venedig',                      'exhibition', 1968, 1968, 'Venedig',    'https://sivertlindblom.se/folio/utstallningar/la-34-biennale-di-venezia-1968/', 26),
  ('galerie-buren-1966',            'Galerie Buren',                                 'exhibition', 1966, 1966, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galerie-buren-1966/', 27),
  ('galerie-buren-1963',            'Galerie Buren',                                 'exhibition', 1963, 1963, 'Stockholm',  'https://sivertlindblom.se/folio/utstallningar/galerie-buren-1963/', 28)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- WORKS — PUBLIC EXTERIOR
-- ─────────────────────────────────────────────
INSERT INTO works (slug, title, category, year_start, year_end, location, description, source_url, sort_order) VALUES
  ('blasieholmstorg-1989',          'Blasieholmstorg — Hästar i brons',             'public_exterior', 1989, 1989, 'Stockholm',   'Två grönpatinerade bronshästar modellerade efter originalen på San Marcos basilika i Venedig. Gjutna av Herman Bergmans Konstgjuteri AB.',                        'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/blasieholmstorg-stockholm-1989/', 1),
  ('gustav-adolfs-torg-malmo-2002', 'Gustav Adolfs torg, fontäner',                 'public_exterior', 2002, 2002, 'Malmö',       'Fontäninstallation på Gustav Adolfs torg i Malmö.',                                                                                                           'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/gustav-adolfs-torg-malmo-2002/', 2),
  ('nobelmonument-new-york-2003',   'Nobelmonument',                                'public_exterior', 2003, 2003, 'New York',    'Nobelmonument i New York.',                                                                                                                                   'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/nobelmonument-new-york-2003/', 3),
  ('sergels-torg-1998',             'Sergels torg — Sergel monumentet',             'public_exterior', 1998, 1998, 'Stockholm',   'Monument på Sergels torg, Stockholm.',                                                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sergels-torg-sergel-monumentet-stockholm-1998/', 4),
  ('kungliga-biblioteket-1998',     'Kungliga Biblioteket',                         'public_exterior', 1998, 1998, 'Stockholm',   'Utsmyckning vid Kungliga Biblioteket.',                                                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kungl-biblioteket-stockholm-1998/', 5),
  ('synagoga-1998',                 'Synagoga — Förintelsenmonumentet',             'public_exterior', 1998, 1998, 'Stockholm',   'Förintelsemonument.',                                                                                                                                         'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/synagoga-forintelsemonumentet-stockholm-1998/', 6),
  ('stockholms-universitet-1987',   'Stockholms Universitet Campus',                'public_exterior', 1987, 1991, 'Stockholm',   'Skulpturer på campusområdet, Stockholms Universitet.',                                                                                                         'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/stockholms-universitet-campus-1987-91/', 7),
  ('sas-frosundavik-1988',          'SAS Huvudkontor, Frösundavik',                 'public_exterior', 1988, 1988, 'Stockholm',   'Utsmyckning vid SAS huvudkontor.',                                                                                                                            'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sas-huvudkontor-frosundavik-stockholm-1988/', 8),
  ('skissernas-museum-fasad-1988',  'Skissernas Museum, fasad',                     'public_exterior', 1988, 1988, 'Lund',        'Fasadutsmyckning, Skissernas Museum (f.d. Arkiv för dekorativ konst).',                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/skissernas-museum-fasad-1988/', 9),
  ('haga-norra-gangbro-1993',       'Haga Norra gångbro',                           'public_exterior', 1993, 1993, 'Stockholm',   'Gångbroutsmyckning, Haga Norra.',                                                                                                                             'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/haga-norra-gangbro-stockholm-1993/', 10),
  ('cavallobrunnen-skovde-1995',    'Cavallobrunnen, Resecentrum',                  'public_exterior', 1995, 1996, 'Skövde',      'Cavallofontän vid Skövde resecentrum.',                                                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/cavallobrunnen-resecentrum-skovde-1995-96/', 11),
  ('potatisakern-malmo-2001',       'Potatisåkern — Profilen',                      'public_exterior', 2001, 2001, 'Malmö',       'Skulptur på Potatisåkern bostadsområde.',                                                                                                                      'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/potatisakern-bostadsomrade-malmo-2001/', 12),
  ('eskilstuna-rondellen-2002',     'Eskilstuna rondellen — Profilen',              'public_exterior', 2002, 2002, 'Eskilstuna',  'Profilskulptur i rondell.',                                                                                                                                   'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/eskilstuna-rondellen-profilen-2002/', 13),
  ('baltesspan-goteborg-2013',      'Bältesspännarparken',                          'public_exterior', 2013, 2013, 'Göteborg',    'Skulptur i Bältesspännarparken.',                                                                                                                             NULL, 14),
  ('seb-rissne-1992',               'SEB Banken Huvudkontor',                       'public_exterior', 1992, 1992, 'Rissne',      'Obelisk utanför SEB:s huvudkontor.',                                                                                                                          'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/seb-banken-huvudkontor-rissne-1992/', 15),
  ('ambassaden-tokyo-1990',         'Sveriges ambassad, entré',                     'public_exterior', 1990, 1991, 'Tokyo',       'Entréskulptur vid svenska ambassaden i Tokyo.',                                                                                                                'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sveriges-ambassaden-entre-tokyo-1990-91/', 16),
  ('pharmacia-uppsala-1984',        'Pharmacia entréplats',                         'public_exterior', 1984, 1985, 'Uppsala',     'Utsmyckning vid Pharmacias entréplats.',                                                                                                                       'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/pharmacia-entreplats-uppsala-1984-85/', 17),
  ('ccs-paris-1980',                'Sans titre, Centre Culturel Suédois (CCS)',    'public_exterior', 1980, 1980, 'Paris',       'Skulptur vid Centre Culturel Suédois, Paris.',                                                                                                                 'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/sans-titre-centre-culturel-suedois-ccs-paris-1980/', 18),
  ('fersenska-palatset-1975',       'Fersenska Palatset, Handelsbanken',            'public_exterior', 1975, 1975, 'Stockholm',   'Utsmyckning, Fersenska Palatset.',                                                                                                                            'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/fersenska-palatset-handelsbanken-stockholm-1975/', 19),
  ('garnisonen-1972',               'Garnisonen',                                   'public_exterior', 1972, 1972, 'Stockholm',   'Utsmyckning, Garnisonen.',                                                                                                                                    'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/garnisonen-stockholm-1972/', 20),
  ('kungstradgarden-1997',          'Kungsträdgården, norra delen',                 'public_exterior', 1997, 1998, 'Stockholm',   'Skulpturer och utsmyckning i norra Kungsträdgården.',                                                                                                           'https://sivertlindblom.se/folio/offentliga-arbeten/exteriorer/kungstradgarden-norra-delen-1997-98/', 21)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- WORKS — PUBLIC INTERIOR
-- ─────────────────────────────────────────────
INSERT INTO works (slug, title, category, year_start, year_end, location, description, source_url, sort_order) VALUES
  ('nobel-forum',                   'Nobel Forum',                                  'public_interior', 1993, 1993, 'Solna',       'Utsmyckning i Nobel Forum.',                                                                                                                                  NULL, 1),
  ('berns-ljusgard-1991',           'Berns Ljusgård',                               'public_interior', 1991, 1991, 'Stockholm',   'Utsmyckning i Berns Ljusgård.',                                                                                                                               'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/berns-ljusgard-1991/', 2),
  ('vastra-skogen-1975',            'Västra skogen T-banestation',                  'public_interior', 1975, 1985, 'Stockholm',   'Utsmyckning i Västra skogen tunnelbanestation, Stockholm.',                                                                                                    'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/vastra-skogen-t-banestation-1975-1985/', 3),
  ('riksbanken-1973',               'Sveriges Riksbank',                            'public_interior', 1973, 1973, 'Stockholm',   'Utsmyckning i Riksbankens lokaler.',                                                                                                                          'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/sveriges-riksbank-stockholm-1973/', 4),
  ('riksbyggen-1984',               'Riksbyggen/Göta Ark, Medborgarplatsen',        'public_interior', 1984, 1984, 'Stockholm',   'Interiörutsmyckning.',                                                                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/riksbyggen-gota-ark-medborgarplatsen-stockholm-1984/', 5),
  ('tetra-pak-lausanne-1984',       'Tetra Pak',                                    'public_interior', 1984, 1985, 'Lausanne',    'Utsmyckning i Tetra Paks huvudkontor.',                                                                                                                       'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/tetra-pak-lausanne-schweiz-1984-85/', 6),
  ('gb-universitetsbibliotek-1985', 'Göteborgs Universitetsbibliotek',              'public_interior', 1985, 1985, 'Göteborg',    'Utsmyckning i Göteborgs Universitetsbibliotek.',                                                                                                               'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/goteborgs-universitetsbibliotek-1985/', 7),
  ('nk-ljusgard-1968',              'NK Ljusgård',                                  'public_interior', 1968, 1968, 'Stockholm',   'Utsmyckning i NK:s ljusgård.',                                                                                                                                'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/nk-ljusgard-1968/', 8),
  ('stadsteatern-1970',             'Stadsteatern Stockholm',                       'public_interior', 1970, 1970, 'Stockholm',   'Utsmyckning i Stadsteatern.',                                                                                                                                 'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/stadsteatern-stockholm-1970/', 9),
  ('scenografi-coriolanus-1970',    'Scenografi, Coriolanus, Stadsteatern',         'scenography',     1970, 1970, 'Stockholm',   'Scenografi för Coriolanus, Stockholms Stadsteater.',                                                                                                           'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/scenografi-coriolanus-stadsteatern-stockholm-1970/', 1),
  ('scenografi-falska-1982',        'Scenografi, Falska Förtroenden av Marivaux',   'scenography',     1982, 1982, 'Stockholm',   'Scenografi för Falska Förtroenden av Marivaux, Stockholms Stadsteater.',                                                                                        'https://sivertlindblom.se/folio/offentliga-arbeten/interiorer/scenografi-falska-fortroenden-av-marivaux-stockholms-stadsteater-1982/', 2)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- WORKS — WATERCOLORS
-- ─────────────────────────────────────────────
INSERT INTO works (slug, title, category, year_start, year_end, description, source_url, sort_order) VALUES
  ('akvareller-1975-2012', 'Akvareller 1975–2012', 'watercolor', 1975, 2012,
   'Ca 200 akvarellerade skissartade bilder skapade som ett slags "mental konstruktivism", som visar ett hermetiskt arkitektoniskt landskap. Bilderna formas med en strängt styrd grafisk teknik som resulterar i en fritt tillämpad axonometri. Femtio verk visades på Konstakademien i Stockholm, 6 oktober – 4 november 2012.',
   'https://sivertlindblom.se/folio/akvareller-1975-2012/', 1)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- IMAGES — Blasieholmstorg (sample full set)
-- ─────────────────────────────────────────────
INSERT INTO images (work_id, url, alt, sort_order)
SELECT w.id, img.url, img.alt, img.ord
FROM works w,
(VALUES
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', 'Blasieholmstorg hästar i brons', 1),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', 'Blasieholmstorg detail', 2),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', 'Blasieholmstorg hästar', 3),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', 'Blasieholmstorg natt', 4),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', 'Blasieholmstorg utsikt', 5),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', 'Blasieholmstorg panorama', 6),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-75.jpg', 'Blasieholmstorg detalj', 7),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg', 'Blasieholmstorg sidovy', 8),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg', 'Blasieholmstorg nära', 9),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-02.jpg', 'Blasieholmstorg fontän', 10),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg', 'Blasieholmstorg vinterbild', 11),
  ('https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg', 'Blasieholmstorg sommarbild', 12),
  ('https://sivertlindblom.se/wp-content/uploads/2018/07/H%C3%A4st-p%C3%A5-Blasieholmen.jpg',       'Häst på Blasieholmen', 13)
) AS img(url, alt, ord)
WHERE w.slug = 'blasieholmstorg-1989'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- TEXTS
-- ─────────────────────────────────────────────
INSERT INTO texts (slug, title, author, text_type, publication, year, language, source_url) VALUES
  ('peter-cornell-2012',           'Text till katalog, Akvareller m.m.',                     'Peter Cornell',            'essay',        'Katalog Konstakademien',            2012, 'sv', 'https://sivertlindblom.se/texter/andras-texter/peter-cornell-text-till-katalog-akvareller-m-m-2012/'),
  ('jan-oqvist-2012',              'Text till katalog, Akvareller m.m.',                     'Jan Öqvist',               'essay',        'Katalog Konstakademien',            2012, 'sv', 'https://sivertlindblom.se/texter/andras-texter/jan-oqvist-text-till-katalog-akvareller-m-m-2012/'),
  ('catharina-gabrielsson-2012',   'Text till katalog, Akvareller',                          'Catharina Gabrielsson',    'essay',        'Katalog Konstakademien',            2012, 'sv', 'https://sivertlindblom.se/texter/andras-texter/catharina-gabrielsson-text-till-katalog-akvareller-2012/'),
  ('daniel-birnbaum-1993',         'Förord till katalog, Skulptur, Lunds Konsthall',         'Daniel Birnbaum',          'preface',      'Katalog Lunds Konsthall',           1993, 'sv', 'https://sivertlindblom.se/texter/andras-texter/daniel-birnbaum-forord-till-katalog-skulptur-lunds-konsthall-1993/'),
  ('stefan-alenius-1993',          'Text, Skulptur Arkitektur, Skissernas Museum',           'Stefan Alenius',           'essay',        'Katalog Skissernas Museum',         1993, 'sv', 'https://sivertlindblom.se/texter/andras-texter/stefan-alenius-text-till-skulptur-arkitektur-skissernas-museum-1993/'),
  ('cecilia-nelson-1993',          'Förord till katalog Skulptur, Lunds Konsthall',          'Cecilia Nelson',           'preface',      'Katalog Lunds Konsthall',           1993, 'sv', 'https://sivertlindblom.se/texter/andras-texter/cecilia-nelson-forord-till-katalog-skulptur-lunds-konsthall-1993/'),
  ('stig-larsson-1993',            'Text till katalog Skulptur, Lunds Konsthall',            'Stig Larsson',             'essay',        'Katalog Lunds Konsthall',           1993, 'sv', 'https://sivertlindblom.se/texter/andras-texter/stig-larsson-text-till-katalog-skulptur-lunds-konsthall-1993/'),
  ('jean-christophe-ammann-1977',  'Katalogtext, Live Show II, Kunstmuseum Luzern',          'Jean-Christophe Ammann',   'essay',        'Katalog Kunstmuseum Luzern',        1977, 'de', 'https://sivertlindblom.se/texter/andras-texter/jean-christophe-ammann-katalogtext-till-live-show-ii-kunstmuseum-luzern-1977/'),
  ('beate-sydhoff-1967',           'Samtal med Sivert Lindblom',                             'Beate Sydhoff',            'interview',    'Konstrevy nr 2',                    1967, 'sv', 'https://sivertlindblom.se/texter/andras-texter/samtal-med-sivert-lindblom-beate-sydhoff-konstrevy-nr-2-1967/'),
  ('ulf-linde-gimpel-1971',        'Text till utställning, Galerie Gimpel',                  'Ulf Linde',                'essay',        'Galerie Gimpel',                    1971, 'en', 'https://sivertlindblom.se/texter/andras-texter/ulf-linde-text-to-exhibition-at-gimpel-hanover-zurich-1971/'),
  ('leon-rappaport-1963',          'Förord till utställning, Galerie Buren',                 'Leon Rappaport',           'preface',      'Galerie Buren',                     1963, 'sv', 'https://sivertlindblom.se/texter/andras-texter/forord-av-leon-rappaport-till-utstallningen-pa-galerie-buren-1963/'),
  ('stig-larsson-asbaek-1981',     'Om Sivert Lindblom, Galeri Åsbaek, Köpenhamn',           'Stig Larsson',             'essay',        'Galeri Åsbaek',                     1981, 'sv', 'https://sivertlindblom.se/texter/andras-texter/stig-larsson-om-sivert-lindblom-galeri-asbaek-kopenhamn-1981/'),
  ('jan-hafstrom-1976',            'Om Live Show, Moderna Museet',                           'Jan Håfström',             'review',       'Moderna Museet',                    1976, 'sv', 'https://sivertlindblom.se/texter/andras-texter/jan-hafstrom-om-live-show-moderna-museet-1976/'),
  ('live-show-1974-own',           'Katalogtext, Live Show, Moderna Museet',                 'Sivert Lindblom',          'own_writing',  'Moderna Museet',                    1974, 'sv', 'https://sivertlindblom.se/biografi/egna-texter/sivert-lindblom-katalogtext-till-live-show-moderna-museet-1974/'),
  ('gemensamma-rum-1998',          'Citat ur Gemensamma rum',                                'Peter Cornell & Sivert Lindblom', 'own_writing', 'Gemensamma rum',           1998, 'sv', 'https://sivertlindblom.se/biografi/egna-texter/citat-ur-%e2%98%85-gemensamma-rum-av-peter-cornell-och-sivert-lindblom-1998/'),
  ('bra-konst-1986',               'Bra konst i bra arkitektur',                             'Sivert Lindblom',          'own_writing',  'KRO Distrikt 17',                   1986, 'sv', 'https://sivertlindblom.se/biografi/egna-texter/bra-konst-i-bra-arkitektur-symposium-kro-distrikt-17-och-sar-msa-1986/'),
  ('ingela-lind-2012',             'Om Sivert Lindblom, Kungl. Konstakademien',              'Ingela Lind',              'review',       'Dagens Nyheter',                    2012, 'sv', 'https://sivertlindblom.se/biografi/recensioner/ingela-lind-dn-1-november-om-sivert-lindblom-kungl-konstakademien-2012/'),
  ('recension-lunds-konsthall-1993', 'Skissernas Museum / Lunds Konsthall',                 'Janne Malmros',            'review',       'Skånska Dagbladet',                 1993, 'sv', 'https://sivertlindblom.se/skanska-dagbladet-5-02-93-janne-malmros-skissernas-museum-lunds-konsthall/'),
  ('recension-blasieholmstorg-dn', 'Blasieholms torg',                                      'Rebecka Tarschys',         'review',       'Dagens Nyheter',                    1989, 'sv', 'https://sivertlindblom.se/dn-29-09-89-rebecka-tarschys-blasieholms-torg/'),
  ('arkitektur-intervju-1983',     'Intervju med Sivert Lindblom',                           'Red.',                     'interview',    'Arkitektur nr 5',                   1983, 'sv', 'https://sivertlindblom.se/texter/andras-texter/intervju-med-sivert-lindblom-arkitektur-nr-5-1983/'),
  ('a-conversation-english-1967',  'A Conversation with Sivert Lindblom',                   'Beate Sydhoff',            'translated',   'Konstrevy nr 2',                    1967, 'en', 'https://sivertlindblom.se/texter/andras-texter/a-conversation-with-sivert-lindblom-by-beate-sydhoff-english-konstrevy-nr-2-1967/'),
  ('conversazione-italiano-1967',  'Conversazione con Sivert Lindblom',                     'Beate Sydhoff',            'translated',   'Konstrevy nr 2',                    1967, 'it', 'https://sivertlindblom.se/texter/andras-texter/conversazione-con-sivert-lindblom-italiano-by-beate-sydhoff-konstrevy-nr-2-1967/'),
  ('preface-ccs-paris-1980',       'Préface pour la exhibition à Centre Culturel Suédois',  'Lars Bergquist',           'translated',   'Centre Culturel Suédois',           1980, 'fr', 'https://sivertlindblom.se/texter/andras-texter/preface-pour-la-exhibition-a-centre-culturel-suedois-lars-berquist-1980/')
ON CONFLICT (slug) DO NOTHING;
