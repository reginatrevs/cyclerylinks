import Image from 'next/image'
import type { Settings } from '@/lib/types'

export function FeaturedBlock({ settings }: { settings: Settings }) {
  const { featured_title, featured_body, featured_image_url } = settings
  if (!featured_title && !featured_body && !featured_image_url) return null
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      {featured_image_url && (
        <div className="relative aspect-[16/9] w-full bg-background">
          <Image
            src={featured_image_url}
            alt={featured_title || 'Featured'}
            fill
            sizes="(min-width: 640px) 560px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      {(featured_title || featured_body) && (
        <div className="p-4">
          {featured_title && (
            <div className="font-display text-lg font-semibold leading-tight">{featured_title}</div>
          )}
          {featured_body && (
            <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">{featured_body}</p>
          )}
        </div>
      )}
    </section>
  )
}
