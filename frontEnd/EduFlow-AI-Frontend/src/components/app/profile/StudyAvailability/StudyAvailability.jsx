import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/ButtonComponent';
import WeeklyAvailability from './WeeklyAvailability';
import AvailabilitySummary from './AvailabilitySummary';
import StudyPreference from './StudyPreference';
import './StudyAvailability.css';

export const StudyAvailability = ({
    availability = [],
    preferences = {},
    onToggle,
    onStartTimeChange,
    onEndTimeChange,
    onSessionLengthChange,
    onStudyPreferenceChange,
    onSave,
    onReset
}) => {
    return (
        <div className="study-availability-container-stack">
            {/* Main Availability Card */}
            <DashboardCard className="study-availability-card" hover={false} shadow={true} padding="32px">
                {/* Header title */}
                <div className="study-availability-header mb-4">
                    <h3 className="study-availability-title">Weekly Study Availability</h3>
                    <p className="study-availability-desc">
                        Configure your weekly available study hours.
                    </p>

                    {/* UX Informational Message Banner */}
                    <div className="info-message-banner d-flex align-items-start gap-3 mt-3">
                        <i className="bi bi-info-circle-fill info-banner-icon"></i>
                        <p className="info-banner-text m-0">
                            The Planner Engine uses your available study hours and preferences to automatically create personalized daily study schedules.
                        </p>
                    </div>
                </div>

                {/* Day Rows */}
                <WeeklyAvailability
                    availability={availability}
                    onToggle={onToggle}
                    onStartTimeChange={onStartTimeChange}
                    onEndTimeChange={onEndTimeChange}
                />

                {/* Summary Statistics */}
                <AvailabilitySummary availability={availability} />
            </DashboardCard>

            {/* Study Preferences Card */}
            {/* <StudyPreference
                preferences={preferences}
                onSessionLengthChange={onSessionLengthChange}
                onStudyPreferenceChange={onStudyPreferenceChange}
            /> */}

            {/* Save / Cancel actions panel */}
            <div className="availability-page-actions d-flex flex-sm-row flex-column gap-3 justify-content-start mt-3">
                <ButtonComponent
                    type="button"
                    text="Save Availability"
                    className="save-availability-btn"
                    onclick={onSave}
                />
                <ButtonComponent
                    type="button"
                    text="Reset"
                    className="reset-availability-btn"
                    onclick={onReset}
                />
            </div>
        </div>
    );
};

export default StudyAvailability;
