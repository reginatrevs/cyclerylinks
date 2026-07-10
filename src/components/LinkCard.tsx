import Image from 'next/image'
import type { Link } from '@/lib/types'

export function LinkCard({ link }: { link: Link }) {
  const hasImage = Boolean(link.image_url)
  return (
    <a
      href={`/go/${link.id}`}
      rel="noopener"
      className="group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 pr-5 text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md active:translate-y-0"
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background text-2xl">
        {hasImage ? (
          <Image
            src={link.image_url}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : link.icon ? (
          <span aria-hidden>{link.icon}</span>
        ) : (
          <span aria-hidden className="text-accent">→</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-semibold leading-tight">{link.title}</div>
        {link.subtitle && (
          <div className="mt-0.5 truncate text-sm text-ink-soft">{link.subtitle}</div>
        )}
      </div>
      <span
        aria-hidden
        className="text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
      >
        ↗
      </span>
    </a>
  )
}
