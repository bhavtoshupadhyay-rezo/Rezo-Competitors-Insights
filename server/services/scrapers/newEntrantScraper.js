// New-entrant discovery: combines real-time signals from Hacker News
// "Show HN" stories, GitHub repo search, and Product Hunt's Atom feed.
// Cross-references findings against the tracked competitor registry to
// flag (but not drop) companies already on the radar.

import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import { competitorRegistry } from '../competitorRegistry.js';

const limit = pLimit(4);

const HN_QUERIES = [
  'Show HN voice agent',
  'Show HN voice ai',
  'Show HN voicebot',
  'Show HN tts',
  'Show HN ivr',
  'Show HN call center ai',
  'Show HN ai phone',
];

const GITHUB_QUERIES = [
  'topic:voice-agent stars:>5',
  'topic:voice-ai stars:>5',
  'topic:tts stars:>20',
  'topic:speech-to-text stars:>20',
  'topic:conversational-ai stars:>10',
];

const PRODUCT_HUNT_FEED = 'https://www.producthunt.com/feed';

// Tight allowlist — "call" and "phone" alone are too broad, so we require
// they be paired with AI/voice/center context. "agent" alone is also too
// noisy; we only accept it next to voice/AI/phone.
const VOICE_KEYWORDS = /\b(voice\s+(ai|agent|bot|assistant|first)|voicebot|tts|text[- ]to[- ]speech|speech[- ](synthesis|recognition)|ivr|stt|asr|conversational\s+ai|call[- ]center\s+(ai|automation)|ai\s+(phone|caller|dialer|receptionist)|dialer|telephony\s+ai|speech\s+ai)\b/i;

const TRACKED_DOMAINS = new Set();
const TRACKED_NAMES = new Set();
for (const [, cfg] of Object.entries(competitorRegistry)) {
  if (cfg.website) {
    try { TRACKED_DOMAINS.add(new URL(cfg.website).host.replace(/^www\./, '')); } catch { /* ignore */ }
  }
  TRACKED_NAMES.add(normaliseName(cfg.name));
}

function normaliseName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|labs|technologies|software|ai|technology)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function safeHost(url) {
  if (!url) return null;
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return null; }
}

function dedupeKey(name, url) {
  const host = safeHost(url);
  if (host) return `host:${host}`;
  return `name:${normaliseName(name)}`;
}

async function fromHackerNews(maxAgeDays = 365) {
  const cutoff = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * maxAgeDays;
  const all = [];
  await Promise.all(
    HN_QUERIES.map(q =>
      limit(async () => {
        try {
          const { data } = await axios.get('https://hn.algolia.com/api/v1/search_by_date', {
            params: {
              query: q,
              tags: 'story',
              hitsPerPage: 30,
              numericFilters: `created_at_i>${cutoff}`,
            },
            timeout: 8000,
          });
          for (const hit of data.hits || []) {
            if (!hit.title) continue;
            if (!hit.title.toLowerCase().startsWith('show hn')) continue;
            if (!VOICE_KEYWORDS.test(hit.title)) continue;
            const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
            const cleanTitle = hit.title.replace(/^Show HN:\s*/i, '').trim();
            const namePart = cleanTitle.split(/[–—\-:|]/)[0].trim();
            all.push({
              name: namePart || cleanTitle.slice(0, 40),
              description: cleanTitle,
              url,
              source: 'hackernews',
              sourceUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
              points: hit.points || 0,
              createdAt: hit.created_at,
              query: q,
            });
          }
        } catch (err) {
          console.warn(`[entrants/hn] ${q}: ${err.message}`);
        }
      })
    )
  );
  return all;
}

async function fromGitHub(maxAgeDays = 365) {
  const since = new Date(Date.now() - maxAgeDays * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const headers = {
    'User-Agent': 'rezo-competitor-insights',
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const all = [];
  await Promise.all(
    GITHUB_QUERIES.map(q =>
      limit(async () => {
        try {
          const { data } = await axios.get('https://api.github.com/search/repositories', {
            params: {
              q: `${q} pushed:>${since}`,
              sort: 'stars',
              order: 'desc',
              per_page: 20,
            },
            headers,
            timeout: 10000,
          });
          for (const r of data.items || []) {
            if (!VOICE_KEYWORDS.test(`${r.name} ${r.description || ''}`)) continue;
            if (r.fork || r.archived) continue;
            // Prefer the project's own domain if available (vendor site),
            // otherwise fall back to the GitHub repo URL. Use repo name
            // rather than org login so "vapi-server" beats "VapiAI".
            const displayName = r.name && r.name.length > 2
              ? r.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              : (r.owner?.login || r.full_name);
            all.push({
              name: displayName,
              fullName: r.full_name,
              description: r.description || r.full_name,
              url: r.homepage || r.html_url,
              source: 'github',
              sourceUrl: r.html_url,
              stars: r.stargazers_count || 0,
              createdAt: r.created_at,
              pushedAt: r.pushed_at,
              query: q,
            });
          }
        } catch (err) {
          console.warn(`[entrants/github] ${q}: ${err.message}`);
        }
      })
    )
  );
  return all;
}

async function fromProductHunt(maxAgeDays = 90) {
  try {
    const { data: xml } = await axios.get(PRODUCT_HUNT_FEED, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RezoInsightsBot/1.0)' },
      timeout: 10000,
    });
    const $ = cheerio.load(xml, { xmlMode: true });
    const cutoff = Date.now() - maxAgeDays * 24 * 3600 * 1000;
    const items = [];
    $('entry').each((_, el) => {
      const $el = $(el);
      const title = $el.find('title').first().text().trim();
      const link = $el.find('link').first().attr('href');
      const published = $el.find('published').first().text().trim();
      const summary = $el.find('summary').first().text().trim() || $el.find('content').first().text().trim();
      if (!title || !VOICE_KEYWORDS.test(`${title} ${summary}`)) return;
      const ts = published ? new Date(published).getTime() : 0;
      if (ts && ts < cutoff) return;
      items.push({
        name: title.split(/[–—\-:|]/)[0].trim() || title,
        description: summary.slice(0, 250) || title,
        url: link,
        source: 'producthunt',
        sourceUrl: link,
        createdAt: published,
      });
    });
    return items;
  } catch (err) {
    console.warn(`[entrants/ph] ${err.message}`);
    return [];
  }
}

function scoreEntry(entry) {
  let score = 30;
  if (entry.source === 'hackernews') score += Math.min(40, (entry.points || 0));
  if (entry.source === 'github') score += Math.min(40, Math.log10((entry.stars || 0) + 1) * 12);
  if (entry.source === 'producthunt') score += 25;
  return Math.round(score);
}

export async function discoverNewEntrants({ keyword, category, maxAgeDays = 365 } = {}) {
  const started = Date.now();
  const [hn, gh, ph] = await Promise.all([
    fromHackerNews(maxAgeDays),
    fromGitHub(maxAgeDays),
    fromProductHunt(Math.min(maxAgeDays, 180)),
  ]);

  const merged = new Map();
  for (const entry of [...hn, ...gh, ...ph]) {
    const key = dedupeKey(entry.name, entry.url);
    const existing = merged.get(key);
    if (existing) {
      existing.signals.push(entry);
      if (entry.createdAt && (!existing.firstSeen || entry.createdAt < existing.firstSeen)) {
        existing.firstSeen = entry.createdAt;
      }
    } else {
      merged.set(key, {
        id: key,
        name: entry.name,
        description: entry.description,
        url: entry.url,
        firstSeen: entry.createdAt || null,
        signals: [entry],
      });
    }
  }

  const candidates = [];
  for (const c of merged.values()) {
    const host = safeHost(c.url);
    const normName = normaliseName(c.name);
    const alreadyTracked =
      (host && TRACKED_DOMAINS.has(host)) ||
      (normName && TRACKED_NAMES.has(normName));

    const sources = new Set(c.signals.map(s => s.source));
    const baseScore = Math.max(...c.signals.map(scoreEntry));
    const signalBoost = (sources.size - 1) * 15;
    const recencyBoost = c.firstSeen
      ? Math.max(0, 20 - Math.floor((Date.now() - new Date(c.firstSeen).getTime()) / (1000 * 60 * 60 * 24)) / 18)
      : 0;
    const score = Math.min(100, Math.round(baseScore + signalBoost + recencyBoost));

    candidates.push({
      ...c,
      sources: Array.from(sources),
      signalCount: c.signals.length,
      score,
      alreadyTracked,
      host,
    });
  }

  let filtered = candidates;
  if (keyword) {
    const q = String(keyword).toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.host || '').includes(q)
    );
  }
  if (category && category !== 'All') {
    const cat = category.toLowerCase();
    filtered = filtered.filter(c =>
      (c.description || '').toLowerCase().includes(cat) ||
      c.name.toLowerCase().includes(cat)
    );
  }

  filtered.sort((a, b) => b.score - a.score);

  return {
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    counts: {
      hackernews: hn.length,
      github: gh.length,
      producthunt: ph.length,
      uniqueCandidates: candidates.length,
      returned: filtered.length,
      alreadyTracked: filtered.filter(c => c.alreadyTracked).length,
    },
    filters: { keyword: keyword || null, category: category || null, maxAgeDays },
    candidates: filtered.slice(0, 60),
  };
}
