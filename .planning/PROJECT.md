# LifeEngine (working title)

## What This Is

A commercial product suite built around the 12 Week Year methodology — positioned as "not another productivity course, a working system that's already built." Phase 1 is a high-converting landing page using Daniel Priestley's Oversubscribed demand-generation model and Alex Hormozi's $100M Offers value-stacking framework. Later phases productize the n8n AM workflow bundle and upgrade the React web app with a paid Pro tier.

## Core Value

Turn visitors into buyers by making the system's existence and working proof so compelling that the price feels like a steal — selling the car, not the driving lesson.

## Product Suite Overview

### Product 1: flow-year-coach (Web App)

Browser-based React SPA. The low-friction entry point. Anyone can start tracking their 12-week cycle with zero setup.

**Current routes / functionality:**
| Route | Feature | Status |
|-------|---------|--------|
| `/` | Dashboard: execution score, streaks, active flow timer, weekly progress | ✓ exists |
| `/vision` | Long-term vision doc (personal, health, business, values, purpose) | ✓ exists |
| `/planner` | Create 12-week cycles with 1–3 measurable goals | ✓ exists |
| `/week` | Assign weekly lead actions to specific days | ✓ exists |
| `/check-in` | Morning planning + evening review (daily check-in) | ✓ exists |
| `/flow` | Timer-based deep work session tracker, linked to goals | ✓ exists |
| `/reflectie` | Weekly structured reflection (score + 4 questions) | ✓ exists |
| `/inzichten` | Analytics and insights from tracked data | ✓ exists |
| `/12-week-review` | End-of-cycle review and summary | ✓ exists |
| `/instellingen` | Settings, data export/import | ✓ exists |

**Data model:**
```
Vision → TwelveWeekCycle → Goal → WeeklyAction (per week, per day)
                                 ↓
CheckIn (morning/evening per day)
FlowSession (timer, linked to goals, task type)
WeeklyReflection (score + 4 reflection questions)
TwelveWeekReview (end-of-cycle summary)
```

**Execution score:** 85% = target. States: `winning` / `on-track` / `needs-focus` / `critical`

**Tech stack:** React 18 + TypeScript + Vite, shadcn/ui + Tailwind, React Router v6, React Hook Form + Zod, TanStack React Query

**Current gap:** localStorage only — no auth, no backend, no cloud sync, no Stripe

**GitHub:** lutjebroeker/flow-year-coach

### Product 2: AM — Accountability Manager (n8n)

AI coaching through Telegram. Automated morning/evening check-ins, weekly reviews, quarterly cycle generation — all backed by an Obsidian vault and self-hosted LLMs. Already in daily use.

**Active workflows (15 active, non-archived):**

| Workflow name | Type | Trigger | Description |
|---------------|------|---------|-------------|
| Morning Start Routine | Main | Scheduled daily 07:xx | Creates daily note → morning reflection → goal selection |
| Evening Start Routine | Main | Scheduled daily 21:xx | Checks completion → celebration or reflection → evening reflection |
| Week Planning | Main | Scheduled Monday | Reads cycle metadata + past notes → Claude API → tactic options |
| Week Review | Main | Scheduled Sunday 15:00 | Reads 7 daily notes → Claude analysis → saves to Obsidian → archives |
| Quarter Review | Main | Triggers on final week of cycle | Deep Q&A via Telegram → Ollama quarterly doc → saves to Obsidian |
| AM - Telegram Message Hub | Main | Telegram trigger (always-on) | Routes callbacks + free text to sub-workflows and AI Agent |
| AM - Goals Confirm | Sub | Callback query | Confirms selected goals for the day |
| AM - Goal Select | Sub | Callback query | Interactive goal selection menu |
| AM - Tactic Select | Sub | Callback query | 27-node multi-step tactic selection → writes to daily note |
| AM - Weekly Review | Sub | Callback query | Initiates weekly review flow |
| AM - Weekly Feedback | Sub | Callback query | Captures weekly feedback |
| AM - Process Reflection | Sub | Callback query | Walks through reflection questions |
| AM - Quarter Review | Sub | Callback query | Initiates quarter review flow |
| AM - Morning (ap_morning) | Sub | Callback query | Morning flow entry point |
| AM - Weekly Struggles | Sub | Callback query | Captures weekly struggles for AI context |
| AM - Quarter - Create Cycle | Manual | Manual trigger | Telos + Vision → Ollama → new 12-week cycle → Telegram approval → Obsidian |
| AM - Create Daily Note | Sub | Called by Morning/Evening | Creates daily note if not exists |
| AM - Waitlist - Subscribe Handler | Webhook | Webhook | Subscriber handler → Telegram notification |

**Inactive (stubs):**
- Keystone workflows (4 × 2-node habit tracking placeholders — not live)

**Tech stack:** n8n (orchestration) · Telegram Bot (UI) · Obsidian + Local REST API (vault/knowledge) · Ollama (daily summaries, evening reflection, cycle generation) · Claude API (weekly + quarterly reviews) · PostgreSQL (AI Agent conversation memory) · n8n DataTable (ephemeral state between async steps)

**Relationship to web app:**
- Both implement 12WY: Vision → Cycle → Weekly Plan → Daily Check-in → Flow → Review
- AM = Telegram-first, AI-automated, Obsidian-backed
- Web app = visual, browser-based, self-driven
- Currently: **zero data bridge** — two completely isolated systems
- Future bridge: Supabase Edge Function on web app ← n8n webhook → read/write web app data

**AM packaging gaps (before sale):**
1. Extract hardcoded values into single Config node (Telegram chat ID, Obsidian URL, vault paths, Postgres conn)
2. Document required Obsidian vault folder structure + template files
3. Write setup guide (Telegram bot, Obsidian Local REST API, Ollama model setup, Postgres)
4. Export all workflows as JSON bundle
5. Create Obsidian Vault Starter ZIP template

### Product 3: IE — Intelligence Engine (n8n) — out of scope for Phase 1

B2B content intelligence SaaS. 11 active workflows across 4 layers: scrape → process → deliver → support. Multi-tenant via Klant Configuratie. Separate B2B product, not part of the landing page scope.

---

## Selling Strategy

### Daniel Priestley — Oversubscribed Method

1. **Demand generator first** — publish content (LinkedIn, YouTube shorts) showing the system working *before* selling
2. **Waitlist / interest list** — landing page primary CTA is email capture, not buy button
3. **Scarcity and exclusivity** — "first 20 beta users get free Gold onboarding" (Hormozi urgency layer)
4. **Product Demo Days** — show the morning routine, the Telegram bot, the Obsidian vault on camera
5. **Launch to warm list** — email sequence → timed offer window

### Alex Hormozi — $100M Offers Framework

**The value equation applied:**
- Dream outcome: "Every morning you know exactly what to do and why it matters"
- Probability of success: System already exists and is in daily use (proof)
- Time delay: Vault set up in 30 min, first automation running on day 1
- Effort/sacrifice: Zero — the system does the checking-in, you just respond

**Value stack (Bronze tier — €149 one-time):**
| Deliverable | Perceived value |
|------------|-----------------|
| All AM workflows (JSON bundle) | €197 |
| Obsidian Vault Starter template | €97 |
| Telos + Keystone framework doc | €147 |
| Setup guide (step-by-step) | €47 |
| 12WY Quarterly Planning Template | €67 |
| Lifetime updates | €97 |
| **Total perceived value** | **€652** |
| **Your price** | **€149** |

**Guarantee:** "Day 1 result or full refund" — vault set up + first check-in via Telegram on day 1, or money back

**Scarcity trigger:** First 20 buyers get a free 1:1 setup call (€249 value, free)

### Competitive positioning (vs LifeOS / Ali Abdaal)

| Factor | LifeOS (Ali Abdaal) | LifeEngine |
|--------|--------------------|----|
| Format | Video course, app-agnostic | Working system, pre-built |
| AI role | None | Core — checks in daily |
| Setup | DIY everything | 30 min, runs itself |
| Accountability | Passive | Active (AI coaches you daily) |
| Price | $297 one-time | €149 bundle / €9/mo web app |

Positioning line: **"LifeOS tells you how to drive. LifeEngine is the car — already running."**

---

## Requirements

### Validated

(None yet — greenfield landing page)

### Active

**Landing Page (Phase 1):**
- [ ] Hero section: positioning statement + primary CTA (waitlist capture or buy)
- [ ] Problem section: resonates with target audience pain
- [ ] Solution section: shows what the system is and does
- [ ] Value stack section: Hormozi-style perceived vs actual price
- [ ] Social proof section: personal results / testimonials placeholder
- [ ] Guarantee section: Day 1 guarantee
- [ ] FAQ section
- [ ] Email capture / waitlist form (Hormozi + Priestley: collect before you sell)
- [ ] Mobile responsive

**n8n AM Bundle Packaging (Phase 2):**
- [ ] Single Config node replacing all hardcoded values
- [ ] Obsidian vault folder structure documented
- [ ] Setup guide written (Telegram, Obsidian Local REST, Ollama, Postgres)
- [ ] All 15+ workflows exported as JSON bundle
- [ ] Obsidian Vault Starter ZIP created
- [ ] Gumroad product page live

**Web App Pro Tier (Phase 3):**
- [ ] Supabase auth (email + Google OAuth)
- [ ] Replace localStorage with Supabase DB
- [ ] Stripe subscription (Free / Pro €9/mo)
- [ ] Pro paywall on cloud sync
- [ ] Claude API AI coaching (weekly review analysis, morning nudges)
- [ ] Deploy to custom domain

### Out of Scope (Phase 1)

- IE Intelligence Engine — separate B2B product, different audience, different funnel
- Mobile app — web-first
- n8n IE email delivery rework — not part of this milestone
- AM + web app data bridge — Phase 3+ after both are live

---

## Context

**This project grew from a real working system** — the AM system has been running in daily use. This is productization of something proven, not a speculative build. The proof of concept is the strongest possible sales asset.

**Name is TBD.** "LifeEngine" was the top recommendation from positioning work. "flow-year-coach" is the current GitHub repo name. Decision needed before domain purchase and launch.

**The LifeOS benchmark:** Ali Abdaal charges $297 for a video course that teaches you to build a system. The target product sells you the system already built, running on AI, for €149. That price delta is the pitch.

**Audience:** Ambitious professionals with a demanding job + side projects. Specifically: people who have tried productivity systems before but can't make them stick because "life gets busy." Jelle's profile = ideal customer avatar.

---

## Constraints

- **Tech:** Landing page should be static HTML or simple Next.js/React — no backend required for Phase 1
- **n8n AM:** Obsidian is a hard dependency for the power product; document clearly, don't remove
- **Ollama:** Self-hosted; at scale, switch to Claude API (already noted in IE gaps)
- **Language:** Dutch or English? The Hormozi salespagina was written in Dutch. Decide before launch.
- **Existing repo:** flow-year-coach on GitHub (Lovable-built React app) — brownfield for Phase 3

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with landing page | Priestley: build demand before shipping. Fastest path to email list. | — Pending |
| Waitlist vs buy button | AM bundle is shippable now; web app Pro needs Supabase | — Pending (decide: dual CTA?) |
| Product name | LifeEngine recommended, flow-year-coach is current brand | — Pending |
| Language (NL / EN) | Dutch = smaller market, authentic; English = 10x audience | — Pending |
| Hormozi guarantee | "Day 1 result or refund" anchors the offer | — Pending |

---
*Last updated: 2026-03-01 after initialization*
