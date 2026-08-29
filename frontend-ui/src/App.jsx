// ==========================================
// SupportIQ - Application Routing
// ==========================================

import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Login from "./pages/Login";
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
        <BrowserRouter>

            <Routes>

                {/* LOGIN */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* TICKETS */}
                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute>
                            <Tickets />
                        </ProtectedRoute>
                    }
                />

                {/* CREATE TICKET */}
                <Route
                    path="/create-ticket"
                    element={
                        <ProtectedRoute>
                            <CreateTicket />
                        </ProtectedRoute>
                    }
                />

                {/* TICKET DETAILS */}
                <Route
                    path="/tickets/:ticketId"
                    element={
                        <ProtectedRoute>
                            <TicketDetails />
                        </ProtectedRoute>
                    }
                />

                {/* ANALYTICS */}
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                {/* UNKNOWN ROUTE */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;