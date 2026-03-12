# AM Bundle Audit Notes

Audit completed 2026-03-07 by Claude Code via n8n MCP (read live workflows directly).

---

## Section 1 - Community nodes

**No community nodes found.**

All node types in the AM workflows are either standard n8n built-ins or official n8n LangChain nodes that ship with n8n:

- `@n8n/n8n-nodes-langchain.chainLlm` — official n8n LangChain package (ships with n8n)
- `@n8n/n8n-nodes-langchain.lmChatOllama` — official n8n LangChain package
- `@n8n/n8n-nodes-langchain.lmOllama` — official n8n LangChain package
- `n8n-nodes-base.dataTable` — n8n built-in Data Table (internal state storage)
- `n8n-nodes-base.aggregate` — n8n built-in

No npm community node install required for buyers.

---

## Section 2 - Hardcoded values to centralise

### Telegram Chat ID
Hardcoded as `chatId` in Telegram nodes across:
- AM - Evening - Start routine → Send a text message, Send a text message1, Send a text message2
- AM - Morning - Reflection → Send a text message, Send reflection question
- AM - Evening - Reflection → Send a text message, Send reflection question
- AM - Morning - Goal Selection → multiple Telegram nodes
- AM - Telegram - Message trigger - Goal Select → Notify Menu Error

**Value:** `6897758158`

### Telegram Bot Token (hardcoded in URL — security issue)
Some workflows call the Telegram API directly via HTTP Request nodes with the bot token in the URL:
- AM - Quarter - Review → HTTP Request node URL
- AM - Morning - Goal Selection → HTTP Request node URL

**Value:** `YOUR_BOT_TOKEN` (masked: `8227272160:AAH...`)

These should be moved to the n8n Telegram credential or Config node.

### Node-RED URL (Obsidian file bridge)

⚠️ **CRITICAL ARCHITECTURE NOTE**: The system does NOT use the Obsidian Local REST API plugin. Instead, all vault file operations go through a **Node-RED** instance running on the local network at `http://192.168.1.158:1880` with two custom endpoints:
- `POST /find_file` — reads a file from the vault
- `POST /create_file` — creates/writes a file to the vault

This Node-RED instance runs on the machine that has the Obsidian vault on its filesystem (the `obsidian` host at `192.168.1.158`).

Hardcoded in HTTP Request nodes across:
- AM - Morning - Start routine → Get Daily Note, Get Current Cycle Metadata
- AM - Evening - Start routine → Get Daily Note
- AM - Morning - Reflection → Get Daily Note
- AM - Evening - Reflection → Get Daily Note
- AM - Create daily note if not exists → Check Daily Note File1, Get Daily Note Template, Create Daily Note
- AM - Quarter - Review → Check Daily Note File, Create Daily Note3, HTTP Request
- AM - Quarter - Create Cycle → Get Metadata, Get Telos, Get Vision, Get Last Reflection, Save Cycle File, Update Metadata
- AM - Week - Review v2 (Claude) → Read Metadata, Read All Files, Save Files, Archive Daily Notes
- AM - Week - Planning v2 (Claude) → Read Metadata, Fetch All Files, Save Updated Metadata

**Value:** `http://192.168.1.158:1880`

### Vault path
Hardcoded in Set node and HTTP Request body parameters:

- AM - Morning - Start routine → Set Vault Path node: `/home/obsidian/Documents/PersonalAssistant/`
- AM - Morning - Goal Selection → Set Vault Path node: (same)
- AM - Telegram - Message trigger - Goals Confirm → Set Vault Path node: (same)
- Multiple HTTP Request body `path` fields: `/home/obsidian/Documents/PersonalAssistant/01. Daily Notes/`, `/home/obsidian/Documents/PersonalAssistant/02. 12 Week Year/`, `/home/obsidian/Documents/PersonalAssistant/90. Templates/`

**Value:** `/home/obsidian/Documents/PersonalAssistant/`

### Folder structure observed in vault paths:
- `01. Daily Notes/` — daily notes
- `02. 12 Week Year/` — cycle metadata, weekly plans
- `90. Templates/` — Daily Note Template.md

---

## Section 3 - Ollama models in use

Two Ollama models confirmed:

1. **`llama3.1:8b`** — used in:
   - AM - Evening - Start routine (`@n8n/n8n-nodes-langchain.lmChatOllama` node "Ollama Chat Model")
   - Likely also AM - Quarter - Review (lmOllama node — model name from lmOllama in Quarter Review: `kimi-k2.5`)

2. **`kimi-k2.5`** — used in:
   - AM - Quarter - Review (`@n8n/n8n-nodes-langchain.lmOllama` node)

3. **AM - Quarter - Create Cycle** uses `@n8n/n8n-nodes-langchain.lmOllama` ("Ollama Cycle Model") — model name not confirmed in structure-mode fetch; likely `kimi-k2.5` or `llama3.1:8b`.

**Buyer install commands:**
```bash
ollama pull llama3.1:8b
ollama pull kimi-k2.5
```

Ollama is accessed via n8n's LangChain Ollama credential (not hardcoded HTTP Request). The credential stores the Ollama base URL. Default: `http://localhost:11434`.

---

## Section 4 - Postgres table schema

**No PostgreSQL nodes found in any AM workflow.**

The plan documentation assumed Postgres for AI agent memory, but the actual implementation uses **n8n's built-in Data Table** (`n8n-nodes-base.dataTable`) for all state management. No external database is required.

The n8n Data Table named **"Message"** (ID: `xzl5pFAa6e8j4UbH`) is used across multiple workflows for:
- Routing: storing message IDs + resumeUrl + sender to resume waiting workflows when Telegram callbacks arrive
- Goal/tactic state: storing selected goals and tactics during the morning selection flow

**Columns in the "Message" Data Table:**
- `messageID` (number)
- `sender` (string) — identifies which sub-workflow is waiting (e.g. `process_reflection`, `weekly_review`)
- `resumeUrl` (string) — n8n execution resume URL

**Buyer requirement:** No Postgres install needed. The Data Table is created inside n8n (it's an n8n-native feature). Buyers need to create the "Message" Data Table in their n8n instance.

---

## Section 5 - Workflow list

Active, non-archived AM workflows (21 total):

### Morning Routine
- **AM - Morning - Start routine** (`njsE67iI52fQX4hL`) — Scheduled 08:00 daily; calls Create Daily Note, reads vault, calls Morning Reflection, then Goal Selection
- **AM - Morning - Reflection** (`gAsP9p3oCGsS4zmv`) — Sub-workflow; checks morning reflection checklist in daily note; sends incomplete questions to Telegram and waits for response
- **AM - Morning - Goal Selection** (`tO2eI2p3WJSTaMB60_Dlq`) — Sub-workflow; reads weekly plan from vault, sends goal selection menu to Telegram

### Evening Routine
- **AM - Evening - Start routine** (`90bjkgWdqs7ABXlE`) — Scheduled 20:00 daily; calls Create Daily Note, reads focus tasks, checks completion, sends celebration or accountability message via Ollama, then calls Evening Reflection
- **AM - Evening - Reflection** (`9uDvviG2Rslu6iUC`) — Sub-workflow; walks through evening reflection checklist questions via Telegram

### Week Planning
- **AM - Week - Planning v2 (Claude)** (`zRwoR6vIksVEoc1f`) — Scheduled every Monday; reads cycle metadata + past daily notes, calls Claude API to generate weekly plan, saves to vault, sends tactic options to Telegram
- **AM - Week - Review v2 (Claude)** (`Igq9tGCOS0PPCqGL`) — Scheduled every Sunday 15:00; reads 7 daily notes, calls Claude API for analysis, saves weekly review to vault, archives notes, sends summary to Telegram

### Quarter Review
- **AM - Quarter - Review** (`9C2CnTp3jWfdW9kM`) — Scheduled/triggered at end of cycle; multi-step Q&A via Telegram, Ollama generates quarterly review doc, saves to vault
- **AM - Telegram - Message trigger - Quarter Review** (`8dYTSiCStFigrlOC`) — Sub-workflow; handles Telegram callback during quarter review Q&A loop, stores answers, continues loop
- **AM - Quarter - Create Cycle** (`dYJeEzaCSJvtwOnx`) — Manual trigger; reads Telos, Vision, last reflection from vault, calls Ollama to generate new 12-week cycle, sends preview to Telegram for approval, saves cycle file + updates metadata

### Message Hub
- **AM - Telegram - Message trigger** (`i45JHGvuDJTmm6q2wM-Mu`) — Always-on Telegram trigger; central router for all incoming Telegram messages and callbacks; dispatches to correct sub-workflow
- **AM - Telegram - Message trigger - Goals Confirm** (`yAi3TJwPHLteoDUO`) — Handles goal confirmation callback; reads weekly plan, writes selected tactics to daily note
- **AM - Telegram - Message trigger - Goal Select** (`1HfX7UcNQerN2RCR`) — Handles goal selection callback; reads stored goals from Data Table, builds and sends tactic menu
- **AM - Telegram - Tactic Selection Flow** (`hR1AHNrIOQKPlPK4`) — 27-node multi-step tactic selection; handles tactic/more/other/done callbacks; writes final tactic to daily note
- **AM - Telegram - Message trigger - Tactic Select** (`QvkyA79Kxqx4mpHi`) — Entry point callback for tactic selection; delegates to Tactic Selection Flow
- **AM - Telegram - Message trigger - Weekly Review** (`PvX3O2s7BqjeeVE6`) — Handles weekly review toggle callbacks; confirms selections and resumes waiting weekly review workflow
- **AM - Telegram - Message trigger - Weekly Feedback** (`fYjAWA6EiUn7zYfh`) — Captures weekly feedback from Telegram; stores for AI context
- **AM - Telegram - Message trigger - Process Reflection** (`uOZwSUL34lnB3PWO`) — Handles process reflection callback; resumes waiting reflection workflow
- **AM - Telegram - Message trigger - ap_morning** (`U5s7yGoTPgbVVh0u`) — Morning entry point callback from Telegram; initiates morning flow
- **AM - Telegram - Message trigger - weekly_struggles** (`X1n1xaMlb8RkqHJG`) — Captures weekly struggles; stores for AI memory context
- **AM - Create daily note if not exists** (`PZdWbcFtFT3EvM3t`) — Sub-workflow; checks if today's daily note exists via Node-RED; if not, reads template and creates it
- **AM - Waitlist - Subscribe Handler** (`8FAzNPSpbA14pBIl`) — Webhook; receives waitlist form submissions, validates, sends Telegram notification

---

## Architecture notes for bundle documentation

### Obsidian access: Node-RED bridge (not Local REST API)
The AM system accesses the Obsidian vault via a **Node-RED** intermediary, not the Obsidian Local REST API plugin. Node-RED runs on the same machine as the vault and exposes two HTTP endpoints that read/write files directly on the filesystem.

**Buyer requirement change from original plan:**
- ~~Obsidian Local REST API plugin~~ → Not needed
- ~~localhost:27123~~ → Not applicable
- **Required instead:** Node-RED instance with `/find_file` and `/create_file` endpoints configured for the buyer's vault path

The Node-RED flow to replicate is:
- `POST /find_file` with body `{path: "/absolute/path/to/file.md"}` → returns file content as text
- `POST /create_file` with body `{path: "/absolute/path/to/file.md", content: "..."}` → creates/overwrites file

### No PostgreSQL
The original plan assumed Postgres. The actual system uses n8n Data Tables exclusively. Remove Postgres from buyer prerequisites.

### Config node fields (revised based on audit)
The Config node template should use these fields (removing Postgres, replacing Obsidian URL with Node-RED URL):

```json
{
  "telegramChatId": "YOUR_TELEGRAM_CHAT_ID",
  "nodeRedBaseUrl": "http://YOUR_NODERED_HOST:1880",
  "vaultRootPath": "/path/to/your/vault",
  "ollamaBaseUrl": "http://localhost:11434",
  "claudeApiKey": "sk-ant-..."
}
```

Note: Telegram bot token is handled via n8n Telegram credential (not Config node).
Note: Ollama connection is handled via n8n Ollama credential (not Config node).

---

## Config Node Refactor Results (Plan 02-01 Task 2)

**Completed:** 2026-03-12

All 22 workflows have been refactored to use the `CONFIG — Edit These Values` Set node pattern.

### Final Config node field set

```json
{
  "telegramChatId": "YOUR_TELEGRAM_CHAT_ID",
  "botToken": "YOUR_BOT_TOKEN",
  "nodeRedBaseUrl": "http://YOUR_NODERED_HOST:1880",
  "vaultRootPath": "/path/to/your/vault",
  "claudeApiKey": "sk-ant-YOUR_CLAUDE_API_KEY",
  "n8nHost": "https://YOUR_N8N_HOST"
}
```

Note on botToken: Several workflows call the Telegram Bot API directly via HTTP Request nodes (inline bot menus, callback answers) and require the bot token in the URL. These are now referenced via `{{$node["CONFIG — Edit These Values"].json["botToken"]}}` rather than the n8n Telegram credential.

Note on n8nHost: Two workflows (`AM - Telegram - Message trigger - Weekly Review` and `AM - Telegram - Message trigger - weekly_struggles`) call back into the n8n instance itself via webhook-waiting URLs. These require the buyer's n8n public URL.

Note on ollamaBaseUrl: NOT included in Config node — Ollama connection is managed via n8n's built-in Ollama LangChain credential. Buyer configures this in Credentials, not the Config node.

### Dual-trigger workflows fixed

- **AM - Quarter - Review**: Had Schedule trigger + Manual trigger. Manual trigger previously bypassed Config. Fixed: both triggers now route to Config, Config fans out to both downstream branches.
- **AM - Telegram - Message trigger - ap_morning**: Had Execute Workflow trigger that bypassed Config. Fixed.

### Expression pattern used

```
{{$node["CONFIG — Edit These Values"].json["fieldName"]}}
```

All HTTP Request URLs, Telegram chatId fields, and Code node `basePath` variables updated to use this pattern.

### Exported file

- Path: `bundle/workflows/am-workflows-v1.json`
- Size: ~470KB
- Workflows: 22
- No personal values in output (verified: no Telegram chat ID, bot token, vault path, Node-RED IP, Claude API key, or n8n hostname)
