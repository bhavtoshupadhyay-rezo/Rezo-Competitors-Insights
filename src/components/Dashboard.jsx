import { useState, useMemo } from 'react';
import { Search, Users, Sparkles, Bell, GitCompare, Info } from 'lucide-react';
import CompanyCard from './CompanyCard';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';
import CompanyDetailModal from './CompanyDetailModal';
import ComparisonModal from './ComparisonModal';
import NotificationCenter from './NotificationCenter';
import NewEntrantScanner from './NewEntrantScanner';
import FeatureLaunchTimeline from './FeatureLaunchTimeline';
import AddMoreMenu from './AddMoreMenu';
import { competitorsData, categories } from '../data/competitorsData';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('buzzScore');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  // Competitors list as state (starts with initial data, can be extended)
  const [competitors, setCompetitors] = useState(competitorsData);
  const [addedCompanyIds, setAddedCompanyIds] = useState(new Set());

  // Timestamp tracking for individual companies
  const [companyTimestamps, setCompanyTimestamps] = useState({});

  // Field Notes state for Field Intelligence system
  const [fieldNotes, setFieldNotes] = useState([
    // Sample field notes
    {
      id: 1,
      companyId: 'bland-ai',
      type: 'Feature Gap',
      observation: 'Client ABC mentioned Bland AI lacks proper Indian language support, causing issues for their APAC operations.',
      source: 'Client Call',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      companyId: 'vapi',
      type: 'Pricing',
      observation: 'Vapi pricing is usage-based, which can become expensive at scale. Client XYZ reported 3x cost increase after scaling.',
      source: 'Secondary Research',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Function to add field notes
  const handleAddFieldNote = (note) => {
    setFieldNotes(prev => [note, ...prev]);
  };

  // Function to update company timestamp
  const handleUpdateTimestamp = (companyId, timestamp) => {
    setCompanyTimestamps(prev => ({
      ...prev,
      [companyId]: timestamp
    }));
  };

  // Function to update company data (from Update Intelligence modal)
  const handleUpdateCompanyData = (companyId, updates) => {
    setCompetitors(prev => prev.map(company => {
      if (company.id !== companyId) return company;

      const updatedCompany = { ...company };

      // Apply funding updates
      if (updates.funding) {
        updatedCompany.totalFunding = updates.funding.totalFunding;
        updatedCompany.estimatedARR = updates.funding.estimatedARR;
      }

      // Apply feature updates (add new feature)
      if (updates.features) {
        updatedCompany.recentFeatures = [
          {
            name: updates.features.newFeature,
            launchDate: new Date().toISOString().split('T')[0],
            isNew: true,
            url: '#'
          },
          ...(company.recentFeatures || [])
        ];
      }

      // Apply threat updates (add new threat)
      if (updates.threats) {
        updatedCompany.painPoints = [
          {
            issue: updates.threats.newThreat,
            severity: updates.threats.severity,
            source: 'Intelligence Update'
          },
          ...(company.painPoints || [])
        ];
      }

      // Apply buzz score update
      if (updates.marketBuzz) {
        updatedCompany.buzzScore = updates.marketBuzz.newBuzzScore;
      }

      // Add last updated timestamp
      updatedCompany.lastUpdated = new Date();

      return updatedCompany;
    }));

    // Also update the selected company if it's the one being updated
    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany(prev => {
        if (!prev) return prev;
        const updatedCompany = { ...prev };

        if (updates.funding) {
          updatedCompany.totalFunding = updates.funding.totalFunding;
          updatedCompany.estimatedARR = updates.funding.estimatedARR;
        }

        if (updates.features) {
          updatedCompany.recentFeatures = [
            {
              name: updates.features.newFeature,
              launchDate: new Date().toISOString().split('T')[0],
              isNew: true,
              url: '#'
            },
            ...(prev.recentFeatures || [])
          ];
        }

        if (updates.threats) {
          updatedCompany.painPoints = [
            {
              issue: updates.threats.newThreat,
              severity: updates.threats.severity,
              source: 'Intelligence Update'
            },
            ...(prev.painPoints || [])
          ];
        }

        if (updates.marketBuzz) {
          updatedCompany.buzzScore = updates.marketBuzz.newBuzzScore;
        }

        updatedCompany.lastUpdated = new Date();

        return updatedCompany;
      });
    }
  };

  // Function to add a company from search
  const handleAddCompany = (company) => {
    console.log('Adding company:', company);
    // In a full implementation, this would add to the competitors list
  };

  // Function to add a new entrant to the main competitors list
  const handleAddNewEntrantToList = (company) => {
    // Check if already added
    if (addedCompanyIds.has(company.id)) {
      return false; // Already added
    }

    // Add to competitors list
    setCompetitors(prev => [company, ...prev]);
    setAddedCompanyIds(prev => new Set([...prev, company.id]));

    return true; // Successfully added
  };

  // Function to remove a company from the competitors list
  const handleRemoveFromList = (companyId) => {
    // Only allow removal of newly added companies, not original ones
    if (!addedCompanyIds.has(companyId)) {
      return false; // Cannot remove original companies
    }

    // Remove from competitors list
    setCompetitors(prev => prev.filter(c => c.id !== companyId));
    setAddedCompanyIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(companyId);
      return newSet;
    });

    return true; // Successfully removed
  };

  // Filter and sort competitors
  const filteredCompetitors = useMemo(() => {
    let filtered = competitors.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || company.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'buzzScore') return b.buzzScore - a.buzzScore;
      if (sortBy === 'funding') {
        const aFunding = parseFloat(a.totalFunding.replace(/[^0-9.]/g, '')) || 0;
        const bFunding = parseFloat(b.totalFunding.replace(/[^0-9.]/g, '')) || 0;
        return bFunding - aFunding;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  }, [competitors, searchTerm, selectedCategory, sortBy]);

  // Quick stats
  const stats = useMemo(() => {
    const newEntrants = competitors.filter(c => c.founded >= 2023).length;
    return {
      total: competitors.length,
      newEntrants
    };
  }, [competitors]);

  const toggleWatchlist = (companyId) => {
    setWatchlist(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Competitor Insights Platform</h1>
              <p className="text-sm text-gray-400">Rezo.ai Intelligence Hub</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Add More Menu - New Primary Action */}
              <AddMoreMenu
                onScanNewEntrants={() => setShowScanner(true)}
                onAddCompany={handleAddCompany}
              />
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <GitCompare size={18} />
                Compare
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Section purpose — orient first-time users */}
        <div className="bg-secondary border border-gray-700 rounded-xl p-4 mb-5 flex items-start gap-3">
          <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
            <Info size={16} className="text-accent" />
          </div>
          <div className="text-sm text-gray-300 leading-relaxed">
            <span className="text-white font-semibold">What is this?</span>{' '}
            Every competitor Rezo.ai tracks — funding, features, pain points, recent activity. Click any card for a full profile, or hit <span className="text-white font-medium">Compare</span> to put a competitor side-by-side with Rezo. Hover any <Info size={11} className="inline -mt-0.5 text-gray-500" /> icon for plain-language explanations.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center">
                  <InfoTooltip content="Every vendor we actively track in the voice AI / contact-center space.">
                    Total Competitors
                  </InfoTooltip>
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-accent/20 rounded-lg">
                <Users className="text-accent" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center">
                  <InfoTooltip content={glossary.newEntrant}>
                    New Entrants (2023+)
                  </InfoTooltip>
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stats.newEntrants}</p>
              </div>
              <div className="p-3 bg-warning/20 rounded-lg">
                <Sparkles className="text-warning" size={24} />
              </div>
            </div>
          </div>

        </div>

        {/* Main Content Grid - 2/3 for cards, 1/3 for timeline */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Section - Search, Filters, and Company Cards */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="bg-secondary p-6 rounded-xl border border-gray-700 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by company name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="buzzScore">Buzz Score</option>
                    <option value="funding">Funding</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Showing {filteredCompetitors.length} of {competitors.length} competitors
              </p>
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompetitors.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onClick={() => setSelectedCompany(company)}
                  onWatchlist={() => toggleWatchlist(company.id)}
                  isWatched={watchlist.includes(company.id)}
                  canRemove={addedCompanyIds.has(company.id)}
                  onRemove={handleRemoveFromList}
                />
              ))}
            </div>

            {filteredCompetitors.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No competitors found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Right Section - Feature Launch Timeline (Velocity Tracker) */}
          <div className="lg:col-span-1">
            <FeatureLaunchTimeline />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onCompare={() => {
            setShowComparison(true);
            setSelectedCompany(null);
          }}
          onUpdateCompanyData={handleUpdateCompanyData}
          fieldNotes={fieldNotes}
          onAddFieldNote={handleAddFieldNote}
          companyTimestamps={companyTimestamps}
          onUpdateTimestamp={handleUpdateTimestamp}
        />
      )}

      {showComparison && (
        <ComparisonModal
          onClose={() => setShowComparison(false)}
        />
      )}

      {showNotifications && (
        <NotificationCenter
          onClose={() => setShowNotifications(false)}
          onAddToWatchlist={toggleWatchlist}
          onAddToProfile={(notification) => {
            // Add notification data to the competitor's profile
            console.log('Adding to profile:', notification);
            // In a full implementation, this would update the competitor's data
          }}
          onViewCompany={(companyId) => {
            const company = competitorsData.find(c => c.id === companyId);
            if (company) {
              setSelectedCompany(company);
              setShowNotifications(false);
            }
          }}
        />
      )}

      {showScanner && (
        <NewEntrantScanner
          onClose={() => setShowScanner(false)}
          onAddToCompetitorsList={handleAddNewEntrantToList}
          onRemoveFromList={handleRemoveFromList}
          addedCompanyIds={addedCompanyIds}
        />
      )}
    </div>
  );
};

export default Dashboard;
