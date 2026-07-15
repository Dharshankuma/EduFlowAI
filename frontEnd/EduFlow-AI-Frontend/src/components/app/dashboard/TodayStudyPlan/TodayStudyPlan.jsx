import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import SectionTitle from '../../../common/SectionTitle/SectionTitle';
import ProgressBar from '../../../common/ProgressBar/ProgressBar';
import { ButtonComponent } from '../../../common/ButtonComponent';
import SummaryCard from './SummaryCard';
import illustrationImg from '../../../../assets/images/login_image.png';
import './TodayStudyPlan.css';

export const TodayStudyPlan = ({
    studyHours = '0h 00m',
    activeGoals = '0',
    nextTask = 'None',
    studyStreak = '0 Days',
    dailyBrief = {
        recommendations: [],
        studyFocus: '',
        quickTips: '',
        completionEstimate: '',
        progressToday: 0
    },
    onCreateGoal,
    onGeneratePlan
}) => {
    return (
        <DashboardCard className="today-study-plan-card" hover={false} shadow={true} padding="32px">
            <div className="container-fluid p-0">
                <div className="row g-4 align-items-center">

                    {/* Left Column: Plan Content */}
                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="plan-header d-flex align-items-center gap-2 mb-3">
                            <div className="plan-badge-icon">
                                <i className="bi bi-calendar3-event"></i>
                            </div>
                            <h2 className="plan-heading m-0">Today's Study Plan</h2>
                        </div>

                        <p className="plan-description mb-4">
                            Your AI Study Coach has analyzed your upcoming deadlines, active goals,
                            and study schedule to create today's personalized learning plan.
                        </p>

                        {/* Summary Metrics Row */}
                        <div className="summary-cards-container mb-4">
                            <SummaryCard
                                icon="bi-clock-history"
                                title="STUDY SESSIONS"
                                value={studyHours}
                            />
                            <SummaryCard
                                icon="bi-bullseye"
                                title="ACTIVE GOALS"
                                value={activeGoals}
                            />
                            <SummaryCard
                                icon="bi-hourglass-split"
                                title="EST. TIME"
                                value={nextTask}
                            />
                            <SummaryCard
                                icon="bi-fire"
                                title="STREAK"
                                value={studyStreak}
                            />
                        </div>

                        {/* Action Buttons Row */}
                        <div className="action-buttons-container mb-5">
                            <ButtonComponent
                                type="button"
                                text="+ Create Goal"
                                className="cta_btn today-plan-btn-primary"
                                onclick={onCreateGoal}
                            />
                            <ButtonComponent
                                type="button"
                                text={
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="bi bi-stars"></i> Generate AI Study Plan
                                    </span>
                                }
                                className="today-plan-btn-secondary"
                                onclick={onGeneratePlan}
                            />
                        </div>

                        {/* Daily Brief Segment */}
                        <div className="daily-brief-segment pt-4">
                            <div className="brief-header mb-3">
                                <i className="bi bi-robot brief-header-icon"></i>
                                <span className="brief-header-text">AI Daily Brief</span>
                            </div>

                            <div className="row g-4">
                                <div className="col-12 col-md-7 text-start">
                                    {dailyBrief.recommendations && dailyBrief.recommendations.length > 0 && (
                                        <div className="brief-recommendations">
                                            <h4 className="brief-section-subtitle">Today's Recommendations:</h4>
                                            <ul className="recommendations-list">
                                                {dailyBrief.recommendations.map((rec, idx) => (
                                                    <li key={idx}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {dailyBrief.studyFocus && (
                                        <div className="brief-focus mt-3">
                                            <h4 className="brief-section-subtitle">Study Focus:</h4>
                                            <p className="brief-section-text">{dailyBrief.studyFocus}</p>
                                        </div>
                                    )}
                                    {dailyBrief.quickTips && (
                                        <div className="brief-tips mt-3">
                                            <h4 className="brief-section-subtitle">Quick Tips:</h4>
                                            <p className="brief-section-text">{dailyBrief.quickTips}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="col-12 col-md-5 d-flex flex-column justify-content-between">
                                    <div className="brief-progress-panel">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="brief-progress-title">PROGRESS TODAY: {dailyBrief.progressToday}%</span>
                                            {dailyBrief.completionEstimate && (
                                                <span className="brief-estimate-title">Est: {dailyBrief.completionEstimate}</span>
                                            )}
                                        </div>
                                        <ProgressBar
                                            value={dailyBrief.progressToday}
                                            max={100}
                                            color="#ffffff"
                                            showPercentage={false}
                                            animated={true}
                                        />
                                    </div>
                                    {/* <a href="#detailed-ai-recommendations" className="detailed-recommendation-link mt-3">
                                        View Detailed AI Recommendation <i className="bi bi-arrow-right"></i>
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Illustration (Centered vertically) */}
                    <div className="col-12 col-lg-5 col-xl-4 d-flex justify-content-center">
                        <div className="illustration-card-container">
                            <img src={illustrationImg} alt="Study Plan Illustration" className="illustration-img" />
                        </div>
                    </div>

                </div>
            </div>
        </DashboardCard>
    );
};

export default TodayStudyPlan;
