// Single source of truth for tooltip definitions across the platform.
// Keep entries one or two short sentences — they appear on hover.

export const glossary = {
  // ────────── Competitor Dashboard ──────────
  buzzScore:
    'Market attention 0–100. Composite of funding momentum, feature launches, news mentions, and search interest.',
  matchScore:
    "How closely a competitor's offering overlaps with Rezo's. 100 = head-to-head competitor.",
  goldStandard:
    'Rezo.ai is the baseline every competitor is measured against in this platform.',
  agentAI:
    'Vendor offers an autonomous AI Agent product (not just TTS/ASR building blocks).',
  rezoAdvantage:
    'A capability where Rezo.ai outperforms or uniquely covers vs. this competitor.',
  newEntrant:
    'Detected in the market within the last 12 months — worth flagging early.',
  watchlist:
    'Star a competitor to keep it pinned at the top and get priority notifications.',
  fieldNotes:
    'Notes from your sales / CSM team about what real customers say about a competitor.',

  // ────────── Top Voices ──────────
  modality:
    "What the model does — TTS (text→speech), ASR (speech→text), Speech-to-Speech, Voice Cloning, etc.",
  latency:
    'Time from request sent to first audio byte received. Lower = more natural conversation flow. <300ms feels human.',
  voiceCloning:
    'Generates a custom synthetic voice from a short audio sample of a real speaker.',
  streaming:
    'Audio streams back as it generates — no waiting for the full clip to render before playback.',
  voiceCharacter:
    'How the voice sounds — pitch, warmth, expressiveness, accent character.',
  qualityScore:
    'Composite of naturalness, clarity, and emotion range. 0–100.',
  naturalness:
    "How human the voice sounds — prosody, pacing, intonation. Lab-grade evaluation.",
  clarity:
    'How clearly each phoneme is articulated — important for accents and noisy environments.',
  emotionRange:
    'How well the voice expresses tone — happy, urgent, empathetic, neutral.',
  ssml:
    'Speech Synthesis Markup Language — XML tags to control pauses, emphasis, pronunciation.',
  marketPosition:
    "Vendor's standing — Leader (defining category), Challenger (gaining share), Niche (specialist), Emerging (new).",

  // ────────── Indian / Indic ──────────
  indicNative:
    "Trained from scratch on Indian-language data — not a global model with Hindi added later.",
  codeMixed:
    "Single-sentence mix of two languages, like Hinglish: 'Mera order kahan hai please?' Critical for Indian users.",
  hinglish:
    'Hindi + English mixed in one sentence. The default speaking style for most urban Indians.',
  twentyTwoLangs:
    "All 22 official scheduled languages of the Indian Constitution.",
  bharat:
    'Indian/regional markets, especially Tier 2 / Tier 3 cities where vernacular is the primary language.',

  // ────────── Language Normalization ──────────
  itn:
    'Inverse Text Normalization — turns spoken forms into written digits/symbols. "twenty twenty-six" → "2026".',
  numberNorm:
    'Converts spoken numbers to digits, including Indian formats. "one lakh fifty thousand" → "1,50,000".',
  dateTimeNorm:
    '"next monday at three" → an actual date and time. Critical for booking / scheduling agents.',
  currencyNorm:
    '"fifty rupees" → "₹50", "ten dollars" → "$10". Important for payments and billing flows.',
  piiRedaction:
    'Auto-mask sensitive data in transcripts — Aadhaar, PAN, credit card, account numbers.',
  punctuationRestore:
    'ASR output is one long blob; this adds periods, commas, question marks automatically.',
  transliteration:
    'Convert script — Devanagari ↔ Roman. "नमस्ते" ↔ "namaste".',
  customVocab:
    'Train the system on domain-specific terms — brand names, product SKUs, medical terms.',
  profanityFilter:
    'Detect and mask offensive words in transcripts and TTS output.',
  disfluency:
    'Removes "um", "uh", repeated words, false starts from clean transcripts.',

  // ────────── Compliance ──────────
  soc2:
    'SOC 2 — independent audit of security, availability, processing integrity. Type 2 = sustained over 6+ months.',
  hipaa:
    'US healthcare data protection law. Required to handle US patient health information.',
  gdpr:
    'EU data protection law. Required for any vendor handling EU citizen data.',
  ccpa:
    'California Consumer Privacy Act. US state-level data protection.',
  iso27001:
    'International security management standard. Common enterprise procurement requirement.',
  fedramp:
    'US federal government cloud security authorization. Required for selling to US gov.',
  pciDss:
    'Payment Card Industry standard. Required for handling credit card data.',
  dpdp:
    "India's Digital Personal Data Protection Act 2023. Required for Indian customer data.",

  // ────────── AI News ──────────
  newsImpact:
    "How materially this affects the competitive landscape: High = changes Rezo's positioning. Medium = informs strategy. Low = good context.",
  newsParameters:
    'Which competitor parameters this news affects — funding, features, compliance, partnerships, pricing, market position.',
};

export default glossary;
