// ==========================================
// SupportIQ - Create Ticket with Real-Time AI Preview
// ==========================================

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api, { clientPredictTicket } from "../services/api";

function CreateTicket() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [createdTicket, setCreatedTicket] = useState(null);

    // Live AI Preview as user types
    const livePrediction = useMemo(() => {
        if (!title.trim() && !description.trim()) {
            return null;
        }
        return clientPredictTicket(title, description);
    }, [title, description]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setCreatedTicket(null);

        if (!title.trim()) {
            setMessageType("error");
            setMessage("Please enter a ticket title.");
            return;
        }

        if (!description.trim()) {
            setMessageType("error");
            setMessage("Please enter a ticket description.");
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                title: title.trim(),
                description: description.trim(),
            };

            const response = await api.post("/tickets/", requestData);

            setMessageType("success");
            setMessage(`Ticket #${response.data.id} created & analyzed successfully by AI.`);
            setCreatedTicket(response.data);

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Create ticket error:", error);
            const detail = error.response?.data?.detail;
            setMessageType("error");
            if (Array.isArray(detail)) {
                setMessage(detail.map((i) => i.msg).join(" | "));
            } else if (typeof detail === "string") {
                setMessage(detail);
            } else {
                setMessage("Failed to create ticket. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    const samplePrompts = [
        {
            label: "Technical Bug",
            title: "Database connection timeout during checkout",
            desc: "Customers in the EU region are receiving 504 gateway timeout errors when clicking Place Order on checkout."
        },
        {
            label: "Billing Issue",
            title: "Duplicate subscription charge on invoice",
            desc: "I was billed twice for the annual Enterprise license on my credit card. Please issue an immediate refund."
        },
        {
            label: "Account Access",
            title: "Locked out of account after password reset",
            desc: "The reset email verification link expires before I can type the new password. I urgently need access."
        }
    ];

    const applySample = (sample) => {
        setTitle(sample.title);
        setDescription(sample.desc);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <button
                            onClick={() => navigate("/tickets")}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-2"
                        >
                            &larr; Back to Ticket Queue
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Create Support Ticket
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Submit a customer request for instant Machine Learning classification & sentiment triage.
                        </p>
                    </div>

                    {/* Sample prompt shortcuts */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Try Template:</span>
                        {samplePrompts.map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => applySample(s)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-semibold hover:text-blue-600 transition shadow-sm cursor-pointer"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Messages */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
                            messageType === "success"
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                : "bg-rose-50 border border-rose-200 text-rose-800"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span>{messageType === "success" ? "✅" : "⚠️"}</span>
                            <span>{message}</span>
                        </div>
                        {createdTicket && (
                            <button
                                onClick={() => navigate(`/tickets/${createdTicket.id}`)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                                View AI Insights &rarr;
                            </button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Ticket Subject / Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Cannot access account after recent update"
                                    disabled={loading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Customer Message / Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue reported by the customer in detail..."
                                    rows={7}
                                    disabled={loading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition leading-relaxed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing AI Inference...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span> Submit & Predict with AI
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Real-time AI Preview Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                    <span>⚡</span> Live ML Preview
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                                    Real-Time
                                </span>
                            </div>

                            {livePrediction ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Predicted Category</span>
                                        <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                            {livePrediction.category}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Predicted Priority</span>
                                        <div className="mt-1">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                                livePrediction.priority === "Critical" ? "bg-rose-500/20 border-rose-500/40 text-rose-300" :
                                                livePrediction.priority === "High" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" :
                                                livePrediction.priority === "Medium" ? "bg-blue-500/20 border-blue-500/40 text-blue-300" :
                                                "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                            }`}>
                                                {livePrediction.priority}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Detected Sentiment</span>
                                        <div className="text-sm font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                                            {livePrediction.sentiment === "Positive" ? "😊 Positive" :
                                             livePrediction.sentiment === "Negative" ? "😟 Negative" : "😐 Neutral"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-400 text-xs leading-relaxed">
                                    Start typing a subject and message to watch the AI models analyze the text in real-time.
                                </div>
                            )}
                        </div>

                        {/* Model Specs Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs space-y-2.5">
                            <h4 className="font-bold text-slate-900">Supported ML Models</h4>
                            <ul className="space-y-1.5 text-slate-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold">&bull;</span>
                                    <span><strong>Category:</strong> Technical, Billing, Account, General</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold">&bull;</span>
                                    <span><strong>Priority:</strong> Low, Medium, High, Critical</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold">&bull;</span>
                                    <span><strong>Sentiment:</strong> Positive, Neutral, Negative</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateTicket;