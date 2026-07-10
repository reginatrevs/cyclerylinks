import type { DayHours, Hours } from './types'

const DAY_KEYS: (keyof Hours)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const DAY_LABELS: Record<keyof Hours, string> = {
  sun: 'Sun',
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
}
const FULL_LABELS: Record<keyof Hours, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
}

function shopNow(timezone: string): { day: keyof Hours; hh: number; mm: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const weekday = get('weekday').toLowerCase().slice(0, 3) as keyof Hours
  const hh = parseInt(get('hour'), 10)
  const mm = parseInt(get('minute'), 10)
  return { day: weekday, hh, mm }
}

function parseHM(s: string): number {
  const [h, m] = s.split(':').map(n => parseInt(n, 10))
  return h * 60 + m
}

function fmt12(s: string): string {
  const [h, m] = s.split(':').map(n => parseInt(n, 10))
  const period = h >= 12 ? 'pm' : 'am'
  const h12 = ((h + 11) % 12) + 1
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`
}

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string; opensDayLabel: string }
  | { open: false; unknown: true }

export function computeOpenStatus(hours: Hours, timezone: string): OpenStatus {
  const now = shopNow(timezone)
  const nowMin = now.hh * 60 + now.mm
  const today = hours[now.day]

  if (today && !('closed' in today ? today.closed : false) && 'open' in today) {
    const openMin = parseHM(today.open)
    const closeMin = parseHM(today.close)
    if (nowMin >= openMin && nowMin < closeMin) {
      return { open: true, closesAt: fmt12(today.close) }
    }
  }

  const startIdx = DAY_KEYS.indexOf(now.day)
  for (let offset = 0; offset < 7; offset++) {
    const idx = (startIdx + offset) % 7
    const key = DAY_KEYS[idx]
    const dh = hours[key]
    if (dh && !('closed' in dh && dh.closed) && 'open' in dh) {
      if (offset === 0 && parseHM(dh.open) <= nowMin) continue
      return {
        open: false,
        opensAt: fmt12(dh.open),
        opensDayLabel: offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : FULL_LABELS[key],
      }
    }
  }
  return { open: false, unknown: true }
}

export function formatWeeklyHours(hours: Hours): { day: string; label: string }[] {
  const ordered: (keyof Hours)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  return ordered.map(k => {
    const dh: DayHours = hours[k]
    if ('closed' in dh && dh.closed) return { day: DAY_LABELS[k], label: 'Closed' }
    if ('open' in dh) return { day: DAY_LABELS[k], label: `${fmt12(dh.open)} – ${fmt12(dh.close)}` }
    return { day: DAY_LABELS[k], label: '—' }
  })
}
