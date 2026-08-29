// ==========================================
// SupportIQ - Tickets
// ==========================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


// ==========================================
// COMPONENT
// ==========================================

function Tickets() {

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [tickets, setTickets] = useState([]);

    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");

    const [priority, setPriority] =
        useState("Medium");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [priorityFilter, setPriorityFilter] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("info");


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

    const getPriorityClass = (value) => {

        switch (value) {

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
    // FETCH TICKETS
    // ==========================================

    const fetchTickets = async () => {

        try {

            setLoading(true);
            setMessage("");

            const token =
                localStorage.getItem("token");

            if (!token) {

                setMessageType("error");

                setMessage(
                    "Please login first."
                );

                navigate("/");

                return;
            }


            console.log(
                "🔥 LOADING TICKETS"
            );


            const response =
                await api.get("/tickets/");


            console.log(
                "✅ TICKETS RESPONSE:",
                response.data
            );


            setTickets(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        }

        catch (error) {

            console.error(
                "❌ FETCH TICKETS ERROR:",
                error
            );


            setMessageType("error");


            const detail =
                error.response?.data?.detail;


            if (
                error.response?.status === 401
            ) {

                setMessage(
                    "Session expired. Please login again."
                );

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "role"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/");

            }

            else if (
                error.response?.status === 403
            ) {

                setMessage(
                    "You are not authorized to view tickets."
                );

            }

            else if (
                Array.isArray(detail)
            ) {

                setMessage(
                    detail
                        .map(
                            (item) =>
                                `${Array.isArray(item.loc)
                                    ? item.loc.join(" → ")
                                    : "field"}: ${item.msg}`
                        )
                        .join(" | ")
                );

            }

            else if (
                typeof detail === "string"
            ) {

                setMessage(detail);

            }

            else {

                setMessage(
                    "Failed to load tickets."
                );
            }

        }

        finally {

            setLoading(false);
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchTickets();

    }, []);


    // ==========================================
    // CREATE TICKET
    // ==========================================

    const createTicket = async (event) => {

        event.preventDefault();

        setMessage("");


        if (!title.trim()) {

            setMessageType("error");

            setMessage(
                "Please enter ticket title."
            );

            return;
        }


        if (!description.trim()) {

            setMessageType("error");

            setMessage(
                "Please enter ticket description."
            );

            return;
        }


        try {

            setLoading(true);


            const requestData = {

                title: title.trim(),

                description:
                    description.trim(),

                priority: priority,

            };


            console.log(
                "🔥 CREATE TICKET REQUEST:",
                requestData
            );


            const response =
                await api.post(
                    "/tickets/",
                    requestData
                );


            console.log(
                "✅ TICKET CREATED:",
                response.data
            );


            setTitle("");

            setDescription("");

            setPriority("Medium");


            setMessageType("success");

            setMessage(
                `Ticket #${response.data.id} created successfully.`
            );


            await fetchTickets();

        }

        catch (error) {

            console.error(
                "❌ CREATE TICKET ERROR:",
                error
            );


            const detail =
                error.response?.data?.detail;


            setMessageType("error");


            if (
                Array.isArray(detail)
            ) {

                setMessage(
                    detail
                        .map(
                            (item) =>
                                `${Array.isArray(item.loc)
                                    ? item.loc.join(" → ")
                                    : "field"}: ${item.msg}`
                        )
                        .join(" | ")
                );

            }

            else if (
                typeof detail === "string"
            ) {

                setMessage(detail);

            }

            else {

                setMessage(
                    "Failed to create ticket."
                );
            }

        }

        finally {

            setLoading(false);
        }
    };


    // ==========================================
    // VIEW TICKET
    // ==========================================

    const viewTicket = (ticketId) => {

        navigate(
            `/tickets/${ticketId}`
        );
    };


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const updateStatus = async (
        ticketId,
        newStatus
    ) => {

        try {

            setMessage("");

            console.log(
                "🔥 UPDATING STATUS:",
                ticketId,
                newStatus
            );


            const response =
                await api.put(
                    `/tickets/${ticketId}/status`,
                    {
                        status: newStatus,
                    }
                );


            console.log(
                "✅ STATUS UPDATED:",
                response.data
            );


            setMessageType(
                "success"
            );


            setMessage(
                `Ticket #${ticketId} status changed to ${newStatus}.`
            );


            await fetchTickets();

        }

        catch (error) {

            console.error(
                "❌ UPDATE STATUS ERROR:",
                error
            );


            const detail =
                error.response?.data?.detail;


            setMessageType(
                "error"
            );


            if (
                Array.isArray(detail)
            ) {

                setMessage(
                    detail
                        .map(
                            (item) =>
                                item.msg
                        )
                        .join(" | ")
                );

            }

            else if (
                typeof detail === "string"
            ) {

                setMessage(detail);

            }

            else {

                setMessage(
                    "Failed to update ticket status."
                );
            }
        }
    };


    // ==========================================
    // DELETE TICKET
    // ==========================================

    const deleteTicket = async (
        ticketId
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ticket #${ticketId}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setMessage("");


            await api.delete(
                `/tickets/${ticketId}`
            );


            setMessageType(
                "success"
            );


            setMessage(
                `Ticket #${ticketId} deleted successfully.`
            );


            await fetchTickets();

        }

        catch (error) {

            console.error(
                "❌ DELETE ERROR:",
                error
            );


            const detail =
                error.response?.data?.detail;


            setMessageType(
                "error"
            );


            setMessage(
                typeof detail === "string"
                    ? detail
                    : "Failed to delete ticket."
            );
        }
    };


    // ==========================================
    // FILTER
    // ==========================================

    const filteredTickets =
        tickets.filter(
            (ticket) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                const matchesSearch =
                    !searchText ||
                    ticket.title
                        ?.toLowerCase()
                        .includes(searchText) ||
                    ticket.description
                        ?.toLowerCase()
                        .includes(searchText) ||
                    ticket.category
                        ?.toLowerCase()
                        .includes(searchText);


                const matchesStatus =
                    !statusFilter ||
                    ticket.status ===
                        statusFilter;


                const matchesPriority =
                    !priorityFilter ||
                    ticket.priority ===
                        priorityFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );
            }
        );


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("");

        setPriorityFilter("");
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");
    };


    // ==========================================
    // MESSAGE CLASS
    // ==========================================

    const messageClass =
        messageType === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700";


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-100">


            {/* ==================================
                NAVBAR
            ================================== */}

            <nav className="bg-white border-b shadow-sm">

                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>

                        <h1 className="text-2xl font-bold text-blue-600">
                            SupportIQ
                        </h1>

                        <p className="text-sm text-gray-500">
                            Customer Support Intelligence
                        </p>

                    </div>


                    <div className="flex items-center gap-2 flex-wrap">

                        <button
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            className="px-4 py-2 text-gray-700 hover:text-blue-600"
                        >
                            Dashboard
                        </button>


                        <button
                            onClick={() =>
                                navigate(
                                    "/tickets"
                                )
                            }
                            className="px-4 py-2 text-blue-600 font-semibold"
                        >
                            Tickets
                        </button>


                        <button
                            onClick={() =>
                                navigate(
                                    "/analytics"
                                )
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

            <main className="max-w-7xl mx-auto px-6 py-8">


                {/* TITLE */}

                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-gray-900">
                        Ticket Management
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Create, manage, search and update customer support tickets.
                    </p>

                </div>


                {/* MESSAGE */}

                {message && (

                    <div
                        className={`mb-6 border rounded-lg px-5 py-4 ${messageClass}`}
                    >
                        {message}
                    </div>

                )}


                {/* ==================================
                    CREATE
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Create New Ticket
                    </h2>


                    <form onSubmit={createTicket}>


                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Cannot login to account"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Describe the customer's problem..."
                                rows="5"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        <div className="mb-6">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(event) =>
                                    setPriority(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl p-4"
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

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Processing..."
                                : "Create Ticket"}
                        </button>

                    </form>

                </div>


                {/* ==================================
                    SEARCH
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Search & Filter Tickets
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                        <div>

                            <label className="block font-semibold text-gray-700 mb-2">
                                Search
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search tickets..."
                                className="w-full border border-gray-300 rounded-xl p-4"
                            />

                        </div>


                        <div>

                            <label className="block font-semibold text-gray-700 mb-2">
                                Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-xl p-4"
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="Open">
                                    Open
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Resolved">
                                    Resolved
                                </option>

                                <option value="Closed">
                                    Closed
                                </option>

                            </select>

                        </div>


                        <div>

                            <label className="block font-semibold text-gray-700 mb-2">
                                Priority
                            </label>

                            <select
                                value={priorityFilter}
                                onChange={(event) =>
                                    setPriorityFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-xl p-4"
                            >

                                <option value="">
                                    All Priorities
                                </option>

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

                        </div>

                    </div>


                    <button
                        onClick={clearFilters}
                        className="mt-6 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
                    >
                        Clear Filters
                    </button>

                </div>


                {/* ==================================
                    LIST
                ================================== */}

                <div className="bg-white rounded-2xl shadow-sm border p-8">

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Ticket List
                        </h2>

                        <div className="text-gray-600">

                            Showing{" "}

                            <span className="font-bold">
                                {filteredTickets.length}
                            </span>{" "}

                            of{" "}

                            <span className="font-bold">
                                {tickets.length}
                            </span>{" "}

                            tickets

                        </div>

                    </div>


                    {loading ? (

                        <div className="text-center py-12">

                            <p className="text-gray-500">
                                Loading tickets...
                            </p>

                        </div>

                    ) : filteredTickets.length === 0 ? (

                        <div className="text-center py-12">

                            <p className="text-gray-500 text-lg">
                                No tickets found.
                            </p>

                            <button
                                onClick={clearFilters}
                                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                Clear Filters
                            </button>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse">

                                <thead>

                                    <tr className="bg-gray-100">

                                        <th className="border p-4 text-left">
                                            ID
                                        </th>

                                        <th className="border p-4 text-left">
                                            Title
                                        </th>

                                        <th className="border p-4 text-left">
                                            Category
                                        </th>

                                        <th className="border p-4 text-left">
                                            Priority
                                        </th>

                                        <th className="border p-4 text-left">
                                            Sentiment
                                        </th>

                                        <th className="border p-4 text-left">
                                            Status
                                        </th>

                                        <th className="border p-4 text-left">
                                            Created By
                                        </th>

                                        <th className="border p-4 text-left">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredTickets.map(
                                        (ticket) => (

                                            <tr
                                                key={ticket.id}
                                                className="hover:bg-gray-50"
                                            >

                                                <td className="border p-4 font-semibold">
                                                    #{ticket.id}
                                                </td>


                                                <td className="border p-4">

                                                    <div className="font-semibold text-gray-900">
                                                        {ticket.title ||
                                                            "Untitled"}
                                                    </div>

                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {ticket.description ||
                                                            ""}
                                                    </div>

                                                </td>


                                                <td className="border p-4">
                                                    {ticket.category ||
                                                        "N/A"}
                                                </td>


                                                <td className="border p-4">

                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getPriorityClass(
                                                            ticket.priority
                                                        )}`}
                                                    >
                                                        {ticket.priority ||
                                                            "N/A"}
                                                    </span>

                                                </td>


                                                <td className="border p-4">
                                                    {ticket.sentiment ||
                                                        "N/A"}
                                                </td>


                                                <td className="border p-4">

                                                    <select
                                                        value={
                                                            ticket.status ||
                                                            "Open"
                                                        }
                                                        onChange={(event) =>
                                                            updateStatus(
                                                                ticket.id,
                                                                event.target.value
                                                            )
                                                        }
                                                        className={`rounded-lg border p-2 font-semibold ${getStatusClass(
                                                            ticket.status
                                                        )}`}
                                                    >

                                                        <option value="Open">
                                                            Open
                                                        </option>

                                                        <option value="In Progress">
                                                            In Progress
                                                        </option>

                                                        <option value="Resolved">
                                                            Resolved
                                                        </option>

                                                        <option value="Closed">
                                                            Closed
                                                        </option>

                                                    </select>

                                                </td>


                                                <td className="border p-4">
                                                    {ticket.created_by ||
                                                        "N/A"}
                                                </td>


                                                <td className="border p-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                viewTicket(
                                                                    ticket.id
                                                                )
                                                            }
                                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                        >
                                                            View
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                deleteTicket(
                                                                    ticket.id
                                                                )
                                                            }
                                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}


export default Tickets;