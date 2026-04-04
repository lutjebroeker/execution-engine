-- Jelle's tenant row — insert for dogfooding
-- telegram_chat_id must be replaced with Jelle's actual Telegram chat ID
-- Get it by messaging @userinfobot on Telegram
INSERT INTO tenants (telegram_chat_id, name, persona_name, tone, work_start_time, checkin_time, timezone, is_active)
VALUES (
  0,  -- REPLACE with Jelle's actual telegram_chat_id
  'Jelle',
  'Coach',
  'direct',
  '07:00',
  '17:00',
  'Europe/Amsterdam',
  false  -- set to true after running /start onboarding
)
ON CONFLICT (telegram_chat_id) DO NOTHING;
