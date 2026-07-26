import React from 'react';
import DashboardCard from '../../../common/DashboardCard/DashboardCard';
import SecurityAction from './SecurityAction';
import './Security.css';

// Lookup for icons and descriptions
const ACTION_METADATA = {
    'Active Devices': {
        icon: 'bi-laptop',
        description: 'View all currently logged in devices.'
    },
    'Login History': {
        icon: 'bi-clock-history',
        description: 'View your recent login activity.'
    },
    'Change Password': {
        icon: 'bi-key',
        description: 'Update your account password securely.'
    },
    'Update Password': {
        icon: 'bi-key',
        description: 'Update your account password securely.'
    }
};

export const Security = ({
    security = {},
    onToggleTwoFactor,
    onActionClick
}) => {
    const { twoFactorEnabled = false, actions = [] } = security;

    return (
        <DashboardCard className="security-settings-card" hover={false} shadow={true} padding="32px">
            {/* Header section */}
            <div className="security-settings-header pb-4 mb-4 d-flex align-items-center gap-3">
                <div className="security-icon-container">
                    <i className="bi bi-shield"></i>
                </div>
                <div className="security-title-container text-start">
                    <h3 className="security-settings-title mb-1">Security</h3>
                    <p className="security-settings-subtitle mb-0">
                        Manage your account security and authentication settings.
                    </p>
                </div>
            </div>

            {/* Two-Factor Authentication Panel */}
            <div className="two-factor-auth-card p-3 mb-4">
                <div className="row align-items-center w-100 m-0">
                    <div className="col-10 ps-0 d-flex align-items-center gap-3 text-start">
                        <div className="two-factor-icon-wrapper">
                            <i className="bi bi-lock"></i>
                        </div>
                        <div className="two-factor-text">
                            <h4 className="two-factor-title mb-1">Two-Factor Authentication</h4>
                            <p className="two-factor-desc mb-0">
                                Add an additional layer of security to your account.
                            </p>
                        </div>
                    </div>
                    <div className="col-2 pe-0 d-flex justify-content-end align-items-center">
                        <div className="form-check form-switch m-0">
                            <input
                                className="form-check-input security-switch"
                                type="checkbox"
                                role="switch"
                                checked={twoFactorEnabled}
                                onChange={onToggleTwoFactor}
                                id="security-toggle-2fa"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Actions Grid */}
            <div className="security-actions-container container-fluid p-0">
                <div className="row g-3">
                    {actions.map((action) => {
                        const metadata = ACTION_METADATA[action.title] || {
                            icon: 'bi-gear',
                            description: ''
                        };

                        return (
                            <div className="col-12 col-md-6" key={action.id}>
                                <SecurityAction
                                    id={action.id}
                                    title={action.title}
                                    description={metadata.description}
                                    icon={metadata.icon}
                                    onClick={onActionClick}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardCard>
    );
};

export default Security;
