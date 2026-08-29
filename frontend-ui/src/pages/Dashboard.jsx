// ==========================================
// SupportIQ - Dashboard
// ==========================================

import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../services/api";


function Dashboard() {

    const navigate = useNavigate();


    const [stats, setStats] = useState({

        total_tickets: 0,

        open_tickets: 0,

        in_progress_tickets: 0,

        resolved_tickets: 0,

        closed_tickets: 0,

    });


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );


    // ==========================================
    // LOAD ANALYTICS
    // ==========================================

    useEffect(() => {

        loadDashboardStats();

    }, []);


    const loadDashboardStats = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/analytics/overview"
                );


            console.log(
                "Dashboard analytics:",
                response.data
            );


            const data =
                response.data;


            setStats({

                total_tickets:
                    data.total_tickets ??
                    data.total ??
                    0,

                open_tickets:
                    data.open_tickets ??
                    data.open ??
                    0,

                in_progress_tickets:
                    data.in_progress_tickets ??
                    data.in_progress ??
                    0,

                resolved_tickets:
                    data.resolved_tickets ??
                    data.resolved ??
                    0,

                closed_tickets:
                    data.closed_tickets ??
                    data.closed ??
                    0,

            });

        }

        catch (err) {

            console.error(
                "Dashboard analytics error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "role"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/");

                return;
            }


            setError(
                "Unable to load dashboard statistics."
            );

        }

        finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");
    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div style={styles.container}>


            {/* HEADER */}

            <header style={styles.header}>

                <div>

                    <h1 style={styles.title}>
                        SupportIQ
                    </h1>

                    <p style={styles.subtitle}>
                        AI-Powered Customer Support Platform
                    </p>

                </div>


                <div style={styles.nav}>

                    <button
                        style={styles.navButton}
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        style={styles.navButton}
                        onClick={() =>
                            navigate(
                                "/tickets"
                            )
                        }
                    >
                        Tickets
                    </button>


                    <button
                        style={styles.navButton}
                        onClick={() =>
                            navigate(
                                "/analytics"
                            )
                        }
                    >
                        Analytics
                    </button>


                    <button
                        style={styles.logout}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* MAIN */}

            <main style={styles.main}>


                {/* WELCOME */}

                <div style={styles.welcome}>

                    <h2 style={styles.welcomeTitle}>
                        Welcome
                        {user.name
                            ? `, ${user.name}`
                            : ""}!
                        👋
                    </h2>

                    <p>
                        Monitor your customer support
                        system and AI-powered ticket
                        intelligence.
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div style={styles.error}>
                        {error}
                    </div>

                )}


                {/* STATISTICS */}

                <h2 style={styles.sectionTitle}>
                    Support Overview
                </h2>


                <div style={styles.statsGrid}>

                    <StatCard
                        title="Total Tickets"
                        value={
                            loading
                                ? "..."
                                : stats.total_tickets
                        }
                        icon="🎫"
                    />


                    <StatCard
                        title="Open"
                        value={
                            loading
                                ? "..."
                                : stats.open_tickets
                        }
                        icon="📂"
                    />


                    <StatCard
                        title="In Progress"
                        value={
                            loading
                                ? "..."
                                : stats.in_progress_tickets
                        }
                        icon="⚙️"
                    />


                    <StatCard
                        title="Resolved"
                        value={
                            loading
                                ? "..."
                                : stats.resolved_tickets
                        }
                        icon="✅"
                    />


                    <StatCard
                        title="Closed"
                        value={
                            loading
                                ? "..."
                                : stats.closed_tickets
                        }
                        icon="🔒"
                    />

                </div>


                {/* QUICK ACCESS */}

                <h2 style={styles.sectionTitle}>
                    Quick Access
                </h2>


                <div style={styles.cards}>


                    <QuickCard
                        icon="🎫"
                        title="Tickets"
                        description="View, create and manage customer support tickets."
                        button="Manage Tickets"
                        onClick={() =>
                            navigate("/tickets")
                        }
                    />


                    <QuickCard
                        icon="➕"
                        title="Create Ticket"
                        description="Create a new support ticket and let AI analyze it automatically."
                        button="Create Ticket"
                        onClick={() =>
                            navigate("/tickets")
                        }
                    />


                    <QuickCard
                        icon="📊"
                        title="Analytics"
                        description="View ticket statistics, categories and sentiment analytics."
                        button="View Analytics"
                        onClick={() =>
                            navigate("/analytics")
                        }
                    />

                </div>

            </main>

        </div>
    );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
    title,
    value,
    icon
}) {

    return (

        <div style={styles.statCard}>

            <div style={styles.statIcon}>
                {icon}
            </div>

            <div>

                <p style={styles.statTitle}>
                    {title}
                </p>

                <h2 style={styles.statValue}>
                    {value}
                </h2>

            </div>

        </div>
    );
}


// ==========================================
// QUICK CARD
// ==========================================

function QuickCard({
    icon,
    title,
    description,
    button,
    onClick
}) {

    return (

        <div
            style={styles.card}
            onClick={onClick}
        >

            <div style={styles.cardIcon}>
                {icon}
            </div>


            <h3 style={styles.cardTitle}>
                {title}
            </h3>


            <p style={styles.cardDescription}>
                {description}
            </p>


            <button
                style={styles.button}
                onClick={(event) => {

                    event.stopPropagation();

                    onClick();

                }}
            >
                {button}
            </button>

        </div>
    );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f4f7fb",
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px 40px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
    },


    nav: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
    },


    navButton: {
        padding: "10px 14px",
        border: "none",
        background: "transparent",
        color: "#374151",
        cursor: "pointer",
        fontWeight: "600",
    },


    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "700",
        color: "#2563eb",
    },


    subtitle: {
        margin: "5px 0 0",
        color: "#666",
    },


    logout: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#dc3545",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
    },


    main: {
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
    },


    welcome: {
        marginBottom: "35px",
    },


    welcomeTitle: {
        marginBottom: "8px",
    },


    sectionTitle: {
        marginBottom: "18px",
        marginTop: "30px",
        fontSize: "22px",
    },


    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "18px",
    },


    statCard: {
        background: "#ffffff",
        padding: "22px",
        borderRadius: "12px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },


    statIcon: {
        fontSize: "32px",
    },


    statTitle: {
        margin: 0,
        color: "#666",
        fontSize: "14px",
    },


    statValue: {
        margin: "5px 0 0",
        fontSize: "28px",
    },


    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
    },


    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },


    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)",
        cursor: "pointer",
    },


    cardIcon: {
        fontSize: "32px",
        marginBottom: "10px",
    },


    cardTitle: {
        fontSize: "20px",
        marginBottom: "8px",
    },


    cardDescription: {
        color: "#666",
        lineHeight: "1.6",
    },


    button: {
        marginTop: "15px",
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
    },

};


export default Dashboard;