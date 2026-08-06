import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import successIllustration from '../../../assets/images/Success_Illustration.png';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { DashboardCard } from '../../../components/common/DashboardCard/DashboardCard';
import './EmailVerificationSuccess.css';

export const EmailVerificationSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    const handleGoToSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="email-verification-success-container">
            <header className="verification-header">
                <div className="logo-link">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </div>
            </header>

            <main className="verification-main fade-in-element">
                <div className="success-card">
                    <div className="illustration-container">
                        <img src={successIllustration} alt="Success" className="success-illustration-img" />
                    </div>

                    <h1 className="success-card-title">Email Verified!</h1>
                    <p className="success-card-description">
                        Thank you! Your email address has been successfully verified. Your account is now fully active.
                    </p>

                    <DashboardCard hover={false} className="success-info-panel-card" padding="16px">
                        <ul className="success-info-panel-list text-start m-0 p-0" style={{ listStyleType: 'none' }}>
                            <li className="d-flex align-items-center gap-2 mb-2 small text-success">
                                <i className="bi bi-patch-check-fill"></i>
                                <span>Account activation complete</span>
                            </li>
                            <li className="d-flex align-items-center gap-2 mb-2 small text-success">
                                <i className="bi bi-patch-check-fill"></i>
                                <span>All features unlocked</span>
                            </li>
                            <li className="d-flex align-items-center gap-2 small text-success">
                                <i className="bi bi-patch-check-fill"></i>
                                <span>Access to AI Planner enabled</span>
                            </li>
                        </ul>
                    </DashboardCard>

                    <div className="w-100 mt-4 mb-3">
                        <ButtonComponent
                            type="button"
                            text="Proceed to Sign In"
                            className="w-100 type_1_btn"
                            onclick={handleGoToSignIn}
                        />
                    </div>
                </div>
            </main>

            <footer className="verification-footer">
                <div className="footer-left">&copy; 2026 EduFlow AI. All rights reserved.</div>
            </footer>
        </div>
    );
};

export default EmailVerificationSuccess;
