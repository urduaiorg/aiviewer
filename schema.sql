CREATE TABLE IF NOT EXISTS models (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_label TEXT,
  model_family TEXT,
  release_date TEXT,
  context_window INTEGER,
  description TEXT,
  url TEXT,
  announced_at TEXT,
  first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS benchmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  benchmark_name TEXT NOT NULL,
  score REAL NOT NULL,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS release_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  source_url TEXT,
  released_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, event_type, released_at),
  FOREIGN KEY(model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS pricing_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  input_price_per_million REAL,
  output_price_per_million REAL,
  cached_input_price_per_million REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  source_url TEXT,
  recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS capability_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id TEXT NOT NULL,
  context_window INTEGER,
  max_output_tokens INTEGER,
  supports_tool_use INTEGER NOT NULL DEFAULT 0,
  supports_vision INTEGER NOT NULL DEFAULT 0,
  supports_audio INTEGER NOT NULL DEFAULT 0,
  supports_reasoning INTEGER NOT NULL DEFAULT 0,
  source_url TEXT,
  recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS model_editorial (
  model_id TEXT PRIMARY KEY,
  editorial_description TEXT,
  editorial_strengths TEXT,
  editorial_watchouts TEXT,
  generated_by TEXT DEFAULT 'auto',
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(model_id) REFERENCES models(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_models_slug_unique ON models(slug);
CREATE INDEX IF NOT EXISTS idx_models_provider ON models(provider);
CREATE INDEX IF NOT EXISTS idx_models_release_date ON models(release_date);
CREATE INDEX IF NOT EXISTS idx_benchmarks_model_recorded ON benchmarks(model_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_release_events_model_date ON release_events(model_id, released_at DESC);
CREATE INDEX IF NOT EXISTS idx_release_events_date ON release_events(released_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_snapshots_model_date ON pricing_snapshots(model_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_capability_snapshots_model_date ON capability_snapshots(model_id, recorded_at DESC);
