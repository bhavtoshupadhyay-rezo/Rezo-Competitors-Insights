import { useEffect, useState, useCallback, useRef } from 'react';
import {
  fetchLiveCompetitors,
  fetchLiveVoices,
  refreshAllData,
  refreshSource,
} from './dataRefreshService.js';

// Merges live HF data into the static voices seed by `creator` name.
// The seed always wins for editorial fields; the overlay adds HF model
// counts/likes/downloads under `live`.
function mergeVoices(seed, live) {
  if (!live?.creators) return seed.map(v => ({ ...v, live: null }));
  return seed.map(v => ({
    ...v,
    live: live.creators[v.creator] || null,
  }));
}

// Returns a live overlay (map of id → enrichment) plus refresh controls.
// Components keep their own competitor list as state and look up the
// overlay at render time so user-added entrants aren't disturbed.
export function useLiveCompetitorOverlay() {
  const [liveById, setLiveById] = useState({});
  const [meta, setMeta] = useState({ lastUpdated: null, sources: {}, loading: true, error: null });

  const load = useCallback(async () => {
    setMeta(m => ({ ...m, loading: true, error: null }));
    try {
      const live = await fetchLiveCompetitors();
      const map = {};
      for (const c of live.competitors || []) map[c.id] = c;
      setLiveById(map);
      setMeta({ lastUpdated: live.lastUpdated, sources: live.sources || {}, loading: false, error: null });
    } catch (err) {
      setMeta({ lastUpdated: null, sources: {}, loading: false, error: err.message });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(async (source) => {
    setMeta(m => ({ ...m, loading: true, error: null }));
    try {
      if (source) await refreshSource(source); else await refreshAllData();
      await load();
    } catch (err) {
      setMeta(m => ({ ...m, loading: false, error: err.message }));
    }
  }, [load]);

  return { liveById, meta, refresh };
}

export function useLiveVoices(seedData) {
  const [data, setData] = useState(() => seedData.map(s => ({ ...s, live: null })));
  const [meta, setMeta] = useState({ lastUpdated: null, topics: {}, loading: true, error: null });
  const seedRef = useRef(seedData);
  seedRef.current = seedData;

  const load = useCallback(async () => {
    setMeta(m => ({ ...m, loading: true, error: null }));
    try {
      const live = await fetchLiveVoices();
      setData(mergeVoices(seedRef.current, live));
      setMeta({ lastUpdated: live.lastUpdated, topics: live.topics || {}, loading: false, error: null });
    } catch (err) {
      setMeta({ lastUpdated: null, topics: {}, loading: false, error: err.message });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(async () => {
    setMeta(m => ({ ...m, loading: true, error: null }));
    try {
      await refreshSource('huggingface');
      await load();
    } catch (err) {
      setMeta(m => ({ ...m, loading: false, error: err.message }));
    }
  }, [load]);

  return { voices: data, meta, refresh };
}

export function formatRelative(iso) {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return 'never';
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}
