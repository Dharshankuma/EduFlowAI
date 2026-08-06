import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import successIllustration from '../../../assets/images/Success_Illustration_margin.png';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import { DashboardCard } from '../../../components/common/DashboardCard/DashboardCard';
import './EmailVerificationSent.css';

export const EmailVerificationSent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'your-email@university.edu';

    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    const handleSimulateVerify = () => {
        // Navigate to the verification success page
        navigate('/email-verified');
    };

    return (
        <div className="email-verification-sent-container">
            <header className="verification-header">
                <div className="logo-link">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </div>
            </header>

            <main className="verification-main fade-in-element">
                <div className="success-card">
                    <div className="illustration-container">
                        <img src={successIllustration} alt="Check Email" className="success-illustration-img" />
                    </div>

                    <h1 className="success-card-title">Verify Your Email</h1>
                    <p className="success-card-description">
                        We have sent a verification link to <strong>{email}</strong>. Please check your email to activate your account.
                    </p>

                    <DashboardCard hover={false} className="info-panel-card" padding="16px">
                        <div className="info-panel-header mb-2 d-flex align-items-center gap-2">
                            <i className="bi bi-info-circle text-primary"></i>
                            <span className="fw-semibold">Development Simulator</span>
                        </div>
                        <p className="text-secondary small text-start m-0">
                            Since this is a frontend-only prototype, you can simulate clicking the email verification link by using the button below.
                        </p>
                    </DashboardCard>

                    <div className="w-100 mt-4 mb-3">
                        <ButtonComponent
                            type="button"
                            text="Simulate Clicking Verification Link"
                            className="w-100 type_1_btn"
                            onclick={handleSimulateVerify}
                        />
                    </div>

                    <div className="resend-prompt-wrapper">
                        <span>Didn't receive the email?</span>
                        <button
                            type="button"
                            className="resend-link-btn ms-1"
                            onClick={() => alert("Verification email resent!")}
                        >
                            Resend Email
                        </button>
                    </div>
                </div>
            </main>

            <footer className="verification-footer">
                <div className="footer-left">&copy; 2026 EduFlow AI. All rights reserved.</div>
            </footer>
        </div>
    );
};

export default EmailVerificationSent;
