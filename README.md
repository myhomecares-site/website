# My Home Cares — Website Rebuild

Modern rebuild of [myhomecares.com](https://www.myhomecares.com) on **Next.js (App Router) + Tailwind v4**, designed to deploy on **Vercel** with **Supabase** for form/lead storage. Brand colors and logo preserved from the original site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's built

- **Homepage** — hero with inline "Find Your Care" form, services grid, about teaser, careers + CareLink callout, contact CTA.
- **8 service pages** — Skilled Nursing, Personal Care, Companion Care, Respite Care, Homemaking, Meal Planning & Preparation, Therapies (+ the Home Care hub).
- **28 Maryland service-area pages** — generated from one template (`src/app/[slug]/page.tsx`), legacy URLs preserved for SEO (e.g. `/home-care-services-baltimore-county-md`).
- **About, Contact, Careers, CareLink Staffing, Job Application** (`/apply` redirects to it).
- **Blog** — index + 15 posts (titles/dates preserved; full article bodies still to be imported — see TODO).
- **Lead capture API** — `src/app/api/lead/route.ts`, used by every form. Writes to Supabase when configured; logs safely until then.

## Brand

Defined in `src/app/globals.css` (`@theme`) and `src/lib/site.ts`:
- Primary `#204ce5`, dark `#001ab3`, light `#527eff`, ink `#112337`.
- Logo files go in `public/brand/` as `mhc-wordmark.png`, `mhc-symbol.png`, `mhc-favicon.png`
  (the header falls back to a styled text mark until they're added).

All site content (phone, email, services, regions/counties) lives in `src/lib/site.ts` — edit there to update site-wide.

## Connect Supabase (lead/booking storage)

1. Create a `leads` table (see `supabase/schema.sql` once added, or run the SQL below).
2. Set environment variables (locally in `.env.local`, and in Vercel project settings):

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
```

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text,
  best_time text,
  position text,
  source text,
  type text default 'lead',
  created_at timestamptz default now()
);
```

## Deploy to Vercel

From your terminal (where you're already signed into Vercel):

```bash
vercel            # first run links/creates the project
vercel --prod     # production deploy
```

Or connect this repo to GitHub and enable Vercel's Git integration — every push deploys automatically.

## Domain cutover (myhomecares.com)

The domain currently points to the WordPress host. When the new site is approved:
1. Add `myhomecares.com` + `www` as domains in the Vercel project.
2. Update the DNS records at your domain registrar to Vercel's (A `76.76.21.21` / CNAME `cname.vercel-dns.com`).
3. Keep the WordPress export as a backup before switching.

## TODO / follow-ups

- Add the three logo PNGs to `public/brand/`.
- Import full blog article bodies (currently excerpts) — from WordPress export or REST API.
- Optional: care-form/resource pages (skin assessment, MAR, etc.) and a booking/scheduling flow.
