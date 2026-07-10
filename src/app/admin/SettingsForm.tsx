import type { Settings } from '@/lib/types'
import { updateSettingsAction } from './actions'

function field(name: string, label: string, defaultValue: string, opts?: { placeholder?: string; type?: string; wide?: boolean; multiline?: boolean }) {
  return { name, label, defaultValue, ...opts }
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const generalFields = [
    field('shop_name', 'Shop name', settings.shop_name),
    field('tagline', 'Tagline', settings.tagline, { placeholder: 'Your local bike shop' }),
    field('accent_color', 'Accent color', settings.accent_color, { type: 'color' }),
    field('timezone', 'Timezone', settings.timezone, { placeholder: 'America/Toronto' }),
  ]
  const contactFields = [
    field('phone', 'Phone', settings.phone, { placeholder: '+1 613 555 0100' }),
    field('email', 'Email', settings.email, { type: 'email' }),
    field('address', 'Address', settings.address, { wide: true }),
  ]
  const socialFields = [
    field('facebook_url', 'Facebook URL', settings.facebook_url, { wide: true, placeholder: 'https://facebook.com/…' }),
    field('instagram_url', 'Instagram URL', settings.instagram_url, { wide: true, placeholder: 'https://instagram.com/…' }),
    field('google_business_url', 'Google Business URL', settings.google_business_url, { wide: true }),
    field('google_review_url', 'Google review URL', settings.google_review_url, { wide: true, placeholder: 'g.page/…/review' }),
    field('strava_url', 'Strava club URL', settings.strava_url, { wide: true }),
  ]
  const mapFields = [
    field('google_maps_embed_url', 'Google Maps embed URL', settings.google_maps_embed_url, { wide: true, placeholder: 'From Google Maps → Share → Embed a map → src=…' }),
    field('google_maps_directions_url', 'Directions URL (optional)', settings.google_maps_directions_url, { wide: true, placeholder: 'Leave blank to auto-generate from address' }),
  ]

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Shop info</h2>
      <p className="mt-0.5 text-xs text-ink-soft">Anything you leave blank is hidden on the public page.</p>

      <form action={updateSettingsAction} className="mt-4 flex flex-col gap-6">
        <Fieldset title="General" fields={generalFields} />
        <Fieldset title="Contact" fields={contactFields} />
        <Fieldset title="Social" fields={socialFields} />
        <Fieldset title="Map" fields={mapFields} />

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="col-span-full text-xs font-semibold uppercase tracking-wider text-ink-soft">Logo</legend>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink-soft">Replace logo</span>
            <input
              name="logo"
              type="file"
              accept="image/*"
              className="rounded-lg border border-line bg-background px-3 py-2 text-xs outline-none focus:border-accent"
            />
          </label>
          {settings.logo_url && (
            <label className="flex items-center gap-2 text-xs text-ink-soft">
              <input type="checkbox" name="clear_logo" value="1" />
              Remove current logo
            </label>
          )}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Featured block (top of page)</legend>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink-soft">Featured title</span>
            <input
              name="featured_title"
              defaultValue={settings.featured_title}
              className="rounded-lg border border-line bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink-soft">Featured body</span>
            <textarea
              name="featured_body"
              defaultValue={settings.featured_body}
              rows={3}
              className="rounded-lg border border-line bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-soft">Featured image</span>
              <input
                name="featured_image"
                type="file"
                accept="image/*"
                className="rounded-lg border border-line bg-background px-3 py-2 text-xs outline-none focus:border-accent"
              />
            </label>
            {settings.featured_image_url && (
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input type="checkbox" name="clear_featured_image" value="1" />
                Remove current image
              </label>
            )}
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm"
          >
            Save shop info
          </button>
        </div>
      </form>
    </section>
  )
}

function Fieldset({
  title,
  fields,
}: {
  title: string
  fields: {
    name: string
    label: string
    defaultValue: string
    type?: string
    placeholder?: string
    wide?: boolean
    multiline?: boolean
  }[]
}) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="col-span-full text-xs font-semibold uppercase tracking-wider text-ink-soft">{title}</legend>
      {fields.map(f => (
        <label key={f.name} className={`flex flex-col gap-1 text-sm ${f.wide ? 'sm:col-span-2' : ''}`}>
          <span className="text-ink-soft">{f.label}</span>
          {f.multiline ? (
            <textarea
              name={f.name}
              defaultValue={f.defaultValue}
              placeholder={f.placeholder}
              rows={3}
              className="rounded-lg border border-line bg-background px-3 py-2 outline-none focus:border-accent"
            />
          ) : (
            <input
              name={f.name}
              type={f.type ?? 'text'}
              defaultValue={f.defaultValue}
              placeholder={f.placeholder}
              className="rounded-lg border border-line bg-background px-3 py-2 outline-none focus:border-accent"
            />
          )}
        </label>
      ))}
    </fieldset>
  )
}
