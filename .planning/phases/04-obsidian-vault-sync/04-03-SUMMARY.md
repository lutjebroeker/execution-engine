---
phase: 04-obsidian-vault-sync
plan: "03"
subsystem: data-hooks
tags: [react, tanstack-query, vault-sync, obsidian, fire-and-forget, supabase]

requires:
  - phase: 04-01
    provides: "VaultContext (writeNote, obsidianMode), buildCheckInNote, buildFlowSessionNote, buildReflectionNote, buildWeeklyPlanNote, buildGoalNote, buildReviewNote, buildVisionNote"
  - phase: 04-02
    provides: "VaultProvider wired into App.tsx React tree"
provides:
  - All 7 data hooks fire vault writes after successful Supabase mutations when obsidianMode is true
  - Live Obsidian sync pipeline complete — every save action mirrors to vault folder
affects: []

tech-stack:
  added: []
  patterns: [fire-and-forget-vault-write, async-onSuccess-with-cycle-lookup, obsidianMode-guard]

key-files:
  created: []
  modified:
    - /root/projects/flow-year-coach/src/hooks/useCheckIns.ts
    - /root/projects/flow-year-coach/src/hooks/useFlowSessions.ts
    - /root/projects/flow-year-coach/src/hooks/useWeeklyReflections.ts
    - /root/projects/flow-year-coach/src/hooks/useTwelveWeekReview.ts
    - /root/projects/flow-year-coach/src/hooks/useActiveCycle.ts
    - /root/projects/flow-year-coach/src/hooks/useVision.ts
    - /root/projects/flow-year-coach/src/hooks/useWeeklyPlans.ts

key-decisions:
  - "insertMutation in useFlowSessions upgraded to return row via .select().single() — enables startTime/id for vault path"
  - "useCheckIns addMutation already returned row — onSuccess updated to receive CheckIn and use its date/type/data fields"
  - "updateMutation in useTwelveWeekReview fetches review row by reviewId to retrieve cycleId before cycle lookup"
  - "useUpdateCycle fetches full cycle after update to iterate all goals — input may contain partial goals only"
  - "Async onSuccess pattern used for reflections, reviews, weekly plans — TanStack Query supports async onSuccess natively"

patterns-established:
  - "Cycle start_date lookup pattern: async onSuccess fetches supabase.from('cycles').select('start_date').eq('id', cycleId).single() — used in 3 hooks"
  - "Fire-and-forget pattern: writeNote(path, content).catch(err => console.warn('[vault] ...', err)) — never awaited in data hook onSuccess"
  - "obsidianMode guard: if (obsidianMode) { ... } wraps all vault operations — zero vault activity when mode is Cloud"

requirements-completed: []

duration: ~3min
completed: "2026-03-21"
---

# Phase 04 Plan 03: Callsite Wiring — Vault Writes in All Data Hooks Summary

**7 data hooks wired with fire-and-forget vault writes — every Supabase mutation now mirrors to Obsidian vault when obsidianMode is enabled, completing the live-sync pipeline.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-21T10:39:17Z
- **Completed:** 2026-03-21T10:42:17Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- useCheckIns, useFlowSessions, useWeeklyReflections wired with vault writes (Task 1)
- useTwelveWeekReview, useActiveCycle, useVision, useWeeklyPlans wired with vault writes (Task 2)
- All 7 hooks follow the identical pattern: obsidianMode guard → build note → fire-and-forget writeNote().catch()
- Build passes with zero TypeScript errors after all modifications
- Phase 4 goal achieved: Pro users with Obsidian sync enabled see all saves automatically written as .md files

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire vault writes into useCheckIns, useFlowSessions, useWeeklyReflections** - `93f2987` (feat)
2. **Task 2: Wire vault writes into useTwelveWeekReview, useActiveCycle, useVision, useWeeklyPlans** - `c4c71b2` (feat)

## Files Created/Modified

- `/root/projects/flow-year-coach/src/hooks/useCheckIns.ts` - addMutation.onSuccess fires buildCheckInNote + writeNote using returned CheckIn row
- `/root/projects/flow-year-coach/src/hooks/useFlowSessions.ts` - insertMutation upgraded to return row; onSuccess fires buildFlowSessionNote
- `/root/projects/flow-year-coach/src/hooks/useWeeklyReflections.ts` - upsertMutation.onSuccess async; fetches cycle.start_date then fires buildReflectionNote
- `/root/projects/flow-year-coach/src/hooks/useTwelveWeekReview.ts` - insertMutation.onSuccess fires buildReviewNote; updateMutation.onSuccess fetches review+cycle then fires buildReviewNote
- `/root/projects/flow-year-coach/src/hooks/useActiveCycle.ts` - useUpdateCycle.onSuccess fetches full cycle, iterates goals, fires buildGoalNote for each
- `/root/projects/flow-year-coach/src/hooks/useVision.ts` - saveMutation.onSuccess fires buildVisionNote with mutation vars
- `/root/projects/flow-year-coach/src/hooks/useWeeklyPlans.ts` - useSaveWeeklyPlan.onSuccess fetches cycle.start_date then fires buildWeeklyPlanNote

## Decisions Made

- insertMutation in useFlowSessions previously returned void — upgraded to `.select().single()` to get the inserted row (needed for `startTime` and `id` for vault path generation)
- useTwelveWeekReview updateMutation: fetches review row by `reviewId` to retrieve `cycleId`, then looks up cycle `start_date` — two sequential async calls in onSuccess but fire-and-forget from caller's perspective
- useActiveCycle (useUpdateCycle): fetches full cycle post-update to ensure `goals` array and both `start_date`/`end_date` are available for `buildGoalNote`
- Async onSuccess in TanStack Query: used for 4 hooks where cycle start_date lookup is required — TanStack Query handles async onSuccess natively without issues

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 4 is now complete: vault infrastructure (04-01), settings UI (04-02), and callsite wiring (04-03) all done
- Pro users can enable Obsidian sync in Settings, select their vault folder, and every save action in the app will write .md files to the vault automatically
- No further phases planned for this feature

---
*Phase: 04-obsidian-vault-sync*
*Completed: 2026-03-21*

## Self-Check: PASSED

Files verified:
- FOUND: /root/projects/flow-year-coach/src/hooks/useCheckIns.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useFlowSessions.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useWeeklyReflections.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useTwelveWeekReview.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useActiveCycle.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useVision.ts
- FOUND: /root/projects/flow-year-coach/src/hooks/useWeeklyPlans.ts

Commits verified:
- FOUND: 93f2987 (feat(04-03): wire vault writes into useCheckIns, useFlowSessions, useWeeklyReflections)
- FOUND: c4c71b2 (feat(04-03): wire vault writes into useTwelveWeekReview, useActiveCycle, useVision, useWeeklyPlans)
