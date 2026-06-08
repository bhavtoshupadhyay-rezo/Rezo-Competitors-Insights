// SQLite connection + entity helpers.
//
// One file-backed DB at server/data/insights.db (writable on Render's free
// tier within the deploy lifecycle; for cross-deploy persistence upgrade to
// a paid plan with a disk or swap this module for Postgres).
//
// We standardise on snake_case column names in SQL and camelCase keys in JS.
// `rowToObject` / `objectToRow` translate between the two and JSON-encode the
// nested fields. ENTITIES below is the single source of truth for which keys
// belong to which column and which are JSON.

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.INSIGHTS_DB_PATH || path.resolve(__dirname, '..', 'data', 'insights.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Run migrations on load. Idempotent — uses CREATE IF NOT EXISTS.
const migrationsSql = fs.readFileSync(path.resolve(__dirname, 'migrations.sql'), 'utf8');
db.exec(migrationsSql);

// ───────────────────────────────────────────────────────────────────────────
// Entity descriptors
// ───────────────────────────────────────────────────────────────────────────
//
// Each entity defines:
//   table    — SQL table name
//   pk       — primary key column (snake_case)
//   pkJs     — primary key field in JS (camelCase)
//   columns  — ordered list of { js, sql, json? }
//
// `json: true` means the column stores a JSON-stringified array/object and
// must be parsed/stringified on read/write. Everything else passes through.

const C = (js, sql, json = false) => ({ js, sql, json });

export const ENTITIES = {
  competitor: {
    table: 'competitor',
    pk: 'id',
    pkJs: 'id',
    columns: [
      C('id', 'id'),
      C('name', 'name'),
      C('logo', 'logo'),
      C('category', 'category'),
      C('founded', 'founded'),
      C('hq', 'hq'),
      C('agentAI', 'agent_ai'),
      C('isRezo', 'is_rezo'),
      C('fundingStatus', 'funding_status'),
      C('totalFunding', 'total_funding'),
      C('lastRound', 'last_round'),
      C('lastRoundDate', 'last_round_date'),
      C('estimatedARR', 'estimated_arr'),
      C('investors', 'investors', true),
      C('buzzScore', 'buzz_score'),
      C('matchScore', 'match_score'),
      C('description', 'description'),
      C('products', 'products', true),
      C('features', 'features', true),
      C('painPoints', 'pain_points', true),
      C('analyticsMaturity', 'analytics_maturity', true),
      C('recentFeatures', 'recent_features', true),
      C('recentFundings', 'recent_fundings', true),
      C('industries', 'industries', true),
      C('usps', 'usps', true),
      C('website', 'website'),
    ],
  },
  voice: {
    table: 'voice',
    pk: 'id',
    pkJs: 'id',
    columns: [
      C('id', 'id'),
      C('name', 'name'),
      C('creator', 'creator'),
      C('creatorLogo', 'creator_logo'),
      C('creatorWebsite', 'creator_website'),
      C('launchDate', 'launch_date'),
      C('isNew', 'is_new'),
      C('isTrending', 'is_trending'),
      C('buzzScore', 'buzz_score'),
      C('latencyMs', 'latency_ms'),
      C('latencyLabel', 'latency_label'),
      C('modality', 'modality', true),
      C('tone', 'tone', true),
      C('voiceCharacter', 'voice_character'),
      C('languageCount', 'language_count'),
      C('languages', 'languages', true),
      C('pricing', 'pricing'),
      C('pricingModel', 'pricing_model'),
      C('freeCredits', 'free_credits'),
      C('useCases', 'use_cases', true),
      C('qualityRating', 'quality_rating'),
      C('naturalness', 'naturalness'),
      C('clarity', 'clarity'),
      C('emotionRange', 'emotion_range'),
      C('streamingSupport', 'streaming_support'),
      C('voiceCloningSupport', 'voice_cloning_support'),
      C('description', 'description'),
      C('audioSampleUrl', 'audio_sample_url'),
      C('demoUrl', 'demo_url'),
      C('sampleText', 'sample_text'),
      C('tags', 'tags', true),
      C('compliance', 'compliance', true),
      C('apiType', 'api_type'),
      C('category', 'category'),
      C('marketPosition', 'market_position'),
      C('trainingApproach', 'training_approach'),
      C('bestForRegion', 'best_for_region'),
      C('codeMixedSupport', 'code_mixed_support', true),
    ],
  },
  pricing: {
    table: 'pricing',
    pk: 'competitor_id',
    pkJs: 'competitorId',
    columns: [
      C('competitorId', 'competitor_id'),
      C('publicPricing', 'public_pricing'),
      C('sourceUrl', 'source_url'),
      C('internalPlaceholder', 'internal_placeholder'),
      C('error', 'error'),
      C('t2t', 't2t', true),
      C('t2v', 't2v', true),
      C('v2t', 'v2t', true),
      C('v2v', 'v2v', true),
      C('telephony', 'telephony', true),
      C('packaging', 'packaging', true),
      C('lastVerified', 'last_verified'),
    ],
  },
  news: {
    table: 'news',
    pk: 'id',
    pkJs: 'id',
    columns: [
      C('id', 'id'),
      C('title', 'title'),
      C('summary', 'summary'),
      C('category', 'category'),
      C('date', 'date'),
      C('region', 'region'),
      C('source', 'source'),
      C('url', 'url'),
      C('impact', 'impact'),
      C('related', 'related', true),
      C('parameters', 'parameters', true),
    ],
  },
  glossary: {
    table: 'glossary',
    pk: 'term',
    pkJs: 'term',
    columns: [
      C('term', 'term'),
      C('definition', 'definition'),
    ],
  },
};

// ───────────────────────────────────────────────────────────────────────────
// Row ⇄ Object helpers
// ───────────────────────────────────────────────────────────────────────────

export function rowToObject(entity, row) {
  if (!row) return null;
  const out = {};
  for (const col of entity.columns) {
    let v = row[col.sql];
    if (v == null) { out[col.js] = null; continue; }
    if (col.json) {
      try { v = JSON.parse(v); } catch { /* leave raw */ }
    }
    out[col.js] = v;
  }
  // SQLite stores booleans as INTEGER 0/1; restore the obvious ones.
  for (const k of ['agentAI', 'isRezo', 'isNew', 'isTrending', 'streamingSupport',
                   'voiceCloningSupport', 'publicPricing', 'internalPlaceholder']) {
    if (k in out && out[k] != null) out[k] = Boolean(out[k]);
  }
  return out;
}

export function objectToRow(entity, obj) {
  const row = {};
  for (const col of entity.columns) {
    let v = obj[col.js];
    if (v === undefined) v = null;
    if (col.json && v !== null) v = JSON.stringify(v);
    if (typeof v === 'boolean') v = v ? 1 : 0;
    row[col.sql] = v;
  }
  return row;
}

// ───────────────────────────────────────────────────────────────────────────
// Generic CRUD
// ───────────────────────────────────────────────────────────────────────────

export function listAll(entityKey, { limit, offset, orderBy } = {}) {
  const e = ENTITIES[entityKey];
  const order = orderBy ? ` ORDER BY ${orderBy}` : '';
  const lim = limit ? ` LIMIT ${Number(limit)}` : '';
  const off = offset ? ` OFFSET ${Number(offset)}` : '';
  const rows = db.prepare(`SELECT * FROM ${e.table}${order}${lim}${off}`).all();
  return rows.map((r) => rowToObject(e, r));
}

export function getById(entityKey, id) {
  const e = ENTITIES[entityKey];
  const row = db.prepare(`SELECT * FROM ${e.table} WHERE ${e.pk} = ?`).get(id);
  return rowToObject(e, row);
}

export function upsert(entityKey, obj) {
  const e = ENTITIES[entityKey];
  const row = objectToRow(e, obj);
  const cols = e.columns.map((c) => c.sql);
  const placeholders = cols.map(() => '?').join(', ');
  const updates = cols.filter((c) => c !== e.pk).map((c) => `${c} = excluded.${c}`).join(', ');
  const values = cols.map((c) => row[c]);
  const stmt = db.prepare(`
    INSERT INTO ${e.table} (${cols.join(', ')}) VALUES (${placeholders})
    ON CONFLICT(${e.pk}) DO UPDATE SET ${updates}, updated_at = datetime('now')
  `);
  stmt.run(...values);
  return getById(entityKey, row[e.pk]);
}

export function remove(entityKey, id) {
  const e = ENTITIES[entityKey];
  const info = db.prepare(`DELETE FROM ${e.table} WHERE ${e.pk} = ?`).run(id);
  return info.changes > 0;
}

export function count(entityKey) {
  const e = ENTITIES[entityKey];
  return db.prepare(`SELECT COUNT(*) AS n FROM ${e.table}`).get().n;
}
