# Phase 6: Multi-tenant EE Core - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

A multi-tenant AI accountability bot on Telegram backed by Supabase + n8n. Covers: self-service /start onboarding, daily morning briefing (07:00), accountability check-in (17:00), Sunday weekly review with execution score, and natural-language goal management via Claude tool-use agent. A second user can onboard via the same bot link with full data isolation. Dogfooded by Jelle for 2+ weeks to produce real execution scores.

Publishing, scorecard wiring, Stripe, and the Intelligence Engine are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Agent Tone & Voice
- Tone is configurable per tenant — set during /start onboarding
- Three tone options offered: Direct (Alex Hormozi-style, no fluff), Warm (encouraging, personal), Professional (neutral, structured)
- Default tone: Direct
- Bot persona name is set during /start — free text input ("What should I call myself?")
- When user misses or reports low execution: Direct tone calls it out plainly ("You said you'd do X. You didn't. What's the plan tomorrow?") — configurable default
- During free-form chat (not a cron moment): task-focused behavior — interpret as goal/memory/progress action, confirm, get out of the way

### Morning Briefing Format
- Leads with Top 3 priorities for today (AI-selected based on active goals)
- One-line yesterday reflection included: "Yesterday: 2/3 completed (67%)."
- Length: 5-8 lines max — fast to read on mobile
- Ends with one optional prompt: "Anything to add before you start?" — invites a quick goal note or adjustment

### Execution Score Mechanics
- Daily score: binary — each priority is 0 or 1. Score = completed / total (e.g., 2/3 = 67%)
- Check-in (17:00) asks about each priority by name: "Did you complete: 1. [Priority]? Reply yes/no for each."
- Thresholds: 70%+ = good, 50–70% = okay, <50% = flagged in weekly review
- Weekly score = % of all daily priorities completed during the week
- Sunday pattern observation: narrative insight, not a data list ("Wednesday was your worst day 3 weeks running. Three unfinished priorities each time involved client calls.")

### Onboarding Flow (/start)
- Collects: up to 3 goals, work schedule (when do you start?), preferred check-in time, tone choice, bot persona name
- Vague goal input: bot asks one clarifying question ("'Be healthier' is a good start. What's the specific outcome you want in 12 weeks?"), then accepts whatever they give
- Confirmation message: summary + first briefing time
  ```
  You're live.
  
  Goals set:
  • [Goal 1]
  • [Goal 2]
  • [Goal 3]
  
  First briefing: tomorrow at 07:30
  Check-in: daily at 17:00
  
  See you then.
  ```
- Existing account sends /start again: block with clear message — "You're already set up. Your last briefing was [date]. Use /help to see what I can do."

### Claude's Discretion
- Loading/fallback behavior if Supabase is unreachable during a cron
- Exact phrasing of check-in questions beyond structure
- How to handle tenants who never respond to check-ins (stale data)
- Progress bar or typing indicator behavior in n8n webhook

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- n8n already running at n8n.jellespek.nl with Cloudflare Tunnel — INFRA-02 partially satisfied, webhook URL is stable
- 22 AM (accountability manager) workflows in bundle — ~70% reusable as basis for new Telegram agent logic
- Claude API tool-use pattern validated in Phase 3 (Supabase Edge Functions) — BOT-03 builds directly on this

### Established Patterns
- Supabase client + schema patterns validated in Phases 3–4 — INFRA-01 is net-new (multi-tenant + RLS), but SDK usage is familiar
- n8n webhook trigger → Claude API → Supabase write pattern already exists in prior workflows

### Integration Points
- Telegram webhook → n8n trigger → Claude tool-use agent → Supabase (tenants, goals, daily_priorities, memory tables)
- Three n8n cron nodes: 07:00 (briefing), 17:00 (check-in), Sunday 18:00 (weekly review) — each loops active tenants
- Tone and persona name stored in tenant row in Supabase — injected into Claude system prompt per request

</code_context>

<specifics>
## Specific Ideas

- Morning briefing format confirmed via preview: "Good morning. Three things matter today: 1. [Priority] — [why it matters]. Your score yesterday: 67%"
- Confirmation message format confirmed via preview — clean closure with goal summary + first briefing time
- The dogfooding period (2+ weeks) is the success gate — the system should feel usable enough that Jelle actually uses it daily, not just technically complete

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-multi-tenant-ee-core*
*Context gathered: 2026-04-04*
