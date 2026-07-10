import { createLinkAction } from './actions'

export function NewLinkForm() {
  return (
    <form action={createLinkAction} className="rounded-2xl border border-dashed border-line bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink-soft">Title</span>
          <input
            name="title"
            required
            placeholder="Shop website"
            className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink-soft">URL</span>
          <input
            name="url"
            type="url"
            required
            placeholder="https://…"
            className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink-soft">Subtitle (optional)</span>
          <input
            name="subtitle"
            placeholder="Bikes, service, gear"
            className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-soft">Icon / emoji (optional)</span>
          <input
            name="icon"
            placeholder="🚲"
            maxLength={4}
            className="rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-soft">Image (optional, ≤5MB)</span>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="rounded-lg border border-line bg-surface px-3 py-2 text-xs outline-none focus:border-accent"
          />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm"
        >
          + Add link
        </button>
      </div>
    </form>
  )
}
