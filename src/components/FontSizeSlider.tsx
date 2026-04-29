'use client'

import { useEffect, useState } from 'react'

const STEPS = [0.85, 0.90, 0.95, 1.00, 1.10, 1.20, 1.35, 1.50]
const DEFAULT_IDX = 3 // 1.00

export default function FontSizeSlider() {
  const [idx, setIdx] = useState(DEFAULT_IDX)

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('font-scale-idx')
    if (saved !== null) {
      const n = parseInt(saved, 10)
      if (!isNaN(n) && n >= 0 && n < STEPS.length) {
        setIdx(n)
        applyScale(STEPS[n])
      }
    }
  }, [])

  function applyScale(scale: number) {
    document.documentElement.style.setProperty('--font-scale', String(scale))
    document.documentElement.style.setProperty('--_fs', String(scale))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const n = parseInt(e.target.value, 10)
    setIdx(n)
    applyScale(STEPS[n])
    localStorage.setItem('font-scale-idx', String(n))
  }

  const pct = Math.round(STEPS[idx] * 100)

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Textsstorlek"
      title={`Textstorlek: ${pct}%`}
    >
      {/* Small A */}
      <span aria-hidden="true" style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1 }}>A</span>

      <input
        type="range"
        className="font-slider"
        min={0}
        max={STEPS.length - 1}
        step={1}
        value={idx}
        onChange={handleChange}
        aria-label={`Textstorlek ${pct}%`}
        style={{ width: '80px' }}
      />

      {/* Large A */}
      <span aria-hidden="true" style={{ fontSize: '1.1rem', color: 'var(--color-muted)', lineHeight: 1 }}>A</span>

      {/* Live percent label for screen readers */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">{pct}%</span>
    </div>
  )
}
