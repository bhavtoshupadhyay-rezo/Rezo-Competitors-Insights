import { X, Globe, Zap, TrendingUp, ExternalLink, Check, Shield, Mic, DollarSign, Cpu, Flag } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';

// Map compliance certs to glossary keys
const complianceTooltip = (cert) => {
  const key = cert.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (key.includes('soc2'))    return glossary.soc2;
  if (key.includes('hipaa'))   return glossary.hipaa;
  if (key.includes('gdpr'))    return glossary.gdpr;
  if (key.includes('ccpa'))    return glossary.ccpa;
  if (key.includes('iso'))     return glossary.iso27001;
  if (key.includes('fedramp')) return glossary.fedramp;
  if (key.includes('pci'))     return glossary.pciDss;
  if (key.includes('dpdp') || key.includes('india')) return glossary.dpdp;
  return null;
};

const QualityBar = ({ label, value, colorClass = 'bg-accent' }) => (
  <div>
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-semibold">{value}<span className="text-gray-500 font-normal">/100</span></span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const StatBox = ({ label, value, icon, colorClass = 'text-accent' }) => (
  <div className="bg-primary rounded-xl p-4 border border-gray-700 text-center">
    <div className={`flex items-center justify-center mb-2 ${colorClass}`}>{icon}</div>
    <p className="text-lg font-bold text-white leading-tight">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const latencyColor = (ms) => {
  if (ms <= 150) return 'text-success';
  if (ms <= 400) return 'text-warning';
  return 'text-danger';
};

const categoryColors = {
  'Real-time TTS':    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Conversational AI':'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Premium TTS':      'bg-green-500/20 text-green-400 border-green-500/30',
  'Enterprise TTS':   'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Empathic Voice':   'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Voice Enhancement':'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const VoiceDetailModal = ({ voice, onClose }) => {
  if (!voice) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-secondary rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 bg-secondary border-b border-gray-700 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 flex-shrink-0">
              <img
                src={voice.creatorLogo}
                alt={voice.creator}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-sm font-bold text-gray-700">
                {voice.creator.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{voice.name}</h2>
                {voice.isNew && (
                  <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs font-medium rounded-full border border-warning/30 animate-pulse">NEW</span>
                )}
                {voice.isTrending && (
                  <span className="px-2 py-0.5 bg-success/20 text-success text-xs font-medium rounded-full border border-success/30">TRENDING</span>
                )}
              </div>
              <p className="text-sm text-gray-400">by {voice.creator}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={voice.creatorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
            >
              <ExternalLink size={14} />
              Visit API
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Category + description */}
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryColors[voice.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {voice.category}
            </span>
            <p className="text-gray-300 text-sm leading-relaxed">{voice.description}</p>
          </div>

          {/* Audio sample */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mic size={13} />
              Voice Sample
            </h3>
            <div className="bg-primary rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400 italic mb-3 leading-relaxed">"{voice.sampleText}"</p>
              <AudioPlayer
                audioUrl={voice.audioSampleUrl}
                demoUrl={voice.demoUrl}
                providerName={voice.creator}
                providerWebsite={voice.creatorWebsite}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox
              label="Latency"
              value={voice.latencyLabel}
              icon={<Zap size={18} />}
              colorClass={latencyColor(voice.latencyMs)}
            />
            <StatBox
              label="Languages"
              value={voice.languageCount}
              icon={<Globe size={18} />}
            />
            <StatBox
              label="Quality Score"
              value={`${voice.qualityRating}/100`}
              icon={<TrendingUp size={18} />}
              colorClass="text-success"
            />
            <StatBox
              label="Buzz Score"
              value={`${voice.buzzScore}/100`}
              icon={<TrendingUp size={18} />}
              colorClass="text-warning"
            />
          </div>

          {/* Quality metrics */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <InfoTooltip content={glossary.qualityScore}>Quality Breakdown</InfoTooltip>
            </h3>
            <div className="bg-primary rounded-xl p-5 border border-gray-700 space-y-4">
              <QualityBar label={<InfoTooltip content={glossary.naturalness}>Naturalness</InfoTooltip>}    value={voice.naturalness}  colorClass="bg-accent" />
              <QualityBar label={<InfoTooltip content={glossary.clarity}>Clarity</InfoTooltip>}            value={voice.clarity}      colorClass="bg-success" />
              <QualityBar label={<InfoTooltip content={glossary.emotionRange}>Emotion Range</InfoTooltip>} value={voice.emotionRange} colorClass="bg-warning" />
              <QualityBar label="Overall Quality"                                                          value={voice.qualityRating} colorClass="bg-purple-500" />
            </div>
          </div>

          {/* Indic-specific coverage — only renders for Indian voices */}
          {voice.trainingApproach && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Flag size={13} className="text-amber-400" />
                Indic Coverage
              </h3>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl border border-amber-500/20 p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                      <InfoTooltip content={glossary.indicNative} iconSize={10}>Training Approach</InfoTooltip>
                    </p>
                    <p className="text-sm font-semibold text-white">{voice.trainingApproach}</p>
                  </div>
                  {voice.bestForRegion && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Best For</p>
                      <p className="text-sm font-semibold text-white">{voice.bestForRegion}</p>
                    </div>
                  )}
                </div>
                {voice.codeMixedSupport && voice.codeMixedSupport.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 flex items-center">
                      <InfoTooltip content={glossary.codeMixed} iconSize={10}>Code-mixed Support</InfoTooltip>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {voice.codeMixedSupport.map((cm) => (
                        <span key={cm} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 text-amber-300 text-xs font-medium rounded-lg border border-amber-500/30">
                          <Check size={11} />
                          {cm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical specs */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu size={13} />
              Technical Specifications
            </h3>
            <div className="bg-primary rounded-xl border border-gray-700 overflow-hidden">
              {[
                { label: 'What it does',         tip: glossary.modality,        value: voice.modality.join(', ') },
                { label: 'Tone',                 tip: null,                     value: voice.tone.join(', ') },
                { label: 'How it sounds',        tip: glossary.voiceCharacter,  value: voice.voiceCharacter },
                { label: 'API Type',             tip: null,                     value: voice.apiType },
                { label: 'Real-time Streaming',  tip: glossary.streaming,       value: voice.streamingSupport ? 'Yes' : 'No' },
                { label: 'Voice Cloning',        tip: glossary.voiceCloning,    value: voice.voiceCloningSupport ? 'Yes' : 'No' },
                { label: 'Standing in market',   tip: glossary.marketPosition,  value: voice.marketPosition },
                { label: 'Launch Date',          tip: null,                     value: new Date(voice.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
              ].map(({ label, tip, value }, i) => (
                <div key={label} className={`flex items-start gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-gray-800/30' : ''}`}>
                  <span className="text-xs text-gray-500 w-36 flex-shrink-0 pt-0.5 flex items-center">
                    {tip ? <InfoTooltip content={tip} iconSize={10}>{label}</InfoTooltip> : label}
                  </span>
                  <span className="text-sm text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <DollarSign size={13} />
              Pricing
            </h3>
            <div className="bg-primary rounded-xl p-4 border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Per Use</p>
                <p className="text-base font-bold text-white">{voice.pricing}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Model</p>
                <p className="text-base font-bold text-white">{voice.pricingModel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Free Tier</p>
                <p className="text-base font-bold text-success">{voice.freeCredits}</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe size={13} />
              Language Support ({voice.languageCount} languages)
            </h3>
            <div className="bg-primary rounded-xl p-4 border border-gray-700">
              <div className="flex flex-wrap gap-2">
                {voice.languages.map((lang) => (
                  <span key={lang} className="px-2.5 py-1 bg-gray-700/60 text-gray-300 text-xs rounded-md">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Use Cases</h3>
            <div className="flex flex-wrap gap-2">
              {voice.useCases.map((uc) => (
                <span key={uc} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-lg border border-accent/20">
                  <Check size={11} />
                  {uc}
                </span>
              ))}
            </div>
          </div>

          {/* Tone tags */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Voice Tone</h3>
            <div className="flex flex-wrap gap-2">
              {voice.tone.map((t) => (
                <span key={t} className="px-3 py-1.5 bg-purple-500/10 text-purple-300 text-xs font-medium rounded-lg border border-purple-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield size={13} />
              Compliance & Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {voice.compliance.map((cert) => {
                const tip = complianceTooltip(cert);
                const badge = (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg border border-success/20">
                    <Check size={11} />
                    {cert}
                  </span>
                );
                return tip
                  ? <InfoTooltip key={cert} content={tip} iconSize={10}>{badge}</InfoTooltip>
                  : <span key={cert}>{badge}</span>;
              })}
            </div>
          </div>

          {/* Feature tags */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Feature Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {voice.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDetailModal;
