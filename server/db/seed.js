// Idempotent seed: reads the canonical JS data modules at src/data/* and
// writes them into the SQLite DB. Safe to run on every boot — uses upsert,
// so re-seeding is non-destructive for any row that didn't exist before but
// will OVERWRITE existing rows.
//
// `seedIfEmpty()` is the one we wire into server boot — it only seeds when
// the table is empty so user edits via the API aren't clobbered by the
// hardcoded seed on a redeploy.

import path from 'path';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';
import { count, upsert, getById } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.resolve(__dirname, '..', '..', 'src', 'data');

const toFileUrl = (p) => pathToFileURL(p).href;

async function loadModule(name) {
  return import(toFileUrl(path.join(DATA_DIR, name)));
}

export async function seedCompetitors() {
  const { rezoData, competitorsData } = await loadModule('competitorsData.js');
  const all = [rezoData, ...competitorsData];
  let n = 0;
  for (const c of all) {
    upsert('competitor', c);
    n++;
  }
  return n;
}

export async function seedVoices() {
  // Concatenate Indian + top voices feeds. Each is an array of voice records.
  const { indianVoicesData = [] } = await loadModule('indianVoicesData.js').catch(() => ({}));
  const { topVoicesData    = [] } = await loadModule('topVoicesData.js').catch(()    => ({}));
  let n = 0;
  for (const v of [...indianVoicesData, ...topVoicesData]) {
    upsert('voice', v);
    n++;
  }
  return n;
}

export async function seedPricing() {
  const { pricingData = {} } = await loadModule('pricingData.js').catch(() => ({}));
  let n = 0, skipped = 0;
  for (const [competitorId, entry] of Object.entries(pricingData)) {
    // Pricing has a FK on competitor.id — skip rows whose competitor was
    // removed/renamed in competitorsData.js so one orphan doesn't abort the
    // rest of the seed. Log so the operator can clean up.
    if (!getById('competitor', competitorId)) {
      console.warn(`[seed] pricing for unknown competitor '${competitorId}' — skipping`);
      skipped++;
      continue;
    }
    upsert('pricing', { competitorId, ...entry });
    n++;
  }
  if (skipped) console.warn(`[seed] pricing: ${n} inserted, ${skipped} skipped`);
  return n;
}

export async function seedNews() {
  const { aiNewsData = [] } = await loadModule('aiNewsData.js').catch(() => ({}));
  let n = 0;
  for (const item of aiNewsData) {
    upsert('news', item);
    n++;
  }
  return n;
}

export async function seedGlossary() {
  const { glossary = {} } = await loadModule('glossary.js').catch(() => ({}));
  let n = 0;
  for (const [term, definition] of Object.entries(glossary)) {
    upsert('glossary', { term, definition });
    n++;
  }
  return n;
}

export async function seedAll() {
  const report = {
    competitors: await seedCompetitors(),
    voices:      await seedVoices(),
    pricing:     await seedPricing(),
    news:        await seedNews(),
    glossary:    await seedGlossary(),
  };
  return report;
}

export async function seedIfEmpty() {
  // Per-entity try/catch — one failing seed must not leave the others empty.
  const out = {};
  const run = async (key, table, fn) => {
    if (count(table) > 0) return;
    try { out[key] = await fn(); }
    catch (err) { console.error(`[seed] ${key} failed: ${err.message}`); out[key] = `error: ${err.message}`; }
  };
  await run('competitors', 'competitor', seedCompetitors);
  await run('voices',      'voice',      seedVoices);
  await run('pricing',     'pricing',    seedPricing);
  await run('news',        'news',       seedNews);
  await run('glossary',    'glossary',   seedGlossary);
  return out;
}

// Allow `node server/db/seed.js` to force-reseed from the CLI.
if (import.meta.url === toFileUrl(process.argv[1] || '')) {
  seedAll().then((r) => {
    console.log('[seed] complete:', r);
    process.exit(0);
  }).catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  });
}
