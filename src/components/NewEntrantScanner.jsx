import { useState } from 'react';
import { X, Sparkles, Search, Star, TrendingUp, CheckCircle, AlertTriangle, ChevronDown, Building2, Check, Trash2 } from 'lucide-react';
import { newEntrants, categories } from '../data/competitorsData';

const NewEntrantScanner = ({ onClose, onAddToCompetitorsList, onRemoveFromList, addedCompanyIds = new Set() }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCompanies, setScannedCompanies] = useState([]);
  const [progress, setProgress] = useState(0);

  // New states for search and filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [companySearch, setCompanySearch] = useState('');
  const [scanMode, setScanMode] = useState('category'); // 'category' or 'search'

  // Track locally added companies (for immediate UI feedback)
  const [locallyAdded, setLocallyAdded] = useState(new Set());

  // Check if a company is already added
  const isCompanyAdded = (companyId) => {
    return addedCompanyIds.has(companyId) || locallyAdded.has(companyId);
  };

  // Handle adding company to the main list
  const handleAddToList = (company) => {
    if (onAddToCompetitorsList && !isCompanyAdded(company.id)) {
      const success = onAddToCompetitorsList(company);
      if (success !== false) {
        setLocallyAdded(prev => new Set([...prev, company.id]));
      }
    }
  };

  // Handle removing company from the main list
  const handleRemoveFromList = (companyId) => {
    if (onRemoveFromList) {
      const success = onRemoveFromList(companyId);
      if (success !== false) {
        // Remove from locally added set to update UI
        setLocallyAdded(prev => {
          const newSet = new Set(prev);
          newSet.delete(companyId);
          return newSet;
        });
      }
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScannedCompanies([]);

    // Simulate scanning with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedCompanies(newEntrants);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-warning" size={32} />
                New Entrant Discovery
              </h2>
              <p className="text-gray-400 mt-1">
                Scan the market for emerging competitors matching Rezo.ai's capabilities
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Scan Controls */}
          {!isScanning && scannedCompanies.length === 0 && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-warning/20 rounded-full mb-4">
                  <Search size={40} className="text-warning" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Discover New Entrants</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Search by industry category or company name to find emerging competitors in the market.
                </p>
              </div>

              {/* Search Mode Tabs */}
              <div className="flex justify-center mb-6">
                <div className="bg-primary rounded-lg p-1 border border-gray-700 inline-flex">
                  <button
                    onClick={() => setScanMode('category')}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      scanMode === 'category'
                        ? 'bg-warning text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    By Category
                  </button>
                  <button
                    onClick={() => setScanMode('search')}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      scanMode === 'search'
                        ? 'bg-warning text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    By Company Name
                  </button>
                </div>
              </div>

              {/* Search Controls */}
              <div className="max-w-2xl mx-auto">
                {scanMode === 'category' ? (
                  /* Category Dropdown */
                  <div className="bg-primary rounded-xl border border-gray-700 p-6">
                    <label className="block text-sm text-gray-400 mb-2">Select Industry Category</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-secondary text-white border border-gray-600 rounded-lg focus:outline-none focus:border-warning appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedCategory === 'All'
                        ? 'Scanning across all industry categories'
                        : `Scanning for new entrants in ${selectedCategory}`
                      }
                    </p>
                  </div>
                ) : (
                  /* Company Search Input */
                  <div className="bg-primary rounded-xl border border-gray-700 p-6">
                    <label className="block text-sm text-gray-400 mb-2">Search Company Name</label>
                    <div className="relative">
                      <Building2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        placeholder="Enter company name (e.g., VoiceFlow, Cognigy...)"
                        className="w-full pl-12 pr-4 py-3 bg-secondary text-white border border-gray-600 rounded-lg focus:outline-none focus:border-warning placeholder-gray-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Search for a specific company to check if it's a potential competitor
                    </p>
                  </div>
                )}

                {/* Scan Button */}
                <button
                  onClick={startScan}
                  disabled={scanMode === 'search' && !companySearch.trim()}
                  className="w-full mt-6 px-8 py-4 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={24} />
                  {scanMode === 'category'
                    ? `Scan ${selectedCategory === 'All' ? 'All Categories' : selectedCategory}`
                    : `Search for "${companySearch || '...'}"`
                  }
                </button>
              </div>

              {/* Scan Criteria Info */}
              <div className="mt-10 bg-primary rounded-xl border border-gray-700 p-6">
                <h4 className="text-lg font-bold text-white mb-4">What We Scan For</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Voice AI Keywords</p>
                      <p className="text-sm text-gray-400">Agentic AI, Voice Bot, Conversational AI</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Founded Date</p>
                      <p className="text-sm text-gray-400">Companies founded in last 12 months</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Funding Activity</p>
                      <p className="text-sm text-gray-400">Recent seed or Series A announcements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Feature Overlap</p>
                      <p className="text-sm text-gray-400">Match against Rezo's core capabilities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scanning Progress */}
          {isScanning && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-warning/20 rounded-full mb-6">
                <Sparkles size={48} className="text-warning animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {scanMode === 'category'
                  ? `Scanning ${selectedCategory === 'All' ? 'All Categories' : selectedCategory}...`
                  : `Searching for "${companySearch}"...`
                }
              </h3>
              <p className="text-gray-400 mb-8">
                Analyzing funding databases, product launches, and news sources
              </p>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-warning font-semibold mt-3">{progress}%</p>
              </div>
            </div>
          )}

          {/* Scan Results */}
          {!isScanning && scannedCompanies.length > 0 && (
            <div>
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium mb-1">Scan Complete</p>
                  <p className="text-sm text-gray-400">
                    Found {scannedCompanies.length} new entrants
                    {scanMode === 'category'
                      ? ` in ${selectedCategory === 'All' ? 'all categories' : selectedCategory}`
                      : ` matching "${companySearch}"`
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {scannedCompanies.map(company => (
                  <div
                    key={company.id}
                    className="bg-primary rounded-xl border border-gray-700 p-6 hover:border-warning transition-colors"
                  >
                    {/* Company Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center p-2 flex-shrink-0">
                          {(company.logo.startsWith('http') || company.logo.startsWith('/')) ? (
                            <img
                              src={company.logo}
                              alt={`${company.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <span className="text-3xl">{company.logo}</span>
                          )}
                          <div className="hidden w-full h-full items-center justify-center text-2xl font-bold text-gray-700">
                            {company.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white">{company.name}</h3>
                            <span className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-medium animate-pulse">
                              NEW
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{company.description}</p>
                        </div>
                      </div>
                      {isCompanyAdded(company.id) ? (
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-success/20 text-success rounded-lg flex items-center gap-2">
                            <Check size={16} />
                            Added
                          </div>
                          <button
                            onClick={() => handleRemoveFromList(company.id)}
                            className="px-4 py-2 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 transition-colors flex items-center gap-2"
                            title="Remove from competitors list"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToList(company)}
                          className="px-4 py-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition-colors flex items-center gap-2"
                        >
                          <Star size={16} />
                          Add to Watchlist
                        </button>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-secondary rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">Founded</p>
                        <p className="text-white font-semibold">{company.founded}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">HQ</p>
                        <p className="text-white font-semibold">{company.hq}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">Funding</p>
                        <p className="text-white font-semibold">{company.totalFunding}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">Buzz Score</p>
                        <p className="text-white font-semibold">{company.buzzScore}/100</p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="bg-secondary rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className={getMatchScoreColor(company.matchScore)} />
                          <span className="text-gray-400 text-sm">Match Score vs Rezo.ai</span>
                        </div>
                        <span className={`text-2xl font-bold ${getMatchScoreColor(company.matchScore)}`}>
                          {company.matchScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            company.matchScore >= 70 ? 'bg-success' :
                            company.matchScore >= 50 ? 'bg-warning' :
                            'bg-danger'
                          }`}
                          style={{ width: `${company.matchScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Capabilities Match */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {Object.entries(company.features).map(([key, value]) => {
                        if (typeof value === 'boolean' && value) {
                          return (
                            <div key={key} className="flex items-center gap-2 text-sm">
                              <CheckCircle size={16} className="text-success" />
                              <span className="text-gray-300">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Threat Assessment */}
                    {company.matchScore >= 70 && (
                      <div className="mt-4 bg-danger/10 border border-danger/30 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle size={18} className="text-danger flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-danger font-medium text-sm">High Match Score</p>
                          <p className="text-xs text-gray-400 mt-1">
                            This competitor shows significant overlap with Rezo's capabilities. Recommend close monitoring.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setScannedCompanies([]);
                    setProgress(0);
                    setCompanySearch('');
                    setSelectedCategory('All');
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  New Search
                </button>
                <button
                  onClick={startScan}
                  className="px-6 py-3 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewEntrantScanner;
