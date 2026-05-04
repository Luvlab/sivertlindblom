/**
 * Extract all data from TypeScript source files and output as JSON.
 * Run: npx tsx scripts/extract-data.ts <table>
 */
import { exhibitions } from '../src/lib/exhibitions-data'
import { SCULPTURE_LOCATIONS } from '../src/lib/sculpture-locations'
import { PUBLIC_WORKS } from '../src/lib/public-works'

const table = process.argv[2]

if (table === 'exhibitions') {
  const rows = exhibitions.map((e, i) => ({
    slug: e.slug,
    title: e.title,
    category: 'exhibition' as const,
    year_start: e.year || null,
    location: e.location || null,
    description: e.description || null,
    source_url: e.url || null,
    published: true,
    sort_order: i * 10,
  }))
  console.log(JSON.stringify(rows))
}

else if (table === 'exhibition-images') {
  const rows: Array<{ work_slug: string; url: string; alt: string; sort_order: number }> = []
  for (const e of exhibitions) {
    for (let i = 0; i < (e.images || []).length; i++) {
      rows.push({ work_slug: e.slug, url: e.images[i], alt: e.title, sort_order: i })
    }
  }
  console.log(JSON.stringify(rows))
}

else if (table === 'public-works') {
  const rows = PUBLIC_WORKS.map((w, i) => ({
    slug: w.slug,
    title: w.title,
    subcategory: w.category === 'exterior' ? 'exterior' : w.category === 'interior' ? 'interior' : null,
    year: parseInt(w.year) || null,
    location: w.location || null,
    description: w.description || null,
    description_sv: w.body || null,
    published: true,
    sort_order: i * 10,
  }))
  console.log(JSON.stringify(rows))
}

else if (table === 'public-work-images') {
  const rows: Array<{ work_slug: string; url: string; alt: string; sort_order: number }> = []
  for (const w of PUBLIC_WORKS) {
    for (let i = 0; i < (w.images || []).length; i++) {
      rows.push({ work_slug: w.slug, url: w.images[i].url, alt: w.images[i].alt || w.title, sort_order: i })
    }
  }
  console.log(JSON.stringify(rows))
}

else if (table === 'map-pins') {
  const rows = SCULPTURE_LOCATIONS.map((loc, i) => ({
    slug: loc.id,
    title: loc.title,
    lat: loc.lat,
    lng: loc.lng,
    city: loc.city,
    country: loc.country,
    year: loc.year || null,
    description: loc.description || null,
    published: true,
    sort_order: i * 10,
  }))
  console.log(JSON.stringify(rows))
}

else {
  console.error('Unknown table:', table)
  process.exit(1)
}
