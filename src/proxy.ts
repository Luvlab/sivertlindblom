import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'

const ADMIN_TOKEN_NAME = 'admin_session'
/** Keep in sync with /api/admin/auth. 30 days, slid forward on each admin page load. */
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30

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

  // --- Always allow login page and API routes through ---
  if (
    pathname === '/admin-login' ||
    pathname.startsWith('/admin-login/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // --- Admin auth guard (only /admin/* routes, NOT /admin-login) ---
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value
    if (token !== 'authenticated') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin-login'
      return NextResponse.redirect(loginUrl)
    }
    // Sliding session: re-issue the cookie on every admin page load so someone
    // who keeps working is never logged out mid-edit.
    const res = NextResponse.next()
    res.cookies.set(ADMIN_TOKEN_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: '/',
    })
    return res
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
