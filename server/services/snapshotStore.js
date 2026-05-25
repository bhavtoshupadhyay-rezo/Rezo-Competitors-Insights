import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = path.resolve(__dirname, '..', 'data', 'snapshots');

async function ensureDir() {
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
}

export async function saveSnapshot(name, payload) {
  await ensureDir();
  const filePath = path.join(SNAPSHOT_DIR, `${name}.json`);
  const body = {
    name,
    fetchedAt: new Date().toISOString(),
    payload,
  };
  await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
  return body;
}

export async function loadSnapshot(name) {
  try {
    const filePath = path.join(SNAPSHOT_DIR, `${name}.json`);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function listSnapshots() {
  await ensureDir();
  const files = await fs.readdir(SNAPSHOT_DIR);
  const meta = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const filePath = path.join(SNAPSHOT_DIR, file);
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      meta.push({
        name: parsed.name || file.replace(/\.json$/, ''),
        fetchedAt: parsed.fetchedAt,
        size: raw.length,
      });
    } catch {
      // skip unreadable file
    }
  }
  return meta.sort((a, b) => (a.name < b.name ? -1 : 1));
}

export function ageMs(snapshot) {
  if (!snapshot?.fetchedAt) return Infinity;
  return Date.now() - new Date(snapshot.fetchedAt).getTime();
}
