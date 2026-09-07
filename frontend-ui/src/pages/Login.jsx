import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        if (event) event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: email.trim(),
                password: password,
            });

            const data = response.data;

            if (!data.access_token) {
                throw new Error("Access token was not returned.");
            }

            localStorage.setItem("token", data.access_token);
            if (data.role) localStorage.setItem("role", data.role);
            if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map((item) => item.msg).join(" | "));
            } else if (typeof detail === "string") {
                setError(detail);
            } else {
                setError("Login failed. Check your credentials or try Demo Mode.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (role = "admin") => {
        localStorage.setItem("is_demo_mode", "true");
        localStorage.setItem("token", `demo-jwt-token-${role}`);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({
            id: 1,
            name: role === "admin" ? "Shantanu (Admin)" : "Support Agent",
            email: `${role}@supportiq.ai`,
            role: role
        }));
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Ambient glowing background blobs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        AI Support Intelligence
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Support<span className="text-blue-500">IQ</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Automated ticket prioritization, classification & sentiment intelligence
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
                    {/* 1-Click Showcase Demo Button */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/40">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                🚀 Instant Showcase Access
                            </span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
                                Zero Setup
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                            Recruiters & visitors: Explore the full dashboard, ML prediction simulation, and analytics instantly.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("admin")}
                                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                👑 Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("support_agent")}
                                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                🎧 Agent Demo
                            </button>
                        </div>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase font-semibold tracking-wider">Or Login With Credentials</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
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
                                placeholder="••••••••"
                                disabled={loading}
                                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Authenticating..." : "Sign In to Workspace"}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-5 border-t border-slate-800/80">
                        <p className="text-xs text-slate-400">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer notes */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    Full-Stack AI Project &bull; FastAPI &bull; Scikit-Learn &bull; React &bull; Tailwind
                </p>
            </div>
        </div>
    );
}

export default Login;