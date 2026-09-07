// ==========================================
// SupportIQ - Modern AI Dashboard
// ==========================================

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
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

    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [analyticsRes, ticketsRes] = await Promise.allSettled([
                api.get("/analytics/overview"),
                api.get("/tickets/")
            ]);

            if (analyticsRes.status === "fulfilled") {
                const data = analyticsRes.value.data;
                setStats({
                    total_tickets: data.total_tickets ?? data.total ?? 0,
                    open_tickets: data.open_tickets ?? data.status?.open ?? 0,
                    in_progress_tickets: data.in_progress_tickets ?? data.status?.in_progress ?? 0,
                    resolved_tickets: data.resolved_tickets ?? data.status?.resolved ?? 0,
                    closed_tickets: data.closed_tickets ?? data.status?.closed ?? 0,
                });
            }

            if (ticketsRes.status === "fulfilled" && Array.isArray(ticketsRes.value.data)) {
                setRecentTickets(ticketsRes.value.data.slice(0, 5));
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setError("Failed to load dashboard metrics.");
        } finally {
            setLoading(false);
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "Critical":
                return "bg-rose-50 text-rose-700 border-rose-200";
            case "High":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Medium":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Open":
                return "bg-amber-100 text-amber-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Resolved":
                return "bg-emerald-100 text-emerald-800";
            default:
                return "bg-slate-100 text-slate-800";
        }
    };

    return (
        <Layout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back, {user.name || "Administrator"} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here is an overview of active customer tickets and AI intelligence triage.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadDashboardData}
                        disabled={loading}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                        <span>🔄</span> {loading ? "Refreshing..." : "Refresh"}
                    </button>
                    <Link
                        to="/create-ticket"
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-md shadow-blue-600/20 flex items-center gap-2"
                    >
                        <span>➕</span> Create Ticket
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* AI Intelligence Feature Banner */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                        <span>🤖</span> Multi-Model Machine Learning Engine
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight mb-2">
                        Real-Time Ticket Intelligence & NLP Triage
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Incoming tickets are analyzed instantaneously by 3 trained models:
                        <strong className="text-white"> Category Classification</strong>,
                        <strong className="text-white"> Priority Prediction</strong>, and
                        <strong className="text-white"> Customer Sentiment Analysis</strong>.
                    </p>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tickets</span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                            🎫
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                        {loading ? "..." : stats.total_tickets}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">All registered requests</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Open</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
                            📂
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                        {loading ? "..." : stats.open_tickets}
                    </div>
                    <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting review</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">In Progress</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                            ⚙️
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                        {loading ? "..." : stats.in_progress_tickets}
                    </div>
                    <p className="text-[11px] text-blue-600 font-semibold mt-1">Being resolved</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                            ✅
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                        {loading ? "..." : stats.resolved_tickets}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Successfully handled</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closed</span>
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">
                            🔒
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                        {loading ? "..." : stats.closed_tickets}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Archived tickets</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    onClick={() => navigate("/create-ticket")}
                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            ➕
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                            Create New Ticket
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Submit a support issue and witness instant AI prediction for category, priority, and customer sentiment.
                        </p>
                    </div>
                    <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                        Create Ticket &rarr;
                    </div>
                </div>

                <div
                    onClick={() => navigate("/tickets")}
                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            🎫
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            Ticket Management
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Browse, search, and filter tickets by category and status. Update lifecycle stages and inspect details.
                        </p>
                    </div>
                    <div className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
                        View All Tickets &rarr;
                    </div>
                </div>

                <div
                    onClick={() => navigate("/analytics")}
                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            📊
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition">
                            AI Analytics & Metrics
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Analyze ticket volume breakdown, sentiment ratio distributions, and top recurring support categories.
                        </p>
                    </div>
                    <div className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
                        Explore Insights &rarr;
                    </div>
                </div>
            </div>

            {/* Recent Tickets Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Recent Support Requests
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Latest tickets processed through the AI pipeline
                        </p>
                    </div>
                    <Link
                        to="/tickets"
                        className="text-xs font-bold text-blue-600 hover:text-blue-500"
                    >
                        View All &rarr;
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-bold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Ticket</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">AI Priority</th>
                                <th className="p-4">Sentiment</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentTickets.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No tickets found. Click "Create Ticket" to add one!
                                    </td>
                                </tr>
                            ) : (
                                recentTickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                                        <td className="p-4 font-mono font-bold text-slate-400">
                                            #{t.id}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="font-bold text-slate-900 truncate">
                                                {t.title}
                                            </p>
                                            <p className="text-slate-400 truncate mt-0.5">
                                                {t.description}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700">
                                                {t.category || "General"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md border font-semibold ${getPriorityBadge(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-600">
                                            {t.sentiment === "Positive" ? "😊 Positive" : t.sentiment === "Negative" ? "😟 Negative" : "😐 Neutral"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => navigate(`/tickets/${t.id}`)}
                                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition cursor-pointer"
                                            >
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;