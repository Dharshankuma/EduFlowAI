import React from 'react';
import './TimerControls.css';

export const TimerControls = ({
    isRunning = false,
    onPlay,
    onPause,
    onReset,
    onPrevious,
    onNext
}) => {
    return (
        <div className="timer-controls-component">
            <button 
                className="control-btn prev-btn" 
                onClick={onPrevious}
                aria-label="Previous focus subject"
                title="Previous"
                type="button"
            >
                <i className="bi bi-skip-start-fill"></i>
            </button>

            {isRunning ? (
                <button 
                    className="control-btn play-pause-btn playing"
                    onClick={onPause}
                    aria-label="Pause focus timer"
                    title="Pause"
                    type="button"
                >
                    <i className="bi bi-pause-fill"></i>
                </button>
            ) : (
                <button 
                    className="control-btn play-pause-btn paused"
                    onClick={onPlay}
                    aria-label="Start focus timer"
                    title="Play"
                    type="button"
                >
                    <i className="bi bi-play-fill"></i>
                </button>
            )}

            <button 
                className="control-btn reset-btn" 
                onClick={onReset}
                aria-label="Reset focus timer"
                title="Reset"
                type="button"
            >
                <i className="bi bi-arrow-counterclockwise"></i>
            </button>

            <button 
                className="control-btn next-btn" 
                onClick={onNext}
                aria-label="Next focus subject"
                title="Next"
                type="button"
            >
                <i className="bi bi-skip-end-fill"></i>
            </button>
        </div>
    );
};

export default TimerControls;
