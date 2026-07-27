import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './PlannerLoading.css';

const DEFAULT_STEPS = [
    'Reading Goal Information',
    'Organizing Tasks',
    'Checking Deadlines',
    'Reading Study Availability',
    'Calculating Priorities',
    'Distributing Study Hours',
    'Creating Weekly Schedule...'
];

export const PlannerLoading = ({
    progress = 67,
    currentStep = 'Creating Weekly Schedule...',
    steps = DEFAULT_STEPS,
    status = 'loading', // 'loading' | 'completed' | 'error'
    errorMessage = '',
    goal = {},
    onBack // For Retry or Go Back in case of error
}) => {
    // Determine the active index of currentStep in steps
    const activeIndex = steps.indexOf(currentStep);

    // Dynamic resolution of visual state
    const isError = status === 'error' || !!errorMessage;
    const isCompleted = status === 'completed' || progress >= 100;
    const isLoading = !isError && !isCompleted;

    // Helper to render checklist items with appropriate status icon and classes
    const renderStepItem = (step, idx) => {
        let stepClass = 'planner-step-item d-flex align-items-center gap-2 mb-3 text-start';
        let icon = <i className="bi bi-circle step-icon-pending"></i>;

        if (isCompleted) {
            // If completed, all steps are checked
            stepClass += ' completed';
            icon = <i className="bi bi-check-circle-fill step-icon-completed"></i>;
        } else if (isError) {
            // If failed, show pending or error states
            stepClass += ' error';
            icon = <i className="bi bi-x-circle-fill step-icon-error"></i>;
        } else {
            // Loading mode: resolve based on active index
            if (idx < activeIndex) {
                stepClass += ' completed';
                icon = <i className="bi bi-check-circle-fill step-icon-completed"></i>;
            } else if (idx === activeIndex) {
                stepClass += ' active';
                icon = <i className="bi bi-arrow-repeat step-icon-active-spin"></i>;
            } else {
                stepClass += ' pending';
                icon = <i className="bi bi-circle step-icon-pending"></i>;
            }
        }

        return (
            <div key={idx} className={stepClass}>
                {icon}
                <span className="step-text">{step}</span>
            </div>
        );
    };

    return (
        <div className="planner-loading-container text-center">
            {/* 1. Header Details */}
            <div className="planner-loading-header mb-5">
                <h1 className="planner-header-title mb-3">Generating Your Study Schedule</h1>
                <p className="planner-header-desc mx-auto">
                    Our Planner Engine is analysing your study goals and creating an optimized study plan based on your availability, deadlines and priorities.
                </p>
            </div>

            {/* 2. Main Progress Card */}
            <DashboardCard className="planner-progress-card mx-auto" hover={false} shadow={true} padding="40px">
                {/* Visual state headers */}
                {isError ? (
                    <h2 className="progress-title error-title mb-4">Planner Engine Generation Failed</h2>
                ) : isCompleted ? (
                    <h2 className="progress-title success-title mb-4">Study Plan Generated Successfully!</h2>
                ) : (
                    <h2 className="progress-title mb-4">Creating Your Personalized Study Plan...</h2>
                )}

                {/* Progress Indicators */}
                <div className="progress-bar-section mb-4">
                    <div className="progress-labels-row d-flex justify-content-between align-items-center mb-2">
                        <span className="progress-engine-label">Engine Progress</span>
                        <span className="progress-percentage-label">
                            {isError ? 'Failed' : isCompleted ? '100% Complete' : `${progress}% Complete`}
                        </span>
                    </div>
                    <div className="progress-bar-track">
                        <div 
                            className={`progress-bar-fill ${isError ? 'error-fill' : isCompleted ? 'success-fill' : 'active-fill'}`} 
                            style={{ width: `${isError ? 100 : progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* 3. Error Alert Container */}
                {isError && (
                    <div className="planner-error-alert p-3 mb-4 text-start d-flex align-items-start gap-3">
                        <i className="bi bi-exclamation-triangle-fill error-alert-icon"></i>
                        <div>
                            <h5 className="error-alert-title m-0">Failed to Generate Schedule</h5>
                            <p className="error-alert-desc m-0 mt-1">
                                {errorMessage || 'An unexpected error occurred in the Planner Engine. Please check your tasks estimated hours and deadlines, and try again.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. Planner Process Checklist Grid */}
                <div className="planner-steps-checklist mb-4">
                    <div className="row g-2">
                        {/* Left Column (Items 1-3) */}
                        <div className="col-12 col-md-6">
                            {steps.slice(0, 3).map((step, idx) => renderStepItem(step, idx))}
                        </div>
                        {/* Right Column (Items 4-6) */}
                        <div className="col-12 col-md-6">
                            {steps.slice(3, 6).map((step, idx) => renderStepItem(step, idx + 3))}
                        </div>
                    </div>
                    
                    {/* Centered/Spanned active scheduler step (Item 7) */}
                    {steps.length > 6 && (
                        <div className="row justify-content-center mt-2 border-top pt-3">
                            <div className="col-auto">
                                {renderStepItem(steps[6], 6)}
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Planner Information Card */}
                <DashboardCard className="planner-info-box p-3 mb-4" hover={false} shadow={false}>
                    <div className="d-flex align-items-start gap-3">
                        <div className="planner-info-icon-box flex-shrink-0">
                            <i className="bi bi-cpu"></i>
                        </div>
                        <div className="planner-info-text text-start">
                            <h4 className="info-box-title mb-1">Planner Engine</h4>
                            <p className="info-box-desc m-0">
                                Our intelligent core considers your specific availability, deadlines, and priorities to calculate the optimal structure for each study session while factoring in your existing commitments.
                            </p>
                        </div>
                    </div>
                </DashboardCard>

                {/* 6. Loading / State Button */}
                <div className="loading-button-wrapper mt-2">
                    {isError ? (
                        <ButtonComponent
                            type="button"
                            className="planner-retry-btn w-100 type_1_btn"
                            onclick={onBack}
                            text={
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-arrow-clockwise"></i> Back and Retry
                                </span>
                            }
                        />
                    ) : isCompleted ? (
                        <ButtonComponent
                            type="button"
                            className="planner-success-btn w-100 type_1_btn"
                            text={
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-check-lg"></i> Study Plan Ready!
                                </span>
                            }
                        />
                    ) : (
                        <ButtonComponent
                            type="button"
                            className="planner-loading-btn w-100 disabled-btn"
                            text={
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-hourglass-split spin-icon"></i> Generating Schedule...
                                </span>
                            }
                        />
                    )}
                </div>
            </DashboardCard>
        </div>
    );
};

export default PlannerLoading;
