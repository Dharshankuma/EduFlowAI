import React, { useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import './CalendarDayView.css';

// Safe date parser to avoid timezone mismatch issues
const parseDateSafe = (dateVal) => {
    if (dateVal instanceof Date) return dateVal;
    if (typeof dateVal === 'string') {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
        return new Date(dateVal);
    }
    return new Date(dateVal);
};

// Check if two dates are on the same day
const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = parseDateSafe(d1);
    const date2 = parseDateSafe(d2);
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
};

// Helper to convert time strings (e.g., "09:30 AM" or "02:00 PM") to floating-point hours
const parseTimeToHour = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 0;
    let hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    return hour + (min / 60);
};

// Helper to parse a time range string "09:00 AM - 11:00 AM"
const parseTimeRange = (timeRangeStr) => {
    if (!timeRangeStr) return { start: 9, end: 11 };
    const parts = timeRangeStr.split('-');
    if (parts.length === 2) {
        const start = parseTimeToHour(parts[0]);
        const end = parseTimeToHour(parts[1]);
        return { start, end };
    }
    return { start: 9, end: 11 };
};

// Default mock values representing the Figma day view state
const defaultTimeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM", "11:00 PM"
];

const defaultEvents = [
    {
        id: 1,
        title: "Arrays Practice",
        course: "Placement Preparation",
        time: "09:00 AM - 11:00 AM",
        description: "Intensive session focusing on multi-dimensional arrays, sliding window techniques, and...",
        priority: "High",
        status: "Incomplete"
    },
    {
        id: 2,
        title: "Neural Networks",
        course: "Advanced AI",
        time: "02:00 PM - 04:00 PM",
        description: "Focus on backpropagation algorithms, training processes, and neural network tuning techniques.",
        priority: "Low",
        status: "Completed"
    },
    {
        id: 3,
        title: "Operating Systems",
        course: "Computer Science Core",
        time: "06:00 PM - 08:00 PM",
        description: "Deep dive into Process Synchronization and Deadlocks. Covering Semaphores, Monitors, and classical synchronization problems.",
        priority: "Medium",
        status: "Incomplete"
    }
];

const defaultTodaySummary = {
    studyGoal: 85,
    concentrationScore: 92
};

const defaultMonthlyProgress = {
    totalStudyHours: 124,
    completedSessions: 42,
    upcomingSessions: 18
};

const defaultPlannerInsight = {
    recommendation: "Your workload is concentrated on today's afternoon sessions. Consider moving one revision session to tomorrow for better retention."
};

export const CalendarDayView = ({
    selectedDate = "Monday, June 12, 2023",
    timeSlots = defaultTimeSlots,
    events = defaultEvents,
    todaySummary = defaultTodaySummary,
    monthlyProgress = defaultMonthlyProgress,
    plannerInsight = defaultPlannerInsight,
    activeView = "Day",
    onToday,
    onViewChange,
    onEventClick,
    onViewGoal,
    onMarkComplete,
    onReschedule,
    onAdjustSchedule
}) => {
    // 1. Core Timeline start parameters
    const timelineStartHour = useMemo(() => {
        if (!timeSlots || timeSlots.length === 0) return 6;
        return parseTimeToHour(timeSlots[0]);
    }, [timeSlots]);

    // 2. Compute absolute placement style for event cards on desktop
    const getEventStyle = (event) => {
        const { start, end } = parseTimeRange(event.time);
        const slotHeight = 100; // matching CSS slot height in px
        
        // 8px margin padding offsets to keep badges clean inside horizontal grids
        const top = (start - timelineStartHour) * slotHeight + 8;
        const height = (end - start) * slotHeight - 16;
        
        return {
            top: `${top}px`,
            height: `${height}px`
        };
    };

    // Filter events for the active selected day
    const dayEvents = useMemo(() => {
        const list = events || [];
        return list.filter(event => isSameDay(event.date, selectedDate));
    }, [events, selectedDate]);

    return (
        <div className="calendar-day-view-container container-fluid p-0">
            {/* 1. Header Area with dynamic dates & switcher */}
            <div className="row align-items-center mb-4">
                <div className="col-12 col-md-7">
                    <div className="calendar-title-info">
                        <h1>Study Calendar</h1>
                        <p className="subtitle">Today's Study Schedule</p>
                        <p className="calendar-date-display">{selectedDate}</p>
                    </div>
                </div>
                <div className="col-12 col-md-5 d-flex justify-content-md-end mt-3 mt-md-0">
                    <div className="header-actions-right">
                        {/* Segmented switcher */}
                        <div className="view-switcher">
                            {['Month', 'Week', 'Day'].map((view) => (
                                <button
                                    key={view}
                                    type="button"
                                    className={`switcher-btn ${activeView === view ? 'active' : ''}`}
                                    onClick={() => onViewChange && onViewChange(view)}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>

                        {/* Today navigation indicator */}
                        <div className="today-control-wrapper">
                            <button type="button" className="today-nav-arrow" onClick={onToday} title="Previous Day">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <ButtonComponent
                                type="button"
                                text="Today"
                                className="today-btn"
                                onclick={onToday}
                            />
                            <button type="button" className="today-nav-arrow" onClick={onToday} title="Next Day">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Layout split */}
            <div className="calendar-layout-row">
                {/* Timeline display on left */}
                <div className="calendar-main-col">
                    <div className="calendar-card">
                        <div className="timeline-scroll-container">
                            {/* Render dynamic time hour markings */}
                            {timeSlots.map((slot) => (
                                <div key={slot} className="timeline-hour-slot">
                                    <div className="timeline-hour-label">{slot}</div>
                                </div>
                            ))}

                            {/* Render dynamic events positioned absolutely */}
                            <div className="timeline-events-container">
                                {dayEvents.map((event) => {
                                    const isCompleted = event.status?.toLowerCase() === 'completed';
                                    const priorityLower = event.priority?.toLowerCase() || 'low';
                                    
                                    // Custom style position offsets
                                    const cardStyle = getEventStyle(event);
                                    
                                    // Priority-status mapping classes
                                    let thematicClass = `priority-${priorityLower}`;
                                    if (isCompleted) {
                                        thematicClass = 'event-status-completed';
                                    }

                                    return (
                                        <div
                                            key={event.id}
                                            className={`day-event-card ${thematicClass}`}
                                            style={cardStyle}
                                            onClick={() => onEventClick && onEventClick(event)}
                                        >
                                            {/* Top info row */}
                                            <div className="event-card-header">
                                                {!isCompleted && (
                                                    <span className="priority-badge">
                                                        {event.priority} Priority
                                                    </span>
                                                )}
                                                {isCompleted && (
                                                    <span className="status-badge">
                                                        Completed
                                                    </span>
                                                )}
                                                <span className="time-badge">
                                                    <i className="bi bi-clock"></i> {event.time}
                                                </span>
                                            </div>

                                            {/* Middle content body */}
                                            <div>
                                                <h3 className="event-subject-title">{event.title}</h3>
                                                {event.course && (
                                                    <p className="event-course-name">
                                                        <i className="bi bi-laptop"></i> @ {event.course}
                                                    </p>
                                                )}
                                                <p className="event-description">{event.description}</p>
                                            </div>

                                            {/* Bottom actions row */}
                                            <div className="event-actions-row">
                                                {isCompleted ? (
                                                    <>
                                                        <ButtonComponent
                                                            type="button"
                                                            text="Review Notes"
                                                            className="btn-view-goal"
                                                            onclick={() => onViewGoal && onViewGoal(event)}
                                                        />
                                                        <ButtonComponent
                                                            type="button"
                                                            text="See Analytics"
                                                            className="btn-reschedule"
                                                            onclick={() => onEventClick && onEventClick(event)}
                                                        />
                                                        <i className="bi bi-check-circle-fill completed-check-icon"></i>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ButtonComponent
                                                            type="button"
                                                            text="View Goal"
                                                            className="btn-view-goal"
                                                            onclick={() => onViewGoal && onViewGoal(event)}
                                                        />
                                                        <ButtonComponent
                                                            type="button"
                                                            text="Mark Complete"
                                                            className="btn-mark-complete"
                                                            onclick={() => onMarkComplete && onMarkComplete(event)}
                                                        />
                                                        <ButtonComponent
                                                            type="button"
                                                            text="Reschedule"
                                                            className="btn-reschedule"
                                                            onclick={() => onReschedule && onReschedule(event)}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards stack on right */}
                <div className="calendar-sidebar-col">
                    {/* Today's Summary Card */}
                    <DashboardCard hover={false} shadow={true} padding="24px">
                        <div className="summary-card-title">
                            <i className="bi bi-file-earmark-check"></i>
                            <span>Today's Summary</span>
                        </div>

                        <div className="study-goal-section mb-3">
                            <ProgressBar
                                value={todaySummary?.studyGoal || 0}
                                max={100}
                                label="Study Goal Reached"
                                height="8px"
                                animated={true}
                                showPercentage={true}
                            />
                        </div>

                        <div className="summary-stat-box">
                            <span className="summary-stat-label">Concentration Score</span>
                            <span className="summary-stat-value">{todaySummary?.concentrationScore || 0}</span>
                        </div>
                    </DashboardCard>

                    {/* Monthly Progress Card */}
                    <DashboardCard hover={false} shadow={true} padding="24px" className="monthly-progress-card">
                        <div className="progress-card-title">Monthly Progress</div>
                        <div className="progress-hours-val">{monthlyProgress?.totalStudyHours || 0}h</div>
                        <div className="progress-hours-lbl">Total Study Hours</div>

                        <div className="progress-stats-row">
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.completedSessions || 0}</span>
                                <span className="progress-stat-desc">Completed</span>
                            </div>
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.upcomingSessions || 0}</span>
                                <span className="progress-stat-desc">Upcoming</span>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* AI Planner Insight Card */}
                    <DashboardCard hover={true} shadow={true} padding="24px" className="planner-insight-card">
                        <div className="insight-header">
                            <i className="bi bi-stars"></i>
                            <span>AI Planner Insight</span>
                        </div>
                        <p className="insight-recommendation">
                            {plannerInsight?.recommendation || ""}
                        </p>
                        <div className="adjust-schedule-btn-wrapper">
                            <ButtonComponent
                                type="button"
                                text="Adjust Schedule →"
                                onclick={onAdjustSchedule}
                            />
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default CalendarDayView;
