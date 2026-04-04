# Roadmap: Engine Ecosystem v2.0

## Overview

Four phases that turn a validated single-user system into a multi-tenant SaaS anyone can find, pay for, and run without Jelle. Phase 6 builds the live accountability engine and dogfoods it. Phase 7 wires scorecard conversions and adds the Publish Engine for content-driven growth. Phase 8 closes the loop with Stripe checkout and a launch-ready landing page. Phase 9 adds the Intelligence Engine and self-learning layer that creates the moat.

## Phases

**Phase Numbering:**
- Integer phases (6, 7, 8, 9): Planned milestone work for v2.0
- Decimal phases (6.1, 6.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 6: Multi-tenant EE Core** - Multi-tenant Supabase schema, Telegram bot with Claude tool-use agent, three cron loops, and self-service onboarding — dogfooded by Jelle for 2+ weeks to produce real execution scores
- [ ] **Phase 7: Publish Engine + Scorecard Wiring** - Scorecard submissions land in Supabase, Jelle gets notified and can approve LinkedIn/X posts via Telegram for automatic publishing
- [ ] **Phase 8: Stripe + Launch** - Stripe checkout-to-tenant automation and landing page updates — a stranger can go from post to paying client without Jelle doing anything manually
- [ ] **Phase 9: Scale + Intelligence Engine** - IE MVP briefing delivered weekly to Jelle; self-learning pattern aggregator runs monthly and surfaces actionable system prompt improvements

## Phase Details

### Phase 6: Multi-tenant EE Core
**Goal**: A multi-tenant AI accountability system runs on Proxmox. Jelle uses it himself for 2+ weeks and gets real execution scores. A second user can be added by sharing the Telegram bot link.
**Depends on**: Nothing (first v2.0 phase — n8n and Supabase already running)
**Requirements**: INFRA-01, INFRA-02, BOT-01, BOT-02, BOT-03, BOT-04, CRON-01, CRON-02, CRON-03, EE-01, EE-02, EE-03
**Success Criteria** (what must be TRUE):
  1. Jelle sends /start to the bot, answers 3 intake questions, and receives "Your system is live. First briefing tomorrow at 07:30." — tenant row exists in Supabase with no manual DB edit
  2. At 07:00 Jelle receives a personalized morning briefing tied to his active goals; at 17:00 he receives an accountability check-in — both fire without any manual trigger
  3. On Sunday at 18:00 Jelle receives his weekly execution score (a real percentage, not a placeholder) and a pattern observation about his week
  4. Jelle can tell the bot "add goal: ship Phase 7 by April 30" and it creates the goal; he can ask "what are my goals?" and get an accurate list back
  5. A second person completes /start onboarding via the same bot link and receives their own isolated briefings — Jelle's data is never shown to them
  6. Jelle tells the bot "remember: I do deep work best before 10:00" and it saves to memory; later asking "what do you know about my schedule?" retrieves it — memory persists across sessions
**Plans**: 4 plans

Plans:
- [ ] 06-01-PLAN.md — Supabase multi-tenant schema (9 tables + RLS) + n8n webhook verification
- [ ] 06-02-PLAN.md — Telegram bot + Claude tool-use agent + /start onboarding + 6 agent tools
- [ ] 06-03-PLAN.md — Cron loops: morning briefing (07:00), check-in (17:00), weekly review (Sunday 18:00)
- [ ] 06-04-PLAN.md — EE feature verification: goal lifecycle, execution scoring, pattern detection

### Phase 7: Publish Engine + Scorecard Wiring
**Goal**: Scorecard submissions land in Supabase. Jelle can approve a LinkedIn/X post via Telegram and it publishes automatically.
**Depends on**: Phase 6 (Supabase schema and n8n webhooks must be live)
**Requirements**: SCORE-01, SCORE-02, SCORE-03, PUB-01, PUB-02, PUB-03, PUB-04
**Success Criteria** (what must be TRUE):
  1. Someone fills in the engine-site scorecard and submits — within 60 seconds Jelle receives a Telegram message showing their score, tier, and email address
  2. The score_submissions row exists in Supabase with the correct values — Jelle can query it without any manual import
  3. The GUIDED tier "Book a call" link on engine-site opens a working booking page (Cal.com or Calendly) — not a placeholder
  4. Jelle types a content idea into a dedicated Telegram conversation, the draft generation workflow fires, and a LinkedIn post draft appears in Supabase with status: draft
  5. Jelle approves the draft (sets status: approved) and within 15 minutes the post is published to LinkedIn and X via Postiz — with no further manual action
**Plans**: TBD

Plans:
- [ ] 07-01: Scorecard wiring — score_submissions table, Vercel env vars, n8n webhook, Cal.com link (SCORE-01, SCORE-02, SCORE-03)
- [ ] 07-02: Postiz deploy + OAuth (PUB-01)
- [ ] 07-03: Draft generation + brand voice migration (PUB-02, PUB-04)
- [ ] 07-04: Scheduled publishing workflow (PUB-03)

### Phase 8: Stripe + Launch
**Goal**: A stranger can go from LinkedIn post → scorecard → free trial → paying client without Jelle doing anything manually (CORE tier).
**Depends on**: Phase 7 (scorecard must be live and Supabase schema must be finalized before Stripe wires to it)
**Requirements**: STRIPE-01, STRIPE-02, LAND-01, LAND-02, LAND-03
**Success Criteria** (what must be TRUE):
  1. A new visitor clicks "Start 14-day free trial" on engine-site, completes Stripe checkout for CORE (€97/mo), and receives a Telegram bot link via email — tenant row exists in Supabase, bot is live — without Jelle touching anything
  2. The 14-day trial runs and Stripe bills automatically on day 15 — Jelle does not need to manually activate the subscription
  3. engine-site pricing section shows three monthly tiers (€97/€197/€497/mo) with correct descriptions — no stale copy or placeholder pricing
  4. The old execution-engine-lake.vercel.app URL redirects to engine-site rather than showing the v1.0 landing page
**Plans**: TBD

Plans:
- [ ] 08-01: Stripe products + trial configuration + checkout flow (STRIPE-01)
- [ ] 08-02: Stripe webhook → n8n → tenant creation → Telegram link delivery (STRIPE-02)
- [ ] 08-03: Landing page updates — pricing, CTA, old site redirect (LAND-01, LAND-02, LAND-03)

### Phase 9: Scale + Intelligence Engine
**Goal**: IE MVP briefing delivered weekly to Jelle. Self-learning pattern aggregator runs monthly and surfaces actionable insights.
**Depends on**: Phase 6 (weekly_reviews must be populating; Supabase schema with system_patterns must exist)
**Requirements**: IE-01, LEARN-01, LEARN-02
**Success Criteria** (what must be TRUE):
  1. Every week Jelle receives a Telegram briefing containing scored items from RSS, YouTube, and Reddit sources — hype-filtered so that only relevant signals get through
  2. Once a month the aggregator workflow runs automatically, reads anonymized cross-tenant data from weekly_reviews, and inserts findings into system_patterns — without manual trigger
  3. Jelle can trigger the system prompt maintenance workflow, review the top patterns, and approve an updated system prompt — the approval takes under 10 minutes of Jelle's time
**Plans**: TBD

Plans:
- [ ] 09-01: IE MVP — scrapers, Ollama scoring, hype filter, weekly briefing (IE-01)
- [ ] 09-02: Self-learning aggregator + system prompt update workflow (LEARN-01, LEARN-02)

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Multi-tenant EE Core | 3/4 | In Progress|  |
| 7. Publish Engine + Scorecard Wiring | 0/4 | Not started | - |
| 8. Stripe + Launch | 0/3 | Not started | - |
| 9. Scale + Intelligence Engine | 0/2 | Not started | - |
