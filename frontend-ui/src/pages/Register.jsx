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
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            console.log("🔥 REGISTER REQUEST");

            const response = await api.post(
                "/auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }
            );

            console.log(
                "✅ REGISTER RESPONSE:",
                response.data
            );

            setMessage(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(
                "❌ REGISTER ERROR:",
                error
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
                    "Invalid registration data."
                );
            } else {
                setError(
                    "Registration failed. Please try again."
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
                        Create Account
                    </h2>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>

                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Shantanu Kalhapure"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

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
                                placeholder="Minimum 6 characters"
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
                                ? "Creating account..."
                                : "Register"}
                        </button>

                    </form>

                    <div className="text-center mt-6">

                        <p className="text-gray-600">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;