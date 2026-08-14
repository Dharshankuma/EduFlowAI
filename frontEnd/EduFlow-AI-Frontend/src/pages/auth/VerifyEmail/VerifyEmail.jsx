import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import { verifyEmail } from '../../../api/auth/authenticationApi';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import EmailVerificationSuccess from '../EmailVerificationSuccess/EmailVerificationSuccess';
import './VerifyEmail.css';

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [isVerifying, setIsVerifying] = useState(!!token);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [verificationError, setVerificationError] = useState(false);

    const hasTriggered = useRef(false);
    const isComponentMounted = useRef(false);

    // Track active mount lifecycle to handle React StrictMode correctly
    useEffect(() => {
        isComponentMounted.current = true;
        document.body.classList.add('auth-page');
        return () => {
            isComponentMounted.current = false;
            document.body.classList.remove('auth-page');
        };
    }, []);

    useEffect(() => {
        let timer;

        // If token is missing, treat it as invalid immediately without calling backend
        if (!token) {
            setIsVerifying(false);
            setVerificationError(true);
            toast.error("Invalid email verification link.");
            timer = setTimeout(() => {
                if (isComponentMounted.current) {
                    navigate('/login');
                }
            }, 1500);

            return () => {
                if (timer) clearTimeout(timer);
            };
        }

        // StrictMode guard to prevent duplicate API requests
        if (hasTriggered.current) return;
        hasTriggered.current = true;

        const triggerVerification = async () => {
            try {
                if (isComponentMounted.current) setIsVerifying(true);
                await verifyEmail(token);
                if (isComponentMounted.current) {
                    setVerificationSuccess(true);
                }
            } catch (err) {
                if (isComponentMounted.current) {
                    setVerificationError(true);
                    toast.error(err.message || 'An unexpected error occurred. Please try again.');
                    timer = setTimeout(() => {
                        if (isComponentMounted.current) {
                            navigate('/login');
                        }
                    }, 1500);
                }
            } finally {
                if (isComponentMounted.current) {
                    setIsVerifying(false);
                }
            }
        };

        triggerVerification();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [token, navigate]);

    // STATE 1: Verifying State (Loader)
    if (isVerifying) {
        return (
            <div className="email-verification-container">
                <header className="verification-header">
                    <div className="logo-link">
                        <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                        <span className="logo-text">EduFlow AI</span>
                    </div>
                </header>

                <main className="verification-main fade-in-element">
                    <div className="verification-card">
                        <div className="loader-container">
                            <div className="spinner-border spinner-border-custom mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                <span className="visually-hidden">Verifying your email...</span>
                            </div>
                        </div>
                        <h1 className="verification-card-title" aria-live="polite">Verifying your email...</h1>
                        <p className="verification-card-description">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                </main>

                <footer className="verification-footer">
                    <div className="footer-left">&copy; 2026 EduFlow AI. All rights reserved.</div>
                </footer>
            </div>
        );
    }

    // STATE 2: Verification Success State (Reuses the EmailVerificationSuccess component)
    if (verificationSuccess) {
        return <EmailVerificationSuccess />;
    }

    // STATE 3: Verification Error State
    if (verificationError) {
        return (
            <div className="email-verification-container">
                <header className="verification-header">
                    <div className="logo-link">
                        <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                        <span className="logo-text">EduFlow AI</span>
                    </div>
                </header>

                <main className="verification-main fade-in-element">
                    <div className="verification-card">
                        <div className="text-danger mb-4" style={{ fontSize: '3.5rem' }}>
                            <i className="bi bi-x-circle-fill"></i>
                        </div>
                        <h1 className="verification-card-title">Verification Failed</h1>
                        <p className="verification-card-description">
                            The verification link is invalid, expired, or has already been used. Redirecting you to login...
                        </p>
                        <div className="w-100 mt-2">
                            <ButtonComponent
                                type="button"
                                text="Go to Login"
                                className="w-100 type_1_btn"
                                onclick={() => navigate('/login')}
                            />
                        </div>
                    </div>
                </main>

                <footer className="verification-footer">
                    <div className="footer-left">&copy; 2026 EduFlow AI. All rights reserved.</div>
                </footer>
            </div>
        );
    }

    return null;
};

export default VerifyEmail;
