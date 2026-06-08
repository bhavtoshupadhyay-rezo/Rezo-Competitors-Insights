-- v1 schema for the Competitor Insights backend.
-- All nested shapes (products, features, painPoints, ...) are stored as JSON
-- text — SQLite handles JSON natively via json_extract / json() and the volume
-- here (low hundreds of rows) doesn't justify normalising into join tables.
--
-- Tables are CREATE IF NOT EXISTS so this file is safe to re-run on every boot.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS competitor (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  logo               TEXT,
  category           TEXT NOT NULL,
  founded            INTEGER,
  hq                 TEXT,
  agent_ai           INTEGER DEFAULT 0,
  is_rezo            INTEGER DEFAULT 0,
  funding_status     TEXT,
  total_funding      TEXT,
  last_round         TEXT,
  last_round_date    TEXT,
  estimated_arr      TEXT,
  investors          TEXT DEFAULT '[]',           -- JSON array
  buzz_score         INTEGER,
  match_score        INTEGER,
  description        TEXT,
  products           TEXT DEFAULT '[]',           -- JSON array of {name,description,flagship}
  features           TEXT DEFAULT '{}',           -- JSON object
  pain_points        TEXT DEFAULT '[]',
  analytics_maturity TEXT DEFAULT '{}',
  recent_features    TEXT DEFAULT '[]',
  recent_fundings    TEXT DEFAULT '[]',
  industries         TEXT DEFAULT '[]',
  usps               TEXT DEFAULT '[]',
  website            TEXT,
  created_at         TEXT DEFAULT (datetime('now')),
  updated_at         TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_competitor_category   ON competitor(category);
CREATE INDEX IF NOT EXISTS idx_competitor_buzz_score ON competitor(buzz_score DESC);

CREATE TABLE IF NOT EXISTS voice (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  creator               TEXT NOT NULL,
  creator_logo          TEXT,
  creator_website       TEXT,
  launch_date           TEXT,
  is_new                INTEGER DEFAULT 0,
  is_trending           INTEGER DEFAULT 0,
  buzz_score            INTEGER,
  latency_ms            INTEGER,
  latency_label         TEXT,
  modality              TEXT DEFAULT '[]',
  tone                  TEXT DEFAULT '[]',
  voice_character       TEXT,
  language_count        INTEGER,
  languages             TEXT DEFAULT '[]',
  pricing               TEXT,
  pricing_model         TEXT,
  free_credits          TEXT,
  use_cases             TEXT DEFAULT '[]',
  quality_rating        INTEGER,
  naturalness           INTEGER,
  clarity               INTEGER,
  emotion_range         INTEGER,
  streaming_support     INTEGER DEFAULT 0,
  voice_cloning_support INTEGER DEFAULT 0,
  description           TEXT,
  audio_sample_url      TEXT,
  demo_url              TEXT,
  sample_text           TEXT,
  tags                  TEXT DEFAULT '[]',
  compliance            TEXT DEFAULT '[]',
  api_type              TEXT,
  category              TEXT,
  market_position       TEXT,
  training_approach     TEXT,
  best_for_region       TEXT,
  code_mixed_support    TEXT DEFAULT '[]',
  created_at            TEXT DEFAULT (datetime('now')),
  updated_at            TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_voice_creator    ON voice(creator);
CREATE INDEX IF NOT EXISTS idx_voice_category   ON voice(category);
CREATE INDEX IF NOT EXISTS idx_voice_latency_ms ON voice(latency_ms);

CREATE TABLE IF NOT EXISTS pricing (
  competitor_id        TEXT PRIMARY KEY,
  public_pricing       INTEGER DEFAULT 0,
  source_url           TEXT,
  internal_placeholder INTEGER DEFAULT 0,
  error                TEXT,
  t2t                  TEXT,
  t2v                  TEXT,
  v2t                  TEXT,
  v2v                  TEXT,
  telephony            TEXT,
  packaging            TEXT,
  last_verified        TEXT,
  updated_at           TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (competitor_id) REFERENCES competitor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  summary     TEXT,
  category    TEXT,
  date        TEXT,
  region      TEXT,
  source      TEXT,
  url         TEXT,
  impact      TEXT,
  related     TEXT DEFAULT '[]',
  parameters  TEXT DEFAULT '[]',
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_date     ON news(date DESC);

CREATE TABLE IF NOT EXISTS glossary (
  term       TEXT PRIMARY KEY,
  definition TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
