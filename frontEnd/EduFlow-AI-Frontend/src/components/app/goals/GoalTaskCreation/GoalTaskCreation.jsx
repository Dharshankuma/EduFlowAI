import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import { SelectComponent } from '../../../common/CommonComponents/SelectComponent';
import './GoalTaskCreation.css';

// Default mock values matching the Figma screen exactly
const DEFAULT_GOAL = {
    title: 'Mastering Advanced Neural Architectures',
    description: 'Deep dive into Transformer models, GNNs, and diffusion-based architectures. This goal aims to achieve technical proficiency in implementing and optimizing custom layers from scratch using PyTorch, with a final project focusing on multi-modal integration.',
    type: 'Academic Research',
    priority: 'High / Strategic',
    targetDate: '2024-12-15',
    createdDate: 'Aug 22, 2024',
    lastUpdated: 'Oct 14, 2024',
    category: 'Academic',
    priorityLevel: 'High Priority',
    status: 'In Progress',
    progress: 65
};

const DEFAULT_TASKS = [
    {
        id: 1,
        taskName: 'Atten',
        description: 'Paper review on',
        estimatedHours: 4,
        dueDate: '2024-11-05',
        priority: 'High',
        status: 'Completed'
    },
    {
        id: 2,
        taskName: 'ViT Im',
        description: 'Coding Vision T',
        estimatedHours: 8,
        dueDate: '2024-11-12',
        priority: 'Medium',
        status: 'In Progress'
    }
];

const DEFAULT_STATISTICS = {
    tasksDone: '12',
    tasksTotal: '18',
    hoursDone: '42',
    hoursTotal: '60',
    weeklyProgress: [
        { day: 'M', progress: 35 },
        { day: 'T', progress: 55 },
        { day: 'W', progress: 25 },
        { day: 'T', progress: 85 },
        { day: 'F', progress: 60 },
        { day: 'S', progress: 20 },
        { day: 'S', progress: 12 }
    ]
};

const PRIORITY_OPTIONS = [
    { value: '', label: 'Select Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
];

const STATUS_OPTIONS = [
    { value: '', label: 'Select Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
];

// Self-contained SVG Progress Circle Component
const ProgressCircle = ({ percentage = 65, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle-wrapper" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    className="progress-circle-bg"
                    stroke="#F1F3F9"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="progress-circle-fill"
                    stroke="var(--primary-color)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <span className="progress-circle-text">{percentage}%</span>
        </div>
    );
};

export const GoalTaskCreation = ({
    mode = 'edit', // 'create' | 'edit' | 'view'
    goal = DEFAULT_GOAL,
    tasks = DEFAULT_TASKS,
    statistics = DEFAULT_STATISTICS,
    onBack,
    onSaveTasks,
    onGenerateSchedule,
    onAddTask,
    onTaskChange
}) => {
    // Helper to format due dates nicely in read-only cells
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const [year, month, day] = dateStr.split('-');
            if (year && month && day) {
                return `${month}/${day}/${year}`;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className={`goal-task-creation-feature mode-${mode}`}>
            {/* Section 1: Goal Overview */}
            
            {/* Back Navigation Link */}
            <div className="back-navigation text-start mb-3">
                <button className="back-link-btn" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i> Back to Goals
                </button>
            </div>

            {/* Goal Header */}
            <div className="goal-task-creation-header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 pb-2">
                <div className="header-left text-start">
                    <div className="goal-badges-row d-flex flex-wrap gap-2 mb-3">
                        <span className="badge-item category-badge">
                            {(goal.category || 'Goal').toUpperCase()}
                        </span>
                        <span className="badge-item priority-badge">
                            {(goal.priorityLevel || goal.priority || 'High').toUpperCase()}
                        </span>
                        <span className="badge-item status-badge">
                            {(goal.status || 'Active').toUpperCase()}
                        </span>
                    </div>
                    <h1 className="goal-title mb-2">{goal.title || 'New Goal Title'}</h1>
                    <p className="goal-target-date-info d-flex align-items-center gap-2 m-0">
                        <i className="bi bi-calendar3"></i> Target Date: {formatDate(goal.targetDate)}
                    </p>
                </div>
                <div className="header-right d-flex justify-content-start justify-content-md-end align-items-center mt-3 mt-md-0">
                    <ProgressCircle percentage={goal.progress || 0} />
                </div>
            </div>

            {/* Goal Information & Statistics Cards Grid */}
            <div className="row g-4 mb-4">
                {/* Goal Information Card */}
                <div className="col-12 col-lg-8 text-start">
                    <DashboardCard className="goal-info-card" hover={false} shadow={true} padding="32px">
                        <span className="card-section-label">GOAL INFORMATION</span>
                        <h4 className="info-section-title mt-2 mb-3">Description</h4>
                        <p className="goal-info-description mb-4">{goal.description || 'No description provided.'}</p>
                        
                        <div className="row g-3 pt-2 border-top">
                            <div className="col-6 col-md-4">
                                <span className="meta-info-label d-block">Type</span>
                                <span className="meta-info-val">{goal.type}</span>
                            </div>
                            <div className="col-6 col-md-4">
                                <span className="meta-info-val-wrapper">
                                    <span className="meta-info-label d-block">Priority</span>
                                    <span className="meta-info-val">{goal.priority}</span>
                                </span>
                            </div>
                            <div className="col-6 col-md-4">
                                <span className="meta-info-val-wrapper">
                                    <span className="meta-info-label d-block">Target Date</span>
                                    <span className="meta-info-val">{formatDate(goal.targetDate)}</span>
                                </span>
                            </div>
                            {goal.createdDate && (
                                <div className="col-6 col-md-4 mt-md-3">
                                    <span className="meta-info-label d-block">Created Date</span>
                                    <span className="meta-info-val">{goal.createdDate}</span>
                                </div>
                            )}
                            {goal.lastUpdated && (
                                <div className="col-6 col-md-4 mt-md-3">
                                    <span className="meta-info-label d-block">Last Updated</span>
                                    <span className="meta-info-val">{goal.lastUpdated}</span>
                                </div>
                            )}
                        </div>
                    </DashboardCard>
                </div>

                {/* Statistics Card */}
                <div className="col-12 col-lg-4 text-start">
                    <DashboardCard className="goal-statistics-card" hover={false} shadow={true} padding="32px">
                        <span className="card-section-label">STATISTICS</span>
                        
                        <div className="row g-2 mt-2 mb-4">
                            <div className="col-6">
                                <div className="stat-value-box">
                                    <span className="stat-box-label d-block">TASKS DONE</span>
                                    <span className="stat-box-number">
                                        {statistics.tasksDone} <span className="stat-box-total">/ {statistics.tasksTotal}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="stat-value-box">
                                    <span className="stat-box-label d-block">TOTAL HOURS</span>
                                    <span className="stat-box-number">
                                        {statistics.hoursDone} <span className="stat-box-total">/ {statistics.hoursTotal}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Progress flex chart */}
                        <div className="weekly-activity-chart-wrapper">
                            <span className="chart-title-label d-block mb-3">Weekly Progress Activity</span>
                            <div className="chart-bar-container d-flex justify-content-between align-items-end">
                                {(statistics.weeklyProgress || []).map((item, idx) => (
                                    <div key={idx} className="chart-bar-wrapper d-flex flex-column align-items-center">
                                        <div 
                                            className="chart-bar-fill" 
                                            style={{ height: `${item.progress}px` }}
                                            title={`${item.progress}% progress`}
                                        ></div>
                                        <span className="chart-bar-day mt-2">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Section 2: Task Creation & Management Table */}
            <DashboardCard className="task-management-card mb-4" hover={false} shadow={true} padding="32px">
                <div className="task-card-header d-flex justify-content-between align-items-center mb-4">
                    <h2 className="task-card-title m-0 text-start">Tasks</h2>
                    
                    {/* Action buttons (hidden in View mode) */}
                    {mode !== 'view' && (
                        <div className="task-card-actions d-flex gap-2">
                            <ButtonComponent
                                type="button"
                                className="task-action-btn-cancel"
                                text="Cancel"
                            />
                            <ButtonComponent
                                type="button"
                                className="task-action-btn-save type_1_btn"
                                onclick={onSaveTasks}
                                text="Save Tasks"
                            />
                        </div>
                    )}
                </div>

                <div className="table-responsive">
                    <table className="table task-table align-middle">
                        <thead>
                            <tr>
                                <th>TASK NAME</th>
                                <th>DESCRIPTION</th>
                                <th>EST. HOURS</th>
                                <th>DUE DATE</th>
                                <th>PRIORITY</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(tasks || []).map((task) => {
                                const isView = mode === 'view';
                                
                                return (
                                    <tr key={task.id}>
                                        {/* Task Name */}
                                        <td className="task-table-field-cell">
                                            {isView ? (
                                                <span className="fw-semibold text-start d-block py-2 px-1">
                                                    {task.taskName}
                                                </span>
                                            ) : (
                                                <InputComponent
                                                    name="taskName"
                                                    value={task.taskName || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'taskName', e.target.value)}
                                                    placeholder="Task Name"
                                                />
                                            )}
                                        </td>
                                        
                                        {/* Description */}
                                        <td className="task-table-field-cell">
                                            {isView ? (
                                                <span className="text-muted text-start d-block py-2 px-1">
                                                    {task.description || '-'}
                                                </span>
                                            ) : (
                                                <InputComponent
                                                    name="description"
                                                    value={task.description || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'description', e.target.value)}
                                                    placeholder="Description"
                                                />
                                            )}
                                        </td>
                                        
                                        {/* Estimated Hours */}
                                        <td className="task-table-field-cell hours-cell">
                                            {isView ? (
                                                <span className="d-block text-center py-2">
                                                    {task.estimatedHours || 0} hrs
                                                </span>
                                            ) : (
                                                <InputComponent
                                                    type="number"
                                                    name="estimatedHours"
                                                    value={task.estimatedHours || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'estimatedHours', e.target.value)}
                                                    placeholder="0"
                                                />
                                            )}
                                        </td>
                                        
                                        {/* Due Date */}
                                        <td className="task-table-field-cell date-cell">
                                            {isView ? (
                                                <span className="d-block py-2">
                                                    {formatDate(task.dueDate)}
                                                </span>
                                            ) : (
                                                <InputComponent
                                                    type="date"
                                                    name="dueDate"
                                                    value={task.dueDate || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'dueDate', e.target.value)}
                                                />
                                            )}
                                        </td>
                                        
                                        {/* Priority */}
                                        <td className="task-table-field-cell priority-cell">
                                            {isView ? (
                                                <span className={`priority-text priority-${(task.priority || '').toLowerCase()} d-block py-2`}>
                                                    {task.priority || 'Low'}
                                                </span>
                                            ) : (
                                                <SelectComponent
                                                    name="priority"
                                                    value={task.priority || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'priority', e.target.value)}
                                                    options={PRIORITY_OPTIONS}
                                                />
                                            )}
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="task-table-field-cell status-cell">
                                            {isView ? (
                                                <span className={`status-badge-inline status-${(task.status || '').toLowerCase().replace(' ', '-')}`}>
                                                    {(task.status || 'Pending').toUpperCase()}
                                                </span>
                                            ) : (
                                                <SelectComponent
                                                    name="status"
                                                    value={task.status || ''}
                                                    onChange={(e) => onTaskChange && onTaskChange(task.id, 'status', e.target.value)}
                                                    options={STATUS_OPTIONS}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Add Row Action (hidden in View mode) */}
                {mode !== 'view' && (
                    <div className="add-row-action text-start mt-3">
                        <button className="add-row-btn" onClick={onAddTask}>
                            <i className="bi bi-plus"></i> Add Row
                        </button>
                    </div>
                )}
            </DashboardCard>

            {/* Section 3: Generate Study Schedule (hidden in View mode) */}
            {mode !== 'view' && (
                <DashboardCard className="generate-schedule-card" hover={false} shadow={true} padding="32px">
                    <div className="d-flex align-items-start gap-3">
                        <div className="schedule-header-icon-box flex-shrink-0">
                            <i className="bi bi-calendar2-range"></i>
                        </div>
                        <div className="schedule-card-content text-start flex-grow-1">
                            <h2 className="schedule-title mb-2">Generate Study Schedule</h2>
                            <p className="schedule-desc mb-4">
                                After creating your tasks, let the Planner Engine automatically create your personalized study schedule based on your available study hours, deadlines and priorities.
                            </p>

                            {/* Checklist grid */}
                            <div className="row g-2 mb-4 checklist-grid">
                                <div className="col-12 col-md-6">
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Available Study Hours</span>
                                    </div>
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Task Priority</span>
                                    </div>
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Goal Target Date</span>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Task Deadlines</span>
                                    </div>
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Estimated Study Hours</span>
                                    </div>
                                    <div className="checklist-item d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-check-circle-fill checklist-icon"></i>
                                        <span>Existing Study Schedule</span>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Schedule Button */}
                            <div className="schedule-card-actions pt-2">
                                <ButtonComponent
                                    type="button"
                                    className="generate-btn type_1_btn mb-2"
                                    onclick={onGenerateSchedule}
                                    text={
                                        <span className="d-flex align-items-center gap-2">
                                            <i className="bi bi-stars"></i> Generate Study Schedule
                                        </span>
                                    }
                                />
                                <p className="schedule-help-text m-0 text-muted">
                                    The Planner Engine will automatically distribute your study sessions across your available days without scheduling conflicts.
                                </p>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            )}
        </div>
    );
};

export default GoalTaskCreation;
