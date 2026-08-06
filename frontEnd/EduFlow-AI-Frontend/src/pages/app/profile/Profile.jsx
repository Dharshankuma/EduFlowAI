import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../../components/app/profile/ProfileHeader/ProfileHeader';
import ProfileStatistics from '../../../components/app/profile/ProfileStatistics/ProfileStatistics';
import PersonalInformation from '../../../components/app/profile/PersonalInformation/PersonalInformation';
import QuickActions from '../../../components/app/profile/QuickActions/QuickActions';
import StudyAvailability from '../../../components/app/profile/StudyAvailability/StudyAvailability';
import './Profile.css';

import { useAppState } from '../../../context/StateContext';

export const Profile = () => {
    const navigate = useNavigate();
    const { currentUser: user, setCurrentUser: setUser, availability, setAvailability, preferences, setPreferences } = useAppState();

    // 2. Statistics state
    const [statistics] = useState([
        { id: 1, title: 'STUDY HOURS', value: '125 Hours', icon: 'bi-clock', description: 'Total study time', trendType: 'success' },
        { id: 2, title: 'COMPLETED TASKS', value: '482', icon: 'bi-check-circle', description: 'Successfully completed', trendType: 'success' },
        { id: 3, title: 'ACTIVE GOALS', value: '12', icon: 'bi-bullseye', description: 'Currently active', trendType: 'success' },
        { id: 4, title: 'STUDY STREAK', value: '15 Days', icon: 'bi-fire', description: 'Current streak', trendType: 'success' }
    ]);

    // 3. Actions state
    const [actions] = useState([
        { id: 1, title: 'Create Goal', icon: 'bullseye', route: '/goals/create' },
        { id: 2, title: 'Generate Tasks', icon: 'stars', route: '/goals/create' },
        { id: 3, title: 'Export Report', icon: 'download', route: '/analytics' },
        { id: 4, title: 'Progress Log', icon: 'graph-up', route: '/analytics' }
    ]);

    // Callbacks & Event handlers
    const handleUpload = () => {
        console.log('Trigger mock file upload modal dialog');
    };

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
            userName: name === 'firstName' ? `${value} ${prev.lastName || ''}` : name === 'lastName' ? `${prev.firstName || ''} ${value}` : prev.userName
        }));
    };

    const handleSaveInfo = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        console.log('Personal Information changes submitted successfully:', user);
        alert('Personal Information updated successfully!');
    };

    const handleCancelInfo = () => {
        console.log('User cancelled changes. Reset form to default.');
    };

    const handleAvailabilityToggle = (day) => {
        setAvailability((prev) =>
            prev.map((d) => (d.day === day ? { ...d, enabled: !d.enabled } : d))
        );
    };

    const handleStartTimeChange = (day, time) => {
        setAvailability((prev) =>
            prev.map((d) => (d.day === day ? { ...d, startTime: time } : d))
        );
    };

    const handleEndTimeChange = (day, time) => {
        setAvailability((prev) =>
            prev.map((d) => (d.day === day ? { ...d, endTime: time } : d))
        );
    };

    const handleSaveAvailability = () => {
        console.log('Study Availability records and preferences sent to planner engine:', { availability, preferences });
        alert('Study Availability saved successfully! Scheduler parameters updated.');
    };

    const handleSessionLengthChange = (length) => {
        setPreferences((prev) => ({ ...prev, sessionLength: length }));
    };

    const handleStudyPreferenceChange = (time) => {
        setPreferences((prev) => ({ ...prev, studyTime: time }));
    };

    const handleResetAvailability = () => {
        setAvailability([
            { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Sunday', enabled: false, startTime: '00:00', endTime: '00:00' }
        ]);
        setPreferences({
            sessionLength: '60',
            studyTime: 'Evening'
        });
        console.log('Study Availability and Preferences reset to defaults.');
        alert('Availability reset to default configurations.');
    };

    const handleActionClick = (action) => {
        console.log('Navigation trigger clicked:', action);
        if (action.route) {
            navigate(action.route);
        }
    };

    return (
        <div className="profile-page-container">
            {/* Header section banner */}
            <div className="profile-section">
                <ProfileHeader user={user} onUpload={handleUpload} />
            </div>

            {/* Statistics row grid */}
            <div className="profile-section">
                <ProfileStatistics statistics={statistics} />
            </div>

            {/* Form details & quick links split layout */}
            <div className="container-fluid p-0">
                <div className="row g-4">
                    {/* Left Column: Personal info form */}
                    <div className="col-12 col-lg-8 profile-grid-column">
                        <PersonalInformation
                            user={user}
                            onChange={handleInfoChange}
                            onSave={handleSaveInfo}
                            onCancel={handleCancelInfo}
                        />
                    </div>
                    {/* Right Column: Quick links shortcut list */}
                    <div className="col-12 col-lg-4 profile-grid-column">
                        <QuickActions
                            actions={actions}
                            onActionClick={handleActionClick}
                        />
                    </div>
                </div>
            </div>

            {/* Weekly Availability tracker */}
            <div className="profile-section">
                <StudyAvailability
                    availability={availability}
                    // preferences={preferences}
                    onToggle={handleAvailabilityToggle}
                    onStartTimeChange={handleStartTimeChange}
                    onEndTimeChange={handleEndTimeChange}
                    onSessionLengthChange={handleSessionLengthChange}
                    onStudyPreferenceChange={handleStudyPreferenceChange}
                    onSave={handleSaveAvailability}
                    onReset={handleResetAvailability}
                />
            </div>
        </div>
    );
};

export default Profile;
