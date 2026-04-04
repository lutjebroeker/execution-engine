-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory ENABLE ROW LEVEL SECURITY;

-- system_patterns and score_submissions: no tenant isolation needed
-- (system_patterns is internal; score_submissions is write-only from anon)

-- tenants: a tenant can only read/update their own row
CREATE POLICY "tenant_select_own" ON tenants FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "tenant_update_own" ON tenants FOR UPDATE USING (auth.uid()::text = id::text);
-- service_role bypasses RLS for cron inserts

-- conversations: tenant sees only their messages
CREATE POLICY "conversations_tenant" ON conversations
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- goals: tenant sees only their goals
CREATE POLICY "goals_tenant" ON goals
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- goal_logs: tenant sees only their logs
CREATE POLICY "goal_logs_tenant" ON goal_logs
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- daily_priorities: tenant sees only their priorities
CREATE POLICY "daily_priorities_tenant" ON daily_priorities
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- weekly_reviews: tenant sees only their reviews
CREATE POLICY "weekly_reviews_tenant" ON weekly_reviews
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- memory: tenant sees only their memories
CREATE POLICY "memory_tenant" ON memory
  FOR ALL USING (tenant_id = (SELECT id FROM tenants WHERE id::text = auth.uid()::text));

-- score_submissions: anon can insert (scorecard submissions from engine-site)
ALTER TABLE score_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "score_submissions_insert" ON score_submissions FOR INSERT WITH CHECK (true);
