import React from 'react';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';
import './ScheduleItem.css';

export const ScheduleItem = ({
    time,
    subject,
    topic,
    status,
    isLast = false
}) => {
    // Map status string to StatusBadge variants defined in Phase 2
    const getBadgeVariant = (statusText) => {
        if (!statusText) return 'neutral';
        const lower = statusText.toLowerCase();
        if (lower === 'current') return 'in-progress';
        if (lower === 'completed') return 'completed';
        if (lower === 'overdue') return 'overdue';
        return 'neutral'; // Defaults for pending, etc.
    };

    const isCurrent = status && status.toLowerCase() === 'current';

    return (
        <div className={`schedule-item-el ${isCurrent ? 'current-item' : ''}`}>
            {/* Left timeline connecting line and dot */}
            <div className="schedule-item-timeline">
                <div className={`timeline-dot ${isCurrent ? 'active' : ''}`} />
                {!isLast && <div className="timeline-line" />}
            </div>
            
            {/* Content area: time, subject, and topic description */}
            <div className="schedule-item-content">
                <div className="schedule-item-meta">
                    <span className="schedule-item-time">{time}</span>
                    <span className="schedule-item-separator">&ndash;</span>
                    <span className="schedule-item-subject">{subject}</span>
                </div>
                <p className="schedule-item-topic">{topic}</p>
            </div>

            {/* Right optional badge */}
            {status && (
                <div className="schedule-item-badge-wrapper">
                    <StatusBadge status={status} variant={getBadgeVariant(status)} />
                </div>
            )}
        </div>
    );
};

export default ScheduleItem;
