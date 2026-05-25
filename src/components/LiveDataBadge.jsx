import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wifi, WifiOff, Loader2, CheckCircle } from 'lucide-react';
import { formatRelative } from '../services/useLiveData';

// Reads /api/refresh-all's structured result and produces a short one-liner
// like "+12★ · 3 new posts · 2 new entrants" so users see proof that the
// refresh actually pulled fresh data.
function summariseDiffs(refreshResult) {
  if (!refreshResult) return 'no new changes';
  // Single-source refresh (e.g. huggingface) returns { diff, durationMs, ... }
  if (refreshResult.diff && !refreshResult.results) {
    const d = refreshResult.diff;
    if (d.modelDelta)   return `${d.modelDelta > 0 ? '+' : ''}${d.modelDelta} HF models`;
    if (d.likeDelta)    return `${d.likeDelta > 0 ? '+' : ''}${d.likeDelta} likes`;
    return 'no new changes';
  }
  if (!refreshResult.results) return null;
  const bits = [];
  for (const r of Object.values(refreshResult.results)) {
    if (!r || r.error || !r.diff) continue;
    if (r.diff.starDelta)    bits.push(`${r.diff.starDelta > 0 ? '+' : ''}${r.diff.starDelta}★`);
    if (r.diff.newPosts)     bits.push(`${r.diff.newPosts} new posts`);
    if (r.diff.mentionDelta) bits.push(`${r.diff.mentionDelta > 0 ? '+' : ''}${r.diff.mentionDelta} HN`);
    if (r.diff.modelDelta)   bits.push(`${r.diff.modelDelta > 0 ? '+' : ''}${r.diff.modelDelta} models`);
    if (r.diff.newCandidates) bits.push(`${r.diff.newCandidates} new entrants`);
  }
  return bits.length ? bits.slice(0, 3).join(' · ') : 'no new changes';
}

const LiveDataBadge = ({ meta, onRefresh, label = 'Live data' }) => {
  const offline = !!meta?.error;
  const loading = !!meta?.loading;
  const ts = meta?.lastUpdated;

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message, tone = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, tone });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const handleClick = async () => {
    if (loading || !onRefresh) return;
    try {
      const result = await onRefresh();
      const ms = result?.totalDurationMs ?? result?.durationMs ?? 0;
      showToast(`Refreshed in ${ms}ms · ${summariseDiffs(result)}`);
    } catch (err) {
      showToast(err.message || 'Refresh failed', 'error');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
        {loading ? (
          <Loader2 size={14} className="text-blue-400 animate-spin" />
        ) : offline ? (
          <WifiOff size={14} className="text-red-400" title={meta.error} />
        ) : (
          <Wifi size={14} className={ts ? 'text-green-400' : 'text-gray-500'} />
        )}
        <div className="text-xs leading-tight">
          <div className="text-gray-300 font-medium">{label}</div>
          <div className="text-gray-500">
            {offline
              ? 'offline — using seed data'
              : ts
              ? `updated ${formatRelative(ts)}`
              : loading
              ? 'fetching…'
              : 'no snapshot yet'}
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={handleClick}
            disabled={loading}
            className="ml-1 p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white disabled:opacity-50"
            title="Re-run all scrapers"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {toast && (
        <div className={`absolute right-0 top-full mt-2 z-50 w-72 px-3 py-2 rounded-lg border text-xs shadow-lg flex items-start gap-2 animate-fade-in ${
          toast.tone === 'error'
            ? 'bg-danger/10 border-danger/40 text-danger'
            : 'bg-success/10 border-success/40 text-success'
        }`}>
          <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span className="text-gray-200 leading-snug">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default LiveDataBadge;
