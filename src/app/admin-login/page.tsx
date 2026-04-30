import type { Metadata } from 'next'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = { title: 'Admin Login | Sivert Lindblom CMS' }

export default function AdminLoginPage() {
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
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            border: '1px solid var(--color-accent)',
            borderRadius: 2,
            marginBottom: '1.5rem',
            color: 'var(--color-accent)',
            fontSize: 'var(--fs-xl)',
            fontFamily: 'Georgia, serif',
          }}>
            S
          </div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
            CMS Admin
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
            Sivert Lindblom
          </h1>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
            Logga in för att hantera innehållet
          </p>
        </div>

        {/* Form card */}
        <div style={{
          padding: '2.5rem',
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg-surface)',
          borderRadius: 2,
        }}>
          <AdminLoginForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: 'var(--fs-xs)', color: '#444' }}>
          ← <a href="/sv" style={{ color: '#666', textDecoration: 'none' }}>Tillbaka till webbplatsen</a>
        </p>
      </div>
    </div>
  )
}
