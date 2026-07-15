import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({
    value = 0,
    max = 100,
    label,
    color = 'var(--primary-color)',
    height = '8px',
    animated = true,
    showPercentage = true
}) => {
    // Bound percentage values safely between 0% and 100%
    const rawPercentage = max > 0 ? (value / max) * 100 : 0;
    const percentage = Math.min(Math.max(rawPercentage, 0), 100);

    return (
        <div className="progress-bar-container">
            {(label || showPercentage) && (
                <div className="progress-bar-labels">
                    {label && <span className="progress-bar-label">{label}</span>}
                    {showPercentage && (
                        <span className="progress-bar-percentage">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div 
                className="progress-bar-track" 
                style={{ height, borderRadius: `calc(${height} / 2)` }}
            >
                <div
                    className={`progress-bar-fill ${animated ? 'animated' : ''}`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        borderRadius: `calc(${height} / 2)`
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
