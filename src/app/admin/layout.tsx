import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMain from '@/components/admin/AdminMain'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'CMS Admin', template: '%s | Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        {/* Fluid base font-size for the admin — all rem-based --fs-* vars scale with it */}
        <style>{`
          html { font-size: clamp(13px, calc(10px + 0.5vw), 16px); }
        `}</style>
      </head>
      <body>
        <div style={{ display: 'flex', minHeight: '100dvh', background: '#0a0a0a', color: 'var(--color-text)' }}>
          <AdminSidebar />
          <AdminMain>{children}</AdminMain>
        </div>
      </body>
    </html>
  )
}
