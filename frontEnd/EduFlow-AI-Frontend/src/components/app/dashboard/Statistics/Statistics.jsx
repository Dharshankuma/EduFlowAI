import React from 'react';
import StatCard from '../../../common/StatCard/StatCard';
import './Statistics.css';

export const Statistics = ({ stats = [] }) => {
    return (
        <section className="statistics-section">
            <div className="container-fluid p-0">
                <div className="row g-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-12 col-md-6 col-lg-3">
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                description={stat.description}
                                trend={stat.trend}
                                trendType={stat.trendType}
                                icon={stat.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
