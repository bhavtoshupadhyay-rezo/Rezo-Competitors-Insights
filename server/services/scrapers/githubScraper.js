import axios from 'axios';
import pLimit from 'p-limit';

const GITHUB_API = 'https://api.github.com';
const HEADERS = {
  'User-Agent': 'rezo-competitor-insights',
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const limit = pLimit(3);

async function fetchOrgRepos(org) {
  try {
    const { data } = await axios.get(`${GITHUB_API}/orgs/${encodeURIComponent(org)}/repos`, {
      headers: HEADERS,
      params: { per_page: 50, sort: 'updated', direction: 'desc' },
      timeout: 8000,
    });
    return data;
  } catch (err) {
    // 404 for missing orgs is expected — registry entries are guesses
    if (err.response?.status === 404) return [];
    throw err;
  }
}

export async function scrapeGithubForCompetitors(registry) {
  const result = {};

  await Promise.all(
    Object.entries(registry).map(([id, cfg]) =>
      limit(async () => {
        const orgs = cfg.githubOrgs || [];
        if (orgs.length === 0) {
          result[id] = null;
          return;
        }
        try {
          const allRepos = [];
          for (const org of orgs) {
            const repos = await fetchOrgRepos(org);
            allRepos.push(...repos);
          }
          if (allRepos.length === 0) {
            result[id] = null;
            return;
          }
          const totalStars = allRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
          const totalForks = allRepos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
          const mostRecent = allRepos
            .slice()
            .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))[0];
          const topRepos = allRepos
            .slice()
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 5)
            .map(r => ({
              name: r.name,
              fullName: r.full_name,
              url: r.html_url,
              stars: r.stargazers_count || 0,
              forks: r.forks_count || 0,
              language: r.language,
              description: r.description,
              updatedAt: r.pushed_at,
            }));
          result[id] = {
            orgs,
            repoCount: allRepos.length,
            totalStars,
            totalForks,
            lastPushAt: mostRecent?.pushed_at || null,
            topRepos,
          };
        } catch (err) {
          result[id] = { error: err.message };
        }
      })
    )
  );

  return result;
}
