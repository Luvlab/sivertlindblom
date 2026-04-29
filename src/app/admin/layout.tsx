import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'CMS Admin', template: '%s | Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#0a0a0a', color: 'var(--color-text)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
