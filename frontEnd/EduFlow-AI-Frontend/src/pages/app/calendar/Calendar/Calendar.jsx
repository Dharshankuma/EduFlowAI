import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarMonthView from '../../../../components/app/calendar/CalendarMonthView/CalendarMonthView';
import CalendarWeekView from '../../../../components/app/calendar/CalendarWeekView/CalendarWeekView';
import CalendarDayView from '../../../../components/app/calendar/CalendarDayView/CalendarDayView';
import { useAppState } from '../../../../context/StateContext';
import {
    getCalendarEvents,
    getCalendarDay,
    getCalendarTodaySummary,
    getCalendarMonthlyProgress
} from '../../../../api/calendar/calendarApi';
import {
    getRealToday,
    isSameDay,
    getWeeksInMonth,
    findWeekIndexForDate,
    generateMonthGrid
} from '../../../../utils/calendarUtils';
import './Calendar.css';

export const Calendar = () => {
    const navigate = useNavigate();

    // 1. Controller view switcher state ("Month", "Week", "Day")
    const [activeView, setActiveView] = useState("Month");
    const { setCalendarEvents } = useAppState();

    // Calendar events state (real data from API)
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Real System Date Initialization (No hardcoded mock anchor)
    const [selectedDate, setSelectedDate] = useState(() => getRealToday());
    const [currentYear, setCurrentYear] = useState(() => getRealToday().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(() => getRealToday().getMonth()); // 0-based
    const [currentWeekIndex, setCurrentWeekIndex] = useState(() => findWeekIndexForDate(getRealToday()));

    // Dynamic weeks list for currently viewed year and month
    const weeks = useMemo(() => {
        return getWeeksInMonth(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    // Safety check: ensure currentWeekIndex is within bounds if month changes
    const safeWeekIndex = useMemo(() => {
        if (!weeks || weeks.length === 0) return 0;
        return Math.max(0, Math.min(currentWeekIndex, weeks.length - 1));
    }, [weeks, currentWeekIndex]);

    // Widget summaries and progress loaded from backend
    const [todaySummary, setTodaySummary] = useState(null);
    const [monthlyProgress, setMonthlyProgress] = useState(null);

    // AI Planner Insight UI
    const [plannerInsight, setPlannerInsight] = useState({
        recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
    });

    // Guard against outdated requests overwriting newer state
    const activeRequestIdRef = useRef(0);

    // Fetch events for current view and date parameters
    const fetchEvents = useCallback(async () => {
        const requestId = ++activeRequestIdRef.current;
        setIsLoading(true);
        setError(null);

        try {
            let fetchedEvents = [];
            const viewType = activeView.toLowerCase();

            if (viewType === 'day') {
                fetchedEvents = await getCalendarDay(selectedDate);
            } else if (viewType === 'week') {
                if (weeks[safeWeekIndex] && weeks[safeWeekIndex].days.length > 0) {
                    const firstDay = weeks[safeWeekIndex].days[0].date;
                    const lastDay = weeks[safeWeekIndex].days[weeks[safeWeekIndex].days.length - 1].date;
                    const fromDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate(), 0, 0, 0);
                    const toDate = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), 23, 59, 59);
                    fetchedEvents = await getCalendarEvents(fromDate, toDate);
                }
            } else {
                // Month view - fetch full visible grid bounds
                const grid = generateMonthGrid(currentYear, currentMonth);
                if (grid.length > 0) {
                    const firstDay = grid[0].date;
                    const lastDay = grid[grid.length - 1].date;
                    const fromDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate(), 0, 0, 0);
                    const toDate = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), 23, 59, 59);
                    fetchedEvents = await getCalendarEvents(fromDate, toDate);
                }
            }

            if (requestId === activeRequestIdRef.current) {
                setEvents(fetchedEvents);
                if (setCalendarEvents) {
                    setCalendarEvents(fetchedEvents);
                }
            }
        } catch (err) {
            if (requestId === activeRequestIdRef.current) {
                console.error("Error fetching calendar events:", err);
                setError("Unable to load calendar events. Please check your network and try again.");
            }
        } finally {
            if (requestId === activeRequestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [activeView, selectedDate, weeks, safeWeekIndex, currentYear, currentMonth, setCalendarEvents]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Fetch Monthly Progress whenever year or month changes
    useEffect(() => {
        let isCancelled = false;
        const fetchProgress = async () => {
            try {
                // Backend expects 1-based month (1 to 12)
                const data = await getCalendarMonthlyProgress(currentYear, currentMonth + 1);
                if (!isCancelled && data) {
                    setMonthlyProgress(data);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Error fetching monthly progress:", err);
                }
            }
        };

        fetchProgress();
        return () => {
            isCancelled = true;
        };
    }, [currentYear, currentMonth]);

    // Fetch Today's Summary whenever selectedDate changes
    useEffect(() => {
        let isCancelled = false;
        const fetchSummary = async () => {
            try {
                const data = await getCalendarTodaySummary(selectedDate);
                if (!isCancelled && data) {
                    setTodaySummary(data);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Error fetching daily summary:", err);
                }
            }
        };

        fetchSummary();
        return () => {
            isCancelled = true;
        };
    }, [selectedDate]);

    // 3. View Switcher handler
    const handleViewChange = (newView) => {
        setActiveView(newView);
        if (newView.toLowerCase() === 'day') {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on today's afternoon sessions. Consider moving one revision session to tomorrow for better retention."
            });
        } else if (newView.toLowerCase() === 'week') {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on Tuesday afternoon. Consider moving one revision session to Thursday for better retention."
            });
        } else {
            setPlannerInsight({
                recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
            });
        }
    };

    // 4. "Today" button handler across all views
    const handleToday = () => {
        const today = getRealToday();
        setSelectedDate(today);
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
        setCurrentWeekIndex(findWeekIndexForDate(today));
    };

    // 5. Month View Navigation Handlers
    const handleSelectMonth = (monthIdx) => {
        setCurrentMonth(monthIdx);
        const today = getRealToday();
        if (monthIdx === today.getMonth() && currentYear === today.getFullYear()) {
            setSelectedDate(today);
            setCurrentWeekIndex(findWeekIndexForDate(today));
        } else {
            setSelectedDate(new Date(currentYear, monthIdx, 1));
            setCurrentWeekIndex(0);
        }
    };

    const handleSelectYear = (yr) => {
        setCurrentYear(yr);
        const today = getRealToday();
        if (currentMonth === today.getMonth() && yr === today.getFullYear()) {
            setSelectedDate(today);
            setCurrentWeekIndex(findWeekIndexForDate(today));
        } else {
            setSelectedDate(new Date(yr, currentMonth, 1));
            setCurrentWeekIndex(0);
        }
    };

    const handlePrevMonth = () => {
        let prevM = currentMonth - 1;
        let prevY = currentYear;
        if (prevM < 0) {
            prevM = 11;
            prevY -= 1;
        }
        setCurrentYear(prevY);
        setCurrentMonth(prevM);
        const today = getRealToday();
        if (prevM === today.getMonth() && prevY === today.getFullYear()) {
            setSelectedDate(today);
            setCurrentWeekIndex(findWeekIndexForDate(today));
        } else {
            setSelectedDate(new Date(prevY, prevM, 1));
            setCurrentWeekIndex(0);
        }
    };

    const handleNextMonth = () => {
        let nextM = currentMonth + 1;
        let nextY = currentYear;
        if (nextM > 11) {
            nextM = 0;
            nextY += 1;
        }
        setCurrentYear(nextY);
        setCurrentMonth(nextM);
        const today = getRealToday();
        if (nextM === today.getMonth() && nextY === today.getFullYear()) {
            setSelectedDate(today);
            setCurrentWeekIndex(findWeekIndexForDate(today));
        } else {
            setSelectedDate(new Date(nextY, nextM, 1));
            setCurrentWeekIndex(0);
        }
    };

    const handleDateClick = (dateObj) => {
        setSelectedDate(dateObj);
        setCurrentYear(dateObj.getFullYear());
        setCurrentMonth(dateObj.getMonth());
        const mWeeks = getWeeksInMonth(dateObj.getFullYear(), dateObj.getMonth());
        const wIdx = mWeeks.findIndex(w => w.days.some(d => isSameDay(d.date, dateObj)));
        if (wIdx !== -1) {
            setCurrentWeekIndex(wIdx);
        }
    };

    // 6. Week View Navigation Handlers
    const handleSelectWeek = (weekIdx) => {
        setCurrentWeekIndex(weekIdx);
        if (weeks[weekIdx]) {
            const today = getRealToday();
            const containsToday = weeks[weekIdx].days.some(d => isSameDay(d.date, today));
            if (containsToday) {
                setSelectedDate(today);
            } else {
                setSelectedDate(weeks[weekIdx].startDate);
            }
        }
    };

    const handlePrevWeek = () => {
        if (safeWeekIndex > 0) {
            const newIdx = safeWeekIndex - 1;
            setCurrentWeekIndex(newIdx);
            if (weeks[newIdx]) {
                const today = getRealToday();
                const containsToday = weeks[newIdx].days.some(d => isSameDay(d.date, today));
                setSelectedDate(containsToday ? today : weeks[newIdx].startDate);
            }
        } else {
            let prevM = currentMonth - 1;
            let prevY = currentYear;
            if (prevM < 0) {
                prevM = 11;
                prevY -= 1;
            }
            const prevWeeks = getWeeksInMonth(prevY, prevM);
            setCurrentYear(prevY);
            setCurrentMonth(prevM);
            const lastWeekIdx = Math.max(0, prevWeeks.length - 1);
            setCurrentWeekIndex(lastWeekIdx);
            if (prevWeeks[lastWeekIdx]) {
                setSelectedDate(prevWeeks[lastWeekIdx].startDate);
            }
        }
    };

    const handleNextWeek = () => {
        if (safeWeekIndex < weeks.length - 1) {
            const newIdx = safeWeekIndex + 1;
            setCurrentWeekIndex(newIdx);
            if (weeks[newIdx]) {
                const today = getRealToday();
                const containsToday = weeks[newIdx].days.some(d => isSameDay(d.date, today));
                setSelectedDate(containsToday ? today : weeks[newIdx].startDate);
            }
        } else {
            let nextM = currentMonth + 1;
            let nextY = currentYear;
            if (nextM > 11) {
                nextM = 0;
                nextY += 1;
            }
            const nextWeeks = getWeeksInMonth(nextY, nextM);
            setCurrentYear(nextY);
            setCurrentMonth(nextM);
            setCurrentWeekIndex(0);
            if (nextWeeks[0]) {
                setSelectedDate(nextWeeks[0].startDate);
            }
        }
    };

    // 7. Day View Navigation Handlers
    const handlePrevDay = () => {
        const prevDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
        setCurrentYear(prevDay.getFullYear());
        setCurrentMonth(prevDay.getMonth());
        const mWeeks = getWeeksInMonth(prevDay.getFullYear(), prevDay.getMonth());
        const wIdx = mWeeks.findIndex(w => w.days.some(d => isSameDay(d.date, prevDay)));
        if (wIdx !== -1) {
            setCurrentWeekIndex(wIdx);
        }
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
        setCurrentYear(nextDay.getFullYear());
        setCurrentMonth(nextDay.getMonth());
        const mWeeks = getWeeksInMonth(nextDay.getFullYear(), nextDay.getMonth());
        const wIdx = mWeeks.findIndex(w => w.days.some(d => isSameDay(d.date, nextDay)));
        if (wIdx !== -1) {
            setCurrentWeekIndex(wIdx);
        }
    };

    // 8. Event actions
    const handleEventClick = (event) => {
        console.log("Active event selected:", event);
    };

    const handleViewGoal = (event) => {
        const goalIdentifier = event?.goalIdentifier || event?.goalId;
        if (goalIdentifier) {
            navigate(`/goals/${encodeURIComponent(goalIdentifier)}`);
        } else {
            navigate('/goals');
        }
    };

    const handleMarkComplete = () => {
        // Backend does not expose an endpoint to mark calendar schedules complete
        alert(`Schedule completion status cannot be updated: no backend endpoint is available for this action.`);
    };

    const handleReschedule = () => {
        // Rescheduling is explicitly excluded from implementation
    };

    const handleAdjustSchedule = () => {
        navigate('/ai-planner');
    };

    // 9. Active View Assembly
    const renderActiveCalendarView = () => {
        const viewType = activeView.toLowerCase();
        
        const commonProps = {
            events,
            todaySummary,
            monthlyProgress,
            plannerInsight,
            activeView,
            onViewChange: handleViewChange,
            onToday: handleToday,
            onEventClick: handleEventClick,
            onViewGoal: handleViewGoal,
            onMarkComplete: handleMarkComplete,
            onReschedule: handleReschedule,
            onAdjustSchedule: handleAdjustSchedule
        };

        switch (viewType) {
            case 'week':
                return (
                    <CalendarWeekView
                        {...commonProps}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        currentWeekIndex={safeWeekIndex}
                        weeks={weeks}
                        selectedDate={selectedDate}
                        onPrevWeek={handlePrevWeek}
                        onNextWeek={handleNextWeek}
                        onSelectWeek={handleSelectWeek}
                    />
                );
            case 'day':
                return (
                    <CalendarDayView
                        {...commonProps}
                        selectedDate={selectedDate}
                        onPrevDay={handlePrevDay}
                        onNextDay={handleNextDay}
                    />
                );
            case 'month':
            default:
                return (
                    <CalendarMonthView
                        {...commonProps}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        selectedDate={selectedDate}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        onSelectMonth={handleSelectMonth}
                        onSelectYear={handleSelectYear}
                        onDateClick={handleDateClick}
                    />
                );
        }
    };

    return (
        <div className="calendar-page-wrapper">
            {error && (
                <div className="calendar-error-banner" role="alert">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        className="calendar-retry-btn"
                        onClick={fetchEvents}
                    >
                        Retry
                    </button>
                </div>
            )}
            {isLoading && (
                <div className="calendar-status-bar">
                    <div className="calendar-loading-badge">
                        <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                        <span>Loading calendar data...</span>
                    </div>
                </div>
            )}
            {renderActiveCalendarView()}
        </div>
    );
};

export default Calendar;
