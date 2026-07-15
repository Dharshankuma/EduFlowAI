import React from 'react';
import './FocusTimer.css';

export const FocusTimer = ({
    duration = 1500,
    remainingTime = 1500,
    progress = 0, // value 0 to 100 representing fill percentage
    status = 'idle'
}) => {
    // Format seconds as MM:SS
    const formatTime = (timeInSeconds) => {
        const mins = Math.floor(timeInSeconds / 60);
        const secs = timeInSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="focus-timer-el">
            <div 
                className="timer-progress-ring"
                style={{
                    background: `conic-gradient(var(--primary-color) ${progress}%, var(--border-color) ${progress}% 100%)`
                }}
            >
                <div className="timer-inner-card">
                    <span className="timer-digits">{formatTime(remainingTime)}</span>
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;
