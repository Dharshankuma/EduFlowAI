import React, { useState, useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import './CalendarMonthView.css';

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

// List of month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Weekday headers
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Default mock data matching Figma view
const defaultEvents = [
    {
        id: 1,
        title: "DS Algorithms",
        date: "2026-10-01",
        time: "10:00 AM",
        type: "Study Session"
    },
    {
        id: 2,
        title: "OS Quiz Prep",
        date: "2026-10-08",
        time: "2:00 PM",
        type: "Revision",
        completed: true
    },
    {
        id: 3,
        title: "Final Review",
        date: "2026-10-24",
        time: "9:00 AM",
        type: "Exam"
    },
    {
        id: 4,
        title: "Linear Algebra",
        date: "2026-10-24",
        time: "11:30 AM",
        type: "Study Session"
    },
    {
        id: 5,
        title: "Group Discussion",
        date: "2026-10-24",
        time: "3:00 PM",
        type: "Revision"
    },
    {
        id: 6,
        title: "Session 4",
        date: "2026-10-24",
        time: "4:30 PM",
        type: "Study Session"
    },
    {
        id: 7,
        title: "Session 5",
        date: "2026-10-24",
        time: "6:00 PM",
        type: "Revision"
    },
    {
        id: 8,
        title: "DB Lab Report",
        date: "2026-10-25",
        time: "11:59 PM",
        type: "Assignment",
        urgent: true
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
    recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
};

// Subcomponent: Individual Calendar Grid Cell
const CalendarDateCell = ({
    day,
    isCurrentMonth,
    isToday,
    isSelected,
    events = [],
    onClick,
    onEventClick
}) => {
    // Show max 3 events, list the rest as "+X More"
    const visibleEvents = events.slice(0, 3);
    const remainingCount = events.length - 3;

    // Combine classes
    const cellClass = [
        'calendar-date-cell',
        !isCurrentMonth ? 'other-month' : '',
        isToday ? 'is-today' : '',
        isSelected ? 'selected-date' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={cellClass} onClick={onClick}>
            <div className="cell-header">
                <span className="cell-day-number">{day}</span>
                {isToday && <span className="today-pill">Today</span>}
            </div>

            <div className="cell-events-list">
                {visibleEvents.map((event) => {
                    let typeClass = 'event-default';
                    let typeIcon = '';

                    const typeLower = event.type?.toLowerCase() || '';
                    if (typeLower.includes('study') || typeLower.includes('session')) {
                        typeClass = 'event-study-session';
                    } else if (typeLower.includes('revision') || typeLower.includes('quiz') || typeLower.includes('prep')) {
                        typeClass = 'event-revision';
                        if (event.completed) {
                            typeIcon = 'bi-check-circle-fill';
                        }
                    } else if (typeLower.includes('exam') || typeLower.includes('test') || typeLower.includes('review')) {
                        typeClass = 'event-exam';
                    } else if (typeLower.includes('assignment') || typeLower.includes('project') || typeLower.includes('report') || typeLower.includes('lab')) {
                        typeClass = 'event-assignment';
                        if (event.urgent || typeLower.includes('report')) {
                            typeIcon = 'bi-exclamation-triangle-fill';
                        }
                    }

                    return (
                        <div
                            key={event.id}
                            className={`event-badge ${typeClass} ${event.completed ? 'event-completed' : ''}`}
                            title={`${event.title} (${event.time || ''})`}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent select-date click on the outer cell
                                onEventClick && onEventClick(event);
                            }}
                        >
                            {typeIcon && <i className={`bi ${typeIcon} event-icon`}></i>}
                            <span>{event.title}</span>
                        </div>
                    );
                })}

                {remainingCount > 0 && (
                    <div className="more-events-indicator">
                        +{remainingCount} More
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Calendar Month View Component
export const CalendarMonthView = ({
    currentMonth = "October",
    currentYear = 2026,
    calendarDays,
    events = defaultEvents,
    todaySummary = defaultTodaySummary,
    monthlyProgress = defaultMonthlyProgress,
    plannerInsight = defaultPlannerInsight,
    activeView = "Month",
    onViewChange,
    onDateClick,
    onEventClick,
    onAdjustSchedule
}) => {
    // 1. Month resolution
    const activeMonthIndex = useMemo(() => {
        if (typeof currentMonth === 'number') return currentMonth;
        const idx = monthNames.findIndex(m => m.toLowerCase() === currentMonth.toLowerCase());
        return idx !== -1 ? idx : 9; // Fallback to October
    }, [currentMonth]);

    const activeMonthName = useMemo(() => {
        return monthNames[activeMonthIndex];
    }, [activeMonthIndex]);

    // 2. Interactive Selection State (Local selection to show visual highlight immediately on click)
    const [localSelectedDate, setLocalSelectedDate] = useState(() => {
        // Default to October 24, 2026 (the "Today" marker in Figma mockup)
        return new Date(2026, 9, 24);
    });

    // 3. Grid generator fallback if calendarDays prop is not provided
    const daysGrid = useMemo(() => {
        if (calendarDays && calendarDays.length > 0) {
            return calendarDays;
        }

        const firstDayIndex = new Date(currentYear, activeMonthIndex, 1).getDay();
        const daysInCurrentMonth = new Date(currentYear, activeMonthIndex + 1, 0).getDate();
        const lastDayPrevMonth = new Date(currentYear, activeMonthIndex, 0).getDate();

        const list = [];

        // Trailing days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = lastDayPrevMonth - i;
            const prevMonthDate = new Date(
                activeMonthIndex === 0 ? currentYear - 1 : currentYear,
                activeMonthIndex === 0 ? 11 : activeMonthIndex - 1,
                dayNum
            );
            list.push({
                day: dayNum,
                date: prevMonthDate,
                isToday: false,
                isCurrentMonth: false
            });
        }

        // Days in the current month
        for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
            const currentMonthDate = new Date(currentYear, activeMonthIndex, dayNum);
            // Match today's date of October 24, 2026 to visually match the Figma screen
            const isToday = currentYear === 2026 && activeMonthIndex === 9 && dayNum === 24;
            list.push({
                day: dayNum,
                date: currentMonthDate,
                isToday,
                isCurrentMonth: true
            });
        }

        // Leading days from next month
        const remainingSlots = 42 - list.length;
        for (let dayNum = 1; dayNum <= remainingSlots; dayNum++) {
            const nextMonthDate = new Date(
                activeMonthIndex === 11 ? currentYear + 1 : currentYear,
                activeMonthIndex === 11 ? 0 : activeMonthIndex + 1,
                dayNum
            );
            list.push({
                day: dayNum,
                date: nextMonthDate,
                isToday: false,
                isCurrentMonth: false
            });
        }

        return list;
    }, [calendarDays, activeMonthIndex, currentYear]);

    // Handle day selection click
    const handleDayClick = (dayData) => {
        setLocalSelectedDate(dayData.date);
        if (onDateClick) {
            onDateClick(dayData.date);
        }
    };

    // Filter events for a particular day
    const getEventsForDay = (dayDate) => {
        const eventList = events || [];
        return eventList.filter(event => isSameDay(event.date, dayDate));
    };

    return (
        <div className="calendar-month-view-container container-fluid p-0">
            {/* 1. Header & Switcher Row */}
            <div className="row align-items-center mb-4">
                <div className="col-12 col-md-8">
                    <div className="calendar-title-info">
                        <h1>Study Calendar</h1>
                        <p className="subtitle">View your personalized study schedule for the month.</p>
                    </div>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-md-end mt-3 mt-md-0">
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
                </div>
            </div>

            {/* 2. Main Layout Split */}
            <div className="calendar-layout-row">
                {/* Calendar Grid on left */}
                <div className="calendar-main-col">
                    <div className="calendar-card">
                        <div className="month-year-title">
                            {activeMonthName} {currentYear}
                        </div>

                        <div className="calendar-grid-wrapper">
                            {/* Weekday headers row */}
                            <div className="calendar-weekdays-row">
                                {weekdays.map((dayName) => (
                                    <div key={dayName} className="weekday-header">
                                        {dayName}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days Grid */}
                            <div className="calendar-days-grid">
                                {daysGrid.map((dayData, index) => {
                                    const isSelected = localSelectedDate && isSameDay(dayData.date, localSelectedDate);
                                    const dayEvents = getEventsForDay(dayData.date);

                                    return (
                                        <CalendarDateCell
                                            key={`${dayData.date.toISOString()}-${index}`}
                                            day={dayData.day}
                                            isCurrentMonth={dayData.isCurrentMonth}
                                            isToday={dayData.isToday}
                                            isSelected={isSelected}
                                            events={dayEvents}
                                            onClick={() => handleDayClick(dayData)}
                                            onEventClick={onEventClick}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar on right */}
                <div className="calendar-sidebar-col">
                    {/* Today's Summary Card */}
                    <DashboardCard hover={false} shadow={true} padding="24px" className="today-summary-card-wrapper">
                        <div className="summary-card-title">
                            <i className="bi bi-file-earmark-check"></i>
                            <span>Today's Summary</span>
                        </div>

                        {/* Study Goal Reached bar */}
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

                        {/* Concentration Score display */}
                        <div className="summary-stat-box">
                            <span className="summary-stat-label">Concentration Score</span>
                            <span className="summary-stat-value">{todaySummary?.concentrationScore || 0}</span>
                        </div>
                    </DashboardCard>

                    {/* Monthly Progress Card (Gradient Background) */}
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

                    {/* Planner Insight Card (Light Cyan Background) */}
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

export default CalendarMonthView;
