import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ExternalLink, Volume2 } from 'lucide-react';

const AudioPlayer = ({ audioUrl, demoUrl, providerName, providerWebsite }) => {
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [loadError,   setLoadError]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const audioRef = useRef(null);

  useEffect(() => () => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  // No real provider audio → render a CTA to provider's official demo page
  if (!audioUrl || loadError) {
    const officialUrl = demoUrl || providerWebsite;
    return (
      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-3 p-2.5 bg-primary rounded-lg border border-gray-700 hover:border-accent transition-colors group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
            <Volume2 size={12} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Listen on {providerName}</p>
            <p className="text-xs text-gray-500 truncate">Official voice demo</p>
          </div>
        </div>
        <ExternalLink size={14} className="text-gray-500 group-hover:text-accent transition-colors flex-shrink-0" />
      </a>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setIsLoading(false); })
        .catch(() => { setLoadError(true); setIsLoading(false); });
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const fmt = (t) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const waveHeights = [3, 6, 10, 14, 10, 18, 12, 16, 10, 14, 8, 4];

  return (
    <div className="flex items-center gap-3 p-2.5 bg-primary rounded-lg border border-gray-700">
      {/* Animated waveform */}
      <div className="flex items-end gap-px h-5 flex-shrink-0">
        {waveHeights.map((h, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-all duration-200 ${isPlaying ? 'bg-accent wave-bar' : 'bg-gray-600'}`}
            style={{
              height: isPlaying ? `${h}px` : '3px',
              animationDelay: `${i * 55}ms`,
            }}
          />
        ))}
      </div>

      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
          isPlaying
            ? 'bg-accent text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-accent hover:text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className="w-3 h-3 border border-gray-400 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={12} />
        ) : (
          <Play size={12} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {duration > 0 ? (
          <>
            <div className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-1" onClick={handleSeek}>
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{fmt(currentTime)}</span>
              <span className="text-success">Real {providerName} sample</span>
              <span>{fmt(duration)}</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-500 truncate">Loading {providerName} sample…</p>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
        onError={() => { setLoadError(true); setIsLoading(false); setIsPlaying(false); }}
      />
    </div>
  );
};

export default AudioPlayer;
