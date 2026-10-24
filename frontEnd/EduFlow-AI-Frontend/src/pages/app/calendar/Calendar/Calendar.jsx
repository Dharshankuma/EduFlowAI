import React, { useState, useMemo } from 'react';
import CalendarMonthView from '../../../../components/app/calendar/CalendarMonthView/CalendarMonthView';
import CalendarWeekView from '../../../../components/app/calendar/CalendarWeekView/CalendarWeekView';
import CalendarDayView from '../../../../components/app/calendar/CalendarDayView/CalendarDayView';
import { useAppState } from '../../../../context/StateContext';
import {
    TODAY_ANCHOR,
    MONTH_NAMES,
    isSameDay,
    getWeeksInMonth
} from '../../../../utils/calendarUtils';
import './Calendar.css';

export const Calendar = () => {
    // 1. Controller view switcher state
    const [activeView, setActiveView] = useState("Month"); // "Month", "Week", "Day"
    const { calendarEvents, setCalendarEvents } = useAppState();

    // 2. Coordinated calendar timeline states anchored to TODAY_ANCHOR (Oct 24, 2026)
    const [selectedDate, setSelectedDate] = useState(TODAY_ANCHOR);
    const [currentYear, setCurrentYear] = useState(TODAY_ANCHOR.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(TODAY_ANCHOR.getMonth()); // 0-based index (9 = October)
    
    // Find initial week index for TODAY_ANCHOR in October
    const initialWeeks = useMemo(() => getWeeksInMonth(2026, 9), []);
    const initialWeekIdx = useMemo(() => {
        const idx = initialWeeks.findIndex(w => w.days.some(d => isSameDay(d.date, TODAY_ANCHOR)));
        return idx !== -1 ? idx : 3;
    }, [initialWeeks]);

    const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIdx);

    // Dynamic weeks list for currently selected year and month
    const weeks = useMemo(() => {
        return getWeeksInMonth(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    // Safety check: ensure currentWeekIndex is within bounds if month changes
    const safeWeekIndex = useMemo(() => {
        if (!weeks || weeks.length === 0) return 0;
        return Math.max(0, Math.min(currentWeekIndex, weeks.length - 1));
    }, [weeks, currentWeekIndex]);

    // Widget summaries and progress
    const [todaySummary] = useState({
        studyGoal: 85,
        concentrationScore: 92
    });

    const [monthlyProgress] = useState({
        totalStudyHours: 124,
        completedSessions: 42,
        upcomingSessions: 18
    });

    const [plannerInsight, setPlannerInsight] = useState({
        recommendation: "Your workload is concentrated on Oct 24-25. Would you like to distribute some tasks to the 26th for better retention?"
    });

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
        setSelectedDate(TODAY_ANCHOR);
        setCurrentYear(TODAY_ANCHOR.getFullYear());
        setCurrentMonth(TODAY_ANCHOR.getMonth());
        const octWeeks = getWeeksInMonth(TODAY_ANCHOR.getFullYear(), TODAY_ANCHOR.getMonth());
        const tIdx = octWeeks.findIndex(w => w.days.some(d => isSameDay(d.date, TODAY_ANCHOR)));
        setCurrentWeekIndex(tIdx !== -1 ? tIdx : 3);
    };

    // 5. Month View Navigation Handlers
    const handlePrevMonth = () => {
        let prevM = currentMonth - 1;
        let prevY = currentYear;
        if (prevM < 0) {
            prevM = 11;
            prevY -= 1;
        }
        setCurrentYear(prevY);
        setCurrentMonth(prevM);
        setCurrentWeekIndex(0);
        setSelectedDate(new Date(prevY, prevM, 1));
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
        setCurrentWeekIndex(0);
        setSelectedDate(new Date(nextY, nextM, 1));
    };

    const handleSelectMonth = (monthIdx) => {
        setCurrentMonth(monthIdx);
        setCurrentWeekIndex(0);
        setSelectedDate(new Date(currentYear, monthIdx, 1));
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
            setSelectedDate(weeks[weekIdx].startDate);
        }
    };

    const handlePrevWeek = () => {
        if (safeWeekIndex > 0) {
            // Move to previous week within current month
            const newIdx = safeWeekIndex - 1;
            setCurrentWeekIndex(newIdx);
            if (weeks[newIdx]) {
                setSelectedDate(weeks[newIdx].startDate);
            }
        } else {
            // Reached before Week 1 of current month: automatically jump to previous month's last week!
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
            // Move to next week within current month
            const newIdx = safeWeekIndex + 1;
            setCurrentWeekIndex(newIdx);
            if (weeks[newIdx]) {
                setSelectedDate(weeks[newIdx].startDate);
            }
        } else {
            // Reached the end of weeks for this month: automatically change to next month's Week 1!
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
        alert(`Navigating to study goal tracker for course: ${event.course || 'Core Study'}`);
    };

    const handleMarkComplete = (event) => {
        setCalendarEvents(prevEvents =>
            prevEvents.map(e =>
                e.id === event.id
                    ? { ...e, status: "Completed", completed: true }
                    : e
            )
        );
    };

    const handleReschedule = (event) => {
        const confirmChange = window.confirm(`Reschedule requested for "${event.title}". Would you like the AI Planner Engine to recommend alternative slots?`);
        if (confirmChange) {
            alert(`Rescheduled successfully! The new schedule has been updated.`);
        }
    };

    const handleAdjustSchedule = () => {
        alert("AI Planner: Optimization in progress... Adjusting session distributions dynamically.");
    };

    // 9. Active View Assembly
    const renderActiveCalendarView = () => {
        const viewType = activeView.toLowerCase();
        
        const commonProps = {
            events: calendarEvents,
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
                        onDateClick={handleDateClick}
                    />
                );
        }
    };

    return (
        <div className="calendar-page-wrapper">
            {renderActiveCalendarView()}
        </div>
    );
};

export default Calendar;
