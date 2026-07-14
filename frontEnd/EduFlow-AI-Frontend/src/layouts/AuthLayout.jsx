import React from 'react'
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        <main>

            <Outlet />

        </main>
    )
}
