import React from 'react';
import StatCard from '../../../common/StatCard/StatCard';
import './ProfileStatistics.css';

export const ProfileStatistics = ({ statistics = [] }) => {
    return (
        <section className="profile-statistics-section">
            <div className="container-fluid p-0">
                <div className="row g-3 g-md-4">
                    {/* Loop statistics array */}
                    {statistics.map((stat, index) => (
                        <div key={stat.id || index} className="col-12 col-sm-6 col-lg-3">
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                description={stat.description}
                                icon={stat.icon}
                                trend={stat.trend}
                                trendType={stat.trendType || 'success'}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProfileStatistics;
