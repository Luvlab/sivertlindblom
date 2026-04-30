import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_TOKEN_NAME = 'admin_session'
// Default password: "sivert1931" — override via ADMIN_PASSWORD env var in production
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'sivert1931'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body as { password: string }

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Fel lösenord.' }, { status: 401 })
    }

    // Set a secure session cookie
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_TOKEN_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/admin',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Serverfel.' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_TOKEN_NAME)
  return NextResponse.json({ ok: true })
}
