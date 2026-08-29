import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Analytics() {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/analytics/overview");

            console.log("📊 ANALYTICS RESPONSE:", response.data);

            setAnalytics(response.data);

        } catch (err) {
            console.error("❌ ANALYTICS ERROR:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load analytics."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            <header style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        SupportIQ Analytics
                    </h1>

                    <p style={styles.subtitle}>
                        Ticket performance overview
                    </p>
                </div>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            <main style={styles.main}>

                {loading && (
                    <div style={styles.message}>
                        Loading analytics...
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        ❌ {error}
                    </div>
                )}

                {!loading && !error && analytics && (

                    <div style={styles.grid}>

                        <div style={styles.card}>
                            <h3>Total Tickets</h3>
                            <p style={styles.number}>
                                {analytics.total_tickets ?? 0}
                            </p>
                        </div>

                        <div style={styles.card}>
                            <h3>Open Tickets</h3>
                            <p style={styles.number}>
                                {analytics.open_tickets ?? 0}
                            </p>
                        </div>

                        <div style={styles.card}>
                            <h3>Closed Tickets</h3>
                            <p style={styles.number}>
                                {analytics.closed_tickets ?? 0}
                            </p>
                        </div>

                        <div style={styles.card}>
                            <h3>High Priority</h3>
                            <p style={styles.number}>
                                {analytics.high_priority ?? 0}
                            </p>
                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f4f7fb",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
    },

    title: {
        margin: 0,
    },

    subtitle: {
        margin: "5px 0 0",
        color: "#666",
    },

    backButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
    },

    main: {
        padding: "40px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    },

    number: {
        fontSize: "36px",
        fontWeight: "bold",
        margin: "15px 0 0",
    },

    message: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
    },

    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "20px",
        borderRadius: "10px",
    },
};

export default Analytics;