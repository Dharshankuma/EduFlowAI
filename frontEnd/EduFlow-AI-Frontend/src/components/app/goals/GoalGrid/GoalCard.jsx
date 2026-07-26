import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import './GoalCard.css';

export const GoalCard = ({
    goal = {},
    onView,
    onEdit,
    onDelete
}) => {
    const {
        id,
        title = '',
        category = '',
        priority = '',
        progress = 0,
        totalTasks = 0,
        completedTasks = 0,
        remainingTasks = 0,
        targetDate = '',
        nextSession = '',
        status = ''
    } = goal;

    // Get priority prefix icon/symbol
    const getPriorityLabel = (pri) => {
        switch (pri?.toLowerCase()) {
            case 'high': return '! High';
            case 'medium': return '⚡ Medium';
            case 'low': return '↓ Low';
            default: return pri;
        }
    };

    // Get category badge color class suffix
    const getCategoryClass = (cat) => {
        return `category-${cat?.toLowerCase().replace(/\s+/g, '-')}`;
    };

    // Get priority badge color class suffix
    const getPriorityClass = (pri) => {
        return `priority-${pri?.toLowerCase()}`;
    };

    // Get status dot class suffix
    const getStatusDotClass = (stat) => {
        return `status-dot-${stat?.toLowerCase().replace(/\s+/g, '-')}`;
    };

    const formattedTotal = String(totalTasks).padStart(2, '0');
    const formattedCompleted = String(completedTasks).padStart(2, '0');
    const formattedRemaining = String(remainingTasks).padStart(2, '0');

    return (
        <DashboardCard className="goal-card-wrapper h-100" hover={true} shadow={true} padding="24px">
            {/* Top Badge Section */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className={`goal-badge category-badge ${getCategoryClass(category)}`}>
                    {category.toUpperCase()}
                </span>
                <span className={`goal-badge priority-badge ${getPriorityClass(priority)}`}>
                    {getPriorityLabel(priority)}
                </span>
            </div>

            {/* Title Section */}
            <div className="goal-card-body text-start mb-3">
                <h3 className="goal-card-title">{title}</h3>
            </div>

            {/* Progress Section */}
            <div className="goal-card-progress mb-3">
                <ProgressBar
                    value={progress}
                    max={100}
                    label="Progress"
                    showPercentage={true}
                    height="6px"
                />
            </div>

            {/* Task Summary Grid */}
            <div className="goal-task-summary d-flex justify-content-between align-items-center py-2 px-3 mb-3 rounded">
                <div className="task-summary-col text-center">
                    <span className="task-summary-label">TOTAL</span>
                    <span className="task-summary-value">{formattedTotal}</span>
                </div>
                <div className="task-summary-divider"></div>
                <div className="task-summary-col text-center">
                    <span className="task-summary-label">DONE</span>
                    <span className="task-summary-value val-completed">{formattedCompleted}</span>
                </div>
                <div className="task-summary-divider"></div>
                <div className="task-summary-col text-center">
                    <span className="task-summary-label">LEFT</span>
                    <span className="task-summary-value val-remaining">{formattedRemaining}</span>
                </div>
            </div>

            {/* Target Date Section */}
            <div className="goal-date-row d-flex align-items-center gap-2 mb-3 text-start">
                <i className="bi bi-calendar-event goal-icon-muted"></i>
                <span className="goal-date-text">
                    Target: <strong className="text-dark">{targetDate}</strong>
                </span>
            </div>

            {/* Next Session Banner */}
            <div className="next-session-banner d-flex align-items-center gap-3 p-3 rounded mb-3">
                <div className="next-session-icon-wrapper">
                    <i className="bi bi-clock"></i>
                </div>
                <div className="next-session-info text-start">
                    <span className="next-session-label">Next Session</span>
                    <span className="next-session-value">{nextSession || 'Not scheduled'}</span>
                </div>
            </div>

            {/* Footer / Actions Section */}
            <div className="goal-card-footer d-flex justify-content-between align-items-center pt-3 mt-auto">
                <div className="goal-status-indicator d-flex align-items-center gap-2">
                    <span className={`status-dot ${getStatusDotClass(status)}`}></span>
                    <span className="status-label">{status}</span>
                </div>
                <div className="goal-action-buttons d-flex gap-2">
                    <button 
                        className="goal-action-btn btn-view" 
                        onClick={() => onView && onView(id)}
                        aria-label="View goal"
                    >
                        <i className="bi bi-box-arrow-up-right"></i>
                    </button>
                    <button 
                        className="goal-action-btn btn-edit" 
                        onClick={() => onEdit && onEdit(id)}
                        aria-label="Edit goal"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                        className="goal-action-btn btn-delete" 
                        onClick={() => onDelete && onDelete(id)}
                        aria-label="Delete goal"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
};

export default GoalCard;
