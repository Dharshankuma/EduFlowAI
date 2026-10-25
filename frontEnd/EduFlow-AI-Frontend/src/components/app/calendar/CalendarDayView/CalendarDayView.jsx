import React, { useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import {
    MONTH_NAMES,
    isSameDay,
    parseDateSafe,
    formatFullDate,
    getRealToday,
    isTodayDate
} from '../../../../utils/calendarUtils';
import './CalendarDayView.css';

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

// Default mock values representing standard day timeline slots
const defaultTimeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM", "11:00 PM"
];

export const CalendarDayView = ({
    selectedDate = getRealToday(),
    timeSlots = defaultTimeSlots,
    events = [],
    todaySummary,
    monthlyProgress,
    plannerInsight,
    activeView = "Day",
    onPrevDay,
    onNextDay,
    onToday,
    onViewChange,
    onEventClick,
    onViewGoal,
    onMarkComplete,
    onReschedule,
    onAdjustSchedule
}) => {
    // 1. Resolve safe date
    const activeDate = useMemo(() => parseDateSafe(selectedDate), [selectedDate]);
    const formattedDateString = useMemo(() => formatFullDate(activeDate), [activeDate]);
    const isToday = useMemo(() => isTodayDate(activeDate), [activeDate]);
    const activeMonthName = useMemo(() => MONTH_NAMES[activeDate.getMonth()], [activeDate]);

    // 2. Timeline start parameters
    const timelineStartHour = useMemo(() => {
        if (!timeSlots || timeSlots.length === 0) return 6;
        return parseTimeToHour(timeSlots[0]);
    }, [timeSlots]);

    // Helper to extract hour number from an ISO string, Date object, or time string
    const getHoursFromIsoOrDate = (val) => {
        if (!val) return null;
        const d = new Date(val);
        if (isNaN(d.getTime())) return null;
        return d.getHours() + (d.getMinutes() / 60);
    };

    // 3. Compute absolute placement style for event cards on desktop
    const getEventStyle = (event) => {
        let start = getHoursFromIsoOrDate(event.start);
        let end = getHoursFromIsoOrDate(event.end);

        if (start === null || end === null) {
            const parsed = parseTimeRange(event.time);
            if (start === null) start = parsed.start;
            if (end === null) end = parsed.end || (start + (Number(event.plannedHours) || 1));
        }

        const slotHeight = 130; // matching CSS slot height in px
        const duration = Math.max(end - start, 0.5);
        const top = Math.max(0, (start - timelineStartHour) * slotHeight + 8);
        const height = Math.max(duration * slotHeight - 16, 55);
        
        return {
            top: `${top}px`,
            height: `${height}px`
        };
    };

    // 4. Filter events strictly for the active selected day
    const dayEvents = useMemo(() => {
        const list = events || [];
        return list.filter(event => isSameDay(event.date, activeDate));
    }, [events, activeDate]);

    return (
        <div className="calendar-day-view-container container-fluid p-0">
            {/* 1. Header Area with dynamic dates & switcher */}
            <div className="row align-items-center mb-4">
                <div className="col-12 col-md-7">
                    <div className="calendar-title-info">
                        <h1>Study Calendar</h1>
                        <p className="subtitle">Daily Study Schedule</p>
                        <p className="calendar-date-display">{formattedDateString}</p>
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

                        {/* Day navigation controls: < (Prev Day), Today, > (Next Day) */}
                        <div className="today-control-wrapper">
                            <button
                                type="button"
                                className="today-nav-arrow"
                                onClick={onPrevDay}
                                title="Previous Day"
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
                                onClick={onNextDay}
                                title="Next Day"
                            >
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
                        {/* Day Card Header with Prev/Next buttons and Session count */}
                        <div className="day-card-header">
                            <div className="day-card-title-group">
                                <h2 className="day-main-title">{formattedDateString}</h2>
                                {isToday && (
                                    <span className="today-badge-pill">
                                        <i className="bi bi-star-fill"></i> Today
                                    </span>
                                )}
                            </div>

                            <div className="day-session-count-tag">
                                <i className="bi bi-calendar2-check"></i>
                                <span>{dayEvents.length} {dayEvents.length === 1 ? 'Session' : 'Sessions'} Scheduled</span>
                            </div>
                        </div>

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
                                    
                                    const cardStyle = getEventStyle(event);
                                    
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
                                                        {event.priority || 'Normal'} Priority
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
                                                        {/* <ButtonComponent
                                                            type="button"
                                                            text="Reschedule"
                                                            className="btn-reschedule"
                                                            onclick={() => onReschedule && onReschedule(event)}
                                                        /> */}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Empty state if no sessions for this day */}
                                {dayEvents.length === 0 && (
                                    <div className="empty-day-state-wrapper">
                                        <div className="empty-day-icon">
                                            <i className="bi bi-cup-hot"></i>
                                        </div>
                                        <h4>No Study Sessions on this Day</h4>
                                        <p>You have no planned tasks scheduled for {formattedDateString}.</p>
                                        <div className="empty-day-action">
                                            <ButtonComponent
                                                type="button"
                                                text="Plan a Session with AI →"
                                                onclick={onAdjustSchedule}
                                            />
                                        </div>
                                    </div>
                                )}
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
                    <DashboardCard hover={false} shadow={true} padding="24px" className="monthly-progress-card">
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
                    <DashboardCard hover={true} shadow={true} padding="24px" className="planner-insight-card">
                        <div className="insight-header">
                            <i className="bi bi-stars"></i>
                            <span>AI Planner Insight</span>
                        </div>
                        <p className="insight-recommendation">
                            {plannerInsight?.recommendation || "Your workload for this day is well distributed."}
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
