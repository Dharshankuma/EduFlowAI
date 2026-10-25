import React, { useState, useMemo, useEffect } from 'react';
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

export const CalendarWidget = ({ onDaySelect, miniCalendar, selectedDate: externalSelectedDate }) => {
    // 1. Core calendar states
    const today = useMemo(() => new Date(), []);
    const [currentDate, setCurrentDate] = useState(() => {
        if (miniCalendar?.year && miniCalendar?.month) {
            return new Date(miniCalendar.year, miniCalendar.month - 1, 1);
        }
        return new Date();
    });
    const [internalSelectedDate, setInternalSelectedDate] = useState(() => externalSelectedDate || new Date());

    // Sync active selection with external selected date if passed
    useEffect(() => {
        if (externalSelectedDate) {
            setInternalSelectedDate(externalSelectedDate);
        }
    }, [externalSelectedDate]);

    // Sync month/year when backend miniCalendar provides new year/month
    useEffect(() => {
        if (miniCalendar?.year && miniCalendar?.month) {
            setCurrentDate(new Date(miniCalendar.year, miniCalendar.month - 1, 1));
        }
    }, [miniCalendar?.year, miniCalendar?.month]);

    const activeYear = currentDate.getFullYear();
    const activeMonth = currentDate.getMonth();

    // 3. Generate calendar days list dynamically
    const calendarDays = useMemo(() => {
        const firstDayIndex = new Date(activeYear, activeMonth, 1).getDay();
        const daysInCurrentMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
        const lastDayPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

        // Check if day has study sessions using backend miniCalendar.daysWithSessions
        const checkHasSession = (dayNum, dateObj) => {
            const sessions = miniCalendar?.daysWithSessions;
            if (!sessions || !Array.isArray(sessions)) return false;

            return sessions.some(item => {
                if (typeof item === 'number') {
                    return item === dayNum;
                }
                if (typeof item === 'string') {
                    if (item.includes('-')) {
                        return item.split('T')[0] === formatDateString(dateObj);
                    }
                    return Number(item) === dayNum;
                }
                return false;
            });
        };

        const days = [];

        // Trailing days from previous month
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = lastDayPrevMonth - i;
            const prevMonthDate = new Date(activeMonth === 0 ? activeYear - 1 : activeYear, activeMonth === 0 ? 11 : activeMonth - 1, dayNum);
            days.push({
                day: dayNum,
                date: prevMonthDate,
                isToday: isSameDay(prevMonthDate, today),
                isSelected: isSameDay(prevMonthDate, internalSelectedDate),
                hasTask: false,
                isCurrentMonth: false
            });
        }

        // Days in the current month
        for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
            const currentMonthDate = new Date(activeYear, activeMonth, dayNum);
            days.push({
                day: dayNum,
                date: currentMonthDate,
                isToday: isSameDay(currentMonthDate, today),
                isSelected: isSameDay(currentMonthDate, internalSelectedDate),
                hasTask: checkHasSession(dayNum, currentMonthDate),
                isCurrentMonth: true
            });
        }

        // Leading days from next month
        const remainingSlots = 42 - days.length;
        for (let dayNum = 1; dayNum <= remainingSlots; dayNum++) {
            const nextMonthDate = new Date(activeMonth === 11 ? activeYear + 1 : activeYear, activeMonth === 11 ? 0 : activeMonth + 1, dayNum);
            days.push({
                day: dayNum,
                date: nextMonthDate,
                isToday: isSameDay(nextMonthDate, today),
                isSelected: isSameDay(nextMonthDate, internalSelectedDate),
                hasTask: false,
                isCurrentMonth: false
            });
        }

        return days;
    }, [activeYear, activeMonth, internalSelectedDate, miniCalendar, today]);

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
        setInternalSelectedDate(dayData.date);
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
