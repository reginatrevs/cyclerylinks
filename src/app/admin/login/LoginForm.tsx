'use client'

import { useState, useTransition } from 'react'

export function LoginForm({ action }: { action: (formData: FormData) => Promise<{ error?: string }> }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="mt-5 flex flex-col gap-3"
      onSubmit={ev => {
        ev.preventDefault()
        const form = new FormData(ev.currentTarget)
        startTransition(async () => {
          const res = await action(form)
          if (res?.error) setError(res.error)
        })
      }}
    >
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="rounded-xl border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <p className="text-sm text-closed">{error}</p>}
    </form>
  )
}
