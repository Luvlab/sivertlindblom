import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

// Cookie name used to persist the user's chosen locale (set by the language switcher)
const LOCALE_COOKIE = 'NEXT_LOCALE'

// Map ISO 3166-1 alpha-2 country codes → locale
const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  // Swedish
  SE: 'sv',
  // German
  DE: 'de',
  AT: 'de',
  CH: 'de',
  LI: 'de',
  // French
  FR: 'fr',
  BE: 'fr',
  LU: 'fr',
  MC: 'fr',
  // Japanese
  JP: 'ja',
  // Chinese
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',
  SG: 'zh',
  // Korean
  KR: 'ko',
  // Spanish
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  BO: 'es',
  PY: 'es',
  UY: 'es',
  GT: 'es',
  CU: 'es',
  DO: 'es',
  HN: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  // Italian
  IT: 'es', // Italian locale not in our set; map to 'es' — adjust if 'it' is added
  // Dutch
  NL: 'nl',
  // Polish
  PL: 'pl',
  // Portuguese
  PT: 'pt',
  BR: 'pt',
  AO: 'pt',
  MZ: 'pt',
  // Russian
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  UA: 'ru',
  // Thai
  TH: 'th',
  // Arabic
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  IQ: 'ar',
  SY: 'ar',
  LB: 'ar',
  JO: 'ar',
  KW: 'ar',
  QA: 'ar',
  BH: 'ar',
  OM: 'ar',
  YE: 'ar',
  LY: 'ar',
  TN: 'ar',
  DZ: 'ar',
  MA: 'ar',
  SD: 'ar',
}

function getLocaleFromCountry(country: string | null | undefined): Locale {
  if (!country) return defaultLocale
  const mapped = COUNTRY_LOCALE_MAP[country.toUpperCase()]
  // Only return if that locale is actually configured in our app
  if (mapped && (locales as readonly string[]).includes(mapped)) return mapped
  return 'en' // fallback for all other countries
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Skip non-page paths ─────────────────────────────────────────────────
  // Pass through: API routes, Next.js internals, static files, admin
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/favicon') ||
    /\.(?:ico|png|jpg|jpeg|svg|webp|gif|mp4|mp3|woff2?|ttf|otf|eot|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // ── Already has a locale prefix → pass through ──────────────────────────
  const firstSegment = pathname.split('/')[1]
  if (firstSegment && (locales as readonly string[]).includes(firstSegment)) {
    return NextResponse.next()
  }

  // ── Determine target locale ─────────────────────────────────────────────
  // 1. Explicit cookie set by language switcher → respect the user's choice
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  let targetLocale: Locale
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    targetLocale = cookieLocale as Locale
  } else {
    // 2. Accept-Language header (browser preference, secondary signal)
    const acceptLang = request.headers.get('accept-language')
    const acceptPrimary = acceptLang?.split(',')[0]?.split('-')[0]?.toLowerCase()
    const acceptMapped = acceptPrimary
      ? (locales as readonly string[]).find(l => l === acceptPrimary)
      : undefined

    // 3. Vercel IP-geolocation header (geographic default)
    const country = request.headers.get('x-vercel-ip-country')
    const geoLocale = getLocaleFromCountry(country)

    // Accept-Language wins over geo when both are present — geo is tertiary fallback
    targetLocale = (acceptMapped as Locale | undefined) ?? geoLocale
  }

  // ── Redirect / → /{locale}[/rest] ──────────────────────────────────────
  const rest = pathname === '/' ? '' : pathname
  const url = request.nextUrl.clone()
  url.pathname = `/${targetLocale}${rest}`

  const response = NextResponse.redirect(url)
  // Persist geo-resolved locale in cookie so subsequent requests don't re-detect
  // (12 months; user language switcher overwrites this)
  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, targetLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
