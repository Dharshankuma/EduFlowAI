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
    disabled = false,
    isSaveDisabled = false
}) => {
    const {
        firstName = '',
        lastName = '',
        username = '',
        email = '',
        timeZone = '(GMT-05:00) Eastern Time (US & Canada)'
    } = user;

    const handleFormSubmit = (e) => {
        console.log('save changes of the personal information');
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
                            {errors.firstName && (
                                <div className="form-field-error-message mt-1 text-danger small">
                                    {errors.firstName}
                                </div>
                            )}
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
                            {errors.lastName && (
                                <div className="form-field-error-message mt-1 text-danger small">
                                    {errors.lastName}
                                </div>
                            )}
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
                            {errors.username && (
                                <div className="form-field-error-message mt-1 text-danger small">
                                    {errors.username}
                                </div>
                            )}
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
                                disabled={true}
                            />
                        </div>

                        {/* Time Zone Input Box */}
                        <div className="col-12">
                            <InputComponent
                                type="text"
                                label="Time Zone"
                                id="timeZone"
                                name="timeZone"
                                value={timeZone}
                                onChange={onChange}
                                error={errors.timeZone}
                                required={true}
                                disabled={true}
                            />
                        </div>

                        {/* Action Buttons Row */}
                        <div className="col-12 mt-4">
                            <div className="profile-form-actions d-flex flex-sm-row flex-column gap-3">
                                <ButtonComponent
                                    type="submit"
                                    text={disabled ? "Saving..." : "Save Changes"}
                                    className="profile-save-btn"
                                    disabled={disabled || isSaveDisabled}
                                />
                                {/* <ButtonComponent
                                    type="button"
                                    text="Cancel"
                                    className="profile-cancel-btn"
                                    onclick={onCancel}
                                    disabled={disabled}
                                /> */}
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </DashboardCard>
    );
};

export default PersonalInformation;
