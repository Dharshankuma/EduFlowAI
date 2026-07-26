import React from 'react';
import './SecurityAction.css';

export const SecurityAction = ({
    id,
    title,
    description,
    icon = '',
    onClick
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <div className="security-action-card p-3 d-flex align-items-center justify-content-between" onClick={handleClick}>
            <div className="d-flex align-items-center gap-3 text-start">
                <div className="security-action-icon-container">
                    <i className={`bi ${icon}`}></i>
                </div>
                <div className="security-action-text">
                    <h4 className="security-action-title mb-1">{title}</h4>
                    {description && <p className="security-action-desc mb-0">{description}</p>}
                </div>
            </div>
            <div className="security-action-chevron">
                <i className="bi bi-chevron-right"></i>
            </div>
        </div>
    );
};

export default SecurityAction;
