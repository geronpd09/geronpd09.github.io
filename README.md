# Perry Dave Geron — Light Portfolio Redesign

React/Vite portfolio styled after the approved light-blue and white six-screen mockup. Includes public portfolio, work experience detail tabs, admin content editor, and video gallery.

## Run locally

```bash
npm install
npm run dev
```

## Supabase configuration

Copy `.env.example` to `.env` and fill in your Supabase project URL and publishable/anon key. Apply `supabase/migrations/001_initial.sql` in the Supabase SQL editor. Inspect policies and create your admin account before making the site public. Use the README in the earlier package for more backend setup context.

## Deploy

This repository is named `geronpd09.github.io` and `vite.config.js` uses base `/`. Push to the `main` branch and enable GitHub Pages via GitHub Actions. Set GitHub Actions variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_CONTACT_FORM_ENDPOINT`.

**Important:** Supabase hosts the database, auth, storage and edge functions; GitHub Pages hosts the React frontend. Supabase Edge Functions for reactions and visitor analytics must be deployed separately. Video upload limits and hosting bandwidth depend on your Supabase plan.

The homepage intentionally uses a **profile-photo placeholder** until you upload your own image. Counts and project cards reflect actual configured data rather than fabricated statistics. This is a source project, not a deployed or fully end-to-end-tested site.
