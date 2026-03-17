# Requirements: Execution Engine

**Defined:** 2026-03-01
**Core Value:** Convert visitors into buyers by making the system's existence and working proof so compelling that the price feels like a steal — selling the car, not the driving lesson.

---

## v1 Requirements — Phase 1: Landing Page

### Copy & Structure (Priestley + Hormozi framework)

- [x] **COPY-01**: Landing page has a hero section with positioning headline that resonates with target audience pain ("not another productivity course — a working system")
- [x] **COPY-02**: Hero section has a clear primary CTA (email waitlist capture)
- [x] **COPY-03**: Problem section names the specific pain: tried productivity systems before, nothing sticks when life gets busy
- [x] **COPY-04**: Agitation section shows the cost of the problem (years of wasted potential, unfulfilled projects)
- [x] **COPY-05**: Solution section introduces the system — shows it is already built and running, not a course
- [x] **COPY-06**: "How it works" section: Vision → 12-Week Cycle → Daily AI Check-in → Weekly Review → Quarterly Review
- [x] **COPY-07**: Social proof section: personal results from using the system (execution score, streaks, completed cycles)
- [x] **COPY-08**: Value stack section: Hormozi-style — show perceived component value vs €2,497 launch price (€4,997 full price)
- [x] **COPY-09**: Guarantee section: "Day 1 result or full refund" — vault set up + first Telegram check-in on day 1
- [x] **COPY-10**: Scarcity/urgency: first 20 buyers get free 1:1 setup call (€249 value)
- [x] **COPY-11**: FAQ section answers: "Do I need to know n8n?", "Do I need Obsidian?", "What if I'm not technical?", "How is this different from LifeOS?"

### Demand Generation (Priestley method)

- [ ] **DMND-01**: Landing page is live at a URL (custom domain or subdomain) — traffic can be sent to it before product is fully packaged
- [ ] **DMND-02**: Email capture form POSTs to Supabase via fetch() — table: `execution_engine_waitlist`
- [ ] **DMND-03**: Thank-you page / confirmation after email capture that sets expectations ("you're on the list, here's what happens next")
- [x] **DMND-04**: Landing page includes a "Product Demo" section or embedded short-form video showing the Telegram bot in action
- [ ] **DMND-05**: Page is shareable — meta tags, og:image, og:title for LinkedIn / WhatsApp previews

### Design & Build

- [x] **BUILD-01**: Self-contained pure HTML/CSS/JS page — no framework, no build step, hosted on Vercel or Netlify free tier
- [x] **BUILD-02**: Light theme, editorial aesthetic — Georgia + System UI fonts, #1D4ED8 primary, white/off-white backgrounds (per BRAND.md)
- [x] **BUILD-03**: Mobile responsive — primary audience is on mobile (Telegram users)
- [x] **BUILD-04**: Page loads fast (<3s) — no unnecessary dependencies
- [ ] **BUILD-05**: Analytics tracking (Plausible or simple GA4) — know who's visiting and where they came from

---

## v1 Requirements — Phase 2: n8n AM Bundle Packaging

### Configuration

- [ ] **CONFIG-01**: All hardcoded values extracted into a single Config node — Telegram chat ID, Obsidian URL, vault root path, Postgres connection string, Ollama base URL, Claude API key
- [ ] **CONFIG-02**: Config node is the first node in every affected workflow — one place to set, everything works

### Documentation

- [x] **DOCS-01**: Obsidian vault folder structure documented — exact folder names, which templates go where, daily/weekly/quarterly note naming conventions
- [x] **DOCS-02**: Setup guide written for Telegram bot creation (BotFather, set commands, webhook URL)
- [x] **DOCS-03**: Setup guide written for Obsidian Local REST API plugin installation + configuration
- [x] **DOCS-04**: Setup guide written for Ollama — model download (which models), API endpoint setup
- [x] **DOCS-05**: Setup guide written for PostgreSQL — database creation, table schema for AI Agent memory
- [x] **DOCS-06**: Workflows listed by name with one-line description — buyer knows what they're getting

### Deliverables

- [ ] **BUNDLE-01**: All 15+ AM workflows exported as a single JSON file importable into n8n
- [x] **BUNDLE-02**: Obsidian Vault Starter ZIP — pre-built folder structure + template files matching the workflow expectations
- [x] **BUNDLE-03**: README.md in bundle — quick start, prerequisites checklist, "you'll be live in 30 min" promise

### Sales

- [x] **SALE-01**: Gumroad product page live with title, description, value stack, price (€2,497 launch / €4,997 full), and bundle ZIP attached
- [x] **SALE-02**: Gumroad page linked from landing page (waitlist → Gumroad when ready)

---

## v1 Requirements — Phase 3: Web App Pro Tier

### Authentication

- [ ] **AUTH-01**: User can create account with email and password via Supabase Auth
- [ ] **AUTH-02**: User can sign in with Google OAuth via Supabase Auth
- [ ] **AUTH-03**: User session persists across browser refresh and device switches
- [ ] **AUTH-04**: User can reset password via email link
- [ ] **AUTH-05**: User can log out from any page

### Data Persistence

- [ ] **DATA-01**: All existing localStorage data models migrated to Supabase tables (Vision, TwelveWeekCycle, Goal, WeeklyAction, CheckIn, FlowSession, WeeklyReflection, TwelveWeekReview)
- [ ] **DATA-02**: Free tier users get localStorage fallback (no account = local only)
- [ ] **DATA-03**: Pro tier users get Supabase sync — data accessible across devices
- [ ] **DATA-04**: Data export/import continues to work for all users

### Payments

- [ ] **PAY-01**: Stripe subscription integration — Free tier (no card) and Pro tier (€9/month)
- [ ] **PAY-02**: Pro paywall gates cloud sync — free users see "upgrade to Pro" when they try to sign in
- [ ] **PAY-03**: User can cancel subscription from settings
- [ ] **PAY-04**: Webhook from Stripe updates user's subscription status in Supabase

### AI Coaching (Pro)

- [x] **AI-01**: Weekly reflection view shows AI-generated analysis of the week via Claude API (Pro only)
- [x] **AI-02**: Dashboard shows AI-generated morning nudge based on today's goals and yesterday's completion (Pro only)
- [x] **AI-03**: 12-week review page shows AI cycle analysis — patterns, wins, growth areas

### Deployment

- [x] **DEPLOY-01**: App deployed to Vercel (or Lovable publish) with custom domain
- [x] **DEPLOY-02**: Environment variables set for Supabase, Stripe, Claude API
- [x] **DEPLOY-03**: Production build passes — no console errors, all routes work

---

## v2 Requirements (Deferred)

### n8n AM ↔ Web App Bridge

- **BRIDGE-01**: Supabase Edge Function webhook endpoint — n8n AM can read user's active cycle + goals
- **BRIDGE-02**: AM morning routine optionally pulls today's goals from web app instead of Obsidian
- **BRIDGE-03**: Web app check-in data syncs to Obsidian daily note via n8n webhook

### IE Integration

- **IE-01**: IE delivery rework — email instead of Obsidian webhook
- **IE-02**: IE client config moved to Supabase table
- **IE-03**: IE onboarding form UI

### Social Proof & Growth

- **SOCIAL-01**: Public execution score badge ("I'm on week 7 of my 12-week cycle — 89% execution score") — shareable link
- **SOCIAL-02**: Community page showing aggregated (anonymized) 12WY stats

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| IE Intelligence Engine (Phase 1–3) | Separate B2B product, different audience and funnel |
| Mobile app | Web-first; mobile after v1 proven |
| n8n AM multi-user | Hard dependency on personal Obsidian vault; multi-user = different product architecture |
| Keystone habit tracking | Inactive stubs in n8n — not part of initial bundle |
| LinkedIn scraper activation | Bright Data paid add-on; separate pricing tier |
| Real-time collaboration | Solo productivity product — collaboration not in core value |

---

## Resolved Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Product name | **Execution Engine** |
| 2 | Language | **English** |
| 3 | Primary Phase 1 CTA | **Waitlist only** (Priestley: build demand before selling) |
| 4 | Email platform | **Supabase** (`execution_engine_waitlist` table, existing infrastructure) |
| 5 | Landing page tech | **Pure HTML/CSS/JS** (no build step, single index.html) |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| COPY-01 through COPY-11 | Phase 1 | Pending |
| DMND-01 through DMND-05 | Phase 1 | Pending |
| BUILD-01 through BUILD-05 | Phase 1 | Pending |
| CONFIG-01 through CONFIG-02 | Phase 2 | Pending |
| DOCS-01 through DOCS-06 | Phase 2 | Pending |
| BUNDLE-01 through BUNDLE-03 | Phase 2 | Pending |
| SALE-01 through SALE-02 | Phase 2 | Pending |
| AUTH-01 through AUTH-05 | Phase 3 | Pending |
| DATA-01 through DATA-04 | Phase 3 | Pending |
| PAY-01 through PAY-04 | Phase 3 | Pending |
| AI-01 through AI-03 | Phase 3 | Complete (03-03) |
| DEPLOY-01 through DEPLOY-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 40
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 — pricing updated to €2,497/€4,997 (BRAND.md), theme updated to light, email platform updated to Supabase, decisions resolved*
