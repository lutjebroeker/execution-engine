# Roadmap: Execution Engine

## Overview

Five phases that productize a working system: first make it visible (landing page), then make it shippable (AM bundle), then make it scalable (web app Pro tier), then make it sovereign (Obsidian vault sync), then make it effortless (hosted VPS). Phase 1 builds the demand generation engine before anything is for sale. Phase 2 turns the already-running AM system into a product anyone can buy. Phase 3 upgrades the web app with auth, payments, and AI coaching — completing the commercial product suite. Phase 4 adds local-first data ownership for power users. Phase 5 removes all self-hosting friction with a ready-to-go VPS.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Landing Page** - High-converting landing page using Priestley demand generation and Hormozi value stacking to capture waitlist before anything ships (1/2 plans complete)
- [x] **Phase 2: AM Bundle Packaging** - Productize the n8n AM workflow bundle — config cleanup, documentation, Obsidian starter, Gumroad listing (completed 2026-03-13)
- [ ] **Phase 3: Web App Pro Tier** - Add Supabase auth, cloud sync, Stripe subscription, and Claude AI coaching to the existing React web app
- [ ] **Phase 4: Obsidian Vault Sync** - Let Pro users choose between Supabase cloud sync and local Obsidian vault as their data storage backend
- [ ] **Phase 5: Hosted VPS Package** - Buyer gets a pre-configured Hostinger VPS with n8n, PostgreSQL, Ollama, and all AM workflows pre-installed — zero self-hosting setup required

## Phase Details

### Phase 1: Landing Page
**Goal**: Visitors can discover, understand, and join the waitlist for LifeEngine before the product officially ships
**Depends on**: Nothing (first phase)
**Requirements**: COPY-01, COPY-02, COPY-03, COPY-04, COPY-05, COPY-06, COPY-07, COPY-08, COPY-09, COPY-10, COPY-11, DMND-01, DMND-02, DMND-03, DMND-04, DMND-05, BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-05
**Success Criteria** (what must be TRUE):
  1. Visitor lands on the page and immediately understands what LifeEngine is and who it is for — the headline names the pain and positions the system as already-built
  2. Visitor can scroll through the full Hormozi value stack (€652 perceived value vs €2,497 launch price), the Day 1 guarantee, and the scarcity trigger without hitting a dead link or placeholder
  3. Visitor can submit their email and reach a confirmation page that sets expectations for what happens next
  4. Page renders correctly and loads in under 3 seconds on mobile — the primary audience uses Telegram (mobile-first)
  5. Sharing the URL on LinkedIn or WhatsApp renders the correct og:title and og:image preview
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — HTML structure and complete copy: all 13 sections, Hormozi value stack, Telegram demo mockup, mobile-responsive CSS
- [x] 01-02-PLAN.md — Supabase integration, Vercel deploy, og:image, Plausible analytics

### Phase 2: AM Bundle Packaging
**Goal**: The AM workflow bundle is a shippable, self-contained product a buyer can set up in 30 minutes and purchase via Gumroad
**Depends on**: Phase 1
**Requirements**: CONFIG-01, CONFIG-02, DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06, BUNDLE-01, BUNDLE-02, BUNDLE-03, SALE-01, SALE-02
**Success Criteria** (what must be TRUE):
  1. All 15+ workflows import into a clean n8n instance and only require editing a single Config node to go live — no hunting for hardcoded values
  2. A buyer who has never used Obsidian, Telegram bots, Ollama, or PostgreSQL can follow the setup guide from scratch and reach a working first check-in
  3. The Obsidian Vault Starter ZIP unpacks to the exact folder structure the workflows expect — no manual folder creation required
  4. The Gumroad product page is live with title, description, value stack, €2,497 launch price, and the bundle ZIP attached — a buyer can purchase and download without contacting the seller
  5. The landing page links to the Gumroad page once it is live
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Audit + Config node refactor + workflow export (CONFIG-01, CONFIG-02, BUNDLE-01)
- [ ] 02-02-PLAN.md — README setup guide + Obsidian Vault Starter + bundle ZIP (DOCS-01–06, BUNDLE-02, BUNDLE-03)
- [ ] 02-03-PLAN.md — Gumroad purchase workflow + Gumroad listing + landing page link (SALE-01, SALE-02)

### Phase 3: Web App Pro Tier
**Goal**: The React web app supports real user accounts, cloud sync across devices, a paid Pro subscription (€19.99/month or one-time unlock), and AI coaching features gated behind that subscription — Pro tier is included automatically for full Execution Engine buyers (€2,497)
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DATA-01, DATA-02, DATA-03, DATA-04, PAY-01, PAY-02, PAY-03, PAY-04, AI-01, AI-02, AI-03, DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. User can create an account with email/password or Google OAuth, stay logged in across browser sessions and devices, and reset a forgotten password — without touching localStorage
  2. Free tier user sees their data in localStorage as before; Pro tier user sees the same data synced to Supabase and accessible from any device after login
  3. User can subscribe to Pro for €19.99/month via Stripe OR unlock via one-time payment (exact price TBD at planning), see their subscription status in settings, and cancel without contacting support — subscription state updates automatically via webhook; full Execution Engine buyers (€2,497) are granted Pro access automatically
  4. Pro user opens the weekly reflection view and sees an AI-generated analysis of their week; opens the dashboard and sees an AI morning nudge based on today's goals
  5. App is live at a custom domain, passes production build with no console errors, and all routes work in the deployed environment
**Plans**: TBD

Plans:
- [ ] 03-01: Supabase auth and data migration (AUTH-01–05, DATA-01–04)
- [ ] 03-02: Stripe subscription and Pro paywall (PAY-01–04)
- [ ] 03-03: Claude AI coaching features (AI-01–03)
- [ ] 03-04: Deployment and environment setup (DEPLOY-01–03)

### Phase 4: Obsidian Vault Sync
**Goal**: Pro users can choose between Supabase cloud storage (default) and local Obsidian vault sync — ensuring data ownership is preserved for the power user audience
**Depends on**: Phase 3 (auth and data model must exist)
**Success Criteria** (what must be TRUE):
  1. Pro user can switch between "Cloud sync" and "Obsidian vault" in Settings without losing data
  2. In Obsidian mode: all check-ins, reflections, and plannings are written as Markdown files to a configured vault folder
  3. The Obsidian Vault Starter from Phase 2 determines the folder structure — no manual setup required
  4. Cloud mode and Obsidian mode are fully interchangeable with no data loss when switching
**Plans**: TBD

Plans:
- [ ] 04-01: Obsidian file writer — data export to Markdown per vault structure
- [ ] 04-02: Settings UI — storage switch and vault path configuration
- [ ] 04-03: Sync reconciliation — conflict handling when switching modes

### Phase 5: Hosted VPS Package
**Goal**: A buyer can get a fully pre-configured Hostinger VPS with n8n, PostgreSQL, Ollama, and all AM workflows already installed and running — removing all self-hosting friction for non-technical buyers
**Depends on**: Phase 2 (bundle and documentation must be finalised — VPS mirrors the self-hosted setup exactly)
**Success Criteria** (what must be TRUE):
  1. Buyer receives a Hostinger VPS with all required services running on Day 1 — no manual installation steps
  2. The VPS setup script reproduces exactly the same state as the Phase 2 self-hosted bundle — same workflows, same folder structure, same Config node
  3. Buyer can complete their first Telegram check-in within 30 minutes of receiving VPS credentials
  4. Offered as an upsell at checkout or as a separate higher-tier product — pricing and packaging TBD at planning
**Plans**: TBD (to be planned after Phase 2 is complete)

Plans:
- [ ] 05-01: VPS provisioning and automated setup script (Hostinger API or manual + script)
- [ ] 05-02: Service configuration automation (n8n, PostgreSQL, Ollama, workflow import)
- [ ] 05-03: Buyer onboarding for hosted tier (credentials delivery, first-run verification)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Landing Page | 2/2 | Complete | 2026-03-01 |
| 2. AM Bundle Packaging | 3/3 | Complete   | 2026-03-13 |
| 3. Web App Pro Tier | 0/4 | Not started | - |
| 4. Obsidian Vault Sync | 0/3 | Not started | - |
| 5. Hosted VPS Package | 0/0 | Not started | - |
