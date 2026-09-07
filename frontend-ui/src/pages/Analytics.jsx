// ==========================================
// SupportIQ - AI Analytics & Metrics Overview
// ==========================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

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
            setAnalytics(response.data);
        } catch (err) {
            console.error("Analytics error:", err);
            setError(err.response?.data?.detail || "Unable to load analytics.");
        } finally {
            setLoading(false);
        }
    };

    const total = analytics?.total_tickets ?? 0;
    const open = analytics?.open_tickets ?? analytics?.status?.open ?? 0;
    const in_progress = analytics?.in_progress_tickets ?? analytics?.status?.in_progress ?? 0;
    const resolved = analytics?.resolved_tickets ?? analytics?.status?.resolved ?? 0;
    const closed = analytics?.closed_tickets ?? analytics?.status?.closed ?? 0;

    const priorities = analytics?.priority || { critical: 0, high: 0, medium: 0, low: 0 };
    const categories = analytics?.category || {};
    const sentiments = analytics?.sentiment || {};

    const calcPercent = (val) => (total > 0 ? Math.round((val / total) * 100) : 0);

    return (
        <Layout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Support Analytics & Intelligence
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        High-level insights into ticket distribution, AI categories, and customer sentiment.
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2 self-start cursor-pointer"
                >
                    <span>🔄</span> {loading ? "Updating..." : "Refresh Metrics"}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Lifecycle Status Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Volume</span>
                    <div className="text-3xl font-black text-slate-900 mt-2">{loading ? "..." : total}</div>
                    <div className="text-[11px] text-slate-400 mt-1">All time tickets</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Open Queue</span>
                    <div className="text-3xl font-black text-amber-600 mt-2">{loading ? "..." : open}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{calcPercent(open)}% of volume</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">In Progress</span>
                    <div className="text-3xl font-black text-blue-600 mt-2">{loading ? "..." : in_progress}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{calcPercent(in_progress)}% of volume</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved</span>
                    <div className="text-3xl font-black text-emerald-600 mt-2">{loading ? "..." : resolved}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{calcPercent(resolved)}% of volume</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closed</span>
                    <div className="text-3xl font-black text-slate-700 mt-2">{loading ? "..." : closed}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{calcPercent(closed)}% of volume</div>
                </div>
            </div>

            {/* Deep Analytics Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 1. Priority Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900">Priority Distribution</h3>
                        <span className="text-xs text-slate-400 font-semibold">AI Classified</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-rose-600">Critical</span>
                                <span className="text-slate-600">{priorities.critical || 0} ({calcPercent(priorities.critical)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${calcPercent(priorities.critical)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-amber-600">High</span>
                                <span className="text-slate-600">{priorities.high || 0} ({calcPercent(priorities.high)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${calcPercent(priorities.high)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-blue-600">Medium</span>
                                <span className="text-slate-600">{priorities.medium || 0} ({calcPercent(priorities.medium)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${calcPercent(priorities.medium)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-emerald-600">Low</span>
                                <span className="text-slate-600">{priorities.low || 0} ({calcPercent(priorities.low)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${calcPercent(priorities.low)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Sentiment Analysis Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900">Customer Sentiment</h3>
                        <span className="text-xs text-slate-400 font-semibold">NLP Analysis</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-emerald-600 flex items-center gap-1">😊 Positive</span>
                                <span className="text-slate-600">{sentiments.Positive || 0} ({calcPercent(sentiments.Positive)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${calcPercent(sentiments.Positive)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-600 flex items-center gap-1">😐 Neutral</span>
                                <span className="text-slate-600">{sentiments.Neutral || 0} ({calcPercent(sentiments.Neutral)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${calcPercent(sentiments.Neutral)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-rose-600 flex items-center gap-1">😟 Negative</span>
                                <span className="text-slate-600">{sentiments.Negative || 0} ({calcPercent(sentiments.Negative)}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${calcPercent(sentiments.Negative)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs leading-relaxed">
                        💡 <strong>Insight:</strong> Urgent resolution of negative sentiment tickets prevents customer churn and boosts CSAT.
                    </div>
                </div>

                {/* 3. Category Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900">Topic Categorization</h3>
                        <span className="text-xs text-slate-400 font-semibold">Classification</span>
                    </div>

                    <div className="space-y-3">
                        {Object.keys(categories).length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No categories recorded yet.</p>
                        ) : (
                            Object.entries(categories).map(([cat, count]) => (
                                <div key={cat} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                        <span className="text-xs font-bold text-slate-800">{cat}</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                                        {count} ({calcPercent(count)}%)
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Analytics;