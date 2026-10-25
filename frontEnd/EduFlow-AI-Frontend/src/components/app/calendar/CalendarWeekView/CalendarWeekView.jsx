import React, { useState, useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import {
    MONTH_NAMES,
    isSameDay,
    getWeeksInMonth
} from '../../../../utils/calendarUtils';
import './CalendarWeekView.css';

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

export const CalendarWeekView = ({
    currentMonth = 9,
    currentYear = 2026,
    currentWeekIndex = 0,
    weeks: providedWeeks,
    events = [],
    selectedDate,
    timeSlots = defaultTimeSlots,
    todaySummary,
    monthlyProgress,
    plannerInsight,
    activeView = "Week",
    onPrevWeek,
    onNextWeek,
    onSelectWeek,
    onToday,
    onViewChange,
    onEventClick,
    onViewGoal,
    onMarkComplete,
    onReschedule,
    onAdjustSchedule
}) => {
    // 1. Resolve month index (0 to 11)
    const activeMonthIndex = useMemo(() => {
        if (typeof currentMonth === 'number') return currentMonth;
        const idx = MONTH_NAMES.findIndex(m => m.toLowerCase() === String(currentMonth).toLowerCase());
        return idx !== -1 ? idx : 9;
    }, [currentMonth]);

    const activeMonthName = useMemo(() => {
        return MONTH_NAMES[activeMonthIndex];
    }, [activeMonthIndex]);

    // 2. Resolve weeks for this month
    const weeks = useMemo(() => {
        if (providedWeeks && providedWeeks.length > 0) return providedWeeks;
        return getWeeksInMonth(currentYear, activeMonthIndex);
    }, [providedWeeks, currentYear, activeMonthIndex]);

    // 3. Resolve active week object
    const activeWeek = useMemo(() => {
        if (!weeks || weeks.length === 0) return null;
        const safeIdx = Math.max(0, Math.min(currentWeekIndex, weeks.length - 1));
        return weeks[safeIdx];
    }, [weeks, currentWeekIndex]);

    // 4. Days of this active week
    const weekDays = useMemo(() => {
        if (!activeWeek || !activeWeek.days) return [];
        return activeWeek.days;
    }, [activeWeek]);

    // 5. Timeline bounds start hour
    const timelineStartHour = useMemo(() => {
        if (!timeSlots || timeSlots.length === 0) return 6;
        return parseTimeToHour(timeSlots[0]);
    }, [timeSlots]);

    // 6. Popover state for clicked event details
    const [activeEvent, setActiveEvent] = useState(null);
    const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });

    // 7. Check if today is present in the current week
    const hasTodayInWeek = useMemo(() => {
        return weekDays.some(d => d.isToday);
    }, [weekDays]);

    // 8. Match event date to weekday column index (0-6)
    const getEventDayIndex = (eventDateStr) => {
        return weekDays.findIndex(day => isSameDay(day.date, eventDateStr));
    };

    // Helper to extract hour number from an ISO string, Date object, or time string
    const getHoursFromIsoOrDate = (val) => {
        if (!val) return null;
        const d = new Date(val);
        if (isNaN(d.getTime())) return null;
        return d.getHours() + (d.getMinutes() / 60);
    };

    // 9. Calculate layout positioning metrics for event cards
    const getEventStyles = (event, dayIndex) => {
        let start = getHoursFromIsoOrDate(event.start);
        let end = getHoursFromIsoOrDate(event.end);

        if (start === null || end === null) {
            const parsed = parseTimeRange(event.time);
            if (start === null) start = parsed.start;
            if (end === null) end = parsed.end || (start + (Number(event.plannedHours) || 1));
        }

        const slotHeight = 100; // height of each hour slot in pixels
        const duration = Math.max(end - start, 0.5);
        const top = Math.max(0, (start - timelineStartHour) * slotHeight);
        const height = Math.max(duration * slotHeight, 38);
        
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
        const parentRect = e.currentTarget.offsetParent ? e.currentTarget.offsetParent.getBoundingClientRect() : rect;
        
        let leftPos = rect.left - parentRect.left + rect.width + 10;
        let topPos = rect.top - parentRect.top;
        
        // Overflow fallback if popover extends beyond container width
        if (leftPos + 290 > parentRect.width) {
            leftPos = rect.left - parentRect.left - 300;
        }
        
        setPopoverCoords({
            top: Math.max(0, topPos),
            left: Math.max(10, leftPos)
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
                        <p className="subtitle">Weekly Study Schedule</p>
                        <p className="calendar-date-display">
                            {activeWeek ? activeWeek.fullLabel : `${activeMonthName} ${currentYear}`}
                        </p>
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

                        {/* Week navigation arrows: < (Prev Week), Today, > (Next Week) */}
                        <div className="today-control-wrapper">
                            <button
                                type="button"
                                className="today-nav-arrow"
                                onClick={onPrevWeek}
                                title="Previous Week"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <ButtonComponent
                                type="button"
                                text="Today"
                                className="today-btn"
                                onclick={onToday}
                            />
                            <button
                                type="button"
                                className="today-nav-arrow"
                                onClick={onNextWeek}
                                title="Next Week"
                            >
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
                        {/* Week Card Header: Month/Week Title + Direct Week Selector Pills (Week 1, Week 2...) */}
                        <div className="week-card-header">
                            <div className="week-card-title-group">
                                <h2 className="week-month-heading">{activeMonthName} {currentYear}</h2>
                                {activeWeek && (
                                    <span className="week-range-badge">
                                        {activeWeek.rangeLabel}
                                    </span>
                                )}
                            </div>

                            {/* Direct Week Selector Pills: Week 1, Week 2, Week 3, Week 4, Week 5 */}
                            <div className="week-pills-container">
                                {weeks.map((week, idx) => (
                                    <button
                                        key={week.weekNumber}
                                        type="button"
                                        className={`week-pill-btn ${idx === currentWeekIndex ? 'active' : ''}`}
                                        onClick={() => onSelectWeek && onSelectWeek(idx)}
                                        title={`${week.shortLabel}: ${week.rangeLabel}`}
                                    >
                                        Week {week.weekNumber}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="week-planner-scroll-box">
                            <div className="week-planner-container">
                                
                                {/* 2.1 Week Header row with dynamically computed dates */}
                                <div className="week-grid-row week-header-row">
                                    <div className="week-header-timezone-lbl">GMT-5</div>
                                    {weekDays.map((day) => {
                                        const isSelected = selectedDate && isSameDay(day.date, selectedDate);
                                        const headerClass = [
                                            'week-day-header-cell',
                                            day.isToday ? 'is-today-header' : '',
                                            isSelected ? 'is-selected-header' : ''
                                        ].filter(Boolean).join(' ');

                                        return (
                                            <div key={`${day.name}-${day.dayNumber}`} className={headerClass}>
                                                <span className="day-name">{day.name}</span>
                                                <span className="day-number">{day.dayNumber}</span>
                                                {day.isToday && <span className="today-dot-indicator"></span>}
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
                                                key={`${day.name}-${day.dayNumber}`}
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

                                    {/* Current timeline indicator line (visible when today is inside this week) */}
                                    {hasTodayInWeek && (
                                        <div className="current-time-indicator" style={{ top: '650px' }}>
                                            <div className="current-time-dot"></div>
                                        </div>
                                    )}

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
                                                            {/* <ButtonComponent
                                                                type="button"
                                                                text="Reschedule"
                                                                className="btn-reschedule"
                                                                onclick={() => onReschedule && onReschedule(activeEvent)}
                                                            /> */}
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
                    <DashboardCard hover={false} shadow={true} padding="18px 20px">
                        <div className="summary-card-title">
                            <i className="bi bi-file-earmark-check"></i>
                            <span>Today's Summary</span>
                        </div>

                        <div className="study-goal-section mb-3">
                            <ProgressBar
                                value={todaySummary?.studyGoalReachedPercentage ?? todaySummary?.studyGoal ?? 0}
                                max={100}
                                label="Study Goal Reached"
                                height="8px"
                                animated={true}
                                showPercentage={true}
                            />
                        </div>

                        <div className="summary-stat-box">
                            <span className="summary-stat-label">Concentration Score</span>
                            <span className="summary-stat-value">
                                {todaySummary?.concentrationScore !== null && todaySummary?.concentrationScore !== undefined
                                    ? `${todaySummary.concentrationScore}%`
                                    : '--'}
                            </span>
                        </div>
                    </DashboardCard>

                    {/* Monthly Progress Card */}
                    <DashboardCard hover={false} shadow={true} padding="18px 20px" className="monthly-progress-card">
                        <div className="progress-card-title">Monthly Progress</div>
                        <div className="progress-hours-val">{monthlyProgress?.totalStudyHours ?? 0}h</div>
                        <div className="progress-hours-lbl">Total Study Hours ({activeMonthName})</div>

                        <div className="progress-stats-row">
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.completedSessions ?? 0}</span>
                                <span className="progress-stat-desc">Completed</span>
                            </div>
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.upcomingSessions ?? 0}</span>
                                <span className="progress-stat-desc">Upcoming</span>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* AI Planner Insight Card */}
                    <DashboardCard hover={true} shadow={true} padding="18px 20px" className="planner-insight-card">
                        <div className="insight-header">
                            <i className="bi bi-stars"></i>
                            <span>AI Planner Insight</span>
                        </div>
                        <p className="insight-recommendation">
                            {plannerInsight?.recommendation || "Your weekly study workload is distributed evenly."}
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
