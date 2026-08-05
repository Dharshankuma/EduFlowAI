import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import { Landing } from "../pages/public/landing/Landing";
import { Login } from "../pages/auth/login/Login";
import { Register } from "../pages/auth/register/Register";
import { Dashboard } from "../pages/app/dashboard/Dashboard";
import { Profile } from "../pages/app/profile/Profile";
import { Settings } from "../pages/app/settings/Settings";
import { Goals } from "../pages/app/goals/Goals/Goals";
import { CreateGoal } from "../pages/app/goals/CreateGoal/CreateGoal";
import { GoalDetails } from "../pages/app/goals/GoalDetails/GoalDetails";
import { Calendar } from "../pages/app/calendar/Calendar/Calendar";
import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.scrollTop = 0;
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>

                {/* public routes */}
                <Route element={<PublicLayout />}>

                    <Route
                        path="/"
                        element={<Landing />}
                    />

                </Route>

                {/* auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* app routes */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Placeholder routes for future authenticated views */}
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/goals/create" element={<CreateGoal />} />
                    <Route path="/goals/:goalId" element={<GoalDetails />} />
                    <Route path="/goals/:goalId/edit" element={<GoalDetails />} />
                    {/* <Route path="/tasks" element={<div className="p-3"><h2>Tasks Page</h2><p>Phase 2 Feature</p></div>} /> */}
                    <Route path="/calendar" element={<Calendar />} />
                    {/* <Route path="/ai-planner" element={<div className="p-3"><h2>AI Planner Page</h2><p>Phase 2 Feature</p></div>} /> */}
                    {/* <Route path="/analytics" element={<div className="p-3"><h2>Analytics Page</h2><p>Phase 2 Feature</p></div>} /> */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;   