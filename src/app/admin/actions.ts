'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  checkPassword,
  grantAdminSession,
  isAdmin,
  revokeAdminSession,
} from '@/lib/admin/session'
import type { Hours } from '@/lib/types'

async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}

function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get('password') ?? '')
  if (!checkPassword(password)) {
    return { error: 'Wrong password.' }
  }
  await grantAdminSession()
  redirect('/admin')
}

export async function logoutAction() {
  await revokeAdminSession()
  redirect('/admin/login')
}

export async function createLinkAction(formData: FormData) {
  await requireAdmin()
  const title = String(formData.get('title') ?? '').trim()
  const url = String(formData.get('url') ?? '').trim()
  const subtitle = String(formData.get('subtitle') ?? '').trim()
  const icon = String(formData.get('icon') ?? '').trim()
  if (!title || !url) return
  const { data: posRow } = await supabaseAdmin
    .from('links')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextPos = (posRow?.position ?? -1) + 1

  const image_url = await maybeUploadImage(formData.get('image'))

  await supabaseAdmin.from('links').insert({
    title,
    url,
    subtitle,
    icon,
    image_url: image_url ?? '',
    position: nextPos,
  })
  revalidateAll()
}

export async function updateLinkAction(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const patch: Record<string, unknown> = {
    title: String(formData.get('title') ?? '').trim(),
    url: String(formData.get('url') ?? '').trim(),
    subtitle: String(formData.get('subtitle') ?? '').trim(),
    icon: String(formData.get('icon') ?? '').trim(),
  }
  const image_url = await maybeUploadImage(formData.get('image'))
  if (image_url) patch.image_url = image_url
  if (formData.get('clear_image') === '1') patch.image_url = ''
  await supabaseAdmin.from('links').update(patch).eq('id', id)
  revalidateAll()
}

export async function togglePublishedAction(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const published = formData.get('published') === '1'
  if (!id) return
  await supabaseAdmin.from('links').update({ published }).eq('id', id)
  revalidateAll()
}

export async function deleteLinkAction(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const { data: link } = await supabaseAdmin
    .from('links')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()
  if (link?.image_url) {
    await removeStorageObject(link.image_url)
  }
  await supabaseAdmin.from('links').delete().eq('id', id)
  revalidateAll()
}

export async function moveLinkAction(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const direction = String(formData.get('direction') ?? '')
  if (!id || (direction !== 'up' && direction !== 'down')) return

  const { data: all } = await supabaseAdmin
    .from('links')
    .select('id, position')
    .order('position', { ascending: true })
  if (!all) return

  const idx = all.findIndex(l => l.id === id)
  if (idx < 0) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]
  // Two-step swap to avoid unique-index headaches (we have no unique index, but this is safest)
  await supabaseAdmin.from('links').update({ position: -1 - idx }).eq('id', a.id)
  await supabaseAdmin.from('links').update({ position: a.position }).eq('id', b.id)
  await supabaseAdmin.from('links').update({ position: b.position }).eq('id', a.id)
  revalidateAll()
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin()
  const patch: Record<string, unknown> = {
    shop_name: String(formData.get('shop_name') ?? '').trim(),
    tagline: String(formData.get('tagline') ?? '').trim(),
    address: String(formData.get('address') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    google_maps_embed_url: String(formData.get('google_maps_embed_url') ?? '').trim(),
    google_maps_directions_url: String(formData.get('google_maps_directions_url') ?? '').trim(),
    google_review_url: String(formData.get('google_review_url') ?? '').trim(),
    facebook_url: String(formData.get('facebook_url') ?? '').trim(),
    instagram_url: String(formData.get('instagram_url') ?? '').trim(),
    google_business_url: String(formData.get('google_business_url') ?? '').trim(),
    strava_url: String(formData.get('strava_url') ?? '').trim(),
    accent_color: String(formData.get('accent_color') ?? '').trim() || '#e11d48',
    timezone: String(formData.get('timezone') ?? '').trim() || 'America/Toronto',
    featured_title: String(formData.get('featured_title') ?? '').trim(),
    featured_body: String(formData.get('featured_body') ?? '').trim(),
  }
  const logo_url = await maybeUploadImage(formData.get('logo'))
  if (logo_url) patch.logo_url = logo_url
  if (formData.get('clear_logo') === '1') patch.logo_url = ''
  const featured_url = await maybeUploadImage(formData.get('featured_image'))
  if (featured_url) patch.featured_image_url = featured_url
  if (formData.get('clear_featured_image') === '1') patch.featured_image_url = ''
  await supabaseAdmin.from('settings').update(patch).eq('id', 1)
  revalidateAll()
}

export async function updateHoursAction(formData: FormData) {
  await requireAdmin()
  const days: (keyof Hours)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const hours = {} as Hours
  for (const d of days) {
    const closed = formData.get(`${d}_closed`) === '1'
    if (closed) {
      hours[d] = { closed: true }
    } else {
      const open = String(formData.get(`${d}_open`) ?? '10:00')
      const close = String(formData.get(`${d}_close`) ?? '18:00')
      hours[d] = { open, close }
    }
  }
  await supabaseAdmin.from('settings').update({ hours }).eq('id', 1)
  revalidateAll()
}

async function maybeUploadImage(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null
  if (file.size > 5 * 1024 * 1024) return null
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const path = `${randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error } = await supabaseAdmin.storage
    .from('link-images')
    .upload(path, bytes, { contentType: file.type || 'application/octet-stream', upsert: false })
  if (error) return null
  const { data } = supabaseAdmin.storage.from('link-images').getPublicUrl(path)
  return data.publicUrl
}

async function removeStorageObject(publicUrl: string): Promise<void> {
  const marker = '/storage/v1/object/public/link-images/'
  const idx = publicUrl.indexOf(marker)
  if (idx < 0) return
  const key = publicUrl.slice(idx + marker.length)
  if (!key) return
  await supabaseAdmin.storage.from('link-images').remove([key])
}
