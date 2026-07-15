import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/app/layout/Sidebar/Sidebar';
import Topbar from '../components/app/layout/Topbar/Topbar';
import MobileSidebar from '../components/app/layout/MobileSidebar/MobileSidebar';
import './AppLayout.css';

export const AppLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        // Add helper class to body to override landing page styles
        document.body.classList.add('app-layout-body');
        return () => {
            document.body.classList.remove('app-layout-body');
        };
    }, []);

    // Handle Escape key to close mobile sidebar drawer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMobileSidebarOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(prev => !prev);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <MobileSidebar
                isOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
            />

            <div className="app-wrapper">
                <Topbar onToggleSidebar={toggleMobileSidebar} />

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
