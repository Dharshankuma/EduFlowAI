import React from 'react';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';
import './GoalItem.css';

export const GoalItem = ({
    title,
    category,
    progress = 0,
    dueDate,
    status
}) => {
    // Map goals status text to status badge variants from Phase 2
    const getBadgeVariant = (statusText) => {
        if (!statusText) return 'neutral';
        const lower = statusText.toLowerCase();
        if (lower === 'completed' || lower === 'on track') return 'success';
        if (lower === 'in progress' || lower === 'steady') return 'in-progress';
        if (lower === 'almost complete') return 'warning';
        if (lower === 'overdue' || lower === 'at risk') return 'error';
        return 'neutral';
    };

    // Style progress bar colors dynamically based on status metadata
    const getProgressBarColor = () => {
        if (!status) return 'var(--primary-color)';
        const lower = status.toLowerCase();
        if (lower === 'at risk') return 'var(--danger-color)';
        if (lower === 'steady') return 'var(--secondary-color)';
        if (lower === 'on track') return 'var(--primary-color)';
        return 'var(--primary-color)';
    };

    return (
        <div className="goal-item-card">
            <div className="goal-item-header">
                <h4 className="goal-item-title">{title}</h4>
                <span className="goal-item-percentage">{progress}%</span>
            </div>
            
            <div className="goal-item-progress-wrapper">
                <ProgressBar
                    value={progress}
                    max={100}
                    color={getProgressBarColor()}
                    showPercentage={false}
                    animated={true}
                    height="6px"
                />
            </div>
            
            <div className="goal-item-footer">
                <span className="goal-item-due">{category ? `${category}` : dueDate}</span>
                {status && (
                    <StatusBadge status={status} variant={getBadgeVariant(status)} />
                )}
            </div>
        </div>
    );
};

export default GoalItem;
