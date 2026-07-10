import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin/session'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Link, Settings } from '@/lib/types'
import { AdminNav } from './AdminNav'
import { SettingsForm } from './SettingsForm'
import { HoursForm } from './HoursForm'
import { NewLinkForm } from './NewLinkForm'
import { LinkRow } from './LinkRow'
import { Analytics } from './Analytics'

export const dynamic = 'force-dynamic'

type DashboardData = {
  settings: Settings
  links: Link[]
  linkCounts: Map<string, number>
  sourceCounts: Map<string, number>
  totalClicks: number
  loadError: string | null
}

async function loadDashboardData(): Promise<DashboardData> {
  try {
    const [settingsRes, linksRes, clicksRes] = await Promise.all([
      supabaseAdmin.from('settings').select('*').eq('id', 1).maybeSingle(),
      supabaseAdmin.from('links').select('*').order('position', { ascending: true }),
      supabaseAdmin
        .from('clicks')
        .select('link_id, source, clicked_at')
        .gte('clicked_at', new Date(Date.now() - 30 * 86400_000).toISOString()),
    ])
    const errParts = [settingsRes.error, linksRes.error, clicksRes.error].filter(Boolean)
    if (errParts.length > 0) {
      const msg = errParts.map(e => e!.message).join(' | ')
      return emptyDashboard(`Supabase returned an error — ${msg}. Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL on Vercel.`)
    }
    const settings = (settingsRes.data ?? null) as Settings | null
    const links = (linksRes.data ?? []) as Link[]
    const clicks = (clicksRes.data ?? []) as { link_id: string | null; source: string; clicked_at: string }[]

    const linkCounts = new Map<string, number>()
    const sourceCounts = new Map<string, number>()
    for (const c of clicks) {
      if (c.link_id) linkCounts.set(c.link_id, (linkCounts.get(c.link_id) ?? 0) + 1)
      sourceCounts.set(c.source, (sourceCounts.get(c.source) ?? 0) + 1)
    }
    if (!settings) {
      return emptyDashboard('Settings row missing. Run supabase/migrations/0001_initial_schema.sql in your Supabase SQL editor.')
    }
    return { settings, links, linkCounts, sourceCounts, totalClicks: clicks.length, loadError: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return emptyDashboard(`Could not reach Supabase — ${message}. Check env vars on Vercel.`)
  }
}

function emptyDashboard(errorMessage: string): DashboardData {
  return {
    settings: fallbackSettings(),
    links: [],
    linkCounts: new Map(),
    sourceCounts: new Map(),
    totalClicks: 0,
    loadError: errorMessage,
  }
}

function fallbackSettings(): Settings {
  return {
    id: 1,
    shop_name: 'Admin',
    tagline: '',
    logo_url: '',
    address: '',
    phone: '',
    email: '',
    google_maps_embed_url: '',
    google_maps_directions_url: '',
    google_review_url: '',
    facebook_url: '',
    google_business_url: '',
    instagram_url: '',
    strava_url: '',
    accent_color: '#e11d48',
    hours: {
      mon: { closed: true }, tue: { closed: true }, wed: { closed: true },
      thu: { closed: true }, fri: { closed: true }, sat: { closed: true }, sun: { closed: true },
    },
    timezone: 'America/Toronto',
    featured_title: '',
    featured_body: '',
    featured_image_url: '',
    updated_at: new Date(0).toISOString(),
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login')
  const { settings, links, linkCounts, sourceCounts, totalClicks, loadError } = await loadDashboardData()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <AdminNav shopName={settings.shop_name} />

      {loadError && (
        <div className="rounded-2xl border border-closed/40 bg-closed/10 p-4 text-sm text-ink">
          <div className="font-display font-semibold text-closed">Can&rsquo;t load data from Supabase</div>
          <p className="mt-1 text-ink-soft">{loadError}</p>
        </div>
      )}

      <Analytics
        totalClicks={totalClicks}
        sourceCounts={sourceCounts}
        linkCounts={linkCounts}
        links={links}
      />

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Links</h2>
          <span className="text-xs text-ink-soft">{links.length} total · {links.filter(l => l.published).length} live</span>
        </div>
        <NewLinkForm />
        <ul className="mt-4 flex flex-col gap-2">
          {links.map((link, idx) => (
            <LinkRow
              key={link.id}
              link={link}
              clickCount={linkCounts.get(link.id) ?? 0}
              canMoveUp={idx > 0}
              canMoveDown={idx < links.length - 1}
            />
          ))}
        </ul>
      </section>

      <SettingsForm settings={settings} />
      <HoursForm hours={settings.hours} />
    </div>
  )
}
