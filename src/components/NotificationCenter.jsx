import { useState } from 'react';
import { X, Bell, Sparkles, DollarSign, TrendingUp, CheckCircle, Eye } from 'lucide-react';
import { notificationsData, competitorsData } from '../data/competitorsData';
import NotificationDetailModal from './NotificationDetailModal';

const NotificationCenter = ({ onClose, onAddToWatchlist, onAddToProfile }) => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_entry':
        return <Sparkles className="text-warning" size={20} />;
      case 'feature_launch':
        return <TrendingUp className="text-accent" size={20} />;
      case 'funding':
        return <DollarSign className="text-success" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_entry':
        return 'bg-warning/10 border-warning/30';
      case 'feature_launch':
        return 'bg-accent/10 border-accent/30';
      case 'funding':
        return 'bg-success/10 border-success/30';
      default:
        return 'bg-gray-700 border-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Handle adding to watchlist (for new entrants)
  const handleAddToWatchlist = (companyId) => {
    if (onAddToWatchlist && companyId) {
      onAddToWatchlist(companyId);
    }
  };

  // Handle adding details to competitor profile (for funding/features)
  const handleAddToProfile = (notification) => {
    if (onAddToProfile) {
      onAddToProfile(notification);
    }
    markAsRead(notification.id);
  };

  // Handle viewing notification details
  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  };

  // Get company data for the notification
  const getCompanyForNotification = (notification) => {
    if (notification.companyId) {
      return competitorsData.find(c => c.id === notification.companyId);
    }
    return null;
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="fixed top-20 right-6 w-full max-w-md bg-secondary rounded-xl border border-gray-700 shadow-2xl z-50 animate-fade-in">
        {/* Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Bell className="text-accent" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-400">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('new_entry')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === 'new_entry'
                  ? 'bg-warning text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              New Entries
            </button>
            <button
              onClick={() => setFilter('feature_launch')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === 'feature_launch'
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setFilter('funding')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === 'funding'
                  ? 'bg-success text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Funding
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <>
              {unreadCount > 0 && (
                <div className="p-3 bg-primary border-b border-gray-700">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-accent hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle size={14} />
                    Mark all as read
                  </button>
                </div>
              )}
              <div className="divide-y divide-gray-700">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors ${
                      !notification.read ? 'bg-primary/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg h-fit ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-white">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* View Details Button */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <button
                            onClick={() => handleViewDetails(notification)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                <Bell size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-gray-700 p-3 bg-primary">
            <button className="w-full text-sm text-accent hover:text-blue-400 transition-colors font-medium">
              View All Notifications
            </button>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          company={getCompanyForNotification(selectedNotification)}
          onClose={() => setSelectedNotification(null)}
          onAddToWatchlist={handleAddToWatchlist}
          onAddToProfile={handleAddToProfile}
        />
      )}
    </>
  );
};

export default NotificationCenter;
