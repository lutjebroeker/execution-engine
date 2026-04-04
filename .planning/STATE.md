---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Engine Ecosystem Multi-tenant SaaS
status: in_progress
stopped_at: "Completed 06-multi-tenant-ee-core/06-02-PLAN.md"
last_updated: "2026-04-04T12:30:05Z"
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 13
  completed_plans: 3
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-04)

**Core value:** From knowing what to do to actually doing it — measured, not felt. The execution score is the product.
**Current focus:** Phase 6 — Multi-tenant EE Core (next: run /gsd:plan-phase 6)

## Current Position

Phase: 6 — Multi-tenant EE Core
Plan: 06-02 complete (3/4)
Status: In progress — 06-01 + 06-02 + 06-03 complete, 06-04 next
Last activity: 2026-04-04 — 06-02 complete: 40-node Telegram bot + Claude tool-use agent, /start onboarding, 6 Supabase-backed tools

```
[###       ] Phase 6 — Multi-tenant EE Core (3/4 plans)
[          ] Phase 7 — Publish Engine + Scorecard Wiring
[          ] Phase 8 — Stripe + Launch
[          ] Phase 9 — Scale + Intelligence Engine
```

## Previous Milestone

**v1.0 — LifeEngine (Gumroad Bundle)** — completed 2026-03-21
See: .planning/MILESTONES.md

Phases 1–4 completed. Phase 5 (Hosted VPS Package) superseded by multi-tenant architecture.

## Accumulated Context (carried from v1.0)

- n8n already running at n8n.jellespek.nl with Cloudflare Tunnel — INFRA-02 partially satisfied
- Supabase client + schema patterns validated in Phases 3–4 — INFRA-01 is net-new (multi-tenant schema)
- Claude API tool-use pattern proven in Phase 3 (Supabase Edge Functions) — BOT-03 builds on this
- engine-site live at engine-site-six.vercel.app (Astro + Tailwind) — LAND-01/02/03 are updates only
- scorecard (/score) built but not wired to Supabase + n8n yet — SCORE-01/02 complete this
- 22 AM workflows in bundle — ~70% reusable as basis for new Telegram agent
- Proxmox available for n8n + Ollama + Postiz deployments

## Decisions (06-02)

1. Use n8n Webhook node + respondToWebhook for Telegram (not Telegram Trigger) — immediate 200 response required within 5s
2. Onboarding state in n8n staticData keyed by chat_id — avoids tenant_id FK constraint during multi-step onboarding
3. Dual Claude API call pattern — first call for tool selection, second call with tool_result for final user response
4. Returning /start guard: existing tenants receive "You're already set up" instead of triggering new onboarding

## Decisions (06-03)

1. SplitInBatches(batchSize=1) for tenant loop in all 3 cron workflows — most reliable n8n pattern for sequential per-tenant processing
2. Check-in response routing (parsing user replies, updating completed fields + execution_score) deferred to 06-02 (telegram-bot-agent) — crons only send messages
3. Weekly execution score = average of daily scores for days with check-in only; days without check-in excluded from average
4. claude-haiku-4-5 used for both briefing and weekly review generation (fast, low cost)

## Decisions (06-01)

1. Apply migrations via `docker exec` on remote Postgres — port 8032 maps to Supavisor pooler, not raw Postgres
2. `score_submissions` gets RLS enabled with anon INSERT policy — engine-site scorecard submissions don't need auth
3. `system_patterns` has no RLS — internal cross-tenant table, service_role only
4. seed.sql uses `telegram_chat_id=0` placeholder — replace with real chat ID before running `/start`

## Open Decisions

1. Cal.com vs Calendly for GUIDED tier intake booking (SCORE-03)
2. Postiz vs direct API calls for publishing — Postiz recommended (PUB-01)
3. Ollama model for IE scoring — llama3.1:8b confirmed available (IE-01)
4. Brand voice migration: Ziplined → Claude system prompt only (PUB-04)

## Validation Gate (before Phase 8 execution)

150 LinkedIn connections → 30 scorecard completions → 10 conversations → 3 "I'd pay."
Track this during Phase 7 dogfood period before unlocking Phase 8.

---
*Initialized: 2026-04-04*
*Roadmap created: 2026-04-04 (v2.0 — 4 phases, Phases 6–9)*
*Previous milestone: v1.0 (2026-03-01 → 2026-03-21)*
