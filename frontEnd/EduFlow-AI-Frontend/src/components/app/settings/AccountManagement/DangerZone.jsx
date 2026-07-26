import React from 'react';
import './DangerZone.css';

export const DangerZone = ({ onDeleteAccount }) => {
    return (
        <div className="danger-zone-container mt-4 pt-4 border-top">
            <h4 className="danger-zone-section-title mb-3 text-start">Danger Zone</h4>
            <div 
                className="danger-zone-card p-3 d-flex align-items-center justify-content-between" 
                onClick={onDeleteAccount}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && onDeleteAccount) {
                        e.preventDefault();
                        onDeleteAccount();
                    }
                }}
            >
                <div className="d-flex align-items-center gap-3 text-start">
                    <div className="danger-zone-icon-container">
                        <i className="bi bi-trash3-fill"></i>
                    </div>
                    <div className="danger-zone-text">
                        <h5 className="danger-zone-title mb-1">Delete Account</h5>
                        <p className="danger-zone-desc mb-0">
                            This action permanently deletes your EduFlow AI account and all associated study data.
                        </p>
                    </div>
                </div>
                <div className="danger-zone-chevron">
                    <i className="bi bi-chevron-right"></i>
                </div>
            </div>
        </div>
    );
};

export default DangerZone;
