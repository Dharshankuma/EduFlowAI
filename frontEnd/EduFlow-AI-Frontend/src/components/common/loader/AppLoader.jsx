import React from 'react';
import { useLoading } from '../../../context/LoadingContext';
import { useAuth } from '../../../context/AuthContext';
import './AppLoader.css';

/**
 * Standard global loader overlay containing a simple Bootstrap spinner.
 */
export const AppLoader = () => {
    const { isLoading } = useLoading();
    let isAuthInitializing = false;

    try {
        const auth = useAuth();
        isAuthInitializing = auth?.isInitializing || false;
    } catch (error) {
        // Fail silently if AuthContext is not initialized
    }

    if (!isLoading && !isAuthInitializing) {
        return null;
    }

    return (
        <div className="app-loader-overlay" role="status" aria-live="polite">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default AppLoader;
