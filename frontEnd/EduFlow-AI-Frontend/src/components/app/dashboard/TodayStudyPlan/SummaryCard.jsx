import React from 'react';
import './SummaryCard.css';

export const SummaryCard = ({ icon, title, value }) => {
    // Render icon if provided
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <i className={`bi ${icon} summary-card-icon`}></i>;
        }
        return icon;
    };

    return (
        <div className="summary-card-el">
            <div className="summary-card-icon-container">
                {renderIcon()}
            </div>
            <div className="summary-card-content">
                <span className="summary-card-title">{title}</span>
                <span className="summary-card-value">{value}</span>
            </div>
        </div>
    );
};

export default SummaryCard;
