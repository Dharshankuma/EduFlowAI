import React from 'react';
import './AccountAction.css';

export const AccountAction = ({
    id,
    title,
    description,
    icon = '',
    onClick
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(title);
        }
    };

    return (
        <div className="account-action-card p-3 d-flex align-items-center gap-3" onClick={handleClick}>
            <div className="account-action-icon-container">
                <i className={`bi ${icon}`}></i>
            </div>
            <div className="account-action-text text-start">
                <h4 className="account-action-title mb-1">{title}</h4>
                {description && <p className="account-action-desc mb-0">{description}</p>}
            </div>
        </div>
    );
};

export default AccountAction;
