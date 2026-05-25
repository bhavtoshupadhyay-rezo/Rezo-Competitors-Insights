import axios from 'axios';
import pLimit from 'p-limit';
import { voiceCreatorRegistry, voiceHfTopics } from '../competitorRegistry.js';

const HF_API = 'https://huggingface.co/api/models';
const limit = pLimit(3);

async function fetchModels(params) {
  const { data } = await axios.get(HF_API, {
    params,
    headers: { 'User-Agent': 'rezo-competitor-insights/1.0' },
    timeout: 10000,
  });
  return Array.isArray(data) ? data : [];
}

function summariseModels(models) {
  const totalDownloads = models.reduce((s, m) => s + (m.downloads || 0), 0);
  const totalLikes = models.reduce((s, m) => s + (m.likes || 0), 0);
  const top = models
    .slice()
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5)
    .map(m => ({
      id: m.id || m.modelId,
      url: `https://huggingface.co/${m.id || m.modelId}`,
      downloads: m.downloads || 0,
      likes: m.likes || 0,
      pipeline: m.pipeline_tag,
      createdAt: m.createdAt,
      tags: (m.tags || []).slice(0, 8),
    }));
  return { totalModels: models.length, totalDownloads, totalLikes, top };
}

export async function scrapeHuggingFaceVoices() {
  const creators = {};
  await Promise.all(
    Object.entries(voiceCreatorRegistry).map(([name, cfg]) =>
      limit(async () => {
        if (!cfg.hfAuthor) {
          creators[name] = null;
          return;
        }
        try {
          const models = await fetchModels({
            author: cfg.hfAuthor,
            limit: 50,
            full: 'false',
            sort: 'likes',
            direction: -1,
          });
          // Filter for speech/voice models when possible — but keep
          // the broader set as fallback so we always return something.
          const voiceish = models.filter(m =>
            m.pipeline_tag === 'text-to-speech' ||
            (m.tags || []).some(t => /tts|voice|speech|audio/i.test(t))
          );
          creators[name] = summariseModels(voiceish.length ? voiceish : models);
        } catch (err) {
          creators[name] = { error: err.message };
        }
      })
    )
  );

  const topics = {};
  await Promise.all(
    voiceHfTopics.map(topic =>
      limit(async () => {
        try {
          const models = await fetchModels({
            search: topic.query,
            ...(topic.filter ? { filter: topic.filter } : {}),
            limit: 20,
            sort: 'likes',
            direction: -1,
          });
          topics[topic.id] = {
            label: topic.label,
            ...summariseModels(models),
          };
        } catch (err) {
          topics[topic.id] = { label: topic.label, error: err.message };
        }
      })
    )
  );

  return { creators, topics };
}
