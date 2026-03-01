---
phase: 01-landing-page
plan: 01
subsystem: frontend
tags: [html, css, landing-page, copy, brand]
dependency_graph:
  requires: []
  provides: [index.html, style.css]
  affects: [01-02]
tech_stack:
  added: []
  patterns:
    - Pure HTML/CSS with no build step
    - Mobile-first CSS with custom properties from BRAND.md
    - CSS details/summary accordion (no JS)
    - Static Telegram mockup with chat bubble layout
key_files:
  created:
    - path: index.html
      lines: 430
      description: Complete 13-section landing page with real copy, both waitlist forms, OG tags, Telegram mockup
    - path: style.css
      lines: 826
      description: Full mobile-first stylesheet with BRAND.md design tokens, all section and component styles
  modified: []
decisions:
  - "Telegram mockup: static HTML chat bubbles (not video) — DMND-04 placeholder comment left in place for Plan 01-02 to replace with <video>"
  - "Nav CTA styled as outlined link-button (border-radius md, blue-pale border) rather than plain text link — provides clearer affordance without heavy weight"
  - "Value stack table includes header row for scannability, alternating row backgrounds using gray-light"
  - "Hero form stays column on mobile (<640px), switches to row at 640px — max-narrow constraint kept for readability"
  - "Agitation section uses blockquote-style left border accent for the confrontational challenge line per brand voice"
metrics:
  duration: "~4 minutes"
  completed: "2026-03-01"
  tasks_completed: 2
  files_created: 2
requirements_addressed:
  - COPY-01
  - COPY-02
  - COPY-03
  - COPY-04
  - COPY-05
  - COPY-06
  - COPY-07
  - COPY-08
  - COPY-09
  - COPY-10
  - COPY-11
  - DMND-04
  - BUILD-01
  - BUILD-02
  - BUILD-03
  - BUILD-04
---

# Phase 1 Plan 01: Landing Page Copy and Structure Summary

**One-liner:** Complete 13-section landing page with Priestley/Hormozi copy structure, BRAND.md CSS tokens, and form markup wired for Plan 01-02 JS.

---

## What Was Built

### Task 1: index.html (430 lines)

Complete single-page HTML document with all 13 sections in correct Priestley/Hormozi sequence:

1. **Nav** — sticky, logo left + "Join Waitlist" outlined CTA right, links to #waitlist
2. **Hero** (#hero) — "You have a system. You just don't follow through." headline, subheadline, 23%→87% stat badge, waitlist form #1 with inline success/error slots
3. **Problem** (#problem) — 4-paragraph problem narrative (Notion template → abandoned, morning routine → gone, "Life gets busy. The system breaks.")
4. **Agitation** — "The cost isn't the failed system. It's the years." — confrontational accountability in brand voice with challenge callout: "You said you'd do this."
5. **Solution** (#solution) — "not a course, it's the car — already running" framing with LifeOS competitive line
6. **How it works** (#how-it-works) — 5-step numbered list (Vision → 12-Week Cycle → Daily AI Check-in → Weekly Review → Quarterly Review)
7. **Demo** (#demo) — Static Telegram bot mockup HTML with realistic 4-message conversation, DMND-04 comment for future video replacement
8. **Social proof** (#social-proof) — 3 stat cards (23%→87%, 12 Cycles, 15+ Workflows) with n=1 transparency framing
9. **Value stack** (#value-stack) — Hormozi-style table: 4 items with strikethrough prices, €652+ total, €2,497 launch price
10. **Guarantee** (#guarantee) — "Day 1 result or full refund" on paper background
11. **Scarcity** (#scarcity) — "First 20 buyers" 1:1 call offer with amber spots-remaining badge
12. **FAQ** (#faq) — 4 details/summary accordions: n8n, Obsidian, technical bar, vs LifeOS
13. **Final CTA** (#waitlist) — Second waitlist form #2 with same structure as hero form

**Form contract for Plan 01-02:**
- Both forms: `class="waitlist-form"`, `id="hero-form"` / `id="cta-form"`
- Input: `type="email" name="email" required autocomplete="email"`
- Button: `type="submit"`
- Confirmation: `<div class="form-success" hidden>` immediately after each form
- Error: `<div class="form-error" hidden>` immediately after each form

**Script placeholder tags at end of body (Plan 01-02 fills these):**
- Supabase CDN: `src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer`
- Main JS: `src="main.js" defer`
- Plausible: `data-domain="executionengine.vercel.app" defer`

### Task 2: style.css (826 lines)

Complete mobile-first stylesheet structured in 20 sections:

- **`:root`** — all BRAND.md custom properties verbatim (colors, type scale, spacing, radius, shadows, max-widths)
- **Reset/base** — box-sizing, body font-family system-ui, line-height 1.6
- **Typography** — Georgia h1/h2/h3, responsive sizing (h1: 30px mobile → 36px tablet)
- **Layout utilities** — .container (max-ui), .prose (max-prose), .section with 3rem/5rem padding breakpoint
- **Section backgrounds** — .section--white, .section--off-white, .section--paper
- **Nav** — sticky, box-shadow border, flex space-between, outlined CTA link
- **Hero** — 4xl/5xl headline, stat-badge with blue-pale background + blue-brand text + pill radius
- **Forms** — column mobile → row at 640px, focus ring via box-shadow, disabled opacity, hover states
- **Telegram mockup** — #1c2733 container, bot bubbles #2b5278, user bubbles blue-brand
- **Stat cards** — 1-col mobile → 3-col at 768px, left border accent 4px blue-brand, Georgia stat-value
- **Value stack** — full-width table, alternating row backgrounds, price row in Georgia 2xl blue-brand
- **Steps** — 1-col mobile → 5-col at 1024px, numbered circle badges in blue-brand
- **FAQ** — details/summary custom +/− toggle, no JavaScript needed
- **Footer** — off-white bg, Georgia italic tagline, gray-text copyright

**Key CSS patterns established for Plan 01-02:**
- Form JS hooks: `.waitlist-form button[type="submit"]:disabled` for loading state
- Success state: `.form-success` uses blue-muted background, already styled
- Error state: `.form-error` uses #991B1B color, already styled
- All component states are ready — Plan 01-02 only needs to toggle `hidden` attribute

---

## Copy Decisions Made

| Section | Copy Direction | Rationale |
|---------|---------------|-----------|
| Hero headline | "You have a system. You just don't follow through." | From CONTEXT.md decision, problem-led, direct |
| Agitation challenge line | "You said you'd do this. The question is whether you actually will." | BRAND.md voice example adapted, confrontational but not harsh |
| Solution competitive line | "LifeOS tells you how to drive. Execution Engine is the car — already running." | Direct from CONTEXT.md/PLAN.md spec |
| Social proof framing | "n=1 transparency: I'm selling you the car I drive." | Honest solo founder positioning from CONTEXT.md |
| Guarantee | "Day 1 result or full refund — no questions" | Hormozi-style risk reversal, specific to Day 1 |
| Telegram demo messages | Realistic conversation showing 87% rate and memory | Concrete proof of system's function |

---

## DMND-04 Status

**Status: Static HTML mockup (no video yet)**

A `<div class="telegram-mockup">` in section #demo shows a realistic 4-message bot conversation with styled chat bubbles. The HTML comment `<!-- DMND-04: replace with <video> when demo.mp4 is ready -->` is present.

When `demo.mp4` exists, replace the `.telegram-mockup` div with:
```html
<!-- DMND-04: video asset -->
<video class="demo__video" src="demo.mp4" autoplay loop muted playsinline></video>
```

---

## Deviations from Plan

None — plan executed exactly as written.

The static Telegram mockup is not a deviation: the plan explicitly specified "If no video asset exists yet (likely), render a styled static HTML mockup" which was implemented exactly.

---

## CSS Patterns Established (Plan 01-02 Reference)

```css
/* Form loading state — Plan 01-02 adds this via JS */
.waitlist-form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toggling success/error — Plan 01-02 removes hidden attr */
/* <div class="form-success" hidden> → remove hidden */
/* <div class="form-error" hidden> → remove hidden, set textContent */
```

**Class selector used by Plan 01-02 JS:**
```javascript
document.querySelectorAll('.waitlist-form')
```

---

## Self-Check

**Files created:**

- FOUND: index.html (430 lines)
- FOUND: style.css (826 lines)

**Commits:**

- FOUND: 6f560be — feat(01-01): add complete 13-section landing page HTML
- FOUND: bb2c6a8 — feat(01-01): add mobile-first responsive stylesheet

## Self-Check: PASSED
