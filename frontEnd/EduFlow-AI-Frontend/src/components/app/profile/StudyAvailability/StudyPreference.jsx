import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import './StudyPreference.css';

const timeOptions = [
    { id: 'morning', value: 'Morning', label: 'Morning', icon: 'bi-brightness-high' },
    { id: 'afternoon', value: 'Afternoon', label: 'Afternoon', icon: 'bi-sun' },
    { id: 'evening', value: 'Evening', label: 'Evening', icon: 'bi-sunset' },
    { id: 'night', value: 'Night', label: 'Night', icon: 'bi-moon-stars' }
];

export const StudyPreference = ({
    preferences = {},
    onSessionLengthChange,
    onStudyPreferenceChange
}) => {
    const {
        sessionLength = '60',
        studyTime = 'Evening'
    } = preferences;

    return (
        <DashboardCard className="study-preferences-card" hover={false} shadow={true} padding="32px">
            <h3 className="preferences-title">Study Preferences</h3>
            <p className="preferences-desc">
                These preferences help the Planner Engine generate an optimized study schedule.
            </p>

            <div className="preferences-body mt-4">
                <div className="row g-4">
                    {/* Session Length Dropdown */}
                    <div className="col-12 col-md-6">
                        <div className="mb-3 text-start">
                            <label className="form-label font-semibold" htmlFor="sessionLength">
                                Preferred Study Session Length
                            </label>
                            <select
                                id="sessionLength"
                                className="form-select preferences-select"
                                value={sessionLength}
                                onChange={(e) => onSessionLengthChange && onSessionLengthChange(e.target.value)}
                            >
                                <option value="30">30 Minutes</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">60 Minutes</option>
                                <option value="90">90 Minutes</option>
                                <option value="120">120 Minutes</option>
                            </select>
                        </div>
                    </div>

                    {/* Preferred Study Time Radio Buttons */}
                    <div className="col-12 col-md-6">
                        <div className="mb-3 text-start">
                            <label className="form-label font-semibold d-block mb-3">
                                Preferred Study Time
                            </label>
                            <div className="d-flex flex-wrap gap-3">
                                {timeOptions.map((opt) => (
                                    <div key={opt.id} className="preference-radio-wrapper">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="studyTime"
                                            id={`radio-${opt.id}`}
                                            value={opt.value}
                                            checked={studyTime === opt.value}
                                            onChange={(e) => onStudyPreferenceChange && onStudyPreferenceChange(e.target.value)}
                                        />
                                        <label 
                                            className="btn btn-outline-primary preference-radio-label d-flex align-items-center gap-2" 
                                            htmlFor={`radio-${opt.id}`}
                                        >
                                            <i className={opt.icon}></i>
                                            {opt.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};

export default StudyPreference;
