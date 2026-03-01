# Roadmap: LifeEngine (working title)

## Overview

Three phases that productize a working system: first make it visible (landing page), then make it shippable (AM bundle), then make it scalable (web app Pro tier). Phase 1 builds the demand generation engine before anything is for sale. Phase 2 turns the already-running AM system into a product anyone can buy. Phase 3 upgrades the web app with auth, payments, and AI coaching — completing the commercial product suite.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Landing Page** - High-converting landing page using Priestley demand generation and Hormozi value stacking to capture waitlist before anything ships
- [ ] **Phase 2: AM Bundle Packaging** - Productize the n8n AM workflow bundle — config cleanup, documentation, Obsidian starter, Gumroad listing
- [ ] **Phase 3: Web App Pro Tier** - Add Supabase auth, cloud sync, Stripe subscription, and Claude AI coaching to the existing React web app

## Phase Details

### Phase 1: Landing Page
**Goal**: Visitors can discover, understand, and join the waitlist for LifeEngine before the product officially ships
**Depends on**: Nothing (first phase)
**Requirements**: COPY-01, COPY-02, COPY-03, COPY-04, COPY-05, COPY-06, COPY-07, COPY-08, COPY-09, COPY-10, COPY-11, DMND-01, DMND-02, DMND-03, DMND-04, DMND-05, BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-05
**Success Criteria** (what must be TRUE):
  1. Visitor lands on the page and immediately understands what LifeEngine is and who it is for — the headline names the pain and positions the system as already-built
  2. Visitor can scroll through the full Hormozi value stack (€652 perceived value vs €149 price), the Day 1 guarantee, and the scarcity trigger without hitting a dead link or placeholder
  3. Visitor can submit their email and reach a confirmation page that sets expectations for what happens next
  4. Page renders correctly and loads in under 3 seconds on mobile — the primary audience uses Telegram (mobile-first)
  5. Sharing the URL on LinkedIn or WhatsApp renders the correct og:title and og:image preview
**Plans**: TBD

Plans:
- [ ] 01-01: Copy and page structure (all COPY sections, DMND-04 video embed)
- [ ] 01-02: Build, deploy, and integrate (BUILD-01–05, DMND-01–03, DMND-05, email capture)

### Phase 2: AM Bundle Packaging
**Goal**: The AM workflow bundle is a shippable, self-contained product a buyer can set up in 30 minutes and purchase via Gumroad
**Depends on**: Phase 1
**Requirements**: CONFIG-01, CONFIG-02, DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06, BUNDLE-01, BUNDLE-02, BUNDLE-03, SALE-01, SALE-02
**Success Criteria** (what must be TRUE):
  1. All 15+ workflows import into a clean n8n instance and only require editing a single Config node to go live — no hunting for hardcoded values
  2. A buyer who has never used Obsidian, Telegram bots, Ollama, or PostgreSQL can follow the setup guide from scratch and reach a working first check-in
  3. The Obsidian Vault Starter ZIP unpacks to the exact folder structure the workflows expect — no manual folder creation required
  4. The Gumroad product page is live with title, description, value stack, €149 price, and the bundle ZIP attached — a buyer can purchase and download without contacting the seller
  5. The landing page links to the Gumroad page once it is live
**Plans**: TBD

Plans:
- [ ] 02-01: Config extraction and workflow export (CONFIG-01, CONFIG-02, BUNDLE-01)
- [ ] 02-02: Documentation and vault starter (DOCS-01–06, BUNDLE-02, BUNDLE-03)
- [ ] 02-03: Gumroad listing and landing page link (SALE-01, SALE-02)

### Phase 3: Web App Pro Tier
**Goal**: The React web app supports real user accounts, cloud sync across devices, a paid Pro subscription, and AI coaching features gated behind that subscription
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DATA-01, DATA-02, DATA-03, DATA-04, PAY-01, PAY-02, PAY-03, PAY-04, AI-01, AI-02, AI-03, DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. User can create an account with email/password or Google OAuth, stay logged in across browser sessions and devices, and reset a forgotten password — without touching localStorage
  2. Free tier user sees their data in localStorage as before; Pro tier user sees the same data synced to Supabase and accessible from any device after login
  3. User can subscribe to Pro for €9/month via Stripe, see their subscription status in settings, and cancel without contacting support — subscription state updates automatically via webhook
  4. Pro user opens the weekly reflection view and sees an AI-generated analysis of their week; opens the dashboard and sees an AI morning nudge based on today's goals
  5. App is live at a custom domain, passes production build with no console errors, and all routes work in the deployed environment
**Plans**: TBD

Plans:
- [ ] 03-01: Supabase auth and data migration (AUTH-01–05, DATA-01–04)
- [ ] 03-02: Stripe subscription and Pro paywall (PAY-01–04)
- [ ] 03-03: Claude AI coaching features (AI-01–03)
- [ ] 03-04: Deployment and environment setup (DEPLOY-01–03)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Landing Page | 0/2 | Not started | - |
| 2. AM Bundle Packaging | 0/3 | Not started | - |
| 3. Web App Pro Tier | 0/4 | Not started | - |
