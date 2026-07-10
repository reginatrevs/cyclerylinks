import Image from 'next/image'
import type { Link } from '@/lib/types'
import {
  deleteLinkAction,
  moveLinkAction,
  togglePublishedAction,
  updateLinkAction,
} from './actions'

export function LinkRow({
  link,
  clickCount,
  canMoveUp,
  canMoveDown,
}: {
  link: Link
  clickCount: number
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  return (
    <li className="rounded-2xl border border-line bg-background">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface text-xl">
            {link.image_url ? (
              <Image src={link.image_url} alt="" fill sizes="48px" className="object-cover" />
            ) : link.icon ? (
              <span>{link.icon}</span>
            ) : (
              <span className="text-accent">→</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-ink">{link.title}</span>
              {!link.published && (
                <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                  Hidden
                </span>
              )}
            </div>
            <div className="truncate text-xs text-ink-soft">{link.url}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs text-ink-soft">
            <span className="hidden sm:inline">{clickCount} clicks</span>
            <span className="rounded-md bg-surface px-2 py-0.5">{clickCount}</span>
            <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
          </div>
        </summary>

        <div className="flex flex-col gap-3 border-t border-line p-3">
          <div className="flex flex-wrap items-center gap-2">
            <form action={togglePublishedAction}>
              <input type="hidden" name="id" value={link.id} />
              <input type="hidden" name="published" value={link.published ? '0' : '1'} />
              <button
                type="submit"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  link.published
                    ? 'border-line bg-surface text-ink-soft hover:text-ink'
                    : 'border-transparent bg-open text-white'
                }`}
              >
                {link.published ? '👁 Hide' : '✓ Publish'}
              </button>
            </form>

            <form action={moveLinkAction}>
              <input type="hidden" name="id" value={link.id} />
              <input type="hidden" name="direction" value="up" />
              <button
                type="submit"
                disabled={!canMoveUp}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-soft hover:text-ink disabled:opacity-40"
                aria-label="Move up"
              >
                ↑
              </button>
            </form>
            <form action={moveLinkAction}>
              <input type="hidden" name="id" value={link.id} />
              <input type="hidden" name="direction" value="down" />
              <button
                type="submit"
                disabled={!canMoveDown}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-soft hover:text-ink disabled:opacity-40"
                aria-label="Move down"
              >
                ↓
              </button>
            </form>

            <form action={deleteLinkAction} className="ml-auto">
              <input type="hidden" name="id" value={link.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-closed hover:border-closed/40"
              >
                🗑 Delete
              </button>
            </form>
          </div>

          <form action={updateLinkAction} className="grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="id" value={link.id} />
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-ink-soft">Title</span>
              <input
                name="title"
                defaultValue={link.title}
                required
                className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-ink-soft">URL</span>
              <input
                name="url"
                type="url"
                defaultValue={link.url}
                required
                className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-ink-soft">Subtitle</span>
              <input
                name="subtitle"
                defaultValue={link.subtitle}
                className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-soft">Icon</span>
              <input
                name="icon"
                defaultValue={link.icon}
                maxLength={4}
                className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-soft">Replace image</span>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="rounded-lg border border-line bg-surface px-3 py-2 text-xs outline-none focus:border-accent"
              />
            </label>
            {link.image_url && (
              <label className="flex items-center gap-2 text-xs text-ink-soft sm:col-span-2">
                <input type="checkbox" name="clear_image" value="1" />
                Remove current image
              </label>
            )}
            <div className="flex justify-end sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-background"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </details>
    </li>
  )
}
