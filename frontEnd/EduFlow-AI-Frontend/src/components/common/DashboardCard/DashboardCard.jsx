import React from 'react';
import './DashboardCard.css';

export const DashboardCard = ({
    children,
    className = '',
    hover = true,
    padding = '24px',
    bordered = true,
    shadow = true,
    ...props
}) => {
    const cardClasses = [
        'dashboard-card',
        hover ? 'dashboard-card-hover' : '',
        bordered ? 'dashboard-card-bordered' : '',
        shadow ? 'dashboard-card-shadow' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={cardClasses} 
            style={{ padding }} 
            {...props}
        >
            {children}
        </div>
    );
};

export default DashboardCard;
