# BRAND.md — Execution Engine · Personal Brand Reference
> Drop this file into any project or Claude Code session.
> Reference it with: "Follow BRAND.md for all design and copy decisions."

---

## 1. Identity

| Field | Value |
|-------|-------|
| **Brand name** | Execution Engine |
| **Tagline** | *Build systems that actually execute.* |
| **Sub-tagline** | AI-powered accountability for people who think in systems. |
| **Owner** | Jelle Spek |
| **Voice name** | Jelle (first person, personal brand) |
| **Category** | AI-powered productivity / accountability systems |
| **Target persona** | Knowledge workers, founders, operators who are system-thinkers but struggle with consistent execution |

---

## 2. Brand Positioning

### What it is
A local-first AI accountability system built around the 12 Week Year methodology. It replaces motivational fluff with confrontational daily check-ins, measurable progress tracking, and structured weekly reflection.

### The core tension
Most productivity systems fail at **execution**, not planning. The Execution Engine bridges the gap between "I have a system" and "I actually follow through."

### Key proof point
Execution rate improvement: **23% → 87%** over 12 weeks.

### What it is NOT
- Not a task manager (Todoist, Notion)
- Not a motivational coach
- Not another AI chatbot wrapper
- Not a cloud-first SaaS with lock-in

---

## 3. Color Palette

```css
/* PRIMARY */
--blue-brand:       #1D4ED8;   /* Primary accent — CTA, links, progress, system UI */
--blue-light:       #3B82F6;   /* Hover states, gradients */
--blue-pale:        #DBEAFE;   /* Chips, tags, subtle backgrounds */
--blue-muted:       #EEF2FF;   /* Card backgrounds, screen fills */

/* BACKGROUNDS */
--bg-white:         #FFFFFF;   /* Primary background */
--bg-off-white:     #F5F7FA;   /* Page background, alt sections */
--bg-paper:         #F5F1EB;   /* Warm desk/paper tone — illustrations, accents */
--bg-paper-dark:    #EDE8E1;   /* Desk edges, warm dividers */

/* NEUTRALS */
--gray-border:      #E5E7EB;   /* Borders, dividers */
--gray-light:       #F3F4F6;   /* Input backgrounds, table rows */
--gray-mid:         #9CA3AF;   /* Placeholder text, secondary labels */
--gray-text:        #6B7280;   /* Body text secondary */
--gray-dark:        #374151;   /* Body text primary */
--gray-heading:     #1a1a2e;   /* Headlines, high-contrast text */

/* SIGNALS */
--green-success:    #34D399;   /* On track, completed, streaks */
--amber-warning:    #F59E0B;   /* Streak counter, bookmarks, attention */
--red-soft:         #F87171;   /* Overdue, missed, alerts */

/* NEVER USE */
/* Neon colors, gradients on dark backgrounds, purple/pink AI clichés */
/* Glowing effects, metallic surfaces, circuit board imagery */
```

---

## 4. Typography

### Font Stack

| Role | Font | Fallback | Notes |
|------|------|----------|-------|
| **Display / Headlines** | Georgia | `'Times New Roman', serif` | Warm, trustworthy, slightly nerdy |
| **Body / UI** | System UI | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Clean, readable at small sizes |
| **Code / monospace** | `JetBrains Mono` | `'Fira Code', 'Courier New', monospace` | For technical content |

### Type Scale (CSS)

```css
--text-xs:   0.75rem;   /* 12px — labels, timestamps */
--text-sm:   0.875rem;  /* 14px — secondary UI, captions */
--text-base: 1rem;      /* 16px — body text */
--text-lg:   1.125rem;  /* 18px — lead paragraphs */
--text-xl:   1.25rem;   /* 20px — card headings */
--text-2xl:  1.5rem;    /* 24px — section headings */
--text-3xl:  1.875rem;  /* 30px — page titles */
--text-4xl:  2.25rem;   /* 36px — hero headline */
--text-5xl:  3rem;      /* 48px — large stat display */
```

### Heading Style
- Headlines: Georgia serif, `font-weight: 700`, `letter-spacing: -0.02em`
- Subheadings: Georgia serif, `font-weight: 400`, normal tracking
- Body: System UI, `font-weight: 400`, `line-height: 1.6`
- UI labels: System UI, `font-weight: 600`, uppercase + tracking for small labels

---

## 5. Spacing & Layout

```css
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-pill: 9999px;

--shadow-card: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
--shadow-soft: 0 2px 8px rgba(29, 78, 216, 0.08);
--shadow-lifted: 0 8px 24px rgba(0, 0, 0, 0.08);

/* Content max widths */
--max-prose:  680px;   /* Long-form reading content */
--max-ui:     1200px;  /* App / landing page max */
--max-narrow: 480px;   /* Focused forms, modals */
```

---

## 6. Illustration Style

### Aesthetic Direction
**Warm editorial · Paper-like · Human-centered**

Think: a well-organized desk photographed for a productivity magazine, translated into clean line illustration. NOT a tech startup UI screenshot.

### Core Rules
- Light backgrounds: `#FFFFFF` + `#F5F7FA`
- Warm surface: `#F5F1EB` for desk/paper textures
- Line style: simple, clean strokes — `stroke-width: 1.5–2px`, rounded caps
- Shapes: soft rounded rectangles, no sharp corners in decorative elements
- Subtle paper texture via SVG `feTurbulence` noise filter (opacity 0.03–0.05)
- Decorative circles/blobs at low opacity (0.03–0.06) for depth

### What to draw
✅ Desk scenes (laptop, notebook, pen, coffee mug)
✅ UI cards floating around — showing real data (progress bars, checklists, scores)
✅ Soft connecting lines between elements (dashed, `opacity: 0.2`)
✅ Warm amber bookmark ribbons, notebook covers in brand blue
✅ Progress bars, streak counters, percentage displays

### What to avoid
❌ Sci-fi holograms, neon glows, floating brains
❌ Circuit board patterns, neural network imagery
❌ Robotic characters, metallic surfaces
❌ Generic "AI" iconography (lightbulbs with circuits, etc.)
❌ 3D renders, photorealism
❌ Purple/pink gradient backgrounds

---

## 7. UI Component Patterns

### Cards
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 12px
Shadow: var(--shadow-card)
Padding: 20px 24px
Left accent bar: 4px wide, brand color or signal color
```

### Progress Bar
```
Track: #E5E7EB, height 6px, radius 3px
Fill: #1D4ED8 (on-track) / #34D399 (complete) / #F59E0B (at-risk)
```

### Status Chips / Tags
```
On track:    bg #DBEAFE, text #1D4ED8
Complete:    bg #D1FAE5, text #065F46
At risk:     bg #FEF3C7, text #92400E
Overdue:     bg #FEE2E2, text #991B1B
```

### Buttons
```
Primary:   bg #1D4ED8, text white, radius 8px, padding 10px 20px
Secondary: bg #EEF2FF, text #1D4ED8, border 1px #DBEAFE
Ghost:     no bg, text #6B7280, hover text #374151
```

---

## 8. Copy Voice & Tone

### Personality
- **Calm and confident** — doesn't shout, doesn't need to
- **Slightly nerdy but human** — references systems and frameworks without being cold
- **Direct** — no filler, no fluff
- **Confrontational when needed** — the product name is "Execution Engine", not "Productivity Pal"
- **Dutch directness** — honest, no-nonsense, anti-bullshit

### Tone modifiers by context
| Context | Tone |
|---------|------|
| Headlines | Bold, declarative, slightly provocative |
| UI labels | Neutral, functional, clear |
| Onboarding | Warm, direct, low-pressure |
| Accountability prompts | Direct, unflinching but not harsh |
| Error messages | Human, helpful, not robotic |

### Voice Examples

**✅ Do write:**
- "You said you'd do this. Did you?"
- "87% execution rate. Up from 23% twelve weeks ago."
- "Your system works. You just need to use it."
- "No dashboards. No streaks. Just: did you do the work?"

**❌ Don't write:**
- "Leverage AI-powered insights to synergize your workflow"
- "Boost your productivity with our cutting-edge platform!"
- "We're excited to announce..." (passive corporate voice)
- Anything with "game-changing", "revolutionary", "seamless"

### Banned words / phrases
`synergy` · `leverage` · `seamless` · `cutting-edge` · `game-changing` · `empower` · `holistic` · `unlock your potential` · `journey` (in business context) · `ecosystem` (unless technical) · `robust` · `scalable` (unless technical)

---

## 9. Product Vocabulary

Use these exact terms consistently:

| Term | Use for |
|------|---------|
| **Execution Engine** | The product / brand name (always capitalize both words) |
| **12 Week Year** | The methodology (capitalize) |
| **Execution Rate** | The core metric (% of planned actions completed) |
| **Weekly Focus** | The weekly goal container |
| **Daily Check-in** | The morning accountability prompt |
| **Evening Reflection** | The end-of-day review |
| **Milestone** | A measurable sub-goal within a Weekly Focus |
| **Confrontational accountability** | The style of AI check-ins (not "harsh", not "strict") |
| **Local-first** | The architecture philosophy (hyphenated) |

---

## 10. Pricing & Positioning Context

| Tier | Price | Notes |
|------|-------|-------|
| Launch price | €2,497 | One-time or payment plan |
| Full price | €4,997 | Post-launch |
| Positioning | Premium, not SaaS | Sold as a system/implementation, not a subscription |

The premium price is justified by outcome (execution rate transformation), not features.

---

## 11. Tech Stack Context (for Claude Code)

When building tools, automations, or integrations for this brand:

```
Infrastructure:  Proxmox (self-hosted VMs)
Automation:      n8n (self-hosted)
AI models:       Claude API (primary), Ollama (local fallback)
Notes/PKM:       Obsidian (local vault)
Integrations:    MCP connectors (Obsidian ↔ Claude)
Language prefs:  JavaScript/Node for automation, Python for scripts
Database:        Supabase (when cloud DB needed)
```

### Development preferences
- **Local-first** over cloud dependency where possible
- **Privacy-respecting** — no tracking, no data brokering
- **Simple and maintainable** over clever and complex
- Prefer **n8n workflows** for automation orchestration
- Prefer **markdown** for persistent context/documentation

---

## 12. File & Asset Naming

```
hero-illustration.svg       Main brand hero image
brand-colors.css            CSS custom properties
BRAND.md                    This file
logo-mark.svg               Icon/mark only
logo-full.svg               Full lockup
og-image.png                1200×630 social share image
```

---

## 13. Quick Reference Card

```
Primary blue:    #1D4ED8
Background:      #FFFFFF / #F5F7FA
Warm paper:      #F5F1EB
Headline font:   Georgia serif
Tagline:         "Build systems that actually execute."
Tone:            Calm · Direct · Slightly nerdy · Human
Never:           Neon · Glow · AI brains · Corporate buzzwords
Metric to cite:  23% → 87% execution rate
Price anchor:    €2,497 (launch) · €4,997 (full)
```

---

*Last updated: 2026-03-01 · Owner: Jelle Spek*
