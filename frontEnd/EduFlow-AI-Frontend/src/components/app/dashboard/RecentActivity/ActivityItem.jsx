import React from 'react';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';
import './ActivityItem.css';

export const ActivityItem = ({
    type,
    title,
    description,
    time,
    status,
    icon
}) => {
    // Map activity types to Bootstrap Icons and color classes
    const getTypeMeta = (actType) => {
        if (!actType) return { icon: 'bi-info-circle', colorClass: 'neutral' };
        const lower = actType.toLowerCase();
        
        switch (lower) {
            case 'goal':
                return { icon: 'bi-trophy-fill', colorClass: 'goal' };
            case 'task':
                return { icon: 'bi-check-circle-fill', colorClass: 'task' };
            case 'planner':
                return { icon: 'bi-journal-text', colorClass: 'planner' };
            case 'study session':
            case 'session':
                return { icon: 'bi-hourglass-split', colorClass: 'session' };
            case 'calendar':
                return { icon: 'bi-calendar-event-fill', colorClass: 'calendar' };
            case 'progress':
                return { icon: 'bi-graph-up-arrow', colorClass: 'progress' };
            case 'ai task generation':
            case 'ai':
                return { icon: 'bi-stars', colorClass: 'ai' };
            default:
                return { icon: 'bi-lightning-charge-fill', colorClass: 'neutral' };
        }
    };

    const meta = getTypeMeta(type);
    const itemIcon = icon || meta.icon;

    return (
        <div className="activity-item-wrapper">
            <div className="activity-item-left">
                <div className={`activity-icon-container ${meta.colorClass}`}>
                    <i className={`bi ${itemIcon}`}></i>
                </div>
                <div className="activity-details">
                    <h5 className="activity-title">{title}</h5>
                    {description && <p className="activity-desc">{description}</p>}
                    <span className="activity-time">{time}</span>
                </div>
            </div>
            {status && (
                <div className="activity-item-right">
                    <StatusBadge status={status} variant={status === 'Completed' ? 'Completed' : 'Neutral'} />
                </div>
            )}
        </div>
    );
};

export default ActivityItem;
