import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'

function getLocaleFromRequest(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale
  }

  // 2. Parse Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((part) => part.split(';')[0].trim().toLowerCase().split('-')[0])
    for (const lang of preferred) {
      if (locales.includes(lang as (typeof locales)[number])) {
        return lang
      }
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path already starts with a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect to locale-prefixed path
  const locale = getLocaleFromRequest(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - /admin (admin CMS)
     * - /_next (Next.js internals)
     * - /api (API routes)
     * - static files (favicon, images, etc.)
     */
    '/((?!admin|_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
