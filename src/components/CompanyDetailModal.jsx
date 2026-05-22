import { useState } from 'react';
import {
  X, ExternalLink, DollarSign, TrendingUp, MapPin, Calendar,
  GitCompare, AlertTriangle, MessageSquarePlus, FileText, Clock,
  RefreshCcw, Loader2, CheckCircle, Building2, Globe, Users,
  Package, Target, Zap, Shield, BarChart3, ArrowRight, Plus,
  TrendingDown, Minus, Phone, XCircle, HelpCircle
} from 'lucide-react';
import { pricingData, STACK_PIECES } from '../data/pricingData';

// ─────────────────────── Pricing Tab Panel ───────────────────────
// Renders the verified per-vendor pricing data from src/data/pricingData.js.
// Never invents numbers — what you see is what was on the vendor's pricing
// page on `lastVerified`. Re-research instructions are in pricingData.js.
const PricingPanel = ({ company }) => {
  const p = pricingData[company.id];

  if (!p) {
    return (
      <div className="bg-primary p-6 rounded-xl border border-gray-700 text-center">
        <HelpCircle size={32} className="text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No pricing data captured for {company.name} yet.</p>
        <p className="text-xs text-gray-500 mt-1">
          Add an entry in <code className="text-accent">src/data/pricingData.js</code> after visiting their pricing page.
        </p>
      </div>
    );
  }

  const currencySymbol = (c) => (c === 'INR' ? '₹' : c === 'USD' ? '$' : '');

  const StackStatus = ({ data }) => {
    if (data.offered === false) {
      return <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400 flex items-center gap-1"><XCircle size={11} />Not offered</span>;
    }
    if (data.offered === 'unclear') {
      return <span className="px-2 py-0.5 rounded text-xs bg-warning/15 text-warning flex items-center gap-1"><HelpCircle size={11} />Unclear</span>;
    }
    if (data.price === 'contact_sales') {
      return <span className="px-2 py-0.5 rounded text-xs bg-warning/15 text-warning flex items-center gap-1"><Phone size={11} />Contact sales</span>;
    }
    return <span className="px-2 py-0.5 rounded text-xs bg-success/15 text-success flex items-center gap-1"><CheckCircle size={11} />Public</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header strip: source, last verified, status */}
      <div className="bg-primary p-4 rounded-xl border border-gray-700 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {p.publicPricing ? (
            <span className="px-2 py-1 bg-success/15 text-success border border-success/30 rounded text-xs font-medium">
              Public pricing
            </span>
          ) : (
            <span className="px-2 py-1 bg-warning/15 text-warning border border-warning/30 rounded text-xs font-medium">
              No public pricing
            </span>
          )}
          {p.internalPlaceholder && (
            <span className="px-2 py-1 bg-accent/15 text-accent border border-accent/30 rounded text-xs font-medium">
              Internal placeholder — replace with real numbers
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={11} /> Verified {p.lastVerified}
          </span>
        </div>
        {p.sourceUrl && (
          <a
            href={p.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            Source page <ExternalLink size={11} />
          </a>
        )}
      </div>

      {p.error && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-xs text-warning flex items-start gap-2">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{p.error}</span>
        </div>
      )}

      {/* Stack pieces — 4-up grid */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stack Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STACK_PIECES.map((stack) => {
            const data = p[stack.id];
            if (!data) return null;
            return (
              <div key={stack.id} className="bg-primary p-4 rounded-xl border border-gray-700">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{stack.label}</p>
                    <p className="text-xs text-gray-500 leading-snug mt-0.5">{stack.description}</p>
                  </div>
                  <StackStatus data={data} />
                </div>

                {data.offered === false ? (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {data.notes || "Not part of this vendor's product."}
                  </p>
                ) : data.price === 'contact_sales' ? (
                  <p className="text-xs text-gray-400 mt-2">
                    {data.notes || 'No public pricing — contact sales.'}
                  </p>
                ) : data.price != null ? (
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-white">
                      {currencySymbol(data.currency)}{typeof data.price === 'number' ? data.price.toLocaleString() : data.price}
                    </p>
                    <p className="text-xs text-gray-500">{data.unit}</p>
                    {data.notes && (
                      <p className="text-xs text-gray-400 mt-2 italic leading-snug">{data.notes}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic mt-2">No data yet.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Telephony */}
      <div className="bg-primary p-5 rounded-xl border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Phone size={14} className="text-accent" />
          <h4 className="text-sm font-bold text-white">Telephony</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Bundled in voice rate" value={tristate(p.telephony.bundled)} />
          <Field label="Inbound / min" value={p.telephony.inboundPerMin != null ? `$${p.telephony.inboundPerMin}` : '—'} />
          <Field label="Outbound / min" value={p.telephony.outboundPerMin != null ? `$${p.telephony.outboundPerMin}` : '—'} />
          <Field label="BYO Twilio" value={tristate(p.telephony.byoTwilio)} />
        </div>
        {p.telephony.notes && (
          <p className="text-xs text-gray-400 mt-3 italic">{p.telephony.notes}</p>
        )}
      </div>

      {/* Packaging */}
      <div className="bg-primary p-5 rounded-xl border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Package size={14} className="text-accent" />
          <h4 className="text-sm font-bold text-white">Packaging</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Pricing model" value={p.packaging.model} />
          <Field label="Lowest tier" value={p.packaging.lowestTier} />
          <Field label="Free credits" value={p.packaging.freeCredits} />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm text-white">{value || '—'}</p>
  </div>
);

const tristate = (v) => {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  return '—';
};


const CompanyDetailModal = ({ company, onClose, onCompare, fieldNotes = [], onAddFieldNote, companyTimestamps = {}, onUpdateTimestamp, onUpdateCompanyData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showIntelForm, setShowIntelForm] = useState(false);
  const [featureFundingTab, setFeatureFundingTab] = useState('features');
  const [intelForm, setIntelForm] = useState({
    type: 'Feature Gap',
    observation: '',
    source: 'Client Call'
  });

  // Update Now state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({
    funding: false,
    features: false,
    threats: false,
    marketBuzz: false
  });
  const [selectedUpdates, setSelectedUpdates] = useState({
    funding: true,
    features: true,
    threats: true,
    marketBuzz: true
  });
  const [lastUpdated, setLastUpdated] = useState(companyTimestamps[company.id] || null);

  // Generate simulated new data (in real app, this would come from API)
  const generateNewFunding = () => {
    const currentVal = parseFloat(company.totalFunding.replace(/[^0-9.]/g, '')) || 0;
    const increase = Math.floor(Math.random() * 15) + 5; // 5-20M increase
    return `$${currentVal + increase}M`;
  };

  const generateNewARR = () => {
    const currentVal = parseFloat(company.estimatedARR.replace(/[^0-9.]/g, '')) || 0;
    const increase = Math.floor(Math.random() * 8) + 2; // 2-10M increase
    return `$${currentVal + increase}M`;
  };

  const generateNewBuzzScore = () => {
    const change = Math.floor(Math.random() * 10) - 3; // -3 to +7 change
    return Math.min(100, Math.max(0, company.buzzScore + change));
  };

  const generateNewFeature = () => {
    const possibleFeatures = [
      'AI Agent Analytics Dashboard',
      'Multi-tenant Architecture',
      'Custom Voice Cloning',
      'Real-time Sentiment Analysis',
      'Advanced Call Routing',
      'Webhook API v2',
      'Mobile SDK Launch',
      'Enterprise SSO v2'
    ];
    return possibleFeatures[Math.floor(Math.random() * possibleFeatures.length)];
  };

  const generateNewThreat = () => {
    const threats = [
      { issue: 'Expanding into APAC market aggressively', severity: 'high' },
      { issue: 'Launched competitive pricing tier', severity: 'medium' },
      { issue: 'Hired key talent from industry leader', severity: 'medium' },
      { issue: 'Partnership with major cloud provider', severity: 'high' }
    ];
    return threats[Math.floor(Math.random() * threats.length)];
  };

  // Simulated new values (in production, these would come from real-time API calls)
  const newFunding = generateNewFunding();
  const newARR = generateNewARR();
  const newBuzzScore = generateNewBuzzScore();
  const newFeature = generateNewFeature();
  const newThreat = generateNewThreat();

  // Available updates with sources and exact values
  const updateOptions = [
    {
      id: 'funding',
      label: 'Funding & Financials',
      description: 'Total funding, latest round, ARR estimates',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      sources: ['Crunchbase', 'PitchBook', 'Company Press Releases'],
      lastUpdate: 'Jan 8, 2025',
      changes: [
        { field: 'Total Funding', current: company.totalFunding, new: newFunding },
        { field: 'Est. ARR', current: company.estimatedARR, new: newARR },
        { field: 'Funding Status', current: company.fundingStatus, new: company.fundingStatus }
      ]
    },
    {
      id: 'features',
      label: 'Product & Features',
      description: 'New feature launches, product updates',
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      sources: ['Company Blog', 'Product Hunt', 'Tech News'],
      lastUpdate: 'Jan 9, 2025',
      changes: [
        {
          field: 'New Feature Detected',
          currentFeatures: company.recentFeatures || [],
          new: newFeature,
          isAddition: true,
          additionOnly: true,
          showFeaturesList: true
        }
      ]
    },
    {
      id: 'threats',
      label: 'Competitive Threats',
      description: 'Market positioning, customer wins/losses',
      icon: Shield,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      sources: ['LinkedIn', 'G2 Reviews', 'Industry Reports'],
      lastUpdate: 'Jan 7, 2025',
      changes: [
        {
          field: 'New Threat Alert',
          currentThreats: company.painPoints || [],
          new: newThreat.issue,
          severity: newThreat.severity,
          isAddition: true,
          additionOnly: true,
          showThreatsList: true
        }
      ]
    },
    {
      id: 'marketBuzz',
      label: 'Market Buzz Score',
      description: 'Social signals, news mentions, hiring activity',
      icon: BarChart3,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      sources: ['Twitter/X', 'LinkedIn', 'Google News', 'Glassdoor'],
      lastUpdate: 'Jan 10, 2025',
      changes: [
        {
          field: 'Buzz Score',
          current: company.buzzScore,
          new: newBuzzScore,
          trend: newBuzzScore > company.buzzScore ? 'up' : newBuzzScore < company.buzzScore ? 'down' : 'same'
        }
      ]
    }
  ];

  // Toggle update selection
  const toggleUpdateSelection = (id) => {
    setSelectedUpdates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Select/Deselect all
  const toggleSelectAll = () => {
    const allSelected = Object.values(selectedUpdates).every(v => v);
    const newValue = !allSelected;
    setSelectedUpdates({
      funding: newValue,
      features: newValue,
      threats: newValue,
      marketBuzz: newValue
    });
  };

  const BuzzMeter = ({ score }) => {
    const getColor = () => {
      if (score >= 80) return 'text-success';
      if (score >= 60) return 'text-accent';
      return 'text-warning';
    };

    const getLabel = () => {
      if (score >= 80) return 'Hot';
      if (score >= 60) return 'Moderate';
      return 'Emerging';
    };

    return (
      <div className="relative">
        <svg className="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - score / 100)}`}
            className={`${getColor()} transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getColor()}`}>{score}</span>
          <span className="text-xs text-gray-400">{getLabel()}</span>
        </div>
      </div>
    );
  };

  // Pain Point severity colors
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return null;
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Open Update Modal
  const handleUpdateNow = () => {
    setShowUpdateModal(true);
  };

  // Execute selected updates
  const executeUpdates = async () => {
    setIsUpdating(true);
    setUpdateProgress({ funding: false, features: false, threats: false, marketBuzz: false });

    // Build updates object based on selected items
    const updates = {};

    // Update only selected items
    if (selectedUpdates.funding) {
      await new Promise(resolve => setTimeout(resolve, 800));
      updates.funding = {
        totalFunding: newFunding,
        estimatedARR: newARR
      };
      setUpdateProgress(prev => ({ ...prev, funding: true }));
    }

    if (selectedUpdates.features) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updates.features = {
        newFeature: newFeature
      };
      setUpdateProgress(prev => ({ ...prev, features: true }));
    }

    if (selectedUpdates.threats) {
      await new Promise(resolve => setTimeout(resolve, 700));
      updates.threats = {
        newThreat: newThreat.issue,
        severity: newThreat.severity
      };
      setUpdateProgress(prev => ({ ...prev, threats: true }));
    }

    if (selectedUpdates.marketBuzz) {
      await new Promise(resolve => setTimeout(resolve, 600));
      updates.marketBuzz = {
        newBuzzScore: newBuzzScore
      };
      setUpdateProgress(prev => ({ ...prev, marketBuzz: true }));
    }

    const newTimestamp = new Date();
    setLastUpdated(newTimestamp);

    // Actually update the company data
    if (onUpdateCompanyData && Object.keys(updates).length > 0) {
      onUpdateCompanyData(company.id, updates);
    }

    if (onUpdateTimestamp) {
      onUpdateTimestamp(company.id, newTimestamp);
    }

    // Keep modal open briefly to show completion
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsUpdating(false);
    setShowUpdateModal(false);
  };

  // Count selected updates
  const selectedCount = Object.values(selectedUpdates).filter(v => v).length;

  const handleSubmitIntel = () => {
    if (intelForm.observation.trim() && onAddFieldNote) {
      onAddFieldNote({
        ...intelForm,
        id: Date.now(),
        timestamp: new Date(),
        companyId: company.id
      });
      setIntelForm({ type: 'Feature Gap', observation: '', source: 'Client Call' });
      setShowIntelForm(false);
    }
  };

  const companyFieldNotes = fieldNotes.filter(note => note.companyId === company.id);

  // Default data timestamp (simulating when data was last synced)
  const defaultDataTimestamp = new Date('2025-01-10T09:30:00');

  // Get display timestamp - either from update or default
  const getDisplayTimestamp = () => {
    if (lastUpdated) return lastUpdated;
    return defaultDataTimestamp;
  };

  // Format timestamp for display
  const formatTimestamp = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Timestamp Badge Component - Always shows timestamp
  const TimestampBadge = () => {
    const timestamp = getDisplayTimestamp();
    const isRecent = lastUpdated !== null;

    return (
      <span className={`px-2 py-0.5 text-xs rounded-full border flex items-center gap-1 ${
        isRecent
          ? 'bg-success/10 text-success border-success/20'
          : 'bg-gray-700/50 text-gray-400 border-gray-600'
      }`}>
        <Clock size={10} />
        {formatTimestamp(timestamp)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-3 flex-shrink-0">
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
                  <span className="text-4xl">{company.logo}</span>
                )}
                <div className="hidden w-full h-full items-center justify-center text-3xl font-bold text-gray-700">
                  {company.name.charAt(0)}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{company.name}</h2>
                <p className="text-gray-400 mt-1">{company.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Last Updated Indicator & Update Now Button */}
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
                    <Clock size={14} className="text-success" />
                    <span className="text-xs text-success font-medium">
                      Updated: {formatTimestamp(lastUpdated)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleUpdateNow}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-success/20 text-success hover:bg-success/30"
                >
                  <RefreshCcw size={18} />
                  Update Now
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('fieldNotes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'fieldNotes'
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileText size={16} />
              Field Notes
              {companyFieldNotes.length > 0 && (
                <span className="px-2 py-0.5 bg-warning/20 text-warning rounded-full text-xs">
                  {companyFieldNotes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'pricing'
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <DollarSign size={16} />
              Pricing
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <>
              {/* Corporate Profile - Quick Info */}
              <div className="bg-primary p-5 rounded-xl border border-gray-700 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-accent" />
                  Corporate Profile
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Founded</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {company.founded}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Headquarters</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      {company.hq}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent font-medium flex items-center gap-2 hover:underline"
                    >
                      <Globe size={14} />
                      Visit Site
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      {company.category}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="md:col-span-2 space-y-6">

                  {/* Live Metrics - Funding & ARR with Timestamps */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Funding Card */}
                    <div className="bg-primary p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-success" />
                          <span className="text-sm text-gray-400">Total Funding</span>
                        </div>
                        <TimestampBadge />
                      </div>
                      <p className="text-2xl font-bold text-white">{company.totalFunding}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-1 bg-success/20 text-success rounded text-xs">
                          {company.fundingStatus}
                        </span>
                        <span className="text-xs text-gray-500">{company.lastRound}</span>
                      </div>
                    </div>

                    {/* ARR Card */}
                    <div className="bg-primary p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className="text-warning" />
                          <span className="text-sm text-gray-400">Est. ARR</span>
                        </div>
                        <TimestampBadge />
                      </div>
                      <p className="text-2xl font-bold text-white">{company.estimatedARR}</p>
                      <p className="text-xs text-gray-500 mt-2">Annual recurring revenue</p>
                    </div>
                  </div>

                  {/* Investors */}
                  <div className="bg-primary p-5 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <DollarSign size={18} className="text-success" />
                      Key Investors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {company.investors.map((investor, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-sm"
                        >
                          {investor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PAIN POINTS - Market Friction Section */}
                  {company.painPoints && company.painPoints.length > 0 && (
                    <div className="bg-red-950/30 p-5 rounded-xl border border-red-500/30">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-400" />
                        Market Friction
                        <span className="text-xs font-normal text-gray-400 ml-2">Known Pain Points</span>
                      </h3>
                      <div className="space-y-2">
                        {company.painPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${getSeverityStyle(point.severity)} flex items-center justify-between`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${
                                point.severity === 'high' ? 'bg-red-400' :
                                point.severity === 'medium' ? 'bg-amber-400' : 'bg-yellow-400'
                              }`} />
                              <span className="font-medium text-sm">{point.issue}</span>
                            </div>
                            <span className="px-2 py-1 bg-black/30 rounded text-xs">
                              Source: {point.source}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Features & Funding - Tabbed Timeline */}
                  {((company.recentFeatures && company.recentFeatures.length > 0) || (company.recentFundings && company.recentFundings.length > 0)) && (
                    <div className="bg-primary p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Clock size={18} className="text-purple-400" />
                          Recent Features & Funding
                        </h3>
                        <TimestampBadge />
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setFeatureFundingTab('features')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            featureFundingTab === 'features'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Zap size={14} />
                            Features
                            {company.recentFeatures?.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-purple-500/30 rounded text-xs">
                                {company.recentFeatures.length}
                              </span>
                            )}
                          </span>
                        </button>
                        <button
                          onClick={() => setFeatureFundingTab('funding')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            featureFundingTab === 'funding'
                              ? 'bg-success/20 text-success border border-success/30'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <DollarSign size={14} />
                            Funding
                            {company.recentFundings?.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-success/30 rounded text-xs">
                                {company.recentFundings.length}
                              </span>
                            )}
                          </span>
                        </button>
                      </div>

                      {/* Features Tab Content */}
                      {featureFundingTab === 'features' && (
                        <div className="space-y-3">
                          {company.recentFeatures && company.recentFeatures.length > 0 ? (
                            company.recentFeatures.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-gray-700"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 text-center">
                                    <span className="text-xs text-gray-500 block">
                                      {new Date(feature.launchDate).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold text-white">
                                      {new Date(feature.launchDate).getDate()}
                                    </span>
                                  </div>
                                  <div className="h-8 w-px bg-gray-700" />
                                  <span className="text-white">{feature.name}</span>
                                </div>
                                {feature.isNew && (
                                  <span className="px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium animate-pulse">
                                    NEW
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <Zap size={24} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No recent feature launches tracked</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Funding Tab Content */}
                      {featureFundingTab === 'funding' && (
                        <div className="space-y-3">
                          {company.recentFundings && company.recentFundings.length > 0 ? (
                            company.recentFundings.map((funding, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-gray-700"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 text-center">
                                    <span className="text-xs text-gray-500 block">
                                      {new Date(funding.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold text-white">
                                      {new Date(funding.date).getDate()}
                                    </span>
                                  </div>
                                  <div className="h-8 w-px bg-gray-700" />
                                  <div>
                                    <span className="text-white font-medium">{funding.round}</span>
                                    <span className="text-success ml-2 font-bold">{funding.amount}</span>
                                    {funding.leadInvestor && (
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        Lead: {funding.leadInvestor}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {funding.isRecent && (
                                  <span className="px-2 py-0.5 bg-success/20 text-success rounded text-xs font-medium animate-pulse">
                                    RECENT
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <DollarSign size={24} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No recent funding rounds tracked</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Product Suite */}
                  {company.products && company.products.length > 0 && (
                    <div className="bg-primary p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Package size={18} className="text-accent" />
                        Product Suite
                      </h3>
                      <div className="space-y-3">
                        {company.products.map((product, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${
                              product.flagship
                                ? 'bg-accent/10 border-accent/30'
                                : 'bg-secondary border-gray-700'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-white">{product.name}</h4>
                              {product.flagship && (
                                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">
                                  Flagship
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{product.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Industries */}
                  {company.industries && company.industries.length > 0 && (
                    <div className="bg-primary p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target size={18} className="text-warning" />
                        Target Industries
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {company.industries.map((industry, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-secondary border border-gray-700 text-white rounded-lg text-sm"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Buzz Meter */}
                  <div className="bg-primary p-5 rounded-xl border border-gray-700">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                      <span>Market Buzz</span>
                      <TimestampBadge />
                    </h3>
                    <div className="flex justify-center">
                      <BuzzMeter score={company.buzzScore} />
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Social signals & market activity
                    </p>
                  </div>

                  {/* CSAT Score */}
                  <div className="bg-primary p-5 rounded-xl border border-gray-700">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                      <span>CSAT Score</span>
                      <TimestampBadge />
                    </h3>
                    <div className="flex justify-center">
                      <div className="relative">
                        <svg className="transform -rotate-90 w-28 h-28">
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-700"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 48}`}
                            strokeDashoffset={`${2 * Math.PI * 48 * (1 - (company.csatScore || 78) / 100)}`}
                            className={`${
                              (company.csatScore || 78) >= 80 ? 'text-success' :
                              (company.csatScore || 78) >= 60 ? 'text-accent' :
                              'text-warning'
                            } transition-all duration-1000`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-2xl font-bold ${
                            (company.csatScore || 78) >= 80 ? 'text-success' :
                            (company.csatScore || 78) >= 60 ? 'text-accent' :
                            'text-warning'
                          }`}>{company.csatScore || 78}%</span>
                          <span className="text-xs text-gray-400">
                            {(company.csatScore || 78) >= 80 ? 'Excellent' :
                             (company.csatScore || 78) >= 60 ? 'Good' :
                             'Average'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Customer satisfaction rating
                    </p>
                    {company.g2Rating && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">G2 Rating</span>
                          <span className="text-warning font-medium">★ {company.g2Rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Threat Level for New Entrants */}
                  {company.matchScore && (
                    <div className="bg-warning/10 p-5 rounded-xl border border-warning/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-warning">Threat Level</h3>
                        <TimestampBadge />
                      </div>
                      <div className="text-3xl font-bold text-warning mb-2">{company.matchScore}%</div>
                      <p className="text-xs text-gray-400">
                        Overlap with Rezo.ai capabilities
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={onCompare}
                      className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <GitCompare size={18} />
                      Compare with Rezo.ai
                    </button>

                    <button
                      onClick={() => setShowIntelForm(true)}
                      className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <MessageSquarePlus size={18} />
                      Contribute Intel
                    </button>

                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <ExternalLink size={18} />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'fieldNotes' && (
            /* Field Notes Tab - Internal Intelligence */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Internal Intelligence</h3>
                  <p className="text-sm text-gray-400 mt-1">CS Wiki & Field observations</p>
                </div>
                <button
                  onClick={() => setShowIntelForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquarePlus size={16} />
                  Add Note
                </button>
              </div>

              {companyFieldNotes.length === 0 ? (
                <div className="bg-primary p-8 rounded-xl border border-gray-700 text-center">
                  <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No field notes yet</p>
                  <p className="text-sm text-gray-500">
                    Add observations from client calls, research, or news articles
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyFieldNotes.map((note) => (
                    <div key={note.id} className="bg-primary p-4 rounded-xl border border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          note.type === 'Pricing' ? 'bg-green-500/20 text-green-400' :
                          note.type === 'Feature Gap' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {note.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(note.timestamp)}
                        </span>
                      </div>
                      <p className="text-white mb-3">{note.observation}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Source:</span>
                        <span className="px-2 py-1 bg-gray-700 rounded">{note.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pricing' && <PricingPanel company={company} />}
        </div>
      </div>

      {/* Contribute Intel Modal */}
      {showIntelForm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Contribute Intel</h3>
              <button
                onClick={() => setShowIntelForm(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Insight Type</label>
                <select
                  value={intelForm.type}
                  onChange={(e) => setIntelForm({ ...intelForm, type: e.target.value })}
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="Pricing">Pricing</option>
                  <option value="Feature Gap">Feature Gap</option>
                  <option value="Service Issue">Service Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Observation</label>
                <textarea
                  value={intelForm.observation}
                  onChange={(e) => setIntelForm({ ...intelForm, observation: e.target.value })}
                  placeholder="e.g., Client X mentioned they are moving away from this competitor due to support issues..."
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Source</label>
                <select
                  value={intelForm.source}
                  onChange={(e) => setIntelForm({ ...intelForm, source: e.target.value })}
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="Client Call">Client Call</option>
                  <option value="Secondary Research">Secondary Research</option>
                  <option value="News Article">News Article</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowIntelForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitIntel}
                  disabled={!intelForm.observation.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Intel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Now Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <RefreshCcw size={20} className="text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Update Intelligence</h2>
                    <p className="text-sm text-gray-400">Select data to refresh for {company.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  disabled={isUpdating}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Update Options */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Select All */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  {selectedCount} of {updateOptions.length} selected
                </span>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-accent hover:text-blue-400 transition-colors"
                >
                  {Object.values(selectedUpdates).every(v => v) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {updateOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedUpdates[option.id];
                  const isComplete = isUpdating && updateProgress[option.id];
                  const isLoading = isUpdating && isSelected && !updateProgress[option.id];

                  return (
                    <div
                      key={option.id}
                      className={`rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-primary border-accent/50'
                          : 'bg-primary/50 border-gray-700'
                      }`}
                    >
                      {/* Header - Clickable */}
                      <div
                        onClick={() => !isUpdating && toggleUpdateSelection(option.id)}
                        className={`p-4 ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800/30'} rounded-t-xl`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox / Status */}
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isComplete
                              ? 'bg-success border-success'
                              : isSelected
                                ? 'bg-accent border-accent'
                                : 'border-gray-600'
                          }`}>
                            {isComplete ? (
                              <CheckCircle size={14} className="text-white" />
                            ) : isLoading ? (
                              <Loader2 size={14} className="text-white animate-spin" />
                            ) : isSelected ? (
                              <CheckCircle size={14} className="text-white" />
                            ) : null}
                          </div>

                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${option.bgColor} flex-shrink-0`}>
                            <Icon size={18} className={option.color} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium">{option.label}</h4>
                              <span className="text-xs text-gray-500">Last: {option.lastUpdate}</span>
                            </div>

                            {/* Sources */}
                            <div className="flex flex-wrap gap-1.5">
                              {option.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded text-xs"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Changes Preview - Always visible when selected */}
                      {isSelected && option.changes && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
                          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Data Changes Preview</p>
                          <div className="space-y-2">
                            {option.changes.map((change, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-gray-800/50 rounded-lg"
                              >
                                {/* Features List View */}
                                {change.showFeaturesList ? (
                                  <div className="space-y-2">
                                    <span className="text-xs text-gray-400">{change.field}:</span>

                                    {/* Current Features */}
                                    {change.currentFeatures?.length > 0 && (
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Current features:</p>
                                        {change.currentFeatures.map((feature, fIdx) => (
                                          <div key={fIdx} className="flex items-center gap-2 px-2 py-1 bg-gray-700/50 rounded border border-gray-600">
                                            <span className="text-xs text-gray-300">{feature.name}</span>
                                            {feature.isNew && (
                                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Recent</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* New Feature to Add */}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Plus size={14} className="text-success flex-shrink-0" />
                                      <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded border border-success/20 flex-1">
                                        <Plus size={10} className="text-success" />
                                        <span className="text-xs font-medium text-success">{change.new}</span>
                                        <span className="ml-auto px-1.5 py-0.5 bg-success/20 text-success rounded text-xs">NEW</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : change.showThreatsList ? (
                                  /* Threats List View */
                                  <div className="space-y-2">
                                    <span className="text-xs text-gray-400">{change.field}:</span>

                                    {/* Current Threats */}
                                    {change.currentThreats?.length > 0 && (
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Current threats tracked:</p>
                                        {change.currentThreats.map((threat, tIdx) => (
                                          <div key={tIdx} className="flex items-center gap-2 px-2 py-1 bg-gray-700/50 rounded border border-gray-600">
                                            <span className="text-xs text-gray-300">{threat.issue}</span>
                                            <span className={`ml-auto px-1.5 py-0.5 rounded text-xs ${
                                              threat.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                              {threat.severity}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* New Threat to Add */}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Plus size={14} className="text-success flex-shrink-0" />
                                      <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded border border-success/20 flex-1">
                                        <Plus size={10} className="text-success" />
                                        <span className="text-xs font-medium text-success">{change.new}</span>
                                        <span className={`ml-auto px-1.5 py-0.5 rounded text-xs ${
                                          change.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                          {change.severity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : change.additionOnly ? (
                                  /* Generic Addition Only (fallback) */
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 min-w-[100px]">{change.field}:</span>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded border border-gray-600">
                                      <span className="text-xs text-gray-300">{change.current}</span>
                                    </div>
                                    <Plus size={14} className="text-success flex-shrink-0" />
                                    <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded border border-success/20">
                                      <Plus size={10} className="text-success" />
                                      <span className="text-xs font-medium text-success">{change.new}</span>
                                    </div>
                                  </div>
                                ) : (
                                  /* Standard Replace View */
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 min-w-[100px]">{change.field}:</span>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
                                      {change.isAddition ? (
                                        <Minus size={10} className="text-gray-500" />
                                      ) : null}
                                      <span className="text-xs text-red-400 line-through">{change.current}</span>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-500 flex-shrink-0" />
                                    <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded border border-success/20">
                                      {change.isAddition && <Plus size={10} className="text-success" />}
                                      {change.trend === 'up' && <TrendingUp size={10} className="text-success" />}
                                      {change.trend === 'down' && <TrendingDown size={10} className="text-red-400" />}
                                      <span className={`text-xs font-medium ${change.trend === 'down' ? 'text-red-400' : 'text-success'}`}>
                                        {change.new}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Severity badge for non-list views */}
                                {change.severity && !change.showThreatsList && !change.showFeaturesList && (
                                  <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                                    change.severity === 'high'
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {change.severity}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 bg-secondary flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeUpdates}
                  disabled={isUpdating || selectedCount === 0}
                  className="flex-1 px-4 py-3 bg-success text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={18} />
                      Update {selectedCount} Item{selectedCount !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailModal;
