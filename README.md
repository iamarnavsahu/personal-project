# Picka.

Share a shoot. Your client picks favorites. You edit only what matters.

## What this is

A private photo-selection web app for photographers. You upload JPEG previews
from a shoot to a gallery, share a link + passcode with your client, and they
star their favorites. You then edit only the picks — no more 500-photo Drive
folders.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth + private Storage bucket)
- Server actions + signed URLs (private galleries, no public photo URLs)

## Setup (first time)

### 1. Add the logo

Save the `PICKA.` logo image into `public/logo.png`. The site references
`/logo.png` from the landing page, admin header, and client gallery.

### 2. Create a Supabase project

1. Go to https://supabase.com → New project
2. In the SQL editor, paste the contents of `supabase/schema.sql` and run it.
3. Storage → New bucket → name `photos`, **Public: OFF** (private).
4. Project Settings → API → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose)

### 3. Local env

```bash
cp .env.local.example .env.local
# fill in the three values
```

### 4. Install + run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### 5. Create your admin account

Go to `/admin/login`, click "Sign up", create your account with your email +
password. (Optionally in Supabase → Authentication → Providers, turn off
"Confirm email" while testing.)

## Usage

- **You** → `/admin` to create galleries, upload photos, share link/passcode.
- **Client** → `/g/<slug>` to enter passcode and pick favorites.
- Once the client clicks **Submit picks**, the gallery locks and you can see
  exactly which photos to edit.

## Roadmap

- RAW upload + RAW–JPEG pairing (edit-after-pick workflow)
- Multi-photographer SaaS mode
- Email notification when client submits
- Watermarking previews
- Mobile-first polish

## Deploying

Push to GitHub → import on Vercel → add the 3 env vars → deploy.
