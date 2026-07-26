import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import './GoalStatistics.css';

export const GoalStatistics = ({ statistics = [] }) => {
    const getThemeClass = (title) => {
        switch (title?.toUpperCase()) {
            case 'TOTAL': return 'theme-total';
            case 'ACTIVE': return 'theme-active';
            case 'COMPLETED': return 'theme-completed';
            case 'URGENT': return 'theme-urgent';
            default: return 'theme-default';
        }
    };

    return (
        <div className="goal-statistics-section container-fluid p-0">
            <div className="row g-3 g-lg-4">
                {statistics.map((stat) => {
                    const themeClass = getThemeClass(stat.title);
                    const formattedValue = String(stat.value).padStart(2, '0');
                    
                    return (
                        <div key={stat.id || stat.title} className="col-12 col-md-6 col-lg-3">
                            <DashboardCard 
                                className={`goal-stat-card ${themeClass} h-100`} 
                                hover={true} 
                                shadow={true} 
                                padding="24px"
                            >
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="goal-stat-icon-wrapper">
                                        <i className={`bi ${stat.icon}`}></i>
                                    </div>
                                    <span className="goal-stat-title">{stat.title}</span>
                                </div>
                                <div className="goal-stat-content text-start">
                                    <h2 className="goal-stat-value mb-1">
                                        {formattedValue}
                                    </h2>
                                    <p className="goal-stat-desc mb-0">{stat.description}</p>
                                </div>
                            </DashboardCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalStatistics;
