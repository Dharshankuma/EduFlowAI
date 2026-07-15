import React, { useState, useMemo } from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import './CalendarWidget.css';

// Helper: Format JS Date as YYYY-MM-DD
const formatDateString = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// Helper: Compare dates
const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const CalendarWidget = ({ onDaySelect }) => {
    // 1. Core calendar states
    const today = useMemo(() => new Date(), []);
    const [currentDate, setCurrentDate] = useState(new Date()); // anchoring month/year
    const [selectedDate, setSelectedDate] = useState(new Date()); // tracks active cell selection

    // 2. Mock task date list (to be replaced with API response in future integration)
    const taskDates = useMemo(() => [
        "2026-07-02",
        "2026-07-10",
        "2026-07-18",
        "2026-07-25"
    ], []);

    const activeYear = currentDate.getFullYear();
    const activeMonth = currentDate.getMonth();

    // 3. Generate calendar days list dynamically
    const calendarDays = useMemo(() => {
        const firstDayIndex = new Date(activeYear, activeMonth, 1).getDay();
        const daysInCurrentMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
        const lastDayPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

        const days = [];

        // Trailing days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = lastDayPrevMonth - i;
            const prevMonthDate = new Date(activeMonth === 0 ? activeYear - 1 : activeYear, activeMonth === 0 ? 11 : activeMonth - 1, dayNum);
            const dateStr = formatDateString(prevMonthDate);
            days.push({
                day: dayNum,
                date: prevMonthDate,
                isToday: isSameDay(prevMonthDate, today),
                isSelected: isSameDay(prevMonthDate, selectedDate),
                hasTask: taskDates.includes(dateStr),
                isCurrentMonth: false
            });
        }

        // Days in the current month
        for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
            const currentMonthDate = new Date(activeYear, activeMonth, dayNum);
            const dateStr = formatDateString(currentMonthDate);
            days.push({
                day: dayNum,
                date: currentMonthDate,
                isToday: isSameDay(currentMonthDate, today),
                isSelected: isSameDay(currentMonthDate, selectedDate),
                hasTask: taskDates.includes(dateStr),
                isCurrentMonth: true
            });
        }

        // Leading days from next month
        const remainingSlots = 42 - days.length;
        for (let dayNum = 1; dayNum <= remainingSlots; dayNum++) {
            const nextMonthDate = new Date(activeMonth === 11 ? activeYear + 1 : activeYear, activeMonth === 11 ? 0 : activeMonth + 1, dayNum);
            const dateStr = formatDateString(nextMonthDate);
            days.push({
                day: dayNum,
                date: nextMonthDate,
                isToday: isSameDay(nextMonthDate, today),
                isSelected: isSameDay(nextMonthDate, selectedDate),
                hasTask: taskDates.includes(dateStr),
                isCurrentMonth: false
            });
        }

        return days;
    }, [activeYear, activeMonth, selectedDate, taskDates, today]);

    // Format current month string
    const headerTitle = `${monthNames[activeMonth]} ${activeYear}`;

    // Handlers
    const handlePreviousMonth = () => {
        setCurrentDate(new Date(activeYear, activeMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(activeYear, activeMonth + 1, 1));
    };

    const handleDayClick = (dayData) => {
        setSelectedDate(dayData.date);
        if (onDaySelect) {
            onDaySelect(dayData.date);
        }
    };

    return (
        <DashboardCard className="calendar-widget-card" hover={false} shadow={true} padding="24px">
            {/* Header controls */}
            <CalendarHeader
                currentMonth={headerTitle}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
            />
            
            {/* Grid rows */}
            <div className="calendar-widget-body">
                <CalendarGrid days={calendarDays} onDayClick={handleDayClick} />
            </div>
        </DashboardCard>
    );
};

export default CalendarWidget;
