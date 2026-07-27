import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './TaskCreationMethod.css';

export const TaskCreationMethod = ({
    selectedMethod = 'manual',
    onMethodChange,
    onBack,
    onContinue
}) => {
    return (
        <DashboardCard className="task-creation-method-wizard-card" hover={false} shadow={true} padding="32px">
            {/* 1. Wizard Progress Header */}
            <div className="wizard-progress-header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center pb-4 mb-4">
                <div className="wizard-header-left text-start">
                    <span className="step-badge">STEP 2 OF 2</span>
                    <h2 className="step-title">Task Creation Method</h2>
                    <p className="step-description">Choose how you want to create tasks for this goal.</p>
                </div>
                <div className="wizard-header-right d-flex align-items-center gap-3">
                    <div className="wizard-progress-bar-track">
                        <div className="wizard-progress-bar-fill" style={{ width: '100%' }}></div>
                    </div>
                    <span className="wizard-progress-percentage">100% Complete</span>
                </div>
            </div>

            {/* 2. Subtitle Section */}
            <div className="method-selection-intro text-start mb-4">
                <h3 className="intro-title">Task Creation Method</h3>
                <p className="intro-desc">Choose how you want to create tasks for this goal.</p>
            </div>

            {/* 3. Task Creation Options */}
            <div className="task-creation-options-body mb-5">
                <div className="row g-4">
                    {/* Option 1: Create Tasks Manually */}
                    <div className="col-12 col-md-6">
                        <DashboardCard
                            className={`method-option-card manual-option ${selectedMethod === 'manual' ? 'selected' : ''}`}
                            hover={true}
                            shadow={true}
                            padding="28px"
                            onClick={() => onMethodChange && onMethodChange('manual')}
                        >
                            <div className="option-card-header d-flex justify-content-between align-items-start mb-4">
                                <div className="option-icon-box manual-icon">
                                    <i className="bi bi-list-check"></i>
                                </div>
                                <div className="option-selected-indicator">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                            </div>

                            <div className="option-card-content text-start flex-grow-1">
                                <h4 className="option-title">Create Tasks Manually</h4>
                                <p className="option-desc">
                                    You will create and manage tasks yourself after the goal is created. Ideal for specific, non-standard study paths.
                                </p>
                            </div>

                            <div className="option-card-footer mt-4 w-100">
                                <ButtonComponent
                                    type="button"
                                    className="option-action-btn w-100 type_1_btn"
                                    onclick={onContinue}
                                    text="Continue"
                                />
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Option 2: AI Task Generation */}
                    <div className="col-12 col-md-6">
                        <DashboardCard
                            className="method-option-card ai-option disabled-card"
                            hover={false}
                            shadow={false}
                            padding="28px"
                        >
                            <div className="option-card-header d-flex justify-content-between align-items-start mb-4">
                                <div className="option-icon-box ai-icon">
                                    <span className="rk-logo-combo">
                                        <i className="bi bi-flower1"></i>RK
                                    </span>
                                </div>
                                <span className="coming-soon-badge">Coming in Phase 2</span>
                            </div>

                            <div className="option-card-content text-start flex-grow-1">
                                <h4 className="option-title">AI Task Generation</h4>
                                <p className="option-desc">
                                    Generate tasks automatically using AI. Just tell us your outcome and our assistant will map out the journey.
                                </p>
                            </div>

                            <div className="option-card-footer mt-4 w-100">
                                <ButtonComponent
                                    type="button"
                                    className="option-action-btn w-100 disabled-btn"
                                    text="Coming Soon"
                                />
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </div>

            {/* 4. Footer Navigation */}
            <div className="wizard-footer d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center pt-4">
                <div className="wizard-footer-left d-flex align-items-start gap-2 mb-3 mb-sm-0 text-start align-self-sm-center">
                    <ButtonComponent
                        type="button"
                        className="goal-wizard-back-btn"
                        onclick={onBack}
                        text={
                            <span className="d-flex align-items-center gap-2">
                                <i className="bi bi-arrow-left"></i> Back
                            </span>
                        }
                    />
                </div>
                <div className="wizard-footer-center d-flex align-items-start gap-2 mb-3 mb-sm-0 text-start">
                    <i className="bi bi-info-circle footer-info-icon"></i>
                    <p className="footer-info-text">
                        Next Step: After creating your goal, you'll add study tasks and generate your personalized study schedule.
                    </p>
                </div>
                <div className="wizard-footer-right d-flex align-items-center gap-3">
                    <ButtonComponent
                        type="button"
                        className="goal-wizard-continue-btn type_1_btn"
                        onclick={onContinue}
                        text={
                            <span className="d-flex align-items-center gap-2">
                                Continue <i className="bi bi-arrow-right"></i>
                            </span>
                        }
                    />
                </div>
            </div>
        </DashboardCard>
    );
};

export default TaskCreationMethod;
