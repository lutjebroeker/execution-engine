-- EE Phase 6 — Test Data Seed for Weekly Pattern Detection (EE-03)
-- Run in Supabase Studio SQL editor after replacing the tenant ID below.
--
-- HOW TO GET YOUR TENANT ID:
--   SELECT id FROM tenants WHERE telegram_chat_id = <your_chat_id>;
-- Then replace all occurrences of {jelle_tenant_id} below.
--
-- WHAT THIS SEEDS:
--   - 6 days of daily_priorities with execution scores showing a mid-week dip
--   - 1 historical weekly_reviews row from the prior week (for pattern detection)
--   - Weekly avg from daily data: ~66.7% — should render "Decent week."
--
-- AFTER RUNNING:
--   1. Go to n8n UI and manually trigger cron-weekly-review
--   2. Expect Telegram message with ~67% score and pattern observation about mid-week dip
--   3. The prior weekly_reviews row from prior week should make Claude reference "recurring pattern"

-- Step A: Seed current week daily_priorities
INSERT INTO daily_priorities (tenant_id, date, priorities, execution_score, briefing_sent_at, checkin_completed_at)
VALUES
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 6,
    '[{"text":"Write LinkedIn post","goal_id":null,"completed":true},{"text":"Review Phase 7 plan","goal_id":null,"completed":true},{"text":"Update README","goal_id":null,"completed":true}]',
    100.0,
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '6 days' + INTERVAL '10 hours'
  ),
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 5,
    '[{"text":"Code review session","goal_id":null,"completed":true},{"text":"Write newsletter","goal_id":null,"completed":true},{"text":"Fix n8n workflow","goal_id":null,"completed":false}]',
    66.7,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '10 hours'
  ),
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 4,
    '[{"text":"Client call prep","goal_id":null,"completed":false},{"text":"Finish Phase 6 plan","goal_id":null,"completed":false},{"text":"Update Supabase schema","goal_id":null,"completed":true}]',
    33.3,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days' + INTERVAL '10 hours'
  ),
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 3,
    '[{"text":"Ship bot feature","goal_id":null,"completed":true},{"text":"Write docs","goal_id":null,"completed":true},{"text":"Review analytics","goal_id":null,"completed":false}]',
    66.7,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '10 hours'
  ),
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 2,
    '[{"text":"Test onboarding flow","goal_id":null,"completed":true},{"text":"Fix memory search","goal_id":null,"completed":true},{"text":"Update ROADMAP","goal_id":null,"completed":true}]',
    100.0,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '10 hours'
  ),
  (
    '{jelle_tenant_id}',
    CURRENT_DATE - 1,
    '[{"text":"Write weekly review","goal_id":null,"completed":true},{"text":"Plan next week","goal_id":null,"completed":false},{"text":"Send newsletter","goal_id":null,"completed":false}]',
    33.3,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '10 hours'
  )
ON CONFLICT (tenant_id, date) DO UPDATE
  SET priorities = EXCLUDED.priorities,
      execution_score = EXCLUDED.execution_score,
      briefing_sent_at = EXCLUDED.briefing_sent_at,
      checkin_completed_at = EXCLUDED.checkin_completed_at;

-- Expected weekly average: (100 + 66.7 + 33.3 + 66.7 + 100 + 33.3) / 6 = 66.7% => "Decent week."

-- Step C: Seed prior week's weekly_reviews row so Claude can detect recurring pattern
INSERT INTO weekly_reviews (tenant_id, week_start, execution_score, pattern_observation)
VALUES (
  '{jelle_tenant_id}',
  CURRENT_DATE - 13,
  58.3,
  'Mid-week execution dropped — two priorities unfinished on Wednesday.'
)
ON CONFLICT (tenant_id, week_start) DO NOTHING;

-- Verify seeded data:
-- SELECT date, execution_score, checkin_completed_at FROM daily_priorities
-- WHERE tenant_id = '{jelle_tenant_id}' ORDER BY date DESC LIMIT 7;

-- SELECT week_start, execution_score, pattern_observation FROM weekly_reviews
-- WHERE tenant_id = '{jelle_tenant_id}' ORDER BY week_start DESC LIMIT 3;
