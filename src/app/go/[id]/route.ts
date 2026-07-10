import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const { data: link } = await supabasePublic
    .from('links')
    .select('url, published')
    .eq('id', id)
    .maybeSingle()

  if (!link || !link.published) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const ua = request.headers.get('user-agent')?.slice(0, 300) ?? ''
  const ref = request.headers.get('referer')?.slice(0, 300) ?? ''
  supabasePublic
    .from('clicks')
    .insert({ link_id: id, source: 'link', user_agent: ua, referrer: ref })
    .then(() => {}, () => {})

  return NextResponse.redirect(link.url, { status: 302 })
}
