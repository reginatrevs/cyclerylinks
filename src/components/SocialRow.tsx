import type { Settings } from '@/lib/types'

type Entry = { key: string; url: string; label: string; icon: React.ReactNode }

function icon(path: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d={path} />
    </svg>
  )
}

const FACEBOOK_PATH = 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5H16.7V3.6C16.4 3.6 15.4 3.5 14.3 3.5c-2.3 0-3.8 1.4-3.8 3.9v2.5H7.9V13h2.6v8h3z'
const INSTAGRAM_PATH = 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.5.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.4.4 1 .5 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.5 2.2-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1 .4-2.2.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.5-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1-.5-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.5-2.2.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1-.4 2.2-.5C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 5 .3 4.2.6c-.8.3-1.5.7-2.2 1.4C1.3 2.7.9 3.4.6 4.2.3 5 .1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c0 1.3.3 2.1.6 2.9.3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.6.5 2.9.6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3 0 2.1-.3 2.9-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c0-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.2C21.3 1.3 20.6.9 19.8.6c-.8-.3-1.6-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2S15.4 5.8 12 5.8zm0 10.3c-2.3 0-4.1-1.8-4.1-4.1S9.7 7.9 12 7.9s4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1zm7.9-10.6c0 .8-.6 1.5-1.5 1.5s-1.5-.6-1.5-1.5.6-1.5 1.5-1.5 1.5.7 1.5 1.5z'
const GOOGLE_PATH = 'M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8.1zM12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7a6.7 6.7 0 0 1-10.1-3.5H2.1v2.8A11 11 0 0 0 12 23zm-6.3-8.9a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8zM12 5.4c1.7 0 3.2.6 4.4 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.6 2.8A6.6 6.6 0 0 1 12 5.4z'
const STRAVA_PATH = 'M15.4 22l-4-7.8 4-7.8 4 7.8-4 7.8zm-7.7-11.3L4 3l-4 7.7h3l1 2h4l-.3-2z'

export function SocialRow({ settings }: { settings: Settings }) {
  const entries: Entry[] = []
  if (settings.facebook_url) entries.push({ key: 'facebook', url: settings.facebook_url, label: 'Facebook', icon: icon(FACEBOOK_PATH) })
  if (settings.instagram_url) entries.push({ key: 'instagram', url: settings.instagram_url, label: 'Instagram', icon: icon(INSTAGRAM_PATH) })
  if (settings.google_business_url) entries.push({ key: 'google_business', url: settings.google_business_url, label: 'Google', icon: icon(GOOGLE_PATH) })
  if (settings.strava_url) entries.push({ key: 'strava', url: settings.strava_url, label: 'Strava', icon: icon(STRAVA_PATH) })
  if (entries.length === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {entries.map(e => (
        <a
          key={e.key}
          href={e.url}
          target="_blank"
          rel="noopener"
          data-track={e.key}
          aria-label={e.label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
        >
          {e.icon}
        </a>
      ))}
    </div>
  )
}
