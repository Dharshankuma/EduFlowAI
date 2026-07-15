import React from 'react';
import CalendarDay from './CalendarDay';
import './CalendarGrid.css';

export const CalendarGrid = ({ days = [], onDayClick }) => {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="calendar-grid-component">
            {/* Weekday labels */}
            <div className="calendar-weekdays-row">
                {weekdays.map((label, idx) => (
                    <span key={idx} className="weekday-label">
                        {label}
                    </span>
                ))}
            </div>

            {/* Calendar grid items */}
            <div className="calendar-days-grid">
                {days.map((dayData, index) => (
                    <CalendarDay
                        key={index}
                        day={dayData.day}
                        date={dayData.date}
                        isToday={dayData.isToday}
                        isSelected={dayData.isSelected}
                        hasTask={dayData.hasTask}
                        isCurrentMonth={dayData.isCurrentMonth}
                        isDisabled={dayData.isDisabled}
                        onClick={() => onDayClick && onDayClick(dayData)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarGrid;
