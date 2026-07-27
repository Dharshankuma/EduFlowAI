import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import { SelectComponent } from '../../../common/CommonComponents/SelectComponent';
import { TextAreaComponent } from '../../../common/CommonComponents/TextAreaComponent';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './GoalInformation.css';

const TYPE_OPTIONS = [
    { value: '', label: 'Select Goal Type' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Placement', label: 'Placement' },
    { value: 'Skill Acquisition', label: 'Skill Acquisition' },
    { value: 'Certification', label: 'Certification' },
    { value: 'Personal', label: 'Personal' }
];

export const GoalInformation = ({
    goalTitle = '',
    goalDescription = '',
    goalType = '',
    targetDate = '',
    priority = '',
    onChange,
    onNext,
    onCancel
}) => {
    // Label for Description showing optional tag
    const descriptionLabel = (
        <span className="d-flex justify-content-between align-items-center w-100">
            <span>Goal Description</span>
            <span className="optional-badge">Optional</span>
        </span>
    );

    return (
        <DashboardCard className="goal-information-wizard-card" hover={false} shadow={true} padding="32px">
            {/* 1. Wizard Progress Header */}
            <div className="wizard-progress-header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center pb-4 mb-4">
                <div className="wizard-header-left text-start">
                    <span className="step-badge">STEP 1 OF 2</span>
                    <h2 className="step-title">Goal Information</h2>
                    <p className="step-description">Tell us about the learning goal you want to achieve.</p>
                </div>
                <div className="wizard-header-right d-flex align-items-center gap-3">
                    <div className="wizard-progress-bar-track">
                        <div className="wizard-progress-bar-fill" style={{ width: '50%' }}></div>
                    </div>
                    <span className="wizard-progress-percentage">50%</span>
                </div>
            </div>

            {/* 2. Goal Information Form */}
            <div className="goal-information-form-body">
                <div className="row g-4">
                    {/* Left Column: Title, Type/Date, Priority */}
                    <div className="col-12 col-md-6 text-start">
                        {/* Goal Title */}
                        <InputComponent
                            label="Goal Title"
                            required={true}
                            name="goalTitle"
                            placeholder="e.g. Master Full-Stack Web Development"
                            value={goalTitle}
                            onChange={onChange}
                        />

                        {/* Goal Type & Target Date (Side-by-side) */}
                        <div className="row g-3">
                            <div className="col-12 col-sm-6">
                                <SelectComponent
                                    label="Goal Type"
                                    required={true}
                                    name="goalType"
                                    value={goalType}
                                    onChange={onChange}
                                    options={TYPE_OPTIONS}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <InputComponent
                                    label="Target Date"
                                    required={true}
                                    type="date"
                                    name="targetDate"
                                    value={targetDate}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        {/* Priority Level (Segmented Control) */}
                        <div className="priority-segmented-wrapper mt-3">
                            <label className="form-label font-semibold mb-2">
                                Priority Level
                                <span className="mandatory_text_color">*</span>
                            </label>
                            <div className="priority-segmented-control">
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="priority"
                                    id="priority-low"
                                    value="Low"
                                    checked={priority === 'Low'}
                                    onChange={onChange}
                                />
                                <label className="priority-segment-btn" htmlFor="priority-low">
                                    Low
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="priority"
                                    id="priority-medium"
                                    value="Medium"
                                    checked={priority === 'Medium'}
                                    onChange={onChange}
                                />
                                <label className="priority-segment-btn" htmlFor="priority-medium">
                                    Medium
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="priority"
                                    id="priority-high"
                                    value="High"
                                    checked={priority === 'High'}
                                    onChange={onChange}
                                />
                                <label className="priority-segment-btn" htmlFor="priority-high">
                                    High
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Description, AI Assistant Card */}
                    <div className="col-12 col-md-6 text-start d-flex flex-column justify-content-between">
                        {/* Goal Description Textarea */}
                        <div className="flex-grow-1">
                            <TextAreaComponent
                                label={descriptionLabel}
                                required={false}
                                name="goalDescription"
                                placeholder="Describe what success looks like for this goal..."
                                value={goalDescription}
                                onChange={onChange}
                                rows={5}
                            />
                        </div>

                        {/* AI Assistant Ready Info Card */}
                        <DashboardCard className="ai-assistant-card" hover={false} shadow={false}>
                            <div className="ai-assistant-card-content">
                                <div className="ai-assistant-icon-container">
                                    <i className="bi bi-stars"></i>
                                </div>
                                <div className="ai-assistant-text-content">
                                    <h4 className="ai-assistant-title">AI Assistant Ready</h4>
                                    <p className="ai-assistant-desc">
                                        In the next step, our AI will analyze your goal to suggest milestones and resources tailored to your target date.
                                    </p>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </div>

            {/* 3. Footer Navigation */}
            <div className="wizard-footer d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center mt-5 pt-4">
                <div className="wizard-footer-left d-flex align-items-start gap-2 mb-3 mb-sm-0 text-start">
                    <i className="bi bi-info-circle footer-info-icon"></i>
                    <p className="footer-info-text">
                        Next Step: After creating your goal, you'll add study tasks and generate your personalized study schedule.
                    </p>
                </div>
                <div className="wizard-footer-right d-flex align-items-center gap-3">
                    <ButtonComponent
                        type="button"
                        className="goal-wizard-cancel-btn"
                        onclick={onCancel}
                        text="Cancel"
                    />
                    <ButtonComponent
                        type="button"
                        className="goal-wizard-next-btn type_1_btn"
                        onclick={onNext}
                        text={
                            <span className="d-flex align-items-center gap-2">
                                Next <i className="bi bi-arrow-right"></i>
                            </span>
                        }
                    />
                </div>
            </div>
        </DashboardCard>
    );
};

export default GoalInformation;
