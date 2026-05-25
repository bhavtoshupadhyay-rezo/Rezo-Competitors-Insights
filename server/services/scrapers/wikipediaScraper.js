import axios from 'axios';
import pLimit from 'p-limit';

const limit = pLimit(3);

async function fetchSummary(slug) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'rezo-competitor-insights/1.0 (product@rezo.ai)' },
    timeout: 8000,
  });
  return data;
}

async function fetchInfobox(slug) {
  // Pulls the lightweight HTML version of the page and looks for the
  // infobox values we care about (employees, headquarters, founded).
  const url = `https://en.wikipedia.org/w/api.php`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'rezo-competitor-insights/1.0 (product@rezo.ai)' },
    params: {
      action: 'parse',
      page: slug,
      prop: 'wikitext',
      format: 'json',
      formatversion: 2,
    },
    timeout: 8000,
  });
  const wikitext = data?.parse?.wikitext;
  if (!wikitext || typeof wikitext !== 'string') return {};
  const match = (key) => {
    const re = new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n|]+)`, 'i');
    const m = wikitext.match(re);
    return m ? m[1].trim().replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1').replace(/<[^>]+>/g, '').trim() : null;
  };
  return {
    employees: match('num_employees'),
    headquarters: match('hq_location') || match('hq_location_city'),
    founded: match('foundation') || match('founded'),
    industry: match('industry'),
    revenue: match('revenue'),
    keyPeople: match('key_people'),
  };
}

export async function scrapeWikipediaForCompetitors(registry) {
  const result = {};

  await Promise.all(
    Object.entries(registry).map(([id, cfg]) =>
      limit(async () => {
        if (!cfg.wikipedia) {
          result[id] = null;
          return;
        }
        try {
          const [summary, infobox] = await Promise.all([
            fetchSummary(cfg.wikipedia).catch(() => null),
            fetchInfobox(cfg.wikipedia).catch(() => ({})),
          ]);
          if (!summary) {
            result[id] = null;
            return;
          }
          result[id] = {
            slug: cfg.wikipedia,
            title: summary.title,
            extract: summary.extract,
            url: summary.content_urls?.desktop?.page,
            thumbnail: summary.thumbnail?.source,
            updatedAt: summary.timestamp,
            infobox,
          };
        } catch (err) {
          result[id] = { error: err.message };
        }
      })
    )
  );

  return result;
}
