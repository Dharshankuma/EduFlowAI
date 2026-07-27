import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { InputComponent } from '../../../common/CommonComponents/InputComponent';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './PersonalInformation.css';

export const PersonalInformation = ({
    user = {},
    onChange,
    onSave,
    onCancel,
    errors = {},
    disabled = false
}) => {
    const {
        firstName = '',
        lastName = '',
        username = '',
        email = '',
        timeZone = '(GMT-05:00) Eastern Time (US & Canada)'
    } = user;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(e);
        }
    };

    return (
        <DashboardCard className="personal-info-card" hover={false} shadow={true} padding="32px">
            <h3 className="personal-info-title mb-4">Personal Information</h3>
            
            <form onSubmit={handleFormSubmit} className="personal-info-body">
                <div className="container-fluid p-0">
                    <div className="row g-3 g-md-4">
                        
                        {/* First Name Field */}
                        <div className="col-12 col-md-6">
                            <InputComponent
                                label="First Name"
                                name="firstName"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={onChange}
                                error={errors.firstName}
                                required={true}
                                disabled={disabled}
                            />
                        </div>
                        
                        {/* Last Name Field */}
                        <div className="col-12 col-md-6">
                            <InputComponent
                                label="Last Name"
                                name="lastName"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={onChange}
                                error={errors.lastName}
                                required={true}
                                disabled={disabled}
                            />
                        </div>
                        
                        {/* Username Field */}
                        <div className="col-12 col-md-6">
                            <InputComponent
                                label="Username"
                                name="username"
                                placeholder="@username"
                                value={username}
                                onChange={onChange}
                                error={errors.username}
                                required={true}
                                disabled={disabled}
                            />
                        </div>
                        
                        {/* Email Address Field */}
                        <div className="col-12 col-md-6">
                            <InputComponent
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="name@university.edu"
                                value={email}
                                onChange={onChange}
                                error={errors.email}
                                required={true}
                                disabled={disabled}
                            />
                        </div>
                        
                        {/* Time Zone Select Dropdown */}
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="timeZone">
                                    Time Zone
                                </label>
                                <select 
                                    id="timeZone"
                                    name="timeZone"
                                    className="form-select profile-select-input" 
                                    value={timeZone}
                                    onChange={onChange}
                                    disabled={disabled}
                                >
                                    <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                        (GMT-05:00) Eastern Time (US & Canada)
                                    </option>
                                    <option value="(GMT-08:00) Pacific Time (US & Canada)">
                                        (GMT-08:00) Pacific Time (US & Canada)
                                    </option>
                                    <option value="(GMT+00:00) Greenwich Mean Time">
                                        (GMT+00:00) Greenwich Mean Time
                                    </option>
                                    <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                                        (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
                                    </option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Action Buttons Row */}
                        <div className="col-12 mt-4">
                            <div className="profile-form-actions d-flex flex-sm-row flex-column gap-3">
                                <ButtonComponent
                                    type="submit"
                                    text="Save Changes"
                                    className="profile-save-btn"
                                    disabled={disabled}
                                />
                                <ButtonComponent
                                    type="button"
                                    text="Cancel"
                                    className="profile-cancel-btn"
                                    onclick={onCancel}
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                        
                    </div>
                </div>
            </form>
        </DashboardCard>
    );
};

export default PersonalInformation;
