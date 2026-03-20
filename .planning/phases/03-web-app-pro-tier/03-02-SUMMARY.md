---
phase: 03-web-app-pro-tier
plan: 02
subsystem: billing
tags: [stripe, supabase-edge-functions, react, typescript, payments]

provides:
  - Stripe Checkout session creation via Edge Function (server-side, secret never in bundle)
  - Stripe webhook handler updating profiles.subscription_status on payment events
  - Stripe Billing Portal session for subscription management/cancellation
  - ProGate component gating Pro features with upgrade CTA
  - Settings page subscription card: Free vs Pro state, Upgrade and Manage Billing buttons

affects: [03-03-ai, 03-04-deploy]

tech-stack:
  added: ['@stripe/stripe-js', 'npm:stripe (Deno Edge Functions)']
  patterns:
    - "STRIPE_SECRET_KEY only in Supabase Edge Function secrets — never in React bundle"
    - "JWT verification via supabase.auth.getUser() in checkout/portal functions"
    - "Service role client in webhook function (no user JWT from Stripe)"
    - "constructEventAsync for Stripe webhook signature verification"

key-files:
  created:
    - src/lib/stripe.ts
    - src/components/ProGate.tsx
    - supabase/functions/create-checkout-session/index.ts
    - supabase/functions/create-portal-session/index.ts
    - supabase/functions/stripe-webhook/index.ts
  modified:
    - src/pages/Settings.tsx

key-decisions:
  - "useSubscriptionContext() (not useSubscription) — imports from context, not raw hook"
  - "ProGate shows null while loading to avoid flash of upgrade prompt"
  - "Webhook uses admin client (service_role) to bypass RLS — no user JWT from Stripe"
  - "Settings note: full product buyers contact support to activate Pro"

patterns-established:
  - "supabase.functions.invoke() pattern for calling Edge Functions from client"
  - "window.location.href redirect after getting Stripe session URL"

requirements-completed: [PAY-01, PAY-02, PAY-03, PAY-04]

user-setup-required:
  - "Create Stripe product + €19.99/month price → copy price ID"
  - "Add VITE_STRIPE_PUBLISHABLE_KEY to .env.local"
  - "Deploy Edge Functions: npx supabase functions deploy create-checkout-session create-portal-session stripe-webhook"
  - "Set secrets: npx supabase secrets set STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=... STRIPE_PRICE_ID=..."
  - "Register webhook in Stripe Dashboard → URL: https://gbmjsctlzothdbrlnzip.supabase.co/functions/v1/stripe-webhook"
  - "Webhook events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"

duration: 15min
completed: 2026-03-14
---

# Phase 03 Plan 02: Stripe Subscription + Billing Summary

**Stripe Checkout + Billing Portal via 3 Supabase Edge Functions. ProGate component. Settings subscription UI.**

## Performance

- **Duration:** 15 min
- **Completed:** 2026-03-14
- **Tasks:** 2 auto + 1 checkpoint (auto-approved — beach mode)
- **Files modified:** 6

## Accomplishments

- 3 Supabase Edge Functions (Deno): checkout session, billing portal, webhook handler
- Stripe secret key stays server-side — only publishable key in React bundle
- ProGate component renders upgrade CTA for free users, children for Pro
- Settings page shows subscription state with correct CTA per tier
- Webhook handles checkout.session.completed, subscription.updated, subscription.deleted

## Task Commits

1. **Task 1: Stripe client + Edge Functions + ProGate** - `e052b1c` (feat)
2. **Task 2: Settings subscription UI** - `c5c824c` (feat)

## Deviations from Plan

- Fixed import: plan specified `useSubscription` from SubscriptionContext — actual export is `useSubscriptionContext`. Corrected in both Settings.tsx and ProGate.tsx.

## Self-Check: PASSED

- FOUND: src/lib/stripe.ts
- FOUND: src/components/ProGate.tsx
- FOUND: supabase/functions/create-checkout-session/index.ts
- FOUND: supabase/functions/create-portal-session/index.ts
- FOUND: supabase/functions/stripe-webhook/index.ts
- FOUND: commit e052b1c (Task 1)
- FOUND: commit c5c824c (Task 2)
- VERIFIED: STRIPE_SECRET_KEY does not appear in any src/ file
- VERIFIED: npm run build passes
