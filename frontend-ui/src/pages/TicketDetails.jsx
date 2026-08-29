// ==========================================
// SupportIQ - Ticket Details + AI Insights
// ==========================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TicketDetails() {
    const { ticketId } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [insights, setInsights] = useState(null);

    const [loading, setLoading] = useState(true);
    const [insightsLoading, setInsightsLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [insightsError, setInsightsError] = useState("");

    // ==========================================
    // FETCH TICKET
    // ==========================================

    const fetchTicket = async () => {
        try {
            setLoading(true);
            setMessage("");

            console.log("==========================================");
            console.log("🔥 FETCHING TICKET");
            console.log("==========================================");
            console.log("Ticket ID:", ticketId);

            const response = await api.get(
                `/tickets/${ticketId}`
            );

            console.log("✅ TICKET DETAILS:", response.data);

            setTicket(response.data);

        } catch (error) {
            console.error(
                "❌ FETCH TICKET ERROR:",
                error
            );

            const detail =
                error.response?.data?.detail;

            setMessage(
                typeof detail === "string"
                    ? detail
                    : "Unable to load ticket."
            );

            setTicket(null);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // FETCH AI INSIGHTS
    // ==========================================

    const fetchInsights = async () => {
        try {
            setInsightsLoading(true);
            setInsightsError("");

            console.log("==========================================");
            console.log("🤖 FETCHING AI INSIGHTS");
            console.log("==========================================");
            console.log("Ticket ID:", ticketId);

            const response = await api.get(
                `/tickets/${ticketId}/insights`
            );

            console.log(
                "✅ AI INSIGHTS:",
                response.data
            );

            setInsights(response.data);

        } catch (error) {
            console.error(
                "❌ AI INSIGHTS ERROR:",
                error
            );

            const detail =
                error.response?.data?.detail;

            setInsightsError(
                typeof detail === "string"
                    ? detail
                    : "Unable to load AI insights."
            );

            setInsights(null);

        } finally {
            setInsightsLoading(false);
        }
    };

    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {
        if (!ticketId) {
            return;
        }

        fetchTicket();
        fetchInsights();

    }, [ticketId]);

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {

            case "Open":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";

            case "In Progress":
                return "bg-blue-100 text-blue-800 border-blue-300";

            case "Resolved":
                return "bg-green-100 text-green-800 border-green-300";

            case "Closed":
                return "bg-gray-100 text-gray-800 border-gray-300";

            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // ==========================================
    // PRIORITY STYLE
    // ==========================================

    const getPriorityClass = (priority) => {
        switch (priority) {

            case "Low":
                return "bg-green-100 text-green-800 border-green-300";

            case "Medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";

            case "High":
                return "bg-orange-100 text-orange-800 border-orange-300";

            case "Critical":
                return "bg-red-100 text-red-800 border-red-300";

            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // ==========================================
    // SENTIMENT STYLE
    // ==========================================

    const getSentimentClass = (sentiment) => {
        switch (sentiment) {

            case "Positive":
                return "bg-green-100 text-green-800 border-green-300";

            case "Negative":
                return "bg-red-100 text-red-800 border-red-300";

            case "Neutral":
                return "bg-gray-100 text-gray-800 border-gray-300";

            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

                    <div className="text-4xl mb-4">
                        🤖
                    </div>

                    <p className="text-gray-600 text-lg">
                        Loading ticket details...
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // TICKET NOT FOUND
    // ==========================================

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Ticket Not Found
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {message || "Unable to find this ticket."}
                    </p>

                    <button
                        onClick={() => navigate("/tickets")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Back to Tickets
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ==================================
                NAVBAR
            ================================== */}

            <nav className="bg-white border-b shadow-sm">

                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <div>

                        <h1 className="text-2xl font-bold text-blue-600">
                            SupportIQ
                        </h1>

                        <p className="text-sm text-gray-500">
                            AI-Powered Customer Support
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="px-4 py-2 text-gray-700 hover:text-blue-600"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/tickets")
                            }
                            className="px-4 py-2 text-gray-700 hover:text-blue-600"
                        >
                            Tickets
                        </button>

                        <button
                            onClick={() =>
                                navigate("/analytics")
                            }
                            className="px-4 py-2 text-gray-700 hover:text-blue-600"
                        >
                            Analytics
                        </button>

                    </div>

                </div>

            </nav>

            {/* ==================================
                MAIN
            ================================== */}

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* BACK */}

                <button
                    onClick={() =>
                        navigate("/tickets")
                    }
                    className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
                >
                    ← Back to Tickets
                </button>

                {/* ==================================
                    TICKET HEADER
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                        <div>

                            <p className="text-sm text-gray-500 mb-2">
                                Ticket #{ticket.id}
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900">
                                {ticket.title || "Untitled Ticket"}
                            </h1>

                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full border px-4 py-2 font-semibold ${getStatusClass(
                                ticket.status
                            )}`}
                        >
                            {ticket.status || "Open"}
                        </span>

                    </div>

                </div>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Customer Description
                    </h2>

                    <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                        {ticket.description ||
                            "No description available."}
                    </p>

                </div>

                {/* ==================================
                    AI ANALYSIS
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                🤖 AI Analysis
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Machine-learning analysis generated by SupportIQ
                            </p>

                        </div>

                        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                            AI Powered
                        </span>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* CATEGORY */}

                        <div className="border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                                Category
                            </p>

                            <p className="text-xl font-bold text-gray-900">
                                {ticket.category || "N/A"}
                            </p>

                        </div>

                        {/* PRIORITY */}

                        <div className="border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                                Priority
                            </p>

                            <span
                                className={`inline-flex rounded-full border px-3 py-1 font-semibold ${getPriorityClass(
                                    ticket.priority
                                )}`}
                            >
                                {ticket.priority || "N/A"}
                            </span>

                        </div>

                        {/* SENTIMENT */}

                        <div className="border rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                                Customer Sentiment
                            </p>

                            <span
                                className={`inline-flex rounded-full border px-3 py-1 font-semibold ${getSentimentClass(
                                    ticket.sentiment
                                )}`}
                            >
                                {ticket.sentiment || "N/A"}
                            </span>

                        </div>

                    </div>

                </div>

                {/* ==================================
                    AI INSIGHTS
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="text-3xl">
                            🧠
                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                AI Ticket Insights
                            </h2>

                            <p className="text-gray-500">
                                Intelligent recommendations for support agents
                            </p>

                        </div>

                    </div>

                    {insightsLoading ? (

                        <div className="bg-gray-50 rounded-xl p-6 text-center">

                            <p className="text-gray-500">
                                Generating AI insights...
                            </p>

                        </div>

                    ) : insightsError ? (

                        <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                            <p className="font-semibold text-red-700">
                                Unable to load AI insights
                            </p>

                            <p className="text-red-600 mt-1">
                                {insightsError}
                            </p>

                        </div>

                    ) : insights ? (

                        <div className="space-y-5">

                            {/* SUMMARY */}

                            <div className="border rounded-xl p-6">

                                <h3 className="font-bold text-gray-900 mb-2">
                                    📋 AI Summary
                                </h3>

                                <p className="text-gray-700 leading-7">
                                    {insights.summary ||
                                        "No summary available."}
                                </p>

                            </div>

                            {/* RECOMMENDATION */}

                            <div className="border rounded-xl p-6">

                                <h3 className="font-bold text-gray-900 mb-2">
                                    💡 Support Recommendation
                                </h3>

                                <p className="text-gray-700 leading-7">
                                    {insights.recommendation ||
                                        "No recommendation available."}
                                </p>

                            </div>

                            {/* SENTIMENT ACTION */}

                            <div className="border rounded-xl p-6">

                                <h3 className="font-bold text-gray-900 mb-2">
                                    💬 Sentiment Action
                                </h3>

                                <p className="text-gray-700 leading-7">
                                    {insights.sentiment_action ||
                                        "No sentiment action available."}
                                </p>

                            </div>

                            {/* CATEGORY ACTION */}

                            <div className="border rounded-xl p-6">

                                <h3 className="font-bold text-gray-900 mb-2">
                                    🔧 Category Action
                                </h3>

                                <p className="text-gray-700 leading-7">
                                    {insights.category_action ||
                                        "No category action available."}
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="bg-gray-50 rounded-xl p-6">

                            <p className="text-gray-500">
                                No AI insights available.
                            </p>

                        </div>

                    )}

                </div>

                {/* ==================================
                    TICKET INFORMATION
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">

                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Ticket Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <InfoCard
                            title="Ticket ID"
                            value={`#${ticket.id}`}
                        />

                        <InfoCard
                            title="Created By"
                            value={ticket.created_by || "N/A"}
                        />

                        <InfoCard
                            title="Status"
                            value={ticket.status || "Open"}
                        />

                        <InfoCard
                            title="Priority"
                            value={ticket.priority || "N/A"}
                        />

                        <InfoCard
                            title="Category"
                            value={ticket.category || "N/A"}
                        />

                        <InfoCard
                            title="Sentiment"
                            value={ticket.sentiment || "N/A"}
                        />

                    </div>

                </div>

                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="flex flex-wrap gap-4">

                    <button
                        onClick={() =>
                            navigate("/tickets")
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
                    >
                        ← Back to Tickets
                    </button>

                    <button
                        onClick={() => {
                            fetchTicket();
                            fetchInsights();
                        }}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
                    >
                        🔄 Refresh
                    </button>

                </div>

            </main>

        </div>
    );
}

// ==========================================
// INFO CARD
// ==========================================

function InfoCard({ title, value }) {
    return (
        <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="font-bold text-gray-900 mt-1">
                {value}
            </p>

        </div>
    );
}

export default TicketDetails;