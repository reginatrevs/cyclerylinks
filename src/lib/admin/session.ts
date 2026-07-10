import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'cyclerylinks_admin'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set (>=32 chars)')
  return s
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return safeEq(input, expected)
}

export async function grantAdminSession(): Promise<void> {
  const issued = Math.floor(Date.now() / 1000).toString()
  const value = `${issued}.${sign(issued)}`
  const store = await cookies()
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function revokeAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return false
  const dot = raw.indexOf('.')
  if (dot < 0) return false
  const issued = raw.slice(0, dot)
  const mac = raw.slice(dot + 1)
  if (!/^\d+$/.test(issued)) return false
  const now = Math.floor(Date.now() / 1000)
  if (now - parseInt(issued, 10) > MAX_AGE_SECONDS) return false
  return safeEq(mac, sign(issued))
}
