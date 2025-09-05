-- Murder Mystery Game Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension for better IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    title TEXT DEFAULT 'Untitled Mystery',
    status TEXT NOT NULL DEFAULT 'INIT' CHECK (status IN ('INIT', 'CAST_READY', 'WORLD_READY', 'IN_PROGRESS', 'DONE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    opening_summary TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    in_progress BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Characters table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    personality JSONB NOT NULL DEFAULT '{}',
    lie_policy TEXT NOT NULL DEFAULT 'honest' CHECK (lie_policy IN ('honest', 'evasive', 'deceptive', 'pathological')),
    is_killer BOOLEAN NOT NULL DEFAULT FALSE,
    is_alive BOOLEAN NOT NULL DEFAULT TRUE,
    is_victim BOOLEAN NOT NULL DEFAULT FALSE,
    secrets JSONB DEFAULT '[]',
    relationships JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    image_url TEXT DEFAULT NULL
);

-- 3. Locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    is_accessible BOOLEAN NOT NULL DEFAULT TRUE,
    connected_locations TEXT[] DEFAULT '{}',
    atmosphere TEXT DEFAULT 'neutral',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    image_url TEXT DEFAULT NULL
);

-- 4. Clues table
CREATE TABLE clues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_id TEXT,
    is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
    discovered_by TEXT,
    discovery_method TEXT DEFAULT 'investigation',
    significance_level INTEGER DEFAULT 1 CHECK (significance_level BETWEEN 1 AND 5),
    points_to TEXT[] DEFAULT '{}', -- Points to character/location names
    metadata JSONB DEFAULT '{}',
    discovered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    image_url TEXT DEFAULT NULL
);

-- 5. Timeline events table
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    event_time TIMESTAMPTZ NOT NULL,
    event_description TEXT NOT NULL,
    location_id TEXT,
    character_ids TEXT[] DEFAULT '{}',
    event_type TEXT DEFAULT 'general' CHECK (event_type IN ('murder', 'discovery', 'conversation', 'movement', 'general')),
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    witness_ids TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Interactions table
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    actor TEXT NOT NULL CHECK (actor IN ('player', 'master', 'narrator', 'character', 'location', 'clue')),
    target_id UUID, -- ID of character/location/clue being interacted with
    user_query TEXT NOT NULL,
    agent_payload JSONB DEFAULT '{}',
    agent_response TEXT NOT NULL,
    response_time_ms INTEGER,
    tools_used TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_characters_game_id ON characters(game_id);
CREATE INDEX idx_characters_is_killer ON characters(is_killer);
CREATE INDEX idx_locations_game_id ON locations(game_id);
CREATE INDEX idx_clues_game_id ON clues(game_id);
CREATE INDEX idx_clues_revealed ON clues(is_revealed);
CREATE INDEX idx_timeline_game_id ON timeline_events(game_id);
CREATE INDEX idx_timeline_event_time ON timeline_events(event_time);
CREATE INDEX idx_interactions_game_id ON interactions(game_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can modify these based on your auth setup)
CREATE POLICY "Users can access their own games" ON games FOR ALL USING (auth.uid()::text = user_id);
-- Grant permissions to replication role for Realtime
GRANT SELECT ON TABLE public.characters TO supabase_replication_admin;

CREATE POLICY "Users can access characters in their games" ON characters FOR ALL 
TO authenticated, supabase_replication_admin
USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = characters.game_id AND games.user_id = auth.uid()::text)
);

GRANT SELECT ON TABLE public.locations TO supabase_replication_admin;

CREATE POLICY "Users can access locations in their games" ON locations FOR ALL 
TO authenticated, supabase_replication_admin
USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = locations.game_id AND games.user_id = auth.uid()::text)
);

GRANT SELECT ON TABLE public.clues TO supabase_replication_admin;

CREATE POLICY "Users can access clues in their games" ON clues FOR ALL 
TO authenticated, supabase_replication_admin
USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = clues.game_id AND games.user_id = auth.uid()::text)
);

GRANT SELECT ON TABLE public.timeline_events TO supabase_replication_admin;

CREATE POLICY "Users can access timeline events in their games" ON timeline_events FOR ALL 
TO authenticated, supabase_replication_admin
USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = timeline_events.game_id AND games.user_id = auth.uid()::text)
);
CREATE POLICY "Users can access interactions in their games" ON interactions FOR ALL USING (
    EXISTS (SELECT 1 FROM games WHERE games.id = interactions.game_id AND games.user_id = auth.uid()::text)
);

-- Trigger to update updated_at on games table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
