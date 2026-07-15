import React from 'react';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';
import './TaskItem.css';

export const TaskItem = ({
    title,
    subject,
    dueDate,
    dueTime,
    priority,
    status,
    icon,
    onStatusToggle
}) => {
    // Map priorities to CSS style classes
    const getPriorityClass = (pri) => {
        if (!pri) return 'priority-low';
        const lower = pri.toLowerCase();
        if (lower === 'high') return 'priority-high';
        if (lower === 'medium') return 'priority-medium';
        return 'priority-low';
    };

    // Render task circular symbol or default icon
    const renderIcon = () => {
        if (!icon) return <i className="bi bi-journal-text"></i>;
        if (typeof icon === 'string') {
            return <i className={`bi ${icon}`}></i>;
        }
        return icon;
    };

    return (
        <div className="task-item-card-wrapper">
            <div className="task-item-left">
                <div className={`task-icon-container ${priority ? priority.toLowerCase() : 'low'}`}>
                    {renderIcon()}
                </div>
                <div className="task-details">
                    <h4 className="task-title">{title}</h4>
                    <div className="task-subtext">
                        <span className="task-subject">{subject}</span>
                        <span className="task-dot-divider">&bull;</span>
                        <span className="task-due">
                            <i className="bi bi-clock me-1"></i>
                            {dueDate} {dueTime && `at ${dueTime}`}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="task-item-right">
                <span className={`priority-badge ${getPriorityClass(priority)}`}>
                    {priority}
                </span>
                {status && (
                    <StatusBadge 
                        status={status} 
                        variant={status === 'In Progress' ? 'In Progress' : status === 'Completed' ? 'Completed' : 'Neutral'} 
                    />
                )}
            </div>
        </div>
    );
};

export default TaskItem;
