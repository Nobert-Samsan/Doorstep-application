import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  
  // Notice we don't automatically mark as read now, user wants a "Mark All as Read" button
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setMarkedRead(true);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        // Optimistic UI, assuming there might not be a clear-all endpoint, we clear locally or loop.
        // If there isn't an endpoint, we'll just clear locally for the demo.
        setNotifications([]);
        toast.success("All notifications cleared");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const getNotifType = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('booking')) return 'booking';
    if (t.includes('route')) return 'en-route';
    if (t.includes('quotation') || t.includes('quote')) return 'quotation';
    if (t.includes('job')) return 'job-started';
    if (t.includes('payment')) return 'payment';
    if (t.includes('message')) return 'message';
    return 'system';
  };
  
  const getIcon = (type) => {
    switch(type) {
      case 'booking': return '✅';
      case 'en-route': return '🚗';
      case 'quotation': return '📄';
      case 'job-started': return '⚡';
      case 'payment': return '💳';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'booking': return 'BOOKING';
      case 'en-route': return 'EN ROUTE';
      case 'quotation': return 'QUOTATION';
      case 'job-started': return 'JOB';
      case 'payment': return 'PAYMENT';
      case 'message': return 'MESSAGE';
      default: return 'SYSTEM';
    }
  };

  const getActionLabel = (type) => {
    switch(type) {
      case 'booking': return 'View Booking →';
      case 'en-route': return 'View Booking →';
      case 'quotation': return 'Review Quotation →';
      case 'job-started': return 'Track Job →';
      case 'payment': return 'View Receipt →';
      case 'message': return 'Open Chat →';
      default: return 'View Details →';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTabCategory = (type) => {
    if (type === 'booking' || type === 'en-route' || type === 'job-started') return 'Bookings';
    if (type === 'message') return 'Messages';
    if (type === 'payment' || type === 'quotation') return 'Payments'; // or group quotations in bookings
    return 'System';
  };
  
  // Fallback categorizations for tabs if needed
  const filterCounts = {
    'All': notifications.length,
    'Bookings': notifications.filter(n => ['booking', 'en-route', 'job-started'].includes(getNotifType(n.title))).length,
    'Messages': notifications.filter(n => getNotifType(n.title) === 'message').length,
    'Payments': notifications.filter(n => ['payment', 'quotation'].includes(getNotifType(n.title))).length,
    'System': notifications.filter(n => getNotifType(n.title) === 'system').length,
  };

  const filteredNotifications = notifications.filter(n => {
    if (unreadOnly && n.isRead) return false;
    if (activeTab === 'All') return true;
    const type = getNotifType(n.title);
    if (activeTab === 'Bookings' && !['booking', 'en-route', 'job-started'].includes(type)) return false;
    if (activeTab === 'Messages' && type !== 'message') return false;
    if (activeTab === 'Payments' && !['payment', 'quotation'].includes(type)) return false;
    if (activeTab === 'System' && type !== 'system') return false;
    return true;
  });

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

  return (
    <>
      <style>{`
        .notifications-page {
          background: #F8F6F3;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 64px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .main-content {
            padding: 20px 16px 80px;
          }
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #1C1917;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mark-all-btn {
          padding: 9px 18px;
          background: white;
          border: 1.5px solid #E7E5E4;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #57534E;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .mark-all-btn:hover {
          border-color: #EA580C;
          color: #EA580C;
          background: #FFF7ED;
        }
        .clear-all-btn {
          padding: 9px 18px;
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #DC2626;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .clear-all-btn:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
        }

        .unread-banner {
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
          border: 1px solid #FED7AA;
          border-left: 4px solid #EA580C;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .unread-banner-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .unread-banner-icon {
          width: 36px;
          height: 36px;
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .unread-banner-text {
          font-size: 14px;
          font-weight: 600;
          color: #92400E;
        }
        .unread-banner-sub {
          font-size: 12px;
          color: #B45309;
          margin-top: 2px;
        }
        .unread-count-badge {
          background: #EA580C;
          color: white;
          font-size: 13px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          flex-shrink: 0;
        }

        .filter-tabs {
          background: white;
          border-radius: 14px;
          border: 1px solid #F0EDE9;
          padding: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .filter-tabs::-webkit-scrollbar {
          display: none;
        }
        .filter-tab {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #78716C;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
        }
        .filter-tab:hover {
          background: #F8F6F3;
          color: #1C1917;
        }
        .filter-tab.active {
          background: linear-gradient(135deg, rgba(234,88,12,0.1), rgba(194,65,12,0.08));
          color: #C2410C;
          font-weight: 700;
          border: 1px solid rgba(234,88,12,0.2);
        }
        .tab-count {
          background: #F5F2EF;
          color: #78716C;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 8px;
          min-width: 18px;
          text-align: center;
        }
        .filter-tab.active .tab-count {
          background: rgba(234,88,12,0.15);
          color: #C2410C;
        }

        @media (max-width: 640px) {
          .filter-tabs {
            padding: 4px;
            gap: 2px;
          }
          .filter-tab {
            padding: 6px 12px;
            font-size: 12px;
            gap: 5px;
          }
        }
        .notifications-grid {
          display: block;
          width: 100%;
        }
        .left-column {
          width: 100%;
          width: 100%;
        }
          .notifications-grid {
            grid-template-columns: 1fr;
          }
        }

        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .results-text {
          font-size: 13px;
          color: #78716C;
          font-weight: 500;
        }
        .results-text span {
          font-weight: 700;
          color: #1C1917;
        }
        .unread-only-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #78716C;
          cursor: pointer;
        }
        .toggle-switch {
          width: 36px;
          height: 20px;
          background: #E7E5E4;
          border-radius: 10px;
          position: relative;
          transition: background 0.2s;
          cursor: pointer;
        }
        .toggle-switch.on { background: #EA580C; }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle-switch.on::after { left: 19px; }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .notification-item {
          background: white;
          border-radius: 14px;
          border: 1px solid #F0EDE9;
          padding: 16px 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all 0.15s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .notification-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.07);
          border-color: #E7E5E4;
          transform: translateX(2px);
        }
        .notification-item.unread {
          background: linear-gradient(135deg, #FFFAF7, white);
          border-left: 3px solid #EA580C;
        }
        .notification-item.unread::after {
          content: '';
          position: absolute;
          top: 14px;
          right: 14px;
          width: 8px;
          height: 8px;
          background: #EA580C;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(234,88,12,0.15);
        }
        .notification-item.read {
          opacity: 0.85;
        }
        .notification-item.read:hover {
          opacity: 1;
        }
        
        .notif-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          border: 1px solid transparent;
        }
        .notif-icon.booking { background: #EFF6FF; border-color: #BFDBFE; }
        .notif-icon.en-route { background: #F5F3FF; border-color: #DDD6FE; }
        .notif-icon.quotation { background: #FFFBEB; border-color: #FDE68A; }
        .notif-icon.job-started { background: #F0FDF4; border-color: #BBF7D0; }
        .notif-icon.payment { background: #FEF2F2; border-color: #FECACA; }
        .notif-icon.message { background: #FFF7ED; border-color: #FED7AA; }
        .notif-icon.system { background: #F8F6F3; border-color: #E7E5E4; }
        
        .notif-content {
          flex: 1;
          min-width: 0;
        }
        .notif-title {
          font-size: 14px;
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .notif-type-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .notif-type-badge.booking { background: #EFF6FF; color: #1D4ED8; }
        .notif-type-badge.en-route { background: #F5F3FF; color: #6D28D9; }
        .notif-type-badge.quotation { background: #FFFBEB; color: #B45309; }
        .notif-type-badge.job { background: #F0FDF4; color: #15803D; }
        
        .notif-message {
          font-size: 13px;
          color: #000000;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .notif-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .notif-time {
          font-size: 11px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }






        
        .notif-action-link {
          font-size: 12px;
          font-weight: 600;
          color: #EA580C;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.1s;
          cursor: pointer;
          border: none;
          background: transparent;
          padding: 0;
        }
        .notif-action-link:hover {
          gap: 7px;
          text-decoration: underline;
        }
        
        .notif-right-actions {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .notification-item {
            padding: 12px 14px;
            gap: 10px;
          }
          .notif-icon {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          .notif-time {
            font-size: 10.5px;
            white-space: nowrap;
          }
          .notif-action-link {
            font-size: 11px;
            white-space: nowrap;
          }
        }
        .notif-clear-btn {
          padding: 4px 10px;
          background: transparent;
          border: 1px solid #F0EDE9;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          color: #A8A29E;
          cursor: pointer;
          transition: all 0.15s;
        }













        .notif-clear-btn:hover {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #DC2626;
        }

        .empty-state {
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .empty-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
          border: 1px solid #FED7AA;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 16px;
        }
        .empty-title {
          font-size: 17px;
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 8px;
        }
        .empty-sub {
          font-size: 13px;
          color: #A8A29E;
          line-height: 1.6;
          max-width: 280px;
          margin: 0 auto;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .summary-header {
          padding: 16px 18px 12px;
          border-bottom: 1px solid #F5F2EF;
          background: linear-gradient(135deg, #FAFAF8, #F5F2EF);
        }
        .summary-title {
          font-size: 14px;
          font-weight: 700;
          color: #1C1917;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .summary-body {
          padding: 14px 18px;
        }
        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #F8F5F2;
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-label {
          font-size: 13px;
          color: #78716C;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .summary-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .summary-value {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
        }
        .summary-value.orange { color: #EA580C; }
        .summary-value.green { color: #16A34A; }
      `}</style>

      <div className="notifications-page">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Notifications</h1>
          <div className="header-actions">
            <button onClick={clearAll} className="clear-all-btn">
              🗑 Clear All
            </button>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="unread-banner">
            <div className="unread-banner-left">
              <div className="unread-banner-icon">🔔</div>
              <div>
                <div className="unread-banner-text">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</div>
                <div className="unread-banner-sub">Stay updated with your booking activity</div>
              </div>
            </div>
            <div className="unread-count-badge">{unreadCount} New</div>
          </div>
        )}

        <div className="filter-tabs">
          {[
            { name: 'All', icon: '', count: filterCounts['All'] },
            { name: 'Bookings', icon: '📅 ', count: filterCounts['Bookings'] },
            { name: 'Messages', icon: '💬 ', count: filterCounts['Messages'] },
            { name: 'Payments', icon: '💳 ', count: filterCounts['Payments'] },
          ].map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`filter-tab ${activeTab === tab.name ? 'active' : ''}`}
            >
              {tab.icon}{tab.name} <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="notifications-grid">
          <div className="left-column">
            <div className="results-bar" style={{ marginBottom: "24px", marginTop: "8px" }}>
              <div className="results-text">
                Showing <span>{filteredNotifications.length}</span> notification{filteredNotifications.length !== 1 ? 's' : ''}
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <div className="empty-title">All caught up!</div>
                <div className="empty-sub">You have no notifications right now. We will notify you when there is activity on your bookings.</div>
              </div>
            ) : (
              <div className="notifications-list">
                {filteredNotifications.map(notif => {
                  const type = getNotifType(notif.title);
                  return (
                    <div 
                      key={notif._id} 
                      className={`notification-item ${!notif.isRead ? 'unread' : 'read'}`}
                    >
                      <div className={`notif-icon ${type}`}>
                        {getIcon(type)}
                      </div>
                      <div className="notif-content">
                        <div className="notif-title">
                          {notif.title}
                          <div className={`notif-type-badge ${type === 'job-started' ? 'job' : type}`}>
                            {getTypeLabel(type)}
                          </div>
                        </div>
                        <div className="notif-message">{notif.message}</div>
                        <div className="notif-footer">
                          <div className="notif-time">
                            🕐 {new Date(notif.createdAt).toLocaleString()}
                          </div>



                        </div>
                      </div>
                      <div className="notif-right-actions">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }} 
                          className="notif-clear-btn"
                        >
                          Clear
                        </button>
                        <Link to="/customer/bookings" className="notif-action-link">
                          {getActionLabel(type)}
                        </Link>
                      </div>





                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  </>
  );
};

export default Notifications;
 
