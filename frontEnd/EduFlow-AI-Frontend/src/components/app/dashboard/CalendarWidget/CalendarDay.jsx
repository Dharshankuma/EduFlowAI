import React from 'react';
import './CalendarDay.css';

export const CalendarDay = ({
    day, // number (e.g. 17)
    date, // full date string or date object
    isToday = false,
    isSelected = false,
    hasTask = false,
    isCurrentMonth = true,
    isDisabled = false,
    onClick
}) => {
    // Construct dynamic CSS conditional tags
    const dayClasses = [
        'calendar-day-cell',
        isToday ? 'is-today' : '',
        isSelected ? 'is-selected' : '',
        hasTask ? 'has-task' : '',
        !isCurrentMonth ? 'outside-month' : '',
        isDisabled ? 'is-disabled' : ''
    ].filter(Boolean).join(' ');

    return (
        <button
            className={dayClasses}
            onClick={onClick}
            disabled={isDisabled || isDisabled}
            type="button"
            aria-label={`${date ? date : `Day ${day}`}`}
        >
            <span className="day-number">{day}</span>
            {hasTask && <span className="task-dot-indicator" />}
        </button>
    );
};

export default CalendarDay;
