import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login | Sivert Lindblom' }

// Standalone layout — no sidebar
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100dvh' }}>
      {children}
    </div>
  )
}
