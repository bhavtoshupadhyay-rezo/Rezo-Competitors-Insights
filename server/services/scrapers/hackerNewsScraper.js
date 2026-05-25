import axios from 'axios';
import pLimit from 'p-limit';

const HN_API = 'https://hn.algolia.com/api/v1/search_by_date';
const limit = pLimit(3);

async function searchHN(query) {
  const { data } = await axios.get(HN_API, {
    params: {
      query,
      tags: 'story',
      hitsPerPage: 20,
      numericFilters: `created_at_i>${Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90}`,
    },
    timeout: 8000,
  });
  return data?.hits || [];
}

export async function scrapeHackerNewsForCompetitors(registry) {
  const result = {};

  await Promise.all(
    Object.entries(registry).map(([id, cfg]) =>
      limit(async () => {
        if (!cfg.hnQuery) {
          result[id] = null;
          return;
        }
        try {
          const hits = await searchHN(cfg.hnQuery);
          const stories = hits
            .filter(h => h.title)
            .map(h => ({
              title: h.title,
              url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
              points: h.points || 0,
              comments: h.num_comments || 0,
              author: h.author,
              createdAt: h.created_at,
            }));
          const totalPoints = stories.reduce((sum, s) => sum + s.points, 0);
          result[id] = {
            query: cfg.hnQuery,
            mentionsLast90d: stories.length,
            totalPoints,
            topStories: stories
              .slice()
              .sort((a, b) => b.points - a.points)
              .slice(0, 5),
          };
        } catch (err) {
          result[id] = { error: err.message };
        }
      })
    )
  );

  return result;
}
