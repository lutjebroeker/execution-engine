# Phase 1: Landing Page - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

A single-page pure HTML/CSS/JS waitlist capture site for Execution Engine. The goal is to convert visitors into waitlist subscribers using Priestley demand generation + Hormozi value stacking. No product for sale yet — CTA is email capture only.

**Not in scope:** thank-you page design, email nurture sequence, Gumroad product page, analytics implementation details.

</domain>

<decisions>
## Implementation Decisions

### Hero Headline Formula
- **Problem-led opening** — lead with the pain that resonates with the target persona: people who have a system but don't follow through
- Hero headline direction: "You have a system. You just don't follow through." (or equivalent direct problem statement)
- Subheadline positions the solution: not a course, not an app — a working system that already runs via Telegram AI check-ins
- Key proof point in hero: 23% → 87% execution rate (first-person, creator's own result)
- BRAND.md tone applies: calm, direct, no hype, Dutch directness

### Page Structure & Section Order
Strict Hormozi/Priestley flow, top to bottom:
1. **Nav** — minimal: logo + "Join Waitlist" anchor link (no other nav items)
2. **Hero** — headline + subheadline + email capture form + key stat (23%→87%)
3. **Problem** — name the specific pain: tried productivity before, nothing sticks when life gets busy (COPY-03)
4. **Agitation** — cost of the problem: years of wasted potential, unfulfilled projects (COPY-04)
5. **Solution** — Execution Engine is already built and running, not a course (COPY-05)
6. **How it works** — Vision → 12-Week Cycle → Daily AI Check-in → Weekly Review → Quarterly Review (COPY-06)
7. **Demo** — embedded short-form video or GIF showing Telegram bot in action (DMND-04) — placed here to make the system feel real right before social proof
8. **Social proof** — personal results: execution score, streaks, completed cycles (COPY-07)
9. **Value stack** — Hormozi-style €652 perceived value vs €2,497 launch price (COPY-08)
10. **Guarantee** — Day 1 result or full refund (COPY-09)
11. **Scarcity** — first 20 buyers get free 1:1 setup call (COPY-10)
12. **FAQ** — answers "Do I need n8n?", "Do I need Obsidian?", "Not technical?", "vs LifeOS?" (COPY-11)
13. **Final CTA** — second email capture form + repeat of guarantee

### Email Capture UX
- **Primary placement**: inline in hero section — email field + "Join Waitlist" button, no name field (lowest friction)
- **Secondary placement**: dedicated CTA section at bottom of page (repeat)
- **No sticky bar** — keep the page clean and editorial
- Post-submit: inline confirmation message within the form area ("You're on the list. Watch your inbox.") — no redirect, no separate thank-you page for Phase 1
- Form POSTs to Supabase directly via fetch() — table: `execution_engine_waitlist`
- Fields collected: email only (name optional if Supabase schema allows)

### Social Proof Strategy
- Solo founder = only proof is personal results — own this directly rather than hiding it
- Framing: "I built this for myself. Here's what happened." — first-person, creator using own system
- Show raw stats: execution rate improvement (23% → 87%), number of weeks running, number of completed cycles
- Use screenshot-style UI mockups of real dashboard/Telegram messages rather than testimonial quotes (no fake testimonials)
- Optional: "n=1" transparency as a strength — "This is my system. I'm selling you the car I drive."

### Visual Design (aligned with BRAND.md)
- **Theme**: Light, not dark — BRAND.md specifies white/off-white backgrounds
- **Fonts**: Georgia (headlines) + System UI (body) — NO Lora, NO DM Sans, NO Inter
- **Primary color**: `#1D4ED8` for CTAs, links, progress indicators
- **Warm paper accent**: `#F5F1EB` for section background alternation
- **Illustration style**: editorial, warm desk-scene aesthetic — no sci-fi, no neon, no dark gradients
- **Layout**: max-width 1200px, generous whitespace, asymmetric where appropriate

### Pricing Display
- Show €2,497 launch price (NOT €149 — that was an earlier iteration, BRAND.md is authoritative)
- Full price anchor: €4,997 post-launch
- Waitlist CTA: join list now → get launch pricing when available
- Value stack: show individual component values summing to €652+ perceived value vs €2,497 launch price

### Technical Build (BUILD requirements)
- Pure HTML/CSS/JS, single `index.html` file — no build step, no framework
- Mobile-first responsive — primary audience is Telegram users (mobile)
- Page must load < 3 seconds — no external JS libraries except Google Fonts CDN
- Meta tags: og:title, og:description, og:image (1200×630) for LinkedIn/WhatsApp share preview
- Analytics: Plausible or simple GA4 snippet (lightweight, no cookie banner required for Plausible)

### Claude's Discretion
- Exact copy for each section (copywriter discretion within brand voice and COPY requirements)
- Specific CSS animations and micro-interactions
- Exact FAQ question wording beyond the 4 mandated topics
- Whether to use SVG illustration vs CSS-only decorative elements in hero
- Exact section background pattern (alternating #FFFFFF / #F5F7FA or #F5F1EB)

</decisions>

<specifics>
## Specific Ideas

- BRAND.md copy direction: "You said you'd do this. Did you?" — use this energy in problem/agitation sections
- Competitive positioning line: "LifeOS tells you how to drive. Execution Engine is the car — already running." — use in solution section
- Key brand tagline: "Build systems that actually execute." — use in nav/footer
- The "already built and running" angle is the strongest differentiator — make it concrete: show workflow names, show real Telegram screenshot mockups
- Hero should feel like reading a great essay, not a SaaS landing page — editorial tone per BRAND.md

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing codebase

### Established Patterns
- Pure HTML/CSS/JS with single `index.html` — no component architecture, write vanilla CSS
- Supabase JavaScript client via CDN for waitlist POST (no npm, no build step)
- BRAND.md CSS variables are the style foundation

### Integration Points
- Supabase: waitlist form POSTs to `execution_engine_waitlist` table via fetch() API
- External: Google Fonts CDN (Georgia available system-wide, JetBrains Mono for code sections)
- External: Video/GIF embed for demo section (DMND-04 — URL TBD)
- External: Plausible analytics script snippet (or GA4)

</code_context>

<deferred>
## Deferred Ideas

- Separate thank-you page with expectations-setting content — could be Phase 1.5 if needed
- Email nurture sequence / Listmonk automation — Phase 2
- Gumroad product page link — Phase 2
- Animated hero illustration with SVG — could add post-launch
- A/B testing different hero headlines — post-launch

</deferred>

---

*Phase: 01-landing-page*
*Context gathered: 2026-03-01*
