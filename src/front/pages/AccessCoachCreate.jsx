import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AccessCoachCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [status] = useState("pending");
    const [error, setError] = useState(null);

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

    const handleSearch = (e) => {
        e.preventDefault();
        setError(null);
        
        const client = store.clients?.find(c => 
            c.email.toLowerCase() === searchTerm.toLowerCase().trim()
        );

        if (client) {
            setSelectedClient(client);
        } else {
            setSelectedClient(null);
            setError("Client not found. Check the email and try again.");
        }
    };

    const handleSendRequest = async () => {
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
            <span style={{ backgroundColor: s.bg, color: s.color, padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 500 }}>
                {status}
            </span>
        );
    };

    return (
        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px" }}>
            <div className="mb-4 mt-5">
                <h2 className="fw-500 mb-0">Request Access</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>Find and connect with your clients</p>
            </div>

            <div className="forum-card p-4 mb-4" style={{ background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                <form onSubmit={!selectedClient ? handleSearch : (e) => e.preventDefault()}>
                    <div className="mb-3">
                        <label className="form-label small fw-500 text-muted mb-2">Client Email</label>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control rounded-pill border-light"
                                style={{ padding: "10px 20px", background: "#f8fafc", fontSize: "0.95rem" }}
                                placeholder="example@email.com"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (selectedClient) setSelectedClient(null);
                                    if (error) setError(null);
                                }}
                            />
                            {!selectedClient && (
                                <button className="btn btn-custom rounded-pill px-4 fw-500" type="submit">
                                    Search
                                </button>
                            )}
                        </div>
                    </div>

                    {error && <p className="text-danger small ms-2">{error}</p>}

                    {selectedClient && (
                        <div className="p-3 mb-3 rounded-3 bg-light border-0 d-flex justify-content-between align-items-center">
                            <div>
                                <small className="d-block text-muted fw-500" style={{fontSize:"0.7rem"}}>CLIENT FOUND</small>
                                <span className="fw-500">{selectedClient.email}</span>
                            </div>
                            <button 
                                type="button"
                                className="btn btn-custom rounded-pill px-4 fw-500" 
                                style={{ border: "none" }}
                                onClick={handleSendRequest}
                            >
                                Send Request
                            </button>
                        </div>
                    )}
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