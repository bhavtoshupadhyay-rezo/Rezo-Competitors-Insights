import { TrendingUp, Globe, Zap, ChevronRight } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';

const categoryColors = {
  'Real-time TTS':    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Conversational AI':'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Premium TTS':      'bg-green-500/20 text-green-400 border-green-500/30',
  'Enterprise TTS':   'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Empathic Voice':   'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Voice Enhancement':'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const latencyColor = (ms) => {
  if (ms <= 150) return 'text-success';
  if (ms <= 400) return 'text-warning';
  return 'text-danger';
};

const VoiceCard = ({ voice, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-secondary p-5 rounded-xl border border-gray-700 hover:border-accent cursor-pointer transition-all hover:shadow-lg hover:shadow-accent/10 animate-fade-in group flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 flex-shrink-0">
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
            <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors leading-tight">
              {voice.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{voice.creator}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {voice.isNew && (
            <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs font-medium rounded-full border border-warning/30 animate-pulse whitespace-nowrap">
              NEW
            </span>
          )}
          {voice.isTrending && (
            <span className="px-2 py-0.5 bg-success/20 text-success text-xs font-medium rounded-full border border-success/30 whitespace-nowrap">
              TRENDING
            </span>
          )}
        </div>
      </div>

      {/* Category badge */}
      <div className="mb-3">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[voice.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {voice.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 mb-4 line-clamp-2 flex-shrink-0">
        {voice.description}
      </p>

      {/* Key stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-primary rounded-lg p-2 text-center">
          <Zap size={11} className={`mx-auto mb-0.5 ${latencyColor(voice.latencyMs)}`} />
          <p className={`text-xs font-bold ${latencyColor(voice.latencyMs)}`}>{voice.latencyLabel}</p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center">
            <InfoTooltip content={glossary.latency} iconSize={9}>Latency</InfoTooltip>
          </p>
        </div>
        <div className="bg-primary rounded-lg p-2 text-center">
          <Globe size={11} className="mx-auto mb-0.5 text-accent" />
          <p className="text-xs font-bold text-white">{voice.languageCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Languages</p>
        </div>
        <div className="bg-primary rounded-lg p-2 text-center">
          <TrendingUp size={11} className="mx-auto mb-0.5 text-accent" />
          <p className="text-xs font-bold text-white">{voice.buzzScore}</p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center">
            <InfoTooltip content={glossary.buzzScore} iconSize={9}>Buzz</InfoTooltip>
          </p>
        </div>
      </div>

      {/* Audio player — stop propagation so card click doesn't fire while playing */}
      <div onClick={(e) => e.stopPropagation()} className="mb-4">
        <AudioPlayer
          audioUrl={voice.audioSampleUrl}
          demoUrl={voice.demoUrl}
          providerName={voice.creator}
          providerWebsite={voice.creatorWebsite}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {voice.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-gray-700/80 text-gray-300 text-xs rounded-md">
            {tag}
          </span>
        ))}
        {voice.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-700/80 text-gray-500 text-xs rounded-md">
            +{voice.tags.length - 3}
          </span>
        )}
      </div>

      {/* Live HF signal — only when scrapers returned data for this creator */}
      {voice.live?.totalModels > 0 && (
        <div className="mt-2 text-[10px] text-gray-500" onClick={(e) => e.stopPropagation()}>
          <a
            href={voice.live.top?.[0]?.url || 'https://huggingface.co'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700/40 hover:bg-gray-700 hover:text-gray-300"
            title="Hugging Face presence — live"
          >
            🤗 {voice.live.totalModels} models · {voice.live.totalLikes}♥
          </a>
        </div>
      )}

      {/* Footer cue */}
      <div className="mt-auto flex items-center justify-between text-xs text-gray-600 group-hover:text-gray-400 transition-colors pt-1 border-t border-gray-700/50">
        <span>{voice.pricing}</span>
        <div className="flex items-center gap-1">
          <span>Full specs</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default VoiceCard;
