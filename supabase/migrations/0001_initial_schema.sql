-- cyclerylinks initial schema
-- Paste this whole file into Supabase SQL Editor and click Run.

-- Settings: single row holding shop info + hours
create table if not exists public.settings (
  id int primary key default 1,
  shop_name text not null default 'The Cyclery',
  tagline text default '',
  logo_url text default '',
  address text default '',
  phone text default '',
  email text default '',
  google_maps_embed_url text default '',
  google_maps_directions_url text default '',
  google_review_url text default '',
  facebook_url text default '',
  google_business_url text default '',
  instagram_url text default '',
  strava_url text default '',
  accent_color text default '#e11d48',
  hours jsonb not null default '{
    "mon": {"closed": true},
    "tue": {"open": "10:00", "close": "18:00"},
    "wed": {"open": "10:00", "close": "18:00"},
    "thu": {"open": "10:00", "close": "18:00"},
    "fri": {"open": "10:00", "close": "18:00"},
    "sat": {"open": "10:00", "close": "17:00"},
    "sun": {"closed": true}
  }'::jsonb,
  timezone text not null default 'America/Toronto',
  featured_title text default '',
  featured_body text default '',
  featured_image_url text default '',
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- Links: the main link blocks
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text default '',
  url text not null,
  image_url text default '',
  icon text default '',
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists links_position_idx on public.links (position);
create index if not exists links_published_idx on public.links (published) where published = true;

-- Clicks: analytics
create table if not exists public.clicks (
  id bigserial primary key,
  link_id uuid references public.links (id) on delete cascade,
  source text not null default 'link',
  clicked_at timestamptz not null default now(),
  user_agent text default '',
  referrer text default ''
);

create index if not exists clicks_link_id_idx on public.clicks (link_id);
create index if not exists clicks_clicked_at_idx on public.clicks (clicked_at desc);
create index if not exists clicks_source_idx on public.clicks (source);

-- RLS: public reads settings + published links, anyone can insert a click
alter table public.settings enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;

drop policy if exists "settings_public_read" on public.settings;
drop policy if exists "links_public_read_published" on public.links;
drop policy if exists "clicks_public_insert" on public.clicks;

create policy "settings_public_read" on public.settings for select to anon, authenticated using (true);
create policy "links_public_read_published" on public.links for select to anon, authenticated using (published = true);
create policy "clicks_public_insert" on public.clicks for insert to anon, authenticated with check (true);

-- Auto-updated_at
create or replace function public.tg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists settings_touch on public.settings;
drop trigger if exists links_touch on public.links;

create trigger settings_touch before update on public.settings for each row execute function public.tg_touch_updated_at();
create trigger links_touch before update on public.links for each row execute function public.tg_touch_updated_at();

-- Storage bucket for uploaded images (logo, link images, featured image)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('link-images', 'link-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "link_images_public_read" on storage.objects;
create policy "link_images_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'link-images');
