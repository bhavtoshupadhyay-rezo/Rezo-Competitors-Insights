import { useState } from 'react';
import { Clock, Rocket, ExternalLink, DollarSign, Zap } from 'lucide-react';
import { competitorsData } from '../data/competitorsData';
import FeatureDetailModal from './FeatureDetailModal';

const FeatureLaunchTimeline = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('features');

  // Gather all recent features from all competitors
  const allFeatures = competitorsData
    .filter(company => company.recentFeatures && company.recentFeatures.length > 0)
    .flatMap(company =>
      company.recentFeatures.map(feature => ({
        ...feature,
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        launchDate: new Date(feature.launchDate)
      }))
    )
    .sort((a, b) => b.launchDate - a.launchDate)
    .slice(0, 10); // Show last 10 launches

  // Gather all recent fundings from all competitors
  const allFundings = competitorsData
    .filter(company => company.recentFundings && company.recentFundings.length > 0)
    .flatMap(company =>
      company.recentFundings.map(funding => ({
        ...funding,
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        fundingDate: new Date(funding.date)
      }))
    )
    .sort((a, b) => b.fundingDate - a.fundingDate)
    .slice(0, 10); // Show last 10 fundings

  // Check if feature is within 30 days
  const isRecent = (date) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  };

  // Check if funding is within 6 months
  const isRecentFunding = (date) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return date >= sixMonthsAgo;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const handleFeatureClick = (feature) => {
    const company = competitorsData.find(c => c.id === feature.companyId);
    setSelectedFeature(feature);
    setSelectedCompany(company);
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
    setSelectedCompany(null);
  };

  const recentFeaturesCount = allFeatures.filter(f => isRecent(f.launchDate)).length;
  const recentFundingsCount = allFundings.filter(f => isRecentFunding(f.fundingDate)).length;

  return (
    <>
      <div className="bg-secondary rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Rocket size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Recent Features & Funding</h3>
              <p className="text-xs text-gray-400">Competitor velocity tracker</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            activeTab === 'features'
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-success/20 text-success'
          }`}>
            {activeTab === 'features'
              ? `${recentFeaturesCount} new this month`
              : `${recentFundingsCount} recent`
            }
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'features'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Zap size={14} />
            Features
            {allFeatures.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === 'features' ? 'bg-purple-500/30' : 'bg-gray-600'
              }`}>
                {allFeatures.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'funding'
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <DollarSign size={14} />
            Funding
            {allFundings.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === 'funding' ? 'bg-success/30' : 'bg-gray-600'
              }`}>
                {allFundings.length}
              </span>
            )}
          </button>
        </div>

        {/* Features Tab Content */}
        {activeTab === 'features' && (
          <div className="space-y-2">
            {allFeatures.length > 0 ? (
              allFeatures.map((feature, idx) => {
                return (
                  <div
                    key={`${feature.companyId}-${idx}`}
                    onClick={() => handleFeatureClick(feature)}
                    className={`p-3 rounded-lg transition-all cursor-pointer hover:bg-primary/50 hover:scale-[1.01] ${
                      isRecent(feature.launchDate) ? 'bg-purple-500/10 border-l-2 border-purple-500' : 'bg-primary/30'
                    }`}
                  >
                    {/* Top Row - Company and Date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Company Logo */}
                        <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                          {(feature.companyLogo.startsWith('http') || feature.companyLogo.startsWith('/')) ? (
                            <img
                              src={feature.companyLogo}
                              alt={feature.companyName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs">{feature.companyLogo}</span>
                          )}
                        </div>
                        <span className="text-white font-medium text-sm">{feature.companyName}</span>
                        {isRecent(feature.launchDate) && (
                          <span className="px-1.5 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={12} />
                        <span className="text-xs">{formatDate(feature.launchDate)}</span>
                      </div>
                    </div>

                    {/* Bottom Row - Feature Name */}
                    <div className="flex items-center gap-2">
                      <ExternalLink size={12} className="text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature.name}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Zap size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No recent feature launches tracked</p>
              </div>
            )}
          </div>
        )}

        {/* Funding Tab Content */}
        {activeTab === 'funding' && (
          <div className="space-y-2">
            {allFundings.length > 0 ? (
              allFundings.map((funding, idx) => {
                return (
                  <div
                    key={`${funding.companyId}-funding-${idx}`}
                    className={`p-3 rounded-lg transition-all ${
                      isRecentFunding(funding.fundingDate) ? 'bg-success/10 border-l-2 border-success' : 'bg-primary/30'
                    }`}
                  >
                    {/* Top Row - Company and Date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Company Logo */}
                        <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                          {(funding.companyLogo.startsWith('http') || funding.companyLogo.startsWith('/')) ? (
                            <img
                              src={funding.companyLogo}
                              alt={funding.companyName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs">{funding.companyLogo}</span>
                          )}
                        </div>
                        <span className="text-white font-medium text-sm">{funding.companyName}</span>
                        {funding.isRecent && (
                          <span className="px-1.5 py-0.5 bg-success/20 text-success rounded text-xs font-medium animate-pulse">
                            RECENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={12} />
                        <span className="text-xs">{formatDate(funding.fundingDate)}</span>
                      </div>
                    </div>

                    {/* Bottom Row - Funding Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={12} className="text-success flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{funding.round}</span>
                        <span className="text-success font-bold text-sm">{funding.amount}</span>
                      </div>
                      {funding.leadInvestor && (
                        <span className="text-xs text-gray-500">Lead: {funding.leadInvestor}</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <DollarSign size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No recent funding rounds tracked</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <FeatureDetailModal
          feature={selectedFeature}
          company={selectedCompany}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default FeatureLaunchTimeline;
