import { formatWeeklyHours } from '@/lib/hours'
import type { Hours } from '@/lib/types'

export function HoursTable({ hours }: { hours: Hours }) {
  const rows = formatWeeklyHours(hours)
  return (
    <details className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
        <span className="inline-flex w-full items-center justify-between">
          <span>Shop hours</span>
          <span aria-hidden className="text-ink-soft">▾</span>
        </span>
      </summary>
      <ul className="mt-3 divide-y divide-line text-sm">
        {rows.map(r => (
          <li key={r.day} className="flex items-center justify-between py-1.5">
            <span className="text-ink-soft">{r.day}</span>
            <span className="text-ink">{r.label}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
