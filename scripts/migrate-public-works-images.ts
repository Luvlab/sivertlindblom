/**
 * Migration script: replace all broken WordPress image URLs in public_works
 * with the correct Supabase storage URLs from the static public-works.ts file.
 * Also inserts entirely missing static works into the DB.
 *
 * Run: npx tsx scripts/migrate-public-works-images.ts
 */

import { createClient } from '@supabase/supabase-js'
import { PUBLIC_WORKS } from '../src/lib/public-works'

const SUPABASE_URL = 'https://ixlvwwllvpweltntbsou.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0.OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Map: DB slug → static slug (for works whose slugs differ)
const DB_TO_STATIC: Record<string, string> = {
  'blasieholmstorg-1989':         'blasieholmstorg-stockholm-1989',
  'baltesspaennarparken-2013':    'baltesspannarparken-goteborg-2013',
  'frescati-1987':                'stockholms-universitet-campus-1987-91',
  'gustav-adolfs-torg-2002':      'gustav-adolfs-torg-malmo-2002',
  'lindholmsallen-goteborg':      'lindholmsallen-regnbagsgatan-goteborg',
  'potatisackern-2001':           'potatisakern-bostadsomrade-malmo-2001',
  'grubbens-trappor-2000':        'st-erik-grubbens-trappa-kungsholmen-stockholm-2000',
  'kungliga-biblioteket-1998':    'kungl-biblioteket-stockholm-1998',
  'synagogan-1998':               'synagoga-forintelsemonumentet-stockholm-1998',
  'sergels-torg-1998':            'sergels-torg-sergel-monumentet-stockholm-1998',
  'kungstradgarden-1997':         'kungstradgarden-norra-delen-1997-98',
  'visby-lasarett':               'visby-lasarett-urna',
  'skovde-1995':                  'cavallobrunnen-resecentrum-skovde-1995-96',
  'haga-norra-1993':              'haga-norra-gangbro-stockholm-1993',
  'seb-banken-1992':              'seb-banken-huvudkontor-rissne-1992',
  'ambassad-tokyo-1990':          'sveriges-ambassaden-entre-tokyo-1990-91',
  'ringvagen-1989':               'kvarteret-svardet-stockholm1989',
  'kristianstad-1989':            'kristianstad-tivoliparken-1989',
  'skissernas-museum-1988':       'skissernas-museum-fasad-1988',
  'sas-huvudkontor-1988':         'sas-huvudkontor-frosundavik-stockholm-1988',
  'norrkoping-1986':              'lanssjukhuset-vrinnevi-innergard-norrkoping-1986',
  'pharmacia-1984':               'pharmacia-entreplats-uppsala-1984-85',
  'paris-ccs-1980':               'sans-titre-centre-culturel-suedois-ccs-paris-1980',
  'fersenska-palatset-1975':      'fersenska-palatset-handelsbanken-stockholm-1975',
  'garnisonen-1972':              'garnisonen-stockholm-1972',
  'arbyparken-1973':              'lekplats-arby-omradet-eskilstuna-1973',
  'riksbanken-1973':              'sveriges-riksbank-stockholm-1973',
  'vallingby-backe-1966':         'vallingby-backe-1966-67',
  'dagens-nyheter-1965':          'bronsgaller-dagens-nyheter-stockholm-1965',
  'nobel-forum-1993':             'nobel-forum',
  'berns-1991':                   'berns-ljusgard-1991',
  'kalmar-1990':                  'kvarteret-baronen-kalmar-1990',
  'trollhattan-1989':             'norra-alvsborgs-lanssjukhus-trollhattan-1989-91',
  'gu-biblioteket-1985':          'goteborgs-universitetsbibliotek-1985',
  'tetra-pak-1984':               'tetra-pak-lausanne-schweiz-1984-85',
  'medborgarplatsen-1984':        'riksbyggen-gota-ark-medborgarplatsen-stockholm-1984',
  'medelhavsmuseet-1982':         'medelhavsmuseet-stockholm-1982-utstallning-ar-numera-utbytt',
  'vastra-skogen-1975':           'vastra-skogen-t-banestation-1975-1985',
  'stadsteatern-1970':            'stadsteatern-stockholm-1970',
  'haninge-1970':                 'vasterhaninge-bibliotek-haninge-kulturhus-1970',
  'norra-begravningsplatsen':     'norra-begravningsplatsen-solna',
  'norrtälje-stadsbibliotek-2006':'norrtalje-stadsbibliotek',
  'eskilstuna-2002':              'eskilstuna-rondellen-profilen-2002',
  'korsbarsgarden-2010':          'korsbarsgarden-gotland-2010',  // not in public-works static, skip
}

// Build quick lookup: static slug → work data
const staticBySlug = new Map(PUBLIC_WORKS.map(w => [w.slug, w]))

async function main() {
  // 1. Fetch all DB public works
  const { data: dbWorks, error } = await supabase
    .from('public_works')
    .select('id, slug, title, sort_order')
    .order('sort_order')

  if (error || !dbWorks) {
    console.error('Failed to fetch public_works:', error)
    process.exit(1)
  }

  console.log(`Found ${dbWorks.length} works in DB\n`)

  let fixed = 0
  let skipped = 0
  let notFound = 0

  for (const dbWork of dbWorks) {
    const staticSlug = DB_TO_STATIC[dbWork.slug] ?? dbWork.slug
    const staticWork = staticBySlug.get(staticSlug)

    if (!staticWork) {
      console.log(`⚠️  No static match for DB slug "${dbWork.slug}" (tried "${staticSlug}")`)
      notFound++
      continue
    }

    if (staticWork.images.length === 0) {
      console.log(`⏭️  Skipping "${dbWork.slug}" — no images in static data`)
      skipped++
      continue
    }

    // Delete all existing images for this work
    const { error: delErr } = await supabase
      .from('public_work_images')
      .delete()
      .eq('work_id', dbWork.id)

    if (delErr) {
      console.error(`❌ Failed to delete images for "${dbWork.slug}":`, delErr)
      continue
    }

    // Insert fresh images from static data
    const newImages = staticWork.images.map((img, i) => ({
      work_id: dbWork.id,
      url: img.url,
      alt: img.alt || staticWork.title,
      sort_order: i,
    }))

    const { error: insErr } = await supabase
      .from('public_work_images')
      .insert(newImages)

    if (insErr) {
      console.error(`❌ Failed to insert images for "${dbWork.slug}":`, insErr)
      continue
    }

    console.log(`✅ "${dbWork.slug}" — replaced with ${newImages.length} images (from "${staticSlug}")`)
    fixed++
  }

  console.log(`\n--- Phase 1 done: ${fixed} fixed, ${skipped} skipped, ${notFound} no match ---\n`)

  // 2. Insert missing static works into DB
  const dbSlugs = new Set(dbWorks.map(w => w.slug))
  // Also mark mapped static slugs as covered
  for (const staticSlug of Object.values(DB_TO_STATIC)) {
    dbSlugs.add(staticSlug)
  }

  const maxSortOrder = Math.max(...dbWorks.map(w => w.sort_order ?? 0))
  let nextSort = maxSortOrder + 10

  const missing = PUBLIC_WORKS.filter(w => !dbSlugs.has(w.slug))
  console.log(`Found ${missing.length} static works not in DB:\n`)

  for (const sw of missing) {
    console.log(`  + Inserting "${sw.slug}" (${sw.title})`)

    const { data: newWork, error: wErr } = await supabase
      .from('public_works')
      .insert({
        slug: sw.slug,
        title: sw.title,
        year: parseInt(String(sw.year)) || 0,
        subcategory: sw.category === 'interior' ? 'interior' : 'exterior',
        location: sw.location ?? '',
        description: sw.description ?? '',
        description_sv: sw.body ?? '',
        sort_order: nextSort,
        published: true,
      })
      .select('id')
      .single()

    if (wErr || !newWork) {
      console.error(`  ❌ Failed to insert work "${sw.slug}":`, wErr)
      continue
    }

    nextSort += 10

    if (sw.images.length > 0) {
      const imgs = sw.images.map((img, i) => ({
        work_id: newWork.id,
        url: img.url,
        alt: img.alt || sw.title,
        sort_order: i,
      }))
      const { error: imgErr } = await supabase.from('public_work_images').insert(imgs)
      if (imgErr) {
        console.error(`  ⚠️  Images failed for "${sw.slug}":`, imgErr)
      } else {
        console.log(`     → ${imgs.length} images inserted`)
      }
    }
  }

  console.log('\n✅ Migration complete.')
}

main().catch(console.error)
