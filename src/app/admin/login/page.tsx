import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin/session'
import { loginAction } from '../actions'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin')
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-soft">Enter the shop admin password to manage links.</p>
        <LoginForm action={loginAction} />
      </div>
    </div>
  )
}
