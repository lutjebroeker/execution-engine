# Execution Engine AM Bundle — Setup Guide

**"From download to first Telegram check-in in 30 minutes."**

---

## Prerequisites Checklist

Before you start, make sure you have the following:

- [ ] **n8n** 1.x or later, installed and running ([Installation docs](https://docs.n8n.io/hosting/installation/)) — check your version at Settings → About in your n8n instance
- [ ] **Telegram account** (any device — phone, desktop, or web)
- [ ] **Obsidian** installed ([obsidian.md/download](https://obsidian.md/download))
- [ ] **Node-RED** installed ([nodered.org/docs/getting-started](https://nodered.org/docs/getting-started/)) — used as the bridge between n8n and your Obsidian vault files
- [ ] **Ollama** installed ([ollama.ai](https://ollama.ai)) — required for local AI in the evening accountability and quarter review flows
- [ ] **Claude API key** — get one at [console.anthropic.com](https://console.anthropic.com) (used for weekly and quarterly review workflows)

---

## Step 1: Set Up Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a display name for your bot (e.g. `My Execution Engine`)
4. Choose a username ending in `bot` (e.g. `myexecution_bot`)
5. BotFather replies with your **bot token** — copy and save it (looks like `123456789:AAHdqTcvCH1vGWJxfSeofSs4tQlndSmtkEA`)
6. Find your **Telegram chat ID**: search for `@userinfobot`, send it any message, and it replies with your numeric ID (e.g. `987654321`)
7. In n8n: go to **Credentials → Add Credential → Telegram API** → paste your bot token → save as `Telegram Account`

**Save your chat ID** — you'll need it in Step 6.

**Verification:** In n8n, open the Telegram credential and click "Test". It should return your bot's username.

---

## Step 2: Set Up Obsidian Vault

1. Locate `obsidian-vault-starter/` in this bundle
2. Copy the entire `obsidian-vault-starter/` folder to a location you'll remember — for example:
   - macOS/Linux: `~/Documents/ExecutionEngine/`
   - Windows: `C:\Users\yourname\Documents\ExecutionEngine\`
3. Open Obsidian → click **Open folder as vault** → select that folder
4. Note the **full absolute path** to this folder — you'll need it in Step 3

**Verification:** Obsidian opens and you see `Daily`, `Weekly`, `Quarterly`, `Goals`, and `Archive` folders in the left sidebar.

---

## Step 3: Set Up Node-RED (Vault File Bridge)

The n8n workflows read and write Obsidian vault files via Node-RED. Node-RED runs on the same machine as your vault and exposes two HTTP endpoints that n8n calls to access files.

### 3a. Install Node-RED

Follow the official guide for your OS: [nodered.org/docs/getting-started](https://nodered.org/docs/getting-started/)

Start Node-RED:
```bash
node-red
```

By default it runs at `http://localhost:1880`.

### 3b. Import the vault bridge flow

1. Open Node-RED in your browser (`http://localhost:1880`)
2. Click the **hamburger menu** (≡) → **Import**
3. Paste the following flow JSON and click **Import**:

```json
[
  {
    "id": "find-file-http",
    "type": "http in",
    "url": "/find_file",
    "method": "post",
    "name": "POST /find_file",
    "x": 120, "y": 80
  },
  {
    "id": "find-file-fn",
    "type": "function",
    "name": "Read file",
    "func": "const fs = require('fs');\nconst path = msg.payload.path;\ntry {\n  msg.payload = fs.readFileSync(path, 'utf8');\n  msg.statusCode = 200;\n} catch(e) {\n  msg.payload = {error: {status: 404, message: e.message}};\n  msg.statusCode = 404;\n}\nreturn msg;",
    "x": 320, "y": 80
  },
  {
    "id": "find-file-resp",
    "type": "http response",
    "name": "Response",
    "x": 520, "y": 80
  },
  {
    "id": "create-file-http",
    "type": "http in",
    "url": "/create_file",
    "method": "post",
    "name": "POST /create_file",
    "x": 120, "y": 180
  },
  {
    "id": "create-file-fn",
    "type": "function",
    "name": "Write file",
    "func": "const fs = require('fs');\nconst path_mod = require('path');\nconst p = msg.payload.path;\nconst content = msg.payload.content || '';\ntry {\n  fs.mkdirSync(path_mod.dirname(p), {recursive: true});\n  fs.writeFileSync(p, content, 'utf8');\n  msg.payload = {ok: true};\n  msg.statusCode = 200;\n} catch(e) {\n  msg.payload = {error: e.message};\n  msg.statusCode = 500;\n}\nreturn msg;",
    "x": 320, "y": 180
  },
  {
    "id": "create-file-resp",
    "type": "http response",
    "name": "Response",
    "x": 520, "y": 180
  }
]
```

4. Wire the nodes: **POST /find_file** → **Read file** → **Response** and **POST /create_file** → **Write file** → **Response**
5. Click **Deploy**

### 3c. Note your Node-RED URL

If n8n runs on the same machine as Node-RED: `http://localhost:1880`

If n8n runs on a different machine (e.g. Docker or VPS): use the IP/hostname of the Node-RED machine (e.g. `http://192.168.1.100:1880`)

**Verification:**
```bash
curl -X POST http://localhost:1880/find_file \
  -H "Content-Type: application/json" \
  -d '{"path": "/path/to/your/vault/Daily/_template-daily.md"}'
```

Should return the contents of the file (not a connection refused error).

---

## Step 4: Set Up Ollama

Ollama runs AI models locally for the evening accountability and quarter review workflows.

1. Install Ollama from [ollama.ai](https://ollama.ai) — follow the installer for your OS
2. Pull the required models:

```bash
ollama pull llama3.1:8b
ollama pull kimi-k2.5
```

3. Ollama starts automatically and runs at `http://localhost:11434`
4. In n8n: go to **Credentials → Add Credential → Ollama API** → set Base URL to `http://localhost:11434` → save as `Ollama account`

**Verification:**
```bash
curl http://localhost:11434/api/tags
```

You should see JSON with both `llama3.1:8b` and `kimi-k2.5` listed in the `models` array.

---

## Step 5: Create the Message Data Table in n8n

The workflows use n8n's built-in **Data Table** feature (not PostgreSQL) for state management. You need to create this table before importing workflows.

1. Open your n8n instance
2. Go to **n8n Home → Data** in the left sidebar (or navigate to `/data`)
3. Click **+ Create table**
4. Name it exactly `Message` (case-sensitive)
5. Add these columns:
   - `messageID` — type: **Number**
   - `sender` — type: **String**
   - `resumeUrl` — type: **String**
6. Save the table

**Verification:** The table `Message` appears in your n8n Data section with three columns: messageID, sender, resumeUrl.

---

## Step 6: Import Workflows into n8n

1. Open your n8n instance
2. Go to **Workflows → Import from file**
3. Select `workflows/am-workflows-v1.json` from this bundle
4. All 21 workflows import in **inactive** state (this is correct — do not activate them yet)
5. For each workflow that uses **Telegram**:
   - Open the workflow → find any Telegram node → **Credentials** → select `Telegram Account` (created in Step 1)
6. For each workflow that uses **Ollama** (Evening routine, Quarter Review, Quarter Create Cycle):
   - Open the workflow → find the Ollama Chat Model node → **Credentials** → select `Ollama account` (created in Step 4)

**Verification:** All workflows appear in your workflow list. No node shows an `Unknown node type` error.

---

## Step 7: Configure the Config Node

Every workflow has a **"CONFIG — Edit These Values"** Set node immediately after the trigger. This is the only node you need to edit per workflow.

1. Open each workflow one by one
2. Click the **"CONFIG — Edit These Values"** node (first node after the trigger)
3. Fill in the values:

| Field | Value | Where you got it |
|-------|-------|-----------------|
| `telegramChatId` | Your numeric chat ID | Step 1 — @userinfobot |
| `botToken` | Your Telegram bot token | Step 1 — BotFather |
| `nodeRedBaseUrl` | `http://localhost:1880` | Step 3 (adjust if different host) |
| `vaultRootPath` | Full absolute path to your vault | Step 2 |
| `claudeApiKey` | Your Anthropic API key | console.anthropic.com |
| `n8nHost` | Your n8n public URL (e.g. `https://n8n.yourdomain.com`) | Your n8n installation |

4. Save the workflow
5. **Activate** the workflow using the toggle at the top right
6. Repeat for each workflow

**Important:** Activate **AM - Telegram - Message trigger** first — it must be running before any other workflow can receive Telegram callbacks.

**Verification:** Activate AM - Telegram - Message trigger. Send `/start` to your Telegram bot. The bot should respond. Then activate AM - Morning - Start routine and click **Test workflow** — it should run to completion and you should receive a morning message in Telegram.

---

## Workflow Reference

### Morning Routine

- **AM - Morning - Start routine** — Runs at 08:00 daily; creates today's daily note if it doesn't exist, walks through morning reflection, then sends goal selection menu to Telegram
- **AM - Morning - Reflection** — Sub-workflow; sends morning reflection checklist questions one by one via Telegram and waits for your responses
- **AM - Morning - Goal Selection** — Sub-workflow; reads your weekly plan and presents today's goals and tactic options in Telegram

### Evening Routine

- **AM - Evening - Start routine** — Runs at 20:00 daily; reads today's task completion, generates an accountability or celebration message via Ollama, then starts evening reflection
- **AM - Evening - Reflection** — Sub-workflow; sends evening reflection checklist questions one by one and waits for your responses

### Week Planning

- **AM - Week - Planning v2 (Claude)** — Runs every Monday; reads cycle metadata and past daily notes, calls Claude API to generate a weekly plan with tactic options, saves to vault
- **AM - Week - Review v2 (Claude)** — Runs every Sunday at 15:00; reads the week's daily notes, calls Claude for a review summary, saves to vault and archives the daily notes

### Quarter Review

- **AM - Quarter - Review** — Triggered at end of 12-week cycle; multi-step Q&A via Telegram, Ollama generates the quarterly review document, saves to vault
- **AM - Telegram - Message trigger - Quarter Review** — Sub-workflow; handles Telegram callback during quarter review Q&A, stores each answer and continues the loop
- **AM - Quarter - Create Cycle** — Manual trigger; reads Telos, Vision, and last reflection from vault, Ollama generates a new 12-week cycle proposal, sends to Telegram for approval, saves cycle file

### Message Hub

- **AM - Telegram - Message trigger** — Always-on Telegram trigger; central router for all messages and callback buttons
- **AM - Telegram - Message trigger - Goals Confirm** — Handles goal confirmation; writes selected tactics to today's daily note
- **AM - Telegram - Message trigger - Goal Select** — Handles goal selection callback; displays the tactic menu for the selected goal
- **AM - Telegram - Tactic Selection Flow** — 27-node multi-step tactic selection; handles all tactic/more/other/done callbacks and writes final selection to daily note
- **AM - Telegram - Message trigger - Tactic Select** — Entry point for tactic selection flow
- **AM - Telegram - Message trigger - Weekly Review** — Handles weekly review toggle interactions
- **AM - Telegram - Message trigger - Weekly Feedback** — Captures your weekly feedback for AI context
- **AM - Telegram - Message trigger - Process Reflection** — Handles process reflection callback; resumes the waiting reflection workflow
- **AM - Telegram - Message trigger - ap_morning** — Morning flow entry point from Telegram
- **AM - Telegram - Message trigger - weekly_struggles** — Captures weekly struggles for AI memory
- **AM - Create daily note if not exists** — Sub-workflow; checks if today's note exists, creates it from template if not
- **AM - Waitlist - Subscribe Handler** — Webhook; receives waitlist signups and sends Telegram notification

---

## Support

Email: support@jellespek.nl
Response time: within 24 hours

If something doesn't work after following this guide, email me with:
1. Which step you're on
2. The error message you see (screenshot is fine)
3. Your n8n version (Settings → About)
4. Your operating system

I'll get you unstuck.
