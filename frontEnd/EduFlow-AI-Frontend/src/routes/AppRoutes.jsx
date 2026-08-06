import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import { Landing } from "../pages/public/landing/Landing";
import { Login } from "../pages/auth/login/Login";
import { Register } from "../pages/auth/register/Register";
import { EmailVerificationSent } from "../pages/auth/EmailVerificationSent/EmailVerificationSent";
import { EmailVerificationSuccess } from "../pages/auth/EmailVerificationSuccess/EmailVerificationSuccess";
import { ForgotPassword } from "../pages/auth/ForgotPassword/ForgotPassword";
import { ForgotPasswordSuccess } from "../pages/auth/ForgotPasswordSuccess/ForgotPasswordSuccess";
import { ResetPassword } from "../pages/auth/ResetPassword/ResetPassword";
import { ResetPasswordSuccess } from "../pages/auth/ResetPasswordSuccess/ResetPasswordSuccess";
import { Dashboard } from "../pages/app/dashboard/Dashboard";
import { Profile } from "../pages/app/profile/Profile";
import { Settings } from "../pages/app/settings/Settings";
import { Goals } from "../pages/app/goals/Goals/Goals";
import { CreateGoal } from "../pages/app/goals/CreateGoal/CreateGoal";
import { GoalDetails } from "../pages/app/goals/GoalDetails/GoalDetails";
import { Calendar } from "../pages/app/calendar/Calendar/Calendar";
import { Analytics } from "../pages/app/analytics/Analytics";
import { AIPlanner } from "../pages/app/ai-planner/AIPlanner";
import { Notifications } from "../pages/app/notifications/Notifications";
import { Search } from "../pages/app/search/Search";
import { NotFound } from "../pages/public/not-found/NotFound";
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
                <Route path="/email-verification" element={<EmailVerificationSent />} />
                <Route path="/email-verified" element={<EmailVerificationSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-password/success" element={<ForgotPasswordSuccess />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />

                {/* app routes */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/goals/create" element={<CreateGoal />} />
                    <Route path="/goals/:goalId" element={<GoalDetails />} />
                    <Route path="/goals/:goalId/edit" element={<GoalDetails />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/ai-planner" element={<AIPlanner />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/search" element={<Search />} />
                </Route>

                {/* fallback 404 */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
   