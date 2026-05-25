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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

  // First-boot seed: if no snapshots exist, run a refresh in the background
  // so the next /api/competitors call returns live data.
  const existing = await listSnapshots();
  if (existing.length === 0) {
    console.log('[boot] no snapshots found — kicking off initial refresh');
    refreshAllSources().catch(err => console.error('[boot] initial refresh failed:', err.message));
  } else {
    console.log(`[boot] ${existing.length} snapshot(s) loaded`);
  }
});
