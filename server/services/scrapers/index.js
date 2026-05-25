import { competitorRegistry } from '../competitorRegistry.js';
import { scrapeGithubForCompetitors } from './githubScraper.js';
import { scrapeHackerNewsForCompetitors } from './hackerNewsScraper.js';
import { scrapeWikipediaForCompetitors } from './wikipediaScraper.js';
import { scrapeBlogsForCompetitors } from './blogScraper.js';
import { scrapeHuggingFaceVoices } from './huggingFaceScraper.js';
import { saveSnapshot } from '../snapshotStore.js';

export const SOURCES = ['github', 'hackernews', 'wikipedia', 'blogs', 'huggingface'];

const SOURCE_RUNNERS = {
  github: () => scrapeGithubForCompetitors(competitorRegistry),
  hackernews: () => scrapeHackerNewsForCompetitors(competitorRegistry),
  wikipedia: () => scrapeWikipediaForCompetitors(competitorRegistry),
  blogs: () => scrapeBlogsForCompetitors(competitorRegistry),
  huggingface: () => scrapeHuggingFaceVoices(),
};

const SNAPSHOT_NAMES = {
  github: 'competitors-github',
  hackernews: 'competitors-hackernews',
  wikipedia: 'competitors-wikipedia',
  blogs: 'competitors-blogs',
  huggingface: 'voices-huggingface',
};

export async function refreshSource(source) {
  const runner = SOURCE_RUNNERS[source];
  if (!runner) throw new Error(`Unknown source: ${source}`);
  const started = Date.now();
  console.log(`[scrapers] refresh start: ${source}`);
  const payload = await runner();
  const snap = await saveSnapshot(SNAPSHOT_NAMES[source], payload);
  console.log(`[scrapers] refresh done: ${source} in ${Date.now() - started}ms`);
  return snap;
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
          results[source] = { error: err.message };
        }
      })
    );
  } else {
    for (const source of SOURCES) {
      try {
        results[source] = await refreshSource(source);
      } catch (err) {
        console.error(`[scrapers] ${source} failed:`, err.message);
        results[source] = { error: err.message };
      }
    }
  }
  console.log(`[scrapers] all sources finished in ${Date.now() - started}ms`);
  return { startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), results };
}

export function snapshotNameForSource(source) {
  return SNAPSHOT_NAMES[source];
}
