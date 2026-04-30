import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'

const ADMIN_TOKEN_NAME = 'admin_session'

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

  // --- Admin auth guard ---
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value
    if (token !== 'authenticated') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin-login'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // --- Skip API routes, admin-login, and static files ---
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/_next') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // --- Locale routing ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocaleFromRequest(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - /_next (Next.js internals)
     * - static files (favicon, images, etc.)
     */
    '/((?!_next|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
