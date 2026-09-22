import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.data);
        
        // Mark as read in the background
        if (data.data.some(n => !n.isRead)) {
          api.put('/notifications/mark-read').catch(console.error);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Notifications</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <Bell className="w-12 h-12 mb-3 text-gray-300" />
            <p>You don't have any notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-50 flex items-start gap-4 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${!notification.isRead ? 'text-text-primary' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={() => deleteNotification(notification._id)}
                  className="text-sm text-gray-400 hover:text-danger px-2"
                >
                  Clear
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
