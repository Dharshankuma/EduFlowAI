import React from 'react';
import DashboardCard from '../DashboardCard/DashboardCard';
import './StatCard.css';

export const StatCard = ({
    title,
    value,
    icon, // can be a Bootstrap icon class string (e.g. "bi-clock") or a React node
    description,
    trend,
    trendType = 'success', // 'success' | 'danger' | 'warning' | 'neutral'
    ...props
}) => {
    // Render icon if provided
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <i className={`bi ${icon} stat-card-icon-el`}></i>;
        }
        return icon;
    };

    return (
        <DashboardCard className="stat-card" hover={true} padding="20px" {...props}>
            <div className="stat-card-header">
                <div className={`stat-card-icon-wrapper ${trendType}`}>
                    {renderIcon()}
                </div>
                {trend && (
                    <div className={`stat-card-trend-badge ${trendType}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div className="stat-card-body">
                <span className="stat-card-title">{title}</span>
                <h3 className="stat-card-value">{value}</h3>
                {description && <p className="stat-card-desc">{description}</p>}
            </div>
        </DashboardCard>
    );
};

export default StatCard;
