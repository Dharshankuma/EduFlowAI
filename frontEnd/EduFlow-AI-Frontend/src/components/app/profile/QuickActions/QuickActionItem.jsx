import React from 'react';
import './QuickActionItem.css';

export const QuickActionItem = ({
    title,
    icon,
    onClick
}) => {
    // Map icons to color theme classes
    const getIconColorClass = (iconStr) => {
        if (!iconStr) return 'default-icon';
        const lower = iconStr.toLowerCase();
        if (lower.includes('bullseye') || lower.includes('goal')) return 'purple-icon';
        if (lower.includes('stars') || lower.includes('magic') || lower.includes('wand')) return 'teal-icon';
        if (lower.includes('download') || lower.includes('export')) return 'green-icon';
        if (lower.includes('graph') || lower.includes('chart') || lower.includes('progress')) return 'orange-icon';
        return 'default-icon';
    };

    const colorClass = getIconColorClass(icon);

    return (
        <button 
            className="quick-action-item-card" 
            onClick={onClick}
            type="button"
            aria-label={title}
        >
            <div className={`quick-action-icon-circle ${colorClass}`}>
                <i className={`bi bi-${icon}`}></i>
            </div>
            <span className="quick-action-title">{title}</span>
        </button>
    );
};

export default QuickActionItem;
