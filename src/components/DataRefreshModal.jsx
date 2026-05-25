import { useState, useEffect } from 'react';
import {
  X, RefreshCw, CheckCircle, AlertCircle, Clock, Globe, Loader2,
  Github, MessageSquare, BookOpen, Newspaper, Mic, Sparkles,
} from 'lucide-react';
import { refreshAllData, checkServerHealth, fetchSnapshots } from '../services/dataRefreshService';

const SOURCE_META = {
  github:      { label: 'GitHub',       Icon: Github,        diffKey: 'starDelta',     diffLabel: '★ delta',   diffUnit: '★' },
  hackernews:  { label: 'Hacker News',  Icon: MessageSquare, diffKey: 'mentionDelta',  diffLabel: 'new HN',    diffUnit: 'mentions' },
  wikipedia:   { label: 'Wikipedia',    Icon: BookOpen,      diffKey: null },
  blogs:       { label: 'Vendor blogs', Icon: Newspaper,     diffKey: 'newPosts',      diffLabel: 'new posts', diffUnit: 'posts' },
  huggingface: { label: 'Hugging Face', Icon: Mic,           diffKey: 'modelDelta',    diffLabel: 'model Δ',   diffUnit: 'models' },
  entrants:    { label: 'New entrants', Icon: Sparkles,      diffKey: 'newCandidates', diffLabel: 'new entrants', diffUnit: 'companies' },
};

const formatTs = (iso) => iso
  ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '–';

const DataRefreshModal = ({ onClose, onDataRefreshed }) => {
  const [status, setStatus] = useState('idle'); // idle, refreshing, success, error
  const [serverOnline, setServerOnline] = useState(null);
  const [snapshots, setSnapshots]     = useState([]);
  const [error, setError]             = useState(null);
  const [results, setResults]         = useState(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const online = await checkServerHealth();
    setServerOnline(online);
    if (online) {
      try { const s = await fetchSnapshots(); setSnapshots(s.snapshots || []); }
      catch (err) { console.error(err); }
    }
  };

  const handleRefresh = async () => {
    setStatus('refreshing');
    setError(null);
    setResults(null);
    try {
      const data = await refreshAllData();
      setResults(data);
      setStatus('success');
      const s = await fetchSnapshots();
      setSnapshots(s.snapshots || []);
      if (onDataRefreshed) onDataRefreshed(data);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Globe size={22} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Data Refresh Center</h2>
              <p className="text-sm text-gray-400">Re-runs all live scrapers in parallel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Server status */}
          <div className="mb-5 p-4 bg-primary/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  serverOnline ? 'bg-success animate-pulse' :
                  serverOnline === false ? 'bg-danger' : 'bg-gray-500'
                }`} />
                <span className="text-white font-medium text-sm">Backend</span>
              </div>
              <span className={`text-xs ${
                serverOnline ? 'text-success' :
                serverOnline === false ? 'text-danger' : 'text-gray-400'
              }`}>
                {serverOnline ? 'online' : serverOnline === false ? 'offline' : 'checking…'}
              </span>
            </div>
            {serverOnline === false && (
              <p className="mt-2 text-xs text-gray-500">
                Start it with <code className="bg-black/40 px-1.5 py-0.5 rounded">cd server && npm start</code>
              </p>
            )}
          </div>

          {/* Existing snapshots */}
          {snapshots.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Current snapshots</h4>
              <div className="grid grid-cols-2 gap-2">
                {snapshots.map(s => {
                  const sourceName = s.name.replace(/^competitors-|^voices-|^new-/, '');
                  const meta = SOURCE_META[sourceName] || { label: s.name, Icon: Newspaper };
                  return (
                    <div key={s.name} className="flex items-center gap-2 text-xs bg-primary/50 border border-gray-700 rounded px-2.5 py-1.5">
                      <meta.Icon size={12} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-300 truncate">{meta.label}</div>
                        <div className="text-gray-500">{formatTs(s.fetchedAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Refresh action */}
          {status === 'idle' && (
            <button
              onClick={handleRefresh}
              disabled={!serverOnline}
              className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                serverOnline
                  ? 'bg-accent text-white hover:bg-blue-600'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={16} />
              Refresh all sources
            </button>
          )}

          {status === 'refreshing' && (
            <div className="text-center py-6">
              <Loader2 size={28} className="text-accent mx-auto mb-3 animate-spin" />
              <p className="text-white font-medium text-sm">Running scrapers in parallel…</p>
              <p className="text-xs text-gray-500 mt-1">GitHub · Hacker News · Wikipedia · Vendor blogs · Hugging Face · Entrant discovery</p>
            </div>
          )}

          {status === 'success' && results && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/30 rounded-lg">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-success font-medium text-sm">Refresh complete</p>
                  <p className="text-xs text-gray-400">
                    Finished {formatTs(results.finishedAt)} · total {results.totalDurationMs}ms
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Per-source results</h4>
                <div className="space-y-1.5">
                  {Object.entries(results.results || {}).map(([source, r]) => {
                    const meta = SOURCE_META[source] || { label: source, Icon: Newspaper };
                    const failed = !!r.error;
                    return (
                      <div key={source} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                        failed ? 'bg-danger/5 border-danger/30' : 'bg-primary/40 border-gray-700'
                      }`}>
                        <meta.Icon size={14} className={failed ? 'text-danger' : 'text-gray-400'} />
                        <span className="text-sm text-white font-medium flex-1">{meta.label}</span>
                        {failed ? (
                          <span className="text-xs text-danger" title={r.error}>failed</span>
                        ) : (
                          <>
                            <span className="text-xs text-gray-500">{r.durationMs}ms</span>
                            {r.diff && meta.diffKey && r.diff[meta.diffKey] != null && (
                              <span className={`text-xs font-medium ${
                                r.diff[meta.diffKey] > 0 ? 'text-success' :
                                r.diff[meta.diffKey] < 0 ? 'text-warning' :
                                'text-gray-500'
                              }`}>
                                {r.diff[meta.diffKey] > 0 ? '+' : ''}{r.diff[meta.diffKey]} {meta.diffUnit}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {results.results?.entrants?.diff?.sampleNames?.length > 0 && (
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <p className="text-xs text-warning font-medium mb-1">New entrants spotted this run</p>
                  <p className="text-xs text-gray-300">{results.results.entrants.diff.sampleNames.join(', ')}</p>
                </div>
              )}

              <button
                onClick={handleRefresh}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw size={14} />
                Refresh again
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-danger font-medium text-sm">Refresh failed</p>
                  <p className="text-xs text-gray-400 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-700 bg-primary/30 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>Auto-refreshes daily at 04:30 IST</span>
          </div>
          <span>Live web intelligence</span>
        </div>
      </div>
    </div>
  );
};

export default DataRefreshModal;
