import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import { ButtonComponent } from '../../../common/CommonComponents/ButtonComponent';
import './ProfileHeader.css';

export const ProfileHeader = ({ user = {}, onUpload }) => {
    const {
        profileImage,
        userName = 'Dharshan Muthukumar',
        memberSince = 'July 2026',
        lastLogin = 'Today • 9:20 AM'
    } = user;

    return (
        <DashboardCard className="profile-header-card" hover={false} shadow={true} padding="32px">
            <div className="container-fluid p-0">
                <div className="row g-4 align-items-center">

                    {/* Left Column: Avatar and User Details */}
                    <div className="col-12 col-md-8 d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4">
                        {/* Circular Avatar Container with Overlay Pencil Icon */}
                        <div className="profile-avatar-wrapper">
                            {profileImage ? (
                                <img src={profileImage} alt={userName} className="profile-avatar-img" />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                className="avatar-edit-badge"
                                onClick={onUpload}
                                aria-label="Upload profile picture"
                                type="button"
                            >
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                        </div>

                        {/* User Metadata stack */}
                        <div className="profile-meta-details text-center text-sm-start">
                            <h2 className="profile-user-name">{userName}</h2>
                            <div className="profile-info-row mt-2">
                                <span className="profile-info-item">
                                    <i className="bi bi-person-check-fill info-icon"></i>
                                    Member Since: {memberSince}
                                </span>
                                <span className="profile-info-separator d-none d-sm-inline">&bull;</span>
                                <span className="profile-info-item">
                                    <i className="bi bi-clock-fill info-icon"></i>
                                    Last Login: {lastLogin}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upload Profile Button */}
                    <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center">
                        <ButtonComponent
                            type="button"
                            text={
                                <span className="d-flex align-items-center gap-2">
                                    <i className="bi bi-upload"></i> Upload Profile Picture
                                </span>
                            }
                            className="cta_btn profile-upload-btn"
                            onclick={onUpload}
                        />
                    </div>

                </div>
            </div>
        </DashboardCard>
    );
};

export default ProfileHeader;
