# Phase 3: Web App Pro Tier — Research

**Researched:** 2026-03-14
**Domain:** React 18 + Supabase Auth + Stripe Subscriptions + Claude AI + Vercel deployment
**Confidence:** HIGH (stack is well-documented, codebase audited directly)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can create account with email and password via Supabase Auth | `supabase.auth.signUp({ email, password })` — add alongside existing magic link |
| AUTH-02 | User can sign in with Google OAuth via Supabase Auth | `supabase.auth.signInWithOAuth({ provider: 'google' })` — configure in Supabase dashboard + Google Cloud Console |
| AUTH-03 | User session persists across browser refresh and device switches | Already works via `supabase.auth.onAuthStateChange` in AuthContext; Supabase stores session in localStorage |
| AUTH-04 | User can reset password via email link | `supabase.auth.resetPasswordForEmail(email)` — requires email/password auth to exist first |
| AUTH-05 | User can log out from any page | Already implemented via `signOut()` in AuthContext and Settings page |
| DATA-01 | All localStorage data models migrated to Supabase tables | 5 hooks still use localStorage: useCheckIns, useFlowSessions, useTwelveWeekCycle, useWeeklyReflections, useTwelveWeekReview. New tables needed: check_ins, flow_sessions, weekly_reflections, twelve_week_reviews. Cycles table exists but uses old schema. |
| DATA-02 | Free tier users get localStorage fallback | Implement dual-write pattern: check `user` from AuthContext; if null, write localStorage; if authenticated + Pro, write Supabase |
| DATA-03 | Pro tier users get Supabase sync | Gate Supabase writes behind subscription_status check from profiles table |
| DATA-04 | Data export/import continues to work for all users | useDataExport already exports from localStorage keys; extend to also read from Supabase when authenticated |
| PAY-01 | Stripe subscription — Free tier and Pro tier (€9/month per REQUIREMENTS.md, €19.99/month per ROADMAP.md) | Stripe Checkout + subscriptions API; price discrepancy must be resolved at plan time — ROADMAP value (€19.99) appears more current |
| PAY-02 | Pro paywall gates cloud sync | Check `subscription_status = 'active'` from profiles table before enabling Supabase writes |
| PAY-03 | User can cancel subscription from settings | Stripe Billing Portal — create session server-side, redirect user to Stripe-hosted portal |
| PAY-04 | Webhook from Stripe updates subscription status in Supabase | Supabase Edge Function handles `checkout.session.completed` and `customer.subscription.updated/deleted`; uses service role key to bypass RLS |
| AI-01 | Weekly reflection view shows AI analysis via Claude API (Pro only) | Supabase Edge Function calls Anthropic API with reflection data; Pro-gated |
| AI-02 | Dashboard shows AI morning nudge based on today's goals (Pro only) | Supabase Edge Function with today's cycle goals + yesterday's check-in; Pro-gated |
| AI-03 | 12-week review shows AI cycle analysis | Supabase Edge Function with full cycle data; Pro-gated |
| DEPLOY-01 | App deployed to Vercel with custom domain | vercel.json already exists; connect GitHub repo to Vercel project, set custom domain in Vercel dashboard |
| DEPLOY-02 | Environment variables set for Supabase, Stripe, Claude API | Vercel dashboard env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ANTHROPIC_API_KEY (last two are Supabase Edge Function secrets) |
| DEPLOY-03 | Production build passes — no console errors, all routes work | vercel.json rewrites already handle SPA routing; run `npm run build` locally before deploy |
</phase_requirements>

---

## Summary

The flow-year-coach React app is substantially further along than a greenfield project. Supabase is already wired up with 4 tables (profiles, cycles, weekly_plans, daily_notes, vision), an auth system using magic-link OTP, and 4 Supabase-backed hooks (useVision, useActiveCycle, useWeeklyPlans, useDailyNotes). The remaining 5 hooks (useCheckIns, useFlowSessions, useTwelveWeekCycle, useWeeklyReflections, useTwelveWeekReview) still read/write localStorage only. These must be migrated to Supabase for Pro-tier cloud sync.

Authentication needs two additions to the existing magic-link setup: email/password sign-up/sign-in and Google OAuth. The AUTH requirements conflict with the existing magic-link implementation — the resolution is to keep magic link AND add email/password as an alternative, plus Google OAuth. This is straightforward in Supabase: all three methods coexist naturally.

Stripe integration follows a clear pattern: Edge Function creates Checkout sessions (server-side, secret key never in browser), Stripe redirects to a success URL, a second Edge Function handles webhooks to update `subscription_status` and `stripe_customer_id` on the profiles table. Stripe's Billing Portal handles cancellation self-serve. Claude API calls are made from Supabase Edge Functions (not from the browser) to keep the API key server-side. Vercel already has a vercel.json with SPA rewrites; deployment is straightforward once env vars are set.

**Primary recommendation:** Implement in four plan-aligned waves: (1) auth + missing Supabase migrations, (2) Stripe paywall, (3) Claude AI features, (4) Vercel production deploy. Each wave can ship independently.

---

## Codebase Audit Findings

### What Already Works (Do Not Rebuild)

| Feature | Location | Status |
|---------|----------|--------|
| Magic-link auth | `AuthContext.tsx` + `Login.tsx` | Working — keep as primary auth method |
| Auth-gated layout | `AppLayout.tsx` (Navigate to /login if !user) | Working |
| Session persistence | `supabase.auth.onAuthStateChange` in AuthContext | Working — Supabase stores session in localStorage automatically |
| Sign out | Settings page + AuthContext.signOut | Working |
| Vision table + hook | `useVision.ts` — Supabase-backed | Working |
| Cycles table + hook | `useActiveCycle.ts` — Supabase-backed | Working |
| Weekly plans table + hook | `useWeeklyPlans.ts` — Supabase-backed | Working |
| Daily notes table + hook | `useDailyNotes.ts` — Supabase-backed | Working |
| Data export/import (JSON + Markdown) | `useDataExport.ts` | Working — localStorage + Supabase markdown import |
| vercel.json SPA rewrites | `vercel.json` | Done |
| Vitest + Testing Library | `vitest.config.ts`, `src/test/setup.ts` | Configured, only example test exists |

### What Still Uses localStorage (Must Migrate)

| Hook | localStorage Key | Types Involved | New Supabase Table Needed |
|------|-----------------|----------------|--------------------------|
| `useTwelveWeekCycle.ts` | `flow-coach-cycles` | `TwelveWeekCycle` (from types/index.ts) | Note: `cycles` table exists but uses different schema (Goal.tactics vs Goal.weeklyActions) — requires schema alignment |
| `useCheckIns.ts` | `flow-coach-checkins` | `CheckIn` (morning/evening union type) | `check_ins` table |
| `useFlowSessions.ts` | `flow-coach-sessions` | `FlowSession` (with linkedTasks) | `flow_sessions` table |
| `useWeeklyReflections.ts` | `flow-coach-weekly-reflections` | `WeeklyReflection` | `weekly_reflections` table |
| `useTwelveWeekReview.ts` | `flow-coach-12week-reviews` | `TwelveWeekReview` | `twelve_week_reviews` table |

### Critical Schema Discrepancy

The `types/index.ts` defines `Goal.weeklyActions: WeeklyAction[]` but `supabase.ts` defines `Goal.tactics: Tactic[]`. These are the same concept with different names. The Supabase-backed `useActiveCycle.ts` uses `Goal.tactics`. The localStorage-backed `useTwelveWeekCycle.ts` uses `Goal.weeklyActions`. **Resolution at plan time:** migrate to the `tactics` schema (already in Supabase) and update references in pages that use `weeklyActions`.

---

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@supabase/supabase-js` | ^2.98.0 | Auth, database, Edge Function invocation | Installed |
| `react` | ^18.3.1 | UI framework | Installed |
| `@tanstack/react-query` | ^5.83.0 | Server state management for Supabase queries | Installed |
| `react-router-dom` | ^6.30.1 | Routing | Installed |
| `shadcn/ui` + Radix | various | UI components | Installed |
| `vitest` + `@testing-library/react` | ^3.2.4 / ^16.0.0 | Testing | Installed |

### New Dependencies to Install

| Library | Version | Purpose | Install Command |
|---------|---------|---------|----------------|
| `stripe` | latest | Stripe SDK (used in Edge Functions, not in React app) | Install in Edge Function, not package.json |
| `@stripe/stripe-js` | latest | Stripe.js for redirectToCheckout client-side | `npm install @stripe/stripe-js` |
| `@anthropic-ai/sdk` | latest | Claude API (used in Edge Functions only) | Install in Edge Function, not package.json |

**Key insight:** Stripe secret key and Claude API key NEVER go in the React app. They live in Supabase Edge Function environment secrets. Only `@stripe/stripe-js` (publishable key only) goes in the client bundle.

**Installation for client:**
```bash
cd /root/projects/personal/flow-year-coach
npm install @stripe/stripe-js
```

---

## Architecture Patterns

### Recommended Project Structure Additions

```
src/
├── contexts/
│   ├── AuthContext.tsx          # Existing — add signInWithPassword, signUp, signInWithGoogle
│   └── SubscriptionContext.tsx  # NEW — provides isPro boolean from profiles table
├── hooks/
│   ├── useSubscription.ts       # NEW — fetches subscription_status from profiles
│   ├── useCheckIns.ts           # MIGRATE — localStorage → Supabase dual-write
│   ├── useFlowSessions.ts       # MIGRATE — localStorage → Supabase dual-write
│   ├── useWeeklyReflections.ts  # MIGRATE — localStorage → Supabase dual-write
│   └── useTwelveWeekReview.ts   # MIGRATE — localStorage → Supabase dual-write
├── lib/
│   └── stripe.ts                # NEW — Stripe.js client init (publishable key only)
└── pages/
    └── (existing pages — add Pro gates where needed)

supabase/
└── functions/
    ├── create-checkout-session/  # NEW — creates Stripe Checkout session
    │   └── index.ts
    ├── create-portal-session/    # NEW — creates Stripe Billing Portal session
    │   └── index.ts
    ├── stripe-webhook/           # NEW — handles Stripe events, updates profiles
    │   └── index.ts
    ├── ai-weekly-reflection/     # NEW — Claude analysis of weekly reflection
    │   └── index.ts
    ├── ai-morning-nudge/         # NEW — Claude morning nudge for dashboard
    │   └── index.ts
    └── ai-cycle-review/          # NEW — Claude 12-week cycle analysis
        └── index.ts
```

### Pattern 1: Supabase Auth — Adding Email/Password to Existing Magic Link

**What:** Add `signInWithPassword`, `signUp`, and `resetPasswordForEmail` to AuthContext alongside existing `signInWithEmail` (OTP magic link). All three coexist in Supabase Auth with no conflicts.

**When to use:** AUTH-01, AUTH-04

```typescript
// Source: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
// Add to AuthContext.tsx alongside existing signInWithEmail

const signInWithPassword = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
};

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  return { data, error };
};

const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { error };
};
```

**Login page change:** Add tabs to Login.tsx — "Magic link" (existing) + "Email & password" (new) + "Google" (new).

### Pattern 2: Google OAuth

**What:** `signInWithOAuth` redirects to Google, Supabase handles the callback automatically.

**When to use:** AUTH-02

```typescript
// Source: https://supabase.com/docs/guides/auth/social-login/auth-google
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};
```

**Dashboard config required:**
1. Google Cloud Console → create OAuth client → add `https://gbmjsctlzothdbrlnzip.supabase.co/auth/v1/callback` as redirect URI
2. Supabase Dashboard → Authentication → Providers → Google → enable + paste Client ID + Secret

### Pattern 3: Subscription Context (Pro Gate)

**What:** A context that reads `subscription_status` from the profiles table and exposes `isPro` to all components.

**When to use:** PAY-02, AI-01, AI-02, AI-03

```typescript
// Source: Supabase RLS pattern — each user can only read their own profile
// Add subscription_status and stripe_customer_id columns to profiles table first

export function useSubscription() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, stripe_customer_id')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// In components: const { data } = useSubscription(); const isPro = data?.subscription_status === 'active';
```

### Pattern 4: Stripe Checkout via Supabase Edge Function

**What:** React calls Edge Function with `supabase.functions.invoke()`, Edge Function creates Stripe Checkout session server-side with secret key, returns URL, React redirects.

**When to use:** PAY-01

```typescript
// Source: https://dev.to/alexzrlu/nextjs-supabase-stripe-subscriptions-integration-818
// Client-side (React) — never touches Stripe secret key
import { loadStripe } from '@stripe/stripe-js';

const handleSubscribe = async () => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { priceId: 'price_xxx', returnUrl: window.location.origin },
  });
  if (error) throw error;
  window.location.href = data.url; // Stripe-hosted checkout URL
};
```

```typescript
// Edge Function: supabase/functions/create-checkout-session/index.ts
// Source: Supabase Edge Function + Stripe pattern (Deno runtime)
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req) => {
  const { priceId, returnUrl } = await req.json();
  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    customer_email: user!.email,
    metadata: { user_id: user!.id },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Pattern 5: Stripe Webhook Handler

**What:** Stripe POSTs to public Edge Function URL. Function verifies signature with `stripe.webhooks.constructEvent()`, then uses Supabase service role key (bypasses RLS) to update profiles.

**When to use:** PAY-04

```typescript
// Edge Function: supabase/functions/stripe-webhook/index.ts
// Source: https://supabase.com/docs/guides/functions/examples/stripe-webhooks
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  // Use service role to bypass RLS for webhook updates
  const adminSupabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await adminSupabase.from('profiles').update({
      subscription_status: 'active',
      stripe_customer_id: session.customer as string,
    }).eq('id', session.metadata!.user_id);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await adminSupabase.from('profiles')
      .update({ subscription_status: 'canceled' })
      .eq('stripe_customer_id', sub.customer as string);
  }

  return new Response(JSON.stringify({ received: true }));
});
```

### Pattern 6: Stripe Billing Portal (Cancel/Manage)

**What:** Edge Function creates a Stripe Billing Portal session; React redirects user. Stripe handles all subscription management UI (cancel, update payment, download invoices).

**When to use:** PAY-03

```typescript
// Client-side
const handleManageBilling = async () => {
  const { data } = await supabase.functions.invoke('create-portal-session', {
    body: { returnUrl: window.location.origin + '/instellingen' },
  });
  window.location.href = data.url;
};

// Edge Function: create-portal-session/index.ts
const session = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId, // fetched from profiles via service role
  return_url: returnUrl,
});
return new Response(JSON.stringify({ url: session.url }));
```

### Pattern 7: Claude AI via Edge Function

**What:** Pro-gated Edge Functions call Anthropic API with user data as context. Never called from browser — always via `supabase.functions.invoke()` with user JWT.

**When to use:** AI-01, AI-02, AI-03

```typescript
// Edge Function: ai-weekly-reflection/index.ts
// Source: https://github.com/anthropics/anthropic-sdk-typescript
import Anthropic from 'npm:@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

Deno.serve(async (req) => {
  // 1. Verify user is authenticated and is Pro (check profiles table)
  // 2. Fetch reflection data from Supabase
  // 3. Call Claude
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: buildReflectionPrompt(reflectionData, cycleGoals),
    }],
  });
  return new Response(JSON.stringify({ analysis: message.content[0].text }));
});
```

**Client-side call:**
```typescript
// Only callable by Pro users — check isPro before invoking
const { data } = await supabase.functions.invoke('ai-weekly-reflection', {
  body: { cycleId, weekNumber },
});
```

### Pattern 8: Dual-Write for localStorage → Supabase Migration

**What:** When user is authenticated and Pro, write to Supabase. When not authenticated (or Free), write to localStorage. Both paths read from the appropriate source.

**When to use:** DATA-01, DATA-02, DATA-03

```typescript
// Pattern for migrated hooks
export function useCheckIns() {
  const { user } = useAuth();
  const { data: subscription } = useSubscription();
  const isPro = subscription?.subscription_status === 'active';

  // If Pro: use Supabase queries (TanStack Query)
  // If Free/unauthenticated: use localStorage
  // Return same interface regardless — no page changes needed
}
```

### Anti-Patterns to Avoid

- **Putting Stripe secret key in .env.local or Vite env vars** — it would be bundled into the client. Secret key ONLY in Supabase Edge Function secrets.
- **Calling Claude API from the browser** — API key exposure. Always via Edge Function.
- **Checking Pro status client-side only** — Edge Functions must also verify Pro status before returning AI results (defense in depth).
- **Using `supabase.auth.getSession()` in Edge Functions** — use `supabase.auth.getUser()` instead; `getSession()` trusts the client and can be spoofed.
- **Enabling RLS then forgetting service role for webhooks** — Stripe webhooks have no user JWT; must use service role key.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Subscription management UI | Custom cancel/update forms | Stripe Billing Portal | PCI compliance, localization, retry logic — Stripe already built this |
| Webhook signature verification | Custom HMAC verification | `stripe.webhooks.constructEventAsync()` | Timing attack vulnerability in naive implementations |
| OAuth flow with Google | Custom OAuth redirect handling | `supabase.auth.signInWithOAuth()` | PKCE, state param, token exchange — all handled by Supabase |
| Payment form / card input | Custom card input fields | Stripe Checkout (hosted) | PCI-DSS compliance would require SAQ A-EP minimum — not worth it |
| Subscription status caching | Custom cache invalidation | TanStack Query + `invalidateQueries` | Already in the project; handles stale data correctly |
| API key rotation | Custom secret management | Vercel env vars + Supabase secrets | Encrypted at rest, environment-scoped |

**Key insight:** Stripe Checkout (hosted) is strongly preferred over Stripe Elements (embedded form) for this project. Hosted Checkout requires zero PCI compliance work on the developer's part.

---

## Required Database Changes

### New Columns on `profiles` Table

```sql
-- Add to existing profiles table (already has: id, email, name, created_at, updated_at)
ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free'
  CHECK (subscription_status IN ('free', 'active', 'canceled', 'past_due'));
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN subscription_period_end TIMESTAMPTZ;
```

### New Tables (localStorage → Supabase migration)

```sql
-- check_ins table (replaces flow-coach-checkins localStorage)
CREATE TABLE check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('morning', 'evening')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own check_ins" ON check_ins FOR ALL USING (auth.uid() = user_id);

-- flow_sessions table (replaces flow-coach-sessions localStorage)
CREATE TABLE flow_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  task_type TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  linked_tasks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE flow_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own flow_sessions" ON flow_sessions FOR ALL USING (auth.uid() = user_id);

-- weekly_reflections table (replaces flow-coach-weekly-reflections localStorage)
CREATE TABLE weekly_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  completion_score INT,
  what_worked_well TEXT,
  what_didnt_work TEXT,
  what_distracted TEXT,
  what_must_change TEXT,
  ai_analysis TEXT,  -- populated by AI-01 Edge Function
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cycle_id, week_number)
);
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own weekly_reflections" ON weekly_reflections FOR ALL USING (auth.uid() = user_id);

-- twelve_week_reviews table (replaces flow-coach-12week-reviews localStorage)
CREATE TABLE twelve_week_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  goals_achieved JSONB DEFAULT '[]',
  biggest_wins TEXT,
  biggest_challenges TEXT,
  key_lessons TEXT,
  next_cycle_priorities TEXT,
  ai_analysis TEXT,  -- populated by AI-03 Edge Function
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cycle_id)
);
ALTER TABLE twelve_week_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own twelve_week_reviews" ON twelve_week_reviews FOR ALL USING (auth.uid() = user_id);
```

### Schema Alignment: Cycle Goals (weeklyActions vs tactics)

The existing `cycles` table stores `goals` as JSONB with `tactics: Tactic[]`. The old localStorage uses `weeklyActions: WeeklyAction[]`. During migration, pages that reference `weeklyActions` must be updated to use `tactics`. This is a naming change only — the concept is identical.

---

## Common Pitfalls

### Pitfall 1: Stripe Secret Key in Vite Environment Variables

**What goes wrong:** Developer sets `VITE_STRIPE_SECRET_KEY` in `.env` — Vite bundles all `VITE_` prefixed vars into the client bundle. Secret key ships to every browser.
**Why it happens:** Vite's env var convention makes it easy; mistake is common in tutorials.
**How to avoid:** Only `VITE_STRIPE_PUBLISHABLE_KEY` in Vite env vars. Secret key in Supabase Edge Function secrets only.
**Warning signs:** If you're using the secret key anywhere outside `supabase/functions/`, stop.

### Pitfall 2: RLS Blocks Stripe Webhook Updates

**What goes wrong:** Stripe webhook calls Supabase to update `subscription_status`. Supabase returns 403 because webhook has no user JWT and RLS denies anonymous writes.
**Why it happens:** Webhook requests are unauthenticated from Supabase's perspective.
**How to avoid:** In webhook Edge Function, use `SUPABASE_SERVICE_ROLE_KEY` to create admin client that bypasses RLS. Never expose this key to the browser.
**Warning signs:** Payments succeed but subscription_status doesn't update.

### Pitfall 3: `supabase.auth.getSession()` vs `getUser()` in Edge Functions

**What goes wrong:** Edge Function trusts the JWT from `getSession()` — but a malicious client can forge a local session.
**Why it happens:** Old tutorials use `getSession()`.
**How to avoid:** Always use `supabase.auth.getUser()` in Edge Functions. It validates the token against the Supabase Auth server.
**Warning signs:** Security audit catches it; user can call AI features without Pro subscription.

### Pitfall 4: Pro Gate Only on Client-Side

**What goes wrong:** Developer checks `isPro` in the React component before calling `supabase.functions.invoke()` — but API is still publicly callable.
**Why it happens:** Fast to implement, feels sufficient.
**How to avoid:** Edge Functions must independently verify Pro status by reading profiles table after authenticating the user. Client-side check is UX only.

### Pitfall 5: Magic Link + Password Auth Email Conflicts

**What goes wrong:** Adding email/password to existing magic-link project causes "user already registered" errors if users try to sign up with an email that already has a magic-link account.
**Why it happens:** Supabase treats these as the same account. Existing magic-link users need to set a password via the "forgot password" flow.
**How to avoid:** Show "Set a password" option in settings for existing users; guide them through `supabase.auth.updateUser({ password })`. Document this in login UI.

### Pitfall 6: Supabase Edge Function CORS for Browser Invocations

**What goes wrong:** `supabase.functions.invoke()` from browser fails with CORS error in production.
**Why it happens:** Edge Functions don't include CORS headers by default unless using `corsHeaders`.
**How to avoid:** Add standard CORS header response at top of every Edge Function:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
```

### Pitfall 7: Vite Dev Server and Supabase Edge Functions

**What goes wrong:** During local development, `supabase.functions.invoke()` calls fail because Edge Functions are not running.
**Why it happens:** Edge Functions require `supabase functions serve` separately from `vite dev`.
**How to avoid:** Run both `npm run dev` and `npx supabase functions serve` in parallel during development. Document in project README.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Stripe.js redirect via `stripe.redirectToCheckout()` | `window.location.href = session.url` from Checkout Session | `redirectToCheckout` deprecated; use URL from session |
| Stripe Elements (embedded card form) | Stripe Checkout (hosted) | Hosted is simpler + PCI-compliant; use for new projects |
| Custom subscription status polling | Stripe webhooks → Supabase | Real-time status without polling |
| Supabase Auth UI components (`@supabase/auth-ui-react`) | Custom Login page (already exists) | Existing Login.tsx is cleaner; don't replace it |

**Deprecated/outdated:**
- `stripe.redirectToCheckout({ sessionId })`: deprecated in recent Stripe.js versions. Use `window.location.href = checkoutSession.url` instead.
- `@supabase/auth-helpers-react`: superseded by `@supabase/ssr` for Next.js; not relevant here (not Next.js). Direct `@supabase/supabase-js` usage is correct for Vite/React.

---

## Pricing Discrepancy Resolution

REQUIREMENTS.md says PAY-01 = €9/month. ROADMAP.md (Phase 3 goal) says €19.99/month. These are contradictory. **Research recommendation:** Use €19.99/month — it's in the phase-level goal statement (ROADMAP) which was written after REQUIREMENTS.md. The one-time unlock path is "exact price TBD at planning" per ROADMAP. Both the subscription price and the one-time unlock price should be confirmed at plan time. The Stripe Price ID will be created in the Stripe Dashboard and then referenced as `STRIPE_PRICE_ID` env var.

---

## Deployment Setup

**Vercel setup (DEPLOY-01, DEPLOY-02, DEPLOY-03):**

1. `vercel.json` already exists with correct SPA rewrites — no changes needed
2. Link GitHub repo `lutjebroeker/flow-year-coach` to new Vercel project via CLI: `npx vercel --prod` from flow-year-coach directory
3. Set environment variables in Vercel dashboard (Settings → Environment Variables):
   - `VITE_SUPABASE_URL` = `https://gbmjsctlzothdbrlnzip.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (from Supabase dashboard)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = (from Stripe dashboard)
4. Supabase Edge Function secrets (set via `supabase secrets set`):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `ANTHROPIC_API_KEY`
5. Custom domain: set in Vercel project → Domains → add custom domain, update DNS records
6. Stripe webhook URL: `https://gbmjsctlzothdbrlnzip.supabase.co/functions/v1/stripe-webhook` — register in Stripe Dashboard → Webhooks

**Pre-deploy checklist:**
- [ ] `npm run build` passes locally
- [ ] All routes resolve (SPA rewrites handle 404s)
- [ ] No `console.error` in production (check devtools after deploy)
- [ ] Supabase auth redirect URLs include production domain (Auth → URL Configuration in Supabase dashboard)

---

## Open Questions

1. **Pro pricing: €9/month or €19.99/month?**
   - What we know: REQUIREMENTS.md says €9, ROADMAP.md says €19.99
   - Recommendation: Use €19.99 (ROADMAP is the authoritative source for phase goals); confirm at plan time

2. **One-time unlock price for Pro (vs subscription)**
   - What we know: ROADMAP mentions "one-time unlock" but says "exact price TBD"
   - Recommendation: Decide at plan time — either €49 one-time or subscription only; Stripe Checkout supports both modes

3. **Execution Engine €2,497 buyers → automatic Pro access**
   - What we know: ROADMAP says "full Execution Engine buyers (€2,497) are granted Pro access automatically"
   - Recommendation: Implement as a Gumroad webhook (from Phase 2 welcome email workflow) that calls a Supabase Edge Function to update `subscription_status = 'active'` for matching email. Out of scope for Phase 3 plans unless explicitly added.

4. **Vision schema mismatch**
   - What we know: `types/index.ts` Vision has `personalVision.life/health/relationships + businessVision + values + purpose`; Supabase `vision` table has `telos + three_year_vision + values`
   - These are different schemas representing the same concept
   - Recommendation: Keep the Supabase schema (already in production); update the Vision page and types to use `telos` + `three_year_vision` + `values`. The localStorage Vision type can be considered legacy.

5. **Gumroad → Pro access bridge**
   - Out of scope for Phase 3 (it's a multi-system integration involving n8n/Phase 2 infrastructure)
   - Recommendation: Manual Pro grant for early buyers via Supabase dashboard → UPDATE profiles SET subscription_status = 'active' WHERE email = '...'

---

## Sources

### Primary (HIGH confidence)

- Supabase official docs: `supabase.auth.signInWithOAuth`, `supabase.auth.signInWithPassword`, `supabase.auth.signUp` — https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Auth quickstart for React — https://supabase.com/docs/guides/auth/quickstarts/react
- Supabase Stripe Webhooks guide — https://supabase.com/docs/guides/functions/examples/stripe-webhooks
- Anthropic SDK TypeScript (GitHub) — https://github.com/anthropics/anthropic-sdk-typescript
- Stripe Customer Portal docs — https://docs.stripe.com/customer-management
- Vercel Vite framework guide — https://vercel.com/docs/frameworks/frontend/vite
- Direct codebase audit: `/root/projects/personal/flow-year-coach/src/` — all hooks, contexts, types, pages

### Secondary (MEDIUM confidence)

- Stripe+Supabase+Next.js integration pattern — https://dev.to/alexzrlu/nextjs-supabase-stripe-subscriptions-integration-818 (Next.js pattern, adapted for Vite/React)
- Supabase + Vercel env var handling — https://medium.com/@focusgid/handling-environment-variables-in-vite-with-react-and-supabase-eaa4b3c9a0a4

### Tertiary (LOW confidence — verify at implementation)

- Stripe `redirectToCheckout` deprecation status: based on search results suggesting session URL approach is current; verify against official Stripe changelog
- `@anthropic-ai/sdk` version for Deno/Edge Function compatibility: confirm `npm:@anthropic-ai/sdk` works in Deno via npm specifier at implementation time

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all packages verified in package.json, Supabase version ^2.98.0 confirmed
- Architecture: HIGH — patterns from official docs + direct codebase audit
- DB schema: HIGH — existing tables verified in supabase.ts; new tables designed from type definitions in types/index.ts
- Stripe integration: MEDIUM-HIGH — official Stripe docs + verified implementation guide; exact Deno npm specifier for Edge Functions should be confirmed at implementation
- Claude API: MEDIUM — official Anthropic SDK pattern confirmed; Deno compatibility is standard but confirm `npm:` specifier works in current Supabase Edge Function runtime
- Pitfalls: HIGH — based on direct code review + official security docs

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable ecosystem; Stripe and Supabase APIs are stable)
