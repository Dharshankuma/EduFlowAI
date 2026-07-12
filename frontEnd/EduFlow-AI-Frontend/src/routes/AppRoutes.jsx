import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Landing } from "../pages/public/landing/Landing";
import { Login } from "../pages/auth/login/Login";
import { Register } from "../pages/auth/register/Register";
import { Dashboard } from "../pages/app/dashboard/Dashboard";
import PublicLayout from "../layouts/PublicLayout";


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
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;   