import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import AccountAction from './AccountAction';
import DangerZone from './DangerZone';
import './AccountManagement.css';

// Lookup for icons and descriptions
const ACTION_METADATA = {
    'Export Study Data': {
        icon: 'bi-download',
        description: 'Export your study history, goals and progress.'
    },
    'Download Schedule': {
        icon: 'bi-calendar-check',
        description: 'Download your latest generated study schedule.'
    }
};

export const AccountManagement = ({
    actions = [],
    onExportData,
    onDownloadSchedule,
    onDeleteAccount
}) => {
    const handleActionClick = (title) => {
        if (title === 'Export Study Data' && onExportData) {
            onExportData();
        } else if (title === 'Download Schedule' && onDownloadSchedule) {
            onDownloadSchedule();
        }
    };

    return (
        <DashboardCard className="account-settings-card" hover={false} shadow={true} padding="32px">
            {/* Header section */}
            <div className="account-settings-header pb-4 mb-4 d-flex align-items-center gap-3">
                <div className="account-icon-container">
                    <i className="bi bi-gear"></i>
                </div>
                <div className="account-title-container text-start">
                    <h3 className="account-settings-title mb-1">Account Management</h3>
                    <p className="account-settings-subtitle mb-0">
                        Manage your account data and lifecycle.
                    </p>
                </div>
            </div>

            {/* Account Actions Grid */}
            <div className="account-actions-container container-fluid p-0">
                <div className="row g-3">
                    {actions.map((action) => {
                        const metadata = ACTION_METADATA[action.title] || {
                            icon: 'bi-box-arrow-up-right',
                            description: ''
                        };

                        return (
                            <div className="col-12 col-md-6" key={action.id}>
                                <AccountAction
                                    id={action.id}
                                    title={action.title}
                                    description={metadata.description}
                                    icon={metadata.icon}
                                    onClick={handleActionClick}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Danger Zone Section */}
            <DangerZone onDeleteAccount={onDeleteAccount} />
        </DashboardCard>
    );
};

export default AccountManagement;
