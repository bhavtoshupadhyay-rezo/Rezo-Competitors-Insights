import { competitorRegistry } from '../competitorRegistry.js';
import { scrapeGithubForCompetitors } from './githubScraper.js';
import { scrapeHackerNewsForCompetitors } from './hackerNewsScraper.js';
import { scrapeWikipediaForCompetitors } from './wikipediaScraper.js';
import { scrapeBlogsForCompetitors } from './blogScraper.js';
import { scrapeHuggingFaceVoices } from './huggingFaceScraper.js';
import { discoverNewEntrants } from './newEntrantScraper.js';
import { saveSnapshot, loadSnapshot } from '../snapshotStore.js';

export const SOURCES = ['github', 'hackernews', 'wikipedia', 'blogs', 'huggingface', 'entrants'];

const SOURCE_RUNNERS = {
  github: () => scrapeGithubForCompetitors(competitorRegistry),
  hackernews: () => scrapeHackerNewsForCompetitors(competitorRegistry),
  wikipedia: () => scrapeWikipediaForCompetitors(competitorRegistry),
  blogs: () => scrapeBlogsForCompetitors(competitorRegistry),
  huggingface: () => scrapeHuggingFaceVoices(),
  entrants: () => discoverNewEntrants({ maxAgeDays: 365 }),
};

const SNAPSHOT_NAMES = {
  github: 'competitors-github',
  hackernews: 'competitors-hackernews',
  wikipedia: 'competitors-wikipedia',
  blogs: 'competitors-blogs',
  huggingface: 'voices-huggingface',
  entrants: 'new-entrants',
};

// Small diff summary so the UI can show "X new posts, Y new HN stories"
// after a refresh — works for both per-competitor maps and the entrants
// aggregate payload.
export function diffSnapshots(source, prev, next) {
  if (!prev || !next) return null;
  if (source === 'entrants') {
    const prevIds = new Set((prev.payload?.candidates || []).map(c => c.id));
    const newOnes = (next.payload?.candidates || []).filter(c => !prevIds.has(c.id));
    return { newCandidates: newOnes.length, sampleNames: newOnes.slice(0, 5).map(c => c.name) };
  }
  if (source === 'huggingface') {
    const prevCreators = prev.payload?.creators || {};
    const nextCreators = next.payload?.creators || {};
    let likeDelta = 0;
    let modelDelta = 0;
    for (const [name, cur] of Object.entries(nextCreators)) {
      const old = prevCreators[name];
      if (!cur || !old) continue;
      likeDelta += (cur.totalLikes || 0) - (old.totalLikes || 0);
      modelDelta += (cur.totalModels || 0) - (old.totalModels || 0);
    }
    return { likeDelta, modelDelta };
  }
  // Per-competitor maps (github, hackernews, wikipedia, blogs)
  let starDelta = 0, mentionDelta = 0, newPosts = 0;
  for (const [id, cur] of Object.entries(next.payload || {})) {
    const old = (prev.payload || {})[id];
    if (!cur || !old) continue;
    if (source === 'github') {
      starDelta += (cur.totalStars || 0) - (old.totalStars || 0);
    } else if (source === 'hackernews') {
      mentionDelta += (cur.mentionsLast90d || 0) - (old.mentionsLast90d || 0);
    } else if (source === 'blogs') {
      const prevUrls = new Set((old.posts || []).map(p => p.url));
      newPosts += (cur.posts || []).filter(p => !prevUrls.has(p.url)).length;
    }
  }
  if (source === 'github') return { starDelta };
  if (source === 'hackernews') return { mentionDelta };
  if (source === 'blogs') return { newPosts };
  return null;
}

export async function refreshSource(source) {
  const runner = SOURCE_RUNNERS[source];
  if (!runner) throw new Error(`Unknown source: ${source}`);
  const started = Date.now();
  console.log(`[scrapers] refresh start: ${source}`);
  const prev = await loadSnapshot(SNAPSHOT_NAMES[source]);
  const payload = await runner();
  const next = await saveSnapshot(SNAPSHOT_NAMES[source], payload);
  const durationMs = Date.now() - started;
  const diff = diffSnapshots(source, prev, next);
  console.log(`[scrapers] refresh done: ${source} in ${durationMs}ms${diff ? ' diff=' + JSON.stringify(diff) : ''}`);
  return { ...next, source, durationMs, diff };
}

export async function refreshAllSources({ parallel = true } = {}) {
  const started = Date.now();
  const results = {};
  if (parallel) {
    await Promise.all(
      SOURCES.map(async (source) => {
        try {
          results[source] = await refreshSource(source);
        } catch (err) {
          console.error(`[scrapers] ${source} failed:`, err.message);
          results[source] = { source, error: err.message };
        }
      })
    );
  } else {
    for (const source of SOURCES) {
      try {
        results[source] = await refreshSource(source);
      } catch (err) {
        console.error(`[scrapers] ${source} failed:`, err.message);
        results[source] = { source, error: err.message };
      }
    }
  }
  const totalDurationMs = Date.now() - started;
  console.log(`[scrapers] all sources finished in ${totalDurationMs}ms`);
  return {
    startedAt: new Date(started).toISOString(),
    finishedAt: new Date().toISOString(),
    totalDurationMs,
    results,
  };
}

export function snapshotNameForSource(source) {
  return SNAPSHOT_NAMES[source];
}
