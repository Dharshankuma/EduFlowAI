import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './PlannerSuccess.css';

// Default mock summary statistics cards matching the Figma exactly
const DEFAULT_SUMMARY_CARDS = [
    { id: 'tasks', icon: 'bi-file-earmark-text', label: 'TOTAL TASKS', value: '24' },
    { id: 'sessions', icon: 'bi-calendar-event', label: 'SESSIONS', value: '42' },
    { id: 'hours', icon: 'bi-clock', label: 'TOTAL HOURS', value: '128' },
    { id: 'target', icon: 'bi-flag', label: 'TARGET DATE', value: 'Dec 15' }
];

// Default mock checklist steps matching the Figma exactly
const DEFAULT_CHECKLIST = [
    'Goal Processed',
    'Tasks Organized',
    'Sessions Created',
    'Dashboard Updated',
    'Calendar Updated'
];

// High-fidelity fallback SVG illustration (renders a check calendar, books, clock, and graduation cap)
const DefaultIllustration = () => (
    <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="success-illustration-svg">
        {/* Glow rings */}
        <circle cx="140" cy="90" r="75" fill="rgba(6, 182, 212, 0.03)" />
        <circle cx="140" cy="90" r="55" fill="rgba(79, 70, 229, 0.03)" />
        
        {/* Calendar Box */}
        <rect x="85" y="40" width="110" height="90" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
        <rect x="85" y="40" width="110" height="24" rx="12" fill="var(--primary-color)" />
        <rect x="85" y="52" width="110" height="12" fill="var(--primary-color)" />
        
        {/* Binding Rings */}
        <rect x="105" y="32" width="6" height="12" rx="3" fill="#94A3B8" />
        <rect x="137" y="32" width="6" height="12" rx="3" fill="#94A3B8" />
        <rect x="169" y="32" width="6" height="12" rx="3" fill="#94A3B8" />

        {/* October Month Text */}
        <text x="140" y="56" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1">OCTOBER</text>

        {/* Checkmark Badge */}
        <circle cx="140" cy="92" r="20" fill="rgba(34, 197, 94, 0.12)" />
        <path d="M132 92L137 97L148 86" stroke="var(--success-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Calendar grids */}
        <circle cx="102" cy="78" r="2" fill="#CBD5E1" />
        <circle cx="118" cy="78" r="2" fill="#CBD5E1" />
        <circle cx="162" cy="78" r="2" fill="#CBD5E1" />
        <circle cx="178" cy="78" r="2" fill="#CBD5E1" />
        <circle cx="102" cy="94" r="2" fill="#CBD5E1" />
        <circle cx="118" cy="94" r="2" fill="#CBD5E1" />
        <circle cx="162" cy="94" r="2" fill="#CBD5E1" />
        <circle cx="178" cy="94" r="2" fill="#CBD5E1" />
        <circle cx="102" cy="110" r="2" fill="#CBD5E1" />
        <circle cx="118" cy="110" r="2" fill="#CBD5E1" />
        <circle cx="162" cy="110" r="2" fill="#CBD5E1" />
        <circle cx="178" cy="110" r="2" fill="#CBD5E1" />

        {/* Floating Book Left */}
        <g transform="translate(25, 45) rotate(-15)">
            <rect x="0" y="0" width="28" height="36" rx="3" fill="var(--secondary-color)" />
            <path d="M4 0H24V36H4C1.8 36 0 34.2 0 32V4C0 1.8 1.8 0 4 0Z" fill="var(--secondary-color)" />
            <rect x="4" y="3" width="22" height="30" rx="1" fill="#FFFFFF" />
            <line x1="8" y1="9" x2="20" y2="9" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="15" x2="16" y2="15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="21" x2="18" y2="21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Book Bottom Left */}
        <g transform="translate(45, 115) rotate(20)">
            <rect x="0" y="0" width="26" height="32" rx="3" fill="var(--primary-color)" />
            <path d="M4 0H22V32H4C1.8 32 0 30.2 0 28V4C0 1.8 1.8 0 4 0Z" fill="var(--primary-color)" />
            <rect x="4" y="3" width="20" height="26" rx="1" fill="#FFFFFF" />
            <line x1="7" y1="8" x2="17" y2="8" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="14" x2="14" y2="14" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Clock Right */}
        <g transform="translate(225, 35)">
            <circle cx="14" cy="14" r="14" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
            <path d="M14 6V14H19" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="14" r="1.5" fill="#64748B" />
        </g>

        {/* Floating Graduation Cap Top Left */}
        <g transform="translate(40, 20) rotate(-10)">
            <path d="M12 2L24 7L12 12L0 7L12 2Z" fill="var(--primary-color)" />
            <path d="M4 9V14C4 14 8 17 12 17C16 17 20 14 20 14V9" fill="rgba(79, 70, 229, 0.8)" />
            <line x1="20" y1="8" x2="22" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="21" y="15" width="2" height="4" fill="#F59E0B" />
        </g>

        {/* Floating Book Right */}
        <g transform="translate(220, 105) rotate(-25)">
            <rect x="0" y="0" width="30" height="38" rx="3" fill="#06B6D4" />
            <path d="M4 0H26V38H4C1.8 38 0 36.2 0 34V4C0 1.8 1.8 0 4 0Z" fill="#06B6D4" />
            <rect x="4" y="3" width="24" height="32" rx="1" fill="#FFFFFF" />
            <line x1="8" y1="10" x2="22" y2="10" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="16" x2="18" y2="16" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="22" x2="20" y2="22" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeLinecap="round" />
        </g>
    </svg>
);

export const PlannerSuccess = ({
    summaryCards = DEFAULT_SUMMARY_CARDS,
    checklist = DEFAULT_CHECKLIST,
    illustration,
    onViewDashboard,
    onViewCalendar
}) => {
    // Structured text buttons mapping for Dashboard
    const dashboardBtnText = (
        <span className="action-card-btn-content d-flex flex-column align-items-center justify-content-center py-1">
            <span className="action-card-btn-title d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-speedometer2"></i> View Dashboard
            </span>
            <span className="action-card-btn-subtitle">
                Open today's study schedule and progress.
            </span>
        </span>
    );

    // Structured text buttons mapping for Calendar
    const calendarBtnText = (
        <span className="action-card-btn-content d-flex flex-column align-items-center justify-content-center py-1">
            <span className="action-card-btn-title d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-calendar3"></i> View Calendar
            </span>
            <span className="action-card-btn-subtitle">
                View your complete weekly study schedule.
            </span>
        </span>
    );

    return (
        <div className="planner-success-wrapper">
            <DashboardCard className="planner-success-card mx-auto" hover={false} shadow={true} padding="48px">
                {/* 1. Success Header Badge */}
                <div className="success-badge-container d-flex justify-content-end mb-2">
                    <span className="schedule-success-badge d-flex align-items-center gap-2">
                        <span className="success-pulse-dot"></span>
                        Schedule Generated
                    </span>
                </div>

                {/* 2. Success Illustration */}
                <div className="success-illustration-area mb-4">
                    {illustration ? (
                        <div className="custom-illustration-wrapper">{illustration}</div>
                    ) : (
                        <DefaultIllustration />
                    )}
                </div>

                {/* 3. Success message */}
                <div className="success-message-area mb-4 text-center">
                    <h1 className="success-message-title mb-3">🎉 Your Study Schedule is Ready</h1>
                    <p className="success-message-desc mx-auto">
                        Your personalized study schedule has been successfully generated by the Planner Engine.
                        Your study sessions have been optimized using your study availability, task priorities,
                        estimated study hours and target deadlines. Your Dashboard and Calendar have been updated.
                    </p>
                </div>

                {/* 4. Summary Statistics (mapped summaryCards) */}
                <div className="summary-statistics-section mb-4">
                    <div className="row g-3 justify-content-center">
                        {summaryCards.map((card) => (
                            <div key={card.id} className="col-6 col-sm-3">
                                <DashboardCard className="stat-summary-box" hover={true} shadow={false} padding="16px">
                                    <div className="stat-summary-icon mb-2">
                                        <i className={`bi ${card.icon}`}></i>
                                    </div>
                                    <span className="stat-summary-label d-block mb-1">{card.label}</span>
                                    <span className="stat-summary-value">{card.value}</span>
                                </DashboardCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Success Checklist (mapped checklist) */}
                <div className="success-checklist-section p-3 mb-5">
                    <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-x-4 gap-y-2">
                        {checklist.map((item, idx) => (
                            <div key={idx} className="checklist-badge-item d-flex align-items-center gap-2">
                                <i className="bi bi-check-circle-fill checklist-success-icon"></i>
                                <span className="checklist-badge-text">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Action Buttons */}
                <div className="success-action-buttons-section border-top pt-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <ButtonComponent
                                type="button"
                                className="action-card-btn action-card-btn-primary w-100 type_1_btn"
                                onclick={onViewDashboard}
                                text={dashboardBtnText}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <ButtonComponent
                                type="button"
                                className="action-card-btn action-card-btn-secondary w-100"
                                onclick={onViewCalendar}
                                text={calendarBtnText}
                            />
                        </div>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
};

export default PlannerSuccess;
