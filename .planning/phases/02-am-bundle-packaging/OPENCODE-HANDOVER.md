# Phase 2 — AM Bundle Packaging: OpenCode Handover

**Created by:** Claude Code (plan-phase workflow)
**Verified by:** Claude Code after completion (see [Verification Checklist](#verification-checklist-for-claude-code) at the bottom)
**Working directory:** `/root/projects/personal/execution-engine`

---

## What This Phase Delivers

The AM workflow bundle (15+ n8n workflows already running in production) gets packaged into a shippable product that a complete beginner can set up in 30 minutes and purchase on Gumroad.

**Phase is done when:**
1. All 15+ workflows export as one JSON file with a single Config node per workflow (no hardcoded personal values)
2. A buyer who has never used Obsidian, Telegram bots, Ollama, or PostgreSQL can follow the README from prerequisites to first Telegram check-in without guessing a step
3. The Obsidian Vault Starter ZIP unpacks to the exact folder structure the workflows expect
4. The Gumroad product page is live at €2,497 with the bundle ZIP attached — a buyer can purchase and download without contacting the seller
5. The landing page "Claim launch price" button links to the Gumroad page

---

## Project Context

- **Product:** Execution Engine — n8n + Obsidian + Telegram morning routine system
- **Owner:** Jelle Spek (support@jellespek.nl)
- **Live landing page:** https://execution-engine-lake.vercel.app
- **Repo:** `lutjebroeker/execution-engine` (Vercel auto-deploys on push to master)
- **Phase 1 (done):** Landing page built and deployed — `index.html` at project root
- **This phase:** Package the AM bundle as a buyable product

**Key brand decisions:**
- Price: €2,497 launch / €4,997 full (crossed out on Gumroad)
- Email sender: support@jellespek.nl via Resend
- Language: English throughout
- Tone: calm, direct, no fluff

---

## Execution Order

Plans run **sequentially** — each depends on the previous:

```
Plan 02-01 (Wave 1) → Plan 02-02 (Wave 2) → Plan 02-03 (Wave 3)
```

Commit after each plan completes. Use `git add <specific files>` not `git add -A`.

---

## Plan 02-01 — Workflow Audit + Config Node Refactor + Export

**File:** `.planning/phases/02-am-bundle-packaging/02-01-PLAN.md`
**Autonomous:** No — starts with a human-gated checkpoint
**Produces:** `bundle/workflows/am-workflows-v1.json`, `bundle/audit-notes.md`

### Task 1 — HUMAN ACTION REQUIRED (you, Jelle)

Claude cannot access the live n8n instance. **Stop here and ask Jelle to complete the audit.**

Tell Jelle to create `bundle/audit-notes.md` (create the `bundle/` directory if it doesn't exist) with these 5 sections:

```markdown
## Section 1 — Community nodes
[List any node type NOT in standard n8n built-ins. Standard includes: Webhook, Set, HTTP Request,
Schedule, IF, Switch, Merge, Code, Postgres, Telegram, Manual Trigger, Respond to Webhook,
Stop and Error, Split In Batches, Wait, AI Agent, OpenAI, Anthropic.]
For each: node name + which workflows use it.

## Section 2 — Hardcoded values to centralise
[Scan every workflow for: Telegram chat IDs, localhost URLs, API keys set directly in node
parameters (not via n8n credentials). Format: workflow name → node name → field → masked value]

## Section 3 — Ollama models in use
[Exact model name(s) from HTTP Request nodes calling localhost:11434 — e.g. llama3, mistral]

## Section 4 — Postgres table schema
[CREATE TABLE statements or table name + columns for each table used by AI Agent memory nodes]

## Section 5 — Workflow list
[Every workflow name + one-line description, grouped by:
- Morning Routine
- Evening Routine
- Week Planning
- Quarter Review
- Message Hub]
```

**Resume signal:** Continue when Jelle says "audit complete" and `bundle/audit-notes.md` exists with all 5 sections.

Verify: `grep -c "^## Section" bundle/audit-notes.md` returns `5`

---

### Task 2 — Automated: Refactor workflows + export JSON

After Jelle completes the audit, read `bundle/audit-notes.md` and:

**For each workflow with hardcoded values (from Section 2):**
1. Open in n8n
2. Add a Set node named **exactly** `CONFIG — Edit These Values` immediately after the trigger
3. Add all buyer-configurable fields to this Set node (all String type, placeholder values):
   ```
   telegramChatId        → "YOUR_TELEGRAM_CHAT_ID"
   telegramBotToken      → "YOUR_BOT_TOKEN"
   obsidianBaseUrl       → "http://localhost:27123"
   obsidianApiKey        → "YOUR_OBSIDIAN_API_KEY"
   vaultRootPath         → "/path/to/your/vault"
   postgresHost          → "localhost"
   postgresPort          → "5432"
   postgresDb            → "n8n_memory"
   postgresUser          → "postgres"
   postgresPassword      → "your-password"
   ollamaBaseUrl         → "http://localhost:11434"
   claudeApiKey          → "sk-ant-YOUR_KEY"
   ```
4. Update downstream nodes to reference via: `{{$node["CONFIG — Edit These Values"].json.telegramChatId}}`
5. Save the workflow

**Export:**
```bash
n8n export:workflow --all --output=bundle/workflows/am-workflows-v1.json
```
If CLI unavailable: n8n UI → Workflows list → select all → Actions → Download → save as `bundle/workflows/am-workflows-v1.json`

**Post-export scan:** grep for any actual API keys, real Telegram chat IDs (long numeric strings), or real passwords. Re-export if found.

**Verify:**
```bash
node -e "JSON.parse(require('fs').readFileSync('bundle/workflows/am-workflows-v1.json','utf8')); console.log('valid JSON')"
grep -c "CONFIG — Edit These Values" bundle/workflows/am-workflows-v1.json
# should return 10+ (one per workflow that has configurable values)
```

**Then write** `.planning/phases/02-am-bundle-packaging/02-01-SUMMARY.md`:
```markdown
# Plan 02-01 Summary

- Workflow count exported: [N]
- Community nodes found: [list or "none"]
- Ollama model(s): [names from audit]
- Postgres table(s): [names from audit]
- Config node naming: consistent / deviations: [list any]
- JSON file path: bundle/workflows/am-workflows-v1.json
- JSON file size: [output of ls -lh]
```

**Commit:** `git add bundle/workflows/am-workflows-v1.json bundle/audit-notes.md .planning/phases/02-am-bundle-packaging/02-01-SUMMARY.md`

---

## Plan 02-02 — README Setup Guide + Vault Starter + Bundle ZIP

**File:** `.planning/phases/02-am-bundle-packaging/02-02-PLAN.md`
**Autonomous:** Yes — fully automated
**Depends on:** `bundle/audit-notes.md` from Plan 02-01
**Produces:** `bundle/README.md`, `bundle/obsidian-vault-starter/`, `bundle/execution-engine-am-bundle.zip`

### Task 1 — Create Obsidian Vault Starter

Read `bundle/audit-notes.md` first to confirm folder names match what the live workflows use.

Create this directory tree under `bundle/obsidian-vault-starter/`:

```
bundle/obsidian-vault-starter/
├── Daily/
│   ├── _template-daily.md
│   └── example-2026-03-01.md
├── Weekly/
│   ├── _template-weekly.md
│   └── example-2026-W09.md
├── Quarterly/
│   ├── _template-quarterly.md
│   └── example-2026-Q1.md
├── Goals/
│   └── _template-goal.md
├── Archive/
│   └── .gitkeep
└── .obsidian/
    ├── community-plugins.json
    └── appearance.json
```

**`Daily/_template-daily.md`:**
```markdown
---
date: {{date:YYYY-MM-DD}}
type: daily
week: {{date:YYYY-[W]WW}}
quarter: {{date:YYYY-[Q]Q}}
mood:
energy:
focus_score:
---

## Morning Intent
_What matters most today?_

## Tasks
- [ ]

## Evening Review
_What got done? What blocked progress?_

## Tomorrow
-
```

**`Daily/example-2026-03-01.md`:** Same frontmatter filled in. Morning Intent: "Complete the project proposal first draft". Tasks: `- [x] Review Q1 goals`, `- [ ] Write project proposal`. Evening Review: "Finished proposal draft, blocked on budget numbers". Tomorrow: "Request budget numbers from finance team".

**`Weekly/_template-weekly.md`:** Frontmatter: `week`, `type: weekly`, `start_date`, `end_date`, `execution_score`. Sections: `## Week Intent`, `## Goals This Week`, `## Daily Wins`, `## Blockers`, `## Next Week`.

**`Weekly/example-2026-W09.md`:** Fictional. Execution score: 74. Goals: "Finish project proposal", "Review Q1 cycle". Wins: "Delivered proposal on Tuesday". Blockers: "Budget approval pending".

**`Quarterly/_template-quarterly.md`:** Frontmatter: `quarter` (e.g. `2026-Q1`), `type: quarterly`, `execution_score`. Sections: `## Quarter Theme`, `## 12-Week Goals`, `## Results`, `## Lessons`, `## Next Quarter`.

**`Quarterly/example-2026-Q1.md`:** Fictional. Theme: "Build the foundation". Goals: "Launch first digital product", "Establish daily review habit". Results: "Product launched week 10", "Daily review streak: 68 days".

**`Goals/_template-goal.md`:** Frontmatter: `goal`, `target_date`, `status: active | complete | dropped`, `12_week_cycle`. Sections: `## Why This Matters`, `## Success Looks Like`, `## Weekly Actions`, `## Progress Notes`.

**`Archive/.gitkeep`:** Empty file.

**`.obsidian/community-plugins.json`:**
```json
{
  "plugins": ["obsidian-local-rest-api"],
  "enabled": ["obsidian-local-rest-api"]
}
```

**`.obsidian/appearance.json`:**
```json
{
  "theme": "",
  "cssTheme": "",
  "baseFontSize": 16,
  "enabledCssSnippets": []
}
```

**Verify no personal data:**
```bash
grep -r "jellespek\|jelle\|Jelle\|lutjebroeker" bundle/obsidian-vault-starter/
# must return nothing
```

---

### Task 2 — Write README and Create Bundle ZIP

Read `bundle/audit-notes.md` (all 5 sections). Write `bundle/README.md` following this exact structure:

```markdown
# Execution Engine AM Bundle — Setup Guide
**"From download to first Telegram check-in in 30 minutes."**

## Prerequisites Checklist
- [ ] n8n **1.x or later** installed and running (check Settings → About — link: https://docs.n8n.io/hosting/installation/)
- [ ] Telegram account (any device)
- [ ] Obsidian installed (link: https://obsidian.md/download)
- [ ] Ollama installed with [MODEL FROM AUDIT SECTION 3] downloaded — `ollama pull [model]` (link: https://ollama.ai)
- [ ] PostgreSQL running (link: https://www.postgresql.org/download/)
[If community nodes found in audit Section 1: add install step here]

## Step 1: Set Up Telegram Bot
[numbered steps: BotFather → /newbot → name → username → copy token]
**Verification:** Send /start to your bot — it should reply with a greeting message.

## Step 2: Set Up Obsidian Vault
1. Extract `obsidian-vault-starter/` to a folder you will remember (e.g. `~/Documents/ExecutionEngine/`)
2. Open Obsidian → Open folder as vault → select that folder
3. Note the full path — you will need it in Step 7
**Verification:** Obsidian opens and you see Daily, Weekly, Quarterly, Goals, Archive folders in the left sidebar.

## Step 3: Set Up Obsidian Local REST API Plugin
1. Settings → Community plugins → Turn off Safe mode → Browse → Search "Local REST API" → Install → Enable
2. Settings → Local REST API → Generate API key → copy and store it
3. Note the port (default: 27123) and your API key — both needed in Step 7
**Verification:** Settings → Local REST API shows "Running on port 27123". Test: `curl http://localhost:27123/` returns a JSON response.

## Step 4: Set Up Ollama
1. Install Ollama from https://ollama.ai
2. Run: `ollama pull [MODEL FROM AUDIT SECTION 3]`
3. Ollama starts automatically. Default endpoint: http://localhost:11434
**Verification:** `curl http://localhost:11434/api/tags` returns JSON with your model listed.

## Step 5: Set Up PostgreSQL
1. Install PostgreSQL, create a database (e.g. `n8n_memory`)
2. Run these CREATE TABLE statements:
[INSERT EXACT SQL FROM audit-notes.md Section 4]
3. Note your connection details: host, port, database, username, password
**Verification:** Connect and run `\dt` — your table(s) appear in the list.

## Step 6: Import Workflows into n8n
1. Open your n8n instance
2. Workflows → Import from file → select `workflows/am-workflows-v1.json`
3. All workflows import in inactive state
4. For each Postgres workflow: open → Postgres node → Credentials → Create New → fill in Step 5 details
5. For each Telegram workflow: open → Telegram node → Credentials → Create New → paste bot token from Step 1
6. For each Claude API workflow: open → Anthropic node → Credentials → Create New → paste API key
**Verification:** All workflows appear in your workflow list. No node shows "Unknown node type".

## Step 7: Configure the Config Node
1. Open each workflow one by one
2. Click the "CONFIG — Edit These Values" node (first node after the trigger)
3. Fill in the values you collected in Steps 1–6:
   - `telegramChatId` — send a message to @userinfobot to get your chat ID
   - `telegramBotToken` — from Step 1
   - `obsidianBaseUrl` — http://localhost:27123 (or your actual port)
   - `obsidianApiKey` — from Step 3
   - `vaultRootPath` — full path to your vault from Step 2
   - `postgresHost/Port/Db/User/Password` — from Step 5
   - `ollamaBaseUrl` — http://localhost:11434
   - `claudeApiKey` — from https://console.anthropic.com
4. Activate the workflow using the toggle at the top right
5. Repeat for each workflow
**Verification:** Activate the Morning Routine workflow and click "Test workflow". It runs to completion without red error nodes.

## Workflow Reference

### Morning Routine
[LIST FROM audit-notes.md Section 5, morning group]

### Evening Routine
[LIST FROM audit-notes.md Section 5, evening group]

### Week Planning
[LIST FROM audit-notes.md Section 5, week planning group]

### Quarter Review
[LIST FROM audit-notes.md Section 5, quarter review group]

### Message Hub
[LIST FROM audit-notes.md Section 5, message hub group]

## Support
Email: support@jellespek.nl
Response time: within 24 hours
```

README must be 200+ lines. Every step must end with a **Verification:** subsection.

**Create the bundle ZIP:**
```bash
cd bundle && zip -r execution-engine-am-bundle.zip README.md workflows/ obsidian-vault-starter/
```

**Verify:**
```bash
wc -l bundle/README.md                          # 200+
grep -c "^## Step" bundle/README.md             # 7
grep -c "^### Morning Routine" bundle/README.md # 1
grep "support@jellespek.nl" bundle/README.md
ls -lh bundle/execution-engine-am-bundle.zip
unzip -l bundle/execution-engine-am-bundle.zip | grep -E "README|workflows|obsidian-vault-starter"
```

**Then write** `.planning/phases/02-am-bundle-packaging/02-02-SUMMARY.md`:
```markdown
# Plan 02-02 Summary

- README word count: [wc -w output]
- README line count: [wc -l output]
- Setup steps: 7
- Vault starter files: [ls -la output summary]
- Bundle ZIP path: bundle/execution-engine-am-bundle.zip
- Bundle ZIP size: [ls -lh output]
- Ollama model documented: [model name]
- Postgres table(s) documented: [table names]
- Deviations from plan: [list or "none"]
```

**Commit:** `git add bundle/README.md bundle/obsidian-vault-starter/ bundle/execution-engine-am-bundle.zip .planning/phases/02-am-bundle-packaging/02-02-SUMMARY.md`

---

## Plan 02-03 — Gumroad Welcome Email Workflow + Listing + Landing Page Link

**File:** `.planning/phases/02-am-bundle-packaging/02-03-PLAN.md`
**Autonomous:** Partially — auto tasks first, then human verification at end
**Depends on:** Plans 02-01 and 02-02 complete
**Produces:** `n8n-gumroad-welcome-workflow.json`, updated `index.html`

### Pre-task: Resend Setup (human, do before Task 1)

Tell Jelle to set up Resend before Task 1 runs:
1. Create account at https://resend.com
2. Add and verify `jellespek.nl` domain (add DNS records — can take up to 48 hours)
3. Create an API key → note it as `RESEND_API_KEY`

This must be done before the welcome email workflow can send. Task 1 can still be built without it, but the send step will fail until DNS is verified.

---

### Task 1 — Automated: Build Gumroad → n8n → Resend welcome email workflow

Build a **new** n8n workflow (do NOT modify existing AM workflows):

**Workflow name:** `Execution Engine — Gumroad Purchase Welcome Email`

**Node sequence:**

1. **Webhook node** — Name: "Gumroad Sale Ping", HTTP Method: POST, Path: `gumroad-sale`, Response Mode: `responseNode`
2. **Respond to Webhook node** — Name: "Respond 200 OK", Respond With: text, Response Body: "OK" — connect directly from Webhook (this MUST be immediate to prevent Gumroad retries sending duplicate emails)
3. **Set node** — Name: "Extract Buyer Data", fields (all String):
   - `buyerEmail` = `={{$json.body.email}}`
   - `productName` = `={{$json.body.product_name}}`
   - `orderNumber` = `={{$json.body.order_number}}`
   - `licenseKey` = `={{$json.body.license_key}}`
   Connect from Respond to Webhook (parallel branch — both run after webhook fires)
4. **HTTP Request node** — Name: "Send Welcome Email via Resend":
   - Method: POST
   - URL: `https://api.resend.com/emails`
   - Authentication: Generic Credential Type → HTTP Header Auth → name: `Authorization`, value: `Bearer YOUR_RESEND_API_KEY`
   - Body (JSON):
     ```json
     {
       "from": "Jelle Spek <support@jellespek.nl>",
       "to": ["={{$json.buyerEmail}}"],
       "subject": "Your Execution Engine AM Bundle — Start Here",
       "html": "[see email body below]"
     }
     ```

**Welcome email HTML body structure:**
- H1: "Welcome to Execution Engine"
- Intro: "You've got everything you need to go from zero to your first Telegram check-in in 30 minutes."
- H2: "Start Here — Your Checklist"
- Numbered list: 1) Open README.md in the bundle, 2) Install prerequisites (n8n, Telegram, Obsidian, Ollama, PostgreSQL), 3) Follow the 7-step setup guide, 4) Activate your workflows, 5) Send /start to your Telegram bot
- Download reminder: "Your bundle download link is in your Gumroad receipt email. If you can't find it, visit https://app.gumroad.com/library"
- Support: "Any questions? Email support@jellespek.nl — I reply within 24 hours."
- Sign-off: "— Jelle"

After building, export the workflow:
n8n UI → open workflow → ⋮ menu → Download → save as `n8n-gumroad-welcome-workflow.json` at project root

Note the webhook URL shown in the Webhook node settings — Jelle needs it for Gumroad.

**Verify:**
```bash
# Test the webhook with a mock POST (replace with actual webhook URL):
curl -X POST {webhook-url} \
  -H "Content-Type: application/json" \
  -d '{"body": {"email": "test@example.com", "product_name": "Test", "order_number": "999", "license_key": "TEST-0000"}}'
# Should return "OK" immediately
```

---

### Task 2 — Automated: Update landing page CTA

Read `index.html`. Find the pricing section (around lines 1407–1430). There are two CTA buttons:
- "Join waitlist" → `href="#waitlist"` — **leave unchanged**
- "Claim launch price" → currently `href="#waitlist"` — **update to Gumroad URL**

The Gumroad product URL will be something like `https://jellespek.gumroad.com/l/am-bundle`. **Ask Jelle for the exact URL** if Task 3's Gumroad listing hasn't been created yet — or use a placeholder and note it for Jelle to update after publishing.

**Verify:**
```bash
grep "gumroad" index.html    # should return the Gumroad URL in at least one href
grep 'href="#waitlist"' index.html  # should still return the "Join waitlist" button
```

---

### Task 3 — HUMAN VERIFICATION REQUIRED (Jelle)

Tell Jelle to:

**Step 1 — Create Gumroad product:**
1. Log into https://app.gumroad.com
2. Products → New Product → Digital Product
3. Title: `Execution Engine AM Bundle — The Complete n8n + Obsidian + Telegram Morning System`
4. Price: €2,497 (EUR; add €4,997 as "original price" / struck-through)
5. Description (use this copy):
   > **The complete system that turns your morning routine into a 30-minute execution engine.**
   >
   > Everything you need — pre-built n8n workflows, Obsidian vault starter, and a step-by-step setup guide — so you go from zero to your first AI-powered Telegram check-in in under 30 minutes.
   >
   > **What's in the box:**
   > - 15+ AM automation workflows (ready to import into n8n)
   > - Obsidian Vault Starter with folder structure, templates, and example notes
   > - Master Setup Guide (from prerequisites to first check-in, step by step)
   >
   > **Works with:** n8n (self-hosted), Obsidian, Telegram, Ollama (local LLM), PostgreSQL, Claude API
   >
   > **Prerequisites:** You need n8n, Obsidian, and Telegram. The setup guide covers everything else from scratch.
   >
   > **Day 1 Guarantee:** Follow the setup guide. If you don't complete your first Telegram check-in on Day 1, I'll refund you in full — no questions asked.
   >
   > **Support:** support@jellespek.nl — I reply within 24 hours.
   >
   > *First 20 buyers get a free 1:1 setup call (€249 value).*

6. Upload file: `bundle/execution-engine-am-bundle.zip`
7. **Add product media:** Take a screenshot or short screen recording of the Telegram bot completing a morning check-in. Upload as the product cover image or in the media/gallery section. *(Buyers at €2,497 need to see the bot working — this is required, not optional.)*
8. Publish the product
9. Copy the product permalink URL

**Step 2 — Connect webhook:**
1. Gumroad → Settings → Advanced → "Ping a URL on each sale"
2. Paste the n8n Webhook URL from Task 1
3. Save

**Step 3 — End-to-end verify:**
1. Use Gumroad's test/preview purchase flow
2. Check n8n execution history — workflow triggered
3. Confirm welcome email arrived at test address
4. Confirm email is from support@jellespek.nl (not onboarding@resend.dev)
5. Visit https://execution-engine-lake.vercel.app → click "Claim launch price" → opens Gumroad page

**Resume signal:** Tell OpenCode "live" when the Gumroad page is published, webhook connected, and the end-to-end test passes. Share the Gumroad URL.

---

After Jelle confirms, write `.planning/phases/02-am-bundle-packaging/02-03-SUMMARY.md`:
```markdown
# Plan 02-03 Summary

- Gumroad product URL: [URL]
- n8n webhook URL: [URL]
- Resend domain verification status: verified / pending
- Landing page change: "Claim launch price" href updated from "#waitlist" to [URL]
- End-to-end test result: welcome email confirmed / pending
```

**Commit:** `git add n8n-gumroad-welcome-workflow.json index.html .planning/phases/02-am-bundle-packaging/02-03-SUMMARY.md`

---

## Important Conventions

- **Commit after each plan** — not after every file
- **Use ESM modules** if you write any JS — `import` not `require`
- **No unnecessary comments** in code
- **English only** — all docs, copy, and code comments
- **Do not modify existing AM workflows directly** — the Config node refactor happens in n8n UI, then export
- **Do not add anything to the Gumroad listing beyond what's specified** — especially no price changes

---

## Verification Checklist for Claude Code

When OpenCode signals completion, run these checks:

### Plan 02-01
- [ ] `bundle/audit-notes.md` exists: `ls bundle/audit-notes.md`
- [ ] Audit has all 5 sections: `grep -c "^## Section" bundle/audit-notes.md` → `5`
- [ ] JSON exports as valid: `node -e "JSON.parse(require('fs').readFileSync('bundle/workflows/am-workflows-v1.json','utf8')); console.log('OK')"`
- [ ] Config node appears 10+ times: `grep -c "CONFIG — Edit These Values" bundle/workflows/am-workflows-v1.json`
- [ ] No real API keys leaked: `grep -i "sk-ant-[A-Za-z]" bundle/workflows/am-workflows-v1.json` → empty
- [ ] JSON file is substantial: `ls -lh bundle/workflows/am-workflows-v1.json` → 50KB+
- [ ] `02-01-SUMMARY.md` exists with workflow count, Ollama model(s), Postgres table(s)

### Plan 02-02
- [ ] README exists and is complete: `wc -l bundle/README.md` → 200+
- [ ] All 7 steps present: `grep -c "^## Step" bundle/README.md` → `7`
- [ ] Workflow reference present: `grep -c "^### Morning Routine" bundle/README.md` → `1`
- [ ] Support email present: `grep "support@jellespek.nl" bundle/README.md`
- [ ] n8n version in prerequisites: `grep "1.x" bundle/README.md`
- [ ] No personal data in vault: `grep -r "jellespek\|jelle\|Jelle\|lutjebroeker" bundle/obsidian-vault-starter/` → empty
- [ ] Vault structure correct: `ls bundle/obsidian-vault-starter/` → shows Daily/ Weekly/ Quarterly/ Goals/ Archive/ .obsidian/
- [ ] Local REST API configured: `cat bundle/obsidian-vault-starter/.obsidian/community-plugins.json` → contains `obsidian-local-rest-api`
- [ ] ZIP exists: `ls -lh bundle/execution-engine-am-bundle.zip`
- [ ] ZIP contains correct items: `unzip -l bundle/execution-engine-am-bundle.zip | grep -E "README|workflows|obsidian-vault-starter"`
- [ ] `02-02-SUMMARY.md` exists

### Plan 02-03
- [ ] Welcome email workflow JSON exists: `ls n8n-gumroad-welcome-workflow.json`
- [ ] Landing page has Gumroad URL: `grep "gumroad" index.html`
- [ ] Waitlist button unchanged: `grep 'href="#waitlist"' index.html` → still present
- [ ] Demo screenshot/GIF step completed (Jelle to confirm)
- [ ] Gumroad product is publicly reachable (Jelle to confirm URL)
- [ ] End-to-end test passed (Jelle to confirm welcome email received)
- [ ] `02-03-SUMMARY.md` exists with Gumroad URL

### Git
- [ ] 3 commits exist since Phase 2 started: `git log --oneline -5`
- [ ] No sensitive files committed: `git show --stat HEAD~2 HEAD` — no `.env`, no credential files

---

*Handover created: 2026-03-02*
*Plans verified by: Claude Code (plan-phase + plan-checker workflow)*
