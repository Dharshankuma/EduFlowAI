import React from 'react';
import { useAppState } from '../../../context/StateContext';
import DashboardCard from '../../../components/common/DashboardCard/DashboardCard';
import './Notifications.css';

export const Notifications = () => {
    const { notifications, markNotificationAsRead, clearNotifications } = useAppState();

    const handleMarkAllRead = () => {
        notifications.forEach(n => {
            if (n.unread) {
                markNotificationAsRead(n.id);
            }
        });
    };

    return (
        <div className="notifications-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="notifications-page-header text-start mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h1 className="notifications-page-title m-0">Notifications</h1>
                    <p className="notifications-page-subtitle mt-1 mb-0">
                        Stay updated on study deadlines, goal accomplishments, and planner adjustments.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={handleMarkAllRead} disabled={notifications.length === 0}>
                        Mark all as read
                    </button>
                    <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={clearNotifications} disabled={notifications.length === 0}>
                        Clear all
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-xl-10 mx-auto">
                    {notifications.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {notifications.map(n => (
                                <DashboardCard 
                                    key={n.id} 
                                    hover={true} 
                                    padding="16px" 
                                    className={`notification-item text-start ${n.unread ? 'unread' : 'read'}`}
                                >
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className={`notification-icon-box flex-shrink-0 ${n.type || 'info'}`}>
                                                <i className={`bi ${
                                                    n.type === 'success' ? 'bi-check-circle-fill' : 
                                                    n.type === 'warning' ? 'bi-exclamation-triangle-fill' : 
                                                    n.type === 'info' ? 'bi-info-circle-fill' : 'bi-bell-fill'
                                                }`}></i>
                                            </div>
                                            <div>
                                                <p className="notification-message m-0 text-primary-emphasis">{n.text}</p>
                                                <span className="notification-time text-secondary small d-block mt-1">{n.time}</span>
                                            </div>
                                        </div>
                                        {n.unread && (
                                            <button 
                                                className="btn btn-link btn-sm text-decoration-none text-primary p-0 fw-semibold align-self-center flex-shrink-0"
                                                onClick={() => markNotificationAsRead(n.id)}
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                </DashboardCard>
                            ))}
                        </div>
                    ) : (
                        <DashboardCard padding="64px" className="text-center">
                            <i className="bi bi-bell-slash text-light fs-1 mb-2 d-block"></i>
                            <h4 className="fw-semibold">No notifications</h4>
                            <p className="text-secondary small m-0">You're all up to date. We'll alert you on scheduling adjustments.</p>
                        </DashboardCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
