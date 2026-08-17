import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { registerLoaderCallbacks } from '../api/client/interceptors';

const LoadingContext = createContext(null);

/**
 * Loading Provider that tracks active requests and initial loading triggers.
 */
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const activeRequestsRef = useRef(0);

    const showLoader = useCallback(() => {
        activeRequestsRef.current += 1;
        if (activeRequestsRef.current === 1) {
            setIsLoading(true);
        }
    }, []);

    const hideLoader = useCallback(() => {
        activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
        if (activeRequestsRef.current === 0) {
            setIsLoading(false);
        }
    }, []);

    // Wire callbacks into the Axios client lifecycle
    useEffect(() => {
        registerLoaderCallbacks(showLoader, hideLoader);
        return () => {
            registerLoaderCallbacks(null, null);
        };
    }, [showLoader, hideLoader]);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
