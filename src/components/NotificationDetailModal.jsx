import { useState } from 'react';
import {
  X, Sparkles, DollarSign, TrendingUp, CheckCircle, Plus, UserPlus,
  Building2, Calendar, Globe, ExternalLink, AlertTriangle, Zap
} from 'lucide-react';

const NotificationDetailModal = ({ notification, onClose, onAddToWatchlist, onAddToProfile, company }) => {
  const [actionComplete, setActionComplete] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_entry':
        return <Sparkles className="text-warning" size={24} />;
      case 'feature_launch':
        return <TrendingUp className="text-accent" size={24} />;
      case 'funding':
        return <DollarSign className="text-success" size={24} />;
      default:
        return <Zap className="text-gray-400" size={24} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_entry':
        return 'bg-warning/20 border-warning/30 text-warning';
      case 'feature_launch':
        return 'bg-accent/20 border-accent/30 text-accent';
      case 'funding':
        return 'bg-success/20 border-success/30 text-success';
      default:
        return 'bg-gray-700 border-gray-600 text-gray-400';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'new_entry':
        return 'New Market Entrant';
      case 'feature_launch':
        return 'Feature Launch';
      case 'funding':
        return 'Funding News';
      default:
        return 'Update';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrimaryAction = () => {
    if (notification.type === 'new_entry') {
      if (onAddToWatchlist) {
        onAddToWatchlist(notification.companyId);
      }
    } else {
      if (onAddToProfile) {
        onAddToProfile(notification);
      }
    }
    setActionComplete(true);
  };

  // Generate detailed content based on notification type
  const renderDetailedContent = () => {
    switch (notification.type) {
      case 'new_entry':
        return (
          <div className="space-y-4">
            <div className="bg-warning/10 p-4 rounded-xl border border-warning/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-warning" />
                <span className="text-warning font-medium text-sm">Potential Competitor Alert</span>
              </div>
              <p className="text-gray-300 text-sm">
                A new player has been detected in the market that may compete with Rezo.ai's offerings.
                Review their profile and consider adding them to your watchlist for ongoing monitoring.
              </p>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">What We Know</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company Name</span>
                  <span className="text-white">{notification.title.replace('New Competitor Detected: ', '').replace('New Competitor Detected', notification.message.split(' ')[0])}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">Voice Bot Specialist</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Detected</span>
                  <span className="text-white">{formatTimestamp(notification.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Threat Level</span>
                  <span className="text-warning">Under Assessment</span>
                </div>
              </div>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Recommended Actions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-warning">•</span>
                  Add to watchlist for continuous monitoring
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning">•</span>
                  Research their product offerings and pricing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning">•</span>
                  Identify overlap with Rezo.ai's target market
                </li>
              </ul>
            </div>
          </div>
        );

      case 'feature_launch':
        return (
          <div className="space-y-4">
            <div className="bg-accent/10 p-4 rounded-xl border border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-accent" />
                <span className="text-accent font-medium text-sm">Competitive Intelligence</span>
              </div>
              <p className="text-gray-300 text-sm">
                A competitor has launched a new feature or product update. This may impact market positioning
                and customer expectations in the industry.
              </p>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Feature Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company</span>
                  <span className="text-white">{company?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Feature</span>
                  <span className="text-white">{notification.message.split('launched ')[1] || notification.message}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Announced</span>
                  <span className="text-white">{formatTimestamp(notification.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Impact Assessment</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Review feature capabilities and differentiation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Assess impact on Rezo.ai's competitive position
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Consider adding to competitor's feature timeline
                </li>
              </ul>
            </div>
          </div>
        );

      case 'funding':
        return (
          <div className="space-y-4">
            <div className="bg-success/10 p-4 rounded-xl border border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-success" />
                <span className="text-success font-medium text-sm">Financial Intelligence</span>
              </div>
              <p className="text-gray-300 text-sm">
                A competitor has secured new funding. This could indicate expansion plans, increased R&D,
                or aggressive market capture strategies.
              </p>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Funding Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company</span>
                  <span className="text-white">{company?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Round</span>
                  <span className="text-white">{notification.message.match(/\$[\d.]+[MBK]/)?.[0] || 'Undisclosed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investors</span>
                  <span className="text-white">{notification.message.split('from ')[1] || 'Various'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Announced</span>
                  <span className="text-white">{formatTimestamp(notification.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary p-4 rounded-xl border border-gray-700">
              <h4 className="text-white font-medium mb-3">Strategic Implications</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-success">•</span>
                  Monitor for hiring activity and expansion plans
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">•</span>
                  Watch for new product announcements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">•</span>
                  Update competitor's funding status in profile
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-primary p-4 rounded-xl border border-gray-700">
            <p className="text-gray-400">{notification.message}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getNotificationColor(notification.type)}`}>
                  {getTypeLabel(notification.type)}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{notification.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{formatTimestamp(notification.timestamp)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Main Message */}
          <div className="mb-6">
            <p className="text-gray-300">{notification.message}</p>
          </div>

          {/* Detailed Content */}
          {renderDetailedContent()}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 bg-primary/30">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Dismiss
            </button>
            <button
              onClick={handlePrimaryAction}
              disabled={actionComplete}
              className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                actionComplete
                  ? 'bg-success/20 text-success'
                  : notification.type === 'new_entry'
                    ? 'bg-warning text-white hover:bg-yellow-600'
                    : notification.type === 'funding'
                      ? 'bg-success text-white hover:bg-green-600'
                      : 'bg-accent text-white hover:bg-blue-600'
              }`}
            >
              {actionComplete ? (
                <>
                  <CheckCircle size={18} />
                  {notification.type === 'new_entry' ? 'Added to Watchlist!' : 'Added to Profile!'}
                </>
              ) : notification.type === 'new_entry' ? (
                <>
                  <UserPlus size={18} />
                  Add to Watchlist
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add to Profile
                </>
              )}
            </button>
          </div>

          {/* Company Link */}
          {company && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1">
                    {company.logo && (company.logo.startsWith('http') || company.logo.startsWith('/')) ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 size={16} className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.category}</p>
                  </div>
                </div>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
