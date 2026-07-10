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

async function loadDashboardData() {
  const [settingsRes, linksRes, clicksRes] = await Promise.all([
    supabaseAdmin.from('settings').select('*').eq('id', 1).single(),
    supabaseAdmin.from('links').select('*').order('position', { ascending: true }),
    supabaseAdmin
      .from('clicks')
      .select('link_id, source, clicked_at')
      .gte('clicked_at', new Date(Date.now() - 30 * 86400_000).toISOString()),
  ])
  const settings = settingsRes.data as Settings
  const links = (linksRes.data ?? []) as Link[]
  const clicks = (clicksRes.data ?? []) as { link_id: string | null; source: string; clicked_at: string }[]

  const linkCounts = new Map<string, number>()
  const sourceCounts = new Map<string, number>()
  for (const c of clicks) {
    if (c.link_id) linkCounts.set(c.link_id, (linkCounts.get(c.link_id) ?? 0) + 1)
    sourceCounts.set(c.source, (sourceCounts.get(c.source) ?? 0) + 1)
  }
  return { settings, links, linkCounts, sourceCounts, totalClicks: clicks.length }
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login')
  const { settings, links, linkCounts, sourceCounts, totalClicks } = await loadDashboardData()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <AdminNav shopName={settings.shop_name} />

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
