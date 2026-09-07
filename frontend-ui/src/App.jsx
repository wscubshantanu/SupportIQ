// ==========================================
// SupportIQ - Application Routing
// ==========================================

import React from "react";
import {
    HashRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import Analytics from "./pages/Analytics";

// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";

// ==========================================
// APP
// ==========================================

function App() {
    return (
        <HashRouter>
            <Routes>
                {/* LOGIN & REGISTER */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* PROTECTED ROUTES */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute>
                            <Tickets />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-ticket"
                    element={
                        <ProtectedRoute>
                            <CreateTicket />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tickets/:ticketId"
                    element={
                        <ProtectedRoute>
                            <TicketDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                {/* FALLBACK REDIRECT */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;