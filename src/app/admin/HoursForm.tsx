import type { DayHours, Hours } from '@/lib/types'
import { updateHoursAction } from './actions'

const DAYS: { key: keyof Hours; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
]

function extract(d: DayHours): { closed: boolean; open: string; close: string } {
  if ('closed' in d && d.closed) return { closed: true, open: '10:00', close: '18:00' }
  if ('open' in d) return { closed: false, open: d.open, close: d.close }
  return { closed: true, open: '10:00', close: '18:00' }
}

export function HoursForm({ hours }: { hours: Hours }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Shop hours</h2>
      <p className="mt-0.5 text-xs text-ink-soft">Powers the &ldquo;Open now&rdquo; badge on the public page.</p>
      <form action={updateHoursAction} className="mt-4 flex flex-col gap-2">
        {DAYS.map(d => {
          const cur = extract(hours[d.key])
          return (
            <div key={d.key} className="grid grid-cols-[8rem_1fr_1fr_5rem] items-center gap-2">
              <span className="text-sm font-medium text-ink">{d.label}</span>
              <input
                type="time"
                name={`${d.key}_open`}
                defaultValue={cur.open}
                className="rounded-lg border border-line bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                type="time"
                name={`${d.key}_close`}
                defaultValue={cur.close}
                className="rounded-lg border border-line bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <label className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <input type="checkbox" name={`${d.key}_closed`} value="1" defaultChecked={cur.closed} />
                Closed
              </label>
            </div>
          )
        })}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm"
          >
            Save hours
          </button>
        </div>
      </form>
    </section>
  )
}
