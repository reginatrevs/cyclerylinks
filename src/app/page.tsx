import type { Metadata } from 'next'
import Image from 'next/image'
import { supabasePublic } from '@/lib/supabase/public'
import type { Link, Settings } from '@/lib/types'
import { OpenBadge } from '@/components/OpenBadge'
import { LinkCard } from '@/components/LinkCard'
import { MapBlock } from '@/components/MapBlock'
import { SocialRow } from '@/components/SocialRow'
import { ContactActions } from '@/components/ContactActions'
import { FeaturedBlock } from '@/components/FeaturedBlock'
import { HoursTable } from '@/components/HoursTable'
import { TrackedClicks } from '@/components/TrackedClicks'

export const revalidate = 30

async function loadPageData(): Promise<{ settings: Settings; links: Link[] }> {
  const [settingsRes, linksRes] = await Promise.all([
    supabasePublic.from('settings').select('*').eq('id', 1).single(),
    supabasePublic
      .from('links')
      .select('*')
      .eq('published', true)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ])
  const settings = (settingsRes.data ?? null) as Settings | null
  const links = (linksRes.data ?? []) as Link[]
  if (!settings) throw new Error('Settings row missing — run the initial migration.')
  return { settings, links }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await loadPageData()
    return {
      title: settings.shop_name,
      description: settings.tagline || `Everything from ${settings.shop_name} in one place.`,
    }
  } catch {
    return { title: 'The Cyclery' }
  }
}

export default async function Home() {
  const { settings, links } = await loadPageData()
  const accentStyle = { ['--accent' as string]: settings.accent_color } as React.CSSProperties

  return (
    <div className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:pt-14" style={accentStyle}>
      <TrackedClicks />
      <main className="flex w-full max-w-md flex-col gap-6">
        <header className="flex flex-col items-center gap-4 text-center">
          {settings.logo_url ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <Image
                src={settings.logo_url}
                alt={`${settings.shop_name} logo`}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-line bg-surface text-3xl shadow-sm">
              <span aria-hidden>🚲</span>
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink">
              {settings.shop_name}
            </h1>
            {settings.tagline && (
              <p className="mt-1 text-sm text-ink-soft">{settings.tagline}</p>
            )}
          </div>
          <OpenBadge hours={settings.hours} timezone={settings.timezone} />
        </header>

        <FeaturedBlock settings={settings} />

        {links.length > 0 ? (
          <section className="flex flex-col gap-2.5">
            {links.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-sm text-ink-soft">
            No links yet. Sign in to <a href="/admin" className="font-semibold text-accent underline-offset-4 hover:underline">/admin</a> and add some.
          </section>
        )}

        <ContactActions settings={settings} />

        <MapBlock settings={settings} />

        <HoursTable hours={settings.hours} />

        <SocialRow settings={settings} />

        <footer className="mt-4 text-center text-xs text-ink-soft">
          <p>© {new Date().getFullYear()} {settings.shop_name}</p>
        </footer>
      </main>
    </div>
  )
}
