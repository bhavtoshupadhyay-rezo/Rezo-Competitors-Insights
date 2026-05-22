// Competitor pricing — VERIFIED FROM ACTUAL VENDOR PRICING PAGES
// Last researched: 2026-05-14
//
// Rules of the road:
//   • Every number below was pulled directly from the vendor's public pricing
//     page on the date in `lastVerified`. If you can't trace a value back to
//     a real screenshot or URL, do NOT add it here.
//   • `publicPricing: false` means the vendor has no public price list — use
//     `price: 'contact_sales'` on each stack piece they sell. Don't guess.
//   • `offered: 'unclear'` means the vendor's marketing suggests they sell
//     this stack piece but the pricing page doesn't confirm. UI treats this
//     as a known gap to fill, not as a definitive No.
//   • To re-run research: hand `AUTOMATION.md` + this file's docstring to
//     Claude with prompt "Re-verify all entries against their sourceUrl."

// Shape:
//   pricingData[competitorId] = {
//     publicPricing: boolean,
//     sourceUrl: string,
//     error?: string,                  // only when fetch failed
//     t2t | t2v | v2t | v2v: {
//       offered: true | false | 'unclear',
//       unit: string,
//       price: number | 'contact_sales' | null,
//       currency: 'USD' | 'INR' | null,
//       notes: string,
//     },
//     telephony: { bundled, inboundPerMin, outboundPerMin, byoTwilio, notes },
//     packaging: { model, freeCredits, lowestTier },
//     lastVerified: 'YYYY-MM-DD',
//   }

export const pricingData = {
  // ────────── Rezo.ai (internal placeholder) ──────────
  // Rezo's actual numbers are not public on rezo.ai. The product team must
  // replace these placeholders with the real tiered pricing from the sales
  // playbook. UI shows a yellow "internal placeholder" badge until done.
  'rezo-ai': {
    publicPricing: false,
    sourceUrl: 'https://rezo.ai',
    internalPlaceholder: true,
    t2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Replace with actual Rezo T2T pricing from sales sheet' },
    t2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Replace with actual Rezo TTS pricing' },
    v2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Replace with actual Rezo ASR pricing' },
    v2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Replace with actual Rezo end-to-end voice agent pricing' },
    telephony: { bundled: true, inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: true, notes: 'Native predictive dialer; Twilio integration available' },
    packaging: { model: 'Enterprise', freeCredits: 'POC available',
                 lowestTier: 'Contact sales — tiered by deployment size' },
    lastVerified: '2026-05-14',
  },

  // ────────── Bland AI ──────────
  'bland-ai': {
    publicPricing: true,
    sourceUrl: 'https://bland.ai/pricing',
    t2t:  { offered: false, unit: '', price: null, currency: null,
            notes: 'Not a standalone product; Bland sells full voice agents' },
    t2v:  { offered: true, unit: 'per minute (bundled)', price: 0.14, currency: 'USD',
            notes: 'TTS bundled into per-min voice rate' },
    v2t:  { offered: true, unit: 'per minute (bundled)', price: 0.14, currency: 'USD',
            notes: 'STT bundled into per-min voice rate' },
    v2v:  { offered: true, unit: 'per minute', price: 0.14, currency: 'USD',
            notes: 'Start tier $0.14/min. Build tier $0.12/min, Scale tier $0.11/min. Includes LLM+STT+TTS+telephony.' },
    telephony: { bundled: true, inboundPerMin: null, outboundPerMin: null, byoTwilio: true,
                 notes: 'Telephony included in per-min rate; BYO Twilio / SIP trunk supported' },
    packaging: { model: 'Pay-per-use',
                 freeCredits: '2 free credits + free inbound number (~$15/mo value)',
                 lowestTier: 'Start at $0.14/min, $0 platform fee' },
    lastVerified: '2026-05-14',
  },

  // ────────── Vapi ──────────
  'vapi': {
    publicPricing: true,
    sourceUrl: 'https://vapi.ai/pricing',
    t2t:  { offered: true, unit: 'per message', price: 0.005, currency: 'USD',
            notes: 'SMS/chat $0.005/msg on Build tier; model costs pass-through or $0 with BYO API key' },
    t2v:  { offered: true, unit: 'per minute', price: 0.05, currency: 'USD',
            notes: 'TTS within $0.05/min Vapi orchestration fee; provider costs at-cost or BYO key' },
    v2t:  { offered: true, unit: 'per minute', price: 0.05, currency: 'USD',
            notes: 'STT within $0.05/min Vapi orchestration fee; provider costs at-cost or BYO key' },
    v2v:  { offered: true, unit: 'per minute', price: 0.05, currency: 'USD',
            notes: 'Build tier; STT+LLM+TTS at-cost (or $0 each with BYO API keys)' },
    telephony: { bundled: false, inboundPerMin: null, outboundPerMin: null, byoTwilio: true,
                 notes: 'Twilio/etc. billed separately by provider; $10/line/mo for extra concurrency' },
    packaging: { model: 'Pay-per-use',
                 freeCredits: 'Free minutes included on Build tier',
                 lowestTier: 'Build (usage-based, $0.05/min)' },
    lastVerified: '2026-05-14',
  },

  // ────────── Retell AI ──────────
  'retell-ai': {
    publicPricing: true,
    sourceUrl: 'https://www.retellai.com/pricing',
    t2t:  { offered: true, unit: 'per AI message', price: 0.002, currency: 'USD',
            notes: 'Chat agents $0.002–$0.03/msg depending on LLM' },
    t2v:  { offered: true, unit: 'per minute', price: 0.015, currency: 'USD',
            notes: 'Retell Platform Voices (TTS) component' },
    v2t:  { offered: true, unit: 'per minute', price: 0.055, currency: 'USD',
            notes: 'Bundled into Retell Voice Infrastructure $0.055/min' },
    v2v:  { offered: true, unit: 'per minute', price: 0.07, currency: 'USD',
            notes: 'Cheapest combo $0.07/min, range up to $0.31/min depending on LLM and add-ons' },
    telephony: { bundled: false, inboundPerMin: 0.015, outboundPerMin: 0.015, byoTwilio: true,
                 notes: 'Twilio ~$0.015/min US; free SIP trunking / custom telephony' },
    packaging: { model: 'Pay-per-use',
                 freeCredits: '$10 free credits; 20 concurrent calls free',
                 lowestTier: 'Pay as you go ($0 base)' },
    lastVerified: '2026-05-14',
  },

  // ────────── Observe.AI ──────────
  'observe-ai': {
    publicPricing: false,
    sourceUrl: 'https://www.observe.ai/pricing',
    error: 'Pricing page returns HTTP 404; homepage offers only "Get a Demo" / "Contact Us"',
    t2t:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null,
            notes: 'Conversation intelligence suite; no public pricing' },
    t2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Core product (call transcription/analytics); enterprise pricing only' },
    v2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null,
            notes: 'VoiceAI Agents marketed; pricing not disclosed' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed' },
    packaging: { model: 'Enterprise', freeCredits: 'None disclosed', lowestTier: 'Contact sales' },
    lastVerified: '2026-05-14',
  },

  // ────────── Level AI ──────────
  'level-ai': {
    publicPricing: false,
    sourceUrl: 'https://thelevel.ai/pricing',
    error: 'Pricing page returns HTTP 404; site only offers "Schedule a demo"',
    t2t:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    t2v:  { offered: false, unit: '', price: null, currency: null,
            notes: 'TTS not a Level AI product' },
    v2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Conversation intelligence / QA is core product' },
    v2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null,
            notes: 'AgentGPT agent assist marketed; pricing not disclosed' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed' },
    packaging: { model: 'Enterprise', freeCredits: 'None disclosed', lowestTier: 'Contact sales' },
    lastVerified: '2026-05-14',
  },

  // ────────── Corover.ai ──────────
  'corover-ai': {
    publicPricing: false,
    sourceUrl: 'https://corover.ai/pricing',
    error: 'Page loads but only offers PDF download + "Talk to Our Experts"; no public prices',
    t2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'BharatGPT chatbot; pricing in downloadable PDF only' },
    t2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2t:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'BharatGPT voice agent; enterprise pricing' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed' },
    packaging: { model: 'Enterprise', freeCredits: 'None disclosed',
                 lowestTier: 'Contact sales (PDF available)' },
    lastVerified: '2026-05-14',
  },

  // ────────── Yellow.ai ──────────
  'yellow-ai': {
    publicPricing: true,
    sourceUrl: 'https://yellow.ai/pricing',
    t2t:  { offered: true, unit: 'per resolution', price: 0.99, currency: 'USD',
            notes: 'Free tier: 500 sessions/mo included; then $0.99 per resolution. Basic & Enterprise tiers = contact sales' },
    t2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2t:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'VoiceX voice agent; only available on higher tiers, no public price' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed publicly' },
    packaging: { model: 'Mixed',
                 freeCredits: '500 chat sessions/month on Free tier',
                 lowestTier: 'Free ($0/mo, 500 sessions then $0.99/resolution)' },
    lastVerified: '2026-05-14',
  },

  // ────────── Uniphore ──────────
  'uniphore': {
    publicPricing: false,
    sourceUrl: 'https://www.uniphore.com/pricing',
    error: 'Pricing page returns HTTP 404; site offers only "Book a demo"',
    t2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Conversational AI suite; enterprise-only pricing' },
    t2v:  { offered: true, unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Speech analytics / transcription core offering' },
    v2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Voice AI agents marketed; no public price' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed' },
    packaging: { model: 'Enterprise', freeCredits: 'None disclosed', lowestTier: 'Contact sales' },
    lastVerified: '2026-05-14',
  },

  // ────────── ElevenLabs ──────────
  'elevenlabs': {
    publicPricing: true,
    sourceUrl: 'https://elevenlabs.io/pricing',
    t2t:  { offered: false, unit: '', price: null, currency: null,
            notes: 'No T2T product' },
    t2v:  { offered: true, unit: 'per month subscription (credits)', price: 6, currency: 'USD',
            notes: 'Starter $6/mo = 30k credits (1 char = 1 credit). Free $0/mo (10k credits), Creator $11, Pro $99, Scale $299, Business $990' },
    v2t:  { offered: true, unit: 'credits within plan', price: 6, currency: 'USD',
            notes: 'Scribe STT included in same credit pool as Starter tier and above' },
    v2v:  { offered: true, unit: 'credits within plan', price: 6, currency: 'USD',
            notes: 'Speech-to-speech (voice changer) drawn from same credit pool' },
    telephony: { bundled: false, inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'No telephony product; Conversational AI offered separately' },
    packaging: { model: 'Subscription',
                 freeCredits: '10k credits/month on Free tier',
                 lowestTier: 'Starter $6/mo (30k credits)' },
    lastVerified: '2026-05-14',
  },

  // ────────── Kapture CX ──────────
  'kapture-cx': {
    publicPricing: false,
    sourceUrl: 'https://kapture.cx/pricing',
    error: 'Page loads but shows no prices; only "Request Pricing" / "Get Your Custom Quote" CTAs',
    t2t:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Self-service / agent-assist chat; custom quote only' },
    t2v:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2t:  { offered: 'unclear', unit: '', price: 'contact_sales', currency: null, notes: '' },
    v2v:  { offered: true, unit: '', price: 'contact_sales', currency: null,
            notes: 'Voice AI agent advertised; no public price' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Not disclosed' },
    packaging: { model: 'Enterprise', freeCredits: 'None disclosed',
                 lowestTier: 'Contact sales (modular pricing by product/users/volumes)' },
    lastVerified: '2026-05-14',
  },

  // ────────── VoiceGenie.ai ──────────
  'voicegenie-ai': {
    publicPricing: true,
    sourceUrl: 'https://voicegenie.ai/pricing',
    t2t:  { offered: false, unit: '', price: null, currency: null,
            notes: 'Voice-only product; no separate T2T tier' },
    t2v:  { offered: true, unit: 'per month subscription', price: 3000, currency: 'INR',
            notes: 'TTS bundled into per-minute voice agent allowance; Trial tier' },
    v2t:  { offered: true, unit: 'per month subscription', price: 3000, currency: 'INR',
            notes: 'STT bundled into per-minute voice agent allowance; Trial tier' },
    v2v:  { offered: true, unit: 'per month subscription', price: 3000, currency: 'INR',
            notes: 'Trial ₹3,000/mo (250 min). Starter ₹12,000 (1,000 min), Growth ₹30,000 (2,500 min), Elite ₹60,000 (5,000 min)' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Twilio listed as integration; BYO support not specified' },
    packaging: { model: 'Subscription',
                 freeCredits: '30 voice minutes over 7-day free trial',
                 lowestTier: 'Trial ₹3,000/month (250 minutes)' },
    lastVerified: '2026-05-14',
  },

  // ────────── AutoTalk ──────────
  // Domain unreachable on 2026-05-14 — entire entry is unknowns until a fresh
  // research pass confirms whether the company still operates.
  'autotalk': {
    publicPricing: false,
    sourceUrl: 'https://autotalk.ai/pricing',
    error: 'Domain unreachable (ECONNREFUSED) on 2026-05-14 for both autotalk.ai and www.autotalk.ai',
    t2t:  { offered: 'unclear', unit: '', price: null, currency: null, notes: '' },
    t2v:  { offered: 'unclear', unit: '', price: null, currency: null, notes: '' },
    v2t:  { offered: 'unclear', unit: '', price: null, currency: null, notes: '' },
    v2v:  { offered: 'unclear', unit: '', price: null, currency: null, notes: '' },
    telephony: { bundled: 'unclear', inboundPerMin: null, outboundPerMin: null,
                 byoTwilio: 'unclear', notes: 'Domain unreachable' },
    packaging: { model: 'Enterprise', freeCredits: 'Unknown', lowestTier: 'Unknown' },
    lastVerified: '2026-05-14',
  },
};

// Stack pieces in the order the UI should render them
export const STACK_PIECES = [
  { id: 't2t', label: 'T2T — Text → Text',
    description: 'LLM / chatbot text generation. The underlying language model that drives reasoning.' },
  { id: 't2v', label: 'T2V — Text → Voice',
    description: 'TTS. Synthesizing speech from text — what your agent "says".' },
  { id: 'v2t', label: 'V2T — Voice → Text',
    description: 'ASR / speech-to-text. Transcribing what the caller is saying.' },
  { id: 'v2v', label: 'V2V — Voice → Voice',
    description: 'End-to-end conversational voice agent. Often bundles T2V + V2T + LLM.' },
];

export default pricingData;
