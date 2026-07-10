import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase/public'

const ALLOWED = new Set([
  'call',
  'directions',
  'google_review',
  'facebook',
  'instagram',
  'google_business',
  'strava',
  'email',
])

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { source?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const source = typeof body.source === 'string' ? body.source : ''
  if (!ALLOWED.has(source)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const ua = request.headers.get('user-agent')?.slice(0, 300) ?? ''
  const ref = request.headers.get('referer')?.slice(0, 300) ?? ''
  await supabasePublic.from('clicks').insert({ source, user_agent: ua, referrer: ref })
  return NextResponse.json({ ok: true })
}
