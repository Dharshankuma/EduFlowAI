import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../../components/app/profile/ProfileHeader/ProfileHeader';
import ProfileStatistics from '../../../components/app/profile/ProfileStatistics/ProfileStatistics';
import PersonalInformation from '../../../components/app/profile/PersonalInformation/PersonalInformation';
import QuickActions from '../../../components/app/profile/QuickActions/QuickActions';
import StudyAvailability from '../../../components/app/profile/StudyAvailability/StudyAvailability';
import './Profile.css';
import { toast } from 'react-toastify';
import { getProfile, updatePersonalInformation, updateWeeklyAvailability } from '../../../api/profile/profileApi';

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

// Helper: Detect browser timezone and format with offset
const detectBrowserTimeZone = () => {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offsetMinutes = -new Date().getTimezoneOffset();
        const absOffset = Math.abs(offsetMinutes);
        const hours = Math.floor(absOffset / 60);
        const minutes = absOffset % 60;
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const formattedOffset = `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return `(${formattedOffset}) ${timeZone}`;
    } catch (e) {
        return 'UTC';
    }
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
        userTimeZone: detectBrowserTimeZone()
    });
    const [savedPersonalInfo, setSavedPersonalInfo] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        emailId: '',
        userTimeZone: detectBrowserTimeZone()
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Weekly availability states
    const [savedAvailability, setSavedAvailability] = useState([]);
    const [editableAvailability, setEditableAvailability] = useState([]);
    const [isSavingAvailability, setIsSavingAvailability] = useState(false);
    const [availabilityErrors, setAvailabilityErrors] = useState({});

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
                    const rawTimeZone = detectBrowserTimeZone();

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

                    // Map Weekly Availability list to context and local states
                    if (availabilityList) {
                        const mappedList = availabilityList.map(day => ({
                            day: day.dayOfWeek || day.DayOfWeek,
                            enabled: day.isEnable !== undefined ? day.isEnable : day.IsEnable,
                            startTime: formatTimeOnly(day.startTime || day.StartTime) || '09:00',
                            endTime: formatTimeOnly(day.endTime || day.EndTime) || '17:00',
                            availableHours: day.availableHours !== undefined ? day.availableHours : day.AvailableHours
                        }));
                        setSavedAvailability(mappedList);
                        setEditableAvailability(mappedList);
                        setAvailability(mappedList);
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
        console.log("handleSaveInfo clicked. personalInfo:", personalInfo);

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
        console.log("Personal info validation complete. errors:", newErrors);
        if (Object.keys(newErrors).length > 0) {
            console.log("Aborting save due to validation errors.");
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

            console.log("Sending payload to PUT /Profile/personal-information:", payload);
            await updatePersonalInformation(payload);
            console.log("PUT personal-information succeeded.");

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
            console.error("PUT personal-information API call failed:", err);
            toast.error(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelInfo = () => {
        setPersonalInfo(savedPersonalInfo);
        setErrors({});
    };

    const calculateAvailableHours = (startTime, endTime, enabled) => {
        if (!enabled || !startTime || !endTime) return 0;
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        const diff = (endH * 60 + endM) - (startH * 60 + startM);
        return diff <= 0 ? 0 : diff / 60;
    };

    const handleAvailabilityToggle = (day) => {
        setEditableAvailability((prev) =>
            prev.map((d) => {
                if (d.day === day) {
                    const newEnabled = !d.enabled;
                    return {
                        ...d,
                        enabled: newEnabled,
                        availableHours: newEnabled ? calculateAvailableHours(d.startTime, d.endTime, true) : 0
                    };
                }
                return d;
            })
        );
        // Clear error for this day if toggle changes
        if (availabilityErrors[day]) {
            setAvailabilityErrors(prev => ({
                ...prev,
                [day]: null
            }));
        }
    };

    const handleStartTimeChange = (day, time) => {
        setEditableAvailability((prev) =>
            prev.map((d) => (d.day === day ? {
                ...d,
                startTime: time,
                availableHours: calculateAvailableHours(time, d.endTime, d.enabled)
            } : d))
        );
        if (availabilityErrors[day]) {
            setAvailabilityErrors(prev => ({
                ...prev,
                [day]: null
            }));
        }
    };

    const handleEndTimeChange = (day, time) => {
        setEditableAvailability((prev) =>
            prev.map((d) => (d.day === day ? {
                ...d,
                endTime: time,
                availableHours: calculateAvailableHours(d.startTime, time, d.enabled)
            } : d))
        );
        if (availabilityErrors[day]) {
            setAvailabilityErrors(prev => ({
                ...prev,
                [day]: null
            }));
        }
    };

    const handleSaveAvailability = async () => {
        console.log("handleSaveAvailability clicked. editableAvailability:", editableAvailability);
        // 1. Validation
        const newErrors = {};
        let isValid = true;
        for (const item of editableAvailability) {
            if (item.enabled) {
                if (!item.startTime || !item.startTime.trim()) {
                    newErrors[item.day] = `Start time is required for ${item.day}.`;
                    isValid = false;
                } else if (!item.endTime || !item.endTime.trim()) {
                    newErrors[item.day] = `End time is required for ${item.day}.`;
                    isValid = false;
                } else {
                    const [startH, startM] = item.startTime.split(':').map(Number);
                    const [endH, endM] = item.endTime.split(':').map(Number);
                    const startMins = startH * 60 + startM;
                    const endMins = endH * 60 + endM;
                    if (startMins >= endMins) {
                        newErrors[item.day] = `Start time must be earlier than End time for ${item.day}.`;
                        isValid = false;
                    }
                }
            }
        }

        setAvailabilityErrors(newErrors);
        console.log("Validation complete. isValid =", isValid, "Errors:", newErrors);
        if (!isValid) {
            return;
        }

        if (isSavingAvailability) return;
        setIsSavingAvailability(true);

        // 2. Create immutable submitted snapshot and map to backend DTO payload
        const dayToEnum = {
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6,
            'Sunday': 7
        };

        const submittedList = editableAvailability.map(day => {
            const isDayEnabled = day.enabled;
            const startStr = isDayEnabled ? (day.startTime || '09:00') : null;
            const endStr = isDayEnabled ? (day.endTime || '17:00') : null;

            // Format to HH:mm:ss
            const formattedStart = startStr ? (startStr.length === 5 ? `${startStr}:00` : startStr) : null;
            const formattedEnd = endStr ? (endStr.length === 5 ? `${endStr}:00` : endStr) : null;

            return {
                day: day.day,
                enabled: isDayEnabled,
                startTime: startStr,
                endTime: endStr,
                availableHours: isDayEnabled ? calculateAvailableHours(startStr, endStr, true) : 0,
                // DTO fields
                DayOfWeek: dayToEnum[day.day] || 1,
                IsEnabled: isDayEnabled,
                StartTime: formattedStart,
                EndTime: formattedEnd
            };
        });

        try {
            // Prepare payload
            const payload = {
                Availability: submittedList.map(item => ({
                    DayOfWeek: item.DayOfWeek,
                    IsEnabled: item.IsEnabled,
                    StartTime: item.StartTime,
                    EndTime: item.EndTime
                }))
            };

            console.log("Sending payload to PUT /Profile/weekly-availability:", payload);
            await updateWeeklyAvailability(payload);
            console.log("API PUT request succeeded (204 No Content).");

            // PUT succeeded (204 No Content)
            // Update saved availability and editable availability using the submitted snapshot
            const synchronizedList = submittedList.map(item => ({
                day: item.day,
                enabled: item.enabled,
                startTime: item.startTime,
                endTime: item.endTime,
                availableHours: item.availableHours
            }));

            setSavedAvailability(synchronizedList);
            setEditableAvailability(synchronizedList);
            setAvailability(synchronizedList); // Sync global context state

            // Update Profile Summary locally
            setProfileSummary(prev => {
                if (!prev) return null;
                const activeDays = synchronizedList.filter(d => d.enabled).length;
                const totalHours = synchronizedList.reduce((sum, d) => sum + d.availableHours, 0);
                const avgHours = activeDays > 0 ? (totalHours / activeDays) : 0;

                return {
                    ...prev,
                    totalWeeklyHours: Number(totalHours.toFixed(1)),
                    totalActiveStudyDays: activeDays,
                    averageDailyStudy: Number(avgHours.toFixed(1))
                };
            });

            toast.success("Weekly availability updated successfully.");
        } catch (err) {
            console.error("PUT availability API call failed:", err);
            toast.error(err.message || "An unexpected error occurred.");
        } finally {
            setIsSavingAvailability(false);
        }
    };

    const handleResetAvailability = () => {
        setEditableAvailability(savedAvailability);
        setAvailabilityErrors({});
    };

    const handleSessionLengthChange = (length) => {
        setPreferences((prev) => ({ ...prev, sessionLength: length }));
    };

    const handleStudyPreferenceChange = (time) => {
        setPreferences((prev) => ({ ...prev, studyTime: time }));
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

    const isAvailabilityDirty =
        editableAvailability.length !== savedAvailability.length ||
        editableAvailability.some((edit, idx) => {
            const saved = savedAvailability[idx];
            if (!saved) return true;
            if (edit.day !== saved.day) return true;
            if (edit.enabled !== saved.enabled) return true;
            if (edit.enabled) {
                if (edit.startTime !== saved.startTime) return true;
                if (edit.endTime !== saved.endTime) return true;
            }
            return false;
        });

    const hasInvalidAvailabilityTimes = editableAvailability.some(day => {
        if (!day.enabled) return false;
        if (!day.startTime || !day.startTime.trim()) return true;
        if (!day.endTime || !day.endTime.trim()) return true;
        const [startH, startM] = day.startTime.split(':').map(Number);
        const [endH, endM] = day.endTime.split(':').map(Number);
        return (startH * 60 + startM) >= (endH * 60 + endM);
    });

    const isSaveAvailabilityDisabled = !isAvailabilityDirty || hasInvalidAvailabilityTimes;

    console.log("Availability debug:", {
        isAvailabilityDirty,
        hasInvalidAvailabilityTimes,
        isSaveAvailabilityDisabled,
        editableAvailability
    });

    console.log("Personal Info debug:", {
        isDirty,
        hasEmptyRequiredFields,
        isSaveDisabled,
        personalInfo,
        savedPersonalInfo
    });

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
                    availability={editableAvailability}
                    summary={profileSummary}
                    // preferences={preferences}
                    onToggle={handleAvailabilityToggle}
                    onStartTimeChange={handleStartTimeChange}
                    onEndTimeChange={handleEndTimeChange}
                    onSessionLengthChange={handleSessionLengthChange}
                    onStudyPreferenceChange={handleStudyPreferenceChange}
                    onSave={handleSaveAvailability}
                    onReset={handleResetAvailability}
                    errors={availabilityErrors}
                    disabled={isSavingAvailability}
                    isSaveDisabled={isSaveAvailabilityDisabled}
                />
            </div>
        </div>
    );
};

export default Profile;
