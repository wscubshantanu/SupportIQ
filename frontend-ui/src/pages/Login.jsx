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
        event.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            console.log("==========================================");
            console.log("🔥 SUPPORTIQ LOGIN");
            console.log("==========================================");
            console.log("Email:", email);

            /*
             * IMPORTANT
             *
             * Your FastAPI endpoint expects:
             *
             * LoginRequest:
             * {
             *     email,
             *     password
             * }
             *
             * Therefore send JSON body.
             */

            const response = await api.post(
                "/auth/login",
                {
                    email: email.trim(),
                    password: password,
                }
            );

            console.log("✅ LOGIN RESPONSE:", response.data);

            const data = response.data;

            if (!data.access_token) {
                throw new Error("Access token was not returned.");
            }

            // Save JWT
            localStorage.setItem(
                "token",
                data.access_token
            );

            // Save role
            if (data.role) {
                localStorage.setItem(
                    "role",
                    data.role
                );
            }

            // Save user
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            console.log("✅ TOKEN SAVED");

            // Go to tickets
            navigate("/tickets");

        } catch (error) {
            console.error(
                "❌ LOGIN ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            const detail =
                error.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail
                        .map(
                            (item) =>
                                item.msg
                        )
                        .join(" | ")
                );
            } else if (
                typeof detail === "string"
            ) {
                setError(detail);
            } else if (
                error.response?.status === 422
            ) {
                setError(
                    "Invalid login data. Please check email and password format."
                );
            } else if (
                error.response?.status === 401
            ) {
                setError(
                    "Invalid email or password."
                );
            } else {
                setError(
                    "Login failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-lg border p-8">

                    <div className="text-center mb-8">

                        <h1 className="text-4xl font-bold text-blue-600">
                            SupportIQ
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Customer Support Intelligence
                        </p>

                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Login
                    </h2>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>

                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="shantanu@gmail.com"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <div className="mb-6">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    <div className="text-center mt-6">

                        <p className="text-gray-600">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;