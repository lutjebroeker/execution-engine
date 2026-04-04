# n8n Workflow: EE Telegram Bot Agent

## Required env vars (set in n8n Settings → Environment Variables)
- SUPABASE_URL — Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (bypasses RLS)
- ANTHROPIC_API_KEY — Claude API key
- TELEGRAM_BOT_TOKEN — From @BotFather
- BRAVE_API_KEY — (optional) Brave Search API key for web_search tool

## Import
1. In n8n UI: Workflows → Import → upload telegram-bot-agent.json
2. Set env vars in n8n Settings → Environment Variables
3. Activate workflow

## Webhook setup
After importing and activating, register the webhook with Telegram:
```bash
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -d "url=https://n8n.jellespek.nl/webhook/telegram-bot"
```

Verify webhook:
```bash
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
```

## Architecture

```
Telegram message
  → n8n Webhook (POST /webhook/telegram-bot)
  → Extract message data (Code)
  → Lookup tenant by chat_id (Supabase HTTP)
  → IF tenant exists?
      YES → Get conversation history (Supabase HTTP)
           → Build Claude messages (Code)
           → Claude API call 1 — tool_use (HTTP)
           → Parse tool response (Code)
           → Switch on tool name
               manage_goal      → Supabase goals CRUD
               log_progress     → Supabase goal_logs insert
               get_goals_overview → Supabase goals SELECT
               save_memory      → Supabase memory insert
               search_memory    → Supabase memory ILIKE
               web_search       → Brave Search API
           → Claude API call 2 — final response (HTTP)
           → Send Telegram reply (HTTP)
           → Save conversation turns (Supabase HTTP)
      NO → Is /start?
           YES → Onboarding state machine (5 steps via staticData)
           NO  → "Send /start to get set up."
```

## Onboarding flow
The /start command triggers a 5-step onboarding conversation stored in n8n workflow
staticData (keyed by chat_id). No database writes until onboarding completes.

Steps:
1. Persona name
2. Tone preference (direct / warm / professional)
3. First goal (12-week outcome)
4. Additional goals (up to 2 more, or "done")
5. Work start time

On completion: tenant row + goal rows created in Supabase.
