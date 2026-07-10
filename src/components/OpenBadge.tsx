import { computeOpenStatus } from '@/lib/hours'
import type { Hours } from '@/lib/types'

export function OpenBadge({ hours, timezone }: { hours: Hours; timezone: string }) {
  const status = computeOpenStatus(hours, timezone)

  if (status.open) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium tracking-tight text-ink shadow-sm">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-open opacity-70" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-open" />
        </span>
        <span>Open now</span>
        <span className="text-ink-soft">· closes {status.closesAt}</span>
      </span>
    )
  }

  if ('unknown' in status) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
        <span className="inline-block h-2 w-2 rounded-full bg-ink-soft/40" />
        Hours not set
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-sm">
      <span className="inline-block h-2 w-2 rounded-full bg-closed" />
      <span>Closed</span>
      <span className="text-ink-soft">
        · opens {status.opensAt} {status.opensDayLabel}
      </span>
    </span>
  )
}
