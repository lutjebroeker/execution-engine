---
phase: 03-web-app-pro-tier
plan: 01
subsystem: auth
tags: [supabase, react, typescript, tanstack-query, dual-write, oauth]

requires:
  - phase: []
    provides: []

provides:
  - AuthContext with email+password, Google OAuth, password reset (alongside existing magic link)
  - SubscriptionContext providing isPro boolean from profiles.subscription_status
  - useSubscription hook (TanStack Query, 5-min cache)
  - Login page with 3 tabs: Magic link, Email+password, Google
  - UpdatePassword page at /update-password (post-reset-email flow)
  - 5 hooks migrated to dual-write: useCheckIns, useFlowSessions, useWeeklyReflections, useTwelveWeekReview, useTwelveWeekCycle
  - Goal.tactics (renamed from weeklyActions) — all 9+ consumer files updated
  - SQL migration for 4 new tables: check_ins, flow_sessions, weekly_reflections, twelve_week_reviews

affects: [03-02-stripe, 03-03-ai, 03-04-deploy]

tech-stack:
  added: [TanStack Query mutations (useMutation, useQueryClient), Supabase signInWithPassword, signInWithOAuth]
  patterns:
    - "Dual-write: isPro check -> Supabase path; else -> localStorage path"
    - "SubscriptionContext wraps AuthProvider, drives all Pro gating"
    - "useIsPro() = subscription_status === 'active' from profiles table"

key-files:
  created:
    - src/contexts/SubscriptionContext.tsx
    - src/hooks/useSubscription.ts
    - src/pages/UpdatePassword.tsx
  modified:
    - src/contexts/AuthContext.tsx
    - src/lib/supabase.ts
    - src/pages/Login.tsx
    - src/App.tsx
    - src/hooks/useCheckIns.ts
    - src/hooks/useFlowSessions.ts
    - src/hooks/useWeeklyReflections.ts
    - src/hooks/useTwelveWeekReview.ts
    - src/hooks/useTwelveWeekCycle.ts
    - src/types/index.ts

key-decisions:
  - "isPro derived from profiles.subscription_status === 'active'; never hardcoded"
  - "useIsPro() uses TanStack Query with 5-min staleTime to avoid N+1 Supabase calls"
  - "useTwelveWeekCycle uses legacy aliases (addWeeklyAction etc.) temporarily removed after all consumers updated in same task"
  - "Reflectie.tsx useLocalStorage('flow-coach-reflections') replaced with useWeeklyReflections() hook"
  - "Checkpoint requires user to run SQL migration + enable Google OAuth in Supabase Dashboard"

patterns-established:
  - "Dual-write pattern: isPro && user -> Supabase mutation; else -> setLocalStorage"
  - "All hooks return same public API regardless of storage path (pages require zero changes)"
  - "TanStack Query invalidateQueries after every Supabase mutation"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DATA-01, DATA-02, DATA-03, DATA-04]

duration: 7min
completed: 2026-03-14
---

# Phase 03 Plan 01: Auth Extension + Data Migration Summary

**Multi-auth (email+password, Google OAuth, magic link) + 5-hook dual-write migration to Supabase with isPro gating + Goal.tactics schema rename across entire codebase**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-14T08:27:37Z
- **Completed:** 2026-03-14T08:34:37Z
- **Tasks:** 3 (checkpoint pending — human must run SQL migration + verify UI)
- **Files modified:** 18

## Accomplishments

- Extended AuthContext with 4 new methods while keeping magic link intact
- Created SubscriptionContext + useIsPro() hook powering all Pro gating
- Built 3-tab Login page and /update-password page
- Migrated 5 data hooks to dual-write pattern (Supabase for Pro, localStorage for free)
- Renamed Goal.weeklyActions -> Goal.tactics across all 9+ consumer files with zero TypeScript errors

## Task Commits

1. **Task 1: DB types, AuthContext extension, SubscriptionContext** - `ce2ccad` (feat)
2. **Task 2: 3-tab login, UpdatePassword, 4 migrated hooks** - `9dcf510` (feat)
3. **Task 3: migrate useTwelveWeekCycle + weeklyActions -> tactics** - `d4a3821` (feat)

## Files Created/Modified

- `src/lib/supabase.ts` - Added 4 new table types + subscription columns on profiles
- `src/contexts/AuthContext.tsx` - Added signInWithPassword, signUp, signInWithGoogle, resetPassword
- `src/hooks/useSubscription.ts` - TanStack Query hook for profiles.subscription_status
- `src/contexts/SubscriptionContext.tsx` - Provides isPro, subscriptionStatus, isLoading
- `src/pages/Login.tsx` - 3-tab interface: Magic link / Email+password / Google
- `src/pages/UpdatePassword.tsx` - Post-reset password update form at /update-password
- `src/App.tsx` - Added SubscriptionProvider + /update-password route
- `src/hooks/useCheckIns.ts` - Dual-write against Supabase check_ins table
- `src/hooks/useFlowSessions.ts` - Dual-write against Supabase flow_sessions table
- `src/hooks/useWeeklyReflections.ts` - Dual-write against Supabase weekly_reflections table
- `src/hooks/useTwelveWeekReview.ts` - Dual-write against Supabase twelve_week_reviews table
- `src/hooks/useTwelveWeekCycle.ts` - Dual-write against existing Supabase cycles table
- `src/types/index.ts` - WeeklyAction -> Tactic, Goal.weeklyActions -> Goal.tactics
- All 9 consumer files (pages + components + hooks) updated for tactics rename

## Decisions Made

- isPro gated strictly on `profiles.subscription_status === 'active'` (never hardcoded or faked)
- useIsPro() uses 5-min staleTime to avoid hammering Supabase on every render
- Legacy method aliases (addWeeklyAction etc.) kept temporarily in useTwelveWeekCycle then removed in same task after all consumers updated
- Reflectie.tsx switched from useLocalStorage directly to useWeeklyReflections hook

## Deviations from Plan

None — plan executed exactly as written, including the Reflectie.tsx localStorage-to-hook switch noted in the anti-patterns section.

## User Setup Required

**The following must be done manually before the checkpoint passes:**

1. Run the migration SQL in Supabase SQL Editor (printed to console by Task 1 — see below)
2. Enable Google provider in Supabase Dashboard: Authentication → Providers → Google → enable + paste Google Client ID + Secret
3. Create Google OAuth client in Google Cloud Console (APIs & Services → Credentials → OAuth 2.0 Client), add redirect URI: `https://gbmjsctlzothdbrlnzip.supabase.co/auth/v1/callback`

### Migration SQL

```sql
-- Add subscription columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'active', 'canceled', 'past_due')),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;

-- check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('morning', 'evening')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users see own check_ins" ON check_ins FOR ALL USING (auth.uid() = user_id);

-- flow_sessions table
CREATE TABLE IF NOT EXISTS flow_sessions (
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
CREATE POLICY IF NOT EXISTS "Users see own flow_sessions" ON flow_sessions FOR ALL USING (auth.uid() = user_id);

-- weekly_reflections table
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  completion_score INT,
  what_worked_well TEXT,
  what_didnt_work TEXT,
  what_distracted TEXT,
  what_must_change TEXT,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cycle_id, week_number)
);
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users see own weekly_reflections" ON weekly_reflections FOR ALL USING (auth.uid() = user_id);

-- twelve_week_reviews table
CREATE TABLE IF NOT EXISTS twelve_week_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  goals_achieved JSONB DEFAULT '[]',
  biggest_wins TEXT,
  biggest_challenges TEXT,
  key_lessons TEXT,
  next_cycle_priorities TEXT,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cycle_id)
);
ALTER TABLE twelve_week_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users see own twelve_week_reviews" ON twelve_week_reviews FOR ALL USING (auth.uid() = user_id);
```

## Self-Check: PASSED

- FOUND: src/contexts/SubscriptionContext.tsx
- FOUND: src/hooks/useSubscription.ts
- FOUND: src/pages/UpdatePassword.tsx
- FOUND: 03-01-SUMMARY.md
- FOUND: commit ce2ccad (Task 1)
- FOUND: commit 9dcf510 (Task 2)
- FOUND: commit d4a3821 (Task 3)
