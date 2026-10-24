import React, { useState, useMemo } from 'react';
import CalendarMonthView from '../../../../components/app/calendar/CalendarMonthView/CalendarMonthView';
import CalendarWeekView from '../../../../components/app/calendar/CalendarWeekView/CalendarWeekView';
import CalendarDayView from '../../../../components/app/calendar/CalendarDayView/CalendarDayView';
import { useAppState } from '../../../../context/StateContext';
import {
    getRealToday,
    isSameDay,
    isCurrentMonthNow,
    getWeeksInMonth,
    findWeekIndexForDate
} from '../../../../utils/calendarUtils';
import './Calendar.css';

export const Calendar = () => {
    // 1. Controller view switcher state ("Month", "Week", "Day")
    const [activeView, setActiveView] = useState("Month");
    const { calendarEvents, setCalendarEvents } = useAppState();

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
        const today = getRealToday();
        setSelectedDate(today);
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
        setCurrentWeekIndex(findWeekIndexForDate(today));
    };

    // 5. Month View Navigation Handlers
    // Requirement: When navigating or clicking the current month, automatically focus on the current date!
    const handleSelectMonth = (monthIdx) => {
        setCurrentMonth(monthIdx);
        const today = getRealToday();
        if (monthIdx === today.getMonth() && currentYear === today.getFullYear()) {
            // It's the current month: automatically focus on current date!
            setSelectedDate(today);
            setCurrentWeekIndex(findWeekIndexForDate(today));
        } else {
            // Different month: focus on the 1st day of that month
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
            // If the selected week contains today, focus on today
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
            // Reached before Week 1 of current month: automatically jump to previous month's last week
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
            // Reached the end of weeks for this month: automatically change to next month's Week 1
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
                        onSelectYear={handleSelectYear}
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
