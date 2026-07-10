export type DayHours = { closed: true } | { closed?: false; open: string; close: string }

export type Hours = {
  mon: DayHours
  tue: DayHours
  wed: DayHours
  thu: DayHours
  fri: DayHours
  sat: DayHours
  sun: DayHours
}

export type Settings = {
  id: number
  shop_name: string
  tagline: string
  logo_url: string
  address: string
  phone: string
  email: string
  google_maps_embed_url: string
  google_maps_directions_url: string
  google_review_url: string
  facebook_url: string
  google_business_url: string
  instagram_url: string
  strava_url: string
  accent_color: string
  hours: Hours
  timezone: string
  featured_title: string
  featured_body: string
  featured_image_url: string
  updated_at: string
}

export type Link = {
  id: string
  title: string
  subtitle: string
  url: string
  image_url: string
  icon: string
  published: boolean
  position: number
  created_at: string
  updated_at: string
}

export type ClickSource = 'link' | 'call' | 'directions' | 'google_review' | 'facebook' | 'instagram' | 'google_business' | 'strava' | 'email'
