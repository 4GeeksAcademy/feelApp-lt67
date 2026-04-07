import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const AccessCoachCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [clientId, setClientId] = useState("");
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

    }, [store.coachToken, dispatch, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.coachToken}` 
                },
                body: JSON.stringify({
                    client_id: parseInt(clientId),
                    status: status
                })
            });

            const data = await resp.json();

            if (resp.ok) {
                dispatch({ type: "add_access_coach", payload: data });
                navigate("/access-coach");
            }
        } catch (error) {
            console.error("Error creating access coach:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mt-5">Create Access Coach</h2>

            <form onSubmit={handleSubmit}>

                <select
                    className="form-control mb-2"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                >
                    <option value="">Select Client</option>
                    {store.clients?.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.email || c.name || `Client ${c.id}`}
                        </option>
                    ))}
                </select>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input 
                        className="form-control" 
                        value={status} 
                        disabled 
                    />
                </div>

                <button className="btn btn-primary me-2">
                    Create
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/access-coach")}
                >
                    Back
                </button>

            </form>
        </div>
    );
};