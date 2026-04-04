-- Enable pgvector for memory embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- tenants: one row per user, created during /start onboarding
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_chat_id BIGINT UNIQUE NOT NULL,
  name TEXT,
  persona_name TEXT DEFAULT 'Coach',
  tone TEXT DEFAULT 'direct' CHECK (tone IN ('direct', 'warm', 'professional')),
  work_start_time TIME DEFAULT '07:00',
  checkin_time TIME DEFAULT '17:00',
  timezone TEXT DEFAULT 'Europe/Amsterdam',
  onboarded_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- conversations: message history for Claude context window
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- goals: 12-week goals with milestones
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- goal_logs: audit trail for goal updates
CREATE TABLE goal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  log_type TEXT NOT NULL CHECK (log_type IN ('progress', 'milestone', 'note', 'status_change')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- daily_priorities: top 3 priorities per day + check-in results
CREATE TABLE daily_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  priorities JSONB NOT NULL DEFAULT '[]',
  -- priorities format: [{"text": "...", "goal_id": "...", "completed": null}]
  reflection TEXT,
  execution_score NUMERIC(4,1),
  -- execution_score: 0-100 percentage, null until check-in completes
  briefing_sent_at TIMESTAMPTZ,
  checkin_sent_at TIMESTAMPTZ,
  checkin_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, date)
);

-- weekly_reviews: Sunday execution scores + pattern analysis
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  -- week_start: Monday of the reviewed week
  summary TEXT,
  wins TEXT,
  blockers TEXT,
  execution_score NUMERIC(4,1),
  -- execution_score: avg of daily scores for the week
  pattern_observation TEXT,
  -- e.g. "Wednesday was your worst day 3 weeks running"
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, week_start)
);

-- memory: key-value user memories (save_memory / search_memory tools)
CREATE TABLE memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  embedding vector(1536),
  -- pgvector for semantic search
  created_at TIMESTAMPTZ DEFAULT now()
);

-- system_patterns: cross-tenant aggregated insights (Phase 9)
CREATE TABLE system_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  tenant_count INTEGER DEFAULT 1,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- score_submissions: Execution Score Assessment from engine-site (Phase 7)
CREATE TABLE score_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  score INTEGER,
  tier TEXT,
  answers JSONB DEFAULT '{}',
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
