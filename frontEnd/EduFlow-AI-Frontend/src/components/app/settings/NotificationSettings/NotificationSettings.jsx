import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import NotificationItem from './NotificationItem';
import './NotificationSettings.css';

// Default descriptions mapping for fallback
const DEFAULT_DESCRIPTIONS = {
    'Email Notifications': 'Receive weekly summaries and important account updates.',
    'Daily Study Reminders': 'Receive reminders before your scheduled study sessions.',
    'Planner Notifications': 'Receive alerts when your study plan is updated or rescheduled.',
    'AI Suggestions': 'Receive alerts when your study plan is updated or rescheduled.'
};

export const NotificationSettings = ({
    notifications = [],
    onToggle
}) => {
    return (
        <DashboardCard className="notification-settings-card" hover={false} shadow={true} padding="32px">
            {/* Header Section */}
            <div className="notification-settings-header pb-4 mb-3 d-flex align-items-center gap-3">
                <div className="notification-icon-container">
                    <i className="bi bi-bell-fill"></i>
                </div>
                <div className="notification-title-container text-start">
                    <h3 className="notification-settings-title mb-1">Notification Settings</h3>
                    <p className="notification-settings-subtitle mb-0">
                        Control how EduFlow AI notifies you.
                    </p>
                </div>
            </div>

            {/* Notification Items List */}
            <div className="notification-items-list">
                {notifications.map((item) => {
                    // Normalizing title and mapping description as per version 1 spec
                    const normalizedTitle = item.title === 'AI Suggestions' ? 'Planner Notifications' : item.title;
                    const description = item.description || DEFAULT_DESCRIPTIONS[normalizedTitle] || DEFAULT_DESCRIPTIONS[item.title] || '';

                    return (
                        <NotificationItem
                            key={item.id}
                            id={item.id}
                            title={normalizedTitle}
                            description={description}
                            enabled={item.enabled}
                            onToggle={onToggle}
                        />
                    );
                })}
            </div>
        </DashboardCard>
    );
};

export default NotificationSettings;
