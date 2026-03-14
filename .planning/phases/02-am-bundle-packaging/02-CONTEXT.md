# Phase 2: AM Bundle Packaging - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Productize the existing n8n AM workflow bundle into a self-contained, purchasable product. Deliverables: workflow JSON export, Obsidian Vault Starter ZIP, README setup guide, Gumroad listing, and post-purchase delivery automation. A buyer goes from zero to first Telegram check-in in 30 minutes.

Hosting/VPS provisioning is out of scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Setup guide structure
- Single master README — not separate per-tool files
- Reading order: prerequisites checklist first → numbered setup steps per tool → workflow reference at the end
- Format: numbered steps with exact copy-paste values, not prose with screenshots
- Workflow reference section grouped by routine: Morning Routine / Evening Routine / Week Planning / Quarter Review / Message Hub
- One verification step per tool section ("Send /start to your bot — it should reply 'Hello'")

### Buyer skill assumption
- Target: complete beginner — never opened Obsidian, never set up a Telegram bot, never touched PostgreSQL or Ollama
- Tool installation: link to official install guides, do not reproduce steps inline ("Install n8n: [link]. Come back when you see the login screen.")
- Language: English throughout all documentation

### Vault Starter content
- Contents: pre-created folder structure + blank templates with correct frontmatter/placeholders + one example note per type (daily, weekly, quarterly)
- Example notes use fictional but realistic placeholders — believable, not personal (e.g. "Finish project proposal", "Review Q1 goals")
- Top-level folder structure mirrors workflow routines: Daily / Weekly / Quarterly / Goals / Archive
- Include `.obsidian/` config folder: community plugins list (Local REST API pre-configured) + minimal appearance settings

### Gumroad listing
- Primary job: convert warm traffic arriving from the landing page — keep it tight, confirm and close
- Price display: €2,497 with €4,997 crossed out
- Language: English
- Must include: file list ("what's in the box"), prerequisites callout, Day 1 guarantee, demo screenshot or GIF of Telegram bot in action

### Bundle delivery experience
- After purchase: Gumroad fires webhook → n8n workflow → custom welcome email
- Email content: "start here" checklist + download link + link to README
- Email sender: support@jellespek.nl
- Email service: to be decided during planning (jellespek.nl domain available; Claude to evaluate Resend vs alternatives)
- Gumroad webhook → n8n is the trigger mechanism (uses existing n8n infrastructure)

### Buyer support model
- Channel: email only (appropriate for first 20 buyers)
- Address: support@jellespek.nl — to be created and configured in this phase (02-03)
- SLA: 24-hour response, stated explicitly in README and on Gumroad page
- Mention in: README support section + Gumroad listing

### Claude's Discretion
- Exact email service choice (Resend vs alternatives for jellespek.nl domain)
- Config node internal structure and field naming
- Exact copy for the welcome email body
- Obsidian template frontmatter field names (must match workflow expectations)

</decisions>

<specifics>
## Specific Ideas

- "30 minutes from download to first Telegram check-in" — this is the promise in the README, the Gumroad page, and the welcome email
- The Vault Starter's folder structure must match exactly what the n8n workflows read/write — zero translation for the buyer
- The welcome email is triggered by a new Gumroad webhook workflow — this is a new n8n workflow to build, not a modification of existing ones

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- n8n instance: already running with 15+ AM workflows — source material for the export
- Gumroad webhook support: Gumroad has native webhook for `sale` events — standard HTTP POST, n8n Webhook node handles it natively
- jellespek.nl domain: available for support@ and transactional email DNS setup

### Established Patterns
- Existing n8n workflow structure: Config node pattern already exists in the live system — BUNDLE-01 is extracting and standardising this
- Obsidian Local REST API: already in use in live system — vault structure and API calls are the source of truth for the Vault Starter folder design

### Integration Points
- New n8n workflow needed: Gumroad purchase webhook → send welcome email (new workflow, not modifying existing AM workflows)
- Landing page → Gumroad: SALE-02 requires a link update to index.html once the Gumroad page is live

</code_context>

<deferred>
## Deferred Ideas

- **Pre-configured VPS via Hostinger** — buyer gets a VPS with n8n, PostgreSQL, Ollama, and all workflows pre-installed and running. "CloudBot" model. Significant infrastructure work — add as new phase after Phase 4.
- **Multi-email onboarding sequence** (Day 0 / Day 1 / Day 3) — current phase uses a single welcome email; a drip sequence could be added later once first buyers give feedback

</deferred>

---

*Phase: 02-am-bundle-packaging*
*Context gathered: 2026-03-02*
