import { useState } from 'react';
import { X, Check, XCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { rezoData, competitorsData } from '../data/competitorsData';

const ComparisonModal = ({ onClose }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitorsData[0]);

  const comparisonFeatures = [
    { key: 'proprietaryLLM', label: 'Proprietary LLM/NLU', critical: true },
    { key: 'nativeDialer', label: 'Native Predictive Dialer', critical: true },
    { key: 'automatedQA', label: '100% Automated QA Coverage', critical: true },
    { key: 'diyBotBuilder', label: 'DIY Bot Builder (<20 min launch)', critical: true },
    { key: 'multiLingual', label: 'Multi-lingual Support', critical: false },
    { key: 'lowLatency', label: 'Low Latency (<1s)', critical: true },
    { key: 'emotionDetection', label: 'Emotion Detection', critical: false },
    { key: 'realTimeTransfer', label: 'Real-time Agent Transfer', critical: false },
    { key: 'omniChannel', label: 'Omni-channel Support', critical: false },
  ];

  // Analytics Maturity features for comparison
  const analyticsMaturityFeatures = {
    baseReports: [
      { key: 'callRecording', label: 'Call Recording', isTableStakes: true },
      { key: 'transcription', label: 'Transcription', isTableStakes: true },
      { key: 'aht', label: 'Average Handle Time (AHT)', isTableStakes: true },
    ],
    advancedIntelligence: [
      { key: 'sentimentAnalysis', label: 'Sentiment Analysis', isTableStakes: false },
      { key: 'emotionDetection', label: 'Emotion Detection', isTableStakes: false },
      { key: 'automatedQA', label: 'Automated QA', isTableStakes: false },
      { key: 'agentCoaching', label: 'Agent Coaching', isTableStakes: false },
    ],
  };

  const FeatureRow = ({ feature, rezoValue, competitorValue }) => {
    const rezoHas = rezoValue === true;
    const competitorHas = competitorValue === true;
    const isGap = rezoHas && !competitorHas;

    return (
      <tr className={`border-b border-gray-700 ${isGap ? 'bg-success/5' : ''}`}>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{feature.label}</span>
            {feature.critical && (
              <span className="px-2 py-0.5 bg-danger/20 text-danger rounded text-xs font-medium">
                Critical
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-4 text-center">
          {rezoHas ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <Check size={18} className="text-success" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <XCircle size={18} className="text-gray-500" />
              </div>
            </div>
          )}
        </td>
        <td className="py-4 px-4 text-center">
          {competitorHas ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <Check size={18} className="text-success" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center">
                <XCircle size={18} className="text-danger" />
              </div>
              {isGap && (
                <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">
                  Rezo Advantage
                </span>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  };

  // Analytics Maturity Row Component
  const AnalyticsMaturityRow = ({ feature, rezoValue, competitorValue, isTableStakes }) => {
    const rezoHas = rezoValue === true;
    const competitorHas = competitorValue === true;
    const isGap = rezoHas && !competitorHas;

    return (
      <tr className={`border-b border-gray-700 ${isGap ? 'bg-success/5' : ''}`}>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{feature.label}</span>
            {isTableStakes && (
              <span className="px-2 py-0.5 bg-gray-600 text-gray-300 rounded text-xs">
                Standard
              </span>
            )}
          </div>
        </td>
        <td className="py-3 px-4 text-center">
          {rezoHas ? (
            <Check size={18} className="text-success mx-auto" />
          ) : (
            <XCircle size={18} className="text-gray-500 mx-auto" />
          )}
        </td>
        <td className="py-3 px-4 text-center">
          {competitorHas ? (
            <Check size={18} className="text-success mx-auto" />
          ) : (
            <div className="flex justify-center items-center gap-2">
              <XCircle size={18} className="text-danger" />
              {isGap && !isTableStakes && (
                <span className="px-2 py-0.5 bg-success/20 text-success rounded text-xs">
                  Gap
                </span>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  };

  const calculateGapScore = () => {
    let rezoAdvantages = 0;
    let total = 0;

    comparisonFeatures.forEach(feature => {
      const rezoHas = rezoData.features[feature.key] === true;
      const competitorHas = selectedCompetitor.features[feature.key] === true;

      if (rezoHas && !competitorHas) {
        rezoAdvantages++;
      }
      if (rezoHas || competitorHas) {
        total++;
      }
    });

    return total > 0 ? Math.round((rezoAdvantages / total) * 100) : 0;
  };

  // Calculate Analytics Maturity Score
  const calculateAnalyticsMaturityScore = (company) => {
    if (!company.analyticsMaturity) return 0;
    const { baseReports, advancedIntelligence } = company.analyticsMaturity;
    const baseCount = Object.values(baseReports).filter(Boolean).length;
    const advancedCount = Object.values(advancedIntelligence).filter(Boolean).length;
    // Base reports worth 30%, Advanced worth 70%
    return Math.round((baseCount / 3) * 30 + (advancedCount / 4) * 70);
  };

  const gapScore = calculateGapScore();
  const rezoAnalyticsScore = calculateAnalyticsMaturityScore(rezoData);
  const competitorAnalyticsScore = calculateAnalyticsMaturityScore(selectedCompetitor);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">Feature Comparison</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Competitor Selector */}
          <div className="flex items-center gap-4">
            <label className="text-gray-400 font-medium">Compare against:</label>
            <select
              value={selectedCompetitor.id}
              onChange={(e) => {
                const competitor = competitorsData.find(c => c.id === e.target.value);
                setSelectedCompetitor(competitor);
              }}
              className="flex-1 max-w-md px-4 py-3 bg-primary text-white border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
            >
              {competitorsData.map(competitor => (
                <option key={competitor.id} value={competitor.id}>
                  {competitor.name} - {competitor.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Gap Analysis Summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Competitive Gap Score</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-success">{gapScore}%</span>
                <span className="text-gray-400 mb-1">advantage</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${gapScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-primary p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Security Certifications</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-white">
                  {rezoData.features.securityCertifications.length}
                </span>
                <span className="text-gray-400 mb-1">vs</span>
                <span className="text-3xl font-bold text-gray-500">
                  {selectedCompetitor.features.securityCertifications?.length || 0}
                </span>
              </div>
            </div>

            <div className="bg-primary p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Market Positioning</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-success">
                  {rezoData.buzzScore}
                </span>
                <span className="text-gray-400 mb-1">vs</span>
                <span className="text-3xl font-bold text-gray-500">
                  {selectedCompetitor.buzzScore}
                </span>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium mb-1">Comparison Key</p>
              <p className="text-xs text-gray-400">
                Green highlights indicate features where Rezo.ai has a competitive advantage.
                Critical features are marked with a red badge and are essential for enterprise deployments.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-primary rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="py-4 px-4 text-left">
                    <span className="text-gray-400 font-medium">Feature</span>
                  </th>
                  <th className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2">
                        {(rezoData.logo.startsWith('http') || rezoData.logo.startsWith('/')) ? (
                          <img src={rezoData.logo} alt={`${rezoData.name} logo`} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-2xl">{rezoData.logo}</span>
                        )}
                      </div>
                      <span className="text-white font-bold">{rezoData.name}</span>
                      <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-xs font-medium">
                        Gold Standard
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2">
                        {(selectedCompetitor.logo.startsWith('http') || selectedCompetitor.logo.startsWith('/')) ? (
                          <img src={selectedCompetitor.logo} alt={`${selectedCompetitor.name} logo`} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-2xl">{selectedCompetitor.logo}</span>
                        )}
                      </div>
                      <span className="text-white font-bold">{selectedCompetitor.name}</span>
                      <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                        {selectedCompetitor.category}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map(feature => (
                  <FeatureRow
                    key={feature.key}
                    feature={feature}
                    rezoValue={rezoData.features[feature.key]}
                    competitorValue={selectedCompetitor.features[feature.key]}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ANALYTICS MATURITY SECTION */}
          <div className="mt-8 bg-purple-950/30 rounded-xl border border-purple-500/30 overflow-hidden">
            <div className="bg-purple-900/30 p-4 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 size={24} className="text-purple-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Analytics Maturity</h3>
                    <p className="text-sm text-gray-400">Base Reports vs. Advanced Intelligence</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Rezo.ai</p>
                    <p className="text-2xl font-bold text-success">{rezoAnalyticsScore}%</p>
                  </div>
                  <div className="text-gray-500">vs</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{selectedCompetitor.name}</p>
                    <p className="text-2xl font-bold text-gray-400">{competitorAnalyticsScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            <table className="w-full">
              <tbody>
                {/* Base Reports Section */}
                <tr className="bg-gray-800/50">
                  <td colSpan={3} className="py-3 px-4">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                      Base Reports
                      <span className="text-xs font-normal text-gray-500">(Table Stakes - What everyone has)</span>
                    </span>
                  </td>
                </tr>
                {analyticsMaturityFeatures.baseReports.map(feature => (
                  <AnalyticsMaturityRow
                    key={feature.key}
                    feature={feature}
                    rezoValue={rezoData.analyticsMaturity?.baseReports?.[feature.key]}
                    competitorValue={selectedCompetitor.analyticsMaturity?.baseReports?.[feature.key]}
                    isTableStakes={true}
                  />
                ))}

                {/* Advanced Intelligence Section */}
                <tr className="bg-purple-900/30">
                  <td colSpan={3} className="py-3 px-4">
                    <span className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                      Advanced Intelligence
                      <span className="text-xs font-normal text-purple-400">(Deep Insights - Competitive Differentiators)</span>
                    </span>
                  </td>
                </tr>
                {analyticsMaturityFeatures.advancedIntelligence.map(feature => (
                  <AnalyticsMaturityRow
                    key={feature.key}
                    feature={feature}
                    rezoValue={rezoData.analyticsMaturity?.advancedIntelligence?.[feature.key]}
                    competitorValue={selectedCompetitor.analyticsMaturity?.advancedIntelligence?.[feature.key]}
                    isTableStakes={false}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Security Certifications Comparison */}
          <div className="mt-8 bg-primary rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Security & Compliance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-1">
                    {(rezoData.logo.startsWith('http') || rezoData.logo.startsWith('/')) ? (
                      <img src={rezoData.logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs">{rezoData.logo}</span>
                    )}
                  </div>
                  {rezoData.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rezoData.features.securityCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-1">
                    {(selectedCompetitor.logo.startsWith('http') || selectedCompetitor.logo.startsWith('/')) ? (
                      <img src={selectedCompetitor.logo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs">{selectedCompetitor.logo}</span>
                    )}
                  </div>
                  {selectedCompetitor.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitor.features.securityCertifications?.length > 0 ? (
                    selectedCompetitor.features.securityCertifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium"
                      >
                        {cert}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No certifications listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mt-8 bg-success/10 border border-success/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-success mb-4">Key Competitive Advantages</h3>
            <ul className="space-y-3">
              {comparisonFeatures
                .filter(f => rezoData.features[f.key] && !selectedCompetitor.features[f.key])
                .map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-medium">{feature.label}</span>
                      {feature.critical && (
                        <span className="ml-2 text-xs text-success">Critical Feature Gap</span>
                      )}
                    </div>
                  </li>
                ))}
              {/* Add analytics maturity advantages */}
              {rezoAnalyticsScore > competitorAnalyticsScore && (
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Superior Analytics Maturity</span>
                    <span className="ml-2 text-xs text-success">
                      {rezoAnalyticsScore - competitorAnalyticsScore}% higher capability
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
