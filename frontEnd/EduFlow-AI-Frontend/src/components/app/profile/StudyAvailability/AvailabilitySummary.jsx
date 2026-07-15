import React from 'react';
import StatCard from '../../../common/StatCard/StatCard';
import './AvailabilitySummary.css';

// Helper: Calculate duration between HH:MM strings
const calculateMinutes = (start, end, enabled) => {
    if (!enabled || !start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diff = (endH * 60 + endM) - (startH * 60 + startM);
    return diff <= 0 ? 0 : diff;
};

// Helper: Convert total minutes back to readable string format
const formatMinsToText = (totalMins) => {
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    if (hours === 0 && minutes === 0) return '0 hrs';
    if (minutes === 0) return `${hours} hrs`;
    return `${hours}h ${minutes}m`;
};

export const AvailabilitySummary = ({ availability = [] }) => {
    const activeDays = availability.filter(d => d.enabled).length;

    const totalMinutes = availability.reduce((acc, curr) => {
        return acc + calculateMinutes(curr.startTime, curr.endTime, curr.enabled);
    }, 0);

    const avgMinutes = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

    return (
        <div className="availability-summary-section">
            <div className="row g-3">
                {/* Total Weekly Hours */}
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Total Weekly Hours"
                        value={formatMinsToText(totalMinutes)}
                        icon="bi-clock-history"
                        description="Total available study time"
                        trendType="success"
                    />
                </div>

                {/* Active Study Days */}
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Active Study Days"
                        value={`${activeDays} / 7`}
                        icon="bi-calendar-check"
                        description="Days scheduled for study"
                        trendType="success"
                    />
                </div>

                {/* Average Daily Study */}
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Average Daily Study"
                        value={formatMinsToText(avgMinutes)}
                        icon="bi-graph-up-arrow"
                        description="Avg session length per day"
                        trendType="success"
                    />
                </div>
            </div>
        </div>
    );
};

export default AvailabilitySummary;
