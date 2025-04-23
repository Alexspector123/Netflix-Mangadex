import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../store/notification.js';
import Navbar from '../components/Navbar';
import { ChevronLeft, Trash2, CheckCheck, Filter, X } from 'lucide-react';

const NotificationsPage = () => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const notificationTypes = [
    { id: 'all', label: 'All Notifications' },
    { id: 'new_content', label: 'New Content' },
    { id: 'recommendation', label: 'Recommendations' },
    { id: 'continue_watching', label: 'Continue Watching' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'unread', label: 'Unread' },
  ];

  // Load notifications on page load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const handleReadNotification = (id) => markAsRead(id);
  const handleRemoveNotification = (e, id) => { e.stopPropagation(); removeNotification(id); };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-20 h-full">
        <Navbar />

        <div className="max-w-4xl mx-auto bg-gray-900/70 rounded-xl p-6 shadow-xl mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-gray-300 hover:text-white">
                <ChevronLeft size={24} />
              </Link>
              <h1 className="text-2xl font-bold">Notifications</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Filter size={16} />
                  <span>{notificationTypes.find((t) => t.id === activeFilter)?.label || 'Filter'}</span>
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="p-2">
                      {notificationTypes.map((type) => (
                        <button
                          key={type.id}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeFilter === type.id ? 'bg-red-700' : 'hover:bg-gray-700'
                            }`}
                          onClick={() => {
                            setActiveFilter(type.id);
                            setShowFilterMenu(false);
                          }}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                  onClick={markAllAsRead}
                  disabled={!notifications.some((n) => !n.read)}
                >
                  <CheckCheck size={16} />
                  <span>Mark all read</span>
                </button>

                <button
                  className="flex items-center gap-1 px-3 py-2 bg-red-800 hover:bg-red-700 rounded-md text-sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) {
                      clearAllNotifications();
                    }
                  }}
                  disabled={notifications.length === 0}
                >
                  <Trash2 size={16} />
                  <span>Clear all</span>
                </button>
              </div>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
              <p className="text-gray-400">
                {activeFilter !== 'all'
                  ? 'Try changing your filter to see other notifications'
                  : "You'll see notifications about new releases, recommendations, and more here"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg flex items-start gap-4 hover:bg-gray-800 transition-colors cursor-pointer ${!notification.read ? 'bg-gray-800/50 border-l-4 border-red-600' : 'bg-gray-900/80'
                    }`}
                  onClick={() => handleReadNotification(notification.id)}
                >
                  {notification.image && (
                    <Link
                      to={notification.link || '#'}
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadNotification(notification.id);
                      }}
                    >
                      <img src={notification.image} alt="" className="w-16 h-16 rounded object-cover" />
                    </Link>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                        className="p-1 rounded hover:text-red-700"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-5">
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-red-500 hover:text-red-400 text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReadNotification(notification.id)
                          }}
                        >
                          View details
                        </Link>
                      )}

                      {notification.type && (
                        <span className="inline-block text-xs px-2 py-1 bg-gray-700 rounded-full">
                          {notification.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;