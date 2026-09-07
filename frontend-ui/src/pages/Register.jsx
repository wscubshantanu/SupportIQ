import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
            });

            setMessage("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            console.error("Register error:", err);
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(detail.map((item) => item.msg).join(" | "));
            } else if (typeof detail === "string") {
                setError(detail);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        New Account
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Create <span className="text-blue-500">SupportIQ</span> Profile
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Get started with AI-assisted customer ticket management
                    </p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
                    {error && (
                        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                            <span>✅</span> {message}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Alex Mercer"
                                disabled={loading}
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex@company.com"
                                disabled={loading}
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                disabled={loading}
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Creating Profile..." : "Complete Registration"}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-5 border-t border-slate-800/80">
                        <p className="text-xs text-slate-400">
                            Already registered?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;