---
phase: 03-web-app-pro-tier
plan: "04"
subsystem: infra
tags: [vercel, vite, deployment, spa-routing, production-build]

# Dependency graph
requires:
  - phase: 03-web-app-pro-tier
    provides: "Completed flow-year-coach app with auth, Stripe payments, and AI coaching (03-01, 03-02, 03-03)"
provides:
  - "Production build verified — npm run build passes with zero errors"
  - "vercel.json SPA rewrites confirmed correct"
  - "Pre-deploy checklist printed covering Vercel env vars, Supabase redirect URLs, Stripe webhook"
  - "dist/ output with index.html and hashed JS/CSS assets ready for deployment"
affects: [production, deployment, custom-domain]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SPA routing via vercel.json rewrites: source /(.*) → destination /index.html"

key-files:
  created: []
  modified:
    - "/root/projects/flow-year-coach/vercel.json"

key-decisions:
  - "vercel.json rewrites verified correct — no changes needed, already had SPA routing in place"
  - "Production build produces 1.13 kB HTML + 74 kB CSS + 1133 kB JS bundle (chunk size warning only, not an error)"

patterns-established:
  - "Pattern 1: Vercel SPA routing via rewrites field in vercel.json — required for React Router apps to handle direct URL access"

requirements-completed: [DEPLOY-01, DEPLOY-02, DEPLOY-03]

# Metrics
duration: 5min
completed: 2026-03-17
---

# Phase 3 Plan 04: Production Deployment Summary

**Production build passes locally (npm run build: 3420 modules, zero errors) — app ready for Vercel deployment with SPA rewrites confirmed in vercel.json**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-17T16:25:00Z
- **Completed:** 2026-03-17T16:30:00Z
- **Tasks:** 1/2 (Task 1 complete; Task 2 is human-verify checkpoint — awaiting deployment)
- **Files modified:** 0 (vercel.json already correct)

## Accomplishments
- npm run build passes with zero TypeScript errors — all 3420 modules transform successfully
- vercel.json confirmed to have correct SPA rewrites for React Router (no 404 on direct URL access)
- dist/ directory contains index.html, hashed JS bundle, CSS assets, favicon.ico
- Pre-deploy checklist printed covering all required Vercel env vars, Supabase redirect URLs, Stripe webhook configuration

## Task Commits

Each task was committed atomically:

1. **Task 1: Pre-deploy verification + production build check** - no commit (vercel.json unchanged, build artifacts not committed to git)

**Plan metadata:** (see final commit hash)

## Files Created/Modified
- `/root/projects/flow-year-coach/vercel.json` - Already correct: `{"rewrites":[{"source":"/(.*)", "destination":"/index.html"}]}` — no changes needed

## Decisions Made
- vercel.json was already correctly configured with SPA rewrites — no changes needed
- Build warning about chunk size (1133 kB JS) is a performance warning, not an error — does not block deployment

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

**External services require manual configuration before deployment is live.**

### Vercel
1. Connect GitHub repo: vercel.com → New Project → Import `lutjebroeker/flow-year-coach`
   - Framework preset: Vite
   - Root directory: `/` (or `flow-year-coach` if needed)
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL` = `https://gbmjsctlzothdbrlnzip.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (from Supabase Dashboard → Settings → API → anon public key)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (production live key)
3. Deploy: `cd /root/projects/flow-year-coach && npx vercel --prod`
4. Add custom domain: Vercel project → Settings → Domains
   - Update DNS CNAME at registrar to point to `cname.vercel-dns.com`

### Supabase
- Add production domain to Auth → URL Configuration → Redirect URLs:
  - `https://yourdomain.com`
  - `https://yourdomain.com/`
  - `https://yourdomain.com/update-password`
- Ensure supabase/functions/* are deployed (from plan 03-02)
- Ensure Edge Function secrets are set: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `ANTHROPIC_API_KEY`

### Stripe
- Register production webhook endpoint: `https://gbmjsctlzothdbrlnzip.supabase.co/functions/v1/stripe-webhook`
- Use production (live) keys, not test keys

## Issues Encountered

None — build passed cleanly on first run.

## Next Phase Readiness
- Local build verified — deployment can proceed once Vercel env vars and dashboard steps above are completed
- After deployment: verify all routes work, auth flow (magic link), and Stripe checkout end-to-end
- Custom domain DNS propagation may take up to 24 hours

---
*Phase: 03-web-app-pro-tier*
*Completed: 2026-03-17*
