import React from 'react';
import './EmptyState.css';

export const EmptyState = ({
    icon, // can be a Bootstrap icon class string (e.g. "bi-inbox") or a React node
    title,
    description,
    button = false,
    buttonText = 'Action',
    buttonAction
}) => {
    // Render icon if provided
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <i className={`bi ${icon} empty-state-icon-el`}></i>;
        }
        return icon;
    };

    return (
        <div className="empty-state-component">
            <div className="empty-state-icon-wrapper">
                {renderIcon()}
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {button && (
                <div className="empty-state-actions">
                    <button 
                        className="empty-state-btn" 
                        onClick={buttonAction}
                        type="button"
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
