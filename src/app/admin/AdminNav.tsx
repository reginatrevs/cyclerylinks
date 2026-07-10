import { logoutAction } from './actions'

export function AdminNav({ shopName }: { shopName: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-soft">Admin</div>
        <h1 className="font-display text-2xl font-bold text-ink">{shopName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-sm text-ink shadow-sm hover:border-accent/40"
        >
          View live ↗
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center rounded-xl border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft shadow-sm hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
