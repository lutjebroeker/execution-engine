---
phase: 06-multi-tenant-ee-core
plan: "03"
subsystem: n8n-crons
tags: [n8n, cron, telegram, supabase, accountability, claude, morning-briefing, weekly-review]

requires:
  - 06-01

provides:
  - n8n cron workflow: 07:00 Europe/Amsterdam daily morning briefing with AI-selected top 3 priorities
  - n8n cron workflow: 17:00 Europe/Amsterdam daily accountability check-in per named priority
  - n8n cron workflow: Sunday 18:00 Europe/Amsterdam weekly review with real execution score + narrative pattern

affects:
  - 06-02 (check-in response handling integrates with telegram-bot-agent)
  - 06-04

tech-stack:
  added: []
  patterns:
    - "Schedule Trigger → Get Active Tenants → SplitInBatches(1) → per-tenant logic — three crons share this pattern"
    - "claude-haiku-4-5 for cron AI calls (fast + low cost)"
    - "Supabase upsert with Prefer: resolution=merge-duplicates for idempotent daily_priorities + weekly_reviews rows"
    - "Execution score: completed/total as percentage (binary per priority)"
    - "Loop continues via SplitInBatches node feedback — new tenants auto-included without workflow changes"

key-files:
  created:
    - n8n/workflows/cron-morning-briefing.json
    - n8n/workflows/cron-accountability-checkin.json
    - n8n/workflows/cron-weekly-review.json
  modified: []

key-decisions:
  - "Use SplitInBatches(batchSize=1) for tenant loop — most robust n8n pattern for sequential per-item processing"
  - "Check-in response handling deferred to 06-02 (telegram-bot-agent) — 06-03 only sends the check-in message, bot agent handles replies"
  - "claude-haiku-4-5 chosen over claude-haiku-3-5 (same cost tier, newer) for both briefing and weekly review generation"
  - "Weekly score = average of all daily execution_score values that week (days without check-in excluded from average)"

requirements-completed: [CRON-01, CRON-02, CRON-03]

duration: 2min
completed: 2026-04-04
---

# Phase 6 Plan 03: Accountability Cron Workflows Summary

**Three n8n cron workflows — 07:00 morning briefing, 17:00 accountability check-in, Sunday 18:00 weekly review — transform the bot from a chatbot into a proactive accountability engine**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-04T12:18:55Z
- **Completed:** 2026-04-04T12:20:04Z
- **Tasks:** 2
- **Files created:** 3

## Accomplishments

- Built morning briefing cron (07:00 Amsterdam): fetches active tenants, goals, yesterday's score → calls claude-haiku → parses out 3 priorities → upserts `daily_priorities` row → sends Telegram → logs to conversations
- Built accountability check-in cron (17:00 Amsterdam): fetches active tenants → looks up today's `daily_priorities` → builds named-priority check-in message → sends Telegram → stamps `checkin_sent_at`; skips tenants with no briefing row
- Built weekly review cron (Sunday 18:00 Amsterdam): calculates Mon-Sun boundaries → fetches daily execution data + last 3 weekly_reviews → averages scores + identifies worst days → calls Claude for narrative pattern → upserts `weekly_reviews` → sends Telegram with score + observation
- All three workflows use `SplitInBatches(batchSize=1)` — new tenants are automatically included on next cron fire without any workflow changes

## Task Commits

1. **Task 1: Morning briefing cron + accountability check-in cron** - `e17fc4d` (feat)
2. **Task 2: Weekly review cron** - `47c44a5` (feat)

## Files Created

- `n8n/workflows/cron-morning-briefing.json` — 11 nodes: Schedule(07:00) → Get Tenants → Loop → Get Goals → Get Yesterday → Build Prompt → Claude → Parse Priorities → Upsert daily_priorities → Send Telegram → Save Conversations
- `n8n/workflows/cron-accountability-checkin.json` — 10 nodes: Schedule(17:00) → Get Tenants → Loop → Get Today Priorities → IF(has row) → Build Message → Send Telegram → Update checkin_sent_at → Skip/Continue loop
- `n8n/workflows/cron-weekly-review.json` — 13 nodes: Schedule(Sunday 18:00) → Get Tenants → Loop → Week Boundaries → Get Daily Priorities → Get Previous Reviews → Calculate Score → Claude → Upsert weekly_reviews → Build Message → Send Telegram → Save Conversations → Continue Loop

## Decisions Made

- `SplitInBatches(batchSize=1)` with loop-back connection — most reliable n8n pattern for processing multiple tenants sequentially; avoids rate limit spikes
- Check-in response handling (parsing "1 3", "all", "none" replies and updating `completed` fields + `execution_score`) is in scope for 06-02 (telegram-bot-agent), not this plan. The cron only sends the check-in; reply routing is the bot agent's job.
- Weekly execution score computed as average of daily scores only for days where `execution_score IS NOT NULL` — days without a check-in don't dilute the average
- Score thresholds implemented as specified: 70%+ = "Strong week.", 50-70% = "Decent week.", <50% = "Below target."

## Deviations from Plan

None — all three workflows implemented exactly per plan spec. The check-in response handler note in Task 1 was correctly scoped to 06-02 (telegram-bot-agent.json), which is a separate parallel-wave plan.

## Next Phase Readiness

- Cron workflows ready to import into n8n via UI (Settings → Import → paste JSON)
- All three set `active: true` — will fire on schedule once imported and n8n instance has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN in environment
- Morning briefing will write to `daily_priorities` — 06-02 check-in response handler can read from this table
- Weekly review reads from `weekly_reviews` written by this cron — proof-of-value metric for dogfooding period

## Self-Check: PASSED

- cron-morning-briefing.json: FOUND
- cron-accountability-checkin.json: FOUND
- cron-weekly-review.json: FOUND
- commit e17fc4d: FOUND
- commit 47c44a5: FOUND
