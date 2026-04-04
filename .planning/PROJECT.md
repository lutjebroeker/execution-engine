# Engine Ecosystem

## What This Is

The Engine Ecosystem is a multi-tenant SaaS accountability platform built on the 12 Week Year methodology. Clients get an AI agent (via Telegram) that confronts them daily with their execution score — a real number, not a feeling. The system runs on shared infrastructure (one n8n instance, one Supabase project), scales to hundreds of clients, and gets smarter as more clients use it.

## Core Value

From knowing what to do to actually doing it — measured, not felt. The execution score is the product.

## Current Milestone: v2.0 — Engine Ecosystem Multi-tenant SaaS

**Goal:** Build a multi-tenant AI accountability system that goes from Stripe payment to first execution score in under 10 minutes, and runs autonomously for every client.

**Target features:**
- Multi-tenant Supabase schema (tenants, goals, daily_priorities, weekly_reviews, conversations, memory) with RLS
- Telegram bot: self-service onboarding (/start → intake → live in minutes), Claude API tool-use agent, 3 cron loops
- Publish Engine: Postiz on Proxmox, draft generation + scheduled publishing workflows
- Scorecard wiring: score_submissions table, Vercel env vars, n8n webhook
- Stripe integration: checkout → webhook → tenant created → Telegram link sent
- Landing page updated: monthly pricing (€97/€197/€497), "Start 14-day free trial" CTA

## Requirements

### Validated (from v1.0)

- ✓ Claude API with tool-use is the right AI architecture — Phase 3
- ✓ Supabase as data layer — Phase 3
- ✓ Telegram as primary client interaction channel — Phase 2 (AM bundle)
- ✓ n8n on Proxmox as orchestration — Phase 2
- ✓ engine-site (Astro + Tailwind) as landing page — Phase 1

### Active (v2.0)

**Infrastructure:**
- [ ] INFRA-01: Multi-tenant Supabase schema deployed with RLS
- [ ] INFRA-02: n8n running on Proxmox with Cloudflare Tunnel (public webhook URL)

**Telegram Bot / EE Core:**
- [ ] BOT-01: Telegram bot created, connected to n8n webhook
- [ ] BOT-02: Messages routed to correct tenant via chat_id → tenant_id lookup
- [ ] BOT-03: Claude API tool-use agent processes messages (manage_goal, log_progress, get_goals_overview, save_memory, search_memory)
- [ ] BOT-04: Self-service /start onboarding: intake → tenant row created → "system live" confirmation
- [ ] CRON-01: Morning briefing cron (07:00) loops all active tenants
- [ ] CRON-02: Accountability check-in cron (17:00) loops all active tenants
- [ ] CRON-03: Weekly review cron (Sunday 18:00): execution score + pattern analysis per tenant
- [ ] EE-01: 12-week goal tracking with milestones via Claude tools
- [ ] EE-02: Weekly execution score stored in weekly_reviews
- [ ] EE-03: Pattern detection across weeks per tenant

**Scorecard:**
- [ ] SCORE-01: score_submissions table in Supabase + Vercel env vars set
- [ ] SCORE-02: n8n webhook processes scorecard submissions (Telegram notification to Jelle)
- [ ] SCORE-03: Cal.com booking link set in engine-site config.ts

**Publish Engine:**
- [ ] PUB-01: Postiz deployed on Proxmox (Docker, LinkedIn + X OAuth connected)
- [ ] PUB-02: n8n draft generation workflow (idea → Claude → content_items)
- [ ] PUB-03: n8n scheduled publishing workflow (cron → Postiz → published_posts)
- [ ] PUB-04: Brand voice migrated from Ziplined to Claude system prompt

**Stripe + Launch:**
- [ ] STRIPE-01: Stripe products created for CORE (€97/mo) and GUIDED (€197/mo) with 14-day trial
- [ ] STRIPE-02: Stripe checkout → webhook → tenant row created → Telegram bot link sent
- [ ] LAND-01: Landing page pricing updated to monthly tiers (€97/€197/€497)
- [ ] LAND-02: CTA changed to "Start 14-day free trial"
- [ ] LAND-03: Old execution-engine site archived, redirect to engine-site

**Scale + IE:**
- [ ] IE-01: IE MVP — RSS/YouTube/Reddit scraping + Ollama scoring + weekly briefing
- [ ] LEARN-01: Self-learning pattern aggregator (cross-client → system_patterns table monthly)
- [ ] LEARN-02: System prompt update workflow based on pattern insights

### Out of Scope (v2.0)

- WhatsApp integration — costs money, Telegram is free
- Mobile app — Telegram IS the mobile app
- Custom branding per client — DEDICATED tier only, not building speculatively
- Admin dashboard — manage via Supabase UI until 20+ clients
- YouTube/Instagram/TikTok — until LinkedIn + X work
- DEDICATED infrastructure (Cloud VPS/Mac Mini/On-Premise) — don't build until client pays for it
- Multi-tenant IE hype filter revalidation — until IE MVP works
- Keystone extraction via vault — nice-to-have for GUIDED, not MVP

---

## Context

**Architecture:** One system, all clients. Multi-tenant via `tenant_id` column + Supabase RLS on every table. n8n on Proxmox handles all webhooks and crons. Claude API with tool-use is the AI layer — new features = edit system prompt, not new workflows. Clients never touch n8n.

**Pricing tiers:**
- CORE €97/mo — self-service, fully automated
- GUIDED €197/mo — intake call + 2 training calls + priority support
- FULL STACK €497/mo — IE + PE add-ons
- DEDICATED €2,497+ one-time — Cloud VPS/Mac Mini/On-Premise (build on demand only)

**Self-learning moat:** All client data in one Supabase project → cross-client pattern detection → monthly system prompt updates. Every client makes the system better for all clients.

**Validation gate (before scaling):** 150 LinkedIn connections → 30 scorecard completions → 10 conversations → 3 "I'd pay." Track this before Phase 8 execution.

**Repos:**
- `lutjebroeker/engine-site` — Primary landing page + scorecard (Astro + Tailwind, live)
- `lutjebroeker/execution-engine` — Planning repo (this repo, to be archived after v2.0)
- `lutjebroeker/engine-infra` — Docker configs + client deploy scripts (create in Phase 6)
- `lutjebroeker/flow-year-coach` — EE App (React, rebranding later)

## Constraints

- **Time:** Max 10 hrs/week steady-state. First 6 weeks: 15 hrs/week sprint.
- **Infra:** Proxmox (self-owned). n8n already running at n8n.jellespek.nl.
- **Solo operator:** CORE tier must be 100% automated — zero Jelle time per client.
- **Claude API:** Sonnet for all standard operations. Batch non-critical to stay within cost.
- **No per-client servers:** Multi-tenant only. DEDICATED is a sell-first, build-after product.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-tenant SaaS (not per-client VPS) | Scales to hundreds, enables self-learning, setup cost = 0 for CORE | ✓ v2.0 architecture |
| Monthly subscriptions (not one-time) | Lower barrier, predictable MRR, aligns incentives (client stays = system improves) | ✓ €97/€197/€497/mo |
| Claude API tool-use (not workflow spaghetti) | New feature = edit system prompt. No new workflows. | ✓ Core agent pattern |
| One Supabase project, multi-tenant via RLS | Cross-client learning only possible with shared DB | ✓ self-learning moat |
| Telegram (not WhatsApp/Slack) | Free API, zero infrastructure, mobile native | ✓ Primary channel |
| Postiz for publishing (self-hosted, AGPL) | 30+ platforms, Docker, pin v2.11.3 | ✓ Phase 7 |
| engine-site as primary landing page | Already live, Astro + Tailwind, just needs pricing update | ✓ No rebuild |
| Start with 2+ weeks dogfooding before pilots | Product IS the proof. Can't sell what you don't run. | ✓ Phase 6 gate |

---
*Last updated: 2026-04-04 after v2.0 milestone start*
