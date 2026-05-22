import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Newspaper, Search, ExternalLink, Clock, AlertCircle, TrendingUp,
  DollarSign, Zap, Link2, Shield, Tag, Sparkles, BarChart3, Building2,
  RefreshCw, WifiOff, CheckCircle2, Radio
} from 'lucide-react';
import { aiNewsData, newsCategories, trackedParameters, newsRegions } from '../data/aiNewsData';
import { competitorsData } from '../data/competitorsData';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';

const AUTO_REFRESH_MS = 6 * 60 * 60 * 1000; // 6 hours
const LS_KEY_LAST_FETCH = 'rezo_news_last_fetched_at';

const categoryMeta = {
  funding:        { icon: DollarSign,  color: 'text-success',     bg: 'bg-success/15',     border: 'border-success/30',     label: 'Funding'        },
  feature_launch: { icon: Zap,         color: 'text-accent',      bg: 'bg-accent/15',      border: 'border-accent/30',      label: 'Feature Launch' },
  partnership:    { icon: Link2,   color: 'text-purple-400',  bg: 'bg-purple-500/15',  border: 'border-purple-500/30',  label: 'Partnership'    },
  compliance:     { icon: Shield,      color: 'text-blue-400',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    label: 'Compliance'     },
  pricing:        { icon: Tag,         color: 'text-warning',     bg: 'bg-warning/15',     border: 'border-warning/30',     label: 'Pricing'        },
  new_entrant:    { icon: Sparkles,    color: 'text-pink-400',    bg: 'bg-pink-500/15',    border: 'border-pink-500/30',    label: 'New Entrant'    },
  market:         { icon: BarChart3,   color: 'text-cyan-400',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30',    label: 'Market'         },
  acquisition:    { icon: Building2,   color: 'text-orange-400',  bg: 'bg-orange-500/15',  border: 'border-orange-500/30',  label: 'M&A'            },
};

const impactMeta = {
  high:   { color: 'text-danger',  bg: 'bg-danger/20',  label: 'High Impact' },
  medium: { color: 'text-warning', bg: 'bg-warning/20', label: 'Medium' },
  low:    { color: 'text-gray-400',bg: 'bg-gray-700',   label: 'Low' },
};

const formatRelativeDate = (iso) => {
  const date = new Date(iso);
  const now  = new Date();
  const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (days < 1)  return 'Today';
  if (days < 2)  return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const competitorById = competitorsData.reduce((acc, c) => { acc[c.id] = c; return acc; }, {});

const AINews = () => {
  const [query,      setQuery]      = useState('');
  const [category,   setCategory]   = useState('all');
  const [parameter,  setParameter]  = useState('all');
  const [region,     setRegion]     = useState('All');
  const [impact,     setImpact]     = useState('all');

  // ────────── Live news fetching ──────────
  const [liveItems,    setLiveItems]    = useState([]);
  const [fetchedAt,    setFetchedAt]    = useState(() => {
    const stored = localStorage.getItem(LS_KEY_LAST_FETCH);
    return stored ? Number(stored) : null;
  });
  const [fetchStatus,  setFetchStatus]  = useState('idle'); // idle | loading | success | error | offline
  const [fetchErrors,  setFetchErrors]  = useState([]);
  const intervalRef = useRef(null);

  const loadNews = useCallback(async ({ force = false } = {}) => {
    setFetchStatus('loading');
    try {
      const url = force ? '/api/news/refresh' : '/api/news';
      const opts = force ? { method: 'POST' } : { method: 'GET' };
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Unknown server error');
      setLiveItems(data.items || []);
      setFetchErrors(data.errors || []);
      const ts = Date.parse(data.fetchedAt) || Date.now();
      setFetchedAt(ts);
      localStorage.setItem(LS_KEY_LAST_FETCH, String(ts));
      setFetchStatus('success');
    } catch (err) {
      console.warn('[AINews] live fetch failed:', err.message);
      setFetchStatus('offline');
    }
  }, []);

  // Initial load + auto-refresh every 6 hours
  useEffect(() => {
    loadNews({ force: false });
    intervalRef.current = setInterval(() => {
      loadNews({ force: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [loadNews]);

  // Combined news pool — seeded editorial + live RSS, deduped by title
  const allNews = useMemo(() => {
    const seen = new Set();
    const combined = [...liveItems, ...aiNewsData];
    return combined.filter((n) => {
      const key = (n.title || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [liveItems]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allNews
      .filter((n) => {
        const matchesQuery = !q ||
          n.title.toLowerCase().includes(q) ||
          (n.summary || '').toLowerCase().includes(q) ||
          (n.source || '').toLowerCase().includes(q);
        const matchesCat   = category === 'all' || n.category === category;
        const matchesParam = parameter === 'all' || n.parameters?.includes(parameter);
        const matchesRgn   = region === 'All' || n.region === region;
        const matchesImp   = impact === 'all' || n.impact === impact;
        return matchesQuery && matchesCat && matchesParam && matchesRgn && matchesImp;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [allNews, query, category, parameter, region, impact]);

  const stats = useMemo(() => {
    const last7d = allNews.filter((n) => {
      const days = (new Date() - new Date(n.publishedAt)) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length;
    const high   = allNews.filter((n) => n.impact === 'high').length;
    const indian = allNews.filter((n) => n.region === 'India').length;
    return { total: allNews.length, last7d, high, indian };
  }, [allNews]);

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-secondary border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Newspaper className="text-accent" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">AI News</h2>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                Two streams: <span className="text-success font-medium">Live</span> headlines pulled from RSS feeds (TechCrunch, VentureBeat, Inc42…) with links to the original article, and <span className="text-purple-300 font-medium">Editorial</span> analyst commentary from the Rezo intel team. Each story is tagged by the competitor parameter it affects.
              </p>
            </div>
            <RefreshControl
              status={fetchStatus}
              fetchedAt={fetchedAt}
              liveCount={liveItems.length}
              errors={fetchErrors}
              onRefresh={() => loadNews({ force: true })}
            />
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <StatTile icon={<Newspaper size={16} className="text-accent" />}      bg="bg-accent/20"     value={stats.total} label="Stories Tracked" />
            <StatTile icon={<Clock size={16} className="text-success" />}         bg="bg-success/20"    value={stats.last7d} label="This Week" />
            <StatTile icon={<AlertCircle size={16} className="text-danger" />}    bg="bg-danger/20"     value={stats.high}   label="High-Impact" />
            <StatTile icon={<TrendingUp size={16} className="text-orange-400" />} bg="bg-orange-500/20" value={stats.indian} label="India-related" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter bar */}
        <div className="bg-secondary p-5 rounded-xl border border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by title, summary, or source…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm"
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm">
              {newsCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={parameter} onChange={(e) => setParameter(e.target.value)} className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm">
              <option value="all">All Parameters</option>
              {trackedParameters.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm">
              {newsRegions.map((r) => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
            </select>
            <select value={impact} onChange={(e) => setImpact(e.target.value)} className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm">
              <option value="all">All Impact</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {/* Helper hint with tooltip */}
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            Tip: filter by a
            <InfoTooltip content={glossary.newsParameters} iconSize={11}>parameter</InfoTooltip>
            to see only news that affects that field on competitor cards.
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {aiNewsData.length} stories
          </p>
          {(category !== 'all' || parameter !== 'all' || region !== 'All' || impact !== 'all' || query) && (
            <button
              onClick={() => { setQuery(''); setCategory('all'); setParameter('all'); setRegion('All'); setImpact('all'); }}
              className="text-xs text-accent hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* News feed */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No stories match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((news) => <NewsRow key={news.id} news={news} />)}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────── Sub-components ───────────

const formatLastUpdated = (ts) => {
  if (!ts) return 'Never';
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1)    return 'Just now';
  if (mins < 60)   return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const RefreshControl = ({ status, fetchedAt, liveCount, errors, onRefresh }) => {
  const isLoading = status === 'loading';
  const isOffline = status === 'offline';

  let statusBadge;
  if (isLoading) {
    statusBadge = (
      <span className="flex items-center gap-1.5 px-2 py-1 bg-accent/15 text-accent border border-accent/30 rounded text-xs">
        <RefreshCw size={11} className="animate-spin" /> Fetching…
      </span>
    );
  } else if (isOffline) {
    statusBadge = (
      <span
        className="flex items-center gap-1.5 px-2 py-1 bg-warning/15 text-warning border border-warning/30 rounded text-xs"
        title="Backend offline. Run: cd server && npm start"
      >
        <WifiOff size={11} /> Live feed offline
      </span>
    );
  } else if (status === 'success' && liveCount > 0) {
    statusBadge = (
      <span className="flex items-center gap-1.5 px-2 py-1 bg-success/15 text-success border border-success/30 rounded text-xs">
        <Radio size={11} className="animate-pulse" /> {liveCount} live
      </span>
    );
  } else if (status === 'success') {
    statusBadge = (
      <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
        <CheckCircle2 size={11} /> Up to date
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {statusBadge}
      <span className="text-xs text-gray-500">
        Updated {formatLastUpdated(fetchedAt)}
      </span>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Fetch latest from RSS feeds (auto-runs every 6 hours)"
      >
        <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
        Refresh
      </button>
      {errors?.length > 0 && (
        <InfoTooltip
          content={`Some feeds failed: ${errors.map((e) => e.source).join(', ')}. Other sources still loaded successfully.`}
          iconSize={11}
        >
          <span className="text-xs text-warning flex items-center gap-1">
            <AlertCircle size={11} /> {errors.length} feed{errors.length === 1 ? '' : 's'} failed
          </span>
        </InfoTooltip>
      )}
    </div>
  );
};

const StatTile = ({ icon, bg, value, label }) => (
  <div className="bg-primary rounded-xl p-4 border border-gray-700 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);

const NewsRow = ({ news }) => {
  const cat = categoryMeta[news.category] || categoryMeta.feature_launch;
  const Icon = cat.icon;
  const imp = impactMeta[news.impact];

  const relatedCompetitors = (news.related || [])
    .map((id) => competitorById[id])
    .filter(Boolean);

  return (
    <article className="bg-secondary border border-gray-700 hover:border-accent rounded-xl p-5 animate-fade-in transition-colors">
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div className={`p-2.5 rounded-lg ${cat.bg} ${cat.border} border flex-shrink-0`}>
          <Icon size={18} className={cat.color} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row: category + impact + region + date */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${cat.bg} ${cat.color} border ${cat.border}`}>
              {cat.label}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${imp.bg} ${imp.color}`}>
              <InfoTooltip content={glossary.newsImpact} iconSize={9}>{imp.label}</InfoTooltip>
            </span>
            {news.live && (
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-success/15 text-success border border-success/30"
                title="Pulled from live RSS feed — click below to read the original article"
              >
                <Radio size={9} className="animate-pulse" /> Live
              </span>
            )}
            {news.editorial && (
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-purple-500/15 text-purple-300 border border-purple-500/30"
                title="Internal analyst commentary from the Rezo intel team — not a news article"
              >
                Editorial
              </span>
            )}
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">{news.region}</span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={10} /> {formatRelativeDate(news.publishedAt)}
            </span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-400 font-medium">{news.source}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white mb-1.5 leading-snug">{news.title}</h3>

          {/* Summary */}
          <p className="text-sm text-gray-400 leading-relaxed mb-3">{news.summary}</p>

          {/* Rezo takeaway — the value-add */}
          {news.rezoTakeaway && (
            <div className="bg-primary border-l-2 border-accent rounded-r-lg px-3 py-2 mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Rezo Takeaway</p>
              <p className="text-sm text-gray-200 leading-relaxed">{news.rezoTakeaway}</p>
            </div>
          )}

          {/* Footer: related competitors + parameters affected + link */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-700/60">
            {relatedCompetitors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-500">Affects:</span>
                {relatedCompetitors.map((c) => (
                  <span key={c.id} className="px-2 py-0.5 text-[11px] bg-gray-700 text-gray-200 rounded">
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            {news.parameters?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-500">Parameters:</span>
                {news.parameters.map((p) => {
                  const param = trackedParameters.find((x) => x.id === p);
                  return (
                    <span key={p} className="px-2 py-0.5 text-[11px] bg-accent/15 text-accent rounded border border-accent/20">
                      {param?.label || p}
                    </span>
                  );
                })}
              </div>
            )}

            {news.url ? (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-accent hover:underline"
              >
                Read full story <ExternalLink size={11} />
              </a>
            ) : (
              <span className="ml-auto text-xs text-gray-500 italic">
                Internal analysis · no external link
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default AINews;
