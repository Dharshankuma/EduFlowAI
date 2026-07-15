import React from 'react';
import './CardHeader.css';

export const CardHeader = ({
    title,
    subtitle,
    actionText,
    onActionClick,
    rightContent
}) => {
    return (
        <div className="card-header-component">
            <div className="card-header-left">
                <h3 className="card-header-title">{title}</h3>
                {subtitle && <p className="card-header-subtitle">{subtitle}</p>}
            </div>
            <div className="card-header-right">
                {rightContent ? (
                    rightContent
                ) : (
                    actionText && (
                        <button 
                            className="card-header-action-btn" 
                            onClick={onActionClick}
                            type="button"
                        >
                            {actionText}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default CardHeader;
