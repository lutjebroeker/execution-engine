# Requirements: Engine Ecosystem v2.0

**Defined:** 2026-04-04
**Core Value:** From knowing what to do to actually doing it — measured, not felt. The execution score is the product.

## v1 Requirements

Requirements for milestone v2.0 (Phases 6–9).

### Infrastructure

- [ ] **INFRA-01**: Supabase multi-tenant schema deployed — tenants, conversations, goals, goal_logs, daily_priorities, weekly_reviews, memory, system_patterns, score_submissions — all with tenant_id + RLS enabled
- [ ] **INFRA-02**: n8n running on Proxmox with Cloudflare Tunnel providing a stable public webhook URL (n8n.jellespek.nl or equivalent)

### Telegram Bot — EE Core

- [ ] **BOT-01**: Telegram bot created via @BotFather and connected to n8n webhook trigger
- [ ] **BOT-02**: Every inbound Telegram message is routed to the correct tenant via chat_id → tenant_id lookup in Supabase
- [ ] **BOT-03**: Claude API tool-use agent processes tenant messages with tools: manage_goal, log_progress, get_goals_overview, save_memory, search_memory, web_search
- [ ] **BOT-04**: Self-service /start onboarding: bot asks intake questions (3 goals, work schedule, preferred check-in time) → tenant row created in Supabase → "Your system is live. First briefing tomorrow at 07:30."

### Crons

- [ ] **CRON-01**: Morning briefing cron (07:00, configurable per tenant) loops all active tenants and sends personalized AI-generated daily priorities aligned to their goals
- [ ] **CRON-02**: Accountability check-in cron (17:00) loops all active tenants and asks "Did you complete what you said this morning?"
- [ ] **CRON-03**: Weekly review cron (Sunday 18:00) generates execution score (% lead actions completed) + pattern analysis per tenant, stores in weekly_reviews, sends to Telegram

### Execution Engine Features

- [ ] **EE-01**: User can manage 12-week goals with milestones via natural Telegram conversation (Claude tools handle CRUD)
- [ ] **EE-02**: Daily execution score calculated and stored in daily_priorities.execution_score
- [ ] **EE-03**: Weekly pattern detection: system identifies recurring low-execution days and surfaces patterns in weekly review (e.g. "Wednesday is your worst day for 3 weeks running")

### Scorecard Wiring

- [ ] **SCORE-01**: Supabase score_submissions table created, Vercel env vars (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY) set on engine-site deployment — scorecard submissions land in DB
- [ ] **SCORE-02**: n8n webhook at /webhook/score-submission active — receives scorecard payload, sends Telegram notification to Jelle with score + tier + email
- [ ] **SCORE-03**: Cal.com (or Calendly) booking link configured in engine-site src/config.ts → urls.bookCall — GUIDED tier intake booking works

### Publish Engine

- [ ] **PUB-01**: Postiz deployed on Proxmox (Docker, pinned v2.11.3), LinkedIn + X accounts connected via OAuth
- [ ] **PUB-02**: n8n draft generation workflow: content idea or IE signal → Claude API → content_items row in Supabase (status: draft)
- [ ] **PUB-03**: n8n scheduled publishing workflow (cron every 15 min): reads approved content_items where scheduled_at ≤ now → publishes via Postiz API → updates status to published
- [ ] **PUB-04**: Brand voice (from Ziplined) migrated to Claude system prompt in draft generation workflow — tone, style, platform-specific format per channel

### Stripe + Launch

- [ ] **STRIPE-01**: Stripe products + prices created for CORE (€97/mo) and GUIDED (€197/mo), both with 14-day free trial configured
- [ ] **STRIPE-02**: Stripe checkout → webhook → n8n workflow creates tenant row in Supabase → sends Telegram bot link to buyer's email — fully automated for CORE tier
- [ ] **LAND-01**: engine-site pricing section updated to reflect monthly tiers (€97/€197/€497/mo)
- [ ] **LAND-02**: engine-site CTA updated from "Book a call" / "Join waitlist" to "Start 14-day free trial" linking to Stripe checkout
- [ ] **LAND-03**: Old execution-engine-lake.vercel.app taken offline or redirected to engine-site

### Scale + Intelligence Engine

- [ ] **IE-01**: IE MVP running for Jelle: RSS + YouTube + Reddit scrapers → Ollama scoring (llama3.1:8b) → hype filter → weekly briefing delivered via Telegram
- [ ] **LEARN-01**: Self-learning aggregator workflow (monthly cron): analyzes anonymized cross-tenant patterns → inserts findings into system_patterns table
- [ ] **LEARN-02**: System prompt maintenance workflow: reads top system_patterns → Jelle reviews and approves updated system prompt — manually triggered monthly

---

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Expand Publish Engine

- **PUB-05**: YouTube Shorts publishing — after LinkedIn + X are stable
- **PUB-06**: Instagram publishing — after Meta app review
- **PUB-07**: TikTok publishing — after compliance audit
- **PUB-08**: Telegram approval workflow for Publish Engine — when volume exceeds manual review

### Expand Intelligence Engine

- **IE-02**: IE hype filter — 2 revalidation cycles (day 15 + day 30)
- **IE-03**: Breaking bypass for relevance score ≥ 9

### Personal Engine

- **PE-01**: Calendar integration (Google Calendar)
- **PE-02**: Email digest integration (Gmail)
- **PE-03**: Cross-engine morning briefing (EE + IE + PE combined)

### Engagement Tracking

- **ENGMT-01**: Publish Engine engagement tracking — build after 4+ weeks of posting data

### Dedicated Tiers

- **DED-01**: Cloud VPS provisioning script (Hetzner CX22) — build when first DEDICATED client pays
- **DED-02**: Managed Hardware setup (Mac Mini M4 Pro) — build when first client requests it

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| WhatsApp integration | Costs money; Telegram Bot API is free |
| Mobile app | Telegram IS the mobile app |
| Admin dashboard | Manage via Supabase UI until 20+ clients |
| Custom branding per client | DEDICATED tier only, not building speculatively |
| Multi-user / team accounts | Single-user per tenant for v2.0 |
| DEDICATED infrastructure | Sell first, build after — no speculative purchases |
| IE for clients (FULL STACK tier) | Keep IE internal until proven for Jelle first |
| Publish Engine for clients | Internal GTM tool only |
| EE App rebranding (flow-year-coach) | Later milestone after SaaS is live |
| Keystone extraction via vault | Nice-to-have for GUIDED; not MVP |

---

## Traceability

Populated by roadmapper. Updated as phases complete.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 6 | Pending |
| INFRA-02 | Phase 6 | Pending |
| BOT-01 | Phase 6 | Pending |
| BOT-02 | Phase 6 | Pending |
| BOT-03 | Phase 6 | Pending |
| BOT-04 | Phase 6 | Pending |
| CRON-01 | Phase 6 | Pending |
| CRON-02 | Phase 6 | Pending |
| CRON-03 | Phase 6 | Pending |
| EE-01 | Phase 6 | Pending |
| EE-02 | Phase 6 | Pending |
| EE-03 | Phase 6 | Pending |
| SCORE-01 | Phase 7 | Pending |
| SCORE-02 | Phase 7 | Pending |
| SCORE-03 | Phase 7 | Pending |
| PUB-01 | Phase 7 | Pending |
| PUB-02 | Phase 7 | Pending |
| PUB-03 | Phase 7 | Pending |
| PUB-04 | Phase 7 | Pending |
| STRIPE-01 | Phase 8 | Pending |
| STRIPE-02 | Phase 8 | Pending |
| LAND-01 | Phase 8 | Pending |
| LAND-02 | Phase 8 | Pending |
| LAND-03 | Phase 8 | Pending |
| IE-01 | Phase 9 | Pending |
| LEARN-01 | Phase 9 | Pending |
| LEARN-02 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-04*
*Last updated: 2026-04-04 after v2.0 milestone start*
