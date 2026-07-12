import { Outlet } from "react-router-dom";

import { Navbar } from "../components/landing/navbar/Navbar";
import { Footer } from "../components/landing/footer/Footer";

const PublicLayout = () => {
    return (
        <>
            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default PublicLayout;