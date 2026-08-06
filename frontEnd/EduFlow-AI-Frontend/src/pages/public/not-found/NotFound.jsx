import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/EduFlow_AI_Logo.png';
import { ButtonComponent } from '../../../components/common/CommonComponents/ButtonComponent';
import './NotFound.css';

export const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-page-container">
            <header className="not-found-header">
                <div className="logo-link">
                    <img src={logo} alt="EduFlow AI Logo" className="logo-img me-2" />
                    <span className="logo-text">EduFlow AI</span>
                </div>
            </header>

            <main className="not-found-main fade-in-element">
                <div className="not-found-card text-center">
                    <h1 className="error-code">404</h1>
                    <h2 className="error-title">Page Not Found</h2>
                    <p className="error-desc text-secondary mb-4 mx-auto">
                        Sorry, the page you are looking for does not exist or has been moved.
                    </p>
                    <div className="d-flex justify-content-center gap-3 w-100">
                        <ButtonComponent
                            type="button"
                            text="Go Back"
                            className="btn btn-outline-secondary px-4 py-2"
                            onclick={handleGoBack}
                        />
                        <ButtonComponent
                            type="button"
                            text="Home Dashboard"
                            className="btn type_1_btn px-4 py-2"
                            onclick={handleGoHome}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
