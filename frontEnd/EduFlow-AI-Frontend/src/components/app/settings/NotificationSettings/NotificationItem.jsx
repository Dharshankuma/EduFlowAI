import React from 'react';
import './NotificationItem.css';

export const NotificationItem = ({
    id,
    title,
    description,
    enabled = false,
    onToggle
}) => {
    const handleToggle = () => {
        if (onToggle) {
            onToggle(id);
        }
    };

    return (
        <div className="notification-item py-3">
            <div className="row align-items-center w-100 m-0">
                <div className="col-10 ps-0 text-start">
                    <h4 className="notification-item-title mb-1">{title}</h4>
                    {description && (
                        <p className="notification-item-desc mb-0">
                            {description}
                        </p>
                    )}
                </div>
                <div className="col-2 pe-0 d-flex justify-content-end align-items-center">
                    <div className="form-check form-switch m-0">
                        <input
                            className="form-check-input notification-switch"
                            type="checkbox"
                            role="switch"
                            checked={enabled}
                            onChange={handleToggle}
                            id={`notification-toggle-${id}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
