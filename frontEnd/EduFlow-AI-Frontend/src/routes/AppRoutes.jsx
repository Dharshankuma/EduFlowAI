import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Landing } from "../pages/public/landing/Landing";
import { Login } from "../pages/auth/login/Login";
import { Register } from "../pages/auth/register/Register";
import { Dashboard } from "../pages/app/dashboard/Dashboard";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* public routes */}
                <Route path="/" element={<Landing />} />

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