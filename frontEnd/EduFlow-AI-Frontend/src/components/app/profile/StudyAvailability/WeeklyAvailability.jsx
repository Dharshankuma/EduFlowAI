import React from 'react';
import AvailabilityDay from './AvailabilityDay';
import './WeeklyAvailability.css';

export const WeeklyAvailability = ({
    availability = [],
    onToggle,
    onStartTimeChange,
    onEndTimeChange,
    errors = {},
    disabled = false
}) => {
    return (
        <div className="weekly-availability-container">
            {availability.map((dayData, index) => (
                <AvailabilityDay
                    key={dayData.day || index}
                    day={dayData.day}
                    enabled={dayData.enabled}
                    startTime={dayData.startTime}
                    endTime={dayData.endTime}
                    availableHours={dayData.availableHours}
                    onToggle={onToggle}
                    onStartTimeChange={onStartTimeChange}
                    onEndTimeChange={onEndTimeChange}
                    error={errors[dayData.day]}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default WeeklyAvailability;
