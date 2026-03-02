# Phase 2: AM Bundle Packaging - Research

**Researched:** 2026-03-02
**Domain:** n8n workflow export, Obsidian vault structure, Gumroad digital product, transactional email (Resend), bundle documentation
**Confidence:** MEDIUM-HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Setup guide structure**
- Single master README — not separate per-tool files
- Reading order: prerequisites checklist first → numbered setup steps per tool → workflow reference at the end
- Format: numbered steps with exact copy-paste values, not prose with screenshots
- Workflow reference section grouped by routine: Morning Routine / Evening Routine / Week Planning / Quarter Review / Message Hub
- One verification step per tool section ("Send /start to your bot — it should reply 'Hello'")

**Buyer skill assumption**
- Target: complete beginner — never opened Obsidian, never set up a Telegram bot, never touched PostgreSQL or Ollama
- Tool installation: link to official install guides, do not reproduce steps inline ("Install n8n: [link]. Come back when you see the login screen.")
- Language: English throughout all documentation

**Vault Starter content**
- Contents: pre-created folder structure + blank templates with correct frontmatter/placeholders + one example note per type (daily, weekly, quarterly)
- Example notes use fictional but realistic placeholders — believable, not personal (e.g. "Finish project proposal", "Review Q1 goals")
- Top-level folder structure mirrors workflow routines: Daily / Weekly / Quarterly / Goals / Archive
- Include `.obsidian/` config folder: community plugins list (Local REST API pre-configured) + minimal appearance settings
- `.obsidian/` must have Local REST API pre-configured

**Gumroad listing**
- Primary job: convert warm traffic arriving from the landing page — keep it tight, confirm and close
- Price display: €2,497 with €4,997 crossed out (NOTE: REQUIREMENTS.md says €2,497 launch / €4,997 full — this is the canonical price; CONTEXT.md mentions €149 in one place but REQUIREMENTS.md takes precedence — flag for planner)
- Language: English
- Must include: file list ("what's in the box"), prerequisites callout, Day 1 guarantee, demo screenshot or GIF of Telegram bot in action

**Bundle delivery experience**
- After purchase: Gumroad fires webhook → n8n workflow → custom welcome email
- Email content: "start here" checklist + download link + link to README
- Email sender: support@jellespek.nl
- Email service: to be decided during planning (jellespek.nl domain available; Claude to evaluate Resend vs alternatives)
- Gumroad webhook → n8n is the trigger mechanism (uses existing n8n infrastructure)

**Buyer support model**
- Channel: email only (appropriate for first 20 buyers)
- Address: support@jellespek.nl — to be created and configured in this phase
- SLA: 24-hour response, stated explicitly in README and on Gumroad page
- Mention in: README support section + Gumroad listing

### Claude's Discretion
- Exact email service choice (Resend vs alternatives for jellespek.nl domain)
- Config node internal structure and field naming
- Exact copy for the welcome email body
- Obsidian template frontmatter field names (must match workflow expectations)

### Deferred Ideas (OUT OF SCOPE)
- Pre-configured VPS via Hostinger — "CloudBot" model. Significant infrastructure work — add as new phase after Phase 4.
- Multi-email onboarding sequence (Day 0 / Day 1 / Day 3) — current phase uses a single welcome email; a drip sequence could be added later once first buyers give feedback
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONFIG-01 | All hardcoded values extracted into a single Config node — Telegram chat ID, Obsidian URL, vault root path, Postgres connection string, Ollama base URL, Claude API key | n8n Set node used as Config node; all values centralised in one Set node, placed first in each workflow |
| CONFIG-02 | Config node is the first node in every affected workflow — one place to set, everything works | Covered by n8n workflow structure; Set node as trigger output feeds all downstream nodes |
| DOCS-01 | Obsidian vault folder structure documented — exact folder names, templates, naming conventions | Vault Starter ZIP defines the structure; README section documents it |
| DOCS-02 | Setup guide for Telegram bot creation (BotFather, set commands, webhook URL) | README numbered steps section; BotFather flow is well-documented pattern |
| DOCS-03 | Setup guide for Obsidian Local REST API plugin installation + configuration | README section; Local REST API GitHub is authoritative source |
| DOCS-04 | Setup guide for Ollama — model download (which models), API endpoint setup | README section; Ollama docs for model pull commands |
| DOCS-05 | Setup guide for PostgreSQL — database creation, table schema for AI Agent memory | README section; n8n Postgres node credential pattern |
| DOCS-06 | Workflows listed by name with one-line description | README workflow reference section, grouped by routine |
| BUNDLE-01 | All 15+ AM workflows exported as single importable JSON file | n8n export-all → single JSON; Config node approach solves credential stripping on import |
| BUNDLE-02 | Obsidian Vault Starter ZIP — pre-built folder structure + templates matching workflow expectations | ZIP file with Daily/Weekly/Quarterly/Goals/Archive folders + .obsidian/ config |
| BUNDLE-03 | README.md in bundle — quick start, prerequisites checklist, "30 min" promise | Single master README in Markdown |
| SALE-01 | Gumroad product page live with title, description, value stack, price (€2,497 launch / €4,997 full), bundle ZIP | Gumroad supports ZIP files, EUR pricing, and configurable product pages |
| SALE-02 | Gumroad page linked from landing page (waitlist → Gumroad when ready) | Single href update in index.html |
</phase_requirements>

---

## Summary

Phase 2 is a productisation phase, not a software development phase. The primary work is: (1) refactoring the existing 15+ n8n workflows to use a centralised Config node so a buyer only edits one place, (2) creating documentation and a vault starter ZIP that lets a complete beginner reach a working setup in 30 minutes, (3) building a new n8n workflow that fires on Gumroad purchase and sends a welcome email via Resend, and (4) creating the Gumroad listing and linking it from the landing page.

The technical complexity is low-to-medium. The highest-risk areas are the Config node refactor (touching 15+ live workflows) and the Gumroad webhook → email delivery chain. The documentation work is significant in volume but low in technical risk.

**Price note:** CONTEXT.md mentions €149 in one section but REQUIREMENTS.md and BRAND.md both specify €2,497 launch / €4,997 full. Planner should confirm with user before setting the Gumroad price.

**Primary recommendation:** Use Resend (free tier) for transactional email via HTTP Request node in n8n. Use a Set node as the Config node pattern. Export all workflows as a single JSON via n8n CLI or UI bulk export.

---

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| n8n (existing) | Self-hosted | Workflow runtime + webhook receiver | Already running; 15+ workflows live |
| n8n Set node | Built-in | Config node pattern — centralises all buyer-configurable values | Native node, no install; outputs key-value pairs consumed by downstream nodes |
| n8n Webhook node | Built-in | Receives Gumroad sale ping | Native; handles POST from Gumroad natively |
| Resend | API (free tier) | Transactional email for welcome email | 3,000 emails/month free; simple REST API; custom domain DNS verification; developer-friendly |
| Gumroad | Platform | Digital product storefront + payment processing | Zero monthly fee; 10% flat per sale; ZIP file support; EUR pricing; built-in webhook ping |
| Obsidian | Existing | Vault Starter ZIP target | Already used; Local REST API already in live system |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| n8n HTTP Request node | Built-in | Call Resend API to send email | Used inside the Gumroad → email workflow |
| Resend community node (n8n-nodes-resend) | npm | Dedicated Resend node for n8n | Alternative to raw HTTP Request — cleaner UX, official |
| Obsidian Local REST API plugin | Existing | Defines vault path structure that ZIP must match | Source of truth for folder naming; already configured in live system |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Mailersend, Postmark, SMTP via Gmail | Resend has the simplest free tier setup and best n8n integration. Mailersend also free (3k/month). Gmail SMTP works but risks deliverability for support@ domain. Resend recommended. |
| Gumroad | Lemon Squeezy, Paddle | Gumroad is zero-setup, no monthly fee, handles EU VAT since 2025. Lemon Squeezy has better EU VAT handling historically but Gumroad covers this now. Gumroad wins for speed. |
| n8n Set node as Config | n8n-nodes-globals community node | Globals node requires community node install on buyer's n8n — adds friction. Set node is built-in, zero install. Use Set node. |

---

## Architecture Patterns

### Recommended Bundle File Structure
```
execution-engine-am-bundle/
├── README.md                    # Master setup guide (BUNDLE-03 + DOCS-*)
├── workflows/
│   └── am-workflows-v1.json     # All 15+ workflows in single export (BUNDLE-01)
├── obsidian-vault-starter/
│   ├── Daily/
│   │   ├── _template-daily.md
│   │   └── example-2026-03-01.md   # Fictional example
│   ├── Weekly/
│   │   ├── _template-weekly.md
│   │   └── example-2026-W09.md
│   ├── Quarterly/
│   │   ├── _template-quarterly.md
│   │   └── example-2026-Q1.md
│   ├── Goals/
│   │   └── _template-goal.md
│   ├── Archive/
│   └── .obsidian/
│       ├── community-plugins.json   # Local REST API pre-configured
│       └── appearance.json          # Minimal light theme settings
└── [bundle root is zipped as execution-engine-am-bundle.zip]
```

### Pattern 1: Config Node (Set Node First in Workflow)

**What:** A Set node named "CONFIG — Edit These Values" is placed as the first node after the trigger in every workflow. It contains all values a buyer must customise. Downstream nodes reference these values via expressions like `{{$node["CONFIG — Edit These Values"].json.telegramChatId}}`.

**When to use:** Every workflow that contains any of: Telegram chat ID, Obsidian URL, vault root path, PostgreSQL connection details, Ollama base URL, Claude API key.

**Config node field naming convention:**
```json
{
  "telegramChatId": "YOUR_TELEGRAM_CHAT_ID",
  "telegramBotToken": "YOUR_BOT_TOKEN",
  "obsidianBaseUrl": "http://localhost:27123",
  "obsidianApiKey": "YOUR_OBSIDIAN_API_KEY",
  "vaultRootPath": "/path/to/your/vault",
  "postgresConnectionString": "postgresql://user:pass@localhost:5432/dbname",
  "ollamaBaseUrl": "http://localhost:11434",
  "claudeApiKey": "sk-ant-YOUR_KEY"
}
```

**How downstream nodes reference it:**
```
// Source: n8n expression syntax — expressions reference previous node output
{{$node["CONFIG — Edit These Values"].json.telegramChatId}}
```

**Important:** The Set node must be connected to every branch that uses these values. If a workflow has multiple triggers (Schedule + Manual), each trigger branch needs its own Set node or both must feed into a shared Set node before branching.

### Pattern 2: Gumroad → n8n → Resend Email Workflow

**What:** New standalone workflow (not modifying existing AM workflows). Gumroad fires a sale ping to an n8n Webhook node URL. n8n extracts buyer email from payload, constructs welcome email, sends via Resend HTTP Request.

**Flow:**
```
Webhook node (POST, path: gumroad-sale)
  → Set node (extract: email, product_name, order_number from $json.body)
  → HTTP Request node (POST https://api.resend.com/emails)
  → (optional) Respond to Webhook node (200 OK)
```

**Gumroad webhook payload fields (verified):**
```json
{
  "seller_id": "...",
  "product_id": "...",
  "product_name": "Execution Engine AM Bundle",
  "permalink": "...",
  "product_permalink": "https://gum.co/...",
  "email": "buyer@example.com",
  "price": "249700",
  "currency": "usd",
  "quantity": "1",
  "order_number": "123456789",
  "sale_id": "...",
  "sale_timestamp": "2026-03-02T10:00:00Z",
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "ip_country": "Netherlands",
  "refunded": "false",
  "resource_name": "sale",
  "disputed": "false",
  "dispute_won": "false"
}
```

**Note:** Price is in cents as a string. `"249700"` = €2,497.00. `email` is the buyer's email.

**Gumroad Webhook setup:** Settings → Advanced → "Ping a URL on each sale" → paste n8n Webhook URL.

**Gumroad retries:** Will retry up to 3 times over ~15-20 minutes if no 2xx response. Always respond with 200 OK immediately.

### Pattern 3: n8n Bulk Workflow Export

**What:** Export all 15+ workflows as a single JSON file that a buyer can import into a clean n8n instance.

**Export method:**
- UI: In n8n editor, Workflows list → select all → Download (exports as JSON array)
- CLI: `n8n export:workflow --all --output=am-workflows-v1.json`

**What exports include:** Workflow structure, node types, connections, settings. Does NOT include credential secrets — buyer must recreate credentials.

**What buyer does on import:**
1. Import the JSON file into their n8n instance
2. n8n creates all workflows in inactive state
3. Buyer opens each workflow, attaches credentials to nodes that need them
4. Buyer updates the CONFIG node values
5. Buyer activates each workflow

**Critical:** Node types must exist in buyer's n8n. Standard nodes (Webhook, Set, HTTP Request, Postgres, Schedule) are built-in. The Telegram node is built-in. If any community nodes are used in existing workflows, buyer must install them first.

### Pattern 4: Resend HTTP Request from n8n

**What:** Call Resend REST API directly from n8n HTTP Request node (no community node needed).

```
POST https://api.resend.com/emails
Authorization: Bearer {RESEND_API_KEY}
Content-Type: application/json

{
  "from": "support@jellespek.nl",
  "to": ["{{$json.buyerEmail}}"],
  "subject": "Your Execution Engine AM Bundle is ready",
  "html": "<h1>Welcome...</h1><p>...</p>"
}
```

**Alternative:** Install official `n8n-nodes-resend` community node from npm. Provides cleaner UI but requires community node install.

**Recommendation:** Use HTTP Request node (built-in, zero friction) for the bundle's Gumroad workflow so the buyer doesn't need to install anything extra.

### README Structure (locked by CONTEXT.md)

```markdown
# Execution Engine AM Bundle — Setup Guide

## Prerequisites Checklist
- [ ] n8n installed and running
- [ ] Telegram account
- [ ] Obsidian installed
- [ ] Ollama installed with [model] downloaded
- [ ] PostgreSQL running

## Step 1: Set Up Telegram Bot
[numbered steps]
Verification: Send /start to your bot — it should reply "Hello"

## Step 2: Set Up Obsidian
[numbered steps]
Verification: [specific check]

## Step 3: Set Up Obsidian Local REST API Plugin
[numbered steps]
Verification: [specific check]

## Step 4: Set Up Ollama
[numbered steps]
Verification: [specific check]

## Step 5: Set Up PostgreSQL
[numbered steps]
Verification: [specific check]

## Step 6: Import Workflows into n8n
[numbered steps]
Verification: [specific check]

## Step 7: Configure the Config Node
[numbered steps — edit CONFIG node in each workflow]
Verification: [specific check]

## Workflow Reference
### Morning Routine
- [workflow name]: [one-line description]
### Evening Routine
...
### Week Planning
...
### Quarter Review
...
### Message Hub
...

## Support
Email: support@jellespek.nl
Response time: within 24 hours
```

### Anti-Patterns to Avoid

- **Hardcoding any credential in workflow nodes:** All values the buyer must change must live in the Config Set node. Never leave a live personal value (Telegram ID, Obsidian URL, etc.) in any exported node.
- **Splitting config across multiple nodes:** Buyer should edit exactly one node per workflow to go live. Multiple config nodes = support calls.
- **Exporting credentials with workflows:** n8n does not export credential secrets by default. Do not use workarounds to include them.
- **Including personal example notes in Vault Starter:** Example notes must use fictional data. Personal notes from live vault must not be included.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Transactional email delivery | Custom SMTP server / forwarder | Resend API | DNS setup, deliverability, SPF/DKIM — Resend handles all of this; free tier covers initial buyers |
| Payment processing | Stripe integration from scratch | Gumroad | Gumroad is merchant of record (EU VAT handled since 2025), zero monthly fee, instant setup |
| Centralised config across workflows | n8n environment variables or custom globals node | n8n Set node (Config pattern) | Built-in, zero install; buyer just opens one node and fills values |
| Vault folder creation script | Node.js script to create Obsidian folders | Pre-built ZIP with folders already created | Buyer unzips = done; no CLI required |
| Welcome email HTML template engine | Mustache / Handlebars | Inline HTML string in n8n Set node | Single welcome email; no template engine warranted at this scale |

**Key insight:** This phase is about removing friction from the buyer's setup experience. Every tool the buyer would need to install or configure is a drop-off point. Pre-built assets (ZIP, JSON) and hosted services (Resend, Gumroad) eliminate buyer-side complexity.

---

## Common Pitfalls

### Pitfall 1: Live Credential Values Left in Exported Workflows
**What goes wrong:** Buyer imports workflow JSON and sees Jelle's personal Telegram chat ID, Postgres connection string, or Ollama URL hardcoded in nodes. They either break their system by accident or receive a support request.
**Why it happens:** Values were set directly in HTTP Request / Postgres nodes during development, not centralised in a Config node.
**How to avoid:** Before export, audit every node in every workflow and move all personal/instance-specific values to the Config Set node. Replace hardcoded values with expressions referencing the Config node.
**Warning signs:** Any node with a literal numeric Telegram chat ID, a localhost URL without a placeholder comment, or a connection string.

### Pitfall 2: n8n Version Mismatch on Import
**What goes wrong:** Buyer imports the workflow JSON into an older n8n version. Nodes fail to render or execute because node parameter schemas changed.
**Why it happens:** n8n updates frequently. Export format includes version metadata.
**How to avoid:** Document the minimum n8n version required in the README. Recommend buyer install latest n8n. Test import on a fresh n8n instance before publishing.
**Warning signs:** Import succeeds but nodes show "invalid configuration" warnings.

### Pitfall 3: Gumroad Webhook Not Receiving Responses Fast Enough
**What goes wrong:** n8n workflow takes >5 seconds (e.g., email API call is slow). Gumroad retries the ping, triggering duplicate welcome emails.
**Why it happens:** Gumroad times out if no 2xx response arrives promptly. If email sending is in the same synchronous chain, slowness causes retries.
**How to avoid:** Add a "Respond to Webhook" node immediately after the webhook (before the email send), returning 200 OK. Then continue email sending asynchronously.
**Warning signs:** Buyers receiving 2-3 identical welcome emails.

### Pitfall 4: Obsidian Vault Path Mismatch
**What goes wrong:** Workflows expect vault at `/Users/buyer/Documents/Vault` but buyer extracted the Vault Starter somewhere else. n8n Obsidian API calls return 404.
**Why it happens:** The vault root path in the Config node must exactly match where the buyer placed the vault.
**How to avoid:** README must have a clear step: "Note the full path where you extracted the vault. You'll enter this in Step 7." Config node field `vaultRootPath` must have a prominent placeholder and comment.
**Warning signs:** Obsidian API calls fail with "file not found" errors immediately after setup.

### Pitfall 5: Resend Domain Verification Delay
**What goes wrong:** Resend domain (jellespek.nl) DNS records propagate slowly. Welcome emails go out from `onboarding@resend.dev` or fail entirely during testing.
**Why it happens:** DNS propagation takes up to 48 hours. Resend restricts sending to own email address only until domain is verified.
**How to avoid:** Set up Resend account and verify jellespek.nl domain DNS records FIRST, before building the workflow. Plan 1-2 days buffer. During testing, send test welcome emails to your own address.
**Warning signs:** Resend API returns domain not verified error.

### Pitfall 6: Gumroad Processes in USD Only
**What goes wrong:** Listing shows €2,497 but Gumroad converts everything to USD internally. Price in webhook payload is in cents as USD.
**Why it happens:** Gumroad is USD-native; it converts to local currency at checkout display but settles in USD.
**How to avoid:** Set the Gumroad price in USD equivalent of €2,497 (approximately $2,700–2,750 at current rates). Or verify if Gumroad now supports EUR-native pricing. Document this clearly.
**Warning signs:** Webhook price field shows unexpected value.

### Pitfall 7: Community Nodes in Live Workflows Not Available to Buyer
**What goes wrong:** One of the 15+ live workflows uses a community node (e.g., n8n-nodes-globals). Buyer imports JSON but the node type is unknown in their n8n instance. Workflow imports but the node shows as "unknown type".
**Why it happens:** Community nodes must be installed separately per n8n instance.
**How to avoid:** Audit all 15+ workflows for community node usage BEFORE exporting. If any are used, either: (a) refactor to use built-in nodes, or (b) add to prerequisites in README with install instructions.
**Warning signs:** After import, any node shows "Unknown node type" in buyer's n8n.

---

## Code Examples

### Config Set Node — Fields and Expressions

```javascript
// In the Set node named "CONFIG — Edit These Values"
// Mode: "Set values manually"
// All values are String type

{
  "telegramChatId": "123456789",           // Edit: your Telegram chat ID
  "telegramBotToken": "bot<TOKEN>",        // Edit: from BotFather
  "obsidianBaseUrl": "http://localhost:27123", // Edit: your Obsidian REST API URL
  "obsidianApiKey": "your-api-key-here",   // Edit: from Obsidian Local REST API settings
  "vaultRootPath": "/path/to/your/vault",  // Edit: full path to vault folder
  "postgresHost": "localhost",
  "postgresPort": "5432",
  "postgresDb": "n8n_memory",
  "postgresUser": "postgres",
  "postgresPassword": "your-password",
  "ollamaBaseUrl": "http://localhost:11434",
  "claudeApiKey": "sk-ant-..."             // Edit: Anthropic API key
}
```

```javascript
// Downstream node referencing Config values (n8n expression syntax)
// Source: n8n expression syntax skill
{{$node["CONFIG — Edit These Values"].json.telegramChatId}}
{{$node["CONFIG — Edit These Values"].json.obsidianBaseUrl}}
```

### Gumroad Webhook → Email Workflow (n8n node sequence)

```javascript
// Node 1: Webhook (trigger)
{
  "httpMethod": "POST",
  "path": "gumroad-sale",
  "responseMode": "responseNode"  // Respond immediately, not after all nodes
}

// Node 2: Respond to Webhook (return 200 IMMEDIATELY — prevents Gumroad retries)
{
  "respondWith": "text",
  "responseBody": "OK"
}

// Node 3: Set (extract buyer data from Gumroad payload)
// Gumroad data arrives in $json.body
{
  "buyerEmail": "={{$json.body.email}}",
  "productName": "={{$json.body.product_name}}",
  "orderNumber": "={{$json.body.order_number}}",
  "licenseKey": "={{$json.body.license_key}}"
}

// Node 4: HTTP Request (send via Resend API)
{
  "method": "POST",
  "url": "https://api.resend.com/emails",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  // Header: Authorization: Bearer {RESEND_API_KEY}
  "sendBody": true,
  "contentType": "json",
  "body": {
    "from": "Jelle Spek <support@jellespek.nl>",
    "to": ["={{$json.buyerEmail}}"],
    "subject": "Your Execution Engine AM Bundle — Start Here",
    "html": "<h1>Welcome!</h1>..."
  }
}
```

### Obsidian Vault Starter — Daily Note Template Frontmatter

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

### Obsidian .obsidian/community-plugins.json (Vault Starter)

```json
{
  "plugins": ["obsidian-local-rest-api"],
  "enabled": ["obsidian-local-rest-api"]
}
```

Note: The full `.obsidian/` config structure requires `plugins/` subfolder with plugin data and `core-plugins.json`. The Vault Starter must include enough `.obsidian/` config that opening the vault in Obsidian shows the Local REST API plugin in the plugin list (even if buyer still needs to enable it and set their API key — that is a required setup step).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Gumroad custom domain fee | 10% flat fee, no monthly fee | ~2023 | Zero barrier to entry; just list and sell |
| Gumroad EU VAT handling (seller responsibility) | Gumroad as merchant of record for EU VAT | Jan 2025 | Seller doesn't need to handle EU VAT — Gumroad does |
| Resend signup + domain verification separate | DNS auto-verification via Cloudflare one-click | 2024 | If DNS is on Cloudflare, domain verification is near-instant |
| n8n workflow export (one at a time) | Bulk export all workflows via CLI or UI select-all | n8n 1.x | Single JSON file for entire bundle |

**Current state:**
- Gumroad is merchant of record for EU VAT since Jan 2025. No separate VAT registration needed.
- Gumroad fee: 10% flat per sale (no monthly fee). On €2,497 sale = ~€250 Gumroad fee.
- Resend free tier: 3,000 emails/month, 100/day, 1 custom domain. Sufficient for first 20 buyers.

---

## Email Service Decision (Claude's Discretion)

**Recommendation: Use Resend.**

| Criterion | Resend | Mailersend | Gmail SMTP | Postmark |
|-----------|--------|------------|------------|----------|
| Free tier | 3,000/month | 3,000/month | ~500/day | 100/month (trial) |
| Custom domain | Yes (1 on free) | Yes | No (shows Gmail) | Yes |
| n8n integration | HTTP Request (built-in) OR community node | HTTP Request | Send Email node | HTTP Request |
| Setup complexity | Low — REST API + DNS | Low | Medium — App passwords | Low |
| Deliverability | High — modern API | High | Medium | High |
| Cost at scale | $20/month for 50k | Free up to 3k then paid | Free but limited | $15/month |

Resend is the clearest choice. Simple REST API, jellespek.nl domain verification, 3,000 free emails covers the entire first phase of buyers. Use HTTP Request node (built-in) rather than the community node — keeps the delivery workflow self-contained with zero extra installs.

---

## Open Questions

1. **Price discrepancy: €149 vs €2,497**
   - What we know: CONTEXT.md mentions "€149 price" in the Gumroad listing section; REQUIREMENTS.md and BRAND.md specify €2,497 launch / €4,997 full price
   - What's unclear: Whether the CONTEXT.md €149 is an error or a deliberate lower AM Bundle price separate from the main Execution Engine product
   - Recommendation: Planner should flag this to user before setting the Gumroad price. REQUIREMENTS.md takes precedence unless user confirms otherwise.

2. **Community nodes in existing 15+ workflows**
   - What we know: The live n8n system has 15+ workflows; the Config node pattern "already exists" per CONTEXT.md
   - What's unclear: Whether any of those workflows use community nodes that won't be available in a buyer's clean install
   - Recommendation: First task of implementation must be an audit of all live workflows for community node types.

3. **Which Ollama models are required**
   - What we know: Ollama is used for local LLM; specific models not documented in available context
   - What's unclear: Which models (llama3, mistral, etc.) are called by the workflows — affects DOCS-04
   - Recommendation: Audit Ollama API call nodes in workflows to extract model names before writing DOCS-04.

4. **PostgreSQL schema for AI Agent memory**
   - What we know: n8n AI Agent memory uses PostgreSQL; table schema exists in live system
   - What's unclear: Exact table name(s) and schema needed for DOCS-05 (buyer must create these tables)
   - Recommendation: Export CREATE TABLE statements from live PostgreSQL before writing DOCS-05.

5. **Obsidian vault path format in n8n API calls**
   - What we know: Obsidian Local REST API calls reference file paths within the vault
   - What's unclear: Whether paths are vault-relative or absolute; affects how Config node vaultRootPath is used
   - Recommendation: Review existing Obsidian HTTP Request nodes in live workflows to confirm path format.

---

## Sources

### Primary (HIGH confidence)
- [n8n Export/Import Docs](https://docs.n8n.io/workflows/export-import/) — bulk export, credential handling on import
- [Resend Pricing](https://resend.com/pricing) — free tier limits, domain support, verified via WebFetch
- [Resend n8n integration guide](https://resend.com/docs/knowledge-base/n8n-integration) — verified setup steps

### Secondary (MEDIUM confidence)
- [Gumroad webhook payload fields](https://rollout.com/integration-guides/gumroad/quick-guide-to-implementing-webhooks-in-gumroad) — field list cross-referenced with multiple sources; confirmed seller_id, product_id, email, price, order_number, sale_id, resource_name, license_key fields
- [n8n community: global variables discussion](https://community.n8n.io/t/set-global-variables-for-workflow-self-hosted/82650) — Set node pattern confirmed as standard approach
- [GitHub: n8n-nodes-resend](https://github.com/jonathanferreyra/n8n-nodes-resend) — community Resend node exists as alternative
- Gumroad 10% fee and EU VAT merchant of record (Jan 2025) — confirmed via multiple sources

### Tertiary (LOW confidence)
- Gumroad EUR currency handling — Gumroad processes in USD internally; EUR display at checkout is conversion. Needs verification at listing creation time.
- `.obsidian/` community-plugins.json exact schema — documented from knowledge of Obsidian plugin system; should be verified against actual vault config.

---

## Metadata

**Confidence breakdown:**
- Config node pattern: HIGH — n8n Set node is built-in, well-documented; pattern is established
- Gumroad webhook payload: MEDIUM — fields confirmed via multiple third-party sources; official docs not directly accessed
- Resend setup: HIGH — official pricing page and integration guide accessed
- Vault structure: MEDIUM — based on Obsidian conventions and CONTEXT.md; actual live vault paths not verified
- Pitfalls: MEDIUM — based on n8n community discussions and integration complexity analysis

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable ecosystem; Gumroad/Resend pricing may change)
