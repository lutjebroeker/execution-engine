# Execution Engine — Infrastructure

## Supabase

- Studio: https://supabase-execution-engine.jellespek.nl
- Credentials: 1Password → "Supabase - execution-engine"
- DB Host: 192.168.1.124
- DB Port: 8032 (pooler session mode)
- Pooler Transaction Port: 8033

### Running migrations

Migrations are applied via docker exec on the remote Postgres container:

```bash
DB_PASS=$(op item get "Supabase - execution-engine" --vault Supabase --reveal --fields "DB Password")
ssh supabase@192.168.1.124 "docker cp /path/to/migration.sql execution-engine-db:/tmp/migration.sql && \
  PGPASSWORD='$DB_PASS' docker exec -i execution-engine-db psql -U postgres -d postgres -f /tmp/migration.sql"
```

### Schema

| Table              | RLS | Purpose                                    |
|--------------------|-----|--------------------------------------------|
| tenants            | yes | One row per user, created on /start        |
| conversations      | yes | Message history for Claude context window  |
| goals              | yes | 12-week goals with milestones              |
| goal_logs          | yes | Audit trail for goal updates               |
| daily_priorities   | yes | Top 3 priorities per day + check-in results|
| weekly_reviews     | yes | Sunday execution scores + patterns         |
| memory             | yes | Key-value memories with pgvector embeddings|
| system_patterns    | no  | Cross-tenant aggregated insights (Phase 9) |
| score_submissions  | yes | Scorecard submissions from engine-site     |

### n8n / service_role note

n8n and cron workflows use the `service_role` key which bypasses RLS — this is intentional.
The bot webhook uses service_role to look up tenants by `telegram_chat_id`.

## n8n

- Base URL: https://n8n.jellespek.nl
- Health: https://n8n.jellespek.nl/healthz
- Webhook base: https://n8n.jellespek.nl/webhook/{path}
- Webhook (test mode): https://n8n.jellespek.nl/webhook-test/{path}
- Webhook (production): POST https://n8n.jellespek.nl/webhook/telegram-bot

### Connectivity verification

```bash
# Health check
curl -s -o /dev/null -w "%{http_code}" https://n8n.jellespek.nl/healthz
# Expected: 200

# Webhook routing check (returns 404 for inactive workflows, proving routing works)
curl -s -o /dev/null -w "%{http_code}" -X POST https://n8n.jellespek.nl/webhook/telegram-bot \
  -H "Content-Type: application/json" -d '{"test": true}'
# Expected: 404 (no active workflow) or 200 (if workflow is active)
```

## Telegram Bot

- Created via @BotFather
- Webhook set to: https://n8n.jellespek.nl/webhook/telegram-bot
