import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Landing } from "../pages/public/landing/Landing";
import { Login } from "../pages/auth/login/Login";
import { Register } from "../pages/auth/register/Register";
import { Dashboard } from "../pages/app/dashboard/Dashboard";
import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
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
                    <Route path="/goals" element={<div className="p-3"><h2>Goals Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/tasks" element={<div className="p-3"><h2>Tasks Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/calendar" element={<div className="p-3"><h2>Calendar Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/ai-planner" element={<div className="p-3"><h2>AI Planner Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/analytics" element={<div className="p-3"><h2>Analytics Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/profile" element={<div className="p-3"><h2>Profile Page</h2><p>Phase 2 Feature</p></div>} />
                    <Route path="/settings" element={<div className="p-3"><h2>Settings Page</h2><p>Phase 2 Feature</p></div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;   