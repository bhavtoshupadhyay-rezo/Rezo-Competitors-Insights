import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchLiveNews } from './services/newsService.js';
import {
  refreshSource,
  refreshAllSources,
  SOURCES,
  snapshotNameForSource,
} from './services/scrapers/index.js';
import { listSnapshots, loadSnapshot, ageMs } from './services/snapshotStore.js';
import { competitorRegistry } from './services/competitorRegistry.js';
import { count } from './db/db.js';
import { seedIfEmpty } from './db/seed.js';
import { makeCrudRouter } from './routes/crud.js';
import competitorSchema from './schemas/competitor.schema.json' with { type: 'json' };
import voiceSchema      from './schemas/voice.schema.json'      with { type: 'json' };
import pricingSchema    from './schemas/pricing.schema.json'    with { type: 'json' };
import newsSchema       from './schemas/news.schema.json'       with { type: 'json' };
import glossarySchema   from './schemas/glossary.schema.json'   with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const PORT          = process.env.PORT || 3001;
const SITE_PASSWORD = process.env.SITE_PASSWORD;
const NODE_ENV      = process.env.NODE_ENV || 'development';

// Threshold above which we kick off a background refresh on read.
const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 12; // 12 hours

app.use(cors());
app.use(express.json());

// ────────── Optional Basic Auth gate ──────────
if (SITE_PASSWORD) {
  app.use((req, res, next) => {
    if (req.path === '/api/health') return next();
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Basic ')) {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      const idx = decoded.indexOf(':');
      const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
      if (pass === SITE_PASSWORD) return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="Rezo Intelligence Hub"');
    res.status(401).send('Authentication required');
  });
  console.log('🔒 Site password protection enabled');
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: {
      competitors: count('competitor'),
      voices:      count('voice'),
      pricing:     count('pricing'),
      news:        count('news'),
      glossary:    count('glossary'),
    },
  });
});

// ────────── CRUD over the structured DB ──────────
// Mounted under /api/db/* so they don't collide with /api/competitors which
// returns scraped enrichment data (GitHub stars, HN mentions, etc.).
app.use('/api/db/competitors', makeCrudRouter('competitor', competitorSchema));
app.use('/api/db/voices',      makeCrudRouter('voice',      voiceSchema));
app.use('/api/db/pricing',     makeCrudRouter('pricing',    pricingSchema));
app.use('/api/db/news',        makeCrudRouter('news',       newsSchema));
app.use('/api/db/glossary',    makeCrudRouter('glossary',   glossarySchema));

// ────────── Live competitor enrichments ──────────
// Returns per-competitor data merged from all source snapshots.
// Frontend merges this on top of its static seed data.
app.get('/api/competitors', async (req, res) => {
  try {
    const [github, hn, wiki, blogs] = await Promise.all([
      loadSnapshot(snapshotNameForSource('github')),
      loadSnapshot(snapshotNameForSource('hackernews')),
      loadSnapshot(snapshotNameForSource('wikipedia')),
      loadSnapshot(snapshotNameForSource('blogs')),
    ]);

    const oldest = [github, hn, wiki, blogs]
      .filter(Boolean)
      .reduce((acc, snap) => Math.max(acc, ageMs(snap)), 0);

    const competitors = Object.keys(competitorRegistry).map((id) => ({
      id,
      name: competitorRegistry[id].name,
      github: github?.payload?.[id] || null,
      hackerNews: hn?.payload?.[id] || null,
      wikipedia: wiki?.payload?.[id] || null,
      blog: blogs?.payload?.[id] || null,
    }));

    if (oldest === 0 || oldest > STALE_THRESHOLD_MS) {
      // Fire-and-forget refresh — first request after a deploy or stale
      // snapshot will return the seed/cached data, the next will be fresh.
      refreshAllSources().catch(err => console.error('[refresh] background failed:', err.message));
    }

    res.json({
      success: true,
      count: competitors.length,
      sources: {
        github:     github?.fetchedAt || null,
        hackernews: hn?.fetchedAt || null,
        wikipedia:  wiki?.fetchedAt || null,
        blogs:      blogs?.fetchedAt || null,
      },
      lastUpdated: [github, hn, wiki, blogs]
        .filter(Boolean)
        .map(s => s.fetchedAt)
        .sort()
        .pop() || null,
      competitors,
    });
  } catch (err) {
    console.error('GET /api/competitors error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ────────── Live voice/HF model enrichments ──────────
app.get('/api/voices', async (req, res) => {
  try {
    const snap = await loadSnapshot(snapshotNameForSource('huggingface'));
    if (!snap || ageMs(snap) > STALE_THRESHOLD_MS) {
      refreshSource('huggingface').catch(err => console.error('[refresh] hf background failed:', err.message));
    }
    res.json({
      success: true,
      lastUpdated: snap?.fetchedAt || null,
      creators: snap?.payload?.creators || {},
      topics:   snap?.payload?.topics   || {},
    });
  } catch (err) {
    console.error('GET /api/voices error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ────────── Manual refresh ──────────
app.post('/api/refresh/:source', async (req, res) => {
  const source = req.params.source;
  if (!SOURCES.includes(source)) {
    return res.status(400).json({ success: false, error: `Unknown source. Use one of: ${SOURCES.join(', ')}` });
  }
  try {
    const snap = await refreshSource(source);
    res.json({ success: true, source, fetchedAt: snap.fetchedAt });
  } catch (err) {
    res.status(500).json({ success: false, source, error: err.message });
  }
});

app.post('/api/refresh-all', async (req, res) => {
  try {
    const report = await refreshAllSources();
    res.json({ success: true, ...report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backwards-compat with the old endpoint name used by older clients.
app.post('/api/refresh-data', async (req, res) => {
  try {
    const report = await refreshAllSources();
    res.json({ success: true, message: 'Data refreshed', ...report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/snapshots', async (req, res) => {
  try {
    const snaps = await listSnapshots();
    res.json({ success: true, snapshots: snaps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ────────── AI News (live RSS) ──────────
app.get('/api/news', async (req, res) => {
  try {
    const result = await fetchLiveNews({ force: false });
    res.json({
      success: true,
      cached: result.cached,
      fetchedAt: new Date(result.fetchedAt).toISOString(),
      count: result.items.length,
      items: result.items,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/news/refresh', async (req, res) => {
  try {
    const result = await fetchLiveNews({ force: true });
    res.json({
      success: true,
      cached: false,
      fetchedAt: new Date(result.fetchedAt).toISOString(),
      count: result.items.length,
      items: result.items,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error refreshing news:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ────────── Static frontend in production ──────────
if (NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log(`📦 Serving built frontend from ${distPath}`);
}

// ────────── Scheduled refreshes ──────────
// Daily competitor refresh: 04:30 IST = 23:00 UTC
cron.schedule('0 23 * * *', () => {
  console.log('[cron] daily competitor refresh');
  refreshAllSources().catch(err => console.error('[cron] failed:', err.message));
});

// Hourly news refresh (RSS is already cached for 15min, this just warms it)
cron.schedule('0 * * * *', () => {
  fetchLiveNews({ force: true }).catch(err => console.error('[cron] news warm failed:', err.message));
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (${NODE_ENV})`);

  // First-boot DB seed: if any table is empty, populate from the static JS
  // modules so the API has something to return. Existing rows are untouched
  // — operator edits persist across restarts.
  try {
    const seeded = await seedIfEmpty();
    const populated = Object.entries(seeded).filter(([, n]) => n > 0);
    if (populated.length) {
      console.log('[boot] seeded DB tables:', populated.map(([k, n]) => `${k}=${n}`).join(', '));
    } else {
      console.log('[boot] DB already populated — skipping seed');
    }
  } catch (err) {
    console.error('[boot] DB seed failed:', err.message);
  }

  // Snapshot refresh path (scraped enrichments) is independent of the DB.
  const existing = await listSnapshots();
  if (existing.length === 0) {
    console.log('[boot] no snapshots found — kicking off initial refresh');
    refreshAllSources().catch(err => console.error('[boot] initial refresh failed:', err.message));
  } else {
    console.log(`[boot] ${existing.length} snapshot(s) loaded`);
  }
});
