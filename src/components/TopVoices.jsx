import { useState, useMemo } from 'react';
import { Search, Mic, TrendingUp, Globe, Zap, SlidersHorizontal, Flag } from 'lucide-react';
import VoiceCard from './VoiceCard';
import VoiceDetailModal from './VoiceDetailModal';
import { topVoicesData, voiceCategories, voiceProviders } from '../data/topVoicesData';
import { indianVoicesData, indianVoiceCategories, indianVoiceProviders } from '../data/indianVoicesData';

const TABS = [
  { id: 'global', label: 'Global Voices',      icon: Globe, count: topVoicesData.length },
  { id: 'indian', label: 'Indian Vernaculars', icon: Flag,  count: indianVoicesData.length },
];

const TopVoices = () => {
  const [activeTab,       setActiveTab]       = useState('global');
  const [searchTerm,      setSearchTerm]      = useState('');
  const [selectedCategory,setCategory]        = useState('All');
  const [selectedProvider,setProvider]        = useState('All');
  const [sortBy,          setSortBy]          = useState('buzzScore');
  const [selectedVoice,   setSelectedVoice]   = useState(null);

  // Switch dataset based on active tab
  const isIndian = activeTab === 'indian';
  const dataset    = isIndian ? indianVoicesData       : topVoicesData;
  const categories = isIndian ? indianVoiceCategories  : voiceCategories;
  const providers  = isIndian ? indianVoiceProviders   : voiceProviders;

  // Reset filters when switching tabs
  const switchTab = (id) => {
    setActiveTab(id);
    setSearchTerm('');
    setCategory('All');
    setProvider('All');
    setSortBy('buzzScore');
  };

  const filtered = useMemo(() => {
    let list = dataset.filter((v) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.creator.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat      = selectedCategory === 'All' || v.category === selectedCategory;
      const matchProvider = selectedProvider === 'All' || v.creator === selectedProvider;
      return matchSearch && matchCat && matchProvider;
    });

    list.sort((a, b) => {
      if (sortBy === 'buzzScore') return b.buzzScore - a.buzzScore;
      if (sortBy === 'latency')   return a.latencyMs - b.latencyMs;
      if (sortBy === 'quality')   return b.qualityRating - a.qualityRating;
      if (sortBy === 'languages') return b.languageCount - a.languageCount;
      if (sortBy === 'newest')    return new Date(b.launchDate) - new Date(a.launchDate);
      return 0;
    });

    return list;
  }, [dataset, searchTerm, selectedCategory, selectedProvider, sortBy]);

  const stats = useMemo(() => {
    const trending  = dataset.filter((v) => v.isTrending).length;
    const newVoices = dataset.filter((v) => v.isNew).length;
    const avgLatency = Math.round(
      dataset.reduce((s, v) => s + v.latencyMs, 0) / dataset.length
    );
    return { total: dataset.length, trending, newVoices, avgLatency };
  }, [dataset]);

  // Indic-specific stats (only when on Indian tab)
  const indianStats = useMemo(() => {
    if (!isIndian) return null;
    const indicNative = indianVoicesData.filter((v) =>
      v.trainingApproach?.toLowerCase().includes('native')
    ).length;
    const codeMixed = indianVoicesData.filter((v) => v.codeMixedSupport?.length > 0).length;
    const max22Lang = indianVoicesData.filter((v) => v.languageCount >= 22).length;
    return { indicNative, codeMixed, max22Lang };
  }, [isIndian]);

  return (
    <div className="min-h-screen bg-primary">
      {/* Section header */}
      <div className="bg-secondary border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Mic className="text-accent" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">Top Voices</h2>
              </div>
              <p className="text-gray-400 text-sm">
                {isIndian
                  ? 'Voices natively trained on Indian regional languages — built for Bharat, not adapted for it.'
                  : 'Trending AI voice models in the market — compare latency, tone, modality, languages & more'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-700 rounded">Updated May 2026</span>
            </div>
          </div>

          {/* Inner tab segmented control */}
          <div className="mt-5 inline-flex items-center gap-1 bg-primary p-1 rounded-xl border border-gray-700">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-accent text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  activeTab === id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <StatTile icon={<Mic size={16} className="text-accent" />}        bg="bg-accent/20"        value={stats.total}      label={isIndian ? 'Indic Voices' : 'Voices Tracked'} />
            <StatTile icon={<TrendingUp size={16} className="text-success" />} bg="bg-success/20"      value={stats.trending}   label="Trending Now" />
            <StatTile icon={<Zap size={16} className="text-warning" />}        bg="bg-warning/20"      value={`${stats.avgLatency}ms`} label="Avg Latency" />
            {isIndian
              ? <StatTile icon={<Flag size={16} className="text-amber-400" />} bg="bg-amber-500/20"   value={indianStats.indicNative} label="Indic-Native Trained" />
              : <StatTile icon={<Globe size={16} className="text-purple-400" />} bg="bg-purple-500/20" value={stats.newVoices}  label="New Launches" />}
          </div>

          {/* Indian-specific highlight strip */}
          {isIndian && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">Indic highlights:</span>
              <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                {indianStats.indicNative} natively trained on Indian data
              </span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20">
                {indianStats.codeMixed} support code-mixed (Hinglish, Tanglish…)
              </span>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">
                {indianStats.max22Lang} cover all 22 scheduled languages
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search & Filters */}
        <div className="bg-secondary p-5 rounded-xl border border-gray-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={15} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filter & Sort</span>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={isIndian
                  ? 'Search by voice, provider, language (Hindi, Tamil…)…'
                  : 'Search by voice name, provider, or feature…'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedProvider}
              onChange={(e) => setProvider(e.target.value)}
              className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm"
            >
              {providers.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-sm"
            >
              <option value="buzzScore">Sort: Buzz Score</option>
              <option value="latency">Sort: Lowest Latency</option>
              <option value="quality">Sort: Quality Score</option>
              <option value="languages">Sort: Most Languages</option>
              <option value="newest">Sort: Newest First</option>
            </select>
          </div>
        </div>

        {/* Results count + active filters */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-400">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {dataset.length} voices
          </p>
          <div className="flex items-center gap-2">
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setCategory('All')}
                className="flex items-center gap-1 px-2.5 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/30 hover:bg-accent/30 transition-colors"
              >
                {selectedCategory} ×
              </button>
            )}
            {selectedProvider !== 'All' && (
              <button
                onClick={() => setProvider('All')}
                className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                {selectedProvider} ×
              </button>
            )}
          </div>
        </div>

        {/* Voice cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                onClick={() => setSelectedVoice(voice)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Mic size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No voices match your filters</p>
            <button
              onClick={() => { setSearchTerm(''); setCategory('All'); setProvider('All'); }}
              className="mt-4 text-sm text-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedVoice && (
        <VoiceDetailModal
          voice={selectedVoice}
          onClose={() => setSelectedVoice(null)}
        />
      )}
    </div>
  );
};

const StatTile = ({ icon, bg, value, label }) => (
  <div className="bg-primary rounded-xl p-4 border border-gray-700 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);

export default TopVoices;
