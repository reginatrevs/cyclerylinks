import type { Settings } from '@/lib/types'

export function ContactActions({ settings }: { settings: Settings }) {
  const items: { key: string; href: string; label: string; icon: string; primary?: boolean }[] = []
  if (settings.phone) items.push({ key: 'call', href: `tel:${settings.phone.replace(/[^+\d]/g, '')}`, label: `Call ${settings.shop_name}`, icon: '📞', primary: true })
  if (settings.google_review_url) items.push({ key: 'google_review', href: settings.google_review_url, label: 'Leave a Google review', icon: '★' })

  if (items.length === 0) return null
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map(it => (
        <a
          key={it.key}
          href={it.href}
          data-track={it.key}
          target={it.href.startsWith('http') ? '_blank' : undefined}
          rel={it.href.startsWith('http') ? 'noopener' : undefined}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
            it.primary
              ? 'border-transparent bg-accent text-accent-ink'
              : 'border-line bg-surface text-ink hover:border-accent/40'
          }`}
        >
          <span aria-hidden className={it.primary ? '' : 'text-accent'}>{it.icon}</span>
          {it.label}
        </a>
      ))}
    </div>
  )
}
