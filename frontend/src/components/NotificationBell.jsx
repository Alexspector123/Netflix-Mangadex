import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleReadNotification = (id) => markAsRead(id);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative text-white flex items-center justify-center"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-200 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Notifications</h3>
            <Link to="/notifications" className="text-sm text-red-500 hover:text-red-400" onClick={() => setIsOpen(false)}>
              See all
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No notifications yet</div>
          ) : (
            <div>
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-gray-800/50' : ''
                  }`}
                  onClick={() => handleReadNotification(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {notification.image && (
                      <img src={notification.image} alt="" className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="text-sm text-white">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && <span className="w-2 h-2 bg-red-600 rounded-full ml-auto mt-2"></span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 text-center border-t border-gray-800">
            <Link to="/notifications" className="text-sm text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
