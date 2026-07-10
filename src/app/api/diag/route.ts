import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BULLET_CODES = new Set([0x2022, 0x00b7, 0x2027, 0x2219])

function analyze(name: string) {
  const v = process.env[name]
  if (v === undefined) return { name, present: false }
  const chars = Array.from(v)
  const nonAscii: { index: number; code: number; char: string }[] = []
  for (let i = 0; i < chars.length; i++) {
    const code = chars[i].charCodeAt(0)
    if (code > 127) nonAscii.push({ index: i, code, char: chars[i] })
  }
  return {
    name,
    present: true,
    length: v.length,
    firstFour: v.slice(0, 4),
    lastFour: v.slice(-4),
    hasBulletChar: chars.some(c => BULLET_CODES.has(c.charCodeAt(0))),
    firstNonAscii: nonAscii.slice(0, 5),
    nonAsciiCount: nonAscii.length,
  }
}

export async function GET() {
  return NextResponse.json(
    {
      note: 'env var diagnostics — only exposes metadata, never values',
      results: [
        analyze('NEXT_PUBLIC_SUPABASE_URL'),
        analyze('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        analyze('SUPABASE_SERVICE_ROLE_KEY'),
        analyze('ADMIN_PASSWORD'),
        analyze('ADMIN_SESSION_SECRET'),
      ],
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
