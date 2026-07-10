import type { Link } from '@/lib/types'

const SOURCE_LABELS: Record<string, string> = {
  link: 'Link cards',
  call: 'Call button',
  directions: 'Directions',
  google_review: 'Google review',
  facebook: 'Facebook',
  instagram: 'Instagram',
  google_business: 'Google Business',
  strava: 'Strava',
  email: 'Email',
}

export function Analytics({
  totalClicks,
  sourceCounts,
  linkCounts,
  links,
}: {
  totalClicks: number
  sourceCounts: Map<string, number>
  linkCounts: Map<string, number>
  links: Link[]
}) {
  const topSources = Array.from(sourceCounts.entries()).sort((a, b) => b[1] - a[1])
  const topLinks = links
    .map(l => ({ link: l, count: linkCounts.get(l.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold">Last 30 days</h2>
        <span className="font-display text-2xl font-bold text-ink">{totalClicks.toLocaleString()}</span>
      </div>
      <p className="mt-0.5 text-xs text-ink-soft">Total tracked clicks</p>

      {topSources.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">By source</div>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {topSources.map(([src, n]) => (
              <li key={src} className="rounded-xl border border-line bg-background px-3 py-2">
                <div className="text-xs text-ink-soft">{SOURCE_LABELS[src] ?? src}</div>
                <div className="font-display text-lg font-semibold">{n}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {topLinks.some(t => t.count > 0) && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Top links</div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {topLinks.map(t => (
              <li key={t.link.id} className="flex items-center justify-between rounded-xl border border-line bg-background px-3 py-2 text-sm">
                <span className="truncate">{t.link.title}</span>
                <span className="ml-2 font-semibold">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
