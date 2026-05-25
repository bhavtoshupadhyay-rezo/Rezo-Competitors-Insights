// Mapping of competitor IDs (matching src/data/competitorsData.js) to
// the upstream identifiers our live scrapers can use. Every field is
// optional — a scraper just skips a competitor that doesn't have a
// relevant identifier.

export const competitorRegistry = {
  'bland-ai': {
    name: 'Bland AI',
    website: 'https://www.bland.ai',
    blogUrl: 'https://www.bland.ai/blogs',
    wikipedia: null,
    githubOrgs: ['bland-ai'],
    hnQuery: 'bland.ai OR "bland ai"',
  },
  'vapi': {
    name: 'Vapi',
    website: 'https://vapi.ai',
    blogUrl: 'https://vapi.ai/blog',
    wikipedia: null,
    githubOrgs: ['VapiAI'],
    hnQuery: 'vapi.ai voice',
  },
  'retell-ai': {
    name: 'Retell AI',
    website: 'https://www.retellai.com',
    blogUrl: 'https://www.retellai.com/blog',
    wikipedia: null,
    githubOrgs: ['RetellAI'],
    hnQuery: 'retellai OR "retell ai"',
  },
  'observe-ai': {
    name: 'Observe.AI',
    website: 'https://www.observe.ai',
    blogUrl: 'https://www.observe.ai/blog',
    wikipedia: 'Observe.AI',
    githubOrgs: ['observeai'],
    hnQuery: 'observe.ai',
  },
  'level-ai': {
    name: 'Level AI',
    website: 'https://thelevel.ai',
    blogUrl: 'https://thelevel.ai/blog',
    wikipedia: null,
    githubOrgs: [],
    hnQuery: '"level ai" contact center',
  },
  'corover-ai': {
    name: 'CoRover.ai',
    website: 'https://corover.ai',
    blogUrl: 'https://corover.ai/blog',
    wikipedia: 'CoRover.ai',
    githubOrgs: [],
    hnQuery: 'corover',
  },
  'yellow-ai': {
    name: 'Yellow.ai',
    website: 'https://yellow.ai',
    blogUrl: 'https://yellow.ai/blog',
    wikipedia: 'Yellow.ai',
    githubOrgs: ['yellowmessenger'],
    hnQuery: 'yellow.ai',
  },
  'uniphore': {
    name: 'Uniphore',
    website: 'https://www.uniphore.com',
    blogUrl: 'https://www.uniphore.com/blog',
    wikipedia: 'Uniphore',
    githubOrgs: [],
    hnQuery: 'uniphore',
  },
  'elevenlabs': {
    name: 'ElevenLabs',
    website: 'https://elevenlabs.io',
    blogUrl: 'https://elevenlabs.io/blog',
    wikipedia: 'ElevenLabs',
    githubOrgs: ['elevenlabs'],
    hnQuery: 'elevenlabs',
  },
  'kapture-cx': {
    name: 'Kapture CX',
    website: 'https://www.kapturecrm.com',
    blogUrl: 'https://www.kapturecrm.com/blog',
    wikipedia: null,
    githubOrgs: [],
    hnQuery: 'kapture cx customer support',
  },
  'voicegenie-ai': {
    name: 'VoiceGenie',
    website: 'https://voicegenie.ai',
    blogUrl: 'https://voicegenie.ai/blog',
    wikipedia: null,
    githubOrgs: [],
    hnQuery: 'voicegenie',
  },
  'autotalk': {
    name: 'AutoTalk',
    website: 'https://autotalk.ai',
    blogUrl: 'https://autotalk.ai/blog',
    wikipedia: null,
    githubOrgs: [],
    hnQuery: 'autotalk voice ai',
  },
  'rezo-ai': {
    name: 'Rezo.ai',
    website: 'https://rezo.ai',
    blogUrl: 'https://rezo.ai/blog',
    wikipedia: null,
    githubOrgs: ['rezo-ai'],
    hnQuery: 'rezo.ai',
  },
};

export function getRegistry() {
  return competitorRegistry;
}

// Hugging Face creators we track for the Top Voices page. Maps the
// voice-platform creator name (matching src/data/topVoicesData.js .creator)
// to the HF author handle we can query via /api/models?author=...
export const voiceCreatorRegistry = {
  ElevenLabs: { hfAuthor: null, websiteApi: 'https://elevenlabs.io/api' },
  OpenAI: { hfAuthor: 'openai', websiteApi: 'https://platform.openai.com/docs/guides/text-to-speech' },
  Google: { hfAuthor: 'google', websiteApi: 'https://cloud.google.com/text-to-speech' },
  Microsoft: { hfAuthor: 'microsoft', websiteApi: 'https://learn.microsoft.com/azure/cognitive-services/speech-service/' },
  Amazon: { hfAuthor: 'amazon', websiteApi: 'https://aws.amazon.com/polly/' },
  Meta: { hfAuthor: 'facebook', websiteApi: 'https://huggingface.co/facebook' },
  Cartesia: { hfAuthor: 'cartesia', websiteApi: 'https://cartesia.ai' },
  Deepgram: { hfAuthor: null, websiteApi: 'https://deepgram.com/product/text-to-speech' },
  PlayHT: { hfAuthor: 'play-ht', websiteApi: 'https://play.ht' },
  Sarvam: { hfAuthor: 'sarvamai', websiteApi: 'https://www.sarvam.ai' },
  AI4Bharat: { hfAuthor: 'ai4bharat', websiteApi: 'https://ai4bharat.iitm.ac.in' },
  Suno: { hfAuthor: 'suno', websiteApi: 'https://suno.com' },
};

// HF search topics for the "live model trends" widget on the voices page
export const voiceHfTopics = [
  { id: 'tts', label: 'Text-to-Speech', query: 'tts', filter: 'text-to-speech' },
  { id: 'voice-cloning', label: 'Voice Cloning', query: 'voice cloning', filter: null },
  { id: 'indic-tts', label: 'Indic TTS', query: 'hindi tts', filter: null },
];
