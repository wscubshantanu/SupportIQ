// ==========================================
// SupportIQ - Main Application Layout
// ==========================================

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Layout({ children }) {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const role =
        localStorage.getItem("role") ||
        user.role ||
        "customer";

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/");
    };

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }`;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ==================================
                SIDEBAR
            ================================== */}

            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r hidden md:block">

                <div className="flex h-full flex-col">

                    {/* LOGO */}

                    <div className="px-6 py-6 border-b">

                        <h1 className="text-2xl font-bold text-blue-600">
                            SupportIQ
                        </h1>

                        <p className="text-xs text-gray-500 mt-1">
                            AI Customer Support
                        </p>

                    </div>


                    {/* USER */}

                    <div className="px-5 py-5 border-b">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {(user.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0">

                                <p className="font-semibold text-gray-900 truncate">
                                    {user.name || "User"}
                                </p>

                                <p className="text-xs text-gray-500 truncate">
                                    {role}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* NAVIGATION */}

                    <nav className="flex-1 px-4 py-6 space-y-2">

                        <NavLink
                            to="/dashboard"
                            className={navClass}
                        >
                            <span>🏠</span>
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/tickets"
                            className={navClass}
                        >
                            <span>🎫</span>
                            Tickets
                        </NavLink>

                        <NavLink
                            to="/create-ticket"
                            className={navClass}
                        >
                            <span>➕</span>
                            Create Ticket
                        </NavLink>

                        <NavLink
                            to="/analytics"
                            className={navClass}
                        >
                            <span>📊</span>
                            Analytics
                        </NavLink>

                    </nav>


                    {/* BOTTOM */}

                    <div className="p-4 border-t">

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
                        >
                            <span>🚪</span>
                            Logout
                        </button>

                    </div>

                </div>

            </aside>


            {/* ==================================
                MAIN AREA
            ================================== */}

            <div className="md:ml-64 min-h-screen">

                {/* TOP BAR */}

                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">

                    <div className="px-6 py-4 flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Customer Support Intelligence
                            </p>

                            <h2 className="text-lg font-semibold text-gray-900">
                                SupportIQ Dashboard
                            </h2>

                        </div>

                        <div className="flex items-center gap-3">

                            <span className="hidden sm:block text-sm text-gray-600">
                                {user.name || "User"}
                            </span>

                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {(user.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                        </div>

                    </div>

                </header>


                {/* PAGE CONTENT */}

                <main>
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;