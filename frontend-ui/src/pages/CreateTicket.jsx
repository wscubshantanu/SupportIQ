// ==========================================
// SupportIQ - Create Ticket
// ==========================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateTicket() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    // ==========================================
    // CREATE TICKET
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");

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

            console.log("==========================================");
            console.log("🔥 CREATE TICKET");
            console.log("==========================================");

            const requestData = {
                title: title.trim(),
                description: description.trim(),
                priority: priority,
            };

            console.log("Request:", requestData);

            const response = await api.post(
                "/tickets/",
                requestData
            );

            console.log("✅ TICKET CREATED");
            console.log("Response:", response.data);

            setMessageType("success");

            setMessage(
                `Ticket #${response.data.id} created successfully.`
            );

            setTitle("");
            setDescription("");
            setPriority("Medium");

        } catch (error) {
            console.error(
                "❌ CREATE TICKET ERROR:",
                error
            );

            const detail = error.response?.data?.detail;

            setMessageType("error");

            if (Array.isArray(detail)) {
                setMessage(
                    detail
                        .map((item) => {
                            const location =
                                Array.isArray(item.loc)
                                    ? item.loc.join(" → ")
                                    : "field";

                            return `${location}: ${item.msg}`;
                        })
                        .join(" | ")
                );
            } else if (typeof detail === "string") {
                setMessage(detail);
            } else {
                setMessage(
                    "Failed to create ticket."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/");
    };

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
                            Customer Support Intelligence
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

                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </nav>

            {/* ==================================
                MAIN
            ================================== */}

            <main className="max-w-4xl mx-auto px-6 py-10">

                {/* BACK */}

                <button
                    onClick={() =>
                        navigate("/tickets")
                    }
                    className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
                >
                    ← Back to Tickets
                </button>

                {/* CARD */}

                <div className="bg-white rounded-2xl shadow-sm border p-8">

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Create New Ticket
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Submit a customer support issue for AI-powered analysis.
                        </p>

                    </div>

                    {/* MESSAGE */}

                    {message && (
                        <div
                            className={
                                messageType === "success"
                                    ? "mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-5 py-4"
                                    : "mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4"
                            }
                        >
                            {message}
                        </div>
                    )}

                    {/* FORM */}

                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div className="mb-6">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Ticket Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Example: Cannot login to account"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* DESCRIPTION */}

                        <div className="mb-6">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Describe the customer's problem..."
                                rows={7}
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* PRIORITY */}

                        <div className="mb-8">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value)
                                }
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                                <option value="Critical">
                                    Critical
                                </option>

                            </select>

                            <p className="text-sm text-gray-500 mt-2">
                                The AI model will analyze the ticket and determine its final priority, category and sentiment.
                            </p>

                        </div>

                        {/* BUTTONS */}

                        <div className="flex flex-wrap gap-4">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating Ticket..."
                                    : "Create Ticket"}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    navigate("/tickets")
                                }
                                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default CreateTicket;