---
phase: 03-web-app-pro-tier
plan: 03
subsystem: ai
tags: [anthropic, claude, supabase-edge-functions, deno, react, pro-gating]

# Dependency graph
requires:
  - phase: 03-01
    provides: SubscriptionContext, useSubscriptionContext, profiles.subscription_status, weekly_reflections table with ai_analysis column, twelve_week_reviews table with ai_analysis column
  - phase: 03-02
    provides: ProGate component for gating AI UI sections
provides:
  - Three Supabase Edge Functions (ai-weekly-reflection, ai-morning-nudge, ai-cycle-review) calling Claude via Anthropic SDK
  - AI analysis section in Reflectie.tsx (weekly reflection coaching, Pro-gated)
  - AI morning nudge card in Dashboard.tsx (loads on mount for Pro users with active cycle)
  - AI cycle analysis section in TwelveWeekReview.tsx (cycle review coaching, Pro-gated)
  - Server-side Pro verification in all Edge Functions (subscription_status check, 403 if not active)
affects: [03-04]

# Tech tracking
tech-stack:
  added: [npm:@anthropic-ai/sdk (Deno Edge Functions), npm:date-fns (ai-morning-nudge)]
  patterns:
    - "Edge Function security pattern: OPTIONS handler → getUser() → profiles Pro check → fetch data → call Claude → return result"
    - "AI state pattern: check cached aiAnalysis from DB first, else show generate button with loading/error states"
    - "Morning nudge is ephemeral (not persisted), weekly reflection and cycle analysis are saved back to DB via admin client"

key-files:
  created:
    - supabase/functions/ai-weekly-reflection/index.ts
    - supabase/functions/ai-morning-nudge/index.ts
    - supabase/functions/ai-cycle-review/index.ts
  modified:
    - src/pages/Reflectie.tsx
    - src/pages/Dashboard.tsx
    - src/pages/TwelveWeekReview.tsx
    - src/types/index.ts
    - src/hooks/useWeeklyReflections.ts
    - src/hooks/useTwelveWeekReview.ts

key-decisions:
  - "Morning nudge is ephemeral — not persisted to DB, refreshes each page load for freshness"
  - "Weekly reflection and cycle analysis saved via admin (service role) client so client JWT limitation does not block DB write"
  - "All Edge Functions use getUser() not getSession() — security requirement for Supabase Edge"
  - "ai_analysis field added to WeeklyReflection and TwelveWeekReview TypeScript interfaces (deviation fix) to enable cached display"
  - "model: claude-opus-4-5, max_tokens: 1024 for all three AI endpoints"

patterns-established:
  - "AI Coach badge: Sparkles icon + 'AI Coach' label in text-[#1D4ED8], consistent across all pages"
  - "AI card style: ee-card border-l-4 border-[#1D4ED8] with italic text for AI output"
  - "Loading state: animate-spin Loader2 with 'Analysing...' text (or shimmer lines for Dashboard nudge)"
  - "Error state: muted text + Retry button"

requirements-completed: [AI-01, AI-02, AI-03]

# Metrics
duration: 4min
completed: 2026-03-17
---

# Phase 3 Plan 03: AI Coaching Integration Summary

**Three Supabase Edge Functions calling claude-opus-4-5 for weekly reflection analysis, morning nudge, and 12-week cycle review — all server-side Pro-verified, surfaced in Reflectie, Dashboard, and TwelveWeekReview pages behind ProGate**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-17T16:15:05Z
- **Completed:** 2026-03-17T16:19:17Z
- **Tasks:** 2/2
- **Files modified:** 9

## Accomplishments

- Three Deno Edge Functions implement full security pipeline: CORS → getUser() auth → subscription_status Pro check (403) → data fetch → Claude call → response
- ANTHROPIC_API_KEY never in browser bundle — only Deno.env.get in Edge Function scope
- Consistent AI coaching UI: ProGate wrapper, AI Coach badge, border-l-4 card, loading/error states on all three pages

## Task Commits

1. **Task 1: Three AI Edge Functions** - `6a2e383` (feat)
2. **Task 2: AI sections in Reflectie, Dashboard, TwelveWeekReview pages** - `d15380f` (feat)

## Files Created/Modified

- `supabase/functions/ai-weekly-reflection/index.ts` - Edge Function: Pro check, fetch reflection + goals, Claude analysis, save to weekly_reflections.ai_analysis
- `supabase/functions/ai-morning-nudge/index.ts` - Edge Function: Pro check, fetch goals + daily notes, Claude nudge (ephemeral)
- `supabase/functions/ai-cycle-review/index.ts` - Edge Function: Pro check, fetch full cycle + reflections + review, Claude analysis, save to twelve_week_reviews.ai_analysis
- `src/pages/Reflectie.tsx` - AI analysis section below ExistingReflectionView, Pro-gated, cached from aiAnalysis field
- `src/pages/Dashboard.tsx` - AI morning nudge card below stats row, useEffect load on mount for Pro+cycle
- `src/pages/TwelveWeekReview.tsx` - AI cycle analysis section in completed review view, Pro-gated
- `src/types/index.ts` - Added aiAnalysis field to WeeklyReflection and TwelveWeekReview interfaces
- `src/hooks/useWeeklyReflections.ts` - mapRowToReflection now maps ai_analysis field
- `src/hooks/useTwelveWeekReview.ts` - mapRowToReview now maps ai_analysis field

## Decisions Made

- Morning nudge is ephemeral — not saved to DB, because it's personalized per-day context and should feel fresh
- Weekly reflection and cycle analysis are saved back via admin (service role) client — allows caching and avoids re-calling Claude on page refresh
- Server-side Pro check always uses admin client to read profiles.subscription_status — client-side isPro is UX convenience only

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added aiAnalysis field to WeeklyReflection and TwelveWeekReview TypeScript interfaces**
- **Found during:** Task 2 (AI sections in pages)
- **Issue:** Plan references `existingReflection.ai_analysis` and `review.ai_analysis` for cached display, but WeeklyReflection and TwelveWeekReview TypeScript interfaces lacked the field. Supabase DB types already had it. Would cause TypeScript compilation errors.
- **Fix:** Added `aiAnalysis?: string | null` to both interfaces in `src/types/index.ts`. Updated `mapRowToReflection` and `mapRowToReview` to map the `ai_analysis` DB column to `aiAnalysis`.
- **Files modified:** src/types/index.ts, src/hooks/useWeeklyReflections.ts, src/hooks/useTwelveWeekReview.ts
- **Verification:** npm run build passes without TypeScript errors
- **Committed in:** d15380f (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Essential fix for correct TypeScript operation. No scope creep.

## Issues Encountered

None.

## User Setup Required

**ANTHROPIC_API_KEY must be configured as a Supabase Edge Function secret before AI features work:**

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

The three Edge Functions (`ai-weekly-reflection`, `ai-morning-nudge`, `ai-cycle-review`) must be deployed:
```bash
supabase functions deploy ai-weekly-reflection
supabase functions deploy ai-morning-nudge
supabase functions deploy ai-cycle-review
```

## Next Phase Readiness

- AI coaching features complete and Pro-gated
- Ready for 03-04 production deployment
- ANTHROPIC_API_KEY secret must be set in Supabase before deploying

---
*Phase: 03-web-app-pro-tier*
*Completed: 2026-03-17*
