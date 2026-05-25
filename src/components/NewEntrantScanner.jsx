import { useState, useEffect } from 'react';
import {
  X, Sparkles, Search, Star, TrendingUp, AlertTriangle,
  Building2, Check, Trash2, ExternalLink, Github, MessageSquare, ShieldCheck, Loader2, RefreshCw,
} from 'lucide-react';
import { discoverEntrants, fetchCachedEntrants } from '../services/dataRefreshService';
import { formatRelative } from '../services/useLiveData';

const SOURCE_META = {
  hackernews: { label: 'Hacker News', Icon: MessageSquare, tint: 'text-orange-400' },
  github:     { label: 'GitHub',      Icon: Github,         tint: 'text-gray-300' },
  producthunt:{ label: 'Product Hunt',Icon: TrendingUp,     tint: 'text-pink-400' },
};

const scoreClass = (s) => s >= 70 ? 'text-success' : s >= 50 ? 'text-warning' : 'text-danger';
const scoreBar   = (s) => s >= 70 ? 'bg-success'  : s >= 50 ? 'bg-warning'  : 'bg-danger';

const NewEntrantScanner = ({ onClose, onAddToCompetitorsList, onRemoveFromList, addedCompanyIds = new Set() }) => {
  const [keyword, setKeyword]       = useState('');
  const [maxAgeDays, setMaxAgeDays] = useState(180);
  const [showTracked, setShowTracked] = useState(false);

  const [loading, setLoading]   = useState(false);
  const [running, setRunning]   = useState(false);
  const [error, setError]       = useState(null);
  const [data, setData]         = useState(null); // { fetchedAt, counts, candidates }

  const [locallyAdded, setLocallyAdded] = useState(new Set());

  // Load cached entrants on mount so the modal opens with something useful
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const cached = await fetchCachedEntrants();
        if (!cancelled && cached?.candidates) {
          setData({
            fetchedAt: cached.fetchedAt,
            counts: cached.counts,
            candidates: cached.candidates,
            cached: true,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const runScan = async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await discoverEntrants({
        keyword: keyword.trim() || null,
        maxAgeDays,
      });
      setData({
        fetchedAt: result.fetchedAt,
        counts: result.counts,
        candidates: result.candidates,
        durationMs: result.durationMs,
        cached: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const isAdded = (id) => addedCompanyIds.has(id) || locallyAdded.has(id);

  const handleAdd = (candidate) => {
    if (!onAddToCompetitorsList) return;
    // Adapt the entrant payload to the shape Dashboard expects.
    const adapted = {
      id: candidate.id,
      name: candidate.name,
      logo: candidate.host ? `https://${candidate.host}/favicon.ico` : '🆕',
      category: 'New Entrant',
      founded: candidate.firstSeen ? new Date(candidate.firstSeen).getFullYear() : new Date().getFullYear(),
      hq: 'Unknown',
      isNew: true,
      fundingStatus: 'Unknown',
      totalFunding: '–',
      lastRound: 'Unknown',
      lastRoundDate: '–',
      estimatedARR: '–',
      investors: [],
      buzzScore: candidate.score,
      description: candidate.description,
      products: [{ name: candidate.name, description: candidate.description, flagship: true }],
      features: {},
      industries: [],
      website: candidate.url,
    };
    const ok = onAddToCompetitorsList(adapted);
    if (ok !== false) setLocallyAdded(prev => new Set([...prev, candidate.id]));
  };

  const handleRemove = (id) => {
    if (!onRemoveFromList) return;
    const ok = onRemoveFromList(id);
    if (ok !== false) {
      setLocallyAdded(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const candidates = (data?.candidates || []).filter(c => showTracked || !c.alreadyTracked);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-warning" size={28} />
                New Entrant Discovery
              </h2>
              <p className="text-gray-400 mt-1 text-sm">
                Live scan of Hacker News "Show HN", GitHub repo search, and Product Hunt feeds — cross-checked against tracked competitors.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={22} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-700/60 bg-primary/40">
          <div className="grid md:grid-cols-[1fr_140px_auto] gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Keyword filter (optional)</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runScan()}
                  placeholder="e.g. voice agent, IVR, dialer…"
                  className="w-full pl-9 pr-3 py-2 bg-secondary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-warning placeholder-gray-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Recency</label>
              <select
                value={maxAgeDays}
                onChange={(e) => setMaxAgeDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-warning text-sm"
              >
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={180}>Last 6 months</option>
                <option value={365}>Last 12 months</option>
              </select>
            </div>
            <button
              onClick={runScan}
              disabled={running}
              className="px-5 py-2 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {running ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {running ? 'Scanning…' : 'Scan now'}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showTracked}
                onChange={(e) => setShowTracked(e.target.checked)}
                className="accent-warning"
              />
              <span>Show already-tracked competitors too</span>
            </label>
            {data?.fetchedAt && (
              <span className="flex items-center gap-2">
                {data.cached ? 'cached' : `fresh in ${data.durationMs}ms`} · updated {formatRelative(data.fetchedAt)}
                <button onClick={runScan} disabled={running} className="ml-1 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                  <RefreshCw size={12} className={running ? 'animate-spin' : ''} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && !data && (
            <div className="text-center py-16">
              <Loader2 size={40} className="text-warning mx-auto mb-3 animate-spin" />
              <p className="text-gray-400">Loading latest scan…</p>
            </div>
          )}

          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-danger font-medium text-sm">Scan failed</p>
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {data && (
            <>
              {/* Source counts */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <Stat label="HN signals"     value={data.counts?.hackernews} />
                <Stat label="GitHub repos"   value={data.counts?.github} />
                <Stat label="Product Hunt"   value={data.counts?.producthunt} />
                <Stat label="Unique"         value={data.counts?.uniqueCandidates} highlight />
                <Stat label="Already tracked" value={data.counts?.alreadyTracked} muted />
              </div>

              {candidates.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  {data.counts?.uniqueCandidates > 0
                    ? 'All matches are already on your radar — toggle "Show already-tracked" to see them.'
                    : 'No matches for those filters. Try widening recency or removing the keyword.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map(c => (
                    <CandidateCard
                      key={c.id}
                      c={c}
                      isAdded={isAdded(c.id)}
                      onAdd={() => handleAdd(c)}
                      onRemove={() => handleRemove(c.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight, muted }) => (
  <div className={`rounded-lg p-3 border ${
    highlight ? 'bg-warning/10 border-warning/30' :
    muted ? 'bg-gray-800/40 border-gray-700' :
    'bg-primary border-gray-700'
  }`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-lg font-bold ${highlight ? 'text-warning' : muted ? 'text-gray-400' : 'text-white'}`}>
      {value ?? '–'}
    </p>
  </div>
);

const CandidateCard = ({ c, isAdded, onAdd, onRemove }) => {
  const topSignal = c.signals?.[0];
  return (
    <div className={`bg-primary rounded-xl border p-5 transition-colors ${
      c.alreadyTracked ? 'border-gray-700 opacity-70' : 'border-gray-700 hover:border-warning'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-white">{c.name}</h3>
            {c.alreadyTracked ? (
              <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs font-medium flex items-center gap-1">
                <ShieldCheck size={12} /> Tracked
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium">NEW</span>
            )}
            {c.firstSeen && (
              <span className="text-xs text-gray-500">
                first seen {formatRelative(c.firstSeen)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{c.description}</p>
          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-xs text-accent hover:text-blue-300"
            >
              <ExternalLink size={11} /> {c.host || c.url}
            </a>
          )}
        </div>
        {!c.alreadyTracked && (
          isAdded ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-3 py-1.5 bg-success/20 text-success rounded-lg text-sm flex items-center gap-1.5">
                <Check size={14} /> Added
              </span>
              <button
                onClick={onRemove}
                className="px-3 py-1.5 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 text-sm flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="px-3 py-1.5 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 text-sm flex items-center gap-1.5 flex-shrink-0"
            >
              <Star size={14} /> Add to watchlist
            </button>
          )
        )}
      </div>

      {/* Signal sources */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {(c.sources || []).map(s => {
          const meta = SOURCE_META[s];
          if (!meta) return null;
          const sig = (c.signals || []).find(x => x.source === s);
          return (
            <a
              key={s}
              href={sig?.sourceUrl || sig?.url || '#'}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800/60 hover:bg-gray-700 text-xs ${meta.tint}`}
            >
              <meta.Icon size={12} />
              <span>{meta.label}</span>
              {sig?.points != null && <span className="text-gray-500">· {sig.points}pts</span>}
              {sig?.stars != null && <span className="text-gray-500">· {sig.stars}★</span>}
            </a>
          );
        })}
        {topSignal?.query && (
          <span className="text-[10px] text-gray-600 ml-1">matched: "{topSignal.query}"</span>
        )}
      </div>

      {/* Signal score bar */}
      <div className="bg-secondary rounded-lg p-3 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className={scoreClass(c.score)} />
            <span className="text-gray-400 text-xs">Signal score</span>
            <span className="text-xs text-gray-600">· {c.signalCount} source mention{c.signalCount === 1 ? '' : 's'}</span>
          </div>
          <span className={`text-xl font-bold ${scoreClass(c.score)}`}>{c.score}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-full rounded-full transition-all ${scoreBar(c.score)}`}
            style={{ width: `${c.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewEntrantScanner;
