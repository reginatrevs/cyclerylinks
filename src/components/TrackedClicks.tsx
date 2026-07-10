'use client'

import { useEffect } from 'react'

export function TrackedClicks() {
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target
      if (!(target instanceof Element)) return
      const el = target.closest('[data-track]') as HTMLElement | null
      if (!el) return
      const source = el.dataset.track
      if (!source) return
      const body = JSON.stringify({ source })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      } else {
        fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {})
      }
    }
    document.addEventListener('click', handler, { capture: true })
    return () => document.removeEventListener('click', handler, { capture: true })
  }, [])
  return null
}
