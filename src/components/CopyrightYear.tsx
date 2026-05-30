'use client'

/** Renders the current year client-side — avoids Next.js prerender date restrictions. */
export default function CopyrightYear() {
  return <>{new Date().getFullYear()}</>
}
