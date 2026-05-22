import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { refreshCompetitorData } from './services/dataRefreshService.js';
import { fetchLiveNews } from './services/newsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const PORT          = process.env.PORT || 3001;
const SITE_PASSWORD = process.env.SITE_PASSWORD; // unset = no auth (dev / fully-open mode)
const NODE_ENV      = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

// ────────── Optional Basic Auth gate ──────────
// If SITE_PASSWORD is set, every request requires `admin / <SITE_PASSWORD>`.
// Health check is always reachable so platform health probes don't break.
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Refresh competitor data endpoint
app.post('/api/refresh-data', async (req, res) => {
  try {
    console.log('Starting data refresh...');
    const updatedData = await refreshCompetitorData();
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString(),
      data: updatedData
    });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh data',
      error: error.message
    });
  }
});

// Get latest competitor updates
app.get('/api/competitor-updates', async (req, res) => {
  try {
    const updates = await refreshCompetitorData();
    res.json({
      success: true,
      data: updates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI News — live RSS aggregation
//   GET  /api/news          — returns latest filtered AI/voice headlines (15-min cache)
//   POST /api/news/refresh  — bypass cache and refetch all feeds now
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
    console.log('Force-refreshing news feeds…');
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
// In production we serve the Vite-built frontend from `/dist` so a single
// service hosts both API + UI on one URL. In dev we let Vite handle the UI
// on :5173 and just proxy /api/* here.
if (NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback — any non-/api route returns index.html so client-side
  // routing keeps working on hard-refresh.
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log(`📦 Serving built frontend from ${distPath}`);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (${NODE_ENV})`);
});
