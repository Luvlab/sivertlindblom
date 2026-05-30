import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { execSync } from 'child_process'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  interface Commit { hash: string; date: string; message: string }
  const commits: Commit[] = []

  // Try git log — works in dev and on Vercel build runners
  try {
    const raw = execSync('git log -8 --pretty=format:"%H||%ai||%s"', {
      cwd: process.cwd(),
      timeout: 5000,
    }).toString()
    raw.split('\n').filter(Boolean).forEach(line => {
      const idx1 = line.indexOf('||')
      const idx2 = line.indexOf('||', idx1 + 2)
      if (idx1 > -1 && idx2 > -1) {
        commits.push({
          hash: line.substring(0, idx1).substring(0, 8),
          date: line.substring(idx1 + 2, idx2),
          message: line.substring(idx2 + 2),
        })
      }
    })
  } catch { /* git not available at runtime on Vercel */ }

  // Vercel system env vars (available at runtime)
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) ?? null
  const vercelMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null
  const vercelEnv = process.env.VERCEL_ENV ?? 'development'
  const vercelUrl = process.env.VERCEL_URL ?? null

  // If git log didn't work but Vercel vars are set, build a single entry
  if (commits.length === 0 && vercelSha) {
    commits.push({ hash: vercelSha, date: new Date().toISOString(), message: vercelMsg ?? '—' })
  }

  return NextResponse.json({ commits, vercelEnv, vercelUrl })
}
