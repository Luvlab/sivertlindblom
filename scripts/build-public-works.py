#!/usr/bin/env python3
"""
Build complete public-works.json from scraped data.
Run: python3 scripts/build-public-works.py
"""
import json
import re

SUPABASE_BASE = "https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp"
WP_BASE = "https://sivertlindblom.se/wp-content/uploads"

def wp_to_supabase(wp_url: str) -> str:
    """Convert a WP uploads URL to Supabase mirror URL."""
    # Handle both http and https, and media subdomain
    url = wp_url.strip()
    # Normalize protocol and host
    url = re.sub(r'^https?://(media\.)?sivertlindblom\.se/wp-content/uploads/', '', url)
    if url == wp_url.strip():
        # Didn't match pattern — return as-is
        return wp_url
    return f"{SUPABASE_BASE}/{url}"

def img(wp_url: str, alt: str = "") -> dict:
    return {"url": wp_to_supabase(wp_url), "wpUrl": wp_url, "alt": alt}

works = [
    # ── EXTERIORS ────────────────────────────────────────────────────────────
    {
        "slug": "aterinvigning-av-ulriksdalsbron",
        "title": "Återinvigning av Haga Norra gångbro och parkens skulpturutsmyckning 2015",
        "year": "2015",
        "location": "Haga Norra, Solna",
        "category": "exterior",
        "description": "Återinvigning av Haga Norra gångbro och parkens skulpturutsmyckning den 30 maj 2015. Fyra bronssfärer och en stor urna, ursprungligen installerade 1993–1995, hade stulits. Solna stad beställde rekonstruktion med förstärkta säkerhetsåtgärder.",
        "body": "Återinvigningen av Haga Norra gångbro och parkens skulpturutsmyckning ägde rum den 30 maj 2015. Fyra bronssfärer och en stor urna, ursprungligen installerade av konstnären Sivert Lindblom 1993–1995, hade stulits och vandaliserades. Solna stad beställde rekonstruktion och återinstallation med förstärkta säkerhetsåtgärder inklusive betongfyllning, DNA-märkning och varningschips. Ceremonin hölls i samband med 25-årsjubileet för Haga-Brunnsvikens vänner och 20-årsjubileet av Kungliga nationalstadsparken.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/02/{f}.jpg") for f in [
            "SAM_5826","SAM_5829","SAM_5827","SAM_5831","SAM_5843","SAM_5846","SAM_5851","SAM_5852",
            "SAM_5853","SAM_5854","SAM_5857","SAM_5855","SAM_5860","SAM_5856","SAM_5836","SAM_5838",
            "SAM_5839","SAM_5842","IMG_2945","IMG_2943","IMG_2939","IMG_2935","IMG_2936","SAM_5587",
            "SAM_5561","SAM_5389","SAM_5390","SAM_5394","SAM_5392","SAM_5398","SAM_5403","SAM_5452",
            "SAM_5450","SAM_5449","SAM_5447","SAM_5446","SAM_5445","SAM_5456","SAM_5462","SAM_5467",
            "SAM_5469","SAM_5477","SAM_5480","SAM_5482","SAM_5487","SAM_5485","SAM_5492","SAM_5496",
            "SAM_5501","SAM_5504","SAM_5506","SAM_5507","SAM_5508","SAM_5523","SAM_5513","SAM_5520",
            "SAM_5540","SAM_5537","SAM_5525","SAM_5533","SAM_5546","SAM_5548","SAM_5599","SAM_5591",
            "SAM_5604","SAM_5609","SAM_5610","SAM_5612","SAM_5614","SAM_5616","SAM_5619","SAM_5623",
            "SAM_5638","SAM_5640","SAM_5643","SAM_5647","SAM_5649","SAM_5650","SAM_5653","SAM_5657",
            "SAM_5663","SAM_5671","SAM_5689","SAM_5698","SAM_5716","SAM_5717","SAM_5720","SAM_5722",
            "SAM_5742","SAM_5756","SAM_5765","SAM_5767","SAM_5810","SAM_5806","SAM_5773","SAM_5794",
            "SAM_5796","SAM_5776","SAM_5788","SAM_5438","SAM_5440","SAM_5824"
        ]],
    },
    {
        "slug": "baltesspannarparken-goteborg-2013",
        "title": "Bältesspännarparken Göteborg 2013",
        "year": "2013",
        "location": "Göteborg",
        "category": "exterior",
        "description": "Fem gjutjärnsurnor av Sivert Lindblom installerades längs Södra Vägen i samband med parkens renovering där biltrafiken stängdes av.",
        "body": "Bältesspännarparken genomgick renovering, med en stor förändring i form av att biltrafiken på Södra Vägen förbi Trädgårdsföreningens entré stängdes av. Asfalten togs bort och ersattes med gång- och cykelvägar plus grusytor. Fem gjutjärnsurnor av Sivert Lindblom installerades längs Södra Vägen, levererade av Månsarp gjuteri. Konstnären uttrycker oro över att urnorna inte placerades på de piedestaler som är integrerade i designkonceptet.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2019/05/{f}.jpg") for f in [
            "20190506_182925","20190506_182938","20190506_183235","20190506_183142","20190506_182553",
            "20190506_182513","20190508_112533","20190508_113439","20190508_113416","20190508_113042",
            "20190508_113220","20190508_113145","20190508_113201","20190508_113136","20190508_112930",
            "20190508_112752","20190508_112558","20190506_183023","20190506_182811","20190506_182735",
            "20190506_182639","20190506_182629","20190506_182538","20190506_1825210","20190508_113338"
        ]],
    },
    {
        "slug": "roslagens-sparbank-norrtalje-2004",
        "title": "Roslagens Sparbank Norrtälje 2006",
        "year": "2006",
        "location": "Norrtälje",
        "category": "exterior",
        "description": "Bronsfontän och skulptural installation beställd av Roslagens Sparbank. Tre runda stenbaser med regionala motiv: havet, Söderarms fyr och Dürers polyeder med fossiler. Invigd 9 juni 2006.",
        "body": "En bronsfontän och skulptural installation beställd av Roslagens Sparbank för att skapa 'en attraktiv mötesplats i Norrtälje stad.' Fontänen har fallande vatten som skapar rörelse, reflektioner och ljusskiftningar. Tre runda stenbaser innehåller regionala och vetenskapliga motiv: en föreställer det lokala havet och skärgården; en visar Söderarms fyr och Poseidon-postbåten; en tredje kombinerar Albrecht Dürers polyeder med 400 miljoner år gamla stromatoporoider från Gotland. Gjutet i brons med kemiskt oxiderad patina av gjuteriet Ulf Ferrius i Thailand. Invigt 9 juni 2006.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert_Lindblom_fontän_Norrtälje_01-2.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert_Lindblom_Norrtälje_Stromotoporoider_samt_Söderarms_fyr_2006.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert_Lindblom_Stromatoporoider_och_Dürers_polyeder_Norrtälje_2006.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert_Lindblom_Söderarms_fyr.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Roslagens-bank-2-.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Roslagens-bank-1-.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in ["img083","img084","img081","img082","img077","img078"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/20150603_{f}.jpg") for f in [
            "170111","170056","170048","165758","165817","170021","165918","165855","165933","165959",
            "170010","170002","165950","165911","165839"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/07/{f}.jpg") for f in [
            "DSC01143","DSC01141","DSC01145","DSC01146","DSC01149","DSC01103","DSC01099","DSC01098",
            "DSC01097","DSC01021","DSC01007"
          ]],
    },
    {
        "slug": "nobelmonument-new-york-2003",
        "title": "Nobelmonument New York 2003",
        "year": "2003",
        "location": "Theodore Roosevelt Park, New York",
        "category": "exterior",
        "description": "Monument till ära för alla amerikanska Nobelpristagare och Alfred Nobels arv. Invigt 14 oktober 2003 med borgmästare Bloomberg och kronprins Haakon av Norge.",
        "body": "Ett monument till ära för alla amerikanska Nobelpristagare och Alfred Nobels arv. Invigningsceremonin ägde rum den 14 oktober 2003, med deltagare inklusive New York-borgmästare Michael R. Bloomberg, Sveriges vice statsminister Margareta Winberg och kronprins Haakon av Norge. Monumentet är unikt bland New Yorks parker för att det innehåller namn på levande individer, med årliga inskriptioner tillagda för nya amerikanska Nobelpristagare.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2019/03/MonumentFärg2.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2019/03/MonumentFärg1.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/New-York-4.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2019/04/Sivert-NY-arbetet-2.jpeg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2019/04/Monument{n}.jpg") for n in [5,7,10,8,6,9,12,11,17,13,14]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "Nobelmonument-New-York-02","Nobel1","Nobel4","Nobel3","New-York-",
            "Skannad-bild-150240001-Recovered-e1423093885348",
            "New-York-71","New-York-61","New-York-11","New-York-9-","New-York-8","New-York-6",
            "New-York-10","New-York-3","New-York-5","New-York-2","New-York-1","New-York-51",
            "New-York-21","New-York-7","New-York-arb","New-York-41"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2019/03/{f}.jpg") for f in [
            "Monument2delar1","Monument.skiss_.Sidor_","Monument.skiss_.3st","Monument.skiss_.3.sidor-Bak",
            "Monument.Plan_","Nobel3Dskiss300dpi"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2019/04/{f}.jpg") for f in [
            "Monument.0","Monument20","Monument21","Monument24","Monument23","Monument22",
            "Monument0","Sivert-NY-arbetet-3"
          ]],
    },
    {
        "slug": "eskilstuna-rondellen-profilen-2002",
        "title": "Eskilstuna rondellen 'Profilen' 2002",
        "year": "2002",
        "location": "Eskilstuna",
        "category": "exterior",
        "description": "Trafikrondell med konstnärlig gestaltning. Mittenpelaren är uppbyggd av staplade bronsgjutningar av konstnärens profil, med vattenbassäng och historiska motiv. Erhöll Eskilstuna-Kurirens kulturpris 2002.",
        "body": "En trafikrondell med konstnärlig gestaltning som förbinder Eskilstunas centrum med Eskilstunaån. Mittenpelaren är uppbyggd av staplade bronsgjutningar av konstnären Sivert Lindbloms profil. En vattenbassäng omger pelaren med skulpturala element som refererar till stadens historia: den helige Eskil, rök­stapeln från ångbåten Eskilstuna II och Sveriges första lokomotiv Förstlingen (1853). Skapad i samarbete med Björn Norman. Erhöll Eskilstuna-Kurirens kulturpris 2002.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Eskilstuna_41.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Eskilstuna_101.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Eskilstuna_111.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Eskilstuna_91.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert327Ny-kopia.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert323NY-kopia.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert324-vänd.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-arb-{n}1.jpg") for n in [19,8,10,11,13,14,9,7,18,4,12,20,5,15,17,16]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-arb1.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-{n}1.jpg") for n in [9,8,7,6,5,4,2]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-fontäntåg1.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Eskilstuna_{f}.jpg") for f in ["14","131","31","21"]],
    },
    {
        "slug": "gustav-adolfs-torg-malmo-2002",
        "title": "Gustav Adolfs torg Malmö 2002",
        "year": "2002",
        "location": "Malmö",
        "category": "exterior",
        "description": "Fem bronsfonntäner med vattenflöde och flammeffekter som avslutning av Gustav Adolfs torgs omgestaltning. Samarbete med arkitekt Sven-Ingvar Andersson.",
        "body": "Sivert Lindblom skapade fem bronsfonntäner med vattenflöde och flammeffekter på toppen som avslutning av Gustav Adolfs torgs omgestaltning. Projektet involverade samarbete med arkitekt Sven-Ingvar Andersson, trädgårdsmästare Gunnar Ericson och Jörgen Faxe. Fontänerna gjöts av Skånska Klock- & Konstgjuteriet AB i Hammenhög. En mytologisk örn placerad ovanpå en sfär blev särskilt uppmärksammad. Dokumentärfilmen 'Torg i tiden' skildrar torgets historia och renovering.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Gustav-Adolf-Square-Gustav-Adolfs-Torg-Malmo-51531.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/5_fonta¦ener_1_klot1-2.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Klot1-.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/För-själar-är-det-död-att-bli-vatten.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/För-vatten-är-det-död-att-bli-jord.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Men-ur-jord-blir-vatten-och-ur-vatten-själ.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Herakleitos.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Skannad-bild-150310015.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Skannad-bild-150310016.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Skannad-bild-150310017.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Gripenprogram-1.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Gripenprogram-2-.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Gripen-2-.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Gripen-1-.jpg"),
        ],
    },
    {
        "slug": "lindholmsallen-regnbagsgatan-goteborg",
        "title": "Lindholmsallén – Regnbågsgatan Göteborg 2001",
        "year": "2001",
        "location": "Göteborg",
        "category": "exterior",
        "description": "Nästan en kilometer lång allé med markanta 'pyloner' i cortenstål. Materialet refererar till områdets tidigare hamn- och varvsmiljö.",
        "body": "En nästan kilometer lång, 80 meter bred allé med markanta 'pyloner' i cortenstål. Materialvalet refererar till områdets tidigare hamn- och varvsmiljö. Dessa rumsskapande element förstärker alléns perspektiv. Ursprungligen planerades pylonerna att ha integrerad belysning längs deras höjd. Gestaltningsprogrammet slutfördes 9 januari 2001, i samarbete med White Arkitekter/Anders E. Johansson och Ulrik Samuelson. Beställare: Göteborgs stadsbyggnadskontor och Norra Älvstrandens Utveckling AB.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Göteborg-{n}.jpg") for n in [7,2,4,1,3,5]]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2019/05/20190508_{f}.jpg") for f in [
            "095053","093445","094220","094244","094025","094003","093936","093855","094231","093720",
            "093650","093620","093542","094413","094909","094845","094819","094808","101318","094739",
            "094757","094712","094658","094626","094601","094518","094453","094426","100032","095624",
            "095609","095446","095311","095229","095216","101308","095152","095123","095546","101048",
            "100044","101622","101014","100951","100746","100727","100706","100649","100601","101348",
            "100527","100120","101135","093910","093829","093823","093924"
          ]],
    },
    {
        "slug": "potatisakern-bostadsomrade-malmo-2001",
        "title": "Potatisåkern bostadsområde Malmö 2001",
        "year": "2001",
        "location": "Malmö",
        "category": "exterior",
        "description": "17 meter hög bronsskulptur sammansatt av arton identiska segment med konstnärens profil. Landmärke synligt från havet och Ribersborgsstranden.",
        "body": "En 17 meter hög bronsskulptur sammansatt av arton identiska segment med konstnärens profil. Verket är placerat på en halvcirkelformad gräsmatta i Potatisåkernsområdet, som förgård till en halvmåneformad bostadsbyggnad ritad av den amerikanske arkitekten Charles Willard Moore. Skulpturen väger över 6 000 kg och har en bronsbeklädda grund med gyllene stjärnor. Den fungerar som landmärke synligt från havet, Limhamnsfältet och Ribersborgsstranden. Gjuten av Skånska Klock- & Konstgjuteriet AB i Hammenhög.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Utan_titel_Potatisåkern_Malmö-3-390x390.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Utan_titel_Potatisåkern_Malmö-3.jpg"),
        ],
    },
    {
        "slug": "st-erik-grubbens-trappa-kungsholmen-stockholm-2000",
        "title": "S:t Erik, Grubbens trappa – Kungsholmen Stockholm 2000",
        "year": "2000",
        "location": "Kungsholmen, Stockholm",
        "category": "exterior",
        "description": "Gestaltningsprogram för bostadskvarteret på f.d. S:t Eriks akutsjukhus tomt. Bronsprofilhuvuden längs trappan och en kopia av Carl Milles Orfeus-staty.",
        "body": "Konstnären Sivert Lindblom utarbetade ett gestaltningsprogram för bostadsomvandlingen (färdigbyggt 1999, 770 lägenheter) av f.d. S:t Eriks akutsjukhus. Utemiljön har ett solfjäderformat framträdande rum mot Karlbergskanalen. En formell barockterrass leder ner mot en mer naturalistisk strandpark. Skulpturcentrum utgörs av grupperade brons-'Profiler' längs trappan med namnen gjutna i sidorna – austerliga, rostfärgade ansikten som minns de fattiga och sjuka som bodde på platsen under 1800-talet. En kopia av Carl Milles Orfeus-staty kröner en hög piedestal.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/04/Grubbens-Siverts-390x390.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/02/20180227_{f}.jpg") for f in [
            "132738","132852","133132","133634","132845","132830","133247","132934","132923",
            "133414","133441","132917","133325","133143","133003","133020","133046","133056","133310"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/09/20180829_{f}.jpg") for f in [
            "235102","235054","235112","235125","235146"
          ]],
    },
    {
        "slug": "kungl-biblioteket-stockholm-1998",
        "title": "Kungl. Biblioteket Stockholm 1998",
        "year": "1998",
        "location": "Stockholm",
        "category": "exterior",
        "description": "Konstnärlig omgestaltning av förgården till Kungliga biblioteket vid Humlegården, kallad 'Kunskapens förgård'. Fyra bronsurnor, granitkloter med text och omdesignade lyktstolpar.",
        "body": "Den konstnärliga omgestaltningen framför Kungliga biblioteket vid Humlegården fick titeln 'Kunskapens förgård'. Verket innehåller: en låg mur som sittbänk med vy mot solljuset, fyra bronsurnor planterade med blommor och vegetation, omgestaltade lyktstolpar framför byggnaden, två granitklotar med inskriven text flankerande en halvCirculär ram, och specialdesignade flaggstångsbaser.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/07/20150720_{f}.jpg") for f in [
            "1425151","1424301","141110","1421251","141830","141158","142352","141443","141511","141956",
            "141422","1417071","141547","142218","141402","1413461","1413201","1413001","1412351","1412201",
            "1423021","142233","142538","141624"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_{f}.jpg") for f in [
            "120811","120554","120925","120754","120714","120740","120951","120724","120830","120841","120625"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in ["KB3","KB1","KB2"]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2018/09/20180830_194518.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/{f}.jpg") for f in [
            "20170804_143135-1","20170804_143108-1","20170605_171903","20170605_171812","20170605_171834"
          ]],
    },
    {
        "slug": "synagoga-forintelsemonumentet-stockholm-1998",
        "title": "Synagoga – Förintelsemonumentet Stockholm 1998",
        "year": "1998",
        "location": "Stockholm",
        "category": "exterior",
        "description": "Minnesmärke till ära för de som omkom i Förintelsen. Granitstenar med namnen på över 8 000 mördade judar ihågkomna av överlevande anhöriga som flytt till Sverige.",
        "body": "Ett minnesmärke till ära för de som omkom under Förintelsen. Skapat av skulptören Sivert Lindblom och arkitekt Gabriel Herdevall, monumentet innehåller granitstenar med namnen på över 8 000 mördade judar ihågkomna av överlevande anhöriga som flytt till Sverige. Gestaltningen inkorporerar gjutjärnsräcken, bronsplattor, stenblock och ljuselement i Aron Isaaks allé. Monumentet förbinder den judiska gemenskapens plats med den omgivande staden mot Raoul Wallenbergs torg. En bronsmenora och ljuspelare markerar entrén.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "IMG_7122","Sivert-Lindblom-Synagoga-Stockholm-4","Sivert-Lindblom-Synagoga-Stockholm-2",
            "Sivert-Lindblom-Synagoga-Stockholm-1","Sivert-Lindblom-Synagoga-Stockholm-5",
            "Stora_synagogan_i_Stockholm_13","Stora_synagogan_i_Stockholm_11","Stora_synagogan_i_Stockholm_09",
            "20150118_200348","20150129_125541","20150129_125532","20150129_125604","20150129_125505",
            "20150129_125451","20150129_125344","20150129_125440","20150129_125426"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/03/Glöm-oss-inte-Tavla.jpg")],
    },
    {
        "slug": "sergels-torg-sergel-monumentet-stockholm-1998",
        "title": "Sergelmonumentet, Sergels Torg Stockholm 1998",
        "year": "1998",
        "location": "Sergels Torg, Stockholm",
        "category": "exterior",
        "description": "Minnesmärke till ära för skulptören Johan Tobias Sergel (1740–1814), beställt av Stockholms stad. Konstnären erhöll Kungliga Akademiens Sergelpris 2002.",
        "body": "Ett minnesmärke till ära för skulptören Johan Tobias Sergel (1740–1814), beställt av Stockholms stad och Kulturförvaltningen, placerat vid Sveavägens början utanför SEB:s huvudkontor. Konstnären erhöll Kungliga Akademiens Sergelpris 2002 för detta verk.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150118_{f}.jpg") for f in [
            "195306","194838","194907","195004","194943","195152","195055","194928","195108","195033"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150127_{f}.jpg") for f in [
            "150255-e1422396038969","150425","150451","150407","150400","150229","150238","150318","150338","150242"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2018/03/20180316_172048_001.jpg")],
    },
    {
        "slug": "kungstradgarden-norra-delen-1997-98",
        "title": "Kungsträdgården norra delen 1997-98",
        "year": "1997-1998",
        "location": "Stockholm",
        "category": "exterior",
        "description": "Omgestaltning av Kungsträdgårdens norra del med urnor i dubbelrader och fontäner. Samarbete med Stockholms stadsplaneringskontor, arkitekt Aleksander Wolodarski.",
        "body": "Omgestaltning av Kungsträdgårdens norra del, ett av Stockholms mest besökta offentliga rum. Inspirerat av romersk tradition arrangerade Sivert Lindblom urnor med säsongsplanteringar kring ett 'impluvium' (central vattenspegel). Urnorna bildar dubbelrader – en under träd och en annan runt huvudfontänen. Utvalda urnor har vattenstrålar som skapar kaskaderande fontäner över dammen. Projektet involverade samarbete med Stockholms stadsplaneringskontor under arkitekt Aleksander Wolodarski, med start 1988.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Kungsan_2007.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/14016074245_8f22b43f0f_h-2.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Kungsträdgården_20090712.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20150425_{f}.jpg") for f in [
            "133515","133354","133508","133109","133305","133315","133154"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_{f}.jpg") for f in [
            "123419","123358","123431","123547","123507","123517","123710","123526","123633"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150118_{f}.jpg") for f in [
            "200014","195908","195810","195714","195700"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20170912_{f}.jpg") for f in [
            "185633-1","185434-1","185519-1","185604-1","185548-1"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20170815_{f}.jpg") for f in ["143840-1","143902-1"]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2017/11/20170406_184755.jpg")]
          + [img("https://sivertlindblom.se/wp-content/uploads/2017/11/20170427_210435.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/10/20180915_143854.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/10/20180228_{f}.jpg") for f in ["171501","171417","171400","171440"]],
    },
    {
        "slug": "visby-lasarett-urna",
        "title": "Visby Lasarett 'Urna' 1997",
        "year": "1997",
        "location": "Visby, Gotland",
        "category": "exterior",
        "description": "En fristående järnurna placerad på nordsidan av Visby lasarett nära heliplatsen. Gjuten av Månsarps gjuteri under Johan Åkessons ledning.",
        "body": "En fristående järnurna placerad på nordsidan av Visby lasarett nära heliplatsen. Verket är en av flera gjutjärnsurnor installerade runtom i Sverige. Enligt Gotlands museums beskrivning ger urnans 'klassiska form associationer till att vara ett arkitektoniskt element' och integreras sömlöst med sjukhusets arkitektur genom material och skala. Gjuten av Månsarps gjuteri under Johan Åkessons ledning.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/07/Visby-urna-{n}.jpg") for n in [1,2,3,4]],
    },
    {
        "slug": "cavallobrunnen-resecentrum-skovde-1995-96",
        "title": "Cavallobrunnen Resecentrum Skövde 1995-96",
        "year": "1995-1996",
        "location": "Skövde",
        "category": "exterior",
        "description": "Fontän med bronsgestalter som anspelar på vattenlevande varelser, vid järnvägsstationens huvudentré. Namnets häst refererar till Konstantinopels berömda hästar.",
        "body": "En fontän vid järnvägsstationens huvudentré med bronsgestalter som anspelar på vattenlevande varelser. Mittenstycket innehåller uppåtströmmande bronspelar förbundna med reflekterande rostfritt stål. Två förstorrade bronsföremål föreställer en vattendvälande varelse i skalform och en geometrisk bronsfär. Ett naturalistiskt hästhuvud ger installationen dess namn – en referens till Konstantinopels berömda hästar som Lindblom tidigare använt i sitt 1989-verk på Blasieholmstorg.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/20150609_{f}.jpg") for f in [
            "140522","135514","135030","135054","135148","134948","140125","141713","141020","141037",
            "141057","141158-","140802","141515","141552","140916","140836","140902","135751","135726",
            "135705","135820","135808","135933","135922","140641","141353","140651","141344","141332",
            "135956"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Skövde-Skövde_{n}.jpg") for n in [6,1,2,3,4,5]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2012/12/Sivert-skulptör.jpg")],
    },
    {
        "slug": "haga-norra-gangbro-stockholm-1993",
        "title": "Haga Norra gångbro Stockholm 1993",
        "year": "1993",
        "location": "Stockholm / Solna",
        "category": "exterior",
        "description": "Gångbro beställd av Vägverket med skulpturala broelement, bronsurnor och grönpatinerade bronssfärer. Förbinder Hagalundsområdet med Hagaparken.",
        "body": "En gångbro beställd av Vägverket med skulpturala element. Bron innehåller mjuka, vågiga tegelväggar längs fordonstrafikens sida, fyra skulpturala reliefelement vid varje brostöd med kungliga och poetiska referenser, bronsurnor med emblem till ära för kulturellt betydelsefulla personer knutna till Hagaparkens historia, och grönpatinerade bronssfärer vid varje stöd (senare betongfyllda av säkerhetsskäl). Förbinder Hagalundsområdet via Hagavägen i Solna över Uppsalavägen till Hagaparken.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Haga-bro_{f}.jpg") for f in [
            "0118","0008","0011","0112","0013","0025","0014","0114","0020","0009","0115",
            "0024","0022","0019","0021","0018","0004","0015","0003","0116","0023","0007","0117","0001","0113","0005","0012"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in ["Haga003","Haga002","Haga010","Haga001","IMG_2953-kopia"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-{n}1.jpg") for n in [2,3]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/04/Haga-pelare.jpg")],
    },
    {
        "slug": "seb-banken-huvudkontor-rissne-1992",
        "title": "SEB-banken huvudkontor Rissne 1992",
        "year": "1992",
        "location": "Rissne, Stockholm",
        "category": "exterior",
        "description": "Fontän vid entrén till SEB:s huvudkontor som förenar uppfartsvägen med en rondell. Ursprungligt förslag innehöll en kraftfull obelisk i mitten.",
        "body": "Sivert Lindblom gestaltade en fontän vid entrén till SEB-bankens huvudkontor som förenade uppfartsvägen till kontorsbyggnaden med en rondell som markerar nedfarten till ett underjordiskt garage. I Sivert ursprungliga förslag ingick en kraftfullt markerad obelisk i mitten av fontänen. Detta koncept realiserades i slutändan inte. Projektet inkluderar en relaterad modell av den föreslagna obelisken.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-SEB-Stockholm_{f}.jpg") for f in [
            "0013","0006","0012","0016","0015","0017","0011","0010","0009","0004","0008","0007"
          ]],
    },
    {
        "slug": "sveriges-ambassaden-entre-tokyo-1990-91",
        "title": "Sveriges Ambassad Tokyo 1990-91",
        "year": "1990-1991",
        "location": "Tokyo, Japan",
        "category": "exterior",
        "description": "Under en renovering av Sveriges ambassad i Tokyo gestaltade Sivert Lindblom entrépartiet till huvudbyggnaden.",
        "body": "Under en renovering av Sveriges ambassad i Tokyo gestaltade Sivert Lindblom uppfartsvägen och entrépartiet till ambassadens huvudbyggnad.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2016/01/IMG_{f}.jpg") for f in [
            "5759","5746","5760","5758","5751","5744","5749","5750","5754","5757","5756","5753","5752","5755","5743"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/04/Tokyo{f}.jpg") for f in ["019","-entre","-entre-2"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Tokyo{f}.jpg") for f in ["017","018","013"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in ["021","022"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/Tokyo-{f}.jpg") for f in ["4447","5448","1444","2445","2536"]],
    },
    {
        "slug": "kvarteret-svardet-stockholm1989",
        "title": "Kvarteret Svärdet Stockholm 1989",
        "year": "1989",
        "location": "Södermalm, Stockholm",
        "category": "exterior",
        "description": "Centralt placerad vriden obelisk i flerfärgat tegel i bostadskvarteret. Bronssfärer i basen och en kronform av konstnärens profil.",
        "body": "En centralt placerad, vriden obelisk i flerfärgat tegel installerades i de gemensamma gårdsytorna kring bostadshusen, ritade av arkitekt Bengt Lindroos. Basplattformen har bronssfärer runt obelisken, med kronan formad som en silhuett av konstnärens profil i flera riktningar.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Kvarteret_Svärdet_2014b.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/10/20181020_{f}.jpg") for f in [
            "133738","133624","133709","133645","133542","133634"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Svärdet-{n}.jpg") for n in [2,3,1]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in ["108","106","105"]],
    },
    {
        "slug": "blasieholmstorg-stockholm-1989",
        "title": "Blasieholmstorg Stockholm 1989",
        "year": "1989",
        "location": "Blasieholmstorg, Stockholm",
        "category": "exterior",
        "description": "Två grönpatinerade bronshaästar inspirerade av de berömda hästarna ovanpå San Marcos basilika i Venedig, gjutna via avgjutningar från Köpenhamns Glyptotek.",
        "body": "Två grönpatinerade bronshaästar med huvuden riktade mot förbipasserande på Blasieholmstorg. Skulpturerna är kopior inspirerade av de berömda hästarna ovanpå San Marcos basilika i Venedig, som ursprungligen plundrades från Konstantinopels hippodrom under det fjärde korståget (1204). Lindbloms versioner gjöts av Herman Bergmans gjuteri, baserade på gipsavgjutningar från kopior i Köpenhamns Glyptotek. Till skillnad från sina historiska föregångare står dessa hästar fritt bland fotgängare.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-{f}.jpg") for f in [
            "31","48","43","71","33","75","68","01","42","38","57","02","60","Insp-54","55","Insp-3","insp-2","Insp-1"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_{f}.jpg") for f in ["131523","131611","131559","131544","131500","131449","131419"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150118_{f}.jpg") for f in [
            "201132","201101","200731","200755","201310","201040","200945"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_{f}.jpg") for f in [
            "181256","180728","180810","180746","181022","180959","180937","180913","181107"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/05/img{n}.jpg") for n in [
            "307","344","347","349","338","337","348","345","346","340","342"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/03/{f}.jpg") for f in [
            "San-Marco-hästar","Sivert-Lindblom-San-Marco-1-","Sivert-Lindblom-San-Marco-3-",
            "Sivert-Lindblom-San-Marco-2-","Sivert-Lindblom-San-Marco-4-","Gentile_Bellini_detalj","Sivert-Triumf-Paris"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/04/Glyptoteket.jpg")]
          + [img("https://sivertlindblom.se/wp-content/uploads/2018/07/Häst-på-Blasieholmen.jpg")],
    },
    {
        "slug": "kristianstad-tivoliparken-1989",
        "title": "Kristianstad Tivoliparken 1988",
        "year": "1988",
        "location": "Kristianstad",
        "category": "exterior",
        "description": "Skulpturgrupp norr om teatern i Tivoliparken. Utförd i oxiderat gjutjärn av Månsarps gjuteri under Johan Åkessons ledning.",
        "body": "Skulpturgruppen 'Romantisk konstruktion' norr om teatern i Tivoliparken uppnår 'ett integrerat och romantiskt möte med vegetation och promenerade besökare.' Verket är utfört i oxiderat gjutjärn och gjöts av Månsarps gjuteri under ledning av Johan Åkesson.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "52-Romantisk-konstruktion","Kristianstad032"
          ]],
    },
    {
        "slug": "skissernas-museum-fasad-1988",
        "title": "Skissernas museum fasad Lund 1988",
        "year": "1988",
        "location": "Lund",
        "category": "exterior",
        "description": "Ny fasad för museets tillbyggnad. Ljusblå keramikplattor i rosa puts och två gjutna bronsprofiler av Lindblom flankerar det stora fönstret.",
        "body": "Sivert Lindblom gestaltade en ny fasad för Skissernas museums tillbyggnad, skapade ett skulpturalt och distinkt uttryck som markerar byggnadens närvaro i stadsmiljön. Fasaden har rader av ljusblå keramikplattor inbäddade i rosa puts. Två gjutna bronsreliefprofiler av Lindblom flankerar det stora fönstret som sentineler. Beställare: Byggnadsstyrelsen. Projektledare: arkitekterna Leif Lindstrand och Birgitta Olsson.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "Sivert322-kopia","Sivert328-kopia","Sivert325-kopia","Skannad-bild-150260010"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/04/Skissernas-fasad.jpg")],
    },
    {
        "slug": "sas-huvudkontor-frosundavik-stockholm-1988",
        "title": "SAS huvudkontor Frösundavik Stockholm 1988",
        "year": "1988",
        "location": "Frösundavik, Stockholm",
        "category": "exterior",
        "description": "Markliggande bronstrellis-skulptur vid SAS-huvudkontrets entré. Fungerar både som stöd för klätterväxter och som trafikrondell.",
        "body": "Sivert Lindblom installerade en markliggande bronstrellis-skulptur vid SAS-huvudkontrets entré i Frösundavik. Verket fungerar som stödkonstruktion för klätterväxter och tjänar praktiska syften som trafikrondell för besökare.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/04/SAS-{f}.jpg") for f in [
            "3","1","2","8","7-H","6-H","5-H","4"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert188-kopia.jpg")]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/img048.jpg")],
    },
    {
        "slug": "stockholms-universitet-campus-1987-91",
        "title": "Stockholms Universitet Campus 1987-91",
        "year": "1987-1991",
        "location": "Stockholm (Frescati)",
        "category": "exterior",
        "description": "Terrakotta-projekt med pelare, rotunda och tre allegoriska skulpturer på universitetscampus. Samarbete med Marianne Lindblom, beställt av Akademiska Hus.",
        "body": "Sivert Lindblom och Marianne Lindblom fick ett uppdrag från Akademiska Hus att gestalta campusområdet. Deras skulpturella installation 'Terrakotta' består av material inklusive tegel, gjutjärn, brons och vångagranit. Projektet har tre huvuddelar: pelrotunda framför T-banestationens entré, pelerraden mellan Allhuset och Ahreniuslaboratoriet, samt tre skulpturer med allegoriska motiv. Verket förbinder visuellt universitetets olika byggnader och gångstråk.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/04/Sviert-LindblomFrescati-i.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Klot.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Spets.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Profil.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Atlas.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Saturnus-1.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-IMG_0037b.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert566-kopia.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_{f}.jpg") for f in ["0036","0038","0042","0043","0037","0035"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in ["098","103","097","107"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/Campus{f}.jpg") for f in ["Skruv2","Skruv","Tbana","Akilles","Akilles2","Akilles3","Huvud","Ring"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/05/img{n}.jpg") for n in ["295","297","296"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/02/20180114_{f}.jpg") for f in ["142218","142324","142404","142103","142141"]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Göta-Ark-Gbg_0044.jpg")],
    },
    {
        "slug": "uppsala-stadsbibliotek-1986",
        "title": "Uppsala stadsbibliotek 1986",
        "year": "1986",
        "location": "Uppsala",
        "category": "exterior",
        "description": "Vriden monolitfontän vid bibliotekets entré och bronsskål-urna med konsthistoriska motiv i innergården. Konstföremål från 2000 år av mänskligt skapande.",
        "body": "En vriden monolitfontän utanför bibliotekets entré vid slutet av en gågata. Inne i bibliotekets lilla innergård finns en bronsskål-urna på granitsockel vid entrén. Urnan innehåller föremål från konsthistorien: fragment av ett 2000 år gammalt arkaiskt leende gudinneansikte, en fruktbarhetsgudinna som spänner 15 000 år, och en egyptisk skrivare från Gamla riket böjd över hieroglyfer. Dessa exempel på mänskligt konstnärligt skapande leder besökarna in i böckernas och skriftspråkets värld.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "UPP008","Sivert-Lindblom-Uppsala-1986","UPP005","UPP007","UPP001-","UPP006","UPP002-","UPP004-","UPP012","UPP011","UPP003","Göteborg-1985-1","Göteborg-1985"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/{f}.jpg") for f in ["Uppsala-sune-sundahl"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/04/{f}.jpg") for f in ["Uppsala-bibliotek-3","Uppsala-bibliotek","Uppsala-bibliotek-2"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20170415_{f}.jpg") for f in [
            "171512","171348","171320","171306","171257","171251","171227","171152","171114","171107","171104","171100","171012","171001","170947"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/03/20180305_{f}.jpg") for f in [
            "144038","143910","143757","143832","143621","143559","144010","143954","143936","143810","143713","143657","143731","143821","143634","143646","143614"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/07/20180709_{f}.jpg") for f in [
            "174141","174050","174107","174116","174024","174000","173932","173910","173707","173725",
            "173646","173627","173525","173509","173807","173745","173851","173829"
          ]],
    },
    {
        "slug": "lanssjukhuset-vrinnevi-innergard-norrkoping-1986",
        "title": "Länssjukhuset Vrinnevi – innergård Norrköping 1986",
        "year": "1986",
        "location": "Norrköping",
        "category": "exterior",
        "description": "Skulpturgård för regionsjukhuset med träpyloner, järnsfär, svart diabasblock, järntrappa och spaljéer. Del av uppdrag till 64 konstnärer.",
        "body": "Sivert Lindblom gestaltade en innergård för detta regionsjukhus med 'enkelhet och monumentalitet.' Skulpturgården innehåller ett trägtorn krönt med en järnsfär (upprepat två gånger på den stenlagda marken), en triangel av svarta diabasblock med polerade toppar, en järntrappa i sicksackmönster och höga spaljéer längs gårdsväggarna. Projektet var en del av en större satsning där Östergötlands läns landsting engagerade 64 konstnärer för sjukhusets konstnärliga utsmyckning.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/03/Vrinnevi-innergård-.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Norrping.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Norrköping-2.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "DSC01776","DSC01778","DSC01777","img047","img046","img043","img042","img039","img038"
          ]],
    },
    {
        "slug": "pharmacia-entreplats-uppsala-1984-85",
        "title": "Pharmacia Entréplats Uppsala 1984-85",
        "year": "1984-1985",
        "location": "Uppsala",
        "category": "exterior",
        "description": "Entréplats med arkad av tegelobelisker, urnor och fontän med stor bronskonkyljon. Urnorna var bland de första i serien gjutna hos Månsarps Gjuteri.",
        "body": "Sivert Lindblom gestaltade entréplatsen och uppfartsvägen till Pharmacias huvudkontor med 'en arkad av tegelobelisker, urnor och en fontän med ett stort bronsfärgat snäckskal i mitten.' Urnorna var bland de första i en serie gjutna hos Månsarps Gjuteri i gjutjärn, med modeller skapade hos Solna Modellsnickeri efter Lindbloms anvisningar.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "Sivert-Lindblom-Pharmacia-2","Sivert-Lindblom-Pharmacia-_0024","Sivert-Lindblom-Pharmacia-_0018",
            "Sivert-Lindblom-Pharmacia-_0020","Sivert-Lindblom-Pharmacia-_0023","Sivert-Lindblom-Pharmacia-_0021",
            "Sivert-Lindblom-Pharmacia-5","Sivert-Lindblom-Pharmacia-_0022","Sivert-Lindblom-Pharmacia-_0026",
            "Sivert-Lindblom-Pharmacia-1","Sivert-Lindblom-Pharmacia-_0027","img044","img040"
          ]],
    },
    {
        "slug": "sans-titre-centre-culturel-suedois-ccs-paris-1980",
        "title": "'SANS TITRE' Centre Culturel Suédois (CCS) Paris 1980",
        "year": "1980",
        "location": "Paris, Frankrike",
        "category": "exterior",
        "description": "Offentlig konstinstallation vid Svenska kulturcentret i Paris. Utställning med texter av Lars Bergquist och Torsten Ekbom.",
        "body": "Offentligt konstverk visat vid Svenska kulturcentret (Centre Culturel Suédois) i Paris. Utställningen visade skulpturala verk av Sivert Lindblom. Stödjande texter skrevs av Lars Bergquist och Torsten Ekbom.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Paris-{f}.jpg") for f in ["lövsittare","sittare","höst"]]
                + [img("https://sivertlindblom.se/wp-content/uploads/2015/06/Paris-CCS-.jpg")],
    },
    {
        "slug": "lugnet-park-projektforslag-1979-80",
        "title": "Lugnet park projektförslag 1979-80",
        "year": "1979-1980",
        "location": "Lugnet",
        "category": "exterior",
        "description": "Projektförslag för parkgestaltning av Sivert Lindblom.",
        "body": "Projektförslag för parkgestaltning presenterat under slutet av 1970-talet av skulptören Sivert Lindblom.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/img036.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Skissenas-museum_0060.jpg"),
        ],
    },
    {
        "slug": "fersenska-palatset-handelsbanken-stockholm-1975",
        "title": "Fersenska palatset Handelsbanken Stockholm 1975",
        "year": "1975",
        "location": "Stockholm",
        "category": "exterior",
        "description": "Gestaltning av innergården i Fersenska Palatset, renoverat av Svenska Handelsbanken 1970–75. Kalkstensplattor, bronsgestalter och en stor kalkstenssfär.",
        "body": "Sivert Lindblom gestaltade innergården i Fersenska Palatset (även kallat Sörensenska palatset), renoverat av Svenska Handelsbanken (1970–75). Den rektangulära gården har kvadratiska kalkstensplattor med diagonala snitt i vissa ytor för riktningsmarkering. Bronsgestalter baserade på rotationsformer fungerar som motpoler till asymmetriskt placerade entréer. En stor drejad kalkstenssfär utgör skulptural accent. Karaktären beskrivs som 'sträng och ceremoniell, lik gården i ett gammalt vasaslott.' Renoveringsarkitekt: Karl-Erik Hjalmarsson (SHB:s Arkitektkontor).",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Fersenska-skiss-.jpg")]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Fersenska-palatset{f}.jpg") for f in [
            "_0027","_0035","_0033","_0036","_0026","_0031","_0032","_0028",
            "-Fersenska-palatset-10","_0030","-Fersenska-palatset-2","_0023","-Fersenska-palatset-11",
            "_0021","-Fersenska-palatset-3","_0029","-Fersenska-palatset-9","_0034",
            "-1","-Fersenska-palatset-skiss-8","-Fersenska-palatset-skiss-4","-Fersenska-palatset-skiss-5",
            "_0019","-Fersenska-palatset-foto-6"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/04/Fersens-gård.jpg")]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_{f}.jpg") for f in ["131010","131325"]],
    },
    {
        "slug": "garnisonen-stockholm-1972",
        "title": "Garnisonen Stockholm 1972",
        "year": "1972",
        "location": "Östermalm, Stockholm",
        "category": "exterior",
        "description": "Konstnärliga gestaltningar av Karlahuset innergårdar. Stiliserade barockträdgårdar som är gröna året runt. Beskrivs som ett av Sveriges viktigaste offentliga konstverk från 1970-talet.",
        "body": "Sivert Lindblom samarbetade med konstnärerna Heinz Müllner, Hannes Karlewski och Hans Winberg för att skapa konstnärliga utsmyckningar av Karlahuset innergårdar vid Karlavägen 96-112, Östermalm. Projektet innefattade gestaltning av 'stiliserade barockträdgårdar som är gröna året runt.' Verket erkänns som 'ett av Sveriges viktigaste exempel på offentlig konst från 1970-talet.'",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/07/20150424_{f}.jpg") for f in [
            "170303","170240","165759","165640","165139","165153","165233","165304"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Garnisonen-{f}.jpg") for f in [
            "1","4","2","054","3","058","053","057","052","056","049","050"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Extra-{n}.jpg") for n in [3,2]],
    },
    {
        "slug": "lekplats-arby-omradet-eskilstuna-1973",
        "title": "Lekplats Årby-området Eskilstuna 1973",
        "year": "1973",
        "location": "Eskilstuna",
        "category": "exterior",
        "description": "Lekplats och skulpturmiljö i bostadskvarteret Årby. Skulpturer kombinerade med träkonstruktioner för lek och konstnärlig upplevelse.",
        "body": "Lekplatsen och skulpturmiljön i Årbys bostadskvarter representerar en av Sivert Lindbloms tidiga och betydande installationer i en boendemiljö. Projektet kombinerade skulpturer med träkonstruktioner för att skapa en integrerad lek- och konstnärlig miljö. Ytterligare information finns i en intervju med konstnären publicerad i tidskriftenÅrbyanen (nr 1, 2007).",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Skulpturmilj%C3%B6_Sivert_Lindblom_1973_%C3%85rbyparken_Eskilstuna.jpg")]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Årby-{f}.jpg") for f in ["2","1","Huvud-3","Huvud-4"]],
    },
    {
        "slug": "farsta-sjukhus-1967",
        "title": "Farsta sjukhus 1967",
        "year": "1967",
        "location": "Farsta, Stockholm",
        "category": "exterior",
        "description": "Balanserad skulptur 'Kepler' placerad utanför Farsta sjukhus. Inspirerad av Johannes Keplers astronomiska forskning om elliptiska planetbanor.",
        "body": "En balanserad skulptur kallad 'Kepler' placerades utanför Farsta sjukhus 1967. Konstnären hämtade inspiration från Johannes Keplers astronomiska forskning om elliptiska planetbanor och hans fascination för de fem platonska kropparna. Verket fångar illusoriska rörelsemönster 'från ett antal pennspetslika observationspunkter.' Skulpturens nuvarande vistelseort är okänd; den rapporterades överlämnad till Stockholms stads kulturförvaltning i maj 1995 med registreringsnummer 443.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/05/{f}.jpg") for f in [
            "Farsta-sjukhem","20150429_153911","20150429_154827","20150429_154336","20150429_153840",
            "20150429_154325","20150429_155351"
          ]],
    },
    {
        "slug": "vallingby-backe-1966-67",
        "title": "Vällingby backe 1966-67",
        "year": "1966-1967",
        "location": "Vällingby, Stockholm",
        "category": "exterior",
        "description": "Trappa med skulpturer vid Vällingby kyrka, ritad av Peter Celsing. Ett av Sivert Lindbloms tidiga offentliga uppdrag.",
        "body": "En av Sivert Lindbloms tidigaste offentliga konstnärliga uppdrag. Trappan med skulpturer är belägen intill Vällingby kyrka, ritad av Peter Celsing. Lindblom samarbetade med Celsings arkitektkontor som praktikant från 1957 och bidrog till kyrkotornets skulpturala gestaltning. Samarbetet fortsatte till Celsings död 1974. Filmaren Lasse Forsberg dokumenterade Lindbloms arbete under denna period.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Vällingby-backe-{n}.jpg") for n in [3,2,1,4,5]]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Vällingby-{n}.jpg") for n in [409,407,405,400,408,402,406]],
    },
    {
        "slug": "bronsgaller-dagens-nyheter-stockholm-1965",
        "title": "Bronsgaller, Dagens Nyheter, Stockholm, 1965",
        "year": "1965",
        "location": "Stockholm",
        "category": "exterior",
        "description": "Två bronsgrillage monterade på Dagens Nyheters byggnadsfasad på vardera sidan om en sidoentré vid Rålambsvägen 15.",
        "body": "Två bronsgrillage skapade för Dagens Nyheters huvudbyggnad. Grillarna är monterade på byggnadsfasaden på vardera sidan om en sidoentré mot Rålambsvägen 15.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2017/10/20171016_{f}.jpg") for f in [
            "160453","160128","160150","160320","160002","160251","160343","160408","160218","160208","160437","160052","160040"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2017/11/20171108_{f}.jpg") for f in ["165825","165732"]],
    },

    # ── INTERIORS ─────────────────────────────────────────────────────────────
    {
        "slug": "nobel-forum",
        "title": "Nobel Forum, Solna 1993",
        "year": "1993",
        "location": "Solna",
        "category": "interior",
        "description": "Gjutjärnsurna som entredekor till Nobel Forum, Nobelstiftelsens byggnad vid Karolinska Institutet. Urnan byter blommor och utseende efter säsong och evenemang.",
        "body": "Sivert Lindblom skapade en gjutjärnsurna som entredekor för Nobel Forum, Nobelstiftelsens byggnad integrerad i Karolinska Institutets miljö. Den välkomnande urnan 'byter blommor och utseende beroende på säsong och evenemang.' Piedestalsformen har flera varianter placerade runt Stockholm, inklusive vid Blasieholmstorg och Norra begravningsplatsen. Arkitekt Johan Celsing ritade byggnaden på 1980-talet. Interiören har 'en ren och klassisk design med genomgående varmt trä' och hyser primärt grafiska konstverk av svenska konstnärer.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/09/20180917_{f}.jpg") for f in [
            "131124-1","131830-390x390","131105-390x390","131754-390x390","131124-390x390","131901-390x390"
          ]],
    },
    {
        "slug": "berns-ljusgard-1991",
        "title": "Berns ljusgård 1991",
        "year": "1991",
        "location": "Stockholm",
        "category": "interior",
        "description": "Interiör gestaltning av en förbindelsegård på Berns hotell och restaurang. Grönt marmorgolv med vita sicksack-stenintarsier.",
        "body": "Interiörgestaltning av en förbindelsegård på Stockholms Berns Hotell och Restaurang. Konstnären tillämpade 'ett klassiskt formspråk som bevarar arkitekturens strukturer och byggnadselement som skapar rummet.' Det gröna marmorgolvet har vita sicksack-stenintarsier som binder samman atriumväggarna. En dricksfontän omvandlades senare till en blomstervas nära en utgång.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_{f}.jpg") for f in [
            "123028","123016","122854","122905","122928","123040"
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2017/09/Leonard-Cohen.jpg")],
    },
    {
        "slug": "kvarteret-baronen-kalmar-1990",
        "title": "Kvarteret Baronen Kalmar 1990",
        "year": "1990",
        "location": "Kalmar",
        "category": "interior",
        "description": "Två gjutjärnsurnor i entrehallenl för shoppingcentret Baronen, populärt kallat 'Vindfånget'. Gjutna av Månsarp gjuteri.",
        "body": "Sivert Lindblom skapade dubbla gjutjärnsurnor för shoppingcentret Baronens entreé, populärt kallat 'Vindfånget'. Urnorna gjöts vid Månsarp gjuteri under Johan Åkessons ledning.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2016/08/IMG_6471.jpg"),
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/img023.jpg"),
        ],
    },
    {
        "slug": "forbindelsegang-mellan-kulturhuset-och-stadsteaterns-stora-scen-stockholm-1989-92",
        "title": "Förbindelsegång mellan Kulturhuset och Stadsteaterns Stora Scen Stockholm 1989-92",
        "year": "1989-1992",
        "location": "Stockholm",
        "category": "interior",
        "description": "Inre passagegestaltning som förbinder Kulturhuset med Stadsteaterns stora scen i Stockholm.",
        "body": "En inre passage som förbinder Kulturhuset med Stadsteaterns Stora Scen. Projektet representerar en offentlig konstinstallation skapad av Sivert Lindblom under slutet av 1980-talet och början av 1990-talet. Passagen har skulpturala och arkitektoniska ingrepp utformade för att berika det transitiva rummet mellan dessa två betydelsefulla kulturplatser.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/20150127_{f}.jpg") for f in [
            "145223","130616","145919","145914","145910","145906","145901","145856","145852","130820",
            "130648","145243","145538","145648","145635","145616","145600","145549","145439","145400",
            "145416","145426","145409","145228","130705","130755","130808"
          ]],
    },
    {
        "slug": "norra-alvsborgs-lanssjukhus-trollhattan-1989-91",
        "title": "Norra Älvsborgs Länssjukhus, Trollhättan 1989-91",
        "year": "1989-1991",
        "location": "Trollhättan",
        "category": "interior",
        "description": "Trelliskulptur i patinerad brons för klätterväxter på gårdsplatsen utanför sjukhusets entré. Grön paviljongstruktur.",
        "body": "Sivert Lindblom skapade en trelliskulptur i patinerad brons för klätterväxter på gårdsplatsen utanför sjukhusets entré. Verket fungerar som en grön paviljongstruktur utformad för att stödja vegetation.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/02/Nal.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Vrenevi-sjukhus-1986-{n}.jpg") for n in [2,4,7,6,5]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in ["104","102","100"]],
    },
    {
        "slug": "drivved-fragment-ur-tidigare-koreografier-av-och-med-margareta-asberg",
        "title": "Drivved – Fragment ur tidigare koreografier av och med Margaretha Åsberg 1987",
        "year": "1987",
        "location": "Moderna Dansteatern, Stockholm",
        "category": "interior",
        "description": "Scenografi för koreograf Margaretha Åsbergs koreografiska verk. Vitlimmade kvistar, rostfritt stålpendel och 'Spänger'. Premiär 6 november 1987.",
        "body": "Ett koreografiskt verk satt samman av Margaretha Åsberg som kombinerar dekonstruerade fragment från tre tidigare verk: Sand (1974), Life Boat (1976) och Natten innan (1978). Produktionen innehöll skulpturala element skapade av Sivert Lindblom, inklusive vitlimmade kvistar på grå stöd, rostfri stålpendel och långsträckta stycken kallade 'Spänger.' Premiär 6 november 1987, med dansarna Anja Birnbaum och Cecilia Roos.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/06/Margareta-{n}-Sven-Åsberg.jpg") for n in [15,16,12,13]],
    },
    {
        "slug": "nk-ljusgard-1968",
        "title": "NK ljusgård 1986",
        "year": "1986",
        "location": "Stockholm",
        "category": "interior",
        "description": "Ljusgård på kontorsvåningen i NK-varuhuset med kontrastrik geometrisk golvmönster och central skulptur. Ej tillgänglig för allmänheten.",
        "body": "En ljusgård skapades på kontorsvåningen i toppen av det renoverade NK-varuhuset. Rummet har 'ett kontrastrikt geometriskt mönstrat golv' med en central skulptur. Platsen är inte tillgänglig för allmänheten.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-NK-ljusgård{f}.jpg") for f in [
            "_0095-390x390","-046-390x390","-036-390x390","_0099-390x390","_0094-390x390","_0093-390x390","-035-390x390"
          ]],
    },
    {
        "slug": "goteborgs-universitetsbibliotek-1985",
        "title": "Göteborgs Universitetsbibliotek 1985",
        "year": "1985",
        "location": "Göteborg",
        "category": "interior",
        "description": "Två skulpturala installationer i universitetsbiblioteket. Trellisskulptur i centrala hallen (numera borttagen) och ett större verk i en korridor.",
        "body": "Projektet innefattade två skulpturala installationer inom universitetsbiblioteket. En trellisskulptur var ursprungligen placerad i bibliotekets centrala hall men har sedan tagits bort. Ett större skulpturalt verk placerades mot en avdelningsvägg i en korridor och fungerar som fokuspunkt som antyder riktningsflöde.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/{f}.jpg") for f in [
            "Sivert-Lindblom-Göteborg-Universitet_0065","Sivert-Lindblom-Göteborg-Universitet_0066",
            "Sivert-Lindblom-Göteborg-Universitet_0064","GBGU019",
            "Sivert-Lindblom-Göteborg-Universitet_0063","GBG014"
          ]],
    },
    {
        "slug": "tetra-pak-lausanne-schweiz-1984-85",
        "title": "Tetra Pak Lausanne Schweiz 1984-85",
        "year": "1984-1985",
        "location": "Lausanne, Schweiz",
        "category": "interior",
        "description": "Entréhall i tre våningar med trellisformer i gitterram, stengolv med vinklat mönster och utomhusvattenkaskad. Samarbete med Marianne Lindblom.",
        "body": "Sivert och Marianne Lindblom skapade konstnärliga installationer för Tetra Paks kontorsentréhall i tre våningar. Designen har tre vertikalt orienterade spoleformer i gitterram som stöder klätterväxter, monterade på natursteinsbaser med geometriska former – cirklar, kvadrater och trianglar – som refererar till företagets förpackningsprodukter. Ölandskalksten och marmor i alternerande lager ger en abstrakt karaktär. Entreégolvet har ett slående vinklat mönster. En utomhusvattentrappa löper nedåt längs en lutande gräsmatta.",
        "images": [
            img("https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Tetra-Pac-Lousanne_0057.jpg"),
        ] + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in ["073","074","075"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Tetra-Pac-Lousanne_{f}.jpg") for f in [
            "0055","0066","0061","0058","0056","0065","0062","0059","0064"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/img{n}.jpg") for n in [
            "094","085","093","089","090","092","095","091","088","086","096","087"
          ]],
    },
    {
        "slug": "riksbyggen-gota-ark-medborgarplatsen-stockholm-1984",
        "title": "Riksbyggen Göta Ark Medborgarplatsen Stockholm 1984",
        "year": "1984",
        "location": "Medborgarplatsen, Stockholm",
        "category": "interior",
        "description": "Interiör konstnärlig gestaltning av bostadshus. Samarbete med Marianne Lindblom. Delar av gestaltningen har gått förlorade vid ägarbyte.",
        "body": "Interiör konstnärlig gestaltning av ett bostadshus vid Medborgarplatsen. Konstnären noterar att 'nya ägare av fastigheten har orsakat att en del av den konstnärliga gestaltningen har försvunnit' och att gården nu har 'en mer sluten karaktär.' Verket skapades i samarbete med Marianne Lindblom.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Göta-Ark-Gbg_{f}.jpg") for f in [
            "0053","0052","0050","0049","0046","0054","0047"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/02/20150206_{f}.jpg") for f in [
            "172956","172918","172756","172719","172624","172602","171752","171844","172910","171918","172643"
          ]],
    },
    {
        "slug": "medelhavsmuseet-stockholm-1982-utstallning-ar-numera-utbytt",
        "title": "Medelhavsmuseet Stockholm 1982",
        "year": "1982",
        "location": "Stockholm",
        "category": "interior",
        "description": "Interiör utformning/utställningsdesign för Medelhavsmuseet i Stockholm. Utställningen är numera utbytt.",
        "body": "Interiör gestaltning och utställningsdesign för Medelhavsmuseet i Stockholm. Utställningen har sedan dess bytts ut. Ytterligare information finns i Form-tidskriftens nummer 1, 1983.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Medelhavsmuseet_{f}.jpg") for f in [
            "0046","0043","0042","0040","0038","0017","0037","0010","0018","0016","0014","0008","0013","0012","0011","0009","0006","0049","0052"
          ]],
    },
    {
        "slug": "vastra-skogen-t-banestation-1975-1985",
        "title": "Västra Skogen T-banestation 1975 + 1985",
        "year": "1975 + 1985",
        "location": "Västra Skogen, Solna, Stockholm",
        "category": "interior",
        "description": "Konstnärlig utsmyckning av Västra Skogen T-banestation med färgade kakelpartier och gigantiska ansiktsprofiler som framträder ur grusvallarna längs spåren.",
        "body": "Sivert Lindblom skapade konstnärlig utsmyckning för denna Stockholms tunnelbanestation inom SL:s utsmyckningsprogram. Installationen innehåller 'färgade kakelpartier placerade mot det råhackade bergkammarets bergväggar.' Kolossala mänskliga ansiktsprofiler framträder ur grusvallarna mellan spåren och antyder 'underjordiska krafter.' Upplagda stenar längs spårbanken skapar en känsla av slumrande underjordisk energi. Natursten representerar 'bakgrund och bas, forntid och evighet, materia och tid.' Konstnärlig utsmyckning: Sivert Lindblom & Marianne Lindblom, arkitekt: Michael Granit SAR.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_{n}.jpg") for n in [
            4957,4954,4953,4948,4896,4899,4885,4889,4903,4964,4797,4942,4945,4793,4939,4931,4921,4923,
            4915,4905,4913,4906,4884,4883,4878,4870,4857,4861,4868,4867,4865,4864,4849,4848,4847,4909,
            4846,4843,4840,4839,4837,4835,4832,4830,4828,4820,4819,4818,4816,4813,4805,4807,4809,4808,
            4804,4791,4790,4787,4784,4783,4779,4778,4772,4762,4771,4768,4765,4891,4770,4825,4776,4780
          ]],
    },
    {
        "slug": "scenografi-falska-fortroenden-av-marivaux-stockholms-stadsteater-1982",
        "title": "Scenografi \"Falska förtroenden\" av Marivaux, Stockholms Stadsteater, 1982",
        "year": "1982",
        "location": "Stockholms Stadsteater",
        "category": "interior",
        "description": "Scenografi till Marivaux pjäs från 1737 i regi av Jonas Cornell på Stockholms Stadsteater.",
        "body": "Scenografi för ett 1700-talsteaterverk av Marivaux (ursprungligen från 1737), i regi av Jonas Cornell på Stockholms stadsteater.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/03/{f}.jpg") for f in [
            "Marivauxprogram-1","Marivauxprogram-3","Marivauxprogram-2","Marivauxprogram-4",
            "Sivert-Lindblom-Marivaux-1-","Sivert-Lindblom-Marivaux-2-","Sivert-Lindblom-Marivaux-3-",
            "Sivert-Lindblom-Marivaux-4-","Marivaux-Recension"
          ]],
    },
    {
        "slug": "celsingarkivet-kornhamnstorg-49-3tr",
        "title": "Celsingarkivet Kornhamnstorg 49, 3tr.",
        "year": "1980",
        "location": "Kornhamnstorg 49, Stockholm",
        "category": "interior",
        "description": "Arkiv bevarat av Sivert Lindblom med ritningar, skisser och modeller från arkitekten Peter Celsings produktion. Celsingstiftelsen grundad 1985.",
        "body": "Arkivet grundades för att bevara material från Sivert Lindbloms omfattande samarbete med arkitekt Peter Celsing. Det innehåller 'ritningar, skisser och modeller plus hundratals arkitektoniska detaljer från Peter Celsings omfattande produktion.' Celsingstiftelsen grundades 1985 för att stödja forskning och utbildning i svensk arkitektur och bildkonst. Arkivet är tillgängligt för studenter, forskare och allmänhet efter överenskommelse med curator Johan Örn.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/03/Celsingarkivet-{n}.jpg") for n in [1,2,3,4]]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/05/Celsing-{n}.jpg") for n in range(1,13)],
    },
    {
        "slug": "motala-folkets-hus-motala-i-samarbete-med-ulrik-samuelson-1978",
        "title": "Motala Folkets Hus, Motala 1978",
        "year": "1978",
        "location": "Motala",
        "category": "interior",
        "description": "Tegelvägginstallationer i Motala Folkets Hus, i samarbete med Ulrik Samuelson.",
        "body": "Interiörgestaltning med tegelvägginstallationer ('Tegelväggar i Motala Folkets Hus') i samarbete med Ulrik Samuelson.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/02/Motala-{n}.jpg") for n in [1,2]],
    },
    {
        "slug": "sand-10-rorelsedikter-med-koreograf-margareta-asberg-1974",
        "title": "Sand – 10 rörelsedikter av och med koreograf Margaretha Åsberg 1974",
        "year": "1974",
        "location": "Fylkingen, Stockholm",
        "category": "interior",
        "description": "Scenografi till Margaretha Åsbergs första självständiga produktion. Tio rörelsedikter inspirerade av 1973 års militärkupp i Chile. Sveriges första moderna 'Performance' i nutidsdansen.",
        "body": "Sivert Lindblom skapade scenografin till koreografen Margaretha Åsbergs första självständiga produktion efter Kungliga Operan. Verket bestod av tio rörelsedikter inspirerade av 1973 års chilenska militärkupp och dess efterverkningar, med särskild referens till våldet mot Allendes anhängare och politiska fångars dödar inklusive musikern Víctor Jara. Produktionen betraktas som Sveriges första moderna 'Performance' inom nutidsdansen. Uruppfört på Fylkingen, Östgötagatan 33, Stockholm.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/07/10-r%C3%B6relsedikter-x-4.jpg")]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2018/06/Margareta-{n}-Lutfi-Özkök.jpg") for n in [2,8,4,3,5,9,10,11,6,7]]
                + [img("https://sivertlindblom.se/wp-content/uploads/2018/06/Margareta-14-André-Lafolie.jpg")],
    },
    {
        "slug": "sveriges-riksbank-stockholm-1973",
        "title": "Sveriges Riksbank Stockholm 1973",
        "year": "1973",
        "location": "Stockholm",
        "category": "interior",
        "description": "Rekreationsutrymme på bankens tak med dragspelsliknande arkitektur. Bastu, simbassäng och flexibla ytor. Samarbete med Ulrik Samuelson.",
        "body": "Ett rekreationsutrymme gestaltat på bankens tak med dragspelsliknande arkitektur som skapar ett växthusliknande rum. Utrymmet rymmer personalpersonalens rekreation med bastu, simbassäng och flexibla ytor för badminton, träning, informella sammankomster och mindre möten. Gestaltningen skapades i samarbete med Ulrik Samuelson.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Rksbanken_{f}.jpg") for f in [
            "0086","0082","0077","0089","0081","0027","0085","0084","0030","0078","0076","0080","0034","0087","0031","0079","0083","0032","0028","0088","0029"
          ]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Riksbanken{f}.jpg") for f in ["-011","-014","_0026"]]
          + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/05/img{n}.jpg") for n in ["303","302","301","300","299"]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/04/Riksbanken-sv-.jpg")],
    },
    {
        "slug": "takmalning-norrlands-nationshus-uppsala-i-samarbete-med-ulrik-samuelson-1972",
        "title": "Takmålning 1972, Norrlands Nationshus, Uppsala",
        "year": "1972",
        "location": "Uppsala",
        "category": "interior",
        "description": "Stor takmålning av målade glasrutor i matsalen och stora mötesrummet. Marmoringsteknik under ledning av Alvar Björkstad. Samarbete med Ulrik Samuelson.",
        "body": "En stor takmålning bestående av målade glasrutor installerades ovanför den kombinerade matsalen och stora mötesrummet. Målnings- och marmoreringsteknik övervakades och instruerades av marmoreringsmästaren Alvar Björkstad, beskriven som 'den störste marmörmästare vi haft i modern tid i detta land.' Verket skapades i samarbete med Ulrik Samuelson.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2018/05/Glastak{n}.jpg") for n in [
            2568,2567,2566,2565,2572,2576,2575,2571,2570,2569
          ]],
    },
    {
        "slug": "stadsteatern-stockholm-1970",
        "title": "Stadsteatern Stockholm 1970",
        "year": "1970",
        "location": "Stockholm",
        "category": "interior",
        "description": "Scenografiarbete för Stockholms Stadsteater, bl.a. för 'Coriolanus'.",
        "body": "Scenografiska verk skapade för Stockholms Stadsteater, bland annat för 'Coriolanus' och andra teaterproduktioner.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/Coriolanus{n}.jpg") for n in [547,550,551,552,553,2556,2559]]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/imgSV{n}.jpg") for n in [423,424]]
                + [img(f"https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Stadsteatern-Stockholm-{n}.jpg") for n in [1,3]],
    },
    {
        "slug": "vasterhaninge-bibliotek-haninge-kulturhus-1970",
        "title": "Västerhaninge bibliotek – Haninge kulturhus 1970",
        "year": "1970",
        "location": "Haninge",
        "category": "interior",
        "description": "Två blänkande rostfria stålskulpturer ursprungligen för Västerhaninge bibliotek 1970, nu vid Haninge kulturhus övre entré sedan 2002.",
        "body": "Två blänkande skulpturer i rostfritt stål ursprungligen beställda för Västerhaninge bibliotek 1970, nu placerade vid Haninge kulturhus övre entré sedan 2002. Konstnären beskriver skapandet av 'aktiv tomhet – utrymmen som väntar på människor.' Skulpturerna fungerar som en portal eller vaktposter. Varje skulptur har omvända prismaformer som speglar rörelse och ljusskiftningar. Verken visades först vid Ars Baltica-utställningen i Visby 1970.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/02/SAM_{n}.jpg") for n in [
            5122,5162,5135,5136,5130,5124,5142,5129,5125,5139,5127,5144,5132,5141,5158,5163,5164,5167,5128
          ]]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur042-kopia.jpg")]
          + [img("https://sivertlindblom.se/wp-content/uploads/2015/01/Extra-1.jpg")],
    },
    {
        "slug": "tegelvagg-gustav-adolfs-forsamlingshem-boras-med-olle-adrin-1957",
        "title": "Tegelvägg, Gustav Adolfs församlingshem, Borås 1957",
        "year": "1957",
        "location": "Borås",
        "category": "interior",
        "description": "Inre tegelvägg i Gustav Adolfs församlingshem. Ett av Sivert Lindbloms tidiga offentliga verk, i samarbete med Olle Adrin.",
        "body": "En inre tegelvägg skapad som del av ett offentligt uppdrag vid Gustav Adolfs församlingshem i Borås. Verket i samarbete med Olle Adrin representerar Lindbloms tidiga utforskning av arkitektonisk integration med konstnärliga element.",
        "images": [img(f"https://sivertlindblom.se/wp-content/uploads/2015/06/imgSV{n}-.jpg") for n in [
            363,374,365,366,368,357,358,352,351,376,361,362,369,373,384,385,386,350,391
          ]],
    },
    {
        "slug": "krucefix-frikyrka-pa-smogen",
        "title": "Krucifix – frikyrka på Smögen",
        "year": "",
        "location": "Smögen",
        "category": "interior",
        "description": "Tidigt kyrkligt uppdrag med ett krucifix för en frikyrka på Smögen. Krucifixet är försvunnet. Över det nästan kvadratiska korset stiger en guldfärgad duva.",
        "body": "Ett tidigt kyrkligt uppdrag: ett krucifix för en frikyrka på Smögen. Beskrivs som 'ett av Siverts tidigaste konstnärliga uppdrag.' Församlingen skingrades med tiden och krucifixet har försvunnit. 'Över det nästan kvadratiska korset kan man se en guldduva stiga uppåt.' Detta tycks vara det enda bevarade fotografiet som dokumenterar verket.",
        "images": [img("https://sivertlindblom.se/wp-content/uploads/2018/05/Sivert-Kyrka005.jpg")],
    },
]

# Validate all Supabase URLs are correctly formed
for w in works:
    for im in w["images"]:
        assert "supabase.co" in im["url"] or im["url"] == im["wpUrl"], f"URL issue: {im}"

output_path = "/Users/gordoncyrus/Documents/dev/SIVERTLINDBLOM/scripts/public-works.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(works, f, ensure_ascii=False, indent=2)

print(f"Written {len(works)} works to {output_path}")
ext = sum(1 for w in works if w["category"] == "exterior")
intr = sum(1 for w in works if w["category"] == "interior")
total_images = sum(len(w["images"]) for w in works)
print(f"  Exteriors: {ext}, Interiors: {intr}")
print(f"  Total images: {total_images}")
