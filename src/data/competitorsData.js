// Rezo.ai - The Gold Standard
export const rezoData = {
  id: 'rezo-ai',
  name: 'Rezo.ai',
  logo: '/rezo-logo.svg',
  category: 'Gold Standard',
  founded: 2018,
  hq: 'India',
  isRezo: true,
  fundingStatus: 'Funded',
  totalFunding: '$50M+',
  lastRound: '$25M Series B',
  lastRoundDate: 'Mar 2026',
  estimatedARR: '$32M+',
  investors: ['Chiratae Ventures', 'RPSG Ventures', 'Alteria Capital'],
  buzzScore: 95,
  description: 'Unified CX Agentic AI Platform - Voice-first contact center automation',
  products: [
    {
      name: 'Engage AI',
      description: 'Autonomous voice bots, multi-channel (Voice, WhatsApp, Email), 10+ vernacular languages',
      flagship: true
    },
    {
      name: 'Analyse AI',
      description: '100% call auditing, sentiment analysis, automated QA, lead scoring',
      flagship: true
    },
    {
      name: 'Dialer',
      description: 'Native predictive dialer, auto-answer, real-time monitoring',
      flagship: false
    },
    {
      name: 'DIY Platform',
      description: 'Self-serve bot builder (launch in <20 mins), emotion detection, no-code',
      flagship: false
    }
  ],
  features: {
    proprietaryLLM: true,
    nativeDialer: true,
    automatedQA: true,
    diyBotBuilder: true,
    multiLingual: true,
    lowLatency: true,
    securityCertifications: ['PCI DSS Level-2', 'ISO 27001:2022', 'ISO 27701:2019', 'SOC 2 Type 2', 'HIPAA', 'GDPR'],
    emotionDetection: true,
    realTimeTransfer: true,
    omniChannel: true,
    vernacularSupport: '10+ languages'
  },
  // Analytics Maturity - All capabilities
  analyticsMaturity: {
    baseReports: {
      callRecording: true,
      transcription: true,
      aht: true
    },
    advancedIntelligence: {
      sentimentAnalysis: true,
      emotionDetection: true,
      automatedQA: true,
      agentCoaching: true
    }
  },
  industries: ['Banking', 'NBFCs', 'Telecom', 'Automobiles', 'Retail'],
  usps: [
    'Voice-first Agentic AI with Human-like interactions',
    'Proprietary NLU/NLP engines (not just a wrapper)',
    'Extremely low latency (<1s response)',
    'Comprehensive security certifications',
    'Deep industry expertise in BFSI'
  ]
};

// Competitors Data
export const competitorsData = [
  {
    id: 'bland-ai',
    name: 'Bland AI',
    logo: 'https://www.bland.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbland-logo.e34c1a4a.png&w=128&q=75',
    category: 'Voice Bot Specialist',
    founded: 2023,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$215M',
    lastRound: '$150M Series C',
    lastRoundDate: 'Feb 2026',
    estimatedARR: '$30M+',
    investors: ['Emergence Capital', 'Scale Venture Partners', 'Y Combinator'],
    buzzScore: 88,
    description: 'Enterprise-scale, ultra-realistic AI voice calls with very low latency',
    products: [
      {
        name: 'Conversational Pathways',
        description: 'Flowchart-based scripting system for complex call scenarios',
        flagship: true
      },
      {
        name: 'Ambient Realism',
        description: 'Configurable background noise for human-like calls',
        flagship: false
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true,
      conversationalPathways: true,
      voicemailBehavior: true
    },
    // Pain Points - Market Friction
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.6★ - 89 reviews)' },
      { issue: 'Limited Analytics', severity: 'medium', source: 'Gartner Peer Insights 2024' },
      { issue: 'No Automated QA', severity: 'high', source: 'TrustRadius Enterprise Reviews' },
      { issue: 'Single Security Cert', severity: 'medium', source: 'Capterra User Feedback (Dec 2024)' }
    ],
    // Analytics Maturity
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    // Recent Feature Launches
    recentFeatures: [
      { name: 'Pathways 3.0 (Branching Logic)', launchDate: '2026-04-10', isNew: true,  url: 'https://www.bland.ai/blog/conversational-pathways' },
      { name: 'Bland Enterprise (HIPAA + SOC 2)',launchDate: '2026-02-22', isNew: true,  url: 'https://docs.bland.ai/enterprise/sso' },
      { name: 'Voice Cloning Studio',            launchDate: '2025-11-08', isNew: false, url: 'https://www.bland.ai/blog/voice-cloning' }
    ],
    // Recent Funding Rounds
    recentFundings: [
      { round: 'Series B', amount: '$40M', date: '2025-01-10', leadInvestor: 'Emergence Capital', isRecent: true },
      { round: 'Series A', amount: '$16M', date: '2024-03-15', leadInvestor: 'Scale Venture Partners', isRecent: false },
      { round: 'Seed', amount: '$9M', date: '2023-08-20', leadInvestor: 'Y Combinator', isRecent: false }
    ],
    industries: ['Sales', 'Customer Support', 'Healthcare'],
    website: 'https://bland.ai'
  },
  {
    id: 'vapi',
    name: 'Vapi',
    logo: 'https://vapi.ai/favicon.ico',
    category: 'Voice Bot Specialist',
    founded: 2023,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$80M',
    lastRound: '$60M Series B',
    lastRoundDate: 'Nov 2025',
    estimatedARR: '$25M+',
    investors: ['Bessemer Venture Partners', 'Y Combinator', 'Abstract Ventures'],
    buzzScore: 85,
    description: 'Developer-first voice AI middleware platform for massive scalability',
    products: [
      {
        name: 'Voice API',
        description: 'Model-agnostic voice AI infrastructure',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: false,
      modelAgnostic: true,
      byoModel: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.5★ - 156 reviews)' },
      { issue: 'Developer-Only Focus', severity: 'medium', source: 'Reddit r/VoiceAI Community' },
      { issue: 'No Analytics Suite', severity: 'high', source: 'Gartner Voice AI Report 2024' },
      { issue: 'No Omni-Channel', severity: 'medium', source: 'Capterra Comparison (Jan 2025)' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Vapi Squads 2.0 (Multi-agent)',  launchDate: '2026-04-18', isNew: true,  url: 'https://docs.vapi.ai/features/squads' },
      { name: 'Workflows (Visual Builder)',     launchDate: '2026-03-05', isNew: true,  url: 'https://docs.vapi.ai/workflows' },
      { name: 'Voice Cloning + Indic Languages',launchDate: '2025-12-12', isNew: false, url: 'https://docs.vapi.ai/features/multilingual' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$20M', date: '2024-06-20', leadInvestor: 'Lightspeed Ventures', isRecent: true },
      { round: 'Seed', amount: '$3M', date: '2023-10-05', leadInvestor: 'Y Combinator', isRecent: false }
    ],
    industries: ['Technology', 'Sales', 'Support'],
    website: 'https://vapi.ai'
  },
  {
    id: 'retell-ai',
    name: 'Retell AI',
    logo: 'https://www.retellai.com/favicon.ico',
    category: 'Voice Bot Specialist',
    founded: 2023,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$45M',
    lastRound: '$30M Series A extension',
    lastRoundDate: 'Jan 2026',
    estimatedARR: '$12M+',
    investors: ['Accel', 'OpenAI Startup Fund'],
    buzzScore: 78,
    description: 'Conversational voice AI for customer engagement',
    products: [
      {
        name: 'Voice Agent Platform',
        description: 'Build and deploy voice agents',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: false
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'TrustRadius (4.2★ - 67 reviews)' },
      { issue: 'Limited Enterprise Features', severity: 'medium', source: 'G2 Grid Report Q4 2024' },
      { issue: 'No Speech Analytics', severity: 'high', source: 'Forrester Wave: Contact Center AI' },
      { issue: 'Basic Security', severity: 'medium', source: 'LinkedIn Enterprise Reviews' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Retell Realtime (Sub-200ms)',    launchDate: '2026-04-02', isNew: true,  url: 'https://docs.retellai.com/realtime' },
      { name: 'Knowledge Base Connectors',      launchDate: '2026-02-14', isNew: true,  url: 'https://docs.retellai.com/features/kb' },
      { name: 'Custom LLM Integration',         launchDate: '2025-09-20', isNew: false, url: 'https://docs.retellai.com/features/custom-llm' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$15M', date: '2024-09-12', leadInvestor: 'Accel', isRecent: true },
      { round: 'Seed', amount: '$2M', date: '2023-11-08', leadInvestor: 'OpenAI Startup Fund', isRecent: false }
    ],
    industries: ['Sales', 'Customer Service'],
    website: 'https://retellai.com'
  },
  {
    id: 'observe-ai',
    name: 'Observe.AI',
    logo: 'https://www.observe.ai/hubfs/observe-logo.svg',
    category: 'Speech Analytics',
    founded: 2017,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$293M',
    lastRound: '$80M Series D',
    lastRoundDate: 'Sep 2025',
    estimatedARR: '$95M+',
    investors: ['SoftBank Vision Fund 2', 'Zoom', 'Menlo Ventures', 'Nexus Venture Partners'],
    buzzScore: 82,
    description: 'Leader in AI Agents for customer experience - Speech Analytics platform',
    products: [
      {
        name: 'Voice AI Platform',
        description: 'Real-time speech analytics and agent assistance',
        flagship: true
      },
      {
        name: 'Auto QA',
        description: 'Automated quality assurance for all calls',
        flagship: false
      }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: false,
      automatedQA: true,
      diyBotBuilder: false,
      multiLingual: true,
      lowLatency: false,
      securityCertifications: ['SOC 2 Type 2', 'GDPR', 'HIPAA'],
      emotionDetection: true,
      realTimeTransfer: false,
      omniChannel: false,
      tonalityAnalytics: true,
      empathyScoring: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.7★ - 312 reviews)' },
      { issue: 'High Latency', severity: 'medium', source: 'Gartner Peer Insights (4.4★)' },
      { issue: 'No DIY Bot Builder', severity: 'medium', source: 'Capterra User Reviews 2024' },
      { issue: 'Analytics-Only Focus', severity: 'low', source: 'IDC MarketScape 2024' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: true, automatedQA: true, agentCoaching: true }
    },
    recentFeatures: [
      { name: 'Auto QA 3.0 (LLM-Powered)',      launchDate: '2026-04-25', isNew: true,  url: 'https://www.observe.ai/auto-qa' },
      { name: 'Agentic Coaching Assistant',     launchDate: '2026-03-12', isNew: true,  url: 'https://www.observe.ai/agentic-coaching' },
      { name: 'VoiceAI Agents 2.0',             launchDate: '2025-11-15', isNew: false, url: 'https://www.observe.ai/voiceai-agents' }
    ],
    recentFundings: [
      { round: 'Series C', amount: '$125M', date: '2024-04-18', leadInvestor: 'Softbank Vision Fund', isRecent: true },
      { round: 'Series B', amount: '$54M', date: '2022-06-15', leadInvestor: 'Zoom Ventures', isRecent: false },
      { round: 'Series A', amount: '$26M', date: '2020-09-22', leadInvestor: 'Menlo Ventures', isRecent: false }
    ],
    industries: ['Contact Centers', 'BPO', 'Enterprise'],
    website: 'https://observe.ai'
  },
  {
    id: 'level-ai',
    name: 'Level AI',
    logo: 'https://thelevel.ai/favicon.ico',
    category: 'Speech Analytics',
    founded: 2019,
    hq: 'USA',
    agentAI: false,
    fundingStatus: 'Funded',
    totalFunding: '$70M',
    lastRound: '$35M Series B',
    lastRoundDate: 'Aug 2025',
    estimatedARR: '$22M+',
    investors: ['Mayfield', 'Battery Ventures'],
    buzzScore: 72,
    description: 'AI-powered contact center intelligence',
    products: [
      {
        name: 'Intelligence Cloud',
        description: 'Semantic intelligence for customer conversations',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: false,
      automatedQA: true,
      diyBotBuilder: false,
      multiLingual: false,
      lowLatency: false,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: true,
      realTimeTransfer: false,
      omniChannel: false
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'TrustRadius (4.3★ - 89 reviews)' },
      { issue: 'English-Only', severity: 'high', source: 'G2 Reviews (4.5★ - 178 reviews)' },
      { issue: 'No Bot Builder', severity: 'medium', source: 'Gartner Market Guide 2024' },
      { issue: 'Limited Integrations', severity: 'medium', source: 'Capterra Integration Survey' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: true, automatedQA: true, agentCoaching: true }
    },
    recentFeatures: [
      { name: 'AgentGPT Coaching',              launchDate: '2026-04-15', isNew: true,  url: 'https://thelevel.ai/products/agentgpt' },
      { name: 'Voice Conversation Intelligence',launchDate: '2026-01-30', isNew: true,  url: 'https://thelevel.ai/products/voice-ci' }
    ],
    recentFundings: [
      { round: 'Series B', amount: '$22M', date: '2023-03-10', leadInvestor: 'Battery Ventures', isRecent: false },
      { round: 'Series A', amount: '$13M', date: '2021-06-08', leadInvestor: 'Mayfield', isRecent: false }
    ],
    industries: ['Contact Centers', 'Enterprise'],
    website: 'https://thelevel.ai'
  },
  {
    id: 'corover-ai',
    name: 'Corover.ai',
    logo: 'https://corover.ai/wp-content/uploads/2023/08/CoRover-Logo.svg',
    category: 'Omni Channel CX',
    founded: 2016,
    hq: 'India',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$15M+',
    lastRound: '$12M Series B',
    lastRoundDate: 'Dec 2025',
    estimatedARR: '$12M+',
    investors: ['Elevation Capital'],
    buzzScore: 70,
    description: 'Conversational AI platform for customer experience',
    products: [
      {
        name: 'Omnichannel Bot',
        description: 'Multi-channel chatbot and voicebot',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: false,
      securityCertifications: ['ISO 27001'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (3.9★ - 42 reviews)' },
      { issue: 'High Latency', severity: 'medium', source: 'Reddit r/IndianStartups' },
      { issue: 'No Automated QA', severity: 'high', source: 'Capterra India Reviews 2024' },
      { issue: 'Government Focus Only', severity: 'low', source: 'Tracxn Industry Report' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'BharatGPT Voice (22 Indic Languages)', launchDate: '2026-04-05', isNew: true,  url: 'https://corover.ai/products/bharatgpt' },
      { name: 'IRCTC AskDISHA 3.0',                   launchDate: '2026-01-22', isNew: true,  url: 'https://corover.ai/case-studies/irctc' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$5M', date: '2023-07-22', leadInvestor: 'Info Edge Ventures', isRecent: false }
    ],
    industries: ['Government', 'BFSI', 'Retail'],
    website: 'https://corover.ai'
  },
  {
    id: 'yellow-ai',
    name: 'Yellow.ai',
    logo: 'https://yellow.ai/favicon.ico',
    category: 'Omni Channel CX',
    founded: 2016,
    hq: 'India',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$162M',
    lastRound: '$60M Series D',
    lastRoundDate: 'Oct 2025',
    estimatedARR: '$60M+',
    investors: ['Sapphire Ventures', 'WestBridge Capital'],
    buzzScore: 80,
    description: 'Enterprise-grade conversational AI platform',
    products: [
      {
        name: 'Dynamic AI Agents',
        description: 'Multi-lingual, omnichannel AI agents',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: false,
      securityCertifications: ['ISO 27001', 'SOC 2 Type 2', 'GDPR'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.5★ - 289 reviews)' },
      { issue: 'High Latency', severity: 'medium', source: 'Gartner Peer Insights (4.2★)' },
      { issue: 'No Automated QA', severity: 'high', source: 'TrustRadius Enterprise Survey' },
      { issue: 'Complex Pricing', severity: 'medium', source: 'Capterra Pricing Analysis 2024' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Yellow Voice Agents 2.0',        launchDate: '2026-04-20', isNew: true,  url: 'https://yellow.ai/products/voice-ai/' },
      { name: 'YellowG LLM v2 (Indic-tuned)',   launchDate: '2026-02-08', isNew: true,  url: 'https://yellow.ai/yellowg/' }
    ],
    recentFundings: [
      { round: 'Series C', amount: '$78M', date: '2021-09-15', leadInvestor: 'Sapphire Ventures', isRecent: false },
      { round: 'Series B', amount: '$20M', date: '2020-08-12', leadInvestor: 'WestBridge Capital', isRecent: false }
    ],
    industries: ['Retail', 'BFSI', 'Healthcare', 'Travel'],
    website: 'https://yellow.ai'
  },
  {
    id: 'uniphore',
    name: 'Uniphore',
    logo: 'https://www.uniphore.com/favicon.ico',
    category: 'Contact Center Tech',
    founded: 2008,
    hq: 'USA/India',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$620.9M',
    lastRound: '$400M Series E',
    lastRoundDate: 'Feb 2022',
    estimatedARR: '$150M+',
    investors: ['NEA', 'March Capital', 'Sorenson Capital'],
    buzzScore: 85,
    description: 'Conversational automation and intelligence platform',
    products: [
      {
        name: 'U-Analyze',
        description: 'Conversation analytics and insights',
        flagship: true
      },
      {
        name: 'U-Assist',
        description: 'Real-time agent assistance',
        flagship: false
      }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: false,
      automatedQA: true,
      diyBotBuilder: false,
      multiLingual: true,
      lowLatency: false,
      securityCertifications: ['SOC 2 Type 2', 'ISO 27001', 'GDPR'],
      emotionDetection: true,
      realTimeTransfer: true,
      omniChannel: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.4★ - 445 reviews)' },
      { issue: 'High Cost', severity: 'high', source: 'Gartner TCO Analysis 2024' },
      { issue: 'Complex Implementation', severity: 'medium', source: 'TrustRadius (4.1★ - 198 reviews)' },
      { issue: 'No DIY Bot Builder', severity: 'medium', source: 'Forrester Wave: CX Tech 2024' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: true, automatedQA: true, agentCoaching: true }
    },
    recentFeatures: [
      { name: 'X-Platform Integration', launchDate: '2024-12-12', isNew: true, url: 'https://www.uniphore.com/products/x-platform/' },
      { name: 'Enterprise AI Suite', launchDate: '2024-10-20', isNew: false, url: 'https://www.uniphore.com/enterprise/' }
    ],
    recentFundings: [
      { round: 'Series E', amount: '$400M', date: '2022-02-24', leadInvestor: 'NEA', isRecent: false },
      { round: 'Series D', amount: '$140M', date: '2021-03-18', leadInvestor: 'Sorenson Capital', isRecent: false },
      { round: 'Series C', amount: '$51M', date: '2019-08-22', leadInvestor: 'March Capital', isRecent: false }
    ],
    industries: ['Contact Centers', 'BFSI', 'Healthcare', 'Insurance'],
    website: 'https://uniphore.com'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    logo: 'https://elevenlabs.io/favicon.ico',
    category: 'Core Tech & Models',
    founded: 2022,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$101M',
    lastRound: '$80M Series B',
    lastRoundDate: 'Jan 2024',
    estimatedARR: '$25M+',
    investors: ['Andreessen Horowitz', 'Nat Friedman', 'Daniel Gross'],
    buzzScore: 92,
    description: 'Realistic TTS and Voice Agents platform',
    products: [
      {
        name: 'Voice Agent Platform',
        description: 'Pre-built agent templates with playground',
        flagship: true
      },
      {
        name: 'TTS API',
        description: 'Ultra-realistic text-to-speech',
        flagship: false
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: true,
      realTimeTransfer: false,
      omniChannel: false,
      voiceCloning: true,
      agentPlayground: true,
      scenarioTesting: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.8★ - 523 reviews)' },
      { issue: 'TTS Focus Only', severity: 'medium', source: 'Product Hunt Reviews 2024' },
      { issue: 'No Analytics Suite', severity: 'high', source: 'Gartner Voice Tech Report' },
      { issue: 'Limited Enterprise Features', severity: 'medium', source: 'Capterra Enterprise Survey' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: false, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: true, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Conversational AI Agents', launchDate: '2024-12-22', isNew: true, url: 'https://elevenlabs.io/conversational-ai' },
      { name: 'Voice Cloning v2', launchDate: '2024-11-15', isNew: false, url: 'https://elevenlabs.io/voice-cloning' }
    ],
    recentFundings: [
      { round: 'Series B', amount: '$80M', date: '2024-01-22', leadInvestor: 'Andreessen Horowitz', isRecent: true },
      { round: 'Series A', amount: '$19M', date: '2023-06-20', leadInvestor: 'Nat Friedman', isRecent: false },
      { round: 'Seed', amount: '$2M', date: '2022-09-15', leadInvestor: 'Credo Ventures', isRecent: false }
    ],
    industries: ['Media', 'Gaming', 'Enterprise'],
    website: 'https://elevenlabs.io'
  },
  {
    id: 'kapture-cx',
    name: 'Kapture CX',
    logo: 'https://www.kapture.cx/favicon.ico',
    category: 'Omni Channel CX',
    founded: 2011,
    hq: 'India',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$4M',
    lastRound: '$4M Series A',
    lastRoundDate: 'Aug 2024',
    estimatedARR: '$3M+',
    investors: ['Avataar Venture Partners'],
    buzzScore: 65,
    description: 'AI-powered customer experience platform',
    products: [
      {
        name: 'Omni CX',
        description: 'Multi-channel customer engagement',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: false,
      securityCertifications: ['ISO 27001'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'G2 Reviews (4.1★ - 156 reviews)' },
      { issue: 'Limited AI Capabilities', severity: 'medium', source: 'Gartner Peer Insights (3.8★)' },
      { issue: 'No Automated QA', severity: 'high', source: 'TrustRadius India Reviews' },
      { issue: 'Basic Analytics', severity: 'medium', source: 'Capterra CX Software Guide' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: false, aht: true },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'AI Chatbot v2', launchDate: '2024-11-30', isNew: false, url: 'https://www.kapture.cx/ai-chatbot' },
      { name: 'WhatsApp Integration', launchDate: '2024-09-15', isNew: false, url: 'https://www.kapture.cx/whatsapp-integration' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$4M', date: '2024-08-10', leadInvestor: 'Avataar Venture Partners', isRecent: true }
    ],
    industries: ['E-commerce', 'Retail', 'BFSI'],
    website: 'https://kapture.cx'
  },
  {
    id: 'sarvam-ai',
    name: 'Sarvam AI',
    logo: 'https://www.sarvam.ai/favicon.ico',
    category: 'Core Tech & Models',
    founded: 2023,
    hq: 'India (Bangalore)',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$41M+',
    lastRound: '$41M Series A',
    lastRoundDate: 'Dec 2023',
    estimatedARR: '$8M+',
    investors: ['Lightspeed', 'Peak XV Partners', 'Khosla Ventures'],
    buzzScore: 90,
    description: 'Indic foundation models — Bulbul TTS, Saaras ASR, Sarvam-1 LLM, Sarvam Agents',
    products: [
      { name: 'Bulbul TTS', description: 'Multilingual TTS — 11 Indian languages, REST + WebSocket streaming', flagship: true },
      { name: 'Saaras ASR', description: 'Multilingual speech-to-text with code-mixing support', flagship: true },
      { name: 'Sarvam Agents', description: 'Voice agent platform built on Sarvam-1 LLM', flagship: false },
      { name: 'Sarvam-M', description: 'Open-weight Indic LLM for downstream fine-tuning', flagship: false }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: false,
      realTimeTransfer: false,
      omniChannel: false,
      vernacularSupport: '11+ Indic languages',
      streamingTTS: true
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'Public product docs — Sarvam is API/model layer only' },
      { issue: 'No Contact Center Suite', severity: 'high', source: 'Positioning: foundation models, not CX platform' },
      { issue: 'No Automated QA', severity: 'high', source: 'API surface (docs.sarvam.ai)' },
      { issue: 'Early-stage Enterprise Maturity', severity: 'medium', source: 'Founded 2023 — limited large-deployment case studies' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: false, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Bulbul v3 (Streaming TTS)', launchDate: '2026-03-18', isNew: true, url: 'https://docs.sarvam.ai/api-reference-docs/endpoints/text-to-speech' },
      { name: 'Sarvam-M (Open-weights LLM)', launchDate: '2026-02-05', isNew: true, url: 'https://www.sarvam.ai/blogs/sarvam-m' },
      { name: 'Saaras v2 Code-Mixed ASR', launchDate: '2025-12-10', isNew: false, url: 'https://docs.sarvam.ai/api-reference-docs/endpoints/speech-to-text' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$41M', date: '2023-12-08', leadInvestor: 'Lightspeed', isRecent: true }
    ],
    industries: ['BFSI', 'Government', 'Education', 'Developer Tools'],
    website: 'https://www.sarvam.ai'
  },
  {
    id: 'gnani-ai',
    name: 'Gnani.ai',
    logo: 'https://gnani.ai/favicon.ico',
    category: 'Voice Bot Specialist',
    founded: 2016,
    hq: 'India (Bangalore)',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$15M+',
    lastRound: '$7M Series A',
    lastRoundDate: 'Sep 2019',
    estimatedARR: '$12M+',
    investors: ['Samsung Ventures', 'Info Edge Ventures', 'Wipro'],
    buzzScore: 78,
    description: 'Indic voice-first AI for contact centers — Vachana TTS, Armour ASR, 12 Indian languages',
    products: [
      { name: 'Voice AI Bot', description: 'Autonomous voice agents in 12 Indic languages for inbound/outbound', flagship: true },
      { name: 'Vachana TTS', description: 'Open-source-friendly Indic TTS engine', flagship: true },
      { name: 'Armour ASR', description: 'Telephony-optimised ASR with low-bandwidth support', flagship: false },
      { name: 'Speech Analytics', description: '100% call auditing and conversation intelligence', flagship: false }
    ],
    features: {
      proprietaryLLM: true,
      nativeDialer: true,
      automatedQA: true,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2', 'ISO 27001', 'PCI DSS'],
      emotionDetection: true,
      realTimeTransfer: true,
      omniChannel: true,
      vernacularSupport: '12 Indic languages',
      voiceBiometrics: true
    },
    painPoints: [
      { issue: 'Limited International Presence', severity: 'medium', source: 'Customer list — concentrated in India BFSI/telecom' },
      { issue: 'Outdated Funding Round', severity: 'low', source: 'Last disclosed raise 2019; reliance on revenue + strategic investors' },
      { issue: 'Smaller Voice Library vs Global Vendors', severity: 'low', source: 'Vendor comparison — focus is Indic depth, not voice count' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: true, automatedQA: true, agentCoaching: true }
    },
    recentFeatures: [
      { name: 'Vachana TTS Open Source Release', launchDate: '2026-04-08', isNew: true, url: 'https://github.com/gnani-ai/text-to-speech' },
      { name: 'Inya.ai Agentic Voice Platform', launchDate: '2026-02-20', isNew: true, url: 'https://gnani.ai/inya-ai' },
      { name: 'Generative AI Bot Suite', launchDate: '2025-10-12', isNew: false, url: 'https://gnani.ai/generative-ai' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$7M', date: '2019-09-10', leadInvestor: 'Samsung Ventures', isRecent: false },
      { round: 'Seed', amount: '$4M', date: '2017-08-15', leadInvestor: 'Info Edge Ventures', isRecent: false }
    ],
    industries: ['BFSI', 'Telecom', 'Insurance', 'Retail'],
    website: 'https://gnani.ai'
  },
  {
    id: 'nurix-ai',
    name: 'Nurix AI',
    logo: 'https://www.nurix.ai/favicon.ico',
    category: 'Voice Bot Specialist',
    founded: 2024,
    hq: 'India (Bangalore)',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$27.5M',
    lastRound: '$27.5M Seed',
    lastRoundDate: 'Aug 2024',
    estimatedARR: '$2M+',
    investors: ['Accel', 'General Catalyst'],
    buzzScore: 76,
    description: 'Enterprise voice + text AI agents from the Cult.fit / Myntra founder (Mukesh Bansal)',
    products: [
      { name: 'Nurix Voice Agents', description: 'Multilingual voice agents for sales, support and CX', flagship: true },
      { name: 'Nurix Workflows', description: 'Agentic workflow builder integrating CRM, ticketing, telephony', flagship: false }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true,
      vernacularSupport: '5+ Indic + English'
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'Product surface — bring-your-own telephony' },
      { issue: 'Very Early Stage', severity: 'high', source: 'Founded 2024; minimal public deployment data' },
      { issue: 'No Public Speech Analytics Layer', severity: 'medium', source: 'nurix.ai product pages — focus is agent build' },
      { issue: 'Unproven at Enterprise Scale', severity: 'medium', source: 'No large public BFSI/telecom case studies yet' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: false },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Nurix Voice Studio', launchDate: '2026-04-12', isNew: true, url: 'https://www.nurix.ai/' },
      { name: 'Multi-Agent Workflow Builder', launchDate: '2026-02-28', isNew: true, url: 'https://www.nurix.ai/' }
    ],
    recentFundings: [
      { round: 'Seed', amount: '$27.5M', date: '2024-08-20', leadInvestor: 'Accel', isRecent: true }
    ],
    industries: ['Sales', 'Customer Support', 'BFSI'],
    website: 'https://www.nurix.ai'
  },
  {
    id: 'verloop-io',
    name: 'Verloop.io',
    logo: 'https://www.verloop.io/favicon.ico',
    category: 'Omni Channel CX',
    founded: 2016,
    hq: 'India (Bangalore)',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$10M+',
    lastRound: '$6M Series A',
    lastRoundDate: 'Jul 2022',
    estimatedARR: '$10M+',
    investors: ['Peak XV Partners', 'B Capital'],
    buzzScore: 72,
    description: 'Customer support automation — chat + voice AI agents, strong in MENA and India',
    products: [
      { name: 'Voice AI', description: 'Voice agents for inbound CS, integrated with leading CCaaS', flagship: true },
      { name: 'Chatbot Suite', description: 'Omnichannel chat automation (WhatsApp, web, in-app)', flagship: true },
      { name: 'Co-pilot for Agents', description: 'LLM-based real-time agent assist', flagship: false }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: true,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2', 'ISO 27001', 'GDPR', 'HIPAA'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: true,
      vernacularSupport: '70+ languages (incl. 10+ Indic)'
    },
    painPoints: [
      { issue: 'No Native Dialer', severity: 'high', source: 'verloop.io product docs — telephony via partners' },
      { issue: 'Voice is Newer than Chat', severity: 'medium', source: 'Product history — chat-first since 2016, voice added later' },
      { issue: 'No Proprietary LLM', severity: 'medium', source: 'Stack relies on third-party LLMs (OpenAI, Anthropic)' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: true, emotionDetection: false, automatedQA: true, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Voice AI 2.0 (Sub-second response)', launchDate: '2026-04-22', isNew: true, url: 'https://www.verloop.io/solutions/voice-ai/' },
      { name: 'Agent Co-pilot GA', launchDate: '2026-01-15', isNew: true, url: 'https://www.verloop.io/products/copilot' }
    ],
    recentFundings: [
      { round: 'Series A', amount: '$6M', date: '2022-07-10', leadInvestor: 'Peak XV Partners', isRecent: false },
      { round: 'Seed', amount: '$3M', date: '2018-09-05', leadInvestor: 'Ant Financial', isRecent: false }
    ],
    industries: ['E-commerce', 'BFSI', 'Travel', 'Retail'],
    website: 'https://www.verloop.io'
  },
  {
    id: 'ringg-ai',
    name: 'Ringg AI',
    logo: 'https://www.ringg.ai/favicon.ico',
    category: 'Voice Bot Specialist',
    founded: 2023,
    hq: 'India (Bangalore)',
    agentAI: true,
    fundingStatus: 'Funded',
    totalFunding: '$3M+',
    lastRound: '$3M Seed',
    lastRoundDate: 'Aug 2024',
    estimatedARR: '$1M+',
    investors: ['Undisclosed angels', 'Y Combinator (W24)'],
    buzzScore: 65,
    description: 'No-code voice AI agent builder — multilingual, BYO-LLM, focused on Indian SMB + outbound',
    products: [
      { name: 'Ringg Voice Agents', description: 'No-code outbound + inbound voice agents, integrates with WhatsApp/CRM', flagship: true },
      { name: 'Ringg Studio', description: 'Visual flow builder for call scripts and pathways', flagship: false }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: true,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: true,
      lowLatency: true,
      securityCertifications: ['SOC 2 Type 2 (in progress)'],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: false,
      vernacularSupport: '8+ Indic + English',
      byoModel: true
    },
    painPoints: [
      { issue: 'No Speech Analytics', severity: 'high', source: 'ringg.ai feature surface — focus is agent build/run' },
      { issue: 'No Automated QA', severity: 'high', source: 'Product docs — manual review only' },
      { issue: 'Early-stage Security Posture', severity: 'medium', source: 'SOC 2 marked in-progress' },
      { issue: 'SMB Focus, Limited Enterprise Refs', severity: 'medium', source: 'Customer page weighted to D2C + SMB' }
    ],
    analyticsMaturity: {
      baseReports: { callRecording: true, transcription: true, aht: true },
      advancedIntelligence: { sentimentAnalysis: false, emotionDetection: false, automatedQA: false, agentCoaching: false }
    },
    recentFeatures: [
      { name: 'Ringg Pathways (Visual Flow Builder)', launchDate: '2026-04-18', isNew: true, url: 'https://www.ringg.ai/' },
      { name: 'WhatsApp + Voice Handoff', launchDate: '2026-02-10', isNew: true, url: 'https://www.ringg.ai/' }
    ],
    recentFundings: [
      { round: 'Seed', amount: '$3M', date: '2024-08-15', leadInvestor: 'Y Combinator', isRecent: true }
    ],
    industries: ['SMB', 'D2C', 'Real Estate', 'EdTech'],
    website: 'https://www.ringg.ai'
  }
];

// New entrants to be discovered
export const newEntrants = [
  {
    id: 'voicegenie-ai',
    name: 'VoiceGenie.ai',
    logo: 'https://via.placeholder.com/128/9333EA/FFFFFF?text=VG',
    category: 'Voice Bot Specialist',
    founded: 2024,
    hq: 'USA',
    agentAI: true,
    fundingStatus: 'Seed',
    totalFunding: '$3M',
    lastRound: '$3M Seed',
    lastRoundDate: 'Dec 2024',
    estimatedARR: '$500K',
    investors: ['Y Combinator'],
    buzzScore: 55,
    matchScore: 72,
    description: 'AI-powered voice assistant for SMBs',
    products: [
      {
        name: 'Genie Voice',
        description: 'No-code voice assistant builder',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: true,
      multiLingual: false,
      lowLatency: true,
      securityCertifications: [],
      emotionDetection: false,
      realTimeTransfer: false,
      omniChannel: false
    },
    industries: ['SMB', 'Restaurants'],
    website: 'https://voicegenie.ai',
    isNew: true
  },
  {
    id: 'autotalk',
    name: 'AutoTalk',
    logo: 'https://via.placeholder.com/128/3B82F6/FFFFFF?text=AT',
    category: 'Voice Bot Specialist',
    founded: 2024,
    hq: 'UK',
    agentAI: true,
    fundingStatus: 'Seed',
    totalFunding: '$2.5M',
    lastRound: '$2.5M Seed',
    lastRoundDate: 'Nov 2024',
    estimatedARR: '$300K',
    investors: ['Seedcamp'],
    buzzScore: 48,
    matchScore: 68,
    description: 'Conversational AI for automotive industry',
    products: [
      {
        name: 'AutoVoice',
        description: 'Voice AI for car dealerships',
        flagship: true
      }
    ],
    features: {
      proprietaryLLM: false,
      nativeDialer: false,
      automatedQA: false,
      diyBotBuilder: false,
      multiLingual: false,
      lowLatency: true,
      securityCertifications: [],
      emotionDetection: false,
      realTimeTransfer: true,
      omniChannel: false
    },
    industries: ['Automotive'],
    website: 'https://autotalk.ai',
    isNew: true
  }
];

// Notifications data
export const notificationsData = [
  {
    id: 1,
    type: 'new_entry',
    title: 'New Competitor Detected',
    message: 'VoiceGenie.ai detected in Voice Bot Specialist category',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    companyId: 'voicegenie-ai'
  },
  {
    id: 2,
    type: 'feature_launch',
    title: 'Feature Launch',
    message: 'Bland AI just launched Conversational Pathways Framework',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    companyId: 'bland-ai'
  },
  {
    id: 3,
    type: 'funding',
    title: 'Funding News',
    message: 'Bland AI raised $40M in Series B from Andreessen Horowitz',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    companyId: 'bland-ai'
  },
  {
    id: 4,
    type: 'feature_launch',
    title: 'Feature Launch',
    message: 'ElevenLabs just launched Agent Playground with pre-built templates',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
    companyId: 'elevenlabs'
  },
  {
    id: 5,
    type: 'funding',
    title: 'Funding News',
    message: 'Vapi raised $20M in Series A from Bessemer Venture Partners',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    read: true,
    companyId: 'vapi'
  }
];

export const categories = [
  'All',
  'Voice Bot Specialist',
  'Speech Analytics',
  'Omni Channel CX',
  'Contact Center Tech',
  'Core Tech & Models'
];
