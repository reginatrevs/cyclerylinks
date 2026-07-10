import type { Settings } from '@/lib/types'

function directionsUrl(s: Settings): string | null {
  if (s.google_maps_directions_url) return s.google_maps_directions_url
  if (s.address) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`
  return null
}

export function MapBlock({ settings }: { settings: Settings }) {
  const dir = directionsUrl(settings)
  const embed = settings.google_maps_embed_url

  if (!embed && !dir && !settings.address) return null

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      {embed ? (
        <div className="relative aspect-[16/10] w-full bg-background">
          <iframe
            src={embed}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            title={`Map to ${settings.shop_name}`}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">
            Come by
          </div>
          {settings.address && (
            <div className="mt-1 text-sm text-ink">{settings.address}</div>
          )}
        </div>
        {dir && (
          <a
            href={dir}
            target="_blank"
            rel="noopener"
            data-track="directions"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span aria-hidden>➤</span>
            Directions
          </a>
        )}
      </div>
    </section>
  )
}
