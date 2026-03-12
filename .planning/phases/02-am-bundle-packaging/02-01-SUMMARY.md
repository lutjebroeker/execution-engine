---
phase: 02-am-bundle-packaging
plan: 01
subsystem: bundle
tags: [n8n, workflows, config-node, export, sanitize]

requires:
  - phase: 01-landing-page
    provides: landing page live — bundle links from index.html in Plan 02-03

provides:
  - bundle/workflows/am-workflows-v1.json — 22 AM workflows, sanitized, Config node pattern applied
  - bundle/audit-notes.md — community nodes, Ollama models, vault structure, workflow list for Plan 02-02

affects:
  - 02-02-docs — needs audit-notes.md for all documentation content
  - 02-03-gumroad — needs am-workflows-v1.json as the downloadable product file

tech-stack:
  added: []
  patterns:
    - "CONFIG — Edit These Values Set node (typeVersion 3.4) as first post-trigger node in every workflow"
    - "Expression pattern: {{$node[\"CONFIG — Edit These Values\"].json[\"fieldName\"]}}"
    - "Dual-trigger fan-out: both triggers wire to single Config node, Config fans out to both downstream branches"

key-files:
  created:
    - bundle/workflows/am-workflows-v1.json
    - bundle/audit-notes.md
    - bundle/workflows/fetch_and_sanitize.py
    - bundle/workflows/add_config_nodes.js
    - bundle/workflows/fix_dual_triggers.js
    - bundle/workflows/verify.js
  modified: []

key-decisions:
  - "Config node includes botToken field — several workflows call Telegram Bot API directly via HTTP Request (inline menus) and cannot use the n8n Telegram credential for the URL"
  - "Config node includes n8nHost field — Weekly Review and weekly_struggles workflows call back into the n8n instance itself via webhook-waiting URLs; buyer must supply their n8n public hostname"
  - "ollamaBaseUrl NOT in Config node — Ollama connection is managed via n8n Ollama LangChain credential; buyer configures this in n8n Credentials, not in the Config node"
  - "Vault access is via Node-RED bridge (not Obsidian Local REST API) — buyer must run Node-RED with /find_file and /create_file endpoints"
  - "No PostgreSQL required — AI memory uses n8n Data Tables; buyer creates a 'Message' Data Table in n8n after import"
  - "Ollama models required: llama3.1:8b (morning/evening) and kimi-k2.5 (quarter review)"

patterns-established:
  - "Config node name MUST be exactly: CONFIG — Edit These Values (em dash, not hyphen)"
  - "Config node placed immediately after trigger; trigger connection rewired to Config first"
  - "For dual-trigger workflows: both triggers wire to Config, Config connection array covers both downstream branches"

requirements-completed:
  - CONFIG-01
  - CONFIG-02
  - BUNDLE-01

duration: 45min
completed: 2026-03-12
---

# Phase 2 Plan 01: AM Workflow Bundle Export and Config Node Refactor Summary

**22 AM n8n workflows exported, sanitized, and refactored to the CONFIG — Edit These Values Set node pattern — buyer edits one node per workflow to go live**

## Performance

- **Duration:** ~45 min (execution session)
- **Started:** 2026-03-12
- **Completed:** 2026-03-12
- **Tasks:** 2/2
- **Files modified:** 6 (created)

## Accomplishments

- Exported all 22 active AM workflows from the live n8n instance via API, sanitized all personal values (Telegram chat ID, bot token, vault paths, Node-RED IP, Claude API key, Obsidian API key, n8n hostname)
- Added `CONFIG — Edit These Values` Set node to all 22 workflows; all hardcoded personal values replaced with `{{$node["CONFIG — Edit These Values"].json["fieldName"]}}` expressions
- Completed full audit covering community nodes, Ollama models, vault structure, and workflow list — documented in `bundle/audit-notes.md` for Plan 02-02 documentation authoring
- Fixed dual-trigger bypass in Quarter Review and ap_morning sub-workflow — both triggers now route through Config before downstream processing

## Task Commits

1. **Task 1: Audit live workflows** - `a058a2b` (chore)
2. **Task 2: Config node refactor and export** - `[pending final commit]` (feat)

## Files Created/Modified

- `bundle/workflows/am-workflows-v1.json` — 22 workflows, ~470KB, single importable JSON array
- `bundle/audit-notes.md` — 5-section audit: community nodes, hardcoded values, Ollama models, Postgres (none), workflow list + architecture notes + Config refactor results
- `bundle/workflows/fetch_and_sanitize.py` — fetches from n8n API and replaces personal values with placeholders
- `bundle/workflows/add_config_nodes.js` — injects CONFIG Set node into each workflow, rewires trigger connections
- `bundle/workflows/fix_dual_triggers.js` — fixes secondary triggers that bypassed Config node
- `bundle/workflows/verify.js` — verifies Config node presence, expression patterns, and no leaked personal values

## Decisions Made

- **botToken in Config node** — not just via n8n Telegram credential. Several workflows use direct Telegram Bot API HTTP Requests (for inline keyboard menus) that embed the token in the URL. These cannot use the n8n credential system for URL construction, so the token must be a Config node field.
- **n8nHost in Config node** — Weekly Review and weekly_struggles workflows call back to the n8n instance's own webhook-waiting endpoints. Buyer must supply their n8n public hostname.
- **ollamaBaseUrl excluded from Config** — Managed via n8n's native Ollama LangChain credential. Cleaner UX: buyer sets it once in Credentials rather than per-workflow Config node.
- **No PostgreSQL** — The original plan assumed Postgres. Live system uses n8n Data Tables exclusively. This simplifies buyer prerequisites significantly.
- **Node-RED instead of Obsidian Local REST API** — The live system uses a Node-RED bridge for all vault file I/O. This is a significant documentation change for Plan 02-02: buyers need Node-RED running, not the Obsidian plugin.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Dual-trigger bypass fix**
- **Found during:** Task 2 (Config node injection)
- **Issue:** Two workflows (Quarter Review, ap_morning) had secondary triggers that connected directly to downstream nodes, bypassing the Config node. Values in those branches would not be available from Config.
- **Fix:** Rewired secondary triggers to Config; Config connection array extended to fan out to both downstream branches.
- **Files modified:** bundle/workflows/am-workflows-v1.json
- **Verification:** verify.js confirms all 22 workflows show Config as first downstream from all triggers.
- **Committed in:** Task 2 commit

**2. [Rule 2 - Missing Critical] Added botToken and n8nHost to Config node fields**
- **Found during:** Task 2 (audit of placeholder values across all workflows)
- **Issue:** Original plan's Config node template (from RESEARCH.md) did not include botToken or n8nHost. Analysis of live workflows showed these are needed in 10+ workflows.
- **Fix:** Extended Config node field set to include botToken and n8nHost.
- **Files modified:** bundle/workflows/add_config_nodes.js, bundle/workflows/am-workflows-v1.json
- **Verification:** No `YOUR_BOT_TOKEN` or `YOUR_N8N_HOST` remain outside Config node parameters.
- **Committed in:** Task 2 commit

---

**Total deviations:** 2 auto-fixed (both Rule 2 — missing critical)
**Impact on plan:** Both fixes required for correctness. Without them, buyer would have unediteable hardcoded values in exported workflows.

## Issues Encountered

- n8n API key in `fetch_and_sanitize.py` expired (403 Forbidden on all endpoints). Required manual API key renewal by Jelle before export could proceed. Script ran cleanly after key was updated.
- Week Planning and Week Review already had a `Config` **Code node** (not Set node) from previous development — a different pattern with similar intent. The standard `CONFIG — Edit These Values` Set node was added alongside it; the existing Code node's `anthropicApiKey` and `obsidianApiKey` fields were updated to reference the new Config Set node expressions.

## User Setup Required

After importing `bundle/workflows/am-workflows-v1.json` into a clean n8n instance, each buyer must:

1. In each workflow, open the `CONFIG — Edit These Values` node and fill in all fields
2. Create a `Message` Data Table in n8n (columns: messageID, sender, resumeUrl)
3. Set up n8n Credentials: Telegram credential (bot token), Ollama LangChain credential (base URL)
4. Run Node-RED with `/find_file` and `/create_file` endpoints pointing at their vault
5. Pull Ollama models: `ollama pull llama3.1:8b` and `ollama pull kimi-k2.5`

These steps will be documented in Plan 02-02 README.

## Next Phase Readiness

- `bundle/audit-notes.md` is the primary input for Plan 02-02 documentation — all 5 sections complete plus Config refactor notes
- `bundle/workflows/am-workflows-v1.json` is the product file for Plan 02-03 Gumroad listing
- Key architecture change for docs: Node-RED (not Obsidian Local REST API) + n8n Data Tables (not PostgreSQL) — Plan 02-02 must document the Node-RED setup
- n8n version compatibility: workflows exported from the current live instance; minimum n8n version should be documented in README (recommend noting the export version from the JSON metadata)

---
*Phase: 02-am-bundle-packaging*
*Completed: 2026-03-12*
