import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Akvareller 1975–2012' }

// Watercolor images from sivertlindblom.se
const WATERCOLOR_IMAGES = Array.from({ length: 50 }, (_, i) => {
  const ids = [
    '1445','1428','1447','1507','1504','1443','1446','1508','1502','1501',
    '1500','1499','1498','1497','1496','1495','1494','1493','1492','1491',
    '1490','1489','1488','1487','1486','1485','1484','1483','1482','1481',
    '1480','1479','1478','1477','1476','1475','1474','1473','1472','1471',
    '1470','1469','1468','1467','1466','1465','1464','1463','1462','1461',
  ]
  const nums = [
    '79','80','70','01','04','76','75','02','05','06',
    '07','08','09','10','11','12','13','14','15','16',
    '17','18','19','20','21','22','23','24','25','26',
    '27','28','29','30','31','32','33','34','35','36',
    '37','38','39','40','41','42','43','44','45','46',
  ]
  return {
    url: `https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-${nums[i] || String(i+1).padStart(2,'0')}-${ids[i] || '1400'}.jpg`,
    alt: `Akvarell nr ${nums[i] || i+1}`,
  }
}).slice(0, 12) // show first 12 as a sample

export default function WatercolorsPage() {
  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href="/portfolio" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Portfolio</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          Akvareller 1975–2012
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '2rem' }}>
          Ca 200 akvarellerade skissartade bilder skapade som ett slags "mental konstruktivism", som visar ett hermetiskt arkitektoniskt landskap. Bilderna formas med en strängt styrd grafisk teknik som resulterar i en fritt tillämpad axonometri.
        </p>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)' }}>
          Femtio verk visades på Konstakademien i Stockholm, 6 oktober – 4 november 2012. Boken <em>Sivert Lindblom Akvareller m.m.</em> (Bullfinch Publishing, 2012) dokumenterar samlingen.
        </p>
      </div>

      <hr className="divider" />

      <div style={{ paddingTop: '2rem' }}>
        <div className="auto-grid-sm page-pad">
          {WATERCOLOR_IMAGES.map((img, i) => (
            <div key={i} className="img-zoom" style={{ aspectRatio: '3/4', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
