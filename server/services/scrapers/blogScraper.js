import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';

const limit = pLimit(3);

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; RezoInsightsBot/1.0; +https://rezo.ai)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// Best-effort parser: looks for <article> or article-card-like elements,
// extracts headline + link + dates. Bails out cleanly if site shape is
// unfamiliar — the scraper is allowed to return zero posts.
function extractPosts($, baseUrl) {
  const posts = [];
  const seen = new Set();

  // 1. JSON-LD BlogPosting / Article — most reliable when present
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).contents().text());
      const items = Array.isArray(json) ? json : [json];
      for (const item of items) {
        if (!item) continue;
        const graph = item['@graph'] || [item];
        for (const node of graph) {
          const type = node['@type'];
          if (type && /BlogPosting|Article|NewsArticle/i.test(String(type))) {
            const url = node.url || node['@id'];
            if (!url || seen.has(url)) continue;
            seen.add(url);
            posts.push({
              title: node.headline || node.name,
              url,
              publishedAt: node.datePublished || node.dateCreated || null,
              summary: node.description || null,
              source: 'ld+json',
            });
          }
        }
      }
    } catch {
      // ignore non-JSON or malformed blocks
    }
  });

  if (posts.length >= 3) return posts.slice(0, 10);

  // 2. <article> tags with an anchor + heading
  $('article').each((_, el) => {
    const $el = $(el);
    const $a = $el.find('a[href]').first();
    const href = $a.attr('href');
    if (!href) return;
    const absUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString();
    if (seen.has(absUrl)) return;
    const title = $el.find('h1, h2, h3').first().text().trim() || $a.text().trim();
    const time = $el.find('time').attr('datetime') || $el.find('time').text().trim() || null;
    if (title) {
      seen.add(absUrl);
      posts.push({ title, url: absUrl, publishedAt: time, summary: null, source: 'article-tag' });
    }
  });

  if (posts.length >= 3) return posts.slice(0, 10);

  // 3. Anchor-heuristic: anchors whose path looks like /blog/<slug>
  const host = new URL(baseUrl).host;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const absUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString();
    if (seen.has(absUrl)) return;
    let parsed;
    try { parsed = new URL(absUrl); } catch { return; }
    if (parsed.host !== host) return;
    if (!/\/(blog|news|posts|insights|articles)\//i.test(parsed.pathname)) return;
    if (parsed.pathname.split('/').filter(Boolean).length < 2) return;
    const title = $(el).text().trim();
    if (!title || title.length < 12 || title.length > 200) return;
    seen.add(absUrl);
    posts.push({ title, url: absUrl, publishedAt: null, summary: null, source: 'anchor-heuristic' });
  });

  return posts.slice(0, 10);
}

export async function scrapeBlogsForCompetitors(registry) {
  const result = {};

  await Promise.all(
    Object.entries(registry).map(([id, cfg]) =>
      limit(async () => {
        if (!cfg.blogUrl) {
          result[id] = null;
          return;
        }
        try {
          const { data: html, status } = await axios.get(cfg.blogUrl, {
            headers: HEADERS,
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: s => s < 500,
          });
          if (status >= 400 || typeof html !== 'string') {
            result[id] = { url: cfg.blogUrl, status, posts: [] };
            return;
          }
          const $ = cheerio.load(html);
          const posts = extractPosts($, cfg.blogUrl);
          result[id] = {
            url: cfg.blogUrl,
            postCount: posts.length,
            posts,
          };
        } catch (err) {
          result[id] = { url: cfg.blogUrl, error: err.message, posts: [] };
        }
      })
    )
  );

  return result;
}
