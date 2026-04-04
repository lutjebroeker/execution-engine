---
phase: 06-multi-tenant-ee-core
plan: "02"
subsystem: bot
tags: [telegram, n8n, claude, tool-use, onboarding, multi-tenant, supabase]

requires:
  - phase: 06-01
    provides: 9-table multi-tenant schema (tenants, goals, memory, conversations, goal_logs) deployed to Supabase with RLS

provides:
  - n8n workflow JSON (40 nodes) for Telegram bot + Claude tool-use agent at webhook/telegram-bot
  - /start onboarding state machine (5 steps, staticData-backed) that creates tenant + goal rows
  - Claude tool-use agent supporting manage_goal, log_progress, get_goals_overview, save_memory, search_memory, web_search
  - System prompt with persona_name and tone injection per-tenant
  - Dual-Claude-call pattern (tool selection + final response with tool results)
  - Conversation history context (last 20 turns) on every message

affects:
  - 06-03
  - 06-04
  - phase-07

tech-stack:
  added: [telegram-bot-api, claude-tool-use-api, n8n-webhook, brave-search-api]
  patterns:
    - Dual Claude API call pattern — first call selects tool, second call generates final response with tool_result
    - n8n staticData for transient onboarding state (no DB writes until onboarding complete)
    - Named node references ($('Node Name')) for cross-branch data access in n8n Code nodes
    - Supabase REST API with service_role key for all DB operations (bypasses RLS)

key-files:
  created:
    - n8n/workflows/telegram-bot-agent.json
    - n8n/system-prompts/ee-agent.md
    - n8n/README.md
  modified: []

key-decisions:
  - "Use n8n webhook node (not Telegram Trigger) for manual webhook control — Telegram requires <5s response, respondToWebhook node sends 200 immediately in parallel"
  - "Onboarding state stored in n8n staticData keyed by chat_id — avoids DB writes for transient state, cleans up on completion"
  - "Dual Claude call pattern: first call with tools for tool selection, second call with tool_result to generate user-facing response"
  - "Returning /start guard added: existing tenants get 'You're already set up' — prevents duplicate tenant creation"
  - "Build Claude Messages uses named node reference to Lookup Tenant — works across branches regardless of intermediate nodes"

patterns-established:
  - "All Supabase HTTP nodes use SUPABASE_SERVICE_ROLE_KEY — consistent with cron workflow pattern from 06-01"
  - "Tool execution nodes return raw HTTP result; Build Second Claude Request formats tool_result content"
  - "Onboarding completion: staticData[chat_id] deleted, tenant + goals created atomically"

requirements-completed: [BOT-01, BOT-02, BOT-03, BOT-04]

duration: 8min
completed: 2026-04-04
---

# Phase 6 Plan 02: Telegram Bot Agent Summary

**40-node n8n workflow with Claude tool-use agent, 5-step /start onboarding via staticData, and 6 Supabase-backed tools — ready for webhook registration and human verification**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-04T12:22:02Z
- **Completed:** 2026-04-04T12:30:05Z
- **Tasks:** 2 (Task 3 deferred — human verification)
- **Files modified:** 3

## Accomplishments

- Built 40-node n8n workflow covering full Telegram → Claude → Supabase → Telegram loop
- Implemented 5-step onboarding state machine using workflow staticData (zero DB writes until complete)
- Claude tool-use agent with dual-call pattern supporting 6 tools wired to Supabase REST API
- Added returning-tenant /start guard to prevent duplicate tenant creation
- System prompt with per-tenant persona_name and tone injection

## Task Commits

1. **Task 1: Build Telegram bot agent workflow + system prompt** - `7b41968` (feat)
2. **Task 2: Add /start onboarding flow + returning-tenant guard** - `96dad08` (feat)
3. **Task 3: Human verification** - DEFERRED (checkpoint:human-verify — pending Jelle's test)

## Files Created/Modified

- `n8n/workflows/telegram-bot-agent.json` — 40-node workflow: webhook trigger, tenant routing, Claude tool-use agent, onboarding state machine
- `n8n/system-prompts/ee-agent.md` — Claude system prompt with tool definitions and persona/tone injection template
- `n8n/README.md` — Import instructions, required env vars, architecture diagram, webhook setup commands

## Decisions Made

- Used Webhook node + respondToWebhook (not Telegram Trigger node) — gives explicit control over the 200 response timing; Telegram requires acknowledgement within 5 seconds
- Onboarding state in `$getWorkflowStaticData('global')` keyed by `chat_id` — avoids tenant_id FK constraint issue (tenant doesn't exist yet during onboarding), auto-cleaned on completion
- Dual Claude call pattern: first POST to Claude with tools triggers tool_use response; second POST with tool_result block produces the final user-facing text
- "Handle Returning Tenant /start" IF node inserted in TRUE branch before conversation flow — routes /start from existing tenants to "already set up" reply

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added returning-tenant /start guard**
- **Found during:** Task 2 (onboarding flow)
- **Issue:** Plan specifies "If tenant already exists: reply 'You're already set up'" but Task 1's TRUE branch routed all existing tenants directly to conversation without checking for /start
- **Fix:** Added "Handle Returning Tenant /start" Code node + "Returning /start Check" IF node between Tenant Exists? TRUE branch and Get Conversation History — prevents duplicate tenant creation
- **Files modified:** n8n/workflows/telegram-bot-agent.json
- **Verification:** Connection targets validated; all 40 node IDs unique; no missing targets in connection graph
- **Committed in:** 96dad08 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (missing correctness guard)
**Impact on plan:** Required for correctness — plan mentioned the behavior but didn't specify where in the flow to implement it. No scope creep.

## Issues Encountered

- Credentials (TELEGRAM_BOT_TOKEN, ANTHROPIC_API_KEY, SUPABASE credentials) are all commented out in ~/.claude/.env — workflow uses n8n environment variables at runtime, not hardcoded. Env vars must be set in n8n Settings → Environment Variables before activation.
- Webhook registration (`setWebhook` curl command) requires TELEGRAM_BOT_TOKEN to be available — must be done by Jelle after bot is created via @BotFather.

## User Setup Required

Before Task 3 verification can proceed:

1. **Create bot with @BotFather** on Telegram → receive TELEGRAM_BOT_TOKEN
2. **Set n8n env vars** (n8n Settings → Environment Variables):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (from 1Password "Supabase - execution-engine")
   - `ANTHROPIC_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `BRAVE_API_KEY` (optional — web_search tool gracefully fails without it)
3. **Import workflow** in n8n UI → Workflows → Import → `n8n/workflows/telegram-bot-agent.json`
4. **Activate workflow** in n8n
5. **Register webhook** with Telegram:
   ```bash
   curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
     -d "url=https://n8n.jellespek.nl/webhook/telegram-bot"
   ```
6. **Verify webhook**: `curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"`

Then proceed with Task 3 verification steps (send /start, complete onboarding, test all 6 tools).

## Next Phase Readiness

- Workflow JSON and system prompt ready for immediate import into n8n
- Architecture matches 06-01 schema exactly (all table/column references align)
- Once human verification (Task 3) approved, 06-03 (Morning Briefing cron) and 06-04 (Check-in cron) can proceed
- Cron workflows (06-01 artifacts) already reference the same env vars — no reconfiguration needed

---
*Phase: 06-multi-tenant-ee-core*
*Completed: 2026-04-04*

## Self-Check: PASSED

Files verified:
- FOUND: n8n/workflows/telegram-bot-agent.json (47475+ bytes, 40 nodes, valid JSON)
- FOUND: n8n/system-prompts/ee-agent.md
- FOUND: n8n/README.md

Commits verified:
- FOUND: 7b41968 (Task 1)
- FOUND: 96dad08 (Task 2)
