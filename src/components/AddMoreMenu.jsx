import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Radar, X, Loader2, Building2, ExternalLink } from 'lucide-react';

const AddMoreMenu = ({ onScanNewEntrants, onAddCompany }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulated company search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated search results based on query
    const mockResults = [
      {
        id: `search-${Date.now()}-1`,
        name: searchQuery,
        description: `AI-powered conversational platform`,
        category: 'Voice Bot Specialist',
        founded: 2021,
        hq: 'San Francisco, CA',
        website: `https://${searchQuery.toLowerCase().replace(/\s/g, '')}.ai`,
        funding: '$15M',
        buzzScore: Math.floor(Math.random() * 30) + 60
      },
      {
        id: `search-${Date.now()}-2`,
        name: `${searchQuery} Labs`,
        description: `Enterprise voice AI solutions`,
        category: 'Omni Channel CX',
        founded: 2020,
        hq: 'New York, NY',
        website: `https://${searchQuery.toLowerCase().replace(/\s/g, '')}labs.com`,
        funding: '$25M',
        buzzScore: Math.floor(Math.random() * 30) + 50
      }
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddFromSearch = (company) => {
    if (onAddCompany) {
      onAddCompany(company);
    }
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Main Add More Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-accent transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 font-medium"
      >
        <Plus size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
        Add More
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-secondary rounded-xl border border-gray-700 shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
          {/* Menu Header */}
          <div className="px-4 py-3 bg-primary/50 border-b border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Add Competitors</p>
          </div>

          {/* Search by Name Option */}
          <button
            onClick={() => {
              setShowSearchModal(true);
              setIsOpen(false);
            }}
            className="w-full px-4 py-4 flex items-start gap-3 hover:bg-primary/50 transition-colors group"
          >
            <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
              <Search size={18} className="text-accent" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Search by Name</p>
              <p className="text-xs text-gray-400 mt-0.5">Find and add a specific company</p>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gray-700 mx-4" />

          {/* Scan for New Entrants Option */}
          <button
            onClick={() => {
              onScanNewEntrants();
              setIsOpen(false);
            }}
            className="w-full px-4 py-4 flex items-start gap-3 hover:bg-primary/50 transition-colors group"
          >
            <div className="p-2 bg-warning/20 rounded-lg group-hover:bg-warning/30 transition-colors">
              <Radar size={18} className="text-warning" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Scan for New Entrants</p>
              <p className="text-xs text-gray-400 mt-0.5">Auto-discover new market players</p>
            </div>
          </button>

          {/* Footer */}
          <div className="px-4 py-2 bg-primary/30 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">Powered by Web Intelligence</p>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-secondary rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Search size={20} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Search Company</h2>
                    <p className="text-sm text-gray-400">Find and add to your tracking list</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., OpenAI, Synthflow, PolyAI..."
                    className="w-full pl-10 pr-4 py-3 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent placeholder-gray-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-5 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>

              {/* Search Results */}
              <div className="mt-4">
                {isSearching && (
                  <div className="text-center py-8">
                    <Loader2 size={32} className="text-accent mx-auto animate-spin mb-3" />
                    <p className="text-gray-400">Searching databases...</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Found {searchResults.length} results for "{searchQuery}"
                    </p>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 bg-primary rounded-xl border border-gray-700 hover:border-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                              <Building2 size={20} className="text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{result.name}</h3>
                              <p className="text-sm text-gray-400 mt-0.5">{result.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{result.category}</span>
                                <span>•</span>
                                <span>Founded {result.founded}</span>
                                <span>•</span>
                                <span>{result.funding}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddFromSearch(result)}
                            className="px-3 py-1.5 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors text-sm font-medium"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <div className="text-center py-8 bg-primary/50 rounded-xl border border-gray-700">
                    <Search size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No results yet</p>
                    <p className="text-sm text-gray-500 mt-1">Press Enter or click Search to find companies</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoreMenu;
