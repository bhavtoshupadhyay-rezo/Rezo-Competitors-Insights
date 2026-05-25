// Frontend live-data client. All paths are relative — Vite proxies /api/*
// to the Express server in dev, and in prod they hit the same origin.

const API_BASE = '/api';

async function jsonOrThrow(res, label) {
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  return res.json();
}

export async function fetchLiveCompetitors() {
  const res = await fetch(`${API_BASE}/competitors`, { headers: { Accept: 'application/json' } });
  return jsonOrThrow(res, '/api/competitors');
}

export async function fetchLiveVoices() {
  const res = await fetch(`${API_BASE}/voices`, { headers: { Accept: 'application/json' } });
  return jsonOrThrow(res, '/api/voices');
}

export async function fetchLiveNews() {
  const res = await fetch(`${API_BASE}/news`, { headers: { Accept: 'application/json' } });
  return jsonOrThrow(res, '/api/news');
}

export async function refreshAllData() {
  const res = await fetch(`${API_BASE}/refresh-all`, { method: 'POST' });
  return jsonOrThrow(res, '/api/refresh-all');
}

export async function refreshSource(source) {
  const res = await fetch(`${API_BASE}/refresh/${encodeURIComponent(source)}`, { method: 'POST' });
  return jsonOrThrow(res, `/api/refresh/${source}`);
}

export async function fetchSnapshots() {
  const res = await fetch(`${API_BASE}/snapshots`);
  return jsonOrThrow(res, '/api/snapshots');
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export default {
  fetchLiveCompetitors,
  fetchLiveVoices,
  fetchLiveNews,
  refreshAllData,
  refreshSource,
  fetchSnapshots,
  checkServerHealth,
};
