-- PostgreSQL initialization script for memory system
-- Creates tables for episodic memory archive and metadata storage

-- Episodic memory archive table (Layer 4 - Cold Storage)
CREATE TABLE IF NOT EXISTS episodic_memories (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    conversation_id VARCHAR(255),
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    conversation JSONB NOT NULL,
    context JSONB,
    topic VARCHAR(255),
    sentiment VARCHAR(50),
    importance_score FLOAT DEFAULT 0.5,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory metadata index table
CREATE TABLE IF NOT EXISTS memory_metadata (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    memory_type VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    layer VARCHAR(50) NOT NULL,
    topic VARCHAR(255),
    importance_score FLOAT DEFAULT 0.5,
    confidence FLOAT DEFAULT 0.5,
    last_accessed TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences cache table (Layer 3 - Semantic Memory Cache)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(255) NOT NULL,
    preference_type VARCHAR(255) NOT NULL,
    preference_value TEXT NOT NULL,
    confidence FLOAT DEFAULT 0.5,
    context VARCHAR(255),
    supporting_episodes TEXT[],
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, preference_type, preference_value)
);

-- Memory statistics table
CREATE TABLE IF NOT EXISTS memory_stats (
    user_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_memories INTEGER DEFAULT 0,
    episodic_count INTEGER DEFAULT 0,
    semantic_count INTEGER DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    retrieval_count INTEGER DEFAULT 0,
    avg_retrieval_latency_ms FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_episodic_user_timestamp ON episodic_memories(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_episodic_topic ON episodic_memories(topic);
CREATE INDEX IF NOT EXISTS idx_episodic_importance ON episodic_memories(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_metadata_user_type ON memory_metadata(user_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_metadata_layer ON memory_metadata(layer);
CREATE INDEX IF NOT EXISTS idx_preferences_user ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_stats_user_date ON memory_stats(user_id, date DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_episodic_updated_at BEFORE UPDATE ON episodic_memories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metadata_updated_at BEFORE UPDATE ON memory_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE episodic_memories IS 'Layer 4: Full conversation logs (cold storage)';
COMMENT ON TABLE memory_metadata IS 'Metadata index for all memory types';
COMMENT ON TABLE user_preferences IS 'Layer 3: Semantic memory cache for user preferences';
COMMENT ON TABLE memory_stats IS 'Daily statistics for memory usage and performance';
