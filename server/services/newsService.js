// Live AI news fetcher — pulls RSS feeds, filters for voice / AI / contact-center
// signal, and returns a uniform JSON shape that the frontend can render alongside
// the seeded editorial data.
//
// Strategy:
//   1. Parallel fetch from multiple curated RSS sources
//   2. Filter on a keyword whitelist (voice, AI, agent, TTS, ASR, etc.)
//   3. Auto-tag category (funding / launch / partnership / etc.) from title heuristics
//   4. Auto-tag affected parameters (funding, features, compliance, etc.)
//   5. Cache results in-memory for 15 minutes — protects feeds + speeds up refresh

import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RezoCompetitorIntelBot/1.0)',
  },
});

// Curated feeds — each one's signal-to-noise has been vetted for AI / voice
const FEEDS = [
  { source: 'TechCrunch',   region: 'Global', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { source: 'VentureBeat',  region: 'Global', url: 'https://venturebeat.com/category/ai/feed/' },
  { source: 'The Verge',    region: 'Global', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { source: 'MIT Tech Rev', region: 'Global', url: 'https://www.technologyreview.com/feed/' },
  { source: 'Hacker News',  region: 'Global', url: 'https://hnrss.org/frontpage' },
  { source: 'Inc42',        region: 'India',  url: 'https://inc42.com/feed/' },
  { source: 'YourStory',    region: 'India',  url: 'https://yourstory.com/feed' },
];

// Whitelist — story must contain at least one of these to be included
const SIGNAL_KEYWORDS = [
  'voice ai', 'voice agent', 'voice bot', 'voicebot', 'tts', 'text to speech',
  'speech to text', 'asr', 'speech recognition', 'conversational ai',
  'contact center', 'call center', 'ivr', 'agent assist',
  'elevenlabs', 'eleven labs', 'openai', 'anthropic', 'cartesia', 'deepgram',
  'play.ht', 'playht', 'hume', 'resemble', 'rime ai',
  'sarvam', 'ai4bharat', 'krutrim', 'reverie', 'gnani', 'bhashini',
  'observe.ai', 'observe ai', 'level ai', 'yellow.ai', 'yellow ai', 'uniphore',
  'bland ai', 'vapi', 'retell', 'corover', 'rezo',
  'llm', 'gpt-4', 'gpt-5', 'claude', 'gemini',
];

// Category heuristics — first match wins
const CATEGORY_RULES = [
  { id: 'funding',        patterns: [/raises?\s+\$/i, /series\s+[a-e]/i, /funding/i, /seed round/i, /valuation/i, /valued at/i] },
  { id: 'acquisition',    patterns: [/acquires?/i, /acquisition/i, /\bm&a\b/i, /buyout/i] },
  { id: 'partnership',    patterns: [/partners?\s+with/i, /partnership/i, /integrat(es?|ion)/i, /\bdeal\b/i] },
  { id: 'compliance',     patterns: [/soc\s*2/i, /hipaa/i, /gdpr/i, /iso\s*27001/i, /fedramp/i, /compliance/i, /\bdpdp\b/i, /certification/i] },
  { id: 'pricing',        patterns: [/pricing/i, /price cut/i, /free tier/i, /reduces?\s+pricing/i, /per\s+minute/i] },
  { id: 'new_entrant',    patterns: [/launches?\s+(.*)stealth/i, /emerges? from stealth/i, /\bdebut(s|ed)?\b/i] },
  { id: 'market',         patterns: [/gartner/i, /forrester/i, /idc\s+report/i, /market share/i, /benchmark/i, /report ranks?/i] },
  { id: 'feature_launch', patterns: [/launches?/i, /releases?/i, /unveil(s|ed)?/i, /announces?/i, /\bv\d+\b/i, /\b2\.0\b/i, /\b3\.0\b/i] },
];

// Parameter heuristics — multiple can match
const PARAMETER_RULES = [
  { id: 'funding',      patterns: [/raises?/i, /series\s+[a-e]/i, /funding/i, /valuation/i, /investment/i] },
  { id: 'features',     patterns: [/launches?/i, /releases?/i, /unveil/i, /feature/i, /\bapi\b/i, /\bv\d+\b/i] },
  { id: 'compliance',   patterns: [/soc\s*2/i, /hipaa/i, /gdpr/i, /iso/i, /fedramp/i, /dpdp/i, /compliance/i] },
  { id: 'partnerships', patterns: [/partners?\s+with/i, /partnership/i, /integrat/i] },
  { id: 'pricing',      patterns: [/pricing/i, /price/i, /free tier/i, /per minute/i] },
  { id: 'languages',    patterns: [/multilingual/i, /indic/i, /hindi/i, /tamil/i, /vernacular/i, /language support/i] },
  { id: 'market',       patterns: [/gartner/i, /forrester/i, /market share/i, /leader/i, /quadrant/i] },
  { id: 'people',       patterns: [/hires?/i, /appoints?/i, /\bcoo\b/i, /\bcfo\b/i, /\bceo\b/i, /joins?/i] },
];

const inferImpact = (text) => {
  if (/\$[0-9]+\s*[bm]illion|\bgartner\b|magic quadrant|acquisition/i.test(text)) return 'high';
  if (/\bseries\s+[a-e]\b|partnership|launches?|releases?|compliance/i.test(text))  return 'medium';
  return 'low';
};

const inferRegion = (text, fallback) => {
  if (/\bindia\b|indic|hindi|tamil|telugu|bharat|inc42|yourstory|sarvam|krutrim|reverie|gnani|bhashini/i.test(text)) return 'India';
  if (/\beurope\b|\beu\b|gdpr/i.test(text)) return 'Europe';
  if (/\bus\b|\bunited states\b|silicon valley|sec\b/i.test(text))                      return 'US';
  return fallback || 'Global';
};

const inferCategory = (text) => {
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule.id;
  }
  return 'feature_launch';
};

const inferParameters = (text) => {
  const params = [];
  for (const rule of PARAMETER_RULES) {
    if (rule.patterns.some((p) => p.test(text))) params.push(rule.id);
  }
  return params.length ? params : ['market'];
};

const matchesSignal = (text) => {
  const lower = text.toLowerCase();
  return SIGNAL_KEYWORDS.some((kw) => lower.includes(kw));
};

const stripHtml = (html = '') =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 280);

// In-memory cache so repeated /api/news calls don't slam the feeds
let cache = { fetchedAt: 0, items: [], errors: [] };
const CACHE_MS = 15 * 60 * 1000; // 15 min

const fetchOneFeed = async (feed) => {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items || []).map((item) => {
      const text       = `${item.title || ''} ${item.contentSnippet || ''}`;
      const summary    = stripHtml(item.contentSnippet || item.content || '');
      const category   = inferCategory(text);
      const parameters = inferParameters(text);
      return {
        id: `live-${feed.source}-${item.guid || item.link || item.title}`.slice(0, 200),
        title: item.title?.trim() || 'Untitled',
        summary: summary || 'No summary available.',
        source: feed.source,
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category,
        parameters,
        related: [],
        relatedVoices: [],
        impact: inferImpact(text),
        region: inferRegion(text, feed.region),
        url: item.link,
        live: true,
      };
    });
  } catch (err) {
    return { __error: { source: feed.source, message: err.message } };
  }
};

export const fetchLiveNews = async ({ force = false } = {}) => {
  const now = Date.now();
  if (!force && cache.items.length && now - cache.fetchedAt < CACHE_MS) {
    return { items: cache.items, fetchedAt: cache.fetchedAt, cached: true, errors: cache.errors };
  }

  const results = await Promise.all(FEEDS.map(fetchOneFeed));

  const items  = [];
  const errors = [];
  for (const r of results) {
    if (Array.isArray(r)) items.push(...r);
    else if (r?.__error) errors.push(r.__error);
  }

  // Filter on signal keywords
  const filtered = items.filter((it) => matchesSignal(`${it.title} ${it.summary}`));

  // Dedupe by title
  const seen = new Set();
  const deduped = filtered.filter((it) => {
    const key = it.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort newest first, keep last 60 days
  const cutoff = now - 60 * 24 * 60 * 60 * 1000;
  const final = deduped
    .filter((it) => new Date(it.publishedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 50);

  cache = { fetchedAt: now, items: final, errors };
  return { items: final, fetchedAt: now, cached: false, errors };
};
