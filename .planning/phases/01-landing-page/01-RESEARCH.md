# Phase 1: Landing Page - Research

**Researched:** 2026-03-01
**Domain:** Static HTML/CSS/JS landing page — waitlist capture, Supabase integration, Vercel deployment
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Headline Formula**
- Problem-led opening — lead with the pain that resonates with the target persona: people who have a system but don't follow through
- Hero headline direction: "You have a system. You just don't follow through." (or equivalent direct problem statement)
- Subheadline positions the solution: not a course, not an app — a working system that already runs via Telegram AI check-ins
- Key proof point in hero: 23% → 87% execution rate (first-person, creator's own result)
- BRAND.md tone applies: calm, direct, no hype, Dutch directness

**Page Structure & Section Order**
Strict Hormozi/Priestley flow, top to bottom:
1. Nav — minimal: logo + "Join Waitlist" anchor link (no other nav items)
2. Hero — headline + subheadline + email capture form + key stat (23%→87%)
3. Problem — name the specific pain: tried productivity before, nothing sticks when life gets busy (COPY-03)
4. Agitation — cost of the problem: years of wasted potential, unfulfilled projects (COPY-04)
5. Solution — Execution Engine is already built and running, not a course (COPY-05)
6. How it works — Vision → 12-Week Cycle → Daily AI Check-in → Weekly Review → Quarterly Review (COPY-06)
7. Demo — embedded short-form video or GIF showing Telegram bot in action (DMND-04) — placed here to make the system feel real right before social proof
8. Social proof — personal results: execution score, streaks, completed cycles (COPY-07)
9. Value stack — Hormozi-style €652 perceived value vs €2,497 launch price (COPY-08)
10. Guarantee — Day 1 result or full refund (COPY-09)
11. Scarcity — first 20 buyers get free 1:1 setup call (COPY-10)
12. FAQ — answers "Do I need n8n?", "Do I need Obsidian?", "Not technical?", "vs LifeOS?" (COPY-11)
13. Final CTA — second email capture form + repeat of guarantee

**Email Capture UX**
- Primary placement: inline in hero section — email field + "Join Waitlist" button, no name field (lowest friction)
- Secondary placement: dedicated CTA section at bottom of page (repeat)
- No sticky bar — keep the page clean and editorial
- Post-submit: inline confirmation message within the form area ("You're on the list. Watch your inbox.") — no redirect, no separate thank-you page for Phase 1
- Form POSTs to Supabase directly via fetch() — table: `execution_engine_waitlist`
- Fields collected: email only (name optional if Supabase schema allows)

**Social Proof Strategy**
- Solo founder = only proof is personal results — own this directly rather than hiding it
- Framing: "I built this for myself. Here's what happened." — first-person, creator using own system
- Show raw stats: execution rate improvement (23% → 87%), number of weeks running, number of completed cycles
- Use screenshot-style UI mockups of real dashboard/Telegram messages rather than testimonial quotes (no fake testimonials)
- Optional: "n=1" transparency as a strength — "This is my system. I'm selling you the car I drive."

**Visual Design (aligned with BRAND.md)**
- Theme: Light, not dark — BRAND.md specifies white/off-white backgrounds
- Fonts: Georgia (headlines) + System UI (body) — NO Lora, NO DM Sans, NO Inter
- Primary color: `#1D4ED8` for CTAs, links, progress indicators
- Warm paper accent: `#F5F1EB` for section background alternation
- Illustration style: editorial, warm desk-scene aesthetic — no sci-fi, no neon, no dark gradients
- Layout: max-width 1200px, generous whitespace, asymmetric where appropriate

**Pricing Display**
- Show €2,497 launch price (NOT €149 — that was an earlier iteration, BRAND.md is authoritative)
- Full price anchor: €4,997 post-launch
- Waitlist CTA: join list now → get launch pricing when available
- Value stack: show individual component values summing to €652+ perceived value vs €2,497 launch price

**Technical Build (BUILD requirements)**
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

### Deferred Ideas (OUT OF SCOPE)
- Separate thank-you page with expectations-setting content — could be Phase 1.5 if needed
- Email nurture sequence / Listmonk automation — Phase 2
- Gumroad product page link — Phase 2
- Animated hero illustration with SVG — could add post-launch
- A/B testing different hero headlines — post-launch
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COPY-01 | Hero section with positioning headline that resonates with target audience pain | Brand voice patterns, Hormozi value equation framework — problem-led headline converts |
| COPY-02 | Hero section primary CTA (email waitlist capture) | Email form UX research: single field, inline confirmation, disable-on-submit pattern |
| COPY-03 | Problem section naming the specific pain | Priestley demand generation structure — problem must be named before agitation |
| COPY-04 | Agitation section showing the cost of the problem | Standard PAS (Problem-Agitate-Solution) framework, placed after problem |
| COPY-05 | Solution section — system already built and running, not a course | Differentiation copy: "car vs driving lesson" framing from CONTEXT.md |
| COPY-06 | "How it works" section: Vision → 12-Week Cycle → Daily AI Check-in → Weekly Review → Quarterly Review | Sequential step pattern — 5 steps, visualized as numbered flow or horizontal timeline |
| COPY-07 | Social proof section: personal results (execution score, streaks, completed cycles) | n=1 transparency framing; screenshot-style UI mockups, no fake quotes |
| COPY-08 | Value stack: Hormozi-style perceived component value vs €2,497 launch price | Value stack table pattern: line-by-line components with strikethrough totals |
| COPY-09 | Guarantee section: "Day 1 result or full refund" | Risk reversal copy: specific trigger event (vault set up + first Telegram check-in) |
| COPY-10 | Scarcity/urgency: first 20 buyers get free 1:1 setup call (€249 value) | Scarcity must be real and specific — "first 20 buyers" with named value |
| COPY-11 | FAQ section: 4 mandated topics (n8n, Obsidian, non-technical, vs LifeOS) | FAQ placed near bottom to handle objections before final CTA |
| DMND-01 | Landing page live at a URL | Vercel static deploy — no config needed for single index.html |
| DMND-02 | Email capture form POSTs to Supabase via fetch() — table: `execution_engine_waitlist` | Supabase JS v2 CDN script, createClient, .from().insert() — RLS must allow anon INSERT |
| DMND-03 | Thank-you/confirmation after email capture | Inline DOM swap: hide form, show confirmation message — no redirect |
| DMND-04 | "Product Demo" section: embedded short-form video or GIF showing Telegram bot | `<video autoplay muted loop playsinline>` for GIF-like MP4; or YouTube/Loom iframe embed |
| DMND-05 | Page shareable — meta tags, og:image, og:title for LinkedIn/WhatsApp | Full OG tag set in `<head>`, og:image must be absolute URL, 1200×630 PNG/JPEG |
| BUILD-01 | Self-contained pure HTML/CSS/JS, hosted on Vercel | Single index.html at repo root; Vercel auto-detects static, no vercel.json needed |
| BUILD-02 | Light theme, editorial aesthetic — Georgia + System UI, #1D4ED8, white/off-white | CSS custom properties from BRAND.md verbatim — no external CSS framework |
| BUILD-03 | Mobile responsive — mobile-first | CSS mobile-first: base styles → @media (min-width: 768px) breakpoints |
| BUILD-04 | Page loads fast (<3s) — no unnecessary dependencies | WebP images, preconnect for fonts, defer Supabase script, inline critical CSS |
| BUILD-05 | Analytics tracking (Plausible or GA4) | Plausible: 1KB script, no cookies, no consent banner needed — recommended |
</phase_requirements>

---

## Summary

This phase produces a single `index.html` landing page — no framework, no build step, no npm. The tech decisions are already locked: pure HTML/CSS/JS hosted on Vercel, Supabase for email capture, Plausible for analytics. The primary planning challenge is ensuring the two plans (copy/structure and build/deploy) are sequenced correctly and that the Supabase integration is properly secured.

The page uses Supabase JS v2 loaded via CDN `<script>` tag. The anon key is safe to expose in browser code provided Row Level Security is enabled on the `execution_engine_waitlist` table with an INSERT policy for the `anon` role. Without this RLS policy, the table will be fully open — this is the highest-risk implementation detail in the phase.

Performance is achievable well within the <3s target for a pure HTML page: the only external dependencies are the Google Fonts CDN (preconnect-optimized) and the Supabase JS CDN script (deferred). Plausible analytics adds ~1KB. The og:image (1200×630) must be an absolute URL pointing to a deployed asset — a Wave 0 asset creation task is needed.

**Primary recommendation:** Build the HTML structure and copy first (Plan 01-01), then wire up Supabase, deploy to Vercel, and add analytics (Plan 01-02). The copy plan can proceed entirely without Supabase credentials; the build plan depends on copy being complete.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Supabase JS | v2 (CDN) | Email INSERT to `execution_engine_waitlist` | Project already uses Supabase; anon key safe with RLS; no npm needed |
| Google Fonts | CDN | JetBrains Mono for code sections (Georgia is system font, no CDN needed) | Georgia is a system font — no CDN required. JetBrains Mono only if used in demo/code blocks |
| Plausible Analytics | Latest CDN | Lightweight privacy-first page view tracking | 1KB script, no cookies, no consent banner, GDPR compliant |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| No CSS framework | — | Vanilla CSS only | Stack decision is locked: no Tailwind, no Bootstrap |
| Video/GIF (MP4) | — | Demo section (DMND-04) | Self-hosted MP4 with `autoplay muted loop playsinline` preferred over GIF for file size |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plausible | GA4 | GA4 requires cookie consent banner for EU users; Plausible does not. Plausible recommended. |
| Supabase CDN script | Native fetch to REST API | REST API works without JS library but requires manual header construction; CDN script simpler |
| MP4 video | YouTube/Loom embed | Embedded iframes add external dependency and tracking; self-hosted MP4 better for performance and privacy |

**Installation:** No npm. All dependencies loaded via `<script>` and `<link>` tags in `index.html`.

---

## Architecture Patterns

### Recommended File Structure

```
/                          # Repo root (Vercel reads from here)
├── index.html             # Single page — all HTML content
├── style.css              # All CSS (imported in <head>)
├── main.js                # All JS: form handler, Supabase client
├── og-image.png           # 1200×630 social share image (must be committed)
└── assets/
    ├── demo.mp4           # Telegram bot demo video (or demo.gif)
    └── logo.svg           # Brand mark for nav/footer
```

### Pattern 1: Mobile-First CSS with CSS Custom Properties

**What:** All design tokens from BRAND.md defined as CSS custom properties in `:root`. Layout built mobile-first — base styles target 320px, `@media (min-width: 768px)` and `@media (min-width: 1024px)` expand to desktop.

**When to use:** Always — this is the only CSS approach for this project.

**Example:**
```css
/* Source: BRAND.md CSS variables */
:root {
  --blue-brand:   #1D4ED8;
  --bg-white:     #FFFFFF;
  --bg-off-white: #F5F7FA;
  --bg-paper:     #F5F1EB;
  --gray-heading: #1a1a2e;
  --gray-dark:    #374151;
  --max-ui:       1200px;
  --max-prose:    680px;
}

/* Mobile-first section */
.section {
  padding: 3rem 1.25rem;
}

@media (min-width: 768px) {
  .section {
    padding: 5rem 2rem;
  }
}
```

### Pattern 2: Supabase CDN Insert with Inline Confirmation

**What:** Load Supabase JS v2 via CDN `<script>` tag. On form submit: prevent default, disable button, insert row, swap form for confirmation message in DOM. Handle errors inline.

**When to use:** For both hero form and bottom CTA form (same handler, different form IDs).

**Example:**
```html
<!-- In <head> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

```javascript
// Source: https://supabase.com/docs/reference/javascript/installing
const { createClient } = supabase;
const client = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_ANON_KEY'
);

async function handleWaitlistSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const email = form.querySelector('input[type="email"]').value;

  btn.disabled = true;
  btn.textContent = 'Joining...';

  try {
    const { error } = await client
      .from('execution_engine_waitlist')
      .insert({ email });

    if (error) throw error;

    // Inline confirmation — no redirect
    form.innerHTML = '<p class="form-success">You\'re on the list. Watch your inbox.</p>';
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Join Waitlist';
    // Show inline error
    let errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      form.appendChild(errEl);
    }
    errEl.textContent = 'Something went wrong. Try again.';
  }
}

document.querySelectorAll('.waitlist-form').forEach(form => {
  form.addEventListener('submit', handleWaitlistSubmit);
});
```

### Pattern 3: Open Graph Tags for Social Sharing

**What:** Full OG tag set in `<head>`. og:image MUST be an absolute URL (relative paths fail on social platforms).

**When to use:** Required for DMND-05.

**Example:**
```html
<!-- Source: https://ogp.me — Open Graph protocol -->
<meta property="og:type"        content="website" />
<meta property="og:title"       content="Execution Engine — Build systems that actually execute." />
<meta property="og:description" content="You have a system. You just don't follow through. Execution Engine is the working system — Telegram AI check-ins, 12-Week Year, 23% → 87% execution rate." />
<meta property="og:image"       content="https://execution.engine/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url"         content="https://execution.engine" />

<!-- Twitter/X Card (also renders on LinkedIn) -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Execution Engine — Build systems that actually execute." />
<meta name="twitter:description" content="You have a system. You just don't follow through." />
<meta name="twitter:image"       content="https://execution.engine/og-image.png" />
```

### Pattern 4: Google Fonts Performance-Safe Loading

**What:** Preconnect to Google Fonts domains before the stylesheet request. Only load JetBrains Mono (Georgia is system font — zero CDN cost).

**When to use:** If JetBrains Mono is used in demo/code blocks. If not used, skip entirely.

**Example:**
```html
<!-- Source: https://requestmetrics.com/web-performance/5-tips-to-make-google-fonts-faster/ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

### Pattern 5: Demo Video (DMND-04)

**What:** Self-hosted MP4 with `autoplay muted loop playsinline` attributes. No GIF (3-10x larger file). No external embed for performance.

**When to use:** Demo section showing Telegram bot.

**Example:**
```html
<video
  autoplay
  muted
  loop
  playsinline
  width="800"
  style="max-width: 100%; border-radius: 12px;"
>
  <source src="/assets/demo.mp4" type="video/mp4">
</video>
```

### Anti-Patterns to Avoid

- **Using `@import` for Google Fonts in CSS:** Forces sequential load. Use `<link>` in `<head>` instead.
- **Relative URL for og:image:** Will silently fail on LinkedIn/WhatsApp. Must be absolute URL (`https://...`).
- **Missing RLS policy on Supabase table:** Anon key exposed in browser + no RLS = table open to the world. Always set INSERT policy for `anon` role.
- **No `defer` on Supabase script:** Blocks HTML parsing. Add `defer` attribute.
- **Re-enabling form on success:** Form should be replaced with confirmation message, not re-enabled. Prevents double-submit.
- **Using `.gif` files for demo:** GIFs are 3-10x larger than equivalent MP4. Use `<video>` with MP4.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email duplicate detection | Custom JS dedup logic | Supabase unique constraint on `email` column | DB-level constraint handles concurrency; JS check has race condition |
| Analytics | Custom event logging | Plausible 1-line snippet | Plausible handles session, referrer, page tracking; custom analytics misses edge cases |
| Social preview testing | Manual guess-and-check | opengraph.xyz validator | Shows exactly how LinkedIn/WhatsApp will render OG tags before deploying |
| og:image creation | CSS screenshot hack | Design in Figma/Canva → export 1200×630 PNG | Must be a committed static asset; CSS-to-image is not reliable for social crawlers |

**Key insight:** The only genuinely custom code in this phase is the form handler and the page copy. Everything else (analytics, image sizing, OG tag format) has documented standards.

---

## Common Pitfalls

### Pitfall 1: Supabase Anon Key Exposed Without RLS

**What goes wrong:** The anon key is visible in browser source. Without RLS enabled + INSERT policy on `execution_engine_waitlist`, anyone who reads the source can read, write, or delete all rows.

**Why it happens:** Tables created outside the Supabase dashboard may not have RLS enabled by default.

**How to avoid:** Before deploying, verify in Supabase dashboard: Table Editor → `execution_engine_waitlist` → RLS Enabled = ON. Add policy: `CREATE POLICY "allow_public_insert" ON execution_engine_waitlist FOR INSERT TO anon WITH CHECK (true);`

**Warning signs:** No RLS badge in Supabase dashboard; able to read all rows via REST API without auth token.

### Pitfall 2: og:image Relative URL

**What goes wrong:** LinkedIn and WhatsApp crawlers cannot resolve relative paths. The og:image shows as blank.

**Why it happens:** Dev habit of using relative paths like `/og-image.png`.

**How to avoid:** Always write the full absolute URL including protocol and domain in og:image. Update after domain is confirmed.

**Warning signs:** Test with https://www.opengraph.xyz before launch.

### Pitfall 3: Georgia Not Loading From CDN

**What goes wrong:** Georgia is a system font available on Windows/Mac/Linux. It is NOT a Google Font. Attempting to load it via Google Fonts will fail silently or load a substitute.

**Why it happens:** Confusion between web fonts and system fonts.

**How to avoid:** Use `font-family: Georgia, 'Times New Roman', serif;` directly in CSS. No CDN load needed.

**Warning signs:** Any `<link>` to Google Fonts for "Georgia" is wrong.

### Pitfall 4: Form Double-Submit

**What goes wrong:** User clicks "Join Waitlist" twice quickly → two rows inserted with same email.

**Why it happens:** No button disable on first click.

**How to avoid:** On `submit` event: immediately set `btn.disabled = true`. Only re-enable if there's an error. Replace form with confirmation on success. Add UNIQUE constraint on `email` column in Supabase as DB-level backstop.

**Warning signs:** Duplicate emails in the `execution_engine_waitlist` table.

### Pitfall 5: Mobile Viewport Not Set

**What goes wrong:** Page renders at desktop width on mobile — tiny text, no response to touch.

**Why it happens:** Missing `<meta name="viewport">` tag.

**How to avoid:** Include in `<head>`: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

**Warning signs:** Chrome DevTools mobile simulation shows zoomed-out full-desktop layout.

### Pitfall 6: Vercel Deploy With Wrong Output Directory

**What goes wrong:** Vercel looks for a `dist/` or `public/` folder and deploys an empty site.

**Why it happens:** Vercel defaults may expect a build output directory.

**How to avoid:** For a root-level `index.html`, Vercel auto-detects it as a static site. If issues arise, set Output Directory to `.` (root) in Vercel project settings. No `vercel.json` needed for basic static deploy.

**Warning signs:** Vercel dashboard shows 404 on the root URL despite successful deploy.

---

## Code Examples

### Supabase RLS Policy (run in Supabase SQL Editor)
```sql
-- Source: https://supabase.com/docs/guides/database/postgres/row-level-security
-- Enable RLS on the waitlist table
ALTER TABLE execution_engine_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT only (no SELECT, no UPDATE, no DELETE)
CREATE POLICY "allow_public_insert"
ON execution_engine_waitlist
FOR INSERT
TO anon
WITH CHECK (true);
```

### HTML Document Shell
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Execution Engine — Build systems that actually execute.</title>

  <!-- OG Tags -->
  <meta property="og:type"        content="website" />
  <meta property="og:title"       content="Execution Engine — Build systems that actually execute." />
  <meta property="og:description" content="You have a system. You just don't follow through." />
  <meta property="og:image"       content="https://YOUR_DOMAIN/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card"  content="summary_large_image" />
  <meta name="twitter:image" content="https://YOUR_DOMAIN/og-image.png" />

  <!-- Fonts (only if JetBrains Mono needed) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Sections go here -->

  <!-- Supabase (defer so it doesn't block render) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>
  <script src="main.js" defer></script>

  <!-- Plausible Analytics -->
  <script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script>
</body>
</html>
```

### Value Stack Table HTML Pattern
```html
<!-- COPY-08: Hormozi value stack -->
<section class="section section--paper">
  <div class="container">
    <h2>What you get</h2>
    <table class="value-stack">
      <tbody>
        <tr>
          <td>n8n Morning System (15+ workflows)</td>
          <td><s>€297</s></td>
        </tr>
        <tr>
          <td>Obsidian Vault Starter</td>
          <td><s>€97</s></td>
        </tr>
        <tr>
          <td>Setup Guide + Quick Start</td>
          <td><s>€147</s></td>
        </tr>
        <tr>
          <td>1:1 Setup Call (first 20 only)</td>
          <td><s>€249</s></td>
        </tr>
        <tr class="value-stack__total">
          <td>Total perceived value</td>
          <td>€652+</td>
        </tr>
        <tr class="value-stack__price">
          <td>Launch price</td>
          <td>€2,497</td>
        </tr>
      </tbody>
    </table>
    <p class="value-note">Full price after launch: €4,997. Join the waitlist to lock in launch pricing.</p>
  </div>
</section>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GIF for demo animations | MP4 `<video autoplay muted loop>` | ~2018, now standard | 3-10x smaller file size |
| `@import` CSS fonts | `<link rel="preconnect">` + `<link>` stylesheet | ~2020 | Eliminates render-blocking font load |
| jQuery for DOM manipulation | Vanilla JS (`querySelector`, `fetch`) | ~2019 | No dependency needed for simple DOM ops |
| Separate thank-you page redirect | Inline DOM swap on success | Current best practice | Faster perceived UX, simpler implementation |
| Google Analytics (GA3/UA) | Plausible or GA4 | GA3 deprecated July 2023 | Plausible = no consent banner for EU |

**Deprecated/outdated:**
- Google Universal Analytics (UA): Shut down July 2023. Use GA4 or Plausible.
- `<img>` tags for GIF demos: Replace with `<video autoplay muted loop playsinline>` + MP4.

---

## Open Questions

1. **Demo video asset (DMND-04)**
   - What we know: Section requires a short video or GIF of Telegram bot in action
   - What's unclear: The demo asset (video/GIF/screenshot) does not yet exist — URL listed as "TBD" in CONTEXT.md
   - Recommendation: Create demo asset as part of Plan 01-01 or 01-02. A screenshot mockup of a Telegram conversation is a valid fallback. If no video exists at build time, use a styled static mockup instead. Mark DMND-04 as partially fulfilled.

2. **Custom domain for og:image absolute URL**
   - What we know: og:image must be an absolute URL; domain is not yet confirmed
   - What's unclear: Final domain (execution.engine, executionengine.io, or Vercel subdomain)
   - Recommendation: Deploy to Vercel first (executionengine.vercel.app), use that URL for og:image initially. Update to custom domain in a follow-up task.

3. **Plausible account setup**
   - What we know: Plausible requires account registration and adds your domain to get the script snippet
   - What's unclear: Whether a Plausible account already exists for this project
   - Recommendation: Plan 01-02 should include a task to register at plausible.io and retrieve the domain-specific snippet. GA4 is the fallback (no account needed for basic snippet structure, but requires a property ID).

---

## Sources

### Primary (HIGH confidence)
- https://supabase.com/docs/reference/javascript/installing — CDN installation method for supabase-js v2
- https://supabase.com/docs/reference/javascript/insert — `.insert()` syntax
- https://supabase.com/docs/guides/database/postgres/row-level-security — RLS policies and anon key security
- https://plausible.io/docs/plausible-script — Plausible script installation
- BRAND.md (project file) — all design tokens, typography, color palette, copy voice
- 01-CONTEXT.md (project file) — all locked decisions

### Secondary (MEDIUM confidence)
- https://requestmetrics.com/web-performance/5-tips-to-make-google-fonts-faster/ — preconnect font loading pattern (verified against MDN performance docs)
- https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide — OG image dimensions 1200×630 (consistent with ogp.me spec)
- Vercel static deploy docs (multiple corroborating sources) — no config needed for root index.html

### Tertiary (LOW confidence)
- WebSearch findings on Hormozi value stack landing page patterns — general copywriting principles, not technically verifiable

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Supabase v2 CDN confirmed from official docs; Plausible confirmed from official docs
- Architecture: HIGH — Pure HTML/CSS/JS with no framework; file structure is trivially simple
- Pitfalls: HIGH for Supabase RLS (official docs confirmed), HIGH for og:image absolute URL (ogp.me spec), MEDIUM for Vercel deploy quirks (multiple corroborating sources)
- Copy/conversion patterns: MEDIUM — Hormozi framework is well-documented; specific conversion rates from WebSearch not independently verified

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable stack — Supabase v2 and Plausible APIs are mature)
