import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AccessCoachList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.coachToken && !store.admintToken) {
            navigate("/");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
            headers: { Authorization: `Bearer ${store.coachToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    dispatch({ type: "set_access_coach", payload: data });
                }
            });
    }, [store.coachToken, store.admintToken, dispatch, navigate]);

    const approvedClients = store.access_coach?.filter(item =>
        item.status.toLowerCase() === "approved"
    ) || [];

    return (
        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px", marginBottom: "50px" }}>
            <div className="mb-4 mt-5">
                <h2 className="fw-500 mb-0" style={{ color: "#1e293b" }}>My Clients</h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Manage access to your clients' progress and statistics
                </p>
            </div>

            <div className="d-flex flex-column gap-3">
                {approvedClients.length > 0 ? (
                    approvedClients.map(item => (
                        <div 
                            key={item.id} 
                            className="forum-card p-4 d-flex justify-content-between align-items-center"
                            style={{
                                background: "#fff",
                                borderRadius: "20px",
                                border: "1px solid #f1f5f9",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                            }}
                        >
                            <div>
                                <p className="mb-1 fw-bold" style={{ color: "#334155", fontSize: "1rem" }}>
                                    {item.client_email}
                                </p>
                                <span 
                                    style={{
                                        backgroundColor: "#d1fae5", 
                                        color: "#065f46",
                                        padding: "3px 12px", 
                                        borderRadius: "20px",
                                        fontSize: "0.7rem", 
                                        fontWeight: 700,
                                    }}
                                >
                                    {item.status}
                                </span>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm rounded-pill px-4"
                                    style={{ 
                                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                        border: "1px solid #e2e8f0",
                                        color: "#475569",
                                        fontWeight: "600",
                                        fontSize: "0.85rem"
                                    }}
                                    onClick={() => navigate(`/entries/friend/${item.client_id}`)}
                                >
                                    Entries
                                </button>
                                <button
                                    className="btn btn-custom btn-sm rounded-pill px-4"
                                    onClick={() => navigate(`/stats/${item.client_id}`)}
                                >
                                    Stats
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted italic">No approved clients found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};