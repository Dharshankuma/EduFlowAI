import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../../components/app/profile/ProfileHeader/ProfileHeader';
import ProfileStatistics from '../../../components/app/profile/ProfileStatistics/ProfileStatistics';
import PersonalInformation from '../../../components/app/profile/PersonalInformation/PersonalInformation';
import QuickActions from '../../../components/app/profile/QuickActions/QuickActions';
import StudyAvailability from '../../../components/app/profile/StudyAvailability/StudyAvailability';
import './Profile.css';
import { toast } from 'react-toastify';
import { getProfile, updatePersonalInformation } from '../../../api/profile/profileApi';

import { useAppState } from '../../../context/StateContext';

// Helper: Convert time string from backend (HH:MM:SS or HH:MM) to HH:MM for HTML5 input
const formatTimeOnly = (timeStr) => {
    if (!timeStr) return '';
    const match = timeStr.match(/^(\d{2}):(\d{2})/);
    if (match) {
        return `${match[1]}:${match[2]}`;
    }
    return '';
};

export const Profile = () => {
    const navigate = useNavigate();
    const { currentUser: user, setCurrentUser: setUser, availability, setAvailability, preferences, setPreferences } = useAppState();

    const [error, setError] = useState(null);
    const [profileSummary, setProfileSummary] = useState(null);

    // Form state and original saved state
    const [personalInfo, setPersonalInfo] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        emailId: '',
        userTimeZone: ''
    });
    const [savedPersonalInfo, setSavedPersonalInfo] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        emailId: '',
        userTimeZone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Fetch profile data on mount
    useEffect(() => {
        let isMounted = true;

        const fetchProfileData = async () => {
            try {
                setError(null);
                const data = await getProfile();

                if (isMounted && data) {
                    const personalInfoData = data.personalInformation || data.PersonalInformation;
                    const header = data.profileHeader || data.ProfileHeader;
                    const availabilityList = data.weeklyAvailability || data.WeeklyAvailability;
                    const summary = data.profileSummary || data.ProfileSummary;

                    const rawUserName = personalInfoData?.userName || personalInfoData?.UserName || '';
                    const mappedUserName = rawUserName.startsWith('@') ? rawUserName : (rawUserName ? `@${rawUserName}` : '@user');
                    const rawTimeZone = personalInfoData?.timeZoneOffset || personalInfoData?.TimeZoneOffset || '(GMT-05:00) Eastern Time (US & Canada)';

                    const initialForm = {
                        userName: mappedUserName,
                        firstName: personalInfoData?.firstName || personalInfoData?.FirstName || '',
                        lastName: personalInfoData?.lastName || personalInfoData?.LastName || '',
                        emailId: personalInfoData?.emailId || personalInfoData?.EmailId || '',
                        userTimeZone: rawTimeZone
                    };

                    setPersonalInfo(initialForm);
                    setSavedPersonalInfo(initialForm);

                    // Map Personal Information and Header fields to context user state
                    setUser(prev => ({
                        ...prev,
                        firstName: initialForm.firstName,
                        lastName: initialForm.lastName,
                        userName: header?.fullName || header?.FullName || `${initialForm.firstName} ${initialForm.lastName}`.trim() || 'User',
                        username: initialForm.userName,
                        email: initialForm.emailId,
                        timeZone: initialForm.userTimeZone,
                        memberSince: header?.memberSince || header?.MemberSince || '',
                        lastLogin: header?.lastLogin || header?.LastLogin || ''
                    }));

                    // Map Weekly Availability list to context availability state
                    if (availabilityList) {
                        setAvailability(availabilityList.map(day => ({
                            day: day.dayOfWeek || day.DayOfWeek,
                            enabled: day.isEnable !== undefined ? day.isEnable : day.IsEnable,
                            startTime: formatTimeOnly(day.startTime || day.StartTime) || '09:00',
                            endTime: formatTimeOnly(day.endTime || day.EndTime) || '17:00',
                            availableHours: day.availableHours !== undefined ? day.availableHours : day.AvailableHours
                        })));
                    }

                    // Store Profile Summary statistics
                    setProfileSummary(summary || null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    toast.error(err.message || 'Failed to retrieve profile data.');
                }
            }
        };

        fetchProfileData();

        return () => {
            isMounted = false;
        };
    }, [setUser, setAvailability]);

    // Statistics derived from profileSummary
    const statistics = [
        { 
            id: 1, 
            title: 'STUDY HOURS', 
            value: profileSummary ? `${profileSummary.totalStudyHours} Hours` : '0 Hours', 
            icon: 'bi-clock', 
            description: 'Total study time', 
            trendType: 'success' 
        },
        { 
            id: 2, 
            title: 'COMPLETED TASKS', 
            value: profileSummary ? String(profileSummary.totalCompletedTasks) : '0', 
            icon: 'bi-check-circle', 
            description: 'Successfully completed', 
            trendType: 'success' 
        },
        { 
            id: 3, 
            title: 'ACTIVE GOALS', 
            value: profileSummary ? String(profileSummary.totalActiveGoals) : '0', 
            icon: 'bi-bullseye', 
            description: 'Currently active', 
            trendType: 'success' 
        },
        { 
            id: 4, 
            title: 'STUDY STREAK', 
            value: profileSummary ? `${profileSummary.totalStudyStreak} Days` : '0 Days', 
            icon: 'bi-fire', 
            description: 'Current streak', 
            trendType: 'success' 
        }
    ];

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
        let mappedField = name;
        if (name === 'username') mappedField = 'userName';
        if (name === 'email') mappedField = 'emailId';
        if (name === 'timeZone') mappedField = 'userTimeZone';

        setPersonalInfo(prev => ({
            ...prev,
            [mappedField]: value
        }));

        // Inline error clearing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSaveInfo = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Client-side validations
        const newErrors = {};
        if (!personalInfo.userName || !personalInfo.userName.trim()) {
            newErrors.username = 'Username is required.';
        }
        if (!personalInfo.firstName || !personalInfo.firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }
        if (!personalInfo.lastName || !personalInfo.lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }
        if (!personalInfo.userTimeZone || !personalInfo.userTimeZone.trim()) {
            newErrors.timeZone = 'Time zone is required.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        if (isSaving) return;
        setIsSaving(true);

        try {
            const cleanUserName = personalInfo.userName.trim();
            const payloadUserName = cleanUserName.startsWith('@') ? cleanUserName.substring(1) : cleanUserName;

            const payload = {
                UserName: payloadUserName,
                FirstName: personalInfo.firstName.trim(),
                LastName: personalInfo.lastName.trim(),
                UserTimeZone: personalInfo.userTimeZone.trim()
            };

            await updatePersonalInformation(payload);

            const updatedForm = {
                ...personalInfo,
                userName: cleanUserName.startsWith('@') ? cleanUserName : `@${cleanUserName}`,
                firstName: personalInfo.firstName.trim(),
                lastName: personalInfo.lastName.trim(),
                userTimeZone: personalInfo.userTimeZone.trim()
            };

            setPersonalInfo(updatedForm);
            setSavedPersonalInfo(updatedForm);

            // Sync global context state
            setUser(prev => ({
                ...prev,
                firstName: updatedForm.firstName,
                lastName: updatedForm.lastName,
                userName: `${updatedForm.firstName} ${updatedForm.lastName}`,
                username: updatedForm.userName,
                timeZone: updatedForm.userTimeZone
            }));

            toast.success("Personal information updated successfully.");
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelInfo = () => {
        setPersonalInfo(savedPersonalInfo);
        setErrors({});
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
        toast.info('Changes applied locally (Saving to server will be implemented in a future phase).');
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
        toast.info('Availability reset to default configurations (locally only).');
    };

    const handleActionClick = (action) => {
        console.log('Navigation trigger clicked:', action);
        if (action.route) {
            navigate(action.route);
        }
    };


    if (error) {
        return (
            <div className="profile-page-container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center p-5 card shadow-sm" style={{ maxWidth: '500px', borderRadius: '12px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                    <h4 className="text-danger mb-2">Error Loading Profile</h4>
                    <p className="text-secondary mb-4">{error.message || 'An unexpected error occurred.'}</p>
                    <button className="btn btn-primary px-4" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const isDirty = 
        personalInfo.firstName !== savedPersonalInfo.firstName ||
        personalInfo.lastName !== savedPersonalInfo.lastName ||
        personalInfo.userName !== savedPersonalInfo.userName ||
        personalInfo.userTimeZone !== savedPersonalInfo.userTimeZone;

    const hasEmptyRequiredFields = 
        !personalInfo.firstName.trim() || 
        !personalInfo.lastName.trim() || 
        !personalInfo.userName.trim() || 
        !personalInfo.userTimeZone.trim();

    const isSaveDisabled = !isDirty || hasEmptyRequiredFields;

    const userForForm = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        username: personalInfo.userName,
        email: personalInfo.emailId,
        timeZone: personalInfo.userTimeZone
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
                            user={userForForm}
                            onChange={handleInfoChange}
                            onSave={handleSaveInfo}
                            onCancel={handleCancelInfo}
                            errors={errors}
                            disabled={isSaving}
                            isSaveDisabled={isSaveDisabled}
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
                    summary={profileSummary}
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
