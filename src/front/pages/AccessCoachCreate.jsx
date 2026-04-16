import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AccessCoachCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [status] = useState("pending");

    useEffect(() => {
        if (!store.coachToken) {
            navigate("/");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${store.coachToken}` }
        })
            .then(res => res.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
            headers: { Authorization: `Bearer ${store.coachToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) dispatch({ type: "set_access_coach", payload: data });
            });

    }, [store.coachToken, dispatch, navigate]);

    const filteredClients = store.clients?.filter(c =>
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) return;

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.coachToken}`
                },
                body: JSON.stringify({
                    client_id: selectedClient.id,
                    status: status
                })
            });

            const data = await resp.json();
            if (resp.ok) {
                dispatch({ type: "add_access_coach", payload: data });
                setSearchTerm("");
                setSelectedClient(null);
            }
        } catch (error) {
            console.error("Error creating access coach:", error);
        }
    };

    const statusBadge = (status) => {
        const map = {
            pending:  { bg: "#fff9c4", color: "#b45309" },
            approved: { bg: "#d1fae5", color: "#065f46" },
            rejected: { bg: "#fee2e2", color: "#991b1b" },
        };
        const s = map[status] || map.pending;
        return (
            <span
                style={{
                    backgroundColor: s.bg, color: s.color,
                    padding: "2px 10px", borderRadius: "20px",
                    fontSize: "0.75rem", fontWeight: 500,
                }}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px", marginBottom:"80px" }}>
            <div className="mb-4 mt-5">
                <h2 className="fw-500 mb-0">Request Access</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>Find and connect with your clients</p>
            </div>

            <div className="forum-card p-4 mb-4" style={{ background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 position-relative">
                        <label className="form-label small fw-500 text-muted mb-2">Client Email</label>
                        <input
                            type="text"
                            className="form-control rounded-pill border-light"
                            style={{ padding: "10px 20px", background: "#f8fafc", fontSize: "0.95rem" }}
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (selectedClient) setSelectedClient(null);
                            }}
                        />

                        {searchTerm && !selectedClient && (
                            <ul className="list-group position-absolute w-100 shadow mt-2" style={{ zIndex: 1000, maxHeight: "160px", overflowY: "auto", borderRadius: "12px" }}>
                                {filteredClients?.map(c => (
                                    <li
                                        key={c.id}
                                        className="list-group-item list-group-item-action border-0 py-2 px-3"
                                        onClick={() => {
                                            setSelectedClient(c);
                                            setSearchTerm(c.email);
                                        }}
                                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                                    >
                                        {c.email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button 
                        className="btn btn-custom w-100 rounded-pill py-2 fw-500 mt-2" 
                        disabled={!selectedClient}
                        style={{ border: "none" }}
                    >
                        Send Request
                    </button>
                </form>
            </div>

            <div className="mt-4">
                <h4 className="fw-500 h6 mb-3 text-muted">Recent requests</h4>
                <div className="d-flex flex-column gap-2">
                    {store.access_coach?.length > 0 ? (
                        store.access_coach.map(item => (
                            <div 
                                key={item.id} 
                                className="forum-card p-3 d-flex justify-content-between align-items-center"
                                style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f1f5f9" }}
                            >
                                <span className="fw-500 text-muted" style={{ fontSize: "0.9rem" }}>
                                    {item.client_email}
                                </span>
                                <div>{statusBadge(item.status)}</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center small py-3">No activity yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};     