-- Initialize PostgreSQL Database for AI Memory System
-- This script creates the necessary tables and indexes

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.8,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  tokens INTEGER NOT NULL DEFAULT 0,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  compressed TEXT,
  original TEXT,
  
  -- Indexes for common queries
  CONSTRAINT check_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
CREATE INDEX IF NOT EXISTS idx_memories_scope ON memories(scope);
CREATE INDEX IF NOT EXISTS idx_memories_priority ON memories(priority);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_updated_at ON memories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_expires_at ON memories(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memories_metadata ON memories USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories((metadata->>'userId')) WHERE metadata->>'userId' IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memories_thread_id ON memories((metadata->>'threadId')) WHERE metadata->>'threadId' IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memories_session_id ON memories((metadata->>'sessionId')) WHERE metadata->>'sessionId' IS NOT NULL;

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_memories_content_fts ON memories USING GIN(to_tsvector('english', content));

-- Memory analytics table
CREATE TABLE IF NOT EXISTS memory_analytics (
  id SERIAL PRIMARY KEY,
  memory_id VARCHAR(255) REFERENCES memories(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_memory_id ON memory_analytics(memory_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON memory_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON memory_analytics(created_at DESC);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  preference_key VARCHAR(255) NOT NULL,
  preference_value TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.9,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, preference_key)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Conversation threads table
CREATE TABLE IF NOT EXISTS conversation_threads (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  title TEXT,
  metadata JSONB DEFAULT '{}',
  message_count INTEGER NOT NULL DEFAULT 0,
  token_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_threads_user_id ON conversation_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON conversation_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_archived ON conversation_threads(archived_at) WHERE archived_at IS NULL;

-- Functions
-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_threads_updated_at
  BEFORE UPDATE ON conversation_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views
-- Active memories view (non-expired)
CREATE OR REPLACE VIEW active_memories AS
SELECT * FROM memories
WHERE expires_at IS NULL OR expires_at > NOW()
ORDER BY updated_at DESC;

-- Memory statistics view
CREATE OR REPLACE VIEW memory_stats AS
SELECT
  type,
  scope,
  priority,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence,
  SUM(tokens) as total_tokens,
  AVG(access_count) as avg_access_count
FROM active_memories
GROUP BY type, scope, priority;

-- User memory statistics
CREATE OR REPLACE VIEW user_memory_stats AS
SELECT
  metadata->>'userId' as user_id,
  COUNT(*) as total_memories,
  SUM(tokens) as total_tokens,
  AVG(confidence) as avg_confidence,
  MAX(created_at) as last_memory_at
FROM active_memories
WHERE metadata->>'userId' IS NOT NULL
GROUP BY metadata->>'userId';

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO clarity;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO clarity;
