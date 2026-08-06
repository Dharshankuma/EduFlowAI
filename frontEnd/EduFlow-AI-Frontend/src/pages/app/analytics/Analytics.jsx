import React from 'react';
import { MOCK_ANALYTICS_OVERVIEW, MOCK_STUDY_TIME_LINE, MOCK_SUBJECT_BREAKDOWN, MOCK_WEEKLY_SCORES } from '../../../mock/analytics';
import DashboardCard from '../../../components/common/DashboardCard/DashboardCard';
import StatCard from '../../../components/common/StatCard/StatCard';
import ProgressBar from '../../../components/common/ProgressBar/ProgressBar';
import './Analytics.css';

export const Analytics = () => {
    // Find highest hours to scale the bar chart dynamically
    const maxHours = Math.max(...MOCK_STUDY_TIME_LINE.map(d => d.hours));

    return (
        <div className="analytics-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="analytics-page-header text-start mb-4">
                <h1 className="analytics-page-title m-0">Analytics & Insights</h1>
                <p className="analytics-page-subtitle mt-1">
                    Track your study habits, focus duration, and academic coverage.
                </p>
            </div>

            {/* Overview Stats Cards */}
            <div className="row g-4 mb-4">
                {MOCK_ANALYTICS_OVERVIEW.map(stat => (
                    <div key={stat.id} className="col-12 col-sm-6 col-xl-3">
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            description={stat.trend}
                            icon={stat.icon}
                            trendType={stat.trendType}
                        />
                    </div>
                ))}
            </div>

            {/* Chart grids */}
            <div className="row g-4">
                {/* 1. Daily Study Hours (Bar Chart) */}
                <div className="col-12 col-lg-8">
                    <DashboardCard title="Study Hours (Last 7 Days)" hover={false} padding="24px" className="h-100">
                        <div className="chart-container d-flex flex-column justify-content-between h-100">
                            <div className="bar-chart-y-axis d-flex justify-content-between text-secondary small mb-3">
                                <span>0h</span>
                                <span>2h</span>
                                <span>4h</span>
                                <span>6h (Max)</span>
                            </div>
                            <div className="bar-chart-wrapper d-flex justify-content-between align-items-end pt-4 pb-2 px-3">
                                {MOCK_STUDY_TIME_LINE.map((dayData, idx) => {
                                    const heightPercentage = maxHours > 0 ? (dayData.hours / maxHours) * 100 : 0;
                                    return (
                                        <div key={idx} className="bar-column d-flex flex-column align-items-center">
                                            <div className="bar-value-tooltip small mb-1">{dayData.hours}h</div>
                                            <div className="bar-track position-relative">
                                                <div 
                                                    className="bar-fill" 
                                                    style={{ height: `${heightPercentage}%`, backgroundColor: 'var(--primary-color)' }}
                                                ></div>
                                            </div>
                                            <span className="bar-label mt-2 small text-secondary fw-semibold">{dayData.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* 2. Subject Breakdown */}
                <div className="col-12 col-lg-4">
                    <DashboardCard title="Topic Distribution" hover={false} padding="24px" className="h-100">
                        <div className="d-flex flex-column justify-content-around h-100">
                            <div className="breakdown-list">
                                {MOCK_SUBJECT_BREAKDOWN.map((sub, idx) => (
                                    <div key={idx} className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="small fw-semibold text-primary">{sub.subject}</span>
                                            <span className="small fw-bold text-secondary">{sub.percentage}%</span>
                                        </div>
                                        <div className="progress-bar-container" style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div 
                                                className="progress-bar-fill" 
                                                style={{ width: `${sub.percentage}%`, height: '100%', backgroundColor: sub.color, borderRadius: '4px' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* 3. Consistency Index */}
                <div className="col-12 col-md-6">
                    <DashboardCard title="Weekly Efficiency Score" hover={false} padding="24px">
                        <div className="weekly-scores-wrapper text-start">
                            <p className="text-secondary small mb-4">
                                Based on daily goals completed, study streak compliance, and deep work focus sessions.
                            </p>
                            {MOCK_WEEKLY_SCORES.map((w, idx) => (
                                <div key={idx} className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <span className="fw-semibold">{w.week}</span>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`badge ${w.score >= 85 ? 'bg-success' : 'bg-primary'}`}>{w.score}/100</span>
                                        <span className="text-secondary small">{w.score >= 85 ? 'Excellent Focus' : 'Consistent'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* 4. AI Syllabus Coverage details */}
                <div className="col-12 col-md-6">
                    <DashboardCard title="Syllabus Milestone Track" hover={false} padding="24px">
                        <div className="milestones-track text-start">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-semibold">Placement Prep (DSA)</span>
                                    <span className="text-primary fw-bold">75%</span>
                                </div>
                                <ProgressBar progress={75} />
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-semibold">Operating Systems</span>
                                    <span className="text-primary fw-bold">45%</span>
                                </div>
                                <ProgressBar progress={45} />
                            </div>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-semibold">AWS Solutions Architect</span>
                                    <span className="text-primary fw-bold">15%</span>
                                </div>
                                <ProgressBar progress={15} />
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
