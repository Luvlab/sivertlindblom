import type { Metadata } from 'next'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = { title: 'Admin Login' }

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '3rem',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-surface)',
        borderRadius: 2,
      }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
            CMS Admin
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            Sivert Lindblom
          </h1>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
            Logga in för att hantera innehållet
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  )
}
