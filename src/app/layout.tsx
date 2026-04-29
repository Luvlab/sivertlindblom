import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sivert Lindblom',
  description: 'Official website of sculptor Sivert Lindblom.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
