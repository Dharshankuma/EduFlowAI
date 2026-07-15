import React from 'react';
import './StatusBadge.css';

export const StatusBadge = ({
    status,
    variant = 'neutral' // Completed | Pending | In Progress | Overdue | Success | Warning | Error | Neutral
}) => {
    // Normalize variant name to lowercase class names (e.g. "In Progress" -> "in-progress")
    const variantClass = variant.toLowerCase().replace(/\s+/g, '-');

    return (
        <span className={`status-badge-el status-badge-${variantClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
