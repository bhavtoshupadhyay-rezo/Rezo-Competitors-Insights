import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { formatRelative } from '../services/useLiveData';

const LiveDataBadge = ({ meta, onRefresh, label = 'Live data' }) => {
  const offline = !!meta?.error;
  const loading = !!meta?.loading;
  const ts = meta?.lastUpdated;

  return (
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
          onClick={onRefresh}
          disabled={loading}
          className="ml-1 p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white disabled:opacity-50"
          title="Refresh now"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      )}
    </div>
  );
};

export default LiveDataBadge;
