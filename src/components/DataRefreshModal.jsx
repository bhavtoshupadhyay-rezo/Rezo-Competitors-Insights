import { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, AlertCircle, TrendingUp, Zap, Users, Clock, Globe } from 'lucide-react';
import { refreshAllData, checkServerHealth } from '../services/dataRefreshService';

const DataRefreshModal = ({ onClose, onDataRefreshed }) => {
  const [status, setStatus] = useState('idle'); // idle, checking, refreshing, success, error
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setStatus('checking');
    const isOnline = await checkServerHealth();
    setServerOnline(isOnline);
    setStatus('idle');
  };

  const handleRefresh = async () => {
    setStatus('refreshing');
    setProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const data = await refreshAllData();
      clearInterval(progressInterval);
      setProgress(100);
      setResults(data.data);
      setStatus('success');

      if (onDataRefreshed) {
        onDataRefreshed(data.data);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message);
      setStatus('error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Globe size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Data Refresh Center</h2>
              <p className="text-sm text-gray-400">Fetch latest competitor intelligence from web</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Server Status */}
          <div className="mb-6 p-4 bg-primary/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${serverOnline ? 'bg-success animate-pulse' : serverOnline === false ? 'bg-danger' : 'bg-gray-500'}`} />
                <span className="text-white font-medium">Backend Server</span>
              </div>
              <span className={`text-sm ${serverOnline ? 'text-success' : serverOnline === false ? 'text-danger' : 'text-gray-400'}`}>
                {serverOnline ? 'Online' : serverOnline === false ? 'Offline' : 'Checking...'}
              </span>
            </div>
            {serverOnline === false && (
              <p className="mt-2 text-sm text-gray-400">
                Start the server: <code className="bg-black/30 px-2 py-1 rounded">cd server && npm install && npm start</code>
              </p>
            )}
          </div>

          {/* Refresh Status */}
          {status === 'idle' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <RefreshCw size={32} className="text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Refresh</h3>
              <p className="text-gray-400 mb-6">
                Click below to fetch the latest competitor data from:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['Crunchbase', 'G2 Crowd', 'Company Websites', 'News Sources'].map(source => (
                  <span key={source} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                    {source}
                  </span>
                ))}
              </div>
              <button
                onClick={handleRefresh}
                disabled={!serverOnline}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors ${
                  serverOnline
                    ? 'bg-accent text-white hover:bg-blue-600'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <RefreshCw size={18} />
                Refresh All Data
              </button>
            </div>
          )}

          {status === 'checking' && (
            <div className="text-center py-8">
              <RefreshCw size={32} className="text-accent mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Checking server status...</p>
            </div>
          )}

          {status === 'refreshing' && (
            <div className="py-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RefreshCw size={24} className="text-accent animate-spin" />
                <span className="text-white font-medium">Fetching latest data...</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <p className={progress > 10 ? 'text-success' : ''}>
                  {progress > 10 ? '✓' : '○'} Connecting to data sources...
                </p>
                <p className={progress > 30 ? 'text-success' : ''}>
                  {progress > 30 ? '✓' : '○'} Fetching competitor updates...
                </p>
                <p className={progress > 50 ? 'text-success' : ''}>
                  {progress > 50 ? '✓' : '○'} Scanning for new entrants...
                </p>
                <p className={progress > 70 ? 'text-success' : ''}>
                  {progress > 70 ? '✓' : '○'} Analyzing market insights...
                </p>
                <p className={progress > 90 ? 'text-success' : ''}>
                  {progress > 90 ? '✓' : '○'} Compiling results...
                </p>
              </div>
            </div>
          )}

          {status === 'success' && results && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
                <CheckCircle size={24} className="text-success" />
                <div>
                  <p className="text-success font-medium">Data Refreshed Successfully!</p>
                  <p className="text-sm text-gray-400">Last updated: {formatDate(results.timestamp)}</p>
                </div>
              </div>

              {/* Competitor Updates */}
              {results.competitorUpdates?.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-warning" />
                    Competitor Updates ({results.competitorUpdates.length})
                  </h4>
                  <div className="space-y-2">
                    {results.competitorUpdates.map((competitor, idx) => (
                      <div key={idx} className="p-3 bg-primary/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{competitor.name}</span>
                          <span className="text-xs text-gray-500">{competitor.updates.length} updates</span>
                        </div>
                        <div className="space-y-1">
                          {competitor.updates.map((update, uidx) => (
                            <div key={uidx} className="flex items-center gap-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                update.type === 'funding' ? 'bg-success/20 text-success' :
                                update.type === 'feature_launch' ? 'bg-purple-500/20 text-purple-400' :
                                update.type === 'partnership' ? 'bg-accent/20 text-accent' :
                                'bg-gray-700 text-gray-300'
                              }`}>
                                {update.type.replace('_', ' ')}
                              </span>
                              <span className="text-gray-300">{update.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Entrants */}
              {results.newEntrants?.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Users size={16} className="text-accent" />
                    New Market Entrants ({results.newEntrants.length})
                  </h4>
                  <div className="grid gap-2">
                    {results.newEntrants.map((entrant, idx) => (
                      <div key={idx} className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{entrant.name}</span>
                          <span className="text-xs text-accent">{entrant.funding}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{entrant.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{entrant.category}</span>
                          <span className="text-xs text-gray-600">•</span>
                          <span className="text-xs text-gray-500">Founded {entrant.founded}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {results.marketInsights?.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" />
                    Market Insights
                  </h4>
                  <div className="space-y-2">
                    {results.marketInsights.map((insight, idx) => (
                      <div key={idx} className="p-3 bg-success/10 rounded-lg border border-success/30">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{insight.title}</span>
                          <span className="text-xs text-gray-500">{insight.source}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh Again Button */}
              <div className="text-center pt-4">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} />
                  Refresh Again
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-danger/20 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-danger" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Refresh Failed</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Make sure the backend server is running:</p>
                <code className="block bg-black/30 px-4 py-2 rounded text-sm text-gray-300">
                  cd server && npm install && npm start
                </code>
              </div>
              <button
                onClick={handleRefresh}
                className="mt-6 px-6 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-primary/30">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Data sources updated every 24 hours</span>
            </div>
            <span>Powered by Web Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRefreshModal;
