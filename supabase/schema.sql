-- Picka schema. Run this in Supabase SQL Editor after creating the project.

create extension if not exists "pgcrypto";

-- Galleries: one per shoot/client
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  client_name text,
  passcode_hash text not null,
  cover_photo_id uuid,
  is_locked boolean not null default false, -- true once client submits picks
  created_at timestamptz not null default now()
);

-- Photos: JPEG previews in storage; one row per photo
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  width int,
  height int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_gallery_idx on public.photos(gallery_id, sort_order);

-- Selections: which photos the client picked. Anonymous (no client auth);
-- a single gallery may be picked by one client at a time in MVP.
create table if not exists public.selections (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  picked_at timestamptz not null default now(),
  unique (gallery_id, photo_id)
);

-- Storage bucket (private). Create this via the Supabase dashboard or CLI:
--   bucket name: photos
--   public: false
-- Then the app uses signed URLs via the service role to serve previews.

-- RLS: all access goes through server actions using the service role,
-- so we lock everything down at the table level.
alter table public.galleries enable row level security;
alter table public.photos enable row level security;
alter table public.selections enable row level security;

-- No policies = no client-side access. Server uses service role to bypass.
