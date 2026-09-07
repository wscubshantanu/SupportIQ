// ==========================================
// SupportIQ - Main Application Layout
// ==========================================

import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";

function Layout({ children }) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const role =
        localStorage.getItem("role") ||
        user.role ||
        "customer";

    const isDemo = localStorage.getItem("is_demo_mode") === "true";

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("is_demo_mode");
        navigate("/login");
    };

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
            isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* ==================================
                DESKTOP SIDEBAR
            ================================== */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 hidden md:block">
                <div className="flex h-full flex-col">
                    {/* Brand */}
                    <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/30">
                                S
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    Support<span className="text-blue-600">IQ</span>
                                </h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    AI Ticket Intelligence
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Active User Card */}
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {user.name || "Administrator"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-[11px] font-medium text-slate-500 capitalize truncate">
                                        {role.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                        <NavLink to="/dashboard" className={navClass}>
                            <span className="text-base">📊</span>
                            Dashboard
                        </NavLink>

                        <NavLink to="/tickets" className={navClass}>
                            <span className="text-base">🎫</span>
                            All Tickets
                        </NavLink>

                        <NavLink to="/create-ticket" className={navClass}>
                            <span className="text-base">➕</span>
                            Create Ticket
                        </NavLink>

                        <NavLink to="/analytics" className={navClass}>
                            <span className="text-base">📈</span>
                            Analytics
                        </NavLink>
                    </nav>

                    {/* Mode Status Pill */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                        <div className="px-3 py-2 rounded-lg bg-blue-50/80 border border-blue-100 text-[11px] font-medium text-blue-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isDemo ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                                {isDemo ? "Interactive Showcase" : "Live Backend"}
                            </span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-100 font-bold">
                                {isDemo ? "Mock AI" : "FastAPI"}
                            </span>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        >
                            <span>🚪</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ==================================
                MAIN CONTAINER
            ================================== */}
            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
                    <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                                aria-label="Toggle navigation"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

                            <div>
                                <h2 className="text-base font-bold text-slate-900 leading-tight">
                                    SupportIQ Platform
                                </h2>
                                <p className="text-xs text-slate-400 hidden sm:block">
                                    Enterprise AI Customer Ticket Management
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/wscubshantanu/SupportIQ"
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub Repo
                            </a>

                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 animate-fade-in">
                            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navClass}>
                                📊 Dashboard
                            </NavLink>
                            <NavLink to="/tickets" onClick={() => setMobileMenuOpen(false)} className={navClass}>
                                🎫 Tickets
                            </NavLink>
                            <NavLink to="/create-ticket" onClick={() => setMobileMenuOpen(false)} className={navClass}>
                                ➕ Create Ticket
                            </NavLink>
                            <NavLink to="/analytics" onClick={() => setMobileMenuOpen(false)} className={navClass}>
                                📈 Analytics
                            </NavLink>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                🚪 Sign Out
                            </button>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;