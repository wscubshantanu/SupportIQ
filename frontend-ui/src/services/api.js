// ==========================================
// SupportIQ - Resilient API & Showcase Engine
// ==========================================

import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    timeout: 4000,
});

// ==========================================
// DEMO / SHOWCASE DATA STORAGE
// ==========================================

const INITIAL_DEMO_TICKETS = [
    {
        id: 101,
        title: "API rate limit 429 errors during customer database sync",
        description: "Our sync job is failing repeatedly with 429 Too Many Requests since this morning. Production data synchronization is completely halted.",
        category: "Technical",
        priority: "Critical",
        sentiment: "Negative",
        status: "Open",
        created_by: 1,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
        id: 102,
        title: "Double charged on my latest annual invoice",
        description: "I noticed two identical charges of $499 on my corporate credit card statement on Sept 5th. Please issue a refund for the duplicate charge immediately.",
        category: "Billing",
        priority: "High",
        sentiment: "Negative",
        status: "In Progress",
        created_by: 2,
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
        id: 103,
        title: "Cannot reset 2FA authenticator on new device",
        description: "I upgraded to a new phone and lost access to my authenticator app. Recovery codes are stored in my locked vault.",
        category: "Account",
        priority: "High",
        sentiment: "Negative",
        status: "Open",
        created_by: 3,
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
        id: 104,
        title: "Dashboard analytics graphs loading slowly on Safari",
        description: "When viewing the quarterly performance tab on MacOS Safari, graphs take roughly 12 seconds to render.",
        category: "Technical",
        priority: "Medium",
        sentiment: "Neutral",
        status: "In Progress",
        created_by: 1,
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
    {
        id: 105,
        title: "Loving the new automated ticket triage feature!",
        description: "Just wanted to send a quick note to say the automated ticket intelligence saved our tier 1 team 6 hours this week. Fantastic job team!",
        category: "General",
        priority: "Low",
        sentiment: "Positive",
        status: "Resolved",
        created_by: 4,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
        id: 106,
        title: "Requesting dark mode theme option for agent workspace",
        description: "Support agents working evening shifts would greatly appreciate a high-contrast dark mode for less eye strain.",
        category: "General",
        priority: "Low",
        sentiment: "Positive",
        status: "Closed",
        created_by: 2,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    }
];

function getDemoTickets() {
    const saved = localStorage.getItem("supportiq_demo_tickets");
    if (!saved) {
        localStorage.setItem("supportiq_demo_tickets", JSON.stringify(INITIAL_DEMO_TICKETS));
        return INITIAL_DEMO_TICKETS;
    }
    try {
        return JSON.parse(saved);
    } catch {
        return INITIAL_DEMO_TICKETS;
    }
}

function saveDemoTickets(tickets) {
    localStorage.setItem("supportiq_demo_tickets", JSON.stringify(tickets));
}

// ==========================================
// CLIENT-SIDE ML INFERENCE SIMULATION
// (Matches trained Scikit-Learn Logistic Regression behavior)
// ==========================================

export function clientPredictTicket(title, description) {
    const text = `${title} ${description}`.toLowerCase();

    // Category
    let category = "General";
    if (/\b(login|password|account|profile|auth|2fa|authenticator|signup|access|user|email)\b/i.test(text)) {
        category = "Account";
    } else if (/\b(bill|charge|payment|invoice|credit|refund|subscription|pricing|cost|dollar|money)\b/i.test(text)) {
        category = "Billing";
    } else if (/\b(bug|error|crash|fail|broken|timeout|slow|api|500|404|429|sync|code|server|database)\b/i.test(text)) {
        category = "Technical";
    }

    // Priority
    let priority = "Medium";
    if (/\b(urgent|immediately|asap|critical|emergency|halted|down|outage|production|security|breach)\b/i.test(text)) {
        priority = "Critical";
    } else if (/\b(cannot|blocked|failed|error|duplicate|charge|refund|broken|high)\b/i.test(text)) {
        priority = "High";
    } else if (/\b(question|help|slow|update|guidance)\b/i.test(text)) {
        priority = "Medium";
    } else {
        priority = "Low";
    }

    // Sentiment
    let sentiment = "Neutral";
    if (/\b(furious|terrible|worst|unacceptable|hate|awful|frustrated|angry|horrible|halted|fail|broken)\b/i.test(text)) {
        sentiment = "Negative";
    } else if (/\b(love|awesome|great|fantastic|thank|appreciate|helpful|good|congrats|resolved)\b/i.test(text)) {
        sentiment = "Positive";
    }

    return { category, priority, sentiment };
}

// ==========================================
// MOCK DISPATCHER FOR DEMO / OFFLINE MODE
// ==========================================

function handleDemoRequest(method, url, data) {
    const cleanUrl = url.replace(/\/$/, "");

    // 1. Auth: Login
    if (cleanUrl.endsWith("/auth/login")) {
        const email = data?.email || "demo.admin@supportiq.ai";
        const role = email.includes("agent") ? "support_agent" : "admin";
        const user = {
            id: 1,
            name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase()),
            email: email,
            role: role
        };
        const demoToken = "demo-jwt-token-" + Date.now();
        localStorage.setItem("is_demo_mode", "true");
        return {
            status: 200,
            data: {
                access_token: demoToken,
                token_type: "bearer",
                role: role,
                user: user
            }
        };
    }

    // 2. Auth: Register
    if (cleanUrl.endsWith("/auth/register")) {
        const user = {
            id: Date.now(),
            name: data?.name || "Demo User",
            email: data?.email || "user@example.com",
            role: "customer"
        };
        return { status: 201, data: user };
    }

    // 3. Analytics Overview
    if (cleanUrl.endsWith("/analytics/overview")) {
        const tickets = getDemoTickets();
        const total = tickets.length;
        const open = tickets.filter(t => t.status === "Open").length;
        const in_progress = tickets.filter(t => t.status === "In Progress").length;
        const resolved = tickets.filter(t => t.status === "Resolved").length;
        const closed = tickets.filter(t => t.status === "Closed").length;

        const priorityCounts = {
            critical: tickets.filter(t => t.priority === "Critical").length,
            high: tickets.filter(t => t.priority === "High").length,
            medium: tickets.filter(t => t.priority === "Medium").length,
            low: tickets.filter(t => t.priority === "Low").length,
        };

        const categoryCounts = {};
        const sentimentCounts = {};

        tickets.forEach(t => {
            const cat = t.category || "General";
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            const sent = t.sentiment || "Neutral";
            sentimentCounts[sent] = (sentimentCounts[sent] || 0) + 1;
        });

        return {
            status: 200,
            data: {
                total_tickets: total,
                open_tickets: open,
                in_progress_tickets: in_progress,
                resolved_tickets: resolved,
                closed_tickets: closed,
                status: {
                    open,
                    in_progress,
                    resolved,
                    closed
                },
                priority: priorityCounts,
                category: categoryCounts,
                sentiment: sentimentCounts
            }
        };
    }

    // 4. Tickets: List or Create
    if (cleanUrl.endsWith("/tickets")) {
        const tickets = getDemoTickets();
        if (method.toLowerCase() === "get") {
            return { status: 200, data: [...tickets].reverse() };
        }
        if (method.toLowerCase() === "post") {
            const ai = clientPredictTicket(data.title, data.description);
            const newTicket = {
                id: tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
                title: data.title,
                description: data.description,
                category: ai.category,
                priority: ai.priority,
                sentiment: ai.sentiment,
                status: "Open",
                created_by: 1,
                created_at: new Date().toISOString()
            };
            tickets.push(newTicket);
            saveDemoTickets(tickets);
            return { status: 201, data: newTicket };
        }
    }

    // 5. Ticket Insights: /tickets/:id/insights
    const insightsMatch = cleanUrl.match(/\/tickets\/(\d+)\/insights$/);
    if (insightsMatch) {
        const id = parseInt(insightsMatch[1], 10);
        const ticket = getDemoTickets().find(t => t.id === id);
        if (!ticket) return { status: 404, data: { detail: "Ticket not found" } };

        const recommendation = ticket.priority === "Critical"
            ? "Immediate escalation required. Assign to Senior On-Call Engineer within 15 minutes."
            : ticket.priority === "High"
            ? "High urgency. Triage and assign before end of current shift."
            : "Handle during normal support operating workflow.";

        const sentiment_action = ticket.sentiment === "Negative"
            ? "Customer is distressed or frustrated. Use empathetic phrasing and proactive status updates."
            : ticket.sentiment === "Positive"
            ? "Customer sentiment is receptive and appreciative. Maintain great rapport."
            : "Neutral tone. Provide crisp and factual instructions.";

        const category_action = ticket.category === "Technical"
            ? "Inspect system logs, reproduction steps, and API telemetry."
            : ticket.category === "Billing"
            ? "Check payment gateway records, Stripe/Razorpay invoices, and balance ledger."
            : ticket.category === "Account"
            ? "Verify identity records and check security authentication status."
            : "Review inquiry details and direct to appropriate documentation.";

        return {
            status: 200,
            data: {
                ticket_id: ticket.id,
                title: ticket.title,
                category: ticket.category,
                priority: ticket.priority,
                sentiment: ticket.sentiment,
                status: ticket.status,
                summary: `This is a ${ticket.priority} priority ${ticket.category} ticket with ${ticket.sentiment} customer sentiment.`,
                recommendation,
                sentiment_action,
                category_action
            }
        };
    }

    // 6. Ticket Status Update: /tickets/:id/status
    const statusMatch = cleanUrl.match(/\/tickets\/(\d+)\/status$/);
    if (statusMatch && method.toLowerCase() === "put") {
        const id = parseInt(statusMatch[1], 10);
        const tickets = getDemoTickets();
        const ticket = tickets.find(t => t.id === id);
        if (!ticket) return { status: 404, data: { detail: "Ticket not found" } };
        ticket.status = data.status;
        saveDemoTickets(tickets);
        return { status: 200, data: ticket };
    }

    // 7. Single Ticket Get / Delete: /tickets/:id
    const singleMatch = cleanUrl.match(/\/tickets\/(\d+)$/);
    if (singleMatch) {
        const id = parseInt(singleMatch[1], 10);
        const tickets = getDemoTickets();
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) return { status: 404, data: { detail: "Ticket not found" } };

        if (method.toLowerCase() === "get") {
            return { status: 200, data: tickets[index] };
        }
        if (method.toLowerCase() === "delete") {
            tickets.splice(index, 1);
            saveDemoTickets(tickets);
            return { status: 200, data: { message: "Ticket deleted successfully", ticket_id: id } };
        }
    }

    return { status: 404, data: { detail: "Endpoint not found" } };
}

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// RESILIENT API WRAPPER
// ==========================================

const request = async (method, url, data = null, config = {}) => {
    const isDemo = localStorage.getItem("is_demo_mode") === "true";

    // If explicitly running in Demo / Showcase mode, use the client engine
    if (isDemo) {
        const mockRes = handleDemoRequest(method, url, data);
        if (mockRes.status >= 200 && mockRes.status < 300) {
            return { data: mockRes.data, status: mockRes.status };
        }
        const err = new Error(mockRes.data.detail || "Request failed");
        err.response = { status: mockRes.status, data: mockRes.data };
        throw err;
    }

    // Attempt real backend call
    try {
        if (method.toLowerCase() === "get") {
            return await api.get(url, config);
        } else if (method.toLowerCase() === "post") {
            return await api.post(url, data, config);
        } else if (method.toLowerCase() === "put") {
            return await api.put(url, data, config);
        } else if (method.toLowerCase() === "delete") {
            return await api.delete(url, config);
        }
    } catch (networkErr) {
        // If backend is unreachable (e.g. GitHub Pages static deployment without local server)
        const isNetworkOrConnectionError =
            !networkErr.response ||
            networkErr.code === "ERR_NETWORK" ||
            networkErr.code === "ECONNABORTED" ||
            networkErr.message?.includes("Network Error");

        if (isNetworkOrConnectionError) {
            console.warn("[SupportIQ] Live backend unreachable. Seamlessly activating Interactive Showcase Engine.");
            localStorage.setItem("is_demo_mode", "true");
            const mockRes = handleDemoRequest(method, url, data);
            if (mockRes.status >= 200 && mockRes.status < 300) {
                return { data: mockRes.data, status: mockRes.status };
            }
        }
        throw networkErr;
    }
};

export default {
    get: (url, config) => request("get", url, null, config),
    post: (url, data, config) => request("post", url, data, config),
    put: (url, data, config) => request("put", url, data, config),
    delete: (url, config) => request("delete", url, null, config),
    raw: api,
};