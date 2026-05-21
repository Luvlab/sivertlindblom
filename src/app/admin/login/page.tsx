import type { Metadata } from 'next'
import LoginSlideshow from '@/components/admin/LoginSlideshow'

export const metadata: Metadata = { title: 'Admin Login | Sivert Lindblom CMS' }

export default function LoginPage() {
  return <LoginSlideshow />
}
