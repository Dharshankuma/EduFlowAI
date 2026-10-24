import React, { useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import {
    MONTH_NAMES,
    WEEKDAYS_SUN_FIRST,
    generateMonthGrid,
    isSameDay,
    isCurrentMonthNow
} from '../../../../utils/calendarUtils';
import './CalendarMonthView.css';

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
    const visibleEvents = events.slice(0, 3);
    const remainingCount = events.length - 3;

    const cellClass = [
        'calendar-date-cell',
        !isCurrentMonth ? 'other-month' : '',
        isToday ? 'is-today' : '',
        isSelected ? 'selected-date' : ''
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cellClass}
            onClick={onClick}
            tabIndex={0}
            role="button"
            aria-label={`Date ${day}${isToday ? ', Today' : ''}${isSelected ? ', Selected' : ''}`}
        >
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
                                e.stopPropagation();
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
    currentMonth = new Date().getMonth(),
    currentYear = new Date().getFullYear(),
    selectedDate,
    events = [],
    todaySummary,
    monthlyProgress,
    plannerInsight,
    activeView = "Month",
    onViewChange,
    onPrevMonth,
    onNextMonth,
    onSelectMonth,
    onSelectYear,
    onToday,
    onDateClick,
    onEventClick,
    onAdjustSchedule
}) => {
    // 1. Resolve month index (0 to 11)
    const activeMonthIndex = useMemo(() => {
        if (typeof currentMonth === 'number') return currentMonth;
        const idx = MONTH_NAMES.findIndex(m => m.toLowerCase() === String(currentMonth).toLowerCase());
        return idx !== -1 ? idx : new Date().getMonth();
    }, [currentMonth]);

    const activeMonthName = useMemo(() => {
        return MONTH_NAMES[activeMonthIndex];
    }, [activeMonthIndex]);

    const isCurrentMonth = useMemo(() => {
        return isCurrentMonthNow(currentYear, activeMonthIndex);
    }, [currentYear, activeMonthIndex]);

    // 2. Generate month grid cells dynamically based on real dates
    const daysGrid = useMemo(() => {
        return generateMonthGrid(currentYear, activeMonthIndex);
    }, [currentYear, activeMonthIndex]);

    // 3. Filter events for a particular day
    const getEventsForDay = (dayDate) => {
        const eventList = events || [];
        return eventList.filter(event => isSameDay(event.date, dayDate));
    };

    // Years range for dropdown
    const yearOptions = useMemo(() => {
        const base = new Date().getFullYear();
        return [base - 2, base - 1, base, base + 1, base + 2];
    }, []);

    return (
        <div className="calendar-month-view-container container-fluid p-0">
            {/* 1. Header & Switcher Row */}
            <div className="row align-items-center mb-4">
                <div className="col-12 col-md-7">
                    <div className="calendar-title-info">
                        <h1>Study Calendar</h1>
                        <p className="subtitle">View and manage your personalized study schedule</p>
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

                        {/* Month navigation controls */}
                        <div className="today-control-wrapper">
                            <button
                                type="button"
                                className="today-nav-arrow"
                                onClick={onPrevMonth}
                                title="Previous Month"
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
                                onClick={onNextMonth}
                                title="Next Month"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Layout Split */}
            <div className="calendar-layout-row">
                {/* Calendar Grid on left */}
                <div className="calendar-main-col">
                    <div className="calendar-card">
                        {/* Elegant Month Card Header with clean title & custom month/year selectors */}
                        <div className="month-card-header">
                            <div className="month-card-title-group">
                                <button
                                    type="button"
                                    className="month-nav-arrow-btn"
                                    onClick={onPrevMonth}
                                    title="Previous Month"
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <h2 className="month-display-heading">
                                    {activeMonthName} {currentYear}
                                </h2>
                                <button
                                    type="button"
                                    className="month-nav-arrow-btn"
                                    onClick={onNextMonth}
                                    title="Next Month"
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                                {isCurrentMonth && (
                                    <span className="current-month-badge">
                                        <i className="bi bi-check2-circle"></i> Current Month
                                    </span>
                                )}
                            </div>

                            {/* Clean, luxury Month & Year Selectors */}
                            <div className="month-selectors-wrapper">
                                <div className="custom-select-box">
                                    <select
                                        className="styled-calendar-select"
                                        value={activeMonthIndex}
                                        onChange={(e) => onSelectMonth && onSelectMonth(Number(e.target.value))}
                                        title="Select Month"
                                    >
                                        {MONTH_NAMES.map((name, idx) => (
                                            <option key={name} value={idx}>{name}</option>
                                        ))}
                                    </select>
                                    <i className="bi bi-chevron-down select-caret"></i>
                                </div>

                                <div className="custom-select-box year-select">
                                    <select
                                        className="styled-calendar-select"
                                        value={currentYear}
                                        onChange={(e) => onSelectYear && onSelectYear(Number(e.target.value))}
                                        title="Select Year"
                                    >
                                        {yearOptions.map((yr) => (
                                            <option key={yr} value={yr}>{yr}</option>
                                        ))}
                                    </select>
                                    <i className="bi bi-chevron-down select-caret"></i>
                                </div>
                            </div>
                        </div>

                        <div className="calendar-grid-wrapper">
                            {/* Weekday headers row */}
                            <div className="calendar-weekdays-row">
                                {WEEKDAYS_SUN_FIRST.map((dayName) => (
                                    <div key={dayName} className="weekday-header">
                                        {dayName}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days Grid */}
                            <div className="calendar-days-grid">
                                {daysGrid.map((dayData, index) => {
                                    const isSelected = selectedDate && isSameDay(dayData.date, selectedDate);
                                    const dayEvents = getEventsForDay(dayData.date);

                                    return (
                                        <CalendarDateCell
                                            key={`${dayData.date.toISOString()}-${index}`}
                                            day={dayData.day}
                                            isCurrentMonth={dayData.isCurrentMonth}
                                            isToday={dayData.isToday}
                                            isSelected={isSelected}
                                            events={dayEvents}
                                            onClick={() => onDateClick && onDateClick(dayData.date)}
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
                                value={todaySummary?.studyGoal || 85}
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
                            <span className="summary-stat-value">{todaySummary?.concentrationScore || 92}</span>
                        </div>
                    </DashboardCard>

                    {/* Monthly Progress Card (Gradient Background) */}
                    <DashboardCard hover={false} shadow={true} padding="24px" className="monthly-progress-card">
                        <div className="progress-card-title">Monthly Progress</div>
                        <div className="progress-hours-val">{monthlyProgress?.totalStudyHours || 124}h</div>
                        <div className="progress-hours-lbl">Total Study Hours ({activeMonthName})</div>

                        <div className="progress-stats-row">
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.completedSessions || 42}</span>
                                <span className="progress-stat-desc">Completed</span>
                            </div>
                            <div className="progress-stat-item">
                                <span className="progress-stat-num">{monthlyProgress?.upcomingSessions || 18}</span>
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
                            {plannerInsight?.recommendation || "Your study schedule is balanced for optimal retention."}
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
