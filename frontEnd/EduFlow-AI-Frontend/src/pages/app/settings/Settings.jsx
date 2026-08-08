import React, { useState } from 'react';
import NotificationSettings from '../../../components/app/settings/NotificationSettings/NotificationSettings';
import Security from '../../../components/app/settings/Security/Security';
import AccountManagement from '../../../components/app/settings/AccountManagement/AccountManagement';
import './Settings.css';

import { useAppState } from '../../../context/StateContext';

export const Settings = () => {
    const { settings: settingsData, setSettings: setSettingsData } = useAppState();

    // 1. Notification Toggle State Handler
    const handleToggleNotification = (id) => {
        setSettingsData((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) =>
                n.id === id ? { ...n, enabled: !n.enabled } : n
            )
        }));
        console.log(`Notification ID ${id} toggled.`);
    };

    // 2. 2FA Toggle State Handler
    const handleToggleTwoFactor = () => {
        setSettingsData((prev) => ({
            ...prev,
            security: {
                ...prev.security,
                twoFactorEnabled: !prev.security.twoFactorEnabled
            }
        }));
        console.log(`Two-Factor Authentication toggled to: ${!settingsData.security.twoFactorEnabled}`);
    };

    // 3. Security Action Link Dispatcher
    const handleSecurityActionClick = (id) => {
        const action = settingsData.security.actions.find((a) => a.id === id);
        console.log(`Security action clicked: ${action?.title} (ID: ${id})`);
    };

    // 4. Data Export Callback Dispatcher
    const handleExportData = () => {
        console.log('Export Study Data action triggered.');
    };

    // 5. Calendar Download Callback Dispatcher
    const handleDownloadSchedule = () => {
        console.log('Download Schedule action triggered.');
    };

    // 6. Delete Account Callback Dispatcher
    const handleDeleteAccount = () => {
        console.log('Delete Account action triggered. Initiating backend cleanup flow.');
    };

    return (
        <div className="settings-page-container container-fluid p-0">
            {/* Page Header */}
            <div className="settings-page-header text-start mb-4">
                <h1 className="settings-page-title m-0">Settings</h1>
                {/* <p className="settings-page-subtitle mt-1">
                    Manage your account, preferences and application settings.
                </p> */}
            </div>

            {/* Settings Sections */}
            <div className="settings-sections-stack d-flex flex-column">
                {/* 1. Notification settings card section */}
                {/* <div className="settings-section-wrapper">
                    <NotificationSettings
                        notifications={settingsData.notifications}
                        onToggle={handleToggleNotification}
                    />
                </div> */}

                {/* 2. Security settings card section */}
                {/* <div className="settings-section-wrapper">
                    <Security
                        security={settingsData.security}
                        onToggleTwoFactor={handleToggleTwoFactor}
                        onActionClick={handleSecurityActionClick}
                    />
                </div> */}

                {/* 3. Account Management card section */}
                <div className="settings-section-wrapper">
                    <AccountManagement
                        actions={settingsData.account.actions}
                        onExportData={handleExportData}
                        onDownloadSchedule={handleDownloadSchedule}
                        onDeleteAccount={handleDeleteAccount}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
