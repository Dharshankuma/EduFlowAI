import React from 'react';
import './AvailabilityDay.css';

// Helper: Calculate hours difference between HH:MM strings
const getHoursAndMinutes = (start, end, enabled) => {
    if (!enabled || !start || !end) return '0 Hours 0 Minutes';
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins <= 0) return '0 Hours 0 Minutes';
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    const hText = hours === 1 ? '1 Hour' : `${hours} Hours`;
    const mText = minutes === 1 ? '1 Minute' : `${minutes} Minutes`;
    return `${hText} ${mText}`;
};

// Helper: Convert decimal available hours to text
const formatAvailableHours = (availableHours, enabled) => {
    if (!enabled || availableHours === undefined || availableHours === null) {
        return '0 Hours 0 Minutes';
    }
    const totalMins = Math.round(parseFloat(availableHours) * 60);
    if (totalMins <= 0) return '0 Hours 0 Minutes';
    
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    
    const hText = hours === 1 ? '1 Hour' : `${hours} Hours`;
    const mText = minutes === 1 ? '1 Minute' : `${minutes} Minutes`;
    return `${hText} ${mText}`;
};

export const AvailabilityDay = ({
    day,
    enabled = false,
    startTime = '09:00',
    endTime = '17:00',
    availableHours,
    onToggle,
    onStartTimeChange,
    onEndTimeChange,
    error,
    disabled = false
}) => {
    const hoursText = availableHours !== undefined
        ? formatAvailableHours(availableHours, enabled)
        : getHoursAndMinutes(startTime, endTime, enabled);

    return (
        <div className={`availability-day-row ${enabled ? 'is-enabled' : 'is-disabled'} ${error ? 'has-validation-error' : ''}`}>
            <div className="row g-3 align-items-center w-100 m-0">
                {/* 1. Toggle switch & Day Label */}
                <div className="col-12 col-md-3 d-flex align-items-center gap-3">
                    <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                        <input
                            className="form-check-input availability-switch"
                            type="checkbox"
                            role="switch"
                            checked={enabled}
                            onChange={() => onToggle && onToggle(day)}
                            id={`toggle-${day}`}
                            disabled={disabled}
                        />
                        <label className="switch-status-label m-0" htmlFor={`toggle-${day}`}>
                            {enabled ? 'Available' : 'Unavailable'}
                        </label>
                    </div>
                    <span className="day-name-label m-0">
                        {day}
                    </span>
                </div>

                {/* 2. Start Time Selector */}
                <div className="col-6 col-md-3">
                    <div className="time-input-wrapper">
                        <span className="time-field-label d-md-none">Start Time</span>
                        <input
                            type="time"
                            className="form-control availability-time-input"
                            value={startTime}
                            onChange={(e) => onStartTimeChange && onStartTimeChange(day, e.target.value)}
                            disabled={!enabled || disabled}
                            aria-label={`${day} start time`}
                        />
                    </div>
                </div>

                {/* 3. End Time Selector */}
                <div className="col-6 col-md-3">
                    <div className="time-input-wrapper">
                        <span className="time-field-label d-md-none">End Time</span>
                        <input
                            type="time"
                            className="form-control availability-time-input"
                            value={endTime}
                            onChange={(e) => onEndTimeChange && onEndTimeChange(day, e.target.value)}
                            disabled={!enabled || disabled}
                            aria-label={`${day} end time`}
                        />
                    </div>
                </div>

                {/* 4. Total Hours Badge */}
                <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-start align-items-center mt-2 mt-md-0">
                    <div className="availability-hours-indicator">
                        <span className="hours-label">Available Hours:</span>
                        <span className="hours-value-text">{hoursText}</span>
                    </div>
                </div>
            </div>
            {error && (
                <div className="row w-100 m-0 mt-2 px-3">
                    <div className="col-12 text-danger small p-0 d-flex align-items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <span>{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityDay;
