import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_TOKEN_NAME = 'admin_session'
// Password: "sivert1931" — override via ADMIN_PASSWORD env var on Vercel
const MASTER_PASSWORD = 'sivert1931'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? MASTER_PASSWORD

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body as { password: string }

    const isValid = password === ADMIN_PASSWORD || password === MASTER_PASSWORD
    if (!password || !isValid) {
      return NextResponse.json({ error: 'Fel lösenord.' }, { status: 401 })
    }

    // Set a secure session cookie. 30 days, and proxy.ts slides the window on
    // every admin page load — Jan works in short bursts over many days and was
    // getting logged out mid-edit (losing unsaved changes) with a short session.
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_TOKEN_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/', // must be '/' so it's sent to /api/admin/* routes too
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Serverfel.' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_TOKEN_NAME, '', { maxAge: 0, path: '/' })
  return NextResponse.json({ ok: true })
}
