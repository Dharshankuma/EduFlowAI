import React, { useState, useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import './CalendarWeekView.css';

// Safe date parser to avoid timezone offsets
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

// Helper to convert time strings (e.g. "09:00 AM", "13:00", "02:00 PM") to floating-point hours
const parseTimeToHour = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
    if (!match) return 0;
    let hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;
    
    if (ampm) {
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
    }
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

// Default time slots (06:00 to 23:00 in 24-hour style labels)
const defaultTimeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00"
];

// Default 7 days of the week (June 23 to 29, 2026, Tuesday June 24 is today)
const defaultWeekDays = [
    { name: "Mon", dayNumber: 23, date: new Date(2026, 5, 23), isToday: false, isSelected: false },
    { name: "Tue", dayNumber: 24, date: new Date(2026, 5, 24), isToday: true, isSelected: false },
    { name: "Wed", dayNumber: 25, date: new Date(2026, 5, 25), isToday: false, isSelected: false },
    { name: "Thu", dayNumber: 26, date: new Date(2026, 5, 26), isToday: false, isSelected: false },
    { name: "Fri", dayNumber: 27, date: new Date(2026, 5, 27), isToday: false, isSelected: false },
    { name: "Sat", dayNumber: 28, date: new Date(2026, 5, 28), isToday: false, isSelected: false },
    { name: "Sun", dayNumber: 29, date: new Date(2026, 5, 29), isToday: false, isSelected: false }
];

const defaultEvents = [
    {
        id: 1,
        title: "Calculus Review",
        course: "Math Basics",
        date: "2026-06-23",
        time: "08:00 AM - 10:00 AM",
        description: "Review vector calculus theorems and double integrals to prepare for incoming quiz.",
        status: "Missed",
        priority: "Medium"
    },
    {
        id: 2,
        title: "Arrays Practice",
        course: "Placement Preparation",
        date: "2026-06-24",
        time: "09:00 AM - 11:00 AM",
        description: "Intensive session focusing on multi-dimensional arrays, sliding window techniques, and general complex array patterns.",
        status: "Completed",
        priority: "High"
    },
    {
        id: 3,
        title: "Neural Networks",
        course: "Advanced AI",
        date: "2026-06-24",
        time: "02:00 PM - 04:00 PM",
        description: "Deep dive into neural nets backpropagation algorithms and gradient descent optimization equations.",
        status: "Incomplete",
        priority: "Medium"
    },
    {
        id: 4,
        title: "Database Indexing",
        course: "Information Systems",
        date: "2026-06-25",
        time: "10:00 AM - 12:00 PM",
        description: "Learn about B-Trees, B+ Trees, hash indexing and query query optimization layouts.",
        status: "Upcoming",
        priority: "Medium"
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
    recommendation: "Your workload is concentrated on Tuesday afternoon. Consider moving one revision session to Thursday for better retention."
};

export const CalendarWeekView = ({
    selectedWeek = "June 23 - 29, 2026",
    weekDays = defaultWeekDays,
    timeSlots = defaultTimeSlots,
    events = defaultEvents,
    todaySummary = defaultTodaySummary,
    monthlyProgress = defaultMonthlyProgress,
    plannerInsight = defaultPlannerInsight,
    activeView = "Week",
    onToday,
    onViewChange,
    onEventClick,
    onViewGoal,
    onMarkComplete,
    onReschedule,
    onAdjustSchedule
}) => {
    // 1. Timeline bounds index resolution
    const timelineStartHour = useMemo(() => {
        if (!timeSlots || timeSlots.length === 0) return 6;
        return parseTimeToHour(timeSlots[0]);
    }, [timeSlots]);

    // 2. Local Popover overlay state for clicked event card details
    const [activeEvent, setActiveEvent] = useState(null);
    const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });

    // 3. Match event date to weekday column index
    const getEventDayIndex = (eventDateStr) => {
        return weekDays.findIndex(day => isSameDay(day.date, eventDateStr));
    };

    // Calculate layout metrics for absolute positioning overlays
    const getEventStyles = (event, dayIndex) => {
        const { start, end } = parseTimeRange(event.time);
        const slotHeight = 100; // height of each hour slot in pixels
        
        const top = (start - timelineStartHour) * slotHeight;
        const height = (end - start) * slotHeight;
        
        // Calculate dynamic horizontal alignment
        const left = `calc(${dayIndex} * (100% / 7) + 5px)`;
        const width = `calc((100% / 7) - 10px)`;
        
        return {
            top: `${top}px`,
            height: `${height}px`,
            left,
            width
        };
    };

    // Filter events that fall within the current week's dates
    const weekEvents = useMemo(() => {
        const list = events || [];
        return list.filter(event => getEventDayIndex(event.date) !== -1);
    }, [events, weekDays]);

    // Click handler to open detailed popover menu
    const handleEventCardClick = (event, e) => {
        e.stopPropagation();
        setActiveEvent(event);
        
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();
        
        // Offset popover alignment to the right of the block
        let leftPos = rect.left - parentRect.left + rect.width + 10;
        let topPos = rect.top - parentRect.top;
        
        // Overflow fallback layout shifting popover to the left of card
        if (leftPos + 290 > parentRect.width) {
            leftPos = rect.left - parentRect.left - 300;
        }
        
        setPopoverCoords({
            top: topPos,
            left: leftPos
        });
        
        if (onEventClick) {
            onEventClick(event);
        }
    };

    return (
        <div className="calendar-week-view-container container-fluid p-0">
            {/* 1. Header with View switcher and navigation */}
            <div className="row align-items-center mb-4">
                <div className="col-12 col-md-7">
                    <div className="calendar-title-info">
                        <h1>Study Calendar</h1>
                        <p className="subtitle">Today's Study Schedule</p>
                        <p className="calendar-date-display">{selectedWeek}</p>
                    </div>
                </div>
                <div className="col-12 col-md-5 d-flex justify-content-md-end mt-3 mt-md-0">
                    <div className="header-actions-right">
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

                        <div className="today-control-wrapper">
                            <button type="button" className="today-nav-arrow" onClick={onToday} title="Previous Week">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <ButtonComponent
                                type="button"
                                text="Today"
                                className="today-btn"
                                onclick={onToday}
                            />
                            <button type="button" className="today-nav-arrow" onClick={onToday} title="Next Week">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main split row */}
            <div className="calendar-layout-row" onClick={() => setActiveEvent(null)}>
                {/* Weekly Grid display */}
                <div className="calendar-main-col">
                    <div className="calendar-card">
                        <div className="week-planner-scroll-box">
                            <div className="week-planner-container">
                                
                                {/* 2.1 Week Header row */}
                                <div className="week-grid-row week-header-row">
                                    <div className="week-header-timezone-lbl">GMT-5</div>
                                    {weekDays.map((day) => {
                                        const headerClass = [
                                            'week-day-header-cell',
                                            day.isToday ? 'is-today-header' : '',
                                            day.isSelected ? 'is-selected-header' : ''
                                        ].filter(Boolean).join(' ');

                                        return (
                                            <div key={day.name} className={headerClass}>
                                                <span className="day-name">{day.name}</span>
                                                <span className="day-number">{day.dayNumber}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 2.2 Week Grid body */}
                                <div className="week-timeline-body">
                                    
                                    {/* Column grid lines */}
                                    <div className="week-grid-columns-layer">
                                        {weekDays.map((day) => (
                                            <div
                                                key={day.name}
                                                className={`week-grid-column-line ${day.isToday ? 'is-today-column' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Hour row grid lines */}
                                    {timeSlots.map((slot) => (
                                        <div key={slot} className="week-grid-row week-hour-row">
                                            <div className="week-time-label">{slot}</div>
                                        </div>
                                    ))}

                                    {/* Red horizontal current timeline indicator (e.g. positioned at 12:30 PM) */}
                                    <div className="current-time-indicator" style={{ top: '650px' }}>
                                        <div className="current-time-dot"></div>
                                    </div>

                                    {/* Placed event cards absolute overlays */}
                                    <div className="week-events-overlay">
                                        {weekEvents.map((event) => {
                                            const dayIndex = getEventDayIndex(event.date);
                                            if (dayIndex === -1) return null;

                                            const statusLower = event.status?.toLowerCase() || '';
                                            const priorityLower = event.priority?.toLowerCase() || 'low';
                                            const isCompleted = statusLower === 'completed';

                                            let typeClass = 'event-upcoming';
                                            let badgeText = event.status || 'Upcoming';

                                            if (statusLower === 'missed') {
                                                typeClass = 'event-missed';
                                                badgeText = 'Missed';
                                            } else if (isCompleted) {
                                                typeClass = 'event-completed';
                                                badgeText = 'Completed';
                                            } else if (priorityLower === 'medium') {
                                                typeClass = 'event-medium-priority';
                                                badgeText = 'Medium Priority';
                                            }

                                            const blockStyle = getEventStyles(event, dayIndex);

                                            return (
                                                <div
                                                    key={event.id}
                                                    className={`week-event-card ${typeClass}`}
                                                    style={blockStyle}
                                                    onClick={(e) => handleEventCardClick(event, e)}
                                                >
                                                    <div className="event-title">{event.title}</div>
                                                    <div className="event-time-range">{event.time}</div>
                                                    <span className="mini-status-pill">
                                                        {isCompleted && <i className="bi bi-check-circle-fill"></i>}
                                                        {badgeText}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Floating Popover Detail Menu */}
                                        {activeEvent && (
                                            <div
                                                className="event-popover-card"
                                                style={{
                                                    top: `${popoverCoords.top}px`,
                                                    left: `${popoverCoords.left}px`
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="popover-header-row">
                                                    <div className="popover-title-info">
                                                        <h4>{activeEvent.title}</h4>
                                                        {activeEvent.course && (
                                                            <p className="popover-course-lbl">
                                                                <i className="bi bi-laptop"></i> @ {activeEvent.course}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="popover-close-btn"
                                                        onClick={() => setActiveEvent(null)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>

                                                <div className="popover-meta-row">
                                                    <span className="badge bg-light text-dark">
                                                        <i className="bi bi-clock"></i> {activeEvent.time}
                                                    </span>
                                                    <span className="badge bg-light text-dark">
                                                        {activeEvent.status || 'Scheduled'}
                                                    </span>
                                                </div>

                                                <p className="popover-desc">{activeEvent.description}</p>

                                                <div className="popover-actions-row">
                                                    {activeEvent.status?.toLowerCase() === 'completed' ? (
                                                        <>
                                                            <ButtonComponent
                                                                type="button"
                                                                text="Review Notes"
                                                                className="btn-view-goal"
                                                                onclick={() => onViewGoal && onViewGoal(activeEvent)}
                                                            />
                                                            <ButtonComponent
                                                                type="button"
                                                                text="See Analytics"
                                                                className="btn-reschedule"
                                                                onclick={() => onEventClick && onEventClick(activeEvent)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ButtonComponent
                                                                type="button"
                                                                text="View Goal"
                                                                className="btn-view-goal"
                                                                onclick={() => onViewGoal && onViewGoal(activeEvent)}
                                                            />
                                                            <ButtonComponent
                                                                type="button"
                                                                text="Mark Complete"
                                                                className="btn-mark-complete"
                                                                onclick={() => onMarkComplete && onMarkComplete(activeEvent)}
                                                            />
                                                            <ButtonComponent
                                                                type="button"
                                                                text="Reschedule"
                                                                className="btn-reschedule"
                                                                onclick={() => onReschedule && onReschedule(activeEvent)}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar on right */}
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

export default CalendarWeekView;
